-- Fix user_profiles table schema
-- Add missing columns that are referenced in the KYC form

-- Add address column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'address'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN address JSONB DEFAULT '{}';
  END IF;
END $$;

-- Add social_media column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'social_media'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN social_media JSONB DEFAULT '{}';
  END IF;
END $$;

-- Add bio column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'bio'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN bio TEXT;
  END IF;
END $$;

-- Add date_of_birth column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN date_of_birth DATE;
  END IF;
END $$;

-- Add nationality column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'nationality'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN nationality TEXT;
  END IF;
END $$;

-- Add phone_number column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN phone_number TEXT;
  END IF;
END $$;

-- Add id_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'id_type'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN id_type TEXT;
  END IF;
END $$;

-- Add id_number column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'id_number'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN id_number TEXT;
  END IF;
END $$;

-- Add id_document_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'id_document_url'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN id_document_url TEXT;
  END IF;
END $$;

-- Add profile_photo_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN profile_photo_url TEXT;
  END IF;
END $$;

-- Add stage_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'stage_name'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN stage_name TEXT;
  END IF;
END $$;

-- Add distributor_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND column_name = 'distributor_id'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN distributor_id UUID;
  END IF;
END $$;

-- Add foreign key constraint for distributor_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' 
    AND table_schema = 'public' 
    AND constraint_name = 'user_profiles_distributor_id_fkey'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD CONSTRAINT user_profiles_distributor_id_fkey 
    FOREIGN KEY (distributor_id) REFERENCES public.distributors(id);
  END IF;
END $$;
