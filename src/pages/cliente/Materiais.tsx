import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, LayoutDashboard, Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Material {
  id: string;
  nome: string;
  link: string;
}

export default function ClienteMateriais() {
  const { user } = useAuth();
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingAtivo, setOnboardingAtivo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const { data: pc } = await supabase
        .from("portal_clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!pc) { setLoading(false); return; }

      const { data: matData } = await supabase
        .from("client_materiais")
        .select("id, nome, link")
        .eq("portal_client_id", pc.id)
        .order("created_at");

      if (matData) setMateriais(matData);

      const { data: ctx } = await supabase
        .from("client_contexto")
        .select("onboarding_ativo")
        .eq("portal_client_id", pc.id)
        .maybeSingle();

      if (ctx) setOnboardingAtivo(ctx.onboarding_ativo || false);

      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <ClienteLayout onboardingAtivo={onboardingAtivo}>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout onboardingAtivo={onboardingAtivo}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arquivos</h1>
          <p className="text-muted-foreground">Acesse os arquivos do seu projeto</p>
        </div>

        {materiais.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {materiais.map((material, index) => (
              <Card key={material.id} className="group transition-all card-hover animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{material.nome}</h3>
                        <p className="text-sm text-muted-foreground">Clique para acessar</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <a href={material.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium text-foreground">Nenhum arquivo ainda</h3>
            <p className="mt-1 text-sm text-muted-foreground">Seus arquivos aparecerão aqui</p>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">💡 Os arquivos são hospedados externamente. Se tiver problemas de acesso, entre em contato pelo WhatsApp.</p>
        </div>

        {/* CTAs - Mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          <Link to="/cliente/dashboard" className="flex items-center justify-between rounded-2xl bg-primary px-6 py-5 text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
            <div className="flex items-center gap-4"><LayoutDashboard className="h-6 w-6" /><span className="text-lg font-medium">Início</span></div>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/cliente/entregas" className="flex items-center justify-between rounded-2xl border-2 border-primary bg-transparent px-6 py-5 text-primary transition-all hover:bg-primary/5 active:scale-[0.98]">
            <div className="flex items-center gap-4"><Package className="h-6 w-6" /><span className="text-lg font-medium">Entregas</span></div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </ClienteLayout>
  );
}
