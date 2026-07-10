# RentFlow API Testing Guide

> Use with Thunder Client, Postman, or any REST client.

**Base URL:** `http://localhost:5001/api`

---

## Initial Setup

### 1. Register a SUPER_ADMIN (only if needed)

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "System Admin",
  "email": "admin@rentflow.com",
  "password": "Admin@123",
  "role": "SUPER_ADMIN"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJ...",
  "user": { "id": 3, "name": "System Admin", "email": "admin@rentflow.com", "role": "SUPER_ADMIN", "company_id": null }
}
```

### 2. Login (use this for all subsequent requests)

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@rentflow.com",
  "password": "Admin@123"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": { "id": 3, "name": "System Admin", "email": "admin@rentflow.com", "role": "SUPER_ADMIN", "company_id": null }
}
```

> Save the `token` — all protected endpoints require it as `Authorization: Bearer <token>` header.

---

## 1. Company Endpoints

> All company endpoints require `SUPER_ADMIN` role.

### 1.1 Create Company

```
POST /api/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mlimani Properties Ltd",
  "slug": "mlimani-properties",
  "currency": "TZS",
  "timezone": "Africa/Dar_es_Salaam",
  "language": "en",
  "default_rent_due_day": 5,
  "theme": "light",
  "tax_rate": 18.00,
  "contact_email": "info@mlimani.co.tz",
  "contact_phone": "+255712345678",
  "address": "Plot 123, Mlimani Road, Dar es Salaam"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Company created",
  "data": {
    "id": 2,
    "name": "Mlimani Properties Ltd",
    "slug": "mlimani-properties",
    "currency": "TZS",
    "timezone": "Africa/Dar_es_Salaam",
    "language": "en",
    "theme": "light",
    "tax_rate": "18.00",
    "contact_email": "info@mlimani.co.tz",
    ...
  }
}
```

> After creating a company, re-login so your JWT includes your `company_id`.

**Error (409) — Duplicate slug:**
```json
{ "success": false, "message": "A company with this slug already exists" }
```

### 1.2 List All Companies

```
GET /api/companies
Authorization: Bearer <token>
```

**Success (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "RentFlow", "slug": "rentflow", ... },
    { "id": 2, "name": "Mlimani Properties Ltd", ... }
  ]
}
```

### 1.3 Get Company by ID

```
GET /api/companies/2
Authorization: Bearer <token>
```

**Success (200):** Full company object.

**Error (404):** `{ "success": false, "message": "Company not found" }`

### 1.4 Update Company

```
PUT /api/companies/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "currency": "USD",
  "tax_rate": 0.00,
  "contact_phone": "+255765432100"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Company updated",
  "data": { ... updated company ... }
}
```

### 1.5 Soft Delete Company

```
DELETE /api/companies/2
Authorization: Bearer <token>
```

**Success (200):**
```json
{ "success": true, "message": "Company deleted" }
```

> The company is soft-deleted (`is_active = 0`). It won't appear in the list.

---

## 2. Property Endpoints

> Requires `SUPER_ADMIN` or `PROPERTY_MANAGER`.
> The user must have `company_id` set (re-login after creating a company).

### 2.1 Create Property

```
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sunrise Apartments",
  "description": "Modern apartment complex with ocean view",
  "address": "Plot 45, Ocean Road",
  "city": "Dar es Salaam",
  "region": "Dar es Salaam",
  "country": "Tanzania",
  "status": "active"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Property created",
  "data": {
    "id": 1,
    "company_id": 2,
    "name": "Sunrise Apartments",
    "description": "Modern apartment complex with ocean view",
    "city": "Dar es Salaam",
    "status": "active",
    ...
  }
}
```

### 2.2 List Properties (with search & pagination)

```
GET /api/properties?page=1&limit=10
Authorization: Bearer <token>
```

**With search:**
```
GET /api/properties?search=Sunrise&status=active&page=1&limit=10
Authorization: Bearer <token>
```

**Success (200):**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2.3 Get Property by ID

```
GET /api/properties/1
Authorization: Bearer <token>
```

**Success (200):** Full property object.

### 2.4 Update Property

```
PUT /api/properties/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "inactive",
  "description": "Updated description"
}
```

**Success (200):** `{ "success": true, "message": "Property updated", "data": { ... } }`

### 2.5 Delete Property (SUPER_ADMIN only)

```
DELETE /api/properties/1
Authorization: Bearer <token>
```

**Success (200):** `{ "success": true, "message": "Property deleted" }`

> Property is soft-deleted (`deleted_at` is set). Cascade delete will also soft-delete all buildings and units under it.

---

## 3. Building Endpoints

> Nested under properties: `/api/properties/{propertyId}/buildings`

### 3.1 Create Building

```
POST /api/properties/1/buildings
Authorization: Bearer <token>
Content-Type: application/json

{
  "property_id": 1,
  "name": "Block A",
  "description": "Main residential block",
  "floors": 5
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Building created",
  "data": {
    "id": 1,
    "property_id": 1,
    "name": "Block A",
    "floors": 5,
    ...
  }
}
```

### 3.2 List Buildings

```
GET /api/properties/1/buildings
Authorization: Bearer <token>
```

**Success (200):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

### 3.3 Get Building by ID

```
GET /api/properties/1/buildings/1
Authorization: Bearer <token>
```

### 3.4 Update Building

```
PUT /api/properties/1/buildings/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "floors": 6,
  "description": "Expanded with penthouse floor"
}
```

### 3.5 Delete Building (SUPER_ADMIN only)

```
DELETE /api/properties/1/buildings/1
Authorization: Bearer <token>
```

---

## 4. Unit Endpoints

> Nested: `/api/properties/{propertyId}/buildings/{buildingId}/units`

### 4.1 Create Unit

```
POST /api/properties/1/buildings/1/units
Authorization: Bearer <token>
Content-Type: application/json

{
  "building_id": 1,
  "unit_number": "A101",
  "unit_type": "one_bedroom",
  "floor": 1,
  "rent_amount": 350000,
  "deposit_amount": 350000,
  "size_sqm": 45.5,
  "bedrooms": 1,
  "bathrooms": 1,
  "status": "available"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Unit created",
  "data": {
    "id": 1,
    "building_id": 1,
    "unit_number": "A101",
    "unit_type": "one_bedroom",
    "rent_amount": "350000.00",
    "status": "available",
    ...
  }
}
```

**Error (400) — Missing required fields:**
```json
{ "success": false, "message": "unit_number is required; rent_amount is required" }
```

### 4.2 List Units (with filters)

```
GET /api/properties/1/buildings/1/units?status=available&unit_type=one_bedroom&page=1&limit=20
Authorization: Bearer <token>
```

**Available filter parameters:**
| Parameter  | Example     | Description                 |
|-----------|-------------|-----------------------------|
| status    | available   | Filter by unit status       |
| unit_type | one_bedroom | Filter by type              |
| search    | A101        | Search by unit number       |
| min_rent  | 200000      | Minimum rent amount         |
| max_rent  | 500000      | Maximum rent amount         |
| page      | 1           | Page number                 |
| limit     | 20          | Items per page              |

**Success (200):**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Filter examples:**
```
# Low-rent units
GET /api/properties/1/buildings/1/units?min_rent=100000&max_rent=300000

# Vacant units
GET /api/properties/1/buildings/1/units?status=available

# Specific unit
GET /api/properties/1/buildings/1/units?search=A101
```

### 4.3 Get Unit by ID

```
GET /api/properties/1/buildings/1/units/1
Authorization: Bearer <token>
```

### 4.4 Update Unit

```
PUT /api/properties/1/buildings/1/units/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "rent_amount": 400000,
  "bedrooms": 2
}
```

### 4.5 Change Unit Status

```
PUT /api/properties/1/buildings/1/units/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "occupied"
}
```

**Allowed status values:** `available`, `occupied`, `reserved`, `maintenance`

### 4.6 Delete Unit (SUPER_ADMIN only)

```
DELETE /api/properties/1/buildings/1/units/1
Authorization: Bearer <token>
```

---

## 5. Authorization & Edge Cases to Verify

### 5.1 No Token
```
GET /api/properties
```
**Expected (401):** `{ "success": false, "message": "Authentication required" }`

### 5.2 Invalid/Expired Token
```
GET /api/companies
Authorization: Bearer invalid_token_here
```
**Expected (401):** `{ "success": false, "message": "Invalid or expired token" }`

### 5.3 Wrong Role (TENANT trying to create company)
```
POST /api/companies
Authorization: Bearer <tenant_token>
Content-Type: application/json
{ "name": "Hack" }
```
**Expected (403):** `{ "success": false, "message": "Insufficient permissions" }`

### 5.4 Duplicate Email
```
POST /api/auth/register
Content-Type: application/json
{ "name": "Duplicate", "email": "admin@rentflow.com", "password": "Test@123" }
```
**Expected (409):** `{ "success": false, "message": "Email already registered" }`

### 5.5 Weak Password
```
POST /api/auth/register
Content-Type: application/json
{ "name": "Weak", "email": "weak@test.com", "password": "123" }
```
**Expected (400):** `{ "success": false, "message": "password must be at least 6 characters" }`

### 5.6 Invalid Email Format
```
POST /api/auth/register
Content-Type: application/json
{ "name": "Bad Email", "email": "not-an-email", "password": "Test@123" }
```
**Expected (400):** `{ "success": false, "message": "Invalid email format" }`

### 5.7 Access Other Company's Data
> Create a second company, login as user from company A, try to access property from company B.

### 5.8 Soft Delete Verification
```
DELETE /api/properties/1
Authorization: Bearer <token>

# Then list
GET /api/properties
```
**Expected:** Deleted property should NOT appear in the list.

### 5.9 Wrong Password
```
POST /api/auth/login
Content-Type: application/json
{ "email": "admin@rentflow.com", "password": "WrongPass@123" }
```
**Expected (401):** `{ "success": false, "message": "Invalid email or password" }`

---

## 6. Audit Log Verification

After performing CRUD operations, verify activity is logged:

```sql
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10;
```

Each log should contain:
- `user_name` and `user_role` of who performed the action
- `action` (CREATE / UPDATE / DELETE)
- `resource_type` (company / property / building / unit)
- `resource_id` of the affected record
- `ip_address`

---

## Testing Flow (Recommended Order)

1. Register a SUPER_ADMIN
2. Login → save token
3. **CREATE** a company → save company_id → re-login (JWT now has company_id)
4. **CREATE** a property → save property_id
5. **CREATE** a building → save building_id
6. **CREATE** multiple units with different statuses
7. **Test filters** on units (by status, type, rent range)
8. **Test pagination** on properties and units
9. **Test search** on properties
10. **Test error cases** (no auth, wrong role, invalid data, duplicates)
11. **Verify audit logs** in database
12. **Soft delete** a unit → verify it disappears from list
13. **Update** a company's settings (currency, theme, tax rate)

---

## Test Run Results

Use this table to track your progress:

| # | Endpoint | Status | Notes |
|---|----------|--------|-------|
| 1 | POST /api/auth/register | ✅ / ❌ | |
| 2 | POST /api/auth/login | ✅ / ❌ | |
| 3 | POST /api/companies | ✅ / ❌ | |
| 4 | GET /api/companies | ✅ / ❌ | |
| 5 | PUT /api/companies/:id | ✅ / ❌ | |
| 6 | DELETE /api/companies/:id | ✅ / ❌ | |
| 7 | POST /api/properties | ✅ / ❌ | |
| 8 | GET /api/properties | ✅ / ❌ | |
| 9 | PUT /api/properties/:id | ✅ / ❌ | |
| 10 | DELETE /api/properties/:id | ✅ / ❌ | |
| 11 | POST /api/properties/:id/buildings | ✅ / ❌ | |
| 12 | GET /api/properties/:id/buildings | ✅ / ❌ | |
| 13 | PUT /api/properties/:id/buildings/:bid | ✅ / ❌ | |
| 14 | DELETE /api/properties/:id/buildings/:bid | ✅ / ❌ | |
| 15 | POST /api/properties/:id/buildings/:bid/units | ✅ / ❌ | |
| 16 | GET /api/properties/:id/buildings/:bid/units | ✅ / ❌ | |
| 17 | GET with filters | ✅ / ❌ | |
| 18 | DELETE /api/properties/:id/buildings/:bid/units/:uid | ✅ / ❌ | |
| 19 | No auth (401) | ✅ / ❌ | |
| 20 | Wrong role (403) | ✅ / ❌ | |
