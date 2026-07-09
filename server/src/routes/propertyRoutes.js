const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/propertyController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), list);
router.get('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), getById);

router.post(
  '/',
  authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'),
  validate({ name: { required: true, minLength: 2, maxLength: 200 } }),
  auditLogger('CREATE', 'property'),
  create
);

router.put('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'property'), update);
router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'property'), remove);

module.exports = router;
