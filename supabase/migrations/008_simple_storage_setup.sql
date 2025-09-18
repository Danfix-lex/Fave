-- Simple storage setup for file uploads
-- This creates the necessary storage buckets with basic permissions

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-photos', 'profile-photos', true),
  ('identity-documents', 'identity-documents', false),
  ('song-files', 'song-files', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Simple policies for profile photos (public)
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own profile photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-photos' AND 
    auth.role() = 'authenticated'
  );

-- Simple policies for identity documents (private)
CREATE POLICY "Users can upload identity documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'identity-documents' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view their own identity documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'identity-documents' AND 
    auth.role() = 'authenticated'
  );

-- Simple policies for song files (public)
CREATE POLICY "Song files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'song-files');

CREATE POLICY "Authenticated users can upload song files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'song-files' AND 
    auth.role() = 'authenticated'
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
