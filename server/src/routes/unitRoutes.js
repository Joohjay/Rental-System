const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/unitController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const auditLogger = require('../middleware/auditLogger');

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{buildingId}/units:
 *   get:
 *     tags: [Units]
 *     summary: List units in a building
 *     description: Returns paginated units. Supports filtering by status, type, rent range, and search by unit number.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: buildingId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, occupied, reserved, maintenance]
 *       - in: query
 *         name: unit_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by unit number
 *       - in: query
 *         name: min_rent
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_rent
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Paginated unit list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), list);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{buildingId}/units/{id}:
 *   get:
 *     tags: [Units]
 *     summary: Get unit by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: buildingId
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
 *         description: Unit data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
 */
router.get('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), getById);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{buildingId}/units:
 *   post:
 *     tags: [Units]
 *     summary: Create a unit
 *     description: Creates a unit within a building.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: buildingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [unit_number, rent_amount]
 *             properties:
 *               unit_number:
 *                 type: string
 *                 example: A101
 *               unit_type:
 *                 type: string
 *                 default: studio
 *               floor:
 *                 type: integer
 *                 default: 1
 *               rent_amount:
 *                 type: number
 *                 example: 350000
 *               deposit_amount:
 *                 type: number
 *                 default: 0
 *               size_sqm:
 *                 type: number
 *               bedrooms:
 *                 type: integer
 *                 default: 1
 *               bathrooms:
 *                 type: integer
 *                 default: 1
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved, maintenance]
 *                 default: available
 *     responses:
 *       201:
 *         description: Unit created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Building not found
 */
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

/**
 * @openapi
 * /properties/{propertyId}/buildings/{buildingId}/units/{id}:
 *   put:
 *     tags: [Units]
 *     summary: Update a unit
 *     description: Update unit details or change status (available/occupied/reserved/maintenance).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: buildingId
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
 *               unit_number:
 *                 type: string
 *               unit_type:
 *                 type: string
 *               rent_amount:
 *                 type: number
 *               deposit_amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved, maintenance]
 *     responses:
 *       200:
 *         description: Unit updated
 *       404:
 *         description: Unit not found
 */
router.put('/:id', authorize('SUPER_ADMIN', 'PROPERTY_MANAGER'), auditLogger('UPDATE', 'unit'), update);

/**
 * @openapi
 * /properties/{propertyId}/buildings/{buildingId}/units/{id}:
 *   delete:
 *     tags: [Units]
 *     summary: Soft delete a unit
 *     description: SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: buildingId
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
 *         description: Unit deleted
 *       404:
 *         description: Unit not found
 */
router.delete('/:id', authorize('SUPER_ADMIN'), auditLogger('DELETE', 'unit'), remove);

module.exports = router;
