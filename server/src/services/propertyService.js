const propertyRepository = require('../repositories/propertyRepository');
const buildingRepository = require('../repositories/buildingRepository');
const AppError = require('../utils/AppError');

const list = async (companyId, query) => {
  const { search, status, page = 1, limit = 20 } = query;
  const filters = { search, status, page: Number(page), limit: Number(limit) };

  const [data, total] = await Promise.all([
    propertyRepository.findAll(companyId, filters),
    propertyRepository.countAll(companyId, filters),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

const getById = async (id, companyId) => {
  const property = await propertyRepository.findById(id);
  if (!property || property.company_id !== Number(companyId)) {
    throw new AppError('Property not found', 404);
  }
  return property;
};

const create = async (data, companyId) => {
  return propertyRepository.create({ ...data, company_id: companyId });
};

const update = async (id, data, companyId) => {
  const property = await getById(id, companyId);
  return propertyRepository.update(id, data);
};

const remove = async (id, companyId) => {
  await getById(id, companyId);
  await propertyRepository.remove(id);
};

module.exports = { list, getById, create, update, remove };
