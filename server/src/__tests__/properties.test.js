const request = require('supertest');
const {
  getApp, registerUser, loginUser, cleanDatabase, TEST_PREFIX
} = require('./helpers');
const pool = require('../config/db');

const app = getApp();
let token;
let companyId;

beforeAll(async () => {
  await cleanDatabase();
  // Register and create a company to get company_id
  let res = await registerUser();
  token = res.body.token;
  res = await request(app)
    .post('/api/companies')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `${TEST_PREFIX}_Company` });
  // Re-login to get token with company_id
  res = await loginUser(`${TEST_PREFIX}@test.com`, 'Test@123');
  token = res.body.token;
  companyId = res.body.user.company_id;
});

afterAll(async () => {
  await cleanDatabase();
});

describe('POST /api/properties', () => {
  it('should create a property', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${TEST_PREFIX}_Property`, city: 'Arusha' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toContain(TEST_PREFIX);
    expect(res.body.data.company_id).toBe(companyId);
  });

  it('should reject without name', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/properties')
      .send({ name: 'No Auth' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/properties', () => {
  it('should list properties with pagination', async () => {
    const res = await request(app)
      .get('/api/properties?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
  });

  it('should filter by status', async () => {
    const res = await request(app)
      .get('/api/properties?status=active')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].status).toBe('active');
    }
  });

  it('should search by name', async () => {
    const res = await request(app)
      .get(`/api/properties?search=${TEST_PREFIX}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/properties/:id', () => {
  it('should get property by id', async () => {
    const listRes = await request(app)
      .get('/api/properties')
      .set('Authorization', `Bearer ${token}`);
    const propertyId = listRes.body.data[0].id;

    const res = await request(app)
      .get(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(propertyId);
  });

  it('should return 404 for non-existent property', async () => {
    const res = await request(app)
      .get('/api/properties/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/properties/:id', () => {
  it('should update a property', async () => {
    const listRes = await request(app)
      .get('/api/properties')
      .set('Authorization', `Bearer ${token}`);
    const propertyId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'inactive', description: 'Updated desc' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('inactive');
    expect(res.body.data.description).toBe('Updated desc');
  });
});

describe('DELETE /api/properties/:id', () => {
  it('should soft delete a property', async () => {
    // Create a property to delete
    const createRes = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${TEST_PREFIX}_ToDelete` });
    const propertyId = createRes.body.data.id;

    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it's gone from list
    const listRes = await request(app)
      .get('/api/properties')
      .set('Authorization', `Bearer ${token}`);
    const ids = listRes.body.data.map(p => p.id);
    expect(ids).not.toContain(propertyId);
  });
});
