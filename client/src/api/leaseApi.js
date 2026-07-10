import { leases } from '../utils/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const paginate = (data, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);
  return { success: true, data: items, pagination: { page, limit, total: data.length, totalPages: Math.ceil(data.length / limit) } };
};

export const getLeases = async ({ page = 1, limit = 10, search = '', status = '', sortBy = 'start', sortDirection = 'desc' } = {}) => {
  await delay();
  let filtered = [...leases];
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter((l) => l.tenant.toLowerCase().includes(q) || l.unit.toLowerCase().includes(q) || l.property.toLowerCase().includes(q)); }
  if (status) filtered = filtered.filter((l) => l.status === status);
  if (sortBy) filtered.sort((a, b) => { const v = sortDirection === 'asc' ? 1 : -1; return (a[sortBy] || '') > (b[sortBy] || '') ? v : -v; });
  return { data: paginate(filtered, page, limit) };
};
