const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/propertyController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /properties:
 *   get:
 *     tags: [Properties]
 *     summary: List properties
 *     description: Returns paginated properties for the authenticated user's company. Supports search and status filter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, city, or region
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Paginated property list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), list);

/**
 * @openapi
 * /properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get property by ID
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
 *         description: Property data
 *       404:
 *         description: Property not found
 */
router.get('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), getById);

/**
 * @openapi
 * /properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create a property
 *     description: Creates a property within the authenticated user's company.
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
 *                 example: Sunrise Apartments
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               region:
 *                 type: string
 *               country:
 *                 type: string
 *                 default: Tanzania
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *     responses:
 *       201:
 *         description: Property created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'),
  validate({ name: { required: true, minLength: 2, maxLength: 200 } }),
  auditLogger('CREATE', 'property'),
  create
);

/**
 * @openapi
 * /properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update a property
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Property updated
 *       404:
 *         description: Property not found
 */
router.put('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'property'), update);

/**
 * @openapi
 * /properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Soft delete a property
 *     description: SUPER_ADMIN only. Cascade soft-deletes all buildings and units within.
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
 *         description: Property deleted
 *       404:
 *         description: Property not found
 */
router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'property'), remove);

module.exports = router;
