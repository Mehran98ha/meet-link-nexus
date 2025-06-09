
-- Create a table for storing meet links
CREATE TABLE public.meet_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meet_links ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is a public sharing platform)
CREATE POLICY "Anyone can view meet links" 
  ON public.meet_links 
  FOR SELECT 
  USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Anyone can create meet links" 
  ON public.meet_links 
  FOR INSERT 
  WITH CHECK (true);

-- Enable real-time functionality for the table
ALTER TABLE public.meet_links REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.meet_links;
