import { reports, monthlyRevenue } from '../utils/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const getReportSummary = async () => {
  await delay();
  return { data: { success: true, data: reports } };
};

export const getMonthlyRevenue = async () => {
  await delay();
  return { data: { success: true, data: monthlyRevenue } };
};

export const exportReport = async (format) => {
  await delay(800);
  return { data: { success: true, message: `Report exported as ${format}` } };
};
