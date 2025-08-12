-- Fix session security and remove public access to user_sessions table

-- Drop existing overly permissive policies on user_sessions
DROP POLICY IF EXISTS "Allow public session creation" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow public session delete" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow public session read" ON public.user_sessions;

-- Create restrictive policy that denies all direct access
CREATE POLICY "Deny direct access to sessions" ON public.user_sessions
FOR ALL USING (false);

-- Create secure RPC function to validate and cleanup sessions
CREATE OR REPLACE FUNCTION public.validate_session(
  p_session_token text,
  p_user_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_exists boolean := false;
BEGIN
  -- Check if session exists and is not expired
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_sessions 
    WHERE session_token = p_session_token 
      AND user_id = p_user_id 
      AND expires_at > now()
  ) INTO v_session_exists;
  
  -- Clean up expired sessions
  DELETE FROM public.user_sessions 
  WHERE expires_at < now();
  
  RETURN v_session_exists;
END $$;

-- Create secure RPC function to cleanup user sessions on logout
CREATE OR REPLACE FUNCTION public.cleanup_user_session(
  p_session_token text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE session_token = p_session_token;
  
  RETURN FOUND;
END $$;