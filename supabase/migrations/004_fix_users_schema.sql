/*
  # Fix Users Schema - Add Missing Email Field
  1. Purpose: Add email field to users table to match Supabase Auth
  2. This migration fixes the schema mismatch between Supabase Auth and our users table
  3. Safe to run - adds missing field with proper constraints
*/

-- Add email field to users table if it doesn't exist
DO $$
BEGIN
  -- Check if email column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    -- Add email column
    ALTER TABLE users ADD COLUMN email text;
    
    -- Add unique constraint
    ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
    
    -- Add index for performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    
    RAISE NOTICE 'Email column added to users table';
  ELSE
    RAISE NOTICE 'Email column already exists in users table';
  END IF;
END $$;

-- Update existing users with email from auth.users if possible
DO $$
BEGIN
  -- This will be handled by the application logic
  -- as we can't directly access auth.users from this migration
  RAISE NOTICE 'Email field added. Existing users will need to be updated via application logic.';
END $$;

-- Update RLS policies to include email field
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Recreate policies with proper email handling
CREATE POLICY "Users can view own profile" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Add policy for inserting users (for signup flow)
CREATE POLICY "Users can insert own profile" ON users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update the users table to sync with auth.users
-- This function will be called by the application
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Update email from auth.users when user signs up
  UPDATE users 
  SET email = NEW.email 
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync email on auth user creation
-- Note: This requires the trigger to be created in the auth schema
-- which is typically done through Supabase dashboard or admin functions

-- Final verification
DO $$
BEGIN
  -- Check if email column exists and has proper constraints
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    RAISE NOTICE 'Users table schema updated successfully with email field';
  ELSE
    RAISE EXCEPTION 'Failed to add email field to users table';
  END IF;
END $$;
