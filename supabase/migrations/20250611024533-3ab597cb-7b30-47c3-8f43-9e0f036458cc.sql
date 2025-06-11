
-- Create users table for visual password authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_clicks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  session_expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_sessions table for session management
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (id = (SELECT user_id FROM public.user_sessions WHERE session_token = current_setting('request.jwt.claims', true)::json->>'session_token' AND expires_at > now() LIMIT 1));

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (id = (SELECT user_id FROM public.user_sessions WHERE session_token = current_setting('request.jwt.claims', true)::json->>'session_token' AND expires_at > now() LIMIT 1));

-- Create policies for user_sessions table
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (user_id = (SELECT user_id FROM public.user_sessions WHERE session_token = current_setting('request.jwt.claims', true)::json->>'session_token' AND expires_at > now() LIMIT 1));

CREATE POLICY "Allow public registration" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow session creation" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (true);

-- Update meet_links table to reference users
ALTER TABLE public.meet_links 
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Update existing meet_links to maintain compatibility
UPDATE public.meet_links 
SET user_id = (
  SELECT id FROM public.users 
  WHERE username = meet_links.creator 
  LIMIT 1
);

-- Create index for performance
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON public.user_sessions(expires_at);
CREATE INDEX idx_users_username ON public.users(username);
