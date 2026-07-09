const companyService = require('../services/companyService');

const list = async (req, res, next) => {
  try {
    const companies = await companyService.list();
    res.json({ success: true, data: companies });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const company = await companyService.getById(req.params.id);
    res.json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const company = await companyService.create(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Company created', data: company });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const company = await companyService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Company updated', data: company });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await companyService.remove(req.params.id);
    res.json({ success: true, message: 'Company deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
