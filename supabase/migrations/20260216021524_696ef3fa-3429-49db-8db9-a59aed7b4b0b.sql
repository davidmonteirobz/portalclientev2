
-- Table for portal access users per client
CREATE TABLE public.portal_client_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_client_id UUID NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portal_client_users ENABLE ROW LEVEL SECURITY;

-- Only empresa owners (who own the parent portal_client) can manage these records
CREATE POLICY "Empresa owners can view client users"
  ON public.portal_client_users FOR SELECT
  USING (
    portal_client_id IN (
      SELECT pc.id FROM portal_clients pc
      JOIN empresas e ON e.id = pc.empresa_id
      WHERE e.owner_id = auth.uid()
    )
  );

CREATE POLICY "Empresa owners can insert client users"
  ON public.portal_client_users FOR INSERT
  WITH CHECK (
    portal_client_id IN (
      SELECT pc.id FROM portal_clients pc
      JOIN empresas e ON e.id = pc.empresa_id
      WHERE e.owner_id = auth.uid()
    )
  );

CREATE POLICY "Empresa owners can update client users"
  ON public.portal_client_users FOR UPDATE
  USING (
    portal_client_id IN (
      SELECT pc.id FROM portal_clients pc
      JOIN empresas e ON e.id = pc.empresa_id
      WHERE e.owner_id = auth.uid()
    )
  );

CREATE POLICY "Empresa owners can delete client users"
  ON public.portal_client_users FOR DELETE
  USING (
    portal_client_id IN (
      SELECT pc.id FROM portal_clients pc
      JOIN empresas e ON e.id = pc.empresa_id
      WHERE e.owner_id = auth.uid()
    )
  );
