const staffService = require('../services/staffService');

const listAll = async (req, res, next) => {
  try {
    const result = await staffService.listAll(req.user.company_id, req.query);
    res.json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const staff = await staffService.getById(req.params.id, req.user.company_id);
    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const staff = await staffService.create(req.body, req.user.company_id);
    res.status(201).json({ success: true, message: 'Staff member created', data: staff });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const staff = await staffService.update(req.params.id, req.body, req.user.company_id);
    res.json({ success: true, message: 'Staff member updated', data: staff });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await staffService.remove(req.params.id, req.user.company_id);
    res.json({ success: true, message: 'Staff member removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listAll, getById, create, update, remove };
