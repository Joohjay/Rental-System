import { payments } from '../utils/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const paginate = (data, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);
  return { success: true, data: items, pagination: { page, limit, total: data.length, totalPages: Math.ceil(data.length / limit) } };
};

export const getPayments = async ({ page = 1, limit = 10, search = '', status = '', period = '' } = {}) => {
  await delay();
  let filtered = [...payments];
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter((p) => p.tenant.toLowerCase().includes(q) || p.unit.toLowerCase().includes(q) || (p.ref || '').toLowerCase().includes(q)); }
  if (status) filtered = filtered.filter((p) => p.status === status);
  if (period) filtered = filtered.filter((p) => p.period === period);
  return { data: paginate(filtered, page, limit) };
};
