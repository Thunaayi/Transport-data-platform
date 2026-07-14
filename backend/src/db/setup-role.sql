-- =============================================
-- Create a restricted role for backend connections
-- Run this after the new Supabase project is created
-- =============================================

-- Replace [PASSWORD] with a strong password
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD '[PASSWORD]' NOBYPASSRLS;
  END IF;
END
$$;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO app_user;

-- Grant table permissions (read for all, write as needed)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;
GRANT INSERT, UPDATE, DELETE ON transport_events TO app_user;
GRANT INSERT, UPDATE, DELETE ON bus_routes TO app_user;
GRANT INSERT, UPDATE, DELETE ON bus_stops TO app_user;
GRANT INSERT, UPDATE, DELETE ON bus_route_stops TO app_user;
GRANT INSERT, UPDATE, DELETE ON airports TO app_user;

-- Grant sequence permissions (for any serial columns)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_user;
