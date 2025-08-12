-- Add RPC function for changing visual password
CREATE OR REPLACE FUNCTION public.change_visual_password(
  p_user_id uuid,
  p_current_clicks jsonb,
  p_new_clicks jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user public.users%ROWTYPE;
BEGIN
  -- Get user and verify current password
  SELECT * INTO v_user
  FROM public.users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Verify current password using the helper function
  IF NOT public.verify_visual_clicks(v_user.password_clicks, p_current_clicks, 50) THEN
    RETURN FALSE;
  END IF;

  -- Update to new password
  UPDATE public.users
  SET password_clicks = p_new_clicks,
      session_expires_at = now() + interval '7 days'
  WHERE id = p_user_id;

  RETURN TRUE;
END $$;