const { Router } = require('express');
const applicantController = require('../controllers/applicantController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = Router();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), applicantController.listAll);
router.get('/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), applicantController.getById);
router.patch('/:id/status', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), applicantController.updateStatus);

module.exports = router;
