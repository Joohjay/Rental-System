const request = require('supertest');
const {
  getApp, registerUser, loginUser, cleanDatabase, TEST_PREFIX
} = require('./helpers');
const pool = require('../config/db');

const app = getApp();
let token;
let propertyId;
let buildingId;

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
  // Create building
  res = await request(app)
    .post(`/api/properties/${propertyId}/buildings`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: `${TEST_PREFIX}_Block` });
  buildingId = res.body.data.id;
});

afterAll(async () => {
  await cleanDatabase();
});

describe('POST /api/properties/:propertyId/buildings/:buildingId/units', () => {
  it('should create a unit', async () => {
    const res = await request(app)
      .post(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        unit_number: `${TEST_PREFIX}_A101`,
        rent_amount: 350000,
        unit_type: 'one_bedroom',
        bedrooms: 1,
        bathrooms: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.unit_number).toContain(TEST_PREFIX);
    expect(res.body.data.rent_amount).toBe('350000.00');
    expect(res.body.data.status).toBe('available');
  });

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should reject for non-existent building', async () => {
    const res = await request(app)
      .post('/api/properties/1/buildings/99999/units')
      .set('Authorization', `Bearer ${token}`)
      .send({ unit_number: 'X01', rent_amount: 100000 });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/properties/:propertyId/buildings/:buildingId/units', () => {
  it('should list units with pagination', async () => {
    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('should filter by status', async () => {
    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units?status=available`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].status).toBe('available');
    }
  });

  it('should filter by rent range', async () => {
    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units?min_rent=200000&max_rent=500000`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    res.body.data.forEach(u => {
      expect(Number(u.rent_amount)).toBeGreaterThanOrEqual(200000);
      expect(Number(u.rent_amount)).toBeLessThanOrEqual(500000);
    });
  });

  it('should search by unit number', async () => {
    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units?search=${TEST_PREFIX}_A101`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/properties/:propertyId/buildings/:buildingId/units/:id', () => {
  it('should get unit by id', async () => {
    const listRes = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
      .set('Authorization', `Bearer ${token}`);
    const unitId = listRes.body.data[0].id;

    const res = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units/${unitId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(unitId);
  });
});

describe('PUT /api/properties/:propertyId/buildings/:buildingId/units/:id', () => {
  it('should update a unit', async () => {
    const listRes = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
      .set('Authorization', `Bearer ${token}`);
    const unitId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/properties/${propertyId}/buildings/${buildingId}/units/${unitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rent_amount: 400000, bedrooms: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.rent_amount).toBe('400000.00');
    expect(res.body.data.bedrooms).toBe(2);
  });

  it('should change unit status', async () => {
    const listRes = await request(app)
      .get(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
      .set('Authorization', `Bearer ${token}`);
    const unitId = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/properties/${propertyId}/buildings/${buildingId}/units/${unitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'occupied' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('occupied');
  });
});

describe('DELETE /api/properties/:propertyId/buildings/:buildingId/units/:id', () => {
  it('should soft delete a unit', async () => {
    const createRes = await request(app)
      .post(`/api/properties/${propertyId}/buildings/${buildingId}/units`)
      .set('Authorization', `Bearer ${token}`)
      .send({ unit_number: `${TEST_PREFIX}_ToDelete`, rent_amount: 50000 });
    const unitId = createRes.body.data.id;

    const res = await request(app)
      .delete(`/api/properties/${propertyId}/buildings/${buildingId}/units/${unitId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
