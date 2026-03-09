ALTER TABLE public.empresas 
  ADD COLUMN cor_primaria text NOT NULL DEFAULT '#000000',
  ADD COLUMN logo_url text;