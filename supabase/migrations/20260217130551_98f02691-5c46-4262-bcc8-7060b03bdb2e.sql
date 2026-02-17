
-- Tabela de convites com token seguro
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_client_id UUID NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Empresa owners podem gerenciar convites dos seus clientes
CREATE POLICY "Empresa owners can manage invites"
  ON public.invites FOR ALL
  USING (empresa_id IN (SELECT id FROM empresas WHERE owner_id = auth.uid()))
  WITH CHECK (empresa_id IN (SELECT id FROM empresas WHERE owner_id = auth.uid()));

-- Permitir leitura anônima por token (para validate-invite funcionar sem auth)
CREATE POLICY "Anyone can read invite by token"
  ON public.invites FOR SELECT
  USING (true);
