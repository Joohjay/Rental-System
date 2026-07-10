const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RentFlow API',
      version: '1.0.0',
      description: 'Smart Property Rental Management System',
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'LANDLORD', 'CARETAKER', 'TENANT'] },
            company_id: { type: 'integer', nullable: true },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            logo_url: { type: 'string', nullable: true },
            currency: { type: 'string' },
            timezone: { type: 'string' },
            language: { type: 'string' },
            receipt_footer: { type: 'string', nullable: true },
            default_rent_due_day: { type: 'integer' },
            theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
            tax_rate: { type: 'number' },
            contact_email: { type: 'string', nullable: true },
            contact_phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            is_active: { type: 'boolean' },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            company_id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            region: { type: 'string', nullable: true },
            country: { type: 'string' },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            image_url: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['active', 'inactive'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Building: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            property_id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            floors: { type: 'integer' },
            image_url: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Unit: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            building_id: { type: 'integer' },
            unit_number: { type: 'string' },
            unit_type: { type: 'string' },
            floor: { type: 'integer' },
            rent_amount: { type: 'number' },
            deposit_amount: { type: 'number' },
            size_sqm: { type: 'number', nullable: true },
            bedrooms: { type: 'integer' },
            bathrooms: { type: 'integer' },
            status: { type: 'string', enum: ['available', 'occupied', 'reserved', 'maintenance'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: { type: 'object' } },
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
