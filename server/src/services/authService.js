const bcrypt = require('bcrypt');
const pool = require('../config/db');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const registerApplicant = async ({ name, email, phone, password, profile_photo_url, national_id, preferred_city }) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role, profile_photo_url, national_id, preferred_city)
     VALUES (?, ?, ?, ?, 'APPLICANT', ?, ?, ?)`,
    [name, email, phone || null, password_hash, profile_photo_url || null, national_id || null, preferred_city || null]
  );

  const user = { id: result.insertId, name, email, role: 'APPLICANT', company_id: null, phone: phone || null };
  const token = generateToken({ id: user.id, name: user.name, role: user.role, company_id: null });

  return { token, user };
};

const registerCompanyOwner = async ({ company_name, business_email, business_phone, tin, business_address, owner_name, password }) => {
  const email = business_email;
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  const password_hash = await bcrypt.hash(password, 12);
  const cname = company_name;

  const slug = slugify(cname);
  const [slugConflict] = await pool.query('SELECT id FROM companies WHERE slug = ?', [slug]);
  const finalSlug = slugConflict.length > 0 ? `${slug}-${Date.now()}` : slug;

  const [companyResult] = await pool.query(
    `INSERT INTO companies (name, slug, contact_email, contact_phone, address, currency, timezone, language)
     VALUES (?, ?, ?, ?, ?, 'TZS', 'Africa/Dar_es_Salaam', 'en')`,
    [cname, finalSlug, email, business_phone || null, business_address || null]
  );
  const company_id = companyResult.insertId;

  const [userResult] = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role, company_id, tin)
     VALUES (?, ?, ?, ?, 'COMPANY_OWNER', ?, ?)`,
    [owner_name, email, business_phone || null, password_hash, company_id, tin || null]
  );

  const user = { id: userResult.insertId, name: owner_name, email, role: 'COMPANY_OWNER', company_id };
  const company = { id: company_id, name: cname, slug: finalSlug };
  const token = generateToken({ id: user.id, name: user.name, role: user.role, company_id });

  return { token, user, company };
};

const loginUser = async ({ email, password }) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, password_hash, role, company_id FROM users WHERE email = ? AND is_active = 1',
    [email]
  );

  if (rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const userRow = rows[0];
  const match = await bcrypt.compare(password, userRow.password_hash);
  if (!match) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = { id: userRow.id, name: userRow.name, email: userRow.email, phone: userRow.phone, role: userRow.role, company_id: userRow.company_id };
  const token = generateToken({ id: user.id, name: user.name, role: user.role, company_id: user.company_id });

  return { token, user };
};

const getUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, role, is_active, company_id, profile_photo_url, national_id, preferred_city, tin, created_at FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  return rows[0];
};

module.exports = { registerApplicant, registerCompanyOwner, loginUser, getUserById };
