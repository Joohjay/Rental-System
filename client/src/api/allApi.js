import api from './axios';

export const globalSearch = async (query) => {
  const results = { companies: [], properties: [], buildings: [], units: [] };
  try {
    const [compRes, propRes, buildRes, unitRes] = await Promise.all([
      api.get('/companies', { params: { search: query, limit: 5 } }),
      api.get('/properties', { params: { search: query, limit: 5 } }),
      api.get('/buildings', { params: { search: query, limit: 5 } }),
      api.get('/units', { params: { search: query, limit: 5 } }),
    ]);
    results.companies = compRes.data.data || [];
    results.properties = propRes.data.data || [];
    results.buildings = buildRes.data.data || [];
    results.units = unitRes.data.data || [];
  } catch {}
  return results;
};

export const getCompanies = (params) => api.get('/companies', { params });
export const getProperties = (params) => api.get('/properties', { params });
export const getBuildings = (params) => api.get('/buildings', { params });
export const getUnits = (params) => api.get('/units', { params });
