
-- Create a function to set configuration for the current session
-- This is needed for Row Level Security policies to work with our custom user context
CREATE OR REPLACE FUNCTION set_config(setting_name text, setting_value text, is_local boolean DEFAULT true)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
  RETURN setting_value;
END;
$$;
