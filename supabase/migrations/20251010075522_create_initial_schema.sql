/*
  # Initial Database Schema for TerraVilla Real Estate Platform

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `kyc_status` (enum: pending, verified, rejected)
      - `kyc_document_url` (text)
      - `user_type` (enum: buyer, seller, both)
      - `created_at` (timestamptz)
      
    - `plots`
      - `id` (uuid, primary key)
      - `seller_id` (uuid, references users)
      - `owner_name` (text)
      - `owner_aadhaar` (text, encrypted)
      - `property_owner_name` (text)
      - `owner_verified` (boolean)
      - `title` (text)
      - `description` (text)
      - `location_address` (text)
      - `city` (text)
      - `state` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `area_sqft` (integer)
      - `price` (bigint) - stored in paise
      - `price_per_sqft` (integer) - stored in paise
      - `status` (enum: draft, pending_verification, verified, sold)
      - `verification_status` (enum: pending, in_progress, verified, rejected)
      - `blockchain_hash` (text)
      - `images` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `listing_fees`
      - `id` (uuid, primary key)
      - `plot_id` (uuid, references plots)
      - `seller_id` (uuid, references users)
      - `amount` (integer) - fee amount in paise
      - `payment_status` (enum: pending, processing, completed, failed)
      - `payment_method` (text)
      - `payment_gateway_id` (text)
      - `paid_at` (timestamptz)
      - `created_at` (timestamptz)
      
    - `documents`
      - `id` (uuid, primary key)
      - `plot_id` (uuid, references plots)
      - `document_type` (enum)
      - `document_url` (text)
      - `verification_status` (enum)
      - `ai_check_status` (enum: pending, passed, failed)
      - `govt_check_status` (enum: pending, verified, failed)
      - `verified_at` (timestamptz)
      - `rejection_reason` (text)
      - `created_at` (timestamptz)
      
    - `transactions`
      - `id` (uuid, primary key)
      - `plot_id` (uuid, references plots)
      - `buyer_id` (uuid, references users)
      - `seller_id` (uuid, references users)
      - `status` (enum)
      - `offer_price` (bigint) - in paise
      - `final_price` (bigint) - in paise
      - `escrow_status` (enum)
      - `ownership_transferred_at` (timestamptz)
      - `blockchain_transfer_hash` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('buyer', 'seller', 'both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE plot_status AS ENUM ('draft', 'pending_verification', 'verified', 'sold');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'in_progress', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_type AS ENUM ('title_deed', 'survey_map', 'tax_receipt', 'noc', 'encumbrance_certificate', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE check_status AS ENUM ('pending', 'passed', 'failed', 'verified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('interested', 'negotiating', 'escrow', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status AS ENUM ('pending', 'funded', 'released');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  kyc_status kyc_status DEFAULT 'pending',
  kyc_document_url text,
  user_type user_type DEFAULT 'buyer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create plots table
CREATE TABLE IF NOT EXISTS plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_name text NOT NULL,
  owner_aadhaar text NOT NULL,
  property_owner_name text NOT NULL,
  owner_verified boolean DEFAULT false,
  title text NOT NULL,
  description text,
  location_address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  area_sqft integer NOT NULL,
  price bigint NOT NULL,
  price_per_sqft integer NOT NULL,
  status plot_status DEFAULT 'draft',
  verification_status verification_status DEFAULT 'pending',
  blockchain_hash text,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified plots"
  ON plots FOR SELECT
  TO authenticated
  USING (status = 'verified' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert own plots"
  ON plots FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update own plots"
  ON plots FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own plots"
  ON plots FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Create listing_fees table
CREATE TABLE IF NOT EXISTS listing_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id uuid NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount integer NOT NULL DEFAULT 50000,
  payment_status payment_status DEFAULT 'pending',
  payment_method text,
  payment_gateway_id text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE listing_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view own listing fees"
  ON listing_fees FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert own listing fees"
  ON listing_fees FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update own listing fees"
  ON listing_fees FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id uuid NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_url text NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  ai_check_status check_status DEFAULT 'pending',
  govt_check_status check_status DEFAULT 'pending',
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plot owners can view their documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plots
      WHERE plots.id = documents.plot_id
      AND plots.seller_id = auth.uid()
    )
  );

CREATE POLICY "Plot owners can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plots
      WHERE plots.id = documents.plot_id
      AND plots.seller_id = auth.uid()
    )
  );

CREATE POLICY "Plot owners can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plots
      WHERE plots.id = documents.plot_id
      AND plots.seller_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plots
      WHERE plots.id = documents.plot_id
      AND plots.seller_id = auth.uid()
    )
  );

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id uuid NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status transaction_status DEFAULT 'interested',
  offer_price bigint,
  final_price bigint,
  escrow_status escrow_status,
  ownership_transferred_at timestamptz,
  blockchain_transfer_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transaction parties can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Transaction parties can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plots_city ON plots(city);
CREATE INDEX IF NOT EXISTS idx_plots_state ON plots(state);
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
CREATE INDEX IF NOT EXISTS idx_plots_seller_id ON plots(seller_id);
CREATE INDEX IF NOT EXISTS idx_listing_fees_plot_id ON listing_fees(plot_id);
CREATE INDEX IF NOT EXISTS idx_listing_fees_seller_id ON listing_fees(seller_id);
CREATE INDEX IF NOT EXISTS idx_documents_plot_id ON documents(plot_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);