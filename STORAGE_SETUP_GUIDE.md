# Storage Setup Guide

## The Problem
You're getting "storage bucket not found" errors because the storage buckets haven't been created in your Supabase project yet.

## Solution: Create Storage Buckets Manually

### Step 1: Go to Supabase Dashboard
1. Open your browser and go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your Fave project

### Step 2: Navigate to Storage
1. In the left sidebar, click on **"Storage"**
2. You should see an empty storage section

### Step 3: Create the Required Buckets
Create these 3 buckets by clicking **"New bucket"** for each:

#### Bucket 1: profile-photos
- **Name**: `profile-photos`
- **Public**: ✅ **Yes** (checked)
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

#### Bucket 2: identity-documents
- **Name**: `identity-documents`
- **Public**: ❌ **No** (unchecked)
- **File size limit**: `10 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp, application/pdf`

#### Bucket 3: song-files
- **Name**: `song-files`
- **Public**: ✅ **Yes** (checked)
- **File size limit**: `50 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp, audio/mpeg, audio/wav, audio/mp3`

### Step 4: Set Up RLS Policies
After creating the buckets, you need to set up Row Level Security policies:

1. Go to **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste this SQL code:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Profile photos policies (public)
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.role() = 'authenticated'
  );

-- Identity documents policies (private)
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

-- Song files policies (public)
CREATE POLICY "Song files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'song-files');

CREATE POLICY "Authenticated users can upload song files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'song-files' AND 
    auth.role() = 'authenticated'
  );
```

4. Click **"Run"** to execute the SQL

### Step 5: Test Upload
After completing the setup:
1. Go back to your Fave website
2. Try uploading a profile photo or document
3. The upload should now work without errors

## Alternative: Quick Fix
If you want to skip file uploads for now, you can:
1. Complete KYC without uploading documents
2. Set up storage later when you have time
3. The rest of the platform will work fine

## Need Help?
If you're still having issues:
1. Check that all 3 buckets are created
2. Verify the RLS policies are applied
3. Make sure you're signed in when testing uploads
4. Check the browser console for any error messages

The storage setup is a one-time process - once it's done, all file uploads will work perfectly!
