
-- Add missing columns to portal_clients
ALTER TABLE public.portal_clients
  ADD COLUMN IF NOT EXISTS negocio text,
  ADD COLUMN IF NOT EXISTS servico text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp text;
