const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/companyController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /companies:
 *   get:
 *     tags: [Companies]
 *     summary: List all companies
 *     description: Returns all active companies. SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', authorize('SUPER_ADMIN'), list);

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get company by ID
 *     description: Returns a single company. SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get('/:id', authorize('SUPER_ADMIN'), getById);

/**
 * @openapi
 * /companies:
 *   post:
 *     tags: [Companies]
 *     summary: Create a company
 *     description: Creates a new company and assigns the creator as its SUPER_ADMIN. SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mlimani Properties Ltd
 *               slug:
 *                 type: string
 *                 example: mlimani-properties
 *               currency:
 *                 type: string
 *                 default: TZS
 *               timezone:
 *                 type: string
 *                 default: Africa/Dar_es_Salaam
 *               language:
 *                 type: string
 *                 default: en
 *               theme:
 *                 type: string
 *                 enum: [light, dark, auto]
 *               tax_rate:
 *                 type: number
 *               contact_email:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *               address:
 *                 type: string
 *               default_rent_due_day:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Company created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already exists
 */
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  validate({
    name: { required: true, minLength: 2, maxLength: 200 },
  }),
  auditLogger('CREATE', 'company'),
  create
);

/**
 * @openapi
 * /companies/{id}:
 *   put:
 *     tags: [Companies]
 *     summary: Update a company
 *     description: Updates company settings. SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               currency:
 *                 type: string
 *               timezone:
 *                 type: string
 *               theme:
 *                 type: string
 *               tax_rate:
 *                 type: number
 *               contact_email:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *               address:
 *                 type: string
 *               default_rent_due_day:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Company updated
 *       404:
 *         description: Company not found
 */
router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  auditLogger('UPDATE', 'company'),
  update
);

/**
 * @openapi
 * /companies/{id}:
 *   delete:
 *     tags: [Companies]
 *     summary: Soft delete a company
 *     description: Deactivates a company. SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted
 *       404:
 *         description: Company not found
 */
router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'company'), remove);

module.exports = router;
