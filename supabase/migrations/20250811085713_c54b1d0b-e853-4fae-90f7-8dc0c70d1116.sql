-- 1) Tighten security on users table and add auth RPCs without breaking app

-- Ensure usernames are unique to avoid timing attacks via enumeration
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON public.users (username);

-- Drop overly permissive public read policy on users
DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies p
    JOIN pg_class c ON p.tablename = c.relname
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.policyname = 'Allow public user read'
      AND n.nspname = 'public'
      AND c.relname = 'users'
  ) THEN
    DROP POLICY "Allow public user read" ON public.users;
  END IF;
END $$;

-- Helper: verify visual password clicks with tolerance (default 50px)
CREATE OR REPLACE FUNCTION public.verify_visual_clicks(
  saved jsonb,
  input jsonb,
  tolerance integer DEFAULT 50
) RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  n1 int;
  n2 int;
  rec record;
BEGIN
  IF saved IS NULL OR input IS NULL THEN
    RETURN FALSE;
  END IF;

  n1 := jsonb_array_length(saved);
  n2 := jsonb_array_length(input);
  IF n1 <> n2 THEN
    RETURN FALSE;
  END IF;

  FOR rec IN
    SELECT s.idx,
           (s.value->>'x')::int AS sx,
           (s.value->>'y')::int AS sy,
           (i.value->>'x')::int AS ix,
           (i.value->>'y')::int AS iy
    FROM jsonb_array_elements(saved) WITH ORDINALITY AS s(value, idx)
    JOIN jsonb_array_elements(input) WITH ORDINALITY AS i(value, idx)
      USING (idx)
  LOOP
    IF sqrt(((rec.sx - rec.ix)^2 + (rec.sy - rec.iy)^2)::numeric) > tolerance THEN
      RETURN FALSE;
    END IF;
  END LOOP;

  RETURN TRUE;
END $$;

-- Secure: Register user and create session server-side
CREATE OR REPLACE FUNCTION public.register_user(
  p_username text,
  p_clicks jsonb
) RETURNS TABLE(
  user_id uuid,
  username text,
  created_at timestamptz,
  last_login timestamptz,
  profile_image_url text,
  session_token text
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user public.users%ROWTYPE;
  v_token text;
BEGIN
  INSERT INTO public.users (username, password_clicks, session_expires_at)
  VALUES (p_username, p_clicks, now() + interval '7 days')
  RETURNING * INTO v_user;

  v_token := gen_random_uuid()::text || '_' || floor(extract(epoch from now())*1000)::bigint::text;

  INSERT INTO public.user_sessions (user_id, session_token, expires_at)
  VALUES (v_user.id, v_token, now() + interval '7 days');

  RETURN QUERY
  SELECT v_user.id, v_user.username, v_user.created_at, v_user.last_login, v_user.profile_image_url, v_token;
END $$;

-- Secure: Login with visual password and create session server-side
CREATE OR REPLACE FUNCTION public.login_with_visual_password(
  p_username text,
  p_clicks jsonb
) RETURNS TABLE(
  user_id uuid,
  username text,
  created_at timestamptz,
  last_login timestamptz,
  profile_image_url text,
  session_token text
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user public.users%ROWTYPE;
  v_token text;
BEGIN
  SELECT * INTO v_user
  FROM public.users
  WHERE username = p_username
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN; -- invalid username
  END IF;

  IF NOT public.verify_visual_clicks(v_user.password_clicks, p_clicks, 50) THEN
    RETURN; -- invalid click pattern
  END IF;

  UPDATE public.users
  SET last_login = now(),
      session_expires_at = now() + interval '7 days'
  WHERE id = v_user.id
  RETURNING * INTO v_user;

  v_token := gen_random_uuid()::text || '_' || floor(extract(epoch from now())*1000)::bigint::text;

  INSERT INTO public.user_sessions (user_id, session_token, expires_at)
  VALUES (v_user.id, v_token, now() + interval '7 days');

  RETURN QUERY
  SELECT v_user.id, v_user.username, v_user.created_at, v_user.last_login, v_user.profile_image_url, v_token;
END $$;

-- Secure: Fetch only safe user fields
CREATE OR REPLACE FUNCTION public.get_user_public(
  p_user_id uuid
) RETURNS TABLE(
  id uuid,
  username text,
  created_at timestamptz,
  last_login timestamptz,
  profile_image_url text
) LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT u.id, u.username, u.created_at, u.last_login, u.profile_image_url
  FROM public.users u
  WHERE u.id = p_user_id
$$;