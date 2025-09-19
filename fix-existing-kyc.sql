-- =====================================================
-- FIX EXISTING KYC DATA SCRIPT
-- =====================================================
-- This script will fix users who have KYC data but is_kyc_complete is false

-- First, let's see what we have
SELECT 
    u.id,
    u.email,
    u.is_kyc_complete,
    up.full_name,
    up.id_number,
    up.phone_number,
    CASE 
        WHEN up.full_name IS NOT NULL OR up.id_number IS NOT NULL OR up.phone_number IS NOT NULL 
        THEN 'HAS_KYC_DATA' 
        ELSE 'NO_KYC_DATA' 
    END as kyc_status
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- Update users who have KYC data but is_kyc_complete is false
UPDATE public.users 
SET is_kyc_complete = true, updated_at = NOW()
WHERE id IN (
    SELECT u.id 
    FROM public.users u
    LEFT JOIN public.user_profiles up ON u.id = up.user_id
    WHERE u.is_kyc_complete = false 
    AND (
        up.full_name IS NOT NULL 
        OR up.id_number IS NOT NULL 
        OR up.phone_number IS NOT NULL
        OR up.address IS NOT NULL
    )
);

-- Show the results after update
SELECT 
    u.id,
    u.email,
    u.is_kyc_complete,
    up.full_name,
    up.id_number,
    up.phone_number,
    u.updated_at
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;
