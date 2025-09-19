-- =====================================================
-- DEBUG KYC DATA SCRIPT
-- =====================================================
-- This script will help us see what KYC data exists in your database

-- Check all users and their KYC status
SELECT 
    u.id,
    u.email,
    u.role,
    u.is_kyc_complete,
    u.created_at,
    u.updated_at,
    up.full_name,
    up.stage_name,
    up.id_number,
    up.id_type,
    up.date_of_birth,
    up.nationality,
    up.phone_number
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- Check if there are any user_profiles records
SELECT 
    user_id,
    full_name,
    stage_name,
    id_number,
    id_type,
    created_at,
    updated_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- Check the exact structure of users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check the exact structure of user_profiles table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
