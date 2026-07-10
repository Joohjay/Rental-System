const pool = require('../config/db');

const findAllByCompany = async (companyId, filters = {}) => {
  let sql = `
    SELECT id, name, email, phone, role, is_active, profile_photo_url, created_at, updated_at
    FROM users
    WHERE company_id = ? AND deleted_at IS NULL
  `;
  const params = [companyId];

  if (filters.roles && filters.roles.length > 0) {
    sql += ` AND role IN (${filters.roles.map(() => '?').join(',')})`;
    params.push(...filters.roles);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.role) {
    sql += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters.is_active !== undefined && filters.is_active !== '') {
    sql += ' AND is_active = ?';
    params.push(Number(filters.is_active));
  }

  sql += ' ORDER BY created_at DESC';

  if (filters.page && filters.limit) {
    const offset = (filters.page - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(filters.limit), offset);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countAllByCompany = async (companyId, filters = {}) => {
  let sql = 'SELECT COUNT(*) AS total FROM users WHERE company_id = ? AND deleted_at IS NULL';
  const params = [companyId];

  if (filters.roles && filters.roles.length > 0) {
    sql += ` AND role IN (${filters.roles.map(() => '?').join(',')})`;
    params.push(...filters.roles);
  }

  if (filters.search) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.role) {
    sql += ' AND role = ?';
    params.push(filters.role);
  }

  if (filters.is_active !== undefined && filters.is_active !== '') {
    sql += ' AND is_active = ?';
    params.push(Number(filters.is_active));
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, role, is_active, company_id, profile_photo_url, national_id, preferred_city, tin, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO users (company_id, name, email, phone, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.company_id, data.name, data.email, data.phone || null, data.password_hash, data.role, data.is_active !== undefined ? data.is_active : 1]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowed = ['name', 'email', 'phone', 'role', 'is_active', 'password_hash'];

  for (const field of allowed) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
};

module.exports = { findAllByCompany, countAllByCompany, findById, create, update, remove };
