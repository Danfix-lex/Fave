-- Simple schema fix for user_profiles table
-- This will add all missing columns that the KYC form needs

-- First, let's check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY column_name;

-- Add missing columns one by one
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS address JSONB DEFAULT '{}';

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS nationality TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS id_type TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS id_number TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS id_document_url TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS stage_name TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS distributor_id UUID;

-- Add foreign key constraint for distributor_id (only if it doesn't exist)
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

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY column_name;
