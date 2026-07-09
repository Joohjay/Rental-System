const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/companyController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN'), list);
router.get('/:id', authorize('SUPER_ADMIN'), getById);

router.post(
  '/',
  authorize('SUPER_ADMIN'),
  validate({
    name: { required: true, minLength: 2, maxLength: 200 },
  }),
  auditLogger('CREATE', 'company'),
  create
);

router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  auditLogger('UPDATE', 'company'),
  update
);

router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'company'), remove);

module.exports = router;
