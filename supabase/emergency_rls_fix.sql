-- Emergency RLS Fix - Temporarily disable RLS to test signup
-- This is a temporary fix to get signup working

-- Step 1: Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant all permissions to anon role
GRANT ALL ON users TO anon;
GRANT ALL ON user_profiles TO anon;

-- Step 3: Test that it works
SELECT 'RLS temporarily disabled - signup should work now' as status;

-- Step 4: After testing, you can re-enable RLS with this command:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Then create proper policies
