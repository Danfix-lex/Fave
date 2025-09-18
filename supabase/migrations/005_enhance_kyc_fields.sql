-- Enhance KYC fields for comprehensive artist verification
-- This migration adds additional fields to the user_profiles table for better KYC compliance

-- Add new columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS id_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS id_document_url TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS address JSONB DEFAULT '{}';

-- Create identity-documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('identity-documents', 'identity-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for identity documents
CREATE POLICY "Users can upload their own identity documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'identity-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own identity documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'identity-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add constraints for data validation
ALTER TABLE public.user_profiles 
ADD CONSTRAINT check_id_type CHECK (id_type IN ('passport', 'drivers_license', 'national_id', 'voters_card', 'other'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_nationality ON public.user_profiles(nationality);
CREATE INDEX IF NOT EXISTS idx_user_profiles_id_type ON public.user_profiles(id_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_date_of_birth ON public.user_profiles(date_of_birth);

-- Update the updated_at trigger to include new fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
