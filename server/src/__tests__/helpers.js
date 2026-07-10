const request = require('supertest');
const pool = require('../config/db');
const app = require('../app');

const TEST_PREFIX = `test_${Date.now()}`;

const getApp = () => app;

const registerUser = async (overrides = {}) => {
  const payload = {
    name: `${TEST_PREFIX}_User`,
    email: `${TEST_PREFIX}@test.com`,
    password: 'Test@123',
    role: 'SUPER_ADMIN',
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(payload);
  return res;
};

const loginUser = async (email = `${TEST_PREFIX}@test.com`, password = 'Test@123') => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res;
};

const createCompany = async (token, overrides = {}) => {
  const payload = {
    name: `${TEST_PREFIX}_Company`,
    ...overrides,
  };
  const res = await request(app)
    .post('/api/companies')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  return res;
};

const createProperty = async (token, overrides = {}) => {
  const payload = {
    name: `${TEST_PREFIX}_Property`,
    city: 'Dar es Salaam',
    ...overrides,
  };
  const res = await request(app)
    .post('/api/properties')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  return res;
};

const createBuilding = async (token, propertyId, overrides = {}) => {
  const payload = {
    name: `${TEST_PREFIX}_Block`,
    ...overrides,
  };
  const res = await request(app)
    .post(`/api/properties/${propertyId}/buildings`)
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  return res;
};

const createUnit = async (token, propertyId, buildingId, overrides = {}) => {
  const payload = {
    unit_number: `${TEST_PREFIX}_U01`,
    rent_amount: 300000,
    ...overrides,
  };
  const res = await request(app)
    .post(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  return res;
};

const cleanDatabase = async () => {
  try {
    const like = `${TEST_PREFIX}%`;
    await pool.query(`DELETE FROM activity_logs WHERE user_name LIKE ?`, [like]);
    await pool.query(
      `DELETE u FROM units u
       INNER JOIN buildings b ON u.building_id = b.id
       INNER JOIN properties p ON b.property_id = p.id
       WHERE p.name LIKE ?`,
      [like]
    );
    await pool.query(
      `DELETE b FROM buildings b
       INNER JOIN properties p ON b.property_id = p.id
       WHERE p.name LIKE ?`,
      [like]
    );
    await pool.query(`DELETE FROM properties WHERE name LIKE ?`, [like]);
    await pool.query(`DELETE FROM companies WHERE name LIKE ?`, [like]);
    await pool.query(`DELETE FROM users WHERE email LIKE ?`, [like]);
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
};

module.exports = {
  TEST_PREFIX,
  getApp,
  registerUser,
  loginUser,
  createCompany,
  createProperty,
  createBuilding,
  createUnit,
  cleanDatabase,
};
