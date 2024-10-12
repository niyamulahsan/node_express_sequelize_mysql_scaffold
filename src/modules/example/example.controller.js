const { Example } = require('../../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const example = {};

example.index = async (req, res, next) => {
  try {
    const exam = await Example.findAndCountAll();

    let size = Number(req.query.size) || 10;
    let offset = 0;
    let search = req.query.search;

    let page = Number(req.query.page) || 1;
    let pages = Math.ceil(exam.count / size);
    offset = size * (page - 1);

    let whereSearch;
    if (search) {
      whereSearch = {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('Example.name')), {
            [Op.like]: `%${search.trim().toLowerCase()}%`
          })
        ]
      };
    }

    const exampleQuery = await Example.findAll({
      include: [],
      attributes: { include: [], exclude: [] },
      limit: size,
      offset: offset,
      order: [["id", "DESC"]],
      where: whereSearch
    });

    return res.status(200).json({
      current_page: Number(page),
      per_page: Number(size),
      total: Number(exam.count),
      from: exampleQuery.length > 0 ? Number(offset + 1) : null,
      to: exampleQuery.length > 0 ? Number(offset + exampleQuery.length) : null,
      last_page: Number(pages),
      result: exampleQuery
    });
  } catch (err) {
    next(err);
  }
};

example.store = async (req, res, next) => {
  try {
    const data = { name: req.body.name };
    await Example.create(data);

    return res.json({ "msg": "Example created successfully" });
  } catch (err) {
    next(err);
  }
};

example.show = async (req, res, next) => {
  try {
    const exam = await Example.findOne({ where: { id: req.params.id } });

    return res.json({ "example": exam });
  } catch (err) {
    next(err);
  }
};

example.update = async (req, res, next) => {
  try {
    const data = { name: req.body.name };
    await Example.update(data, { where: { id: req.params.id } });

    return res.json({ "msg": "Example updated successfully" });
  } catch (err) {
    next(err);
  }
};

example.delete = async (req, res, next) => {
  try {
    const idsToDelete = req.params.id.split(",");
    await Example.destroy({ where: { id: { [Op.in]: idsToDelete } } });
    return res.json({ "msg": "Example deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = example;