const pool = require('../config/db');

const findAll = async (companyId, filters = {}) => {
  let sql = 'SELECT * FROM properties WHERE company_id = ? AND deleted_at IS NULL';
  const params = [companyId];

  if (filters.search) {
    sql += ' AND (name LIKE ? OR city LIKE ? OR region LIKE ?)';
    const q = `%${filters.search}%`;
    params.push(q, q, q);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  sql += ' ORDER BY name ASC';

  if (filters.page && filters.limit) {
    const offset = (filters.page - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(filters.limit), offset);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countAll = async (companyId, filters = {}) => {
  let sql = 'SELECT COUNT(*) AS total FROM properties WHERE company_id = ? AND deleted_at IS NULL';
  const params = [companyId];

  if (filters.search) {
    sql += ' AND (name LIKE ? OR city LIKE ? OR region LIKE ?)';
    const q = `%${filters.search}%`;
    params.push(q, q, q);
  }

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM properties WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO properties (company_id, name, description, address, city, region, country, latitude, longitude, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.company_id,
      data.name,
      data.description || null,
      data.address || null,
      data.city || null,
      data.region || null,
      data.country || 'Tanzania',
      data.latitude || null,
      data.longitude || null,
      data.image_url || null,
      data.status || 'active',
    ]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowed = ['name', 'description', 'address', 'city', 'region', 'country',
    'latitude', 'longitude', 'image_url', 'status'];

  for (const field of allowed) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(`UPDATE properties SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  await pool.query('UPDATE properties SET deleted_at = NOW() WHERE id = ?', [id]);
};

module.exports = { findAll, countAll, findById, create, update, remove };
