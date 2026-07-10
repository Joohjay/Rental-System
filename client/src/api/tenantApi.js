import { tenants } from '../utils/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const paginate = (data, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);
  return {
    success: true,
    data: items,
    pagination: { page, limit, total: data.length, totalPages: Math.ceil(data.length / limit) },
  };
};

export const getTenants = async ({ page = 1, limit = 10, search = '', status = '', sortBy = 'name', sortDirection = 'asc' } = {}) => {
  await delay();
  let filtered = [...tenants];
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.unit.toLowerCase().includes(q)); }
  if (status) filtered = filtered.filter((t) => t.status === status);
  if (sortBy) filtered.sort((a, b) => { const v = sortDirection === 'asc' ? 1 : -1; return (a[sortBy] || '') > (b[sortBy] || '') ? v : -v; });
  return { data: paginate(filtered, page, limit) };
};

export const getTenant = async (id) => {
  await delay();
  const tenant = tenants.find((t) => t.id === id);
  if (!tenant) throw new Error('Tenant not found');
  return { data: { success: true, data: tenant } };
};
