import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronRight, Package, Calendar, FolderOpen, LayoutDashboard, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Entrega {
  id: string;
  nome: string;
  status: "em_revisao" | "aprovado" | "ajuste_solicitado";
  created_at: string;
}

export default function ClienteEntregas() {
  const { user } = useAuth();
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingAtivo, setOnboardingAtivo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Get portal_client for current user
      const { data: pc } = await supabase.
      from("portal_clients").
      select("id").
      eq("user_id", user.id).
      maybeSingle();

      if (!pc) {setLoading(false);return;}

      // Fetch entregas
      const { data: entregasData } = await supabase.
      from("client_entregas").
      select("id, nome, status, created_at").
      eq("portal_client_id", pc.id).
      order("created_at");

      if (entregasData) {
        setEntregas(entregasData.map((e: any) => ({ id: e.id, nome: e.nome, status: e.status, created_at: e.created_at })));
      }

      // Check onboarding
      const { data: ctx } = await supabase.
      from("client_contexto").
      select("onboarding_ativo").
      eq("portal_client_id", pc.id).
      maybeSingle();

      if (ctx) setOnboardingAtivo(ctx.onboarding_ativo || false);

      setLoading(false);
    }
    fetchData();
  }, [user]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <ClienteLayout onboardingAtivo={onboardingAtivo}>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </ClienteLayout>);

  }

  return (
    <ClienteLayout onboardingAtivo={onboardingAtivo}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entregas</h1>
          <p className="text-muted-foreground">Visualize e aprove suas entregas</p>
        </div>

        <div className="space-y-3">
          {entregas.map((entrega, index) =>
          <Link key={entrega.id} to={`/cliente/entrega-detalhe?id=${entrega.id}`} className="block">
              <Card className="group transition-all card-hover animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:flex">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{entrega.nome}</h3>
                      <div className="mt-2 flex items-center justify-between gap-3 sm:justify-start">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(entrega.created_at)}</span>
                        </div>
                        <StatusBadge variant={entrega.status === "aprovado" ? "success" : entrega.status === "ajuste_solicitado" ? "warning" : "warning"}>
                          {entrega.status === "aprovado" ? "Aprovado" : entrega.status === "ajuste_solicitado" ? "Ajuste solicitado" : "Em revisão"}
                        </StatusBadge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {entregas.length === 0 &&
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium text-foreground">Nenhuma entrega ainda</h3>
            <p className="mt-1 text-sm text-muted-foreground">Suas entregas aparecerão aqui</p>
          </div>
        }

        {/* CTAs - Mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          <Link to="/cliente/materiais" className="flex items-center justify-between rounded-2xl bg-primary px-6 py-5 text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
            <div className="flex items-center gap-4"><FolderOpen className="h-6 w-6" /><span className="text-lg font-medium">Arquivos</span></div>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/cliente/dashboard" className="flex items-center justify-between rounded-2xl border-2 border-primary bg-transparent px-6 py-5 text-primary transition-all hover:bg-primary/5 active:scale-[0.98]">
            <div className="flex items-center gap-4"><LayoutDashboard className="h-6 w-6" /><span className="text-lg font-medium">Início</span></div>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </ClienteLayout>);

}