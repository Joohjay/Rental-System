import { maintenance } from '../utils/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const paginate = (data, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);
  return { success: true, data: items, pagination: { page, limit, total: data.length, totalPages: Math.ceil(data.length / limit) } };
};

export const getMaintenanceRequests = async ({ page = 1, limit = 10, search = '', status = '', priority = '', type = '' } = {}) => {
  await delay();
  let filtered = [...maintenance];
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter((m) => m.title.toLowerCase().includes(q) || m.unit.toLowerCase().includes(q) || m.tenant.toLowerCase().includes(q)); }
  if (status) filtered = filtered.filter((m) => m.status === status);
  if (priority) filtered = filtered.filter((m) => m.priority === priority);
  if (type) filtered = filtered.filter((m) => m.type === type);
  return { data: paginate(filtered, page, limit) };
};

export const updateMaintenanceStatus = async (id, status) => {
  await delay(200);
  return { data: { success: true, message: 'Status updated' } };
};
