-- =====================================================
-- FAVE DATABASE CLEANUP SCRIPT
-- =====================================================
-- This script will clean up your database by removing all data
-- and resetting it to a fresh state
-- =====================================================

-- WARNING: This will delete ALL data from your database!
-- Make sure you have backups if needed

-- =====================================================
-- 1. DISABLE ROW LEVEL SECURITY TEMPORARILY
-- =====================================================
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.distributors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.song_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.songs DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. DELETE ALL DATA FROM TABLES (in correct order)
-- =====================================================

-- Delete from user_profiles first (has foreign key to users)
DELETE FROM public.user_profiles;

-- Delete from users
DELETE FROM public.users;

-- Delete from song_submissions (if exists)
DELETE FROM public.song_submissions;

-- Delete from songs (if exists)
DELETE FROM public.songs;

-- Delete from distributors
DELETE FROM public.distributors;

-- =====================================================
-- 3. RESET SEQUENCES (if any exist)
-- =====================================================
-- Reset any auto-increment sequences to start from 1
-- (PostgreSQL doesn't have auto-increment, but if you have sequences)

-- =====================================================
-- 4. RE-ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.song_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.songs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. VERIFY CLEANUP
-- =====================================================
-- Check that all tables are empty
SELECT 'user_profiles' as table_name, COUNT(*) as row_count FROM public.user_profiles
UNION ALL
SELECT 'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'distributors' as table_name, COUNT(*) as row_count FROM public.distributors
UNION ALL
SELECT 'song_submissions' as table_name, COUNT(*) as row_count FROM public.song_submissions
UNION ALL
SELECT 'songs' as table_name, COUNT(*) as row_count FROM public.songs;

-- =====================================================
-- 6. RE-INSERT DEFAULT DISTRIBUTORS (OPTIONAL)
-- =====================================================
-- If you want to add some default distributors back
INSERT INTO public.distributors (id, name, description, website, is_active, created_at) VALUES
(gen_random_uuid(), 'DistroKid', 'Leading music distribution platform', 'https://distrokid.com', true, NOW()),
(gen_random_uuid(), 'CD Baby', 'Independent music distribution', 'https://cdbaby.com', true, NOW()),
(gen_random_uuid(), 'TuneCore', 'Music distribution and publishing', 'https://tunecore.com', true, NOW()),
(gen_random_uuid(), 'Amuse', 'Free music distribution', 'https://amuse.io', true, NOW()),
(gen_random_uuid(), 'AWAL', 'Artist-first distribution', 'https://awal.com', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 7. FINAL VERIFICATION
-- =====================================================
-- Check the final state
SELECT 'Cleanup completed successfully!' as status;
SELECT 'user_profiles' as table_name, COUNT(*) as row_count FROM public.user_profiles
UNION ALL
SELECT 'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'distributors' as table_name, COUNT(*) as row_count FROM public.distributors;

-- =====================================================
-- END OF CLEANUP SCRIPT
-- =====================================================
