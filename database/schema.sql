-- ============================================================
-- Gems Cricket Game Database - Table Creation Script
-- Database: gems_cricket
-- ============================================================

CREATE DATABASE IF NOT EXISTS gems_cricket
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gems_cricket;

-- ============================================================
-- Table: users
-- Stores registered user information
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  phone       VARCHAR(15)       NOT NULL,
  name        VARCHAR(100)      NOT NULL,
  dob         DATE              NOT NULL,
  email       VARCHAR(255)      NOT NULL,
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_phone (phone),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: otps
-- Stores OTP records with expiry for phone verification
-- ============================================================
CREATE TABLE IF NOT EXISTS otps (
  id          INT UNSIGNED       NOT NULL AUTO_INCREMENT,
  phone       VARCHAR(15)        NOT NULL,
  otp         VARCHAR(10)        NOT NULL,
  expires_at  DATETIME           NOT NULL,
  is_used     TINYINT(1)         NOT NULL DEFAULT 0,
  created_at  TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_otps_phone (phone),
  KEY idx_otps_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: scores
-- Stores individual game scores per user per session
-- ============================================================
CREATE TABLE IF NOT EXISTS scores (
  id          INT UNSIGNED       NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED       NOT NULL,
  score       INT UNSIGNED       NOT NULL,
  played_at   TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_scores_user_id (user_id),
  KEY idx_scores_played_at (played_at),
  CONSTRAINT fk_scores_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Verification Queries (Run after creation to verify)
-- ============================================================
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE otps;
-- DESCRIBE scores;
