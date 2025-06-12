
-- Drop existing problematic RLS policies for user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow session creation" ON public.user_sessions;

-- Drop existing problematic RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public registration" ON public.users;

-- Create simplified RLS policies for users table
CREATE POLICY "Allow public registration" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (id = (SELECT user_id FROM public.user_sessions WHERE session_token = current_setting('request.headers', true)::json->>'authorization' AND expires_at > now() LIMIT 1) OR auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (id::text = auth.uid()::text);

-- Create simplified RLS policies for user_sessions table
CREATE POLICY "Allow public session creation" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own sessions" 
  ON public.user_sessions 
  FOR DELETE 
  USING (user_id::text = auth.uid()::text);

-- Clean up expired sessions
DELETE FROM public.user_sessions WHERE expires_at < now();
