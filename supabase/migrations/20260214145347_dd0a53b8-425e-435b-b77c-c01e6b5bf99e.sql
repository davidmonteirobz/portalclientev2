
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('empresa', 'cliente');

-- Empresas table
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Portal clients table (empresa invites clients)
CREATE TABLE public.portal_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativo', 'inativo')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at TIMESTAMPTZ,
  UNIQUE (empresa_id, email)
);
ALTER TABLE public.portal_clients ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to get empresa_id for a user
CREATE OR REPLACE FUNCTION public.get_user_empresa_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT empresa_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for empresas
CREATE POLICY "Owners can view their empresa" ON public.empresas
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can update their empresa" ON public.empresas
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can insert empresas" ON public.empresas
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Empresa users can view profiles of their portal clients
CREATE POLICY "Empresa can view client profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    empresa_id = public.get_user_empresa_id(auth.uid())
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for portal_clients
CREATE POLICY "Empresa owners can view their clients" ON public.portal_clients
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE owner_id = auth.uid()));

CREATE POLICY "Empresa owners can insert clients" ON public.portal_clients
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT id FROM public.empresas WHERE owner_id = auth.uid()));

CREATE POLICY "Empresa owners can update clients" ON public.portal_clients
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE owner_id = auth.uid()));

CREATE POLICY "Empresa owners can delete clients" ON public.portal_clients
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE owner_id = auth.uid()));

-- Trigger: auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _nome TEXT;
  _empresa_nome TEXT;
  _empresa_id UUID;
  _role app_role;
BEGIN
  _nome := COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', 'Usuário');
  _empresa_nome := NEW.raw_user_meta_data->>'empresa_nome';
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'empresa');

  IF _role = 'empresa' AND _empresa_nome IS NOT NULL THEN
    INSERT INTO public.empresas (owner_id, nome) VALUES (NEW.id, _empresa_nome) RETURNING id INTO _empresa_id;
  END IF;

  -- Check if this is a client being invited (match by email in portal_clients)
  IF _role = 'cliente' THEN
    SELECT empresa_id INTO _empresa_id FROM public.portal_clients WHERE email = NEW.email AND status = 'pendente' LIMIT 1;
    
    IF _empresa_id IS NOT NULL THEN
      UPDATE public.portal_clients SET user_id = NEW.id, status = 'ativo', activated_at = now() WHERE email = NEW.email AND empresa_id = _empresa_id;
    END IF;
  END IF;

  INSERT INTO public.profiles (user_id, nome, empresa_id) VALUES (NEW.id, _nome, _empresa_id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: when a client confirms their email/logs in, update portal_clients status
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update portal_clients status to ativo when user confirms
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.portal_clients 
    SET status = 'ativo', user_id = NEW.id, activated_at = now()
    WHERE email = NEW.email AND status = 'pendente';
    
    -- Also update profile empresa_id if not set
    UPDATE public.profiles 
    SET empresa_id = (SELECT empresa_id FROM public.portal_clients WHERE email = NEW.email AND status = 'ativo' LIMIT 1)
    WHERE user_id = NEW.id AND empresa_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_login();
