-- Create proper RLS policies for profile-images storage bucket
-- Allow users to view their own profile images
CREATE POLICY "Users can view their own profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to upload their own profile images
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own profile images
CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);