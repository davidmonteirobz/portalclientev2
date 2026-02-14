
-- Trigger para criar perfil/empresa automaticamente no cadastro
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar status do cliente no login
CREATE OR REPLACE TRIGGER on_auth_user_login
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_login();
