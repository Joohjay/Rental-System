const companyRepository = require('../repositories/companyRepository');
const pool = require('../config/db');
const AppError = require('../utils/AppError');

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const list = async (query = {}) => {
  const { search, sortBy, sortDirection, page = 1, limit = 20 } = query;
  const filters = { search, sortBy, sortDirection, page: Number(page), limit: Number(limit) };

  const [data, total] = await Promise.all([
    companyRepository.findAll(filters),
    companyRepository.countAll(filters),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

const getById = async (id) => {
  const company = await companyRepository.findById(id);
  if (!company) throw new AppError('Company not found', 404);
  return company;
};

const create = async (data, userId) => {
  const slug = data.slug || slugify(data.name);

  const existing = await companyRepository.findBySlug(slug);
  if (existing) throw new AppError('A company with this slug already exists', 409);

  data.slug = slug;
  const company = await companyRepository.create(data);

  // Assign creator as SUPER_ADMIN of this company
  await pool.query('UPDATE users SET company_id = ? WHERE id = ?', [company.id, userId]);

  return company;
};

const update = async (id, data) => {
  const company = await companyRepository.findById(id);
  if (!company) throw new AppError('Company not found', 404);

  if (data.slug && data.slug !== company.slug) {
    const conflict = await companyRepository.findBySlug(data.slug);
    if (conflict) throw new AppError('Slug already taken', 409);
  }

  return companyRepository.update(id, data);
};

const remove = async (id) => {
  const company = await companyRepository.findById(id);
  if (!company) throw new AppError('Company not found', 404);
  await companyRepository.remove(id);
};

module.exports = { list, getById, create, update, remove };
