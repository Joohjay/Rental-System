const pool = require('../config/db');
const AppError = require('../utils/AppError');

const listAll = async (companyId, query) => {
  const { search, status, page = 1, limit = 20 } = query;

  let sql = `
    SELECT DISTINCT u.id, u.name, u.email, u.phone, u.national_id, u.preferred_city,
      u.profile_photo_url, u.is_active, u.created_at,
      a.status AS application_status, a.id AS application_id, a.created_at AS applied_at,
      un.name AS unit_name, b.name AS building_name, p.name AS property_name
    FROM users u
    JOIN applications a ON a.applicant_id = u.id
    JOIN units un ON a.unit_id = un.id AND un.deleted_at IS NULL
    JOIN buildings b ON un.building_id = b.id AND b.deleted_at IS NULL
    JOIN properties p ON b.property_id = p.id AND p.deleted_at IS NULL
    WHERE p.company_id = ? AND u.deleted_at IS NULL
  `;
  const params = [companyId];

  if (search) {
    sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    sql += ' AND a.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY a.created_at DESC';

  const countParams = [...params];
  sql += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), (Number(page) - 1) * Number(limit));

  const [rows] = await pool.query(sql, params);

  const [countResult] = await pool.query(
    sql.replace('SELECT DISTINCT u.id, u.name, u.email, u.phone, u.national_id, u.preferred_city, u.profile_photo_url, u.is_active, u.created_at, a.status AS application_status, a.id AS application_id, a.created_at AS applied_at, un.name AS unit_name, b.name AS building_name, p.name AS property_name', 'SELECT COUNT(DISTINCT u.id) AS total').split('LIMIT')[0],
    countParams
  );

  return { data: rows, total: countResult[0].total, page: Number(page), limit: Number(limit) };
};

const getById = async (id, companyId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.phone, u.national_id, u.preferred_city,
      u.profile_photo_url, u.is_active, u.created_at,
      a.status AS application_status, a.id AS application_id, a.income, a.employment,
      a.references_txt, a.message, a.created_at AS applied_at,
      un.name AS unit_name, un.rent_amount, un.bedrooms, un.bathrooms, un.size_sqm,
      b.name AS building_name, p.name AS property_name
    FROM users u
    JOIN applications a ON a.applicant_id = u.id
    JOIN units un ON a.unit_id = un.id AND un.deleted_at IS NULL
    JOIN buildings b ON un.building_id = b.id AND b.deleted_at IS NULL
    JOIN properties p ON b.property_id = p.id AND p.deleted_at IS NULL
    WHERE u.id = ? AND p.company_id = ? AND u.deleted_at IS NULL
    LIMIT 1`,
    [id, companyId]
  );

  if (rows.length === 0) {
    throw new AppError('Applicant not found', 404);
  }

  return rows[0];
};

const updateStatus = async (id, companyId, status, reviewerId) => {
  const applicant = await getById(id, companyId);

  await pool.query(
    'UPDATE applications SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
    [status, reviewerId, applicant.application_id]
  );

  return { ...applicant, application_status: status };
};

module.exports = { listAll, getById, updateStatus };
