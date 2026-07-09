const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/unitController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), list);
router.get('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), getById);

router.post(
  '/',
  authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'),
  validate({
    unit_number: { required: true, minLength: 1, maxLength: 50 },
    rent_amount: { required: true },
  }),
  auditLogger('CREATE', 'unit'),
  create
);

router.put('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'unit'), update);
router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'unit'), remove);

module.exports = router;
