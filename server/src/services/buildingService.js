const propertyRepository = require('../repositories/propertyRepository');
const buildingRepository = require('../repositories/buildingRepository');
const AppError = require('../utils/AppError');

const list = async (propertyId, companyId) => {
  const property = await propertyRepository.findById(propertyId);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Property not found', 404);
  }
  return buildingRepository.findAll(propertyId);
};

const getById = async (id, companyId) => {
  const building = await buildingRepository.findById(id);
  if (!building) throw new AppError('Building not found', 404);

  const property = await propertyRepository.findById(building.property_id);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Building not found', 404);
  }

  return building;
};

const create = async (data, companyId) => {
  const property = await propertyRepository.findById(data.property_id);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Property not found', 404);
  }
  return buildingRepository.create(data);
};

const update = async (id, data, companyId) => {
  await getById(id, companyId);
  return buildingRepository.update(id, data);
};

const remove = async (id, companyId) => {
  await getById(id, companyId);
  await buildingRepository.remove(id);
};

module.exports = { list, getById, create, update, remove };
