const { Router } = require('express');
const { registerApplicant, registerCompanyOwner, login, getMe, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const router = Router();

router.post(
  '/register/applicant',
  validate({
    name: { required: true, minLength: 2, maxLength: 120 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    password: { required: true, minLength: 6 },
  }),
  registerApplicant
);

router.post(
  '/register/company',
  validate({
    company_name: { required: true, minLength: 2, maxLength: 200 },
    business_email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
    owner_name: { required: true, minLength: 2, maxLength: 120 },
    password: { required: true, minLength: 6 },
  }),
  registerCompanyOwner
);

router.post(
  '/login',
  validate({
    email: { required: true },
    password: { required: true },
  }),
  login
);

router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;
