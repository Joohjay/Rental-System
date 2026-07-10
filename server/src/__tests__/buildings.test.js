const request = require('supertest');
const {
  getApp, registerUser, loginUser, cleanDatabase, TEST_PREFIX
} = require('./helpers');
const pool = require('../config/db');

const app = getApp();
let token;
let propertyId;

beforeAll(async () => {
  await cleanDatabase();
  let res = await registerUser();
  token = res.body.token;
  // Create company
  await request(app)
    .post('/api/companies')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `${TEST_PREFIX}_Company` });
  // Re-login
  res = await loginUser(`${TEST_PREFIX}@test.com`, 'Test@123');
  token = res.body.token;
  // Create property
  res = await request(app)
    .post('/api/properties')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `${TEST_PREFIX}_Property` });
  propertyId = res.body.data.id;
});

afterAll(async () => {
  await cleanDatabase();
});

describe('POST /api/properties/:propertyId/buildings', () => {
  it('should create a building', async () => {
    const res = await request(app)
      .post(`/api/properties/${propertyId}/buildings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${TEST_PREFIX}_Block`, floors: 3 });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toContain(TEST_PREFIX);
    expect(res.body.data.floors).toBe(3);
    expect(res.body.data.property_id).toBe(propertyId);
  });

  it('should reject without name', async () => {
    const res = await request(app)
      .post(`/api/properties/${propertyId}/buildings`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should reject for non-existent property', async () => {
    const res = await request(app)
      .post('/api/properties/99999/buildings')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost' });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/properties/:propertyId/buildings', () => {
  it('should list buildings for a property', async () => {
    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/properties/:propertyId/buildings/:id', () => {
  it('should get building by id', async () => {
    const listRes = await request(app)
      .get(`/api/properties/${propertyId}/buildings`)
      .set('Authorization', `Bearer ${token}`);
    const buildingId = listRes.body.data[0].id;

    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(buildingId);
  });
});

describe('PUT /api/properties/:propertyId/buildings/:id', () => {
  it('should update a building', async () => {
    const listRes = await request(app)
      .get(`/api/properties/${propertyId}/buildings`)
      .set('Authorization', `Bearer ${token}`);
    const buildingId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/properties/${propertyId}/buildings/${buildingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ floors: 5, description: 'Expanded' });

    expect(res.status).toBe(200);
    expect(res.body.data.floors).toBe(5);
    expect(res.body.data.description).toBe('Expanded');
  });
});

describe('DELETE /api/properties/:propertyId/buildings/:id', () => {
  it('should soft delete a building', async () => {
    const createRes = await request(app)
      .post(`/api/properties/${propertyId}/buildings`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `${TEST_PREFIX}_ToDelete` });
    const buildingId = createRes.body.data.id;

    const res = await request(app)
      .delete(`/api/properties/${propertyId}/buildings/${buildingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
