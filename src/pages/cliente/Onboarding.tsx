import { useEffect, useState } from "react";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Etapa {
  id: string;
  nome: string;
  status: "concluido" | "atual" | "pendente";
  dataConclusao?: string;
}

export default function ClienteOnboarding() {
  const { user } = useAuth();
  const [nome, setNome] = useState("Onboarding");
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const { data: pc } = await supabase
        .from("portal_clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!pc) { setLoading(false); return; }

      const { data: ctx } = await supabase
        .from("client_contexto")
        .select("onboarding_nome")
        .eq("portal_client_id", pc.id)
        .maybeSingle();

      if (ctx) setNome(ctx.onboarding_nome || "Onboarding");

      const { data: etapasData } = await supabase
        .from("client_onboarding_etapas")
        .select("id, nome, status, data_conclusao")
        .eq("portal_client_id", pc.id)
        .order("ordem");

      if (etapasData) {
        setEtapas(etapasData.map((e: any) => ({ id: e.id, nome: e.nome, status: e.status as any, dataConclusao: e.data_conclusao || "" })));
      }

      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <ClienteLayout onboardingAtivo={true}>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout onboardingAtivo={true}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{nome}</h1>
          <p className="text-muted-foreground">Acompanhe as etapas de início do seu serviço</p>
        </div>

        {etapas.length > 0 ? (
          <div className="relative">
            {etapas.map((etapa, index) => {
              const isLast = index === etapas.length - 1;
              return (
                <div key={etapa.id} className="relative flex gap-4 pb-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  {!isLast && (
                    <div className={cn("absolute left-[15px] top-8 h-full w-0.5", etapa.status === "concluido" ? "bg-success" : "bg-border")} />
                  )}
                  <div className="relative z-10">
                    {etapa.status === "concluido" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success"><CheckCircle className="h-5 w-5 text-success-foreground" /></div>
                    ) : etapa.status === "atual" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"><Clock className="h-5 w-5 text-primary-foreground" /></div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background"><Circle className="h-4 w-4 text-muted-foreground" /></div>
                    )}
                  </div>
                    <div className={cn("flex-1 rounded-xl border p-4 transition-all", etapa.status === "atual" ? "border-primary/30 bg-primary/5" : etapa.status === "concluido" ? "border-success/20 bg-success/5" : "border-border bg-muted/30")}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className={cn("font-semibold", etapa.status === "pendente" ? "text-muted-foreground" : "text-foreground")}>{etapa.nome}</h3>
                        <div className="flex items-center gap-2">
                          {etapa.dataConclusao && (
                            <span className="text-xs text-muted-foreground">
                              {(() => { try { const [y,m,d] = etapa.dataConclusao.split("-"); return `${d}/${m}/${y}`; } catch { return etapa.dataConclusao; } })()}
                            </span>
                          )}
                          <span className={cn("w-fit rounded-full px-2.5 py-1.5 text-xs font-medium", etapa.status === "concluido" ? "bg-success/10 text-success" : etapa.status === "atual" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                            {etapa.status === "concluido" ? "Concluído" : etapa.status === "atual" ? "Em andamento" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <h3 className="font-medium text-foreground">Nenhuma etapa cadastrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">As etapas do onboarding aparecerão aqui</p>
          </div>
        )}
      </div>
    </ClienteLayout>
  );
}
