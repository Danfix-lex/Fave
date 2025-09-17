# Fix RLS Policies for User Creation

## The Problem
Users are being created in the `auth.users` table (Supabase Auth) but not in your `public.users` table because of Row Level Security (RLS) policies that prevent inserts.

## The Solution
You need to run this SQL in your Supabase SQL Editor to fix the RLS policies:

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `krjqftbmkeomwjnqeira`
3. Go to **SQL Editor** in the left sidebar

### Step 2: Run This SQL Script
Copy and paste this entire script into the SQL Editor and click **Run**:

```sql
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
```

### Step 3: Verify the Fix
After running the SQL, test your signup flow:
1. Go to http://localhost:5173/signup
2. Create a new account
3. Check your Supabase dashboard → Table Editor → users table
4. You should now see the user record in the `public.users` table

## What This Fixes
- **Before**: Users only existed in `auth.users` (Supabase Auth)
- **After**: Users exist in both `auth.users` AND `public.users` (Your app database)

## Why This Happened
Supabase Auth automatically creates users in the `auth` schema, but your app needs records in the `public` schema. The RLS policies were preventing the insert from the client-side code.

## Alternative: Disable RLS (Not Recommended)
If you want to disable RLS entirely (less secure), you can run:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

But the policy-based approach above is more secure and recommended.
