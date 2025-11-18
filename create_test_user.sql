-- Create test organization
INSERT INTO organizations (id, name, slug, sport) 
VALUES ('test-org-1', 'Test Organization', 'test-org', 'football')
ON CONFLICT (id) DO NOTHING;

-- Create test user (using the authenticated user's email)
INSERT INTO users (id, email, name, organizationId, "authProvider") 
VALUES ('test-user-1', 'byrne.saar@gmail.com', 'Test User', 'test-org-1', 'email')
ON CONFLICT (id) DO NOTHING;

-- Create person record for the user
INSERT INTO persons (id, "firstName", "lastName", email) 
VALUES ('test-person-1', 'Test', 'User', 'byrne.saar@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Link user to person
UPDATE users SET "personId" = 'test-person-1' WHERE id = 'test-user-1';

-- Create person-organization relationship
INSERT INTO person_organizations (id, "personId", "organizationId", role, status) 
VALUES ('test-po-1', 'test-person-1', 'test-org-1', 'coach', 'active')
ON CONFLICT (id) DO NOTHING;
