-- Simplified Fave Platform Migration
-- This migration creates all necessary tables and policies without modifying system tables

-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'fan' CHECK (role IN ('fan', 'creator', 'admin', 'super_admin')),
  is_kyc_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user_profiles table with all enhanced fields
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES public.users(id) PRIMARY KEY,
  full_name TEXT,
  stage_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  phone_number TEXT,
  id_type TEXT,
  id_number TEXT,
  id_document_url TEXT,
  profile_photo_url TEXT,
  bio TEXT,
  social_media JSONB DEFAULT '{}',
  address JSONB DEFAULT '{}',
  distributor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create distributors table
CREATE TABLE IF NOT EXISTS public.distributors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to distributors table if they don't exist
DO $$
BEGIN
  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'distributors' 
    AND table_schema = 'public' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.distributors ADD COLUMN description TEXT;
  END IF;
  
  -- Add website column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'distributors' 
    AND table_schema = 'public' 
    AND column_name = 'website'
  ) THEN
    ALTER TABLE public.distributors ADD COLUMN website TEXT;
  END IF;
  
  -- Add unique constraint on name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'distributors' 
    AND table_schema = 'public' 
    AND constraint_type = 'UNIQUE'
    AND constraint_name LIKE '%name%'
  ) THEN
    ALTER TABLE public.distributors ADD CONSTRAINT distributors_name_unique UNIQUE (name);
  END IF;
END $$;

-- 4. Create songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  audio_file_url TEXT,
  price_per_token_usd DECIMAL(10,2) NOT NULL,
  total_tokens INTEGER NOT NULL DEFAULT 1000,
  tokens_sold INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  release_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create song_submissions table
CREATE TABLE IF NOT EXISTS public.song_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  audio_file_url TEXT,
  price_per_token_usd DECIMAL(10,2) NOT NULL,
  total_tokens INTEGER NOT NULL DEFAULT 1000,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id)
);

-- 6. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create token_purchases table
CREATE TABLE IF NOT EXISTS public.token_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  song_id UUID REFERENCES public.songs(id) NOT NULL,
  quantity INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_reference TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_purchases ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 10. Create RLS policies for user_profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 11. Create RLS policies for distributors table
DROP POLICY IF EXISTS "Distributors are publicly readable" ON public.distributors;
CREATE POLICY "Distributors are publicly readable" ON public.distributors
  FOR SELECT USING (true);

-- 12. Create RLS policies for songs table
DROP POLICY IF EXISTS "Songs are publicly readable" ON public.songs;
CREATE POLICY "Songs are publicly readable" ON public.songs
  FOR SELECT USING (true);

-- 13. Create RLS policies for song_submissions table
DROP POLICY IF EXISTS "Users can view own submissions" ON public.song_submissions;
CREATE POLICY "Users can view own submissions" ON public.song_submissions
  FOR SELECT USING (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Users can insert own submissions" ON public.song_submissions;
CREATE POLICY "Users can insert own submissions" ON public.song_submissions
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

-- 14. Create RLS policies for token_purchases table
DROP POLICY IF EXISTS "Users can view own purchases" ON public.token_purchases;
CREATE POLICY "Users can view own purchases" ON public.token_purchases
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own purchases" ON public.token_purchases;
CREATE POLICY "Users can insert own purchases" ON public.token_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 15. Insert sample distributors (only if table has the correct columns)
DO $$
BEGIN
  -- Check if distributors table exists and has the required columns
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'distributors' 
    AND table_schema = 'public'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'distributors' 
    AND table_schema = 'public' 
    AND column_name = 'description'
  ) THEN
    INSERT INTO public.distributors (name, description, website, is_active) VALUES 
      ('DistroKid', 'Leading music distribution platform for independent artists', 'https://distrokid.com', true),
      ('CD Baby', 'Full-service music distribution and promotion platform', 'https://cdbaby.com', true),
      ('TuneCore', 'Music distribution and publishing administration', 'https://tunecore.com', true),
      ('Amuse', 'Free music distribution and label services', 'https://amus.io', true),
      ('Ditto Music', 'Independent music distribution and label services', 'https://dittomusic.com', true)
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;

-- 16. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_kyc ON public.users(is_kyc_complete);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
CREATE INDEX IF NOT EXISTS idx_song_submissions_status ON public.song_submissions(status);
CREATE INDEX IF NOT EXISTS idx_token_purchases_user_id ON public.token_purchases(user_id);

-- 17. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 18. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_songs_updated_at ON public.songs;
CREATE TRIGGER update_songs_updated_at
    BEFORE UPDATE ON public.songs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 19. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.distributors TO authenticated;
GRANT ALL ON public.songs TO authenticated;
GRANT ALL ON public.song_submissions TO authenticated;
GRANT ALL ON public.token_purchases TO authenticated;
