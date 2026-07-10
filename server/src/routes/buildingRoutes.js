const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/buildingController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * @openapi
 * /properties/{propertyId}/buildings:
 *   get:
 *     tags: [Buildings]
 *     summary: List buildings for a property
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     responses:
 *       200:
 *         description: List of buildings
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
 *                     $ref: '#/components/schemas/Building'
 */
router.get('/', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), list);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{id}:
 *   get:
 *     tags: [Buildings]
 *     summary: Get building by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Building data
 *       404:
 *         description: Building not found
 */
router.get('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), getById);

/**
 * @openapi
 * /properties/{propertyId}/buildings:
 *   post:
 *     tags: [Buildings]
 *     summary: Create a building
 *     description: Creates a building within a property.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
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
 *                 example: Block A
 *               description:
 *                 type: string
 *               floors:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Building created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Property not found
 */
router.post(
  '/',
  authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'),
  validate({ name: { required: true, minLength: 2, maxLength: 200 } }),
  auditLogger('CREATE', 'building'),
  create
);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{id}:
 *   put:
 *     tags: [Buildings]
 *     summary: Update a building
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
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
 *               floors:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Building updated
 *       404:
 *         description: Building not found
 */
router.put('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'building'), update);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{id}:
 *   delete:
 *     tags: [Buildings]
 *     summary: Soft delete a building
 *     description: SUPER_ADMIN only. Cascade soft-deletes all units within.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Building deleted
 *       404:
 *         description: Building not found
 */
router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'building'), remove);

module.exports = router;
