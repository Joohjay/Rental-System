const pool = require('../config/db');

const findAll = async (propertyId) => {
  const [rows] = await pool.query(
    'SELECT * FROM buildings WHERE property_id = ? AND deleted_at IS NULL ORDER BY name ASC',
    [propertyId]
  );
  return rows;
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

module.exports = { findAll, findById, create, update, remove };
