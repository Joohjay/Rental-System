const bcrypt = require('bcrypt');
const pool = require('../config/db');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');

const registerUser = async ({ name, email, phone, password, role }) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, password_hash, role || 'TENANT']
  );

  const user = { id: result.insertId, name, email, role: role || 'TENANT', company_id: null };
  const token = generateToken({ id: user.id, name: user.name, role: user.role, company_id: null });

  return { token, user };
};

const loginUser = async ({ email, password }) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, role, company_id FROM users WHERE email = ? AND is_active = 1',
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

  const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role, company_id: userRow.company_id };
  const token = generateToken({ id: user.id, name: user.name, role: user.role, company_id: user.company_id });

  return { token, user };
};

const getUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, role, is_active, company_id, created_at FROM users WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  return rows[0];
};

module.exports = { registerUser, loginUser, getUserById };
