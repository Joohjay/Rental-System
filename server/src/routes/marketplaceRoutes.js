const { Router } = require('express');
const controller = require('../controllers/marketplaceController');
const authenticate = require('../middleware/authenticate');
const router = Router();

// Public — no auth required
router.get('/properties', controller.listProperties);
router.get('/properties/featured', controller.getFeatured);
router.get('/properties/:id', controller.getProperty);

// Authenticated — applicant/tenant actions
router.post('/favorites/:id', authenticate, controller.toggleFavorite);
router.get('/favorites', authenticate, controller.getFavorites);
router.post('/applications', authenticate, controller.apply);
router.get('/applications', authenticate, controller.getApplications);
router.post('/viewing-requests', authenticate, controller.createViewingRequest);
router.get('/viewing-requests', authenticate, controller.getViewingRequests);
router.post('/reviews', authenticate, controller.createReview);

module.exports = router;
