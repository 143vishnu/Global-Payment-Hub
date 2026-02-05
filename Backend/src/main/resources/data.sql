-- Initialize default users for the application
-- This script runs AFTER Hibernate creates the schema

-- Insert Admin User
INSERT INTO users (id, username, password, role, full_name, email, enabled, created_at, updated_at)
SELECT 1, 'admin', '$2a$10$O5VUOk8a.Dkh9qe3r0qgLeR9vLfH8h8fLgCvF7C8YqKsU8aVQZGJy', 'ADMIN', 'System Administrator', 'admin@gps.com', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert Operations User  
INSERT INTO users (id, username, password, role, full_name, email, enabled, created_at, updated_at)
SELECT 2, 'opsuser', '$2a$10$fQX9kXW9qj8X7eY3qv.zH.KgX8fYcW8fH8YcW8fH8YcW8fH8YcW8fH', 'OPS_USER', 'Operations User', 'ops@gps.com', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'opsuser');

-- Insert Business User
INSERT INTO users (id, username, password, role, full_name, email, enabled, created_at, updated_at)  
SELECT 3, 'business', '$2a$10$fQX9kXW9qj8X7eY3qv.zH.KgX8fYcW8fH8YcW8fH8YcW8fH8YcW8fH', 'BUSINESS_USER', 'Business User', 'business@gps.com', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'business');

-- DEFAULT LOGIN CREDENTIALS:
-- Admin: username=admin, password=admin
-- Ops User: username=opsuser, password=password  
-- Business User: username=business, password=password
