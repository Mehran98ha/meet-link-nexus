-- Secure RPC for profile image updates
CREATE OR REPLACE FUNCTION public.update_profile_image(
  p_user_id uuid,
  p_image_url text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET profile_image_url = p_image_url
  WHERE id = p_user_id;
  
  RETURN FOUND;
END $$;

-- Restrict direct table access - only allow authenticated operations through functions
DROP POLICY IF EXISTS "Allow user updates" ON public.users;
DROP POLICY IF EXISTS "Allow public user registration" ON public.users;

-- Create restrictive policies that only allow access through functions
CREATE POLICY "Deny direct access" ON public.users
FOR ALL USING (false);