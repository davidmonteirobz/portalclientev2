
-- Allow clients to update their own entregas (status, ajuste_texto, ajuste_data_hora)
CREATE POLICY "Clients can update own entregas"
ON public.client_entregas
FOR UPDATE
USING (portal_client_id IN (
  SELECT portal_clients.id FROM portal_clients WHERE portal_clients.user_id = auth.uid()
))
WITH CHECK (portal_client_id IN (
  SELECT portal_clients.id FROM portal_clients WHERE portal_clients.user_id = auth.uid()
));
