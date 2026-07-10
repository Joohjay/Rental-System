const pool = require('../config/db');

const findAll = async (propertyId) => {
  const [rows] = await pool.query(
    'SELECT * FROM buildings WHERE property_id = ? AND deleted_at IS NULL ORDER BY name ASC',
    [propertyId]
  );
  return rows;
};

const findAllByCompany = async (companyId, filters = {}) => {
  let sql = `
    SELECT b.*, p.name AS property_name,
      (SELECT COUNT(*) FROM units u WHERE u.building_id = b.id AND u.deleted_at IS NULL) AS units_count
    FROM buildings b
    JOIN properties p ON b.property_id = p.id
    WHERE p.company_id = ? AND b.deleted_at IS NULL AND p.deleted_at IS NULL
  `;
  const params = [companyId];

  if (filters.search) {
    sql += ' AND b.name LIKE ?';
    params.push(`%${filters.search}%`);
  }

  if (filters.property_id) {
    sql += ' AND b.property_id = ?';
    params.push(filters.property_id);
  }

  sql += ' ORDER BY b.name ASC';

  if (filters.page && filters.limit) {
    const offset = (filters.page - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(filters.limit), offset);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countAllByCompany = async (companyId, filters = {}) => {
  let sql = `
    SELECT COUNT(*) AS total
    FROM buildings b
    JOIN properties p ON b.property_id = p.id
    WHERE p.company_id = ? AND b.deleted_at IS NULL AND p.deleted_at IS NULL
  `;
  const params = [companyId];

  if (filters.property_id) {
    sql += ' AND b.property_id = ?';
    params.push(filters.property_id);
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM buildings WHERE id = ? AND deleted_at IS NULL', [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO buildings (property_id, name, description, floors, image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.property_id,
      data.name,
      data.description || null,
      data.floors || 1,
      data.image_url || null,
    ]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowed = ['name', 'description', 'floors', 'image_url'];

  for (const field of allowed) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(`UPDATE buildings SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  await pool.query('UPDATE buildings SET deleted_at = NOW() WHERE id = ?', [id]);
};

module.exports = { findAll, findAllByCompany, countAllByCompany, findById, create, update, remove };
