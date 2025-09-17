/*
  # Fave Platform - Complete Database Setup
  Run this script in your Supabase SQL Editor to set up the entire database
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('creator', 'fan', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('album', 'book', 'movie');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('token_purchase', 'revenue_payout', 'wallet_deposit');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS revenue_payouts CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS token_holdings CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS distributors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (core authentication)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role user_role NOT NULL,
  is_kyc_complete boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Distributors table (for creator selection)
CREATE TABLE distributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User profiles table (KYC information)
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  stage_name text,
  distributor_id uuid REFERENCES distributors(id),
  id_number text NOT NULL,
  profile_photo_url text,
  wallet_balance decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Projects table (creator tokenized projects)
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  project_type project_type NOT NULL,
  royalty_percentage integer NOT NULL CHECK (royalty_percentage > 0 AND royalty_percentage <= 100),
  token_price decimal(10,2) NOT NULL CHECK (token_price > 0),
  total_tokens integer NOT NULL,
  tokens_sold integer DEFAULT 0,
  total_raised decimal(10,2) DEFAULT 0.00,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Token holdings table (fan investments)
CREATE TABLE token_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tokens_owned integer NOT NULL CHECK (tokens_owned > 0),
  total_invested decimal(10,2) NOT NULL CHECK (total_invested > 0),
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(fan_id, project_id)
);

-- Transactions table (all platform transactions)
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  project_id uuid REFERENCES projects(id),
  transaction_type transaction_type NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  tokens integer,
  payment_reference text,
  status transaction_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Revenue payouts table (distributor revenue tracking)
CREATE TABLE revenue_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount > 0),
  payout_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  processed_at timestamptz DEFAULT now()
);

-- Insert default distributors
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

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_payouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile data" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view active distributors" ON distributors;
DROP POLICY IF EXISTS "Anyone can view active projects" ON projects;
DROP POLICY IF EXISTS "Creators can insert own projects" ON projects;
DROP POLICY IF EXISTS "Creators can update own projects" ON projects;
DROP POLICY IF EXISTS "Fans can view own holdings" ON token_holdings;
DROP POLICY IF EXISTS "Fans can insert own holdings" ON token_holdings;
DROP POLICY IF EXISTS "Fans can update own holdings" ON token_holdings;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can view revenue payouts" ON revenue_payouts;
DROP POLICY IF EXISTS "Creators can insert payouts for own projects" ON revenue_payouts;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_profiles table
CREATE POLICY "Users can view own profile data" ON user_profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile data" ON user_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile data" ON user_profiles 
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for distributors table
CREATE POLICY "Anyone can view active distributors" ON distributors 
  FOR SELECT USING (is_active = true);

-- RLS Policies for projects table
CREATE POLICY "Anyone can view active projects" ON projects 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Creators can insert own projects" ON projects 
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own projects" ON projects 
  FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for token_holdings table
CREATE POLICY "Fans can view own holdings" ON token_holdings 
  FOR SELECT USING (auth.uid() = fan_id);

CREATE POLICY "Fans can insert own holdings" ON token_holdings 
  FOR INSERT WITH CHECK (auth.uid() = fan_id);

CREATE POLICY "Fans can update own holdings" ON token_holdings 
  FOR UPDATE USING (auth.uid() = fan_id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view own transactions" ON transactions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for revenue_payouts table
CREATE POLICY "Anyone can view revenue payouts" ON revenue_payouts 
  FOR SELECT USING (true);

CREATE POLICY "Creators can insert payouts for own projects" ON revenue_payouts 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND creator_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_projects_creator_id ON projects(creator_id);
CREATE INDEX idx_projects_is_active ON projects(is_active);
CREATE INDEX idx_token_holdings_fan_id ON token_holdings(fan_id);
CREATE INDEX idx_token_holdings_project_id ON token_holdings(project_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_revenue_payouts_project_id ON revenue_payouts(project_id);

-- Function to automatically calculate total_tokens based on royalty_percentage
CREATE OR REPLACE FUNCTION calculate_total_tokens()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_tokens = NEW.royalty_percentage * 1000;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate total_tokens on project creation/update
DROP TRIGGER IF EXISTS trigger_calculate_total_tokens ON projects;
CREATE TRIGGER trigger_calculate_total_tokens
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_tokens();

-- Function to update wallet balance after token purchase
CREATE OR REPLACE FUNCTION update_wallet_balance_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'revenue_payout' AND NEW.status = 'completed' THEN
    UPDATE user_profiles 
    SET wallet_balance = wallet_balance + NEW.amount
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update wallet balance on completed revenue payouts
DROP TRIGGER IF EXISTS trigger_update_wallet_balance ON transactions;
CREATE TRIGGER trigger_update_wallet_balance
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_balance_on_transaction();

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for profile photos
DROP POLICY IF EXISTS "Users can upload own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;

CREATE POLICY "Users can upload own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update own profile photos" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Final verification
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
  
  RAISE NOTICE '=== FAVE PLATFORM DATABASE SETUP COMPLETE ===';
  RAISE NOTICE 'Tables created: %', table_count;
  RAISE NOTICE 'Security policies: %', policy_count;
  RAISE NOTICE 'Performance indexes: %', index_count;
  RAISE NOTICE 'Active distributors: %', distributor_count;
  RAISE NOTICE '=== DATABASE READY FOR PRODUCTION ===';
END $$;
