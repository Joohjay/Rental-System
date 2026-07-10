import api from './axios';

export const getApplicants = (params) => api.get('/applicants', { params });
export const getApplicant = (id) => api.get(`/applicants/${id}`);
export const updateApplicantStatus = (id, status) => api.patch(`/applicants/${id}/status`, { status });
