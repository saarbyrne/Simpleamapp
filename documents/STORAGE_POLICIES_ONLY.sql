-- Storage RLS Policies for people-photos bucket
-- Run this if the bucket already exists and you just need the policies

-- Set up RLS policies for the bucket
CREATE POLICY "Authenticated users can upload people photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'people-photos');

CREATE POLICY "Public can view people photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'people-photos');

CREATE POLICY "Owners can update their people photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'people-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can delete their people photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'people-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
