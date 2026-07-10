const pool = require('../config/db');
const AppError = require('../utils/AppError');

const listProperties = async (query) => {
  const { search, city, property_type, min_price, max_price, bedrooms, bathrooms, featured, page = 1, limit = 12 } = query;

  let sql = `
    SELECT p.*, c.name AS company_name,
      (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image,
      (SELECT COUNT(*) FROM units u WHERE u.building_id IN (SELECT id FROM buildings WHERE property_id = p.id) AND u.deleted_at IS NULL AND u.status = 'available') AS available_units,
      COALESCE((SELECT AVG(rating) FROM reviews WHERE property_id = p.id), 0) AS avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE property_id = p.id) AS review_count
    FROM properties p
    LEFT JOIN companies c ON p.company_id = c.id
    WHERE p.deleted_at IS NULL AND p.status = 'active'
  `;
  const params = [];

  if (search) {
    sql += ' AND (p.name LIKE ? OR p.city LIKE ? OR p.region LIKE ? OR p.description LIKE ?)';
    const q = `%${search}%`;
    params.push(q, q, q, q);
  }
  if (city) { sql += ' AND p.city LIKE ?'; params.push(`%${city}%`); }
  if (property_type) { sql += ' AND p.property_type = ?'; params.push(property_type); }
  if (min_price) { sql += ' AND p.id IN (SELECT DISTINCT b.property_id FROM buildings b JOIN units u ON u.building_id = b.id WHERE u.rent_amount >= ? AND u.deleted_at IS NULL)'; params.push(Number(min_price)); }
  if (max_price) { sql += ' AND p.id IN (SELECT DISTINCT b.property_id FROM buildings b JOIN units u ON u.building_id = b.id WHERE u.rent_amount <= ? AND u.deleted_at IS NULL)'; params.push(Number(max_price)); }
  if (bedrooms) { sql += ' AND p.id IN (SELECT DISTINCT b.property_id FROM buildings b JOIN units u ON u.building_id = b.id WHERE u.bedrooms >= ? AND u.deleted_at IS NULL)'; params.push(Number(bedrooms)); }
  if (bathrooms) { sql += ' AND p.id IN (SELECT DISTINCT b.property_id FROM buildings b JOIN units u ON u.building_id = b.id WHERE u.bathrooms >= ? AND u.deleted_at IS NULL)'; params.push(Number(bathrooms)); }
  if (featured) { sql += ' AND p.featured = 1'; }

  sql += ' ORDER BY p.featured DESC, p.created_at DESC';

  const countSql = sql.replace(/SELECT p\.\*.*?FROM/, 'SELECT COUNT(*) AS total FROM');
  const [countRows] = await pool.query(countSql.replace(/LIMIT \? OFFSET \?/, '').replace(/ORDER BY.*/, ''), params);
  const total = countRows[0].total;

  const offset = (Number(page) - 1) * Number(limit);
  sql += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const [rows] = await pool.query(sql, params);

  const amenitiesSql = `
    SELECT pa.property_id, a.name, a.icon, a.category
    FROM property_amenities pa
    JOIN amenities a ON pa.amenity_id = a.id
  `;
  const [amenities] = await pool.query(amenitiesSql);
  const amenityMap = {};
  for (const a of amenities) {
    if (!amenityMap[a.property_id]) amenityMap[a.property_id] = [];
    amenityMap[a.property_id].push(a);
  }

  for (const row of rows) {
    row.amenities = amenityMap[row.id] || [];
    row.rent_min = null;
    row.rent_max = null;
  }

  return { data: rows, total, page: Number(page), limit: Number(limit) };
};

const getPropertyById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS company_name, c.contact_phone AS company_phone, c.contact_email AS company_email
    FROM properties p
    LEFT JOIN companies c ON p.company_id = c.id
    WHERE p.id = ? AND p.deleted_at IS NULL
  `, [id]);
  if (rows.length === 0) throw new AppError('Property not found', 404);
  const property = rows[0];

  const [images] = await pool.query('SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, sort_order ASC', [id]);
  property.images = images;

  const [amenities] = await pool.query(`
    SELECT a.* FROM property_amenities pa
    JOIN amenities a ON pa.amenity_id = a.id
    WHERE pa.property_id = ?
  `, [id]);
  property.amenities = amenities;

  const [nearby] = await pool.query('SELECT * FROM nearby_places WHERE property_id = ? ORDER BY type, distance_km ASC', [id]);
  property.nearby_places = nearby;

  const [reviews] = await pool.query(`
    SELECT r.*, u.name AS user_name FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.property_id = ? ORDER BY r.created_at DESC LIMIT 10
  `, [id]);
  property.reviews = reviews;
  property.avg_rating = reviews.length > 0 ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length : 0;

  const [units] = await pool.query(`
    SELECT u.*, b.name AS building_name FROM units u
    JOIN buildings b ON u.building_id = b.id
    WHERE b.property_id = ? AND u.deleted_at IS NULL AND b.deleted_at IS NULL
    ORDER BY u.rent_amount ASC LIMIT 5
  `, [id]);
  property.units = units;
  property.rent_min = units.length > 0 ? Math.min(...units.map((u) => Number(u.rent_amount))) : null;
  property.rent_max = units.length > 0 ? Math.max(...units.map((u) => Number(u.rent_amount))) : null;

  return property;
};

const getFeaturedProperties = async (limit = 6) => {
  const sql = `
    SELECT p.id, p.name, p.city, p.region, p.property_type, p.featured, p.created_at,
      (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image,
      COALESCE((SELECT AVG(rating) FROM reviews WHERE property_id = p.id), 0) AS avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE property_id = p.id) AS review_count,
      (SELECT MIN(u.rent_amount) FROM units u JOIN buildings b ON u.building_id = b.id WHERE b.property_id = p.id AND u.deleted_at IS NULL) AS rent_min,
      (SELECT MAX(u.rent_amount) FROM units u JOIN buildings b ON u.building_id = b.id WHERE b.property_id = p.id AND u.deleted_at IS NULL) AS rent_max
    FROM properties p
    WHERE p.deleted_at IS NULL AND p.status = 'active'
    ORDER BY p.featured DESC, p.created_at DESC
    LIMIT ?
  `;
  const [rows] = await pool.query(sql, [Number(limit)]);
  return rows;
};

const toggleFavorite = async (userId, propertyId) => {
  const [existing] = await pool.query('SELECT 1 FROM saved_properties WHERE user_id = ? AND property_id = ?', [userId, propertyId]);
  if (existing.length > 0) {
    await pool.query('DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?', [userId, propertyId]);
    return { saved: false };
  }
  await pool.query('INSERT INTO saved_properties (user_id, property_id) VALUES (?, ?)', [userId, propertyId]);
  return { saved: true };
};

const getFavorites = async (userId) => {
  const [rows] = await pool.query(`
    SELECT p.id, p.name, p.city, p.property_type,
      (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image,
      COALESCE((SELECT AVG(rating) FROM reviews WHERE property_id = p.id), 0) AS avg_rating,
      (SELECT MIN(u.rent_amount) FROM units u JOIN buildings b ON u.building_id = b.id WHERE b.property_id = p.id AND u.deleted_at IS NULL) AS rent_min,
      sp.created_at AS saved_at
    FROM saved_properties sp
    JOIN properties p ON sp.property_id = p.id
    WHERE sp.user_id = ? AND p.deleted_at IS NULL
    ORDER BY sp.created_at DESC
  `, [userId]);
  return rows;
};

const applyForProperty = async (data) => {
  const { unit_id, applicant_id, message, employment, income, national_id } = data;
  const [existing] = await pool.query(
    'SELECT id FROM applications WHERE applicant_id = ? AND unit_id = ? AND status IN (?, ?)',
    [applicant_id, unit_id, 'pending', 'approved']
  );
  if (existing.length > 0) throw new AppError('You have already applied for this unit', 409);

  const [result] = await pool.query(
    `INSERT INTO applications (unit_id, applicant_id, status, message, employment, income, national_id)
     VALUES (?, ?, 'pending', ?, ?, ?, ?)`,
    [unit_id, applicant_id, message || null, employment || null, income || null, national_id || null]
  );
  return { id: result.insertId, status: 'pending' };
};

const getApplications = async (userId) => {
  const [rows] = await pool.query(`
    SELECT a.*, u.unit_number, u.rent_amount, u.status AS unit_status,
      b.name AS building_name, p.name AS property_name, p.id AS property_id,
      (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
    FROM applications a
    JOIN units u ON a.unit_id = u.id
    JOIN buildings b ON u.building_id = b.id
    JOIN properties p ON b.property_id = p.id
    WHERE a.applicant_id = ?
    ORDER BY a.created_at DESC
  `, [userId]);
  return rows;
};

const createViewingRequest = async (data) => {
  const { unit_id, applicant_id, requested_date, requested_time, message } = data;
  const [result] = await pool.query(
    `INSERT INTO viewing_requests (unit_id, applicant_id, requested_date, requested_time, message)
     VALUES (?, ?, ?, ?, ?)`,
    [unit_id, applicant_id, requested_date, requested_time, message || null]
  );
  return { id: result.insertId, status: 'pending' };
};

const getViewingRequests = async (userId) => {
  const [rows] = await pool.query(`
    SELECT v.*, u.unit_number, u.rent_amount,
      b.name AS building_name, p.name AS property_name, p.id AS property_id
    FROM viewing_requests v
    JOIN units u ON v.unit_id = u.id
    JOIN buildings b ON u.building_id = b.id
    JOIN properties p ON b.property_id = p.id
    WHERE v.applicant_id = ?
    ORDER BY v.created_at DESC
  `, [userId]);
  return rows;
};

const createReview = async (data) => {
  const { property_id, user_id, rating, title, comment } = data;
  await pool.query('DELETE FROM reviews WHERE property_id = ? AND user_id = ?', [property_id, user_id]);
  const [result] = await pool.query(
    'INSERT INTO reviews (property_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
    [property_id, user_id, rating, title || null, comment || null]
  );
  return { id: result.insertId };
};

module.exports = {
  listProperties, getPropertyById, getFeaturedProperties,
  toggleFavorite, getFavorites,
  applyForProperty, getApplications,
  createViewingRequest, getViewingRequests,
  createReview,
};
