-- Storage Buckets Creation
-- Run this AFTER the main migration to create storage buckets

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-photos', 'profile-photos', true),
  ('identity-documents', 'identity-documents', false),
  ('song-files', 'song-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile-photos
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.role() = 'authenticated'
  );

-- Create storage policies for identity-documents
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

-- Create storage policies for song-files
CREATE POLICY "Song files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'song-files');

CREATE POLICY "Authenticated users can upload song files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'song-files' AND 
    auth.role() = 'authenticated'
  );
