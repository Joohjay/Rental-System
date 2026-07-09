const pool = require('../config/db');

const findAll = async (buildingId, filters = {}) => {
  let sql = 'SELECT * FROM units WHERE building_id = ? AND deleted_at IS NULL';
  const params = [buildingId];

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.unit_type) {
    sql += ' AND unit_type = ?';
    params.push(filters.unit_type);
  }

  if (filters.search) {
    sql += ' AND unit_number LIKE ?';
    params.push(`%${filters.search}%`);
  }

  if (filters.min_rent) {
    sql += ' AND rent_amount >= ?';
    params.push(Number(filters.min_rent));
  }

  if (filters.max_rent) {
    sql += ' AND rent_amount <= ?';
    params.push(Number(filters.max_rent));
  }

  sql += ' ORDER BY floor ASC, unit_number ASC';

  if (filters.page && filters.limit) {
    const offset = (filters.page - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(filters.limit), offset);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countAll = async (buildingId, filters = {}) => {
  let sql = 'SELECT COUNT(*) AS total FROM units WHERE building_id = ? AND deleted_at IS NULL';
  const params = [buildingId];

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM units WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO units (building_id, unit_number, unit_type, floor, rent_amount, deposit_amount, size_sqm, bedrooms, bathrooms, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.building_id,
      data.unit_number,
      data.unit_type || 'studio',
      data.floor || 1,
      data.rent_amount,
      data.deposit_amount || 0,
      data.size_sqm || null,
      data.bedrooms || 1,
      data.bathrooms || 1,
      data.status || 'available',
    ]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowed = ['unit_number', 'unit_type', 'floor', 'rent_amount', 'deposit_amount',
    'size_sqm', 'bedrooms', 'bathrooms', 'status'];

  for (const field of allowed) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(`UPDATE units SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  await pool.query('UPDATE units SET deleted_at = NOW() WHERE id = ?', [id]);
};

module.exports = { findAll, countAll, findById, create, update, remove };
