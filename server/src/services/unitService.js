const buildingRepository = require('../repositories/buildingRepository');
const propertyRepository = require('../repositories/propertyRepository');
const unitRepository = require('../repositories/unitRepository');
const AppError = require('../utils/AppError');

const list = async (buildingId, companyId, query) => {
  const building = await buildingRepository.findById(buildingId);
  if (!building) throw new AppError('Building not found', 404);

  const property = await propertyRepository.findById(building.property_id);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Building not found', 404);
  }

  const { status, unit_type, search, min_rent, max_rent, page = 1, limit = 20 } = query;
  const filters = { status, unit_type, search, min_rent, max_rent, page: Number(page), limit: Number(limit) };

  const [data, total] = await Promise.all([
    unitRepository.findAll(buildingId, filters),
    unitRepository.countAll(buildingId, filters),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

const getById = async (id, companyId) => {
  const unit = await unitRepository.findById(id);
  if (!unit) throw new AppError('Unit not found', 404);

  const building = await buildingRepository.findById(unit.building_id);
  if (!building) throw new AppError('Unit not found', 404);

  const property = await propertyRepository.findById(building.property_id);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Unit not found', 404);
  }

  return unit;
};

const create = async (data, companyId) => {
  const building = await buildingRepository.findById(data.building_id);
  if (!building) throw new AppError('Building not found', 404);

  const property = await propertyRepository.findById(building.property_id);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Building not found', 404);
  }

  return unitRepository.create(data);
};

const update = async (id, data, companyId) => {
  await getById(id, companyId);
  return unitRepository.update(id, data);
};

const remove = async (id, companyId) => {
  await getById(id, companyId);
  await unitRepository.remove(id);
};

const listAll = async (companyId, query) => {
  const { status, search, page = 1, limit = 20 } = query;
  const filters = { status, search, page: Number(page), limit: Number(limit) };

  const [data, total] = await Promise.all([
    unitRepository.findAllByCompany(companyId, filters),
    unitRepository.countAllByCompany(companyId, filters),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

module.exports = { list, listAll, getById, create, update, remove };
