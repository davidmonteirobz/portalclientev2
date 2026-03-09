CREATE POLICY "Clients can view their empresa"
  ON public.empresas FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT empresa_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );