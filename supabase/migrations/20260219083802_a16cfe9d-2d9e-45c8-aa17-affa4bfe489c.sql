-- Allow clients to view their own portal_clients record
CREATE POLICY "Clients can view own portal_client record"
ON public.portal_clients
FOR SELECT
USING (user_id = auth.uid());
