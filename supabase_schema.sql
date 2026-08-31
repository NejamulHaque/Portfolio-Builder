-- ==============================================================================
-- 🚀 PORTFOLIO BUILDER — COMPLETE SUPABASE DATABASE SCHEMA & POLICIES
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE `portfolios` TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT 'Developer',
    headline TEXT DEFAULT 'Software Engineer',
    bio TEXT DEFAULT 'Building software solutions with modern tech stacks.',
    avatar_url TEXT DEFAULT '',
    location TEXT DEFAULT 'India',
    template TEXT DEFAULT 'minimal',
    theme TEXT DEFAULT 'dark',
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    certificates JSONB DEFAULT '[]'::jsonb,
    contact JSONB DEFAULT '{"email": "", "website": "", "location": ""}'::jsonb,
    socials JSONB DEFAULT '[]'::jsonb,
    views BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_username ON public.portfolios(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_views ON public.portfolios(views DESC);

-- ==============================================================================
-- 3. CREATE `subscriptions` TABLE (Pro Upgrades & UPI Transactions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'Pro Developer',
    transaction_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ==============================================================================
-- 4. RPC FUNCTION: Increment Portfolio Views safely
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.increment_views(portfolio_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.portfolios
  SET views = COALESCE(views, 0) + 1,
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = portfolio_id;
END;
$$;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- --- PORTFOLIOS POLICIES ---

-- 1. Anyone (public visitors & search engines) can view published portfolios
DROP POLICY IF EXISTS "Public can view all portfolios" ON public.portfolios;
CREATE POLICY "Public can view all portfolios" 
ON public.portfolios 
FOR SELECT 
USING (true);

-- 2. Authenticated users can insert their own portfolio
DROP POLICY IF EXISTS "Users can insert their own portfolio" ON public.portfolios;
CREATE POLICY "Users can insert their own portfolio" 
ON public.portfolios 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 3. Authenticated users can update their own portfolio
DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.portfolios;
CREATE POLICY "Users can update their own portfolio" 
ON public.portfolios 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Authenticated users can delete their own portfolio
DROP POLICY IF EXISTS "Users can delete their own portfolio" ON public.portfolios;
CREATE POLICY "Users can delete their own portfolio" 
ON public.portfolios 
FOR DELETE 
TO authenticated 
USING (auth.uid() = id);


-- --- SUBSCRIPTIONS POLICIES ---

-- 1. Users can view their own subscription requests
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id OR auth.jwt()->>'email' IN ('nejamulhaque.works@gmail.com', 'nejamulhaque05@gmail.com'));

-- 2. Authenticated users can submit a subscription request
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions" 
ON public.subscriptions 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 3. Admins can update subscription status (Approve/Reject)
DROP POLICY IF EXISTS "Admins can update subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
TO authenticated 
USING (auth.jwt()->>'email' IN ('nejamulhaque.works@gmail.com', 'nejamulhaque05@gmail.com'))
WITH CHECK (auth.jwt()->>'email' IN ('nejamulhaque.works@gmail.com', 'nejamulhaque05@gmail.com'));

-- 4. Admins can view all subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated 
USING (auth.jwt()->>'email' IN ('nejamulhaque.works@gmail.com', 'nejamulhaque05@gmail.com'));


-- ==============================================================================
-- 6. STORAGE BUCKET CONFIGURATION FOR AVATARS & ASSETS
-- ==============================================================================
-- Create the public 'portfolios' storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy 1: Allow public read access to uploaded images
DROP POLICY IF EXISTS "Public Access to Portfolio Avatars" ON storage.objects;
CREATE POLICY "Public Access to Portfolio Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolios');

-- Storage Policy 2: Allow authenticated users to upload their avatar
DROP POLICY IF EXISTS "Authenticated Users Can Upload Avatars" ON storage.objects;
CREATE POLICY "Authenticated Users Can Upload Avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolios');

-- Storage Policy 3: Allow authenticated users to update/delete avatars
DROP POLICY IF EXISTS "Authenticated Users Can Update Avatars" ON storage.objects;
CREATE POLICY "Authenticated Users Can Update Avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolios');

DROP POLICY IF EXISTS "Authenticated Users Can Delete Avatars" ON storage.objects;
CREATE POLICY "Authenticated Users Can Delete Avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolios');

-- ==============================================================================
-- 🎉 SETUP COMPLETE! ALL TABLES, RPCs, AND POLICIES READY FOR PRODUCTION.
-- ==============================================================================
