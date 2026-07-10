const request = require('supertest');
const {
  getApp, registerUser, loginUser, createCompany, cleanDatabase, TEST_PREFIX
} = require('./helpers');
const pool = require('../config/db');

const app = getApp();
let token;

beforeAll(async () => {
  await cleanDatabase();
  const regRes = await registerUser();
  token = regRes.body.token;
});

afterAll(async () => {
  await cleanDatabase();
});

describe('POST /api/companies', () => {
  it('should create a company', async () => {
    const res = await createCompany(token);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toContain(TEST_PREFIX);
    expect(res.body.data.currency).toBe('TZS');
  });

  it('should assign creator to the company', async () => {
    const loginRes = await loginUser(`${TEST_PREFIX}@test.com`, 'Test@123');
    expect(loginRes.body.user.company_id).toBeTruthy();
  });

  it('should reject duplicate slug', async () => {
    const res = await createCompany(token);

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should reject without name', async () => {
    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/companies')
      .send({ name: 'No Auth' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/companies', () => {
  it('should list all companies', async () => {
    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/companies/:id', () => {
  it('should get company by id', async () => {
    const listRes = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`);
    const companyId = listRes.body.data[0].id;

    const res = await request(app)
      .get(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(companyId);
  });

  it('should return 404 for non-existent company', async () => {
    const res = await request(app)
      .get('/api/companies/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/companies/:id', () => {
  it('should update company settings', async () => {
    const listRes = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`);
    const companyId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currency: 'USD', tax_rate: 10.5, theme: 'dark' });

    expect(res.status).toBe(200);
    expect(res.body.data.currency).toBe('USD');
    expect(res.body.data.tax_rate).toBe('10.50');
    expect(res.body.data.theme).toBe('dark');
  });
});

describe('DELETE /api/companies/:id', () => {
  it('should soft delete a company', async () => {
    const listRes = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`);
    const companyId = listRes.body.data[0].id;

    const res = await request(app)
      .delete(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Role-based access', () => {
  it('should reject non-SUPER_ADMIN from creating companies', async () => {
    const tenantRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Tenant', email: `tenant_${TEST_PREFIX}@test.com`, password: 'Test@123', role: 'TENANT' });
    const tenantToken = tenantRes.body.token;

    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${tenantToken}`)
      .send({ name: 'Should Fail' });

    expect(res.status).toBe(403);
  });
});
