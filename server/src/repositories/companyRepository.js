const pool = require('../config/db');

const findAll = async (filters = {}) => {
  let sql = 'SELECT * FROM companies WHERE 1=1';
  const params = [];

  if (filters.is_active !== undefined) {
    sql += ' AND is_active = ?';
    params.push(filters.is_active);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    const q = `%${filters.search}%`;
    params.push(q, q);
  }

  const sortBy = filters.sortBy || 'created_at';
  const sortDir = filters.sortDirection === 'asc' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortBy} ${sortDir}`;

  if (filters.page && filters.limit) {
    const offset = (filters.page - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(filters.limit), offset);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countAll = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) AS total FROM companies WHERE 1=1';
  const params = [];

  if (filters.is_active !== undefined) {
    sql += ' AND is_active = ?';
    params.push(filters.is_active);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    const q = `%${filters.search}%`;
    params.push(q, q);
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM companies WHERE id = ?', [id]);
  return rows[0] || null;
};

const findBySlug = async (slug) => {
  const [rows] = await pool.query('SELECT id FROM companies WHERE slug = ?', [slug]);
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO companies (name, slug, currency, timezone, language, receipt_footer, default_rent_due_day, theme, tax_rate, contact_email, contact_phone, address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.slug,
      data.currency || 'TZS',
      data.timezone || 'Africa/Dar_es_Salaam',
      data.language || 'en',
      data.receipt_footer || null,
      data.default_rent_due_day || 5,
      data.theme || 'light',
      data.tax_rate || 0.00,
      data.contact_email || null,
      data.contact_phone || null,
      data.address || null,
    ]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowed = ['name', 'slug', 'logo_url', 'currency', 'timezone', 'language',
    'receipt_footer', 'default_rent_due_day', 'theme', 'tax_rate',
    'contact_email', 'contact_phone', 'address', 'is_active'];

  for (const field of allowed) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(`UPDATE companies SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  await pool.query('UPDATE companies SET is_active = 0 WHERE id = ?', [id]);
};

module.exports = { findAll, countAll, findById, findBySlug, create, update, remove };
