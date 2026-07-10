import api from './axios';

export const getListings = (params) => api.get('/marketplace/properties', { params });
export const getFeaturedListings = (limit = 6) => api.get('/marketplace/properties/featured', { params: { limit } });
export const getListing = (id) => api.get(`/marketplace/properties/${id}`);
export const toggleFavorite = (id) => api.post(`/marketplace/favorites/${id}`);
export const getFavorites = () => api.get('/marketplace/favorites');
export const submitApplication = (data) => api.post('/marketplace/applications', data);
export const getApplications = () => api.get('/marketplace/applications');
export const createViewingRequest = (data) => api.post('/marketplace/viewing-requests', data);
export const getViewingRequests = () => api.get('/marketplace/viewing-requests');
export const submitReview = (data) => api.post('/marketplace/reviews', data);
