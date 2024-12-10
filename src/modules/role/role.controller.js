const { Role } = require("../../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const role = {};

role.index = async (req, res, next) => {
	try {
		const role = await Role.findAndCountAll();

		let size = Number(req.query.size) || 10;
		let offset = 0;
		let search = req.query.search;

		let page = Number(req.query.page) || 1;
		let pages = Math.ceil(role.count / size);
		offset = size * (page - 1);

		let whereSearch;
		if (search) {
			whereSearch = {
				[Op.or]: [
					Sequelize.where(Sequelize.fn("lower", Sequelize.col("Role.name")), {
						[Op.like]: `%${search.trim().toLowerCase()}%`,
					}),
				],
			};
		}

		const roleQuery = await Role.findAll({
			include: [],
			attributes: { include: [], exclude: [] },
			limit: size,
			offset: offset,
			order: [["id", "DESC"]],
			where: whereSearch,
		});

		return res.status(200).json({
			current_page: Number(page),
			per_page: Number(size),
			total: Number(role.count),
			from: roleQuery.length > 0 ? Number(offset + 1) : null,
			to: roleQuery.length > 0 ? Number(offset + roleQuery.length) : null,
			last_page: Number(pages),
			search: search || "",
			result: roleQuery,
		});
	} catch (err) {
		next(err);
	}
};

role.show = async (req, res, next) => {
	try {
		const roleData = await Role.findOne({ where: { id: req.params.id } });

		return res.json({ role: roleData });
	} catch (err) {
		next(err);
	}
};

module.exports = role;
