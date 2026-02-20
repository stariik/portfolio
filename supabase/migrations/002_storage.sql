-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to project images
CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to update project images
CREATE POLICY "Authenticated users can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Allow authenticated users to delete project images
CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
