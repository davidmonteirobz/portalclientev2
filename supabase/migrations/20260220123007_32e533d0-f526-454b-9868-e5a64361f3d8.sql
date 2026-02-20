
-- Table for entregas
CREATE TABLE public.client_entregas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  nome text NOT NULL,
  link text NOT NULL DEFAULT '',
  legenda text,
  status text NOT NULL DEFAULT 'em_revisao',
  ajuste_texto text,
  ajuste_data_hora text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_entregas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa owners can manage entregas"
ON public.client_entregas FOR ALL TO authenticated
USING (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()))
WITH CHECK (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()));

CREATE POLICY "Clients can view own entregas"
ON public.client_entregas FOR SELECT TO authenticated
USING (portal_client_id IN (SELECT id FROM portal_clients WHERE user_id = auth.uid()));

-- Table for materiais
CREATE TABLE public.client_materiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  nome text NOT NULL,
  link text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa owners can manage materiais"
ON public.client_materiais FOR ALL TO authenticated
USING (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()))
WITH CHECK (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()));

CREATE POLICY "Clients can view own materiais"
ON public.client_materiais FOR SELECT TO authenticated
USING (portal_client_id IN (SELECT id FROM portal_clients WHERE user_id = auth.uid()));

-- Table for client context (fase, reunião, próxima ação, observações, onboarding)
CREATE TABLE public.client_contexto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_client_id uuid NOT NULL UNIQUE REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  fase_atual text DEFAULT '',
  proxima_acao_descricao text DEFAULT '',
  proxima_acao_prazo_data text DEFAULT '',
  proxima_acao_prazo_horario text DEFAULT '',
  reuniao_data text DEFAULT '',
  reuniao_horario text DEFAULT '',
  reuniao_assunto text DEFAULT '',
  observacoes_internas text DEFAULT '',
  onboarding_nome text DEFAULT 'Onboarding do Serviço',
  onboarding_ativo boolean DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_contexto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa owners can manage contexto"
ON public.client_contexto FOR ALL TO authenticated
USING (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()))
WITH CHECK (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()));

CREATE POLICY "Clients can view own contexto"
ON public.client_contexto FOR SELECT TO authenticated
USING (portal_client_id IN (SELECT id FROM portal_clients WHERE user_id = auth.uid()));

-- Table for onboarding etapas
CREATE TABLE public.client_onboarding_etapas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  nome text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_onboarding_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa owners can manage onboarding etapas"
ON public.client_onboarding_etapas FOR ALL TO authenticated
USING (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()))
WITH CHECK (portal_client_id IN (SELECT pc.id FROM portal_clients pc JOIN empresas e ON e.id = pc.empresa_id WHERE e.owner_id = auth.uid()));

CREATE POLICY "Clients can view own onboarding etapas"
ON public.client_onboarding_etapas FOR SELECT TO authenticated
USING (portal_client_id IN (SELECT id FROM portal_clients WHERE user_id = auth.uid()));
