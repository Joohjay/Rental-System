const { Router } = require('express');
const buildingController = require('../controllers/buildingController');
const unitController = require('../controllers/unitController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router();

router.use(authenticate);

// Building routes (standalone)
router.get('/buildings', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), buildingController.listAll);
router.get('/buildings/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), buildingController.getById);
router.post('/buildings', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), validate({ name: { required: true, minLength: 2, maxLength: 200 } }), auditLogger('CREATE', 'building'), buildingController.create);
router.put('/buildings/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'building'), buildingController.update);
router.delete('/buildings/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER'), auditLogger('DELETE', 'building'), buildingController.remove);

// Unit routes (standalone)
router.get('/units', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), unitController.listAll);
router.get('/units/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), unitController.getById);
router.post('/units', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), validate({ name: { required: true, minLength: 1, maxLength: 50 }, rent_amount: { required: true } }), auditLogger('CREATE', 'unit'), unitController.create);
router.put('/units/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'unit'), unitController.update);
router.delete('/units/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER'), auditLogger('DELETE', 'unit'), unitController.remove);

module.exports = router;
