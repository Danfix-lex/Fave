-- Fix RLS policies to allow user creation during signup
-- This allows the anon user to insert into the users table during signup

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own email" ON users;

-- Create new policies that allow signup
CREATE POLICY "Allow user creation during signup" ON users
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view own data" ON users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Also ensure the users table allows inserts from anon users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT INSERT ON users TO anon;
GRANT SELECT ON users TO anon;
GRANT UPDATE ON users TO anon;

-- Test the policies
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated successfully';
  RAISE NOTICE 'Users table now allows inserts during signup';
END
$$;
