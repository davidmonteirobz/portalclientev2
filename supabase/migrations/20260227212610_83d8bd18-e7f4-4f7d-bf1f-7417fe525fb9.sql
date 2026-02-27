
-- Create storage bucket for entregas files
INSERT INTO storage.buckets (id, name, public) VALUES ('entregas', 'entregas', true);

-- Allow empresa owners to upload files
CREATE POLICY "Empresa owners can upload entregas files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'entregas'
  AND auth.uid() IS NOT NULL
);

-- Allow anyone to view entregas files (public bucket)
CREATE POLICY "Anyone can view entregas files"
ON storage.objects FOR SELECT
USING (bucket_id = 'entregas');

-- Allow empresa owners to delete entregas files
CREATE POLICY "Empresa owners can delete entregas files"
ON storage.objects FOR DELETE
USING (bucket_id = 'entregas' AND auth.uid() IS NOT NULL);

-- Allow empresa owners to update entregas files
CREATE POLICY "Empresa owners can update entregas files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'entregas' AND auth.uid() IS NOT NULL);
