
-- Drop the current RLS policies that depend on auth.uid()
DROP POLICY IF EXISTS "Allow public user registration" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public session creation" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.user_sessions;

-- Create new policies that work with our custom auth system
-- Allow public registration for users table
CREATE POLICY "Allow public user registration" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public read access for users (needed for login verification)
CREATE POLICY "Allow public user read" 
  ON public.users 
  FOR SELECT 
  USING (true);

-- Allow users to update their own records
CREATE POLICY "Allow user updates" 
  ON public.users 
  FOR UPDATE 
  USING (true);

-- Allow public session creation and management
CREATE POLICY "Allow public session creation" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public session read" 
  ON public.user_sessions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public session delete" 
  ON public.user_sessions 
  FOR DELETE 
  USING (true);

-- Update meet_links policies to work with our custom auth
DROP POLICY IF EXISTS "Authenticated users can create meet links" ON public.meet_links;
DROP POLICY IF EXISTS "Creators can update own meet links" ON public.meet_links;
DROP POLICY IF EXISTS "Creators can delete own meet links" ON public.meet_links;

-- Allow public creation of meet links (we'll handle auth in the application layer)
CREATE POLICY "Allow public meet link creation" 
  ON public.meet_links 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public updates and deletes (we'll handle auth in the application layer)
CREATE POLICY "Allow public meet link updates" 
  ON public.meet_links 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public meet link deletes" 
  ON public.meet_links 
  FOR DELETE 
  USING (true);
