
-- First, let's fix the RLS policies to remove infinite recursion
-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public registration" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public session creation" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.user_sessions;

-- Create simple, non-recursive policies for users table
CREATE POLICY "Allow public user registration" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT 
  USING (id::text = auth.uid()::text);

CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (id::text = auth.uid()::text);

-- Create simple policies for user_sessions table
CREATE POLICY "Allow public session creation" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own sessions" 
  ON public.user_sessions 
  FOR DELETE 
  USING (user_id::text = auth.uid()::text);

-- Now let's update meet_links table to allow public viewing
-- Drop existing policies if any
DROP POLICY IF EXISTS "meet_links_select_policy" ON public.meet_links;
DROP POLICY IF EXISTS "meet_links_insert_policy" ON public.meet_links;
DROP POLICY IF EXISTS "meet_links_update_policy" ON public.meet_links;
DROP POLICY IF EXISTS "meet_links_delete_policy" ON public.meet_links;

-- Enable RLS on meet_links table
ALTER TABLE public.meet_links ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all meet links
CREATE POLICY "Allow public read access to meet links" 
  ON public.meet_links 
  FOR SELECT 
  USING (true);

-- Only authenticated users can create meet links
CREATE POLICY "Authenticated users can create meet links" 
  ON public.meet_links 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only creators can update their own meet links
CREATE POLICY "Creators can update own meet links" 
  ON public.meet_links 
  FOR UPDATE 
  USING (user_id::text = auth.uid()::text);

-- Only creators can delete their own meet links
CREATE POLICY "Creators can delete own meet links" 
  ON public.meet_links 
  FOR DELETE 
  USING (user_id::text = auth.uid()::text);
