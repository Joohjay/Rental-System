const unitService = require('../services/unitService');

const list = async (req, res, next) => {
  try {
    const result = await unitService.list(req.params.buildingId, req.user.company_id, req.query);
    res.json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const unit = await unitService.getById(req.params.id, req.user.company_id);
    res.json({ success: true, data: unit });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const unit = await unitService.create({ ...req.body, building_id: req.params.buildingId || req.body.building_id }, req.user.company_id);
    res.status(201).json({ success: true, message: 'Unit created', data: unit });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const unit = await unitService.update(req.params.id, req.body, req.user.company_id);
    res.json({ success: true, message: 'Unit updated', data: unit });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await unitService.remove(req.params.id, req.user.company_id);
    res.json({ success: true, message: 'Unit deleted' });
  } catch (err) {
    next(err);
  }
};

const listAll = async (req, res, next) => {
  try {
    const result = await unitService.listAll(req.user.company_id, req.query);
    res.json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, listAll, getById, create, update, remove };
