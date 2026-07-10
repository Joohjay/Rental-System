const request = require('supertest');
const { getApp, registerUser, loginUser, cleanDatabase, TEST_PREFIX } = require('./helpers');
const pool = require('../config/db');

const app = getApp();

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe(`${TEST_PREFIX}_User`);
    expect(res.body.user.role).toBe('SUPER_ADMIN');
  });

  it('should reject duplicate email', async () => {
    const res = await registerUser();

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Password' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bad', email: 'notanemail', password: 'Test@123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it('should reject short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Weak', email: 'weak@test.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/6 characters/);
  });
});

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await loginUser(`${TEST_PREFIX}@test.com`, 'Test@123');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(`${TEST_PREFIX}@test.com`);
  });

  it('should reject wrong password', async () => {
    const res = await loginUser(`${TEST_PREFIX}@test.com`, 'WrongPass@123');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should reject non-existent email', async () => {
    const res = await loginUser('nobody@test.com', 'Test@123');

    expect(res.status).toBe(401);
  });

  it('should reject empty body', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('should return user with valid token', async () => {
    const loginRes = await loginUser(`${TEST_PREFIX}@test.com`, 'Test@123');
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(`${TEST_PREFIX}@test.com`);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/authentication required/i);
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_token');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid|expired/i);
  });
});

describe('POST /api/auth/logout', () => {
  it('should logout with valid token', async () => {
    const loginRes = await loginUser(`${TEST_PREFIX}@test.com`, 'Test@123');
    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject logout without token', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).toBe(401);
  });
});
