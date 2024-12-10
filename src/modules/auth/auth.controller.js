const { User, Role } = require("../../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customError = require("../../global/customError");
const asyncErrorHandler = require("../../global/asyncErrorHandler");
const sendEmail = require("../../global/mailsetup");
const crypto = require("crypto");
const moment = require("moment");

const auth = {};

/**
 * user register
 */
auth.register = async (req, res, next) => {
	try {
		const role = await Role.findOne({ where: { name: "user" } });

		const data = {
			name: req.body.name,
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, 10),
			confirm_password: req.body.confirm_password,
		};

		data.status = "1";
		data.forget_password = req.body.password;
		data.role_id = role.id;

		delete data["confirm_password"];

		await User.create(data);

		return res.json({ msg: "Successfully registered" });
	} catch (err) {
		next(err);
	}
};

/**
 * user login function
 */
auth.login = async (req, res, next) => {
	try {
		const data = {
			email: req.body.email,
			password: req.body.password,
		};

		if (req.body.email == "" || req.body.password == "") {
			return res.status(400).json({ msg: "Invalid credential" });
		}

		const userdata = await User.findOne({
			include: ["role"],
			where: { email: data.email },
		});

		if (!userdata) {
			return res.status(400).json({ msg: "Invalid credential" });
		}

		const password = await bcrypt.compare(data.password, userdata.password);

		if (!password) {
			return res.status(400).json({ msg: "Invalid credential" });
		}

		if (userdata.status !== "1") {
			return res.status(400).json({ msg: "Invalid credential" });
		}

		const token = jwt.sign(
			{
				id: userdata.id,
				email: userdata.email,
				role: userdata.role.name,
				status: userdata.status,
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: process.env.TOKEN_EXPIRE }
		);

		res.cookie(process.env.COOKIE_NAME, token, {
			httpOnly: true,
			maxAge: process.env.TOKEN_EXPIRE,
		});

		return res.json({
			token: token,
			expiresIn: process.env.TOKEN_EXPIRE / (60 * 60 * 24 * 1000) + " days",
		});
	} catch (err) {
		next(err);
	}
};

/**
 * user logout function
 */
auth.logout = async (req, res, next) => {
	try {
		const token = req.cookies[process.env.COOKIE_NAME];

		if (!token) {
			return res.sendStatus(204);
		}

		res.clearCookie(process.env.COOKIE_NAME);

		return res.status(200).json({ msg: "Logout" });
	} catch (err) {
		next(err);
	}
};

/**
 * user check for authetication
 */
auth.me = async (req, res, next) => {
	try {
		const auth = await User.findOne({
			where: { email: req.email },
			include: [{ model: Role, as: "role" }],
		});

		return res.json({ auth: auth });
	} catch (err) {
		next(err);
	}
};

auth.forgetPassword = async (req, res, next) => {
	// 1. GET USER BASED ON POSTED EMAIL
	const user = await User.findOne({ where: { email: req.body.email } });

	// 2. GENERATE A RANDOM RESET TOKEN
	const resetToken = user.createResetPpasswordToken();
	await user.save();

	// SEND EMAIL
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/resetpassword/${resetToken}`;
	const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password change request received",
			message: message,
		});

		return res.status(200).json({
			status: "success",
			message: "password reset link send to the user email",
		});
	} catch (err) {
		user.password_reset_token = null;
		user.password_reset_token_expires = null;
		user.save();

		next(
			new customError(
				"There was an error sending password reset email. Please try again later.",
				500
			)
		);
	}
};

auth.resetPassword = asyncErrorHandler(async (req, res, next) => {
	// 1. IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN IS NOT EXPIRED
	const token = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	const user = await User.findOne({
		where: {
			password_reset_token: token,
			password_reset_token_expires: {
				[Op.gt]: moment().format("YYYY-MM-DD hh:mm:ss"),
			},
		},
	});
	if (!user) {
		const error = new customError("Token is invalid or has expired!", 400);
		next(error);
	}
	// 2. RESETING THE USER PASSWORD
	user.password = await bcrypt.hash(req.body.password, 10);
	user.password_reset_token = null;
	user.password_reset_token_expires = null;
	user.password_changed_at = Date.now();
	user.forget_password = req.body.password;
	user.save();
	// 3. LOGIN THE USER
	const loginToken = jwt.sign(
		{ id: user.id, email: user.email, role: user.role, status: user.status },
		process.env.TOKEN_SECRET,
		{
			expiresIn: process.env.TOKEN_EXPIRE,
		}
	);
	res.cookie(process.env.COOKIE_NAME, loginToken, {
		httpOnly: true,
		maxAge: process.env.TOKEN_EXPIRE,
	});
	return res.json({
		token: loginToken,
		expiresIn: process.env.TOKEN_EXPIRE / (60 * 60 * 24 * 1000) + " days",
	});
});

module.exports = auth;
