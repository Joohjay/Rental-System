-- ============================================================
-- RentFlow Phase 5: SaaS Marketplace Migration
-- New roles, tables for marketplace, applications, viewings, invitations
-- ============================================================

-- 1. Add new columns to users (profile photo, national ID, preferred city)
ALTER TABLE users
  ADD COLUMN profile_photo_url VARCHAR(500) DEFAULT NULL AFTER password_hash,
  ADD COLUMN national_id       VARCHAR(50)  DEFAULT NULL AFTER profile_photo_url,
  ADD COLUMN preferred_city    VARCHAR(100) DEFAULT NULL AFTER national_id,
  ADD COLUMN tin               VARCHAR(50)  DEFAULT NULL AFTER preferred_city;

-- 2. Add featured and marketplace columns to properties
ALTER TABLE properties
  ADD COLUMN property_type    VARCHAR(50)  DEFAULT 'apartment' AFTER country,
  ADD COLUMN featured         TINYINT(1)   NOT NULL DEFAULT 0 AFTER status,
  ADD COLUMN furnished        VARCHAR(20)  DEFAULT NULL AFTER featured,
  ADD COLUMN parking          TINYINT(1)   NOT NULL DEFAULT 0 AFTER furnished,
  ADD COLUMN pets_allowed     TINYINT(1)   NOT NULL DEFAULT 0 AFTER parking,
  ADD COLUMN year_built       INT UNSIGNED DEFAULT NULL AFTER pets_allowed,
  ADD INDEX idx_properties_featured (featured),
  ADD INDEX idx_properties_type (property_type);

-- 3. Property images gallery
CREATE TABLE IF NOT EXISTS property_images (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property_id   INT UNSIGNED    NOT NULL,
  url           VARCHAR(500)    NOT NULL,
  caption       VARCHAR(200)    DEFAULT NULL,
  is_primary    TINYINT(1)      NOT NULL DEFAULT 0,
  sort_order    INT UNSIGNED    DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pi_property (property_id),
  CONSTRAINT fk_pi_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Amenities lookup
CREATE TABLE IF NOT EXISTS amenities (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL UNIQUE,
  icon          VARCHAR(50)     DEFAULT NULL,
  category      VARCHAR(50)     DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Property-Amenity junction
CREATE TABLE IF NOT EXISTS property_amenities (
  property_id   INT UNSIGNED NOT NULL,
  amenity_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (property_id, amenity_id),
  CONSTRAINT fk_pa_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_amenity  FOREIGN KEY (amenity_id)  REFERENCES amenities(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Nearby places (schools, hospitals, transport)
CREATE TABLE IF NOT EXISTS nearby_places (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property_id   INT UNSIGNED    NOT NULL,
  name          VARCHAR(200)    NOT NULL,
  type          VARCHAR(50)     NOT NULL COMMENT 'school, hospital, transport, shopping, restaurant',
  distance_km   DECIMAL(6,2)    DEFAULT NULL,
  latitude      DECIMAL(10,7)   DEFAULT NULL,
  longitude     DECIMAL(10,7)   DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_np_property (property_id),
  INDEX idx_np_type (type),
  CONSTRAINT fk_np_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Applications
CREATE TABLE IF NOT EXISTS applications (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unit_id       INT UNSIGNED    NOT NULL,
  applicant_id  INT UNSIGNED    NOT NULL,
  status        ENUM('pending','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  employment    TEXT            DEFAULT NULL,
  income        DECIMAL(12,2)  DEFAULT NULL,
  national_id   VARCHAR(50)    DEFAULT NULL,
  references_txt TEXT          DEFAULT NULL,
  message       TEXT           DEFAULT NULL,
  reviewed_by   INT UNSIGNED   DEFAULT NULL,
  reviewed_at   TIMESTAMP      NULL DEFAULT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_app_unit (unit_id),
  INDEX idx_app_applicant (applicant_id),
  INDEX idx_app_status (status),
  CONSTRAINT fk_app_unit       FOREIGN KEY (unit_id)       REFERENCES units(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_applicant  FOREIGN KEY (applicant_id)  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_reviewer   FOREIGN KEY (reviewed_by)   REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Application documents
CREATE TABLE IF NOT EXISTS application_documents (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id  INT UNSIGNED    NOT NULL,
  name            VARCHAR(200)    NOT NULL,
  file_url        VARCHAR(500)    NOT NULL,
  type            VARCHAR(50)     DEFAULT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ad_application (application_id),
  CONSTRAINT fk_ad_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Viewing requests
CREATE TABLE IF NOT EXISTS viewing_requests (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unit_id       INT UNSIGNED    NOT NULL,
  applicant_id  INT UNSIGNED    NOT NULL,
  requested_date DATE           NOT NULL,
  requested_time TIME           NOT NULL,
  message       TEXT            DEFAULT NULL,
  status        ENUM('pending','approved','rejected','rescheduled','cancelled') NOT NULL DEFAULT 'pending',
  manager_note  TEXT            DEFAULT NULL,
  responded_by  INT UNSIGNED    DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vr_unit (unit_id),
  INDEX idx_vr_applicant (applicant_id),
  INDEX idx_vr_status (status),
  CONSTRAINT fk_vr_unit       FOREIGN KEY (unit_id)       REFERENCES units(id) ON DELETE CASCADE,
  CONSTRAINT fk_vr_applicant  FOREIGN KEY (applicant_id)  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_vr_responder  FOREIGN KEY (responded_by)  REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Favorites / Saved Properties
CREATE TABLE IF NOT EXISTS saved_properties (
  user_id       INT UNSIGNED NOT NULL,
  property_id   INT UNSIGNED NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, property_id),
  CONSTRAINT fk_sp_user     FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  CONSTRAINT fk_sp_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id    INT UNSIGNED    NOT NULL,
  invited_by    INT UNSIGNED    NOT NULL,
  email         VARCHAR(255)    NOT NULL,
  name          VARCHAR(120)    DEFAULT NULL,
  role          VARCHAR(20)     NOT NULL COMMENT 'CARETAKER, ACCOUNTANT, PROPERTY_MANAGER, TENANT',
  token         VARCHAR(255)    NOT NULL UNIQUE,
  status        ENUM('pending','accepted','expired','cancelled') NOT NULL DEFAULT 'pending',
  expires_at    TIMESTAMP       NOT NULL,
  accepted_at   TIMESTAMP       NULL DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inv_company (company_id),
  INDEX idx_inv_email (email),
  INDEX idx_inv_status (status),
  CONSTRAINT fk_inv_company   FOREIGN KEY (company_id)  REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_inviter   FOREIGN KEY (invited_by)  REFERENCES users(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED    NOT NULL,
  type          VARCHAR(50)     NOT NULL,
  title         VARCHAR(200)    NOT NULL,
  body          TEXT            DEFAULT NULL,
  data          JSON            DEFAULT NULL,
  is_read       TINYINT(1)      NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (user_id),
  INDEX idx_notif_read (user_id, is_read),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Reviews / Ratings
CREATE TABLE IF NOT EXISTS reviews (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property_id   INT UNSIGNED    NOT NULL,
  user_id       INT UNSIGNED    NOT NULL,
  rating        TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         VARCHAR(200)    DEFAULT NULL,
  comment       TEXT            DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rev_property (property_id),
  INDEX idx_rev_user (user_id),
  CONSTRAINT fk_rev_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_user     FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Seed default amenities
INSERT IGNORE INTO amenities (name, icon, category) VALUES
  ('WiFi', 'wifi', 'utility'),
  ('Air Conditioning', 'wind', 'utility'),
  ('Parking', 'car', 'parking'),
  ('Swimming Pool', 'droplet', 'recreation'),
  ('Gym', 'dumbbell', 'recreation'),
  ('Security', 'shield', 'safety'),
  ('Generator', 'zap', 'utility'),
  ('Water Tank', 'droplet', 'utility'),
  ('Elevator', 'arrow-up-from-line', 'accessibility'),
  ('Wheelchair Access', 'accessibility', 'accessibility'),
  ('CCTV', 'camera', 'safety'),
  ('Furnished', 'sofa', 'interior'),
  ('Balcony', 'building', 'exterior'),
  ('Garden', 'flower', 'exterior'),
  ('Playground', 'child', 'recreation');
