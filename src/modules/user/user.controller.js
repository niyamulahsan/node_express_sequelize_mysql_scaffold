const { User, Role } = require("../../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");

const user = {};

user.index = async (req, res, next) => {
	try {
		const users = await User.findAndCountAll();

		let size = Number(req.query.size) || 10;
		let offset = 0;
		let search = req.query.search;

		let page = Number(req.query.page) || 1;
		let pages = Math.ceil(users.count / size);
		offset = size * (page - 1);

		let whereSearch;
		whereSearch = {
			[Op.and]: [
				Sequelize.where(Sequelize.fn("lower", Sequelize.col("Role.name")), {
					[Op.notIn]: ["admin"],
				}),
			],
		};

		if (search) {
			whereSearch = {
				[Op.and]: [
					Sequelize.where(Sequelize.fn("lower", Sequelize.col("Role.name")), {
						[Op.notIn]: ["admin"],
					}),
				],
				[Op.or]: [
					Sequelize.where(Sequelize.fn("lower", Sequelize.col("User.name")), {
						[Op.like]: `%${search.trim().toLowerCase()}%`,
					}),
					Sequelize.where(Sequelize.fn("lower", Sequelize.col("User.email")), {
						[Op.like]: `%${search.trim().toLowerCase()}%`,
					}),
				],
			};
		}

		const usersQuery = await User.findAll({
			include: [{ model: Role, as: "role" }],
			attributes: { include: [], exclude: [] },
			limit: size,
			offset: offset,
			order: [["id", "DESC"]],
			where: whereSearch,
		});

		return res.status(200).json({
			current_page: Number(page),
			per_page: Number(size),
			total: Number(users.count),
			from: usersQuery.length > 0 ? Number(offset + 1) : null,
			to: usersQuery.length > 0 ? Number(offset + usersQuery.length) : null,
			last_page: Number(pages),
			search: search || "",
			result: usersQuery,
		});
	} catch (err) {
		next(err);
	}
};

user.store = async (req, res, next) => {
	try {
		const data = {
			name: req.body.name,
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, 10),
			confirm_password: req.body.confirm_password,
			role_id: req.body.role_id,
		};

		data.forget_password = req.body.password;
		data.status = "1";

		delete data["confirm_password"];

		await User.create(data);

		return res.json({ msg: "User created successfully" });
	} catch (err) {
		next(err);
	}
};

user.show = async (req, res, next) => {
	try {
		const user = await User.findOne({ where: { id: req.params.id } });

		return res.json({ user: user });
	} catch (err) {
		next(err);
	}
};

user.update = async (req, res, next) => {
	try {
		const data = {
			name: req.body.name,
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, 10),
			confirm_password: req.body.confirm_password,
			role_id: req.body.role_id,
		};

		// check who is logged in
		const auth = await User.findOne({
			where: { email: req.email },
			include: [{ model: Role, as: "role" }],
		});

		if (req.body.password == "" || req.body.password == null) {
			delete data["password"];
			delete data["forget_password"];
		} else {
			if (["user"].includes(auth.role.name)) {
				delete data["role_id"];
			}
			delete data["email"];
			delete data["confirm_password"];
			data.forget_password = req.body.password;
		}

		await User.update(data, { where: { id: req.params.id } });

		return res.json({ msg: "User updated successfully" });
	} catch (err) {
		next(err);
	}
};

user.delete = async (req, res, next) => {
	try {
		const idsToDelete = req.params.id.split(",");
		const roleCheck = await User.findAll({
			include: [{ model: Role, as: "role" }],
			where: { id: { [Op.in]: idsToDelete } },
		});

		let rolearr = [];
		roleCheck.map(async (role) => {
			if (["user"].includes(role.role.name)) {
				rolearr.push(role.id);
			}
		});

		await User.destroy({ where: { id: { [Op.in]: rolearr } } });

		return res.json({ msg: "User deleted successfully" });
	} catch (err) {
		next(err);
	}
};

user.status = async (req, res, next) => {
	try {
		await User.update(
			{ status: req.body.status },
			{ where: { id: req.params.id } }
		);

		return res.json({ msg: "Status updated" });
	} catch (err) {
		next(err);
	}
};

module.exports = user;
