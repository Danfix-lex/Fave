/*
  # Verification Migration - Confirm Complete Schema Setup
  1. Purpose: Verify all tables, policies, and functions are properly created
  2. This migration checks the existing schema and adds any missing components
  3. Safe to run - uses IF NOT EXISTS patterns
*/

-- Verify and ensure all tables exist with proper structure
DO $$
BEGIN
  -- Check if all required tables exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    RAISE EXCEPTION 'Users table not found - schema incomplete';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    RAISE EXCEPTION 'User profiles table not found - schema incomplete';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'distributors') THEN
    RAISE EXCEPTION 'Distributors table not found - schema incomplete';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    RAISE EXCEPTION 'Projects table not found - schema incomplete';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'token_holdings') THEN
    RAISE EXCEPTION 'Token holdings table not found - schema incomplete';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions') THEN
    RAISE EXCEPTION 'Transactions table not found - schema incomplete';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'revenue_payouts') THEN
    RAISE EXCEPTION 'Revenue payouts table not found - schema incomplete';
  END IF;
  
  RAISE NOTICE 'All required tables verified successfully';
END $$;

-- Verify Row Level Security is enabled
DO $$
BEGIN
  -- Check RLS is enabled on all tables
  IF (SELECT COUNT(*) FROM pg_class WHERE relname IN ('users', 'user_profiles', 'distributors', 'projects', 'token_holdings', 'transactions', 'revenue_payouts') AND relrowsecurity = true) < 7 THEN
    RAISE EXCEPTION 'Row Level Security not properly enabled on all tables';
  END IF;
  
  RAISE NOTICE 'Row Level Security verified on all tables';
END $$;

-- Ensure distributors are populated
INSERT INTO distributors (name) VALUES 
  ('Spotify'),
  ('Apple Music'),
  ('YouTube Music'),
  ('Amazon Music'),
  ('Deezer'),
  ('Tidal'),
  ('SoundCloud'),
  ('Bandcamp'),
  ('DistroKid'),
  ('CD Baby'),
  ('TuneCore'),
  ('Amuse'),
  ('RouteNote'),
  ('LANDR'),
  ('ONErpm')
ON CONFLICT DO NOTHING;

-- Verify distributor count
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM distributors WHERE is_active = true) < 10 THEN
    RAISE EXCEPTION 'Insufficient distributors found - expected at least 10 active distributors';
  END IF;
  
  RAISE NOTICE 'Distributor data verified - % active distributors found', (SELECT COUNT(*) FROM distributors WHERE is_active = true);
END $$;

-- Add any missing indexes (safe with IF NOT EXISTS pattern)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_token_holdings_fan_id ON token_holdings(fan_id);
CREATE INDEX IF NOT EXISTS idx_token_holdings_project_id ON token_holdings(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_revenue_payouts_project_id ON revenue_payouts(project_id);

-- Create storage bucket for profile photos if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for profile photos
CREATE POLICY IF NOT EXISTS "Users can upload own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY IF NOT EXISTS "Anyone can view profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY IF NOT EXISTS "Users can update own profile photos" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Final verification summary
DO $$
DECLARE
  table_count INTEGER;
  policy_count INTEGER;
  index_count INTEGER;
  distributor_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count FROM information_schema.tables 
  WHERE table_name IN ('users', 'user_profiles', 'distributors', 'projects', 'token_holdings', 'transactions', 'revenue_payouts');
  
  SELECT COUNT(*) INTO policy_count FROM pg_policies 
  WHERE schemaname = 'public';
  
  SELECT COUNT(*) INTO index_count FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname LIKE 'idx_%';
  
  SELECT COUNT(*) INTO distributor_count FROM distributors WHERE is_active = true;
  
  RAISE NOTICE '=== FAVE PLATFORM BACKEND VERIFICATION ===';
  RAISE NOTICE 'Tables created: %', table_count;
  RAISE NOTICE 'Security policies: %', policy_count;
  RAISE NOTICE 'Performance indexes: %', index_count;
  RAISE NOTICE 'Active distributors: %', distributor_count;
  RAISE NOTICE '=== BACKEND SETUP COMPLETE ===';
END $$;
