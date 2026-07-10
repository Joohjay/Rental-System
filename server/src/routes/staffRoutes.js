const { Router } = require('express');
const staffController = require('../controllers/staffController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'COMPANY_OWNER'), staffController.listAll);
router.get('/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER'), staffController.getById);
router.post(
  '/',
  authorize('SUPER_ADMIN', 'COMPANY_OWNER'),
  validate({
    name: { required: true, minLength: 2, maxLength: 120 },
    email: { required: true },
    password: { required: true, minLength: 6 },
    role: { required: true },
  }),
  auditLogger('CREATE', 'staff'),
  staffController.create
);
router.put('/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER'), auditLogger('UPDATE', 'staff'), staffController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'COMPANY_OWNER'), auditLogger('DELETE', 'staff'), staffController.remove);

module.exports = router;
