# RentFlow

> Smart Property Rental Management System for Landlords, Property Managers, and Tenants.

A professional multi-tenant SaaS property management platform built for the Tanzanian market. Supports M-Pesa, Airtel Money, Tigo Pesa, and traditional payment methods.

---

## Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Axios, Recharts |
| **Backend**  | Node.js, Express.js, JWT, bcrypt, mysql2                    |
| **Database** | MySQL 8                                                     |
| **Storage**  | Cloudinary                                                  |
| **Deploy**   | Vercel (frontend), Render (backend), Railway (DB)           |

---

## Architecture

```
Client (React)
    ↓
Routes (React Router)
    ↓
API Layer (Axios)
    ↓
Express Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
MySQL Database
```

Clean layered architecture. Business logic lives in **Services**. SQL lives in **Repositories**. Controllers only handle request/response.

---

## User Roles

| Role               | Permissions                                                   |
| ------------------ | ------------------------------------------------------------- |
| **SUPER_ADMIN**    | Manage companies, users, system settings, platform analytics  |
| **PROPERTY_MANAGER** | Manage properties, buildings, units, tenants, leases, payments |
| **LANDLORD**       | View owned properties, income, expense, occupancy reports     |
| **CARETAKER**      | View assigned buildings, handle maintenance requests          |
| **TENANT**         | View lease, pay rent, submit maintenance requests, receipts   |

---

## Current Phase Status

### ✅ Phase 1 — Foundation
- Project scaffolding (Vite + Express)
- Folder structure (client/server/docs)
- All dependencies installed
- Tailwind CSS configured
- Express middleware stack (helmet, cors, morgan, etc.)

### ✅ Phase 2 — Authentication
- User registration & login with bcrypt (12 rounds)
- JWT token generation & verification
- Auth middleware (Bearer + cookie)
- Validation middleware
- Central error handling
- Frontend: AuthContext, ProtectedRoute, Login, Register, Dashboard

### ✅ Phase 3 — Company & Property Management *(In Progress)*
- Multi-tenant schema (companies, properties, buildings, units)
- Soft deletes, audit timestamps
- Activity logging for all CRUD operations
- Role-based authorization middleware
- Cloudinary image upload config
- Company CRUD with settings (currency, timezone, theme, tax rate, etc.)
- Property CRUD with search & pagination
- Building CRUD
- Unit CRUD with filters

---

## Project Structure

```
RentFlow/
├── client/                    # React frontend
│   └── src/
│       ├── api/               # Axios instance & API functions
│       ├── assets/            # Images, fonts
│       ├── components/        # Reusable UI components
│       ├── contexts/          # React Context providers
│       ├── hooks/             # Custom React hooks
│       ├── layouts/           # Page layout wrappers
│       ├── pages/             # Page components (by module)
│       ├── routes/            # Route config & protected routes
│       └── utils/             # Utility functions
├── server/                    # Express backend
│   └── src/
│       ├── config/            # DB, Cloudinary, env config
│       ├── controllers/       # Request handlers
│       ├── middleware/        # Auth, validation, audit, error handling
│       ├── repositories/      # SQL queries (data access layer)
│       ├── routes/            # Route definitions
│       ├── services/          # Business logic
│       └── utils/             # Helpers (AppError, token generation)
├── docs/                      # Documentation
├── .env.example               # Environment variable template
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8
- npm

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd RentFlow

# 2. Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret

# 4. Create database
mysql -u root -p < server/src/config/init.sql

# 5. Run development servers
cd server && npm run dev   # Backend on :5001
cd client && npm run dev   # Frontend on :5173
```

---

## API Overview

| Method | Endpoint                              | Auth          | Description            |
| ------ | ------------------------------------- | ------------- | ---------------------- |
| POST   | `/api/auth/register`                  | —             | Register new user      |
| POST   | `/api/auth/login`                     | —             | Login                  |
| GET    | `/api/auth/me`                        | Authenticated | Get current user       |
| POST   | `/api/auth/logout`                    | Authenticated | Logout                 |
| GET    | `/api/companies`                      | SUPER_ADMIN   | List companies         |
| POST   | `/api/companies`                      | SUPER_ADMIN   | Create company         |
| GET    | `/api/companies/:id`                  | SUPER_ADMIN   | Get company details    |
| PUT    | `/api/companies/:id`                  | SUPER_ADMIN   | Update company         |
| DELETE | `/api/companies/:id`                  | SUPER_ADMIN   | Soft-delete company    |
| GET    | `/api/properties`                     | Manager+      | List properties        |
| POST   | `/api/properties`                     | Manager+      | Create property        |
| GET    | `/api/properties/:id`                 | Manager+      | Get property           |
| PUT    | `/api/properties/:id`                 | Manager+      | Update property        |
| DELETE | `/api/properties/:id`                 | SUPER_ADMIN   | Soft-delete property   |
| GET    | `/api/properties/:propertyId/buildings` | Manager+    | List buildings         |
| POST   | `/api/properties/:propertyId/buildings` | Manager+    | Create building        |
| GET    | `/api/properties/:propertyId/buildings/:buildingId/units` | Manager+ | List units  |
| POST   | `/api/properties/:propertyId/buildings/:buildingId/units` | Manager+ | Create unit   |

---

## Future Phases

| Phase | Features                                                  |
| ----- | --------------------------------------------------------- |
| **4** | Tenant, Landlord, Lease Management, Document Upload       |
| **5** | Payments, Receipts, Invoices, Revenue Dashboard           |
| **6** | Maintenance, Caretaker Portal, Announcements, Expenses    |
| **7** | Analytics, Reports, Charts, Exports (PDF/Excel/CSV)       |
| **8** | Rate Limiting, Email, Password Reset, Deployment, Testing |

---

## License

MIT
