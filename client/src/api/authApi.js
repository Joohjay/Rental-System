import api from './axios';

export const registerApplicant = (data) => api.post('/auth/register/applicant', data);
export const registerCompany = (data) => api.post('/auth/register/company', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const logoutUser = () => api.post('/auth/logout');