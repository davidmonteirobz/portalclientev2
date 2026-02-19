import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, FolderOpen } from "lucide-react";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [clienteNome, setClienteNome] = useState("");
  const [servico, setServico] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClienteData() {
      if (!user) return;

      // Buscar nome do perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, empresa_id")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setClienteNome(profile.nome);

        // Buscar dados do portal_clients para pegar o serviço
        if (profile.empresa_id) {
          const { data: portalClient } = await supabase
            .from("portal_clients")
            .select("nome, servico")
            .eq("user_id", user.id)
            .maybeSingle();

          if (portalClient) {
            setClienteNome(portalClient.nome);
            setServico(portalClient.servico);
          }
        }
      }

      setLoading(false);
    }

    fetchClienteData();
  }, [user]);

  if (loading) {
    return (
      <ClienteLayout onboardingAtivo={false}>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout onboardingAtivo={false}>
      <div className="animate-fade-in space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Olá, {clienteNome || "Cliente"}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Bem-vindo(a) ao seu portal.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4">
          <Link
            to="/cliente/entregas"
            className="flex items-center justify-between rounded-2xl bg-primary px-6 py-5 text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <Package className="h-6 w-6" />
              <span className="text-lg font-medium">Ver entregas</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            to="/cliente/materiais"
            className="flex items-center justify-between rounded-2xl border-2 border-primary bg-transparent px-6 py-5 text-primary transition-all hover:bg-primary/5 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <FolderOpen className="h-6 w-6" />
              <span className="text-lg font-medium">Acessar arquivos</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </ClienteLayout>
  );
}
