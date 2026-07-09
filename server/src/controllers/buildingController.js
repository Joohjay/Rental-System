const buildingService = require('../services/buildingService');

const list = async (req, res, next) => {
  try {
    const buildings = await buildingService.list(req.params.propertyId, req.user.company_id);
    res.json({ success: true, data: buildings });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const building = await buildingService.getById(req.params.id, req.user.company_id);
    res.json({ success: true, data: building });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const building = await buildingService.create({ ...req.body, property_id: req.params.propertyId }, req.user.company_id);
    res.status(201).json({ success: true, message: 'Building created', data: building });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const building = await buildingService.update(req.params.id, req.body, req.user.company_id);
    res.json({ success: true, message: 'Building updated', data: building });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await buildingService.remove(req.params.id, req.user.company_id);
    res.json({ success: true, message: 'Building deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
