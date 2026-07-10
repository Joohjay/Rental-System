const marketplaceService = require('../services/marketplaceService');

const listProperties = async (req, res, next) => {
  try {
    const result = await marketplaceService.listProperties(req.query);
    res.json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) { next(err); }
};

const getProperty = async (req, res, next) => {
  try {
    const property = await marketplaceService.getPropertyById(req.params.id);
    res.json({ success: true, data: property });
  } catch (err) { next(err); }
};

const getFeatured = async (req, res, next) => {
  try {
    const properties = await marketplaceService.getFeaturedProperties(req.query.limit || 6);
    res.json({ success: true, data: properties });
  } catch (err) { next(err); }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const result = await marketplaceService.toggleFavorite(req.user.id, req.params.id);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await marketplaceService.getFavorites(req.user.id);
    res.json({ success: true, data: favorites });
  } catch (err) { next(err); }
};

const apply = async (req, res, next) => {
  try {
    const result = await marketplaceService.applyForProperty({ ...req.body, applicant_id: req.user.id });
    res.status(201).json({ success: true, message: 'Application submitted', data: result });
  } catch (err) { next(err); }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await marketplaceService.getApplications(req.user.id);
    res.json({ success: true, data: applications });
  } catch (err) { next(err); }
};

const createViewingRequest = async (req, res, next) => {
  try {
    const result = await marketplaceService.createViewingRequest({ ...req.body, applicant_id: req.user.id });
    res.status(201).json({ success: true, message: 'Viewing request submitted', data: result });
  } catch (err) { next(err); }
};

const getViewingRequests = async (req, res, next) => {
  try {
    const requests = await marketplaceService.getViewingRequests(req.user.id);
    res.json({ success: true, data: requests });
  } catch (err) { next(err); }
};

const createReview = async (req, res, next) => {
  try {
    const result = await marketplaceService.createReview({ ...req.body, user_id: req.user.id });
    res.status(201).json({ success: true, message: 'Review submitted', data: result });
  } catch (err) { next(err); }
};

module.exports = {
  listProperties, getProperty, getFeatured,
  toggleFavorite, getFavorites,
  apply, getApplications,
  createViewingRequest, getViewingRequests,
  createReview,
};
