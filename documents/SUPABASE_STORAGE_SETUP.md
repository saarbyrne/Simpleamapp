# Supabase Storage Setup

## Required Storage Buckets

### 1. People Photos Bucket

**Bucket Name:** `people-photos`

**Configuration:**
- Public bucket: Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

**SQL to create bucket:**
```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('people-photos', 'people-photos', true);

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
```

## Setup Instructions

1. Go to your Supabase project: https://supabase.com/dashboard/project/hjzcimtmdxafilgrfeye

2. Navigate to Storage in the sidebar

3. Click "Create a new bucket"

4. Configure the bucket:
   - Name: `people-photos`
   - Public bucket: ON
   - File size limit: 5242880 (5MB)
   - Allowed MIME types: `image/jpeg,image/png,image/webp`

5. Go to SQL Editor and run the RLS policies above

## Testing

After setup, test the upload functionality:

1. Navigate to /dashboard/players
2. Add a new player
3. Upload a photo (the form will need to be updated to support photo upload)
4. Verify the photo appears in the player table
5. Check the Supabase Storage dashboard to confirm the file was uploaded

## Next Steps

- Update AddPlayerModal to support photo upload
- Update PlayerProfile to support photo upload/change
- Add image optimization/resizing
- Add photo cropping functionality
