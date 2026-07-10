const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const STAFF_ROLES = ['PROPERTY_MANAGER', 'CARETAKER', 'ACCOUNTANT'];

const listAll = async (companyId, query) => {
  const { search, role, is_active, page = 1, limit = 20 } = query;
  const filters = {
    roles: STAFF_ROLES,
    search,
    role,
    is_active: is_active !== undefined && is_active !== '' ? is_active : undefined,
    page: Number(page),
    limit: Number(limit),
  };

  const [data, total] = await Promise.all([
    userRepository.findAllByCompany(companyId, filters),
    userRepository.countAllByCompany(companyId, filters),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

const getById = async (id, companyId) => {
  const user = await userRepository.findById(id);
  if (!user || user.company_id !== Number(companyId) || !STAFF_ROLES.includes(user.role)) {
    throw new AppError('Staff member not found', 404);
  }
  return user;
};

const create = async (data, companyId) => {
  const [existing] = await (require('../config/db')).query('SELECT id FROM users WHERE email = ?', [data.email]);
  if (existing.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  if (!STAFF_ROLES.includes(data.role)) {
    throw new AppError('Invalid staff role', 400);
  }

  const password_hash = await bcrypt.hash(data.password, 12);

  return userRepository.create({
    company_id: companyId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    password_hash,
    role: data.role,
    is_active: data.is_active !== undefined ? data.is_active : 1,
  });
};

const update = async (id, data, companyId) => {
  const user = await getById(id, companyId);

  if (data.email && data.email !== user.email) {
    const [existing] = await (require('../config/db')).query('SELECT id FROM users WHERE email = ? AND id != ?', [data.email, id]);
    if (existing.length > 0) {
      throw new AppError('Email already in use', 409);
    }
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.role !== undefined) {
    if (!STAFF_ROLES.includes(data.role)) {
      throw new AppError('Invalid staff role', 400);
    }
    updateData.role = data.role;
  }
  if (data.is_active !== undefined) updateData.is_active = data.is_active;
  if (data.password) {
    updateData.password_hash = await bcrypt.hash(data.password, 12);
  }

  return userRepository.update(id, updateData);
};

const remove = async (id, companyId) => {
  await getById(id, companyId);
  await userRepository.remove(id);
};

module.exports = { listAll, getById, create, update, remove };
