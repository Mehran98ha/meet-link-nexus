
-- Add creator_id and updated_at columns to meet_links table
ALTER TABLE public.meet_links 
ADD COLUMN creator_id TEXT NOT NULL DEFAULT '',
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Update existing records to have a default creator_id (they won't be editable by anyone)
UPDATE public.meet_links 
SET creator_id = 'legacy_user_' || id::text 
WHERE creator_id = '';

-- Create RLS policies for secure access control
DROP POLICY IF EXISTS "Anyone can view meet links" ON public.meet_links;
DROP POLICY IF EXISTS "Anyone can create meet links" ON public.meet_links;

-- Policy for SELECT (public read access)
CREATE POLICY "Anyone can view meet links" 
  ON public.meet_links 
  FOR SELECT 
  USING (true);

-- Policy for INSERT (public create access)
CREATE POLICY "Anyone can create meet links" 
  ON public.meet_links 
  FOR INSERT 
  WITH CHECK (true);

-- Policy for UPDATE (creator only)
CREATE POLICY "Only creator can update meet links" 
  ON public.meet_links 
  FOR UPDATE 
  USING (creator_id = current_setting('app.current_user_id', true));

-- Policy for DELETE (creator only) 
CREATE POLICY "Only creator can delete meet links" 
  ON public.meet_links 
  FOR DELETE 
  USING (creator_id = current_setting('app.current_user_id', true));

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_meet_links_updated_at 
    BEFORE UPDATE ON public.meet_links 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
