const propertyService = require('../services/propertyService');

const list = async (req, res, next) => {
  try {
    const result = await propertyService.list(req.user.company_id, req.query);
    res.json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const property = await propertyService.getById(req.params.id, req.user.company_id);
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const property = await propertyService.create(req.body, req.user.company_id);
    res.status(201).json({ success: true, message: 'Property created', data: property });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const property = await propertyService.update(req.params.id, req.body, req.user.company_id);
    res.json({ success: true, message: 'Property updated', data: property });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await propertyService.remove(req.params.id, req.user.company_id);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
