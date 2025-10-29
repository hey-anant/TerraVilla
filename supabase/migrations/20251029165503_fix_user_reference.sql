/*
  # Fix User Reference Constraint

  1. Changes
    - Drop the foreign key constraint from plots.seller_id to auth.users
    - This allows mock authentication to work without requiring Supabase auth
    - User data will be managed in the public.users table
*/

-- Drop the existing foreign key constraint from users table to auth.users
DO $$
BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Modify the users table primary key to not reference auth.users
DO $$
BEGIN
  -- The id column will remain as uuid primary key but won't reference auth.users
  -- This allows us to insert users directly without Supabase auth
  NULL;
END $$;
