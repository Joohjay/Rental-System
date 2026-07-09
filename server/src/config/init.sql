-- RentFlow — Complete Database Schema
-- Run this for a fresh installation
-- ============================================================

CREATE DATABASE IF NOT EXISTS rentflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rentflow_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id    INT UNSIGNED    DEFAULT NULL,
  name          VARCHAR(120)    NOT NULL,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  phone         VARCHAR(20)     DEFAULT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  role          VARCHAR(20)     NOT NULL DEFAULT 'TENANT',
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(200)    NOT NULL,
  slug                VARCHAR(200)    NOT NULL UNIQUE,
  logo_url            VARCHAR(500)    DEFAULT NULL,
  currency            VARCHAR(3)      DEFAULT 'TZS',
  timezone            VARCHAR(50)     DEFAULT 'Africa/Dar_es_Salaam',
  language            VARCHAR(10)     DEFAULT 'en',
  receipt_footer      TEXT            DEFAULT NULL,
  default_rent_due_day TINYINT UNSIGNED DEFAULT 5,
  theme               ENUM('light','dark','auto') DEFAULT 'light',
  tax_rate            DECIMAL(5,2)    DEFAULT 0.00,
  contact_email       VARCHAR(255)    DEFAULT NULL,
  contact_phone       VARCHAR(20)     DEFAULT NULL,
  address             TEXT            DEFAULT NULL,
  is_active           TINYINT(1)      NOT NULL DEFAULT 1,
  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id    INT UNSIGNED    NOT NULL,
  name          VARCHAR(200)    NOT NULL,
  description   TEXT            DEFAULT NULL,
  address       TEXT            DEFAULT NULL,
  city          VARCHAR(100)    DEFAULT NULL,
  region        VARCHAR(100)    DEFAULT NULL,
  country       VARCHAR(100)    DEFAULT 'Tanzania',
  latitude      DECIMAL(10,7)   DEFAULT NULL,
  longitude     DECIMAL(10,7)   DEFAULT NULL,
  image_url     VARCHAR(500)    DEFAULT NULL,
  status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP       NULL DEFAULT NULL,
  INDEX idx_properties_company (company_id),
  INDEX idx_properties_status (status),
  CONSTRAINT fk_properties_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buildings
CREATE TABLE IF NOT EXISTS buildings (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property_id   INT UNSIGNED    NOT NULL,
  name          VARCHAR(200)    NOT NULL,
  description   TEXT            DEFAULT NULL,
  floors        INT UNSIGNED    DEFAULT 1,
  image_url     VARCHAR(500)    DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP       NULL DEFAULT NULL,
  INDEX idx_buildings_property (property_id),
  CONSTRAINT fk_buildings_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Units
CREATE TABLE IF NOT EXISTS units (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  building_id     INT UNSIGNED    NOT NULL,
  unit_number     VARCHAR(50)     NOT NULL,
  unit_type       VARCHAR(50)     DEFAULT 'studio',
  floor           INT UNSIGNED    DEFAULT 1,
  rent_amount     DECIMAL(12,2)   NOT NULL,
  deposit_amount  DECIMAL(12,2)   DEFAULT 0.00,
  size_sqm        DECIMAL(8,2)    DEFAULT NULL,
  bedrooms        INT UNSIGNED    DEFAULT 1,
  bathrooms       INT UNSIGNED    DEFAULT 1,
  status          ENUM('available','occupied','reserved','maintenance') NOT NULL DEFAULT 'available',
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP       NULL DEFAULT NULL,
  INDEX idx_units_building (building_id),
  INDEX idx_units_status (status),
  INDEX idx_units_type (unit_type),
  CONSTRAINT fk_units_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id    INT UNSIGNED    DEFAULT NULL,
  user_id       INT UNSIGNED    DEFAULT NULL,
  user_name     VARCHAR(200)    NOT NULL,
  user_role     VARCHAR(20)     DEFAULT NULL,
  action        VARCHAR(50)     NOT NULL,
  resource_type VARCHAR(50)     NOT NULL,
  resource_id   INT UNSIGNED    DEFAULT NULL,
  description   TEXT            DEFAULT NULL,
  metadata      JSON            DEFAULT NULL,
  ip_address    VARCHAR(45)     DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_company (company_id),
  INDEX idx_activity_user (user_id),
  INDEX idx_activity_resource (resource_type, resource_id),
  INDEX idx_activity_created (created_at),
  CONSTRAINT fk_activity_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Foreign key for users
ALTER TABLE users
  ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- Seed default company
INSERT IGNORE INTO companies (id, name, slug) VALUES (1, 'RentFlow', 'rentflow');
