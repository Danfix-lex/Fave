-- Fix storage buckets and permissions for file uploads
-- This migration ensures all necessary storage buckets exist with proper permissions

-- Create storage buckets for different file types
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-photos', 'profile-photos', true),
  ('identity-documents', 'identity-documents', false),
  ('song-files', 'song-files', true),
  ('song-covers', 'song-covers', true),
  ('song-audio', 'song-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own identity documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own identity documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload song files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view song files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload song covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view song covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload song audio" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view song audio" ON storage.objects;

-- Profile Photos Policies (Public)
CREATE POLICY "Users can upload own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update own profile photos" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete own profile photos" ON storage.objects
  FOR DELETE WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid() IS NOT NULL
  );

-- Identity Documents Policies (Private)
CREATE POLICY "Users can upload their own identity documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'identity-documents' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view their own identity documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'identity-documents' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their own identity documents" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'identity-documents' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their own identity documents" ON storage.objects
  FOR DELETE WITH CHECK (
    bucket_id = 'identity-documents' AND 
    auth.uid() IS NOT NULL
  );

-- Song Files Policies (Public)
CREATE POLICY "Users can upload song files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'song-files' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view song files" ON storage.objects
  FOR SELECT USING (bucket_id = 'song-files');

CREATE POLICY "Users can update song files" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'song-files' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete song files" ON storage.objects
  FOR DELETE WITH CHECK (
    bucket_id = 'song-files' AND 
    auth.uid() IS NOT NULL
  );

-- Song Covers Policies (Public)
CREATE POLICY "Users can upload song covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'song-covers' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view song covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'song-covers');

CREATE POLICY "Users can update song covers" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'song-covers' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete song covers" ON storage.objects
  FOR DELETE WITH CHECK (
    bucket_id = 'song-covers' AND 
    auth.uid() IS NOT NULL
  );

-- Song Audio Policies (Public)
CREATE POLICY "Users can upload song audio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'song-audio' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view song audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'song-audio');

CREATE POLICY "Users can update song audio" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'song-audio' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete song audio" ON storage.objects
  FOR DELETE WITH CHECK (
    bucket_id = 'song-audio' AND 
    auth.uid() IS NOT NULL
  );

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a function to check if user is authenticated
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid()
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_name ON storage.objects(name);
CREATE INDEX IF NOT EXISTS idx_storage_objects_owner ON storage.objects(owner);
