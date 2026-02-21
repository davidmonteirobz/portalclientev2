import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, FolderOpen, Calendar, Clock, Target } from "lucide-react";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [clienteNome, setClienteNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [onboardingAtivo, setOnboardingAtivo] = useState(false);
  const [proximaAcao, setProximaAcao] = useState<{ descricao: string; prazoData: string; prazoHorario: string } | null>(null);
  const [reuniao, setReuniao] = useState<{ data: string; horario: string; assunto: string } | null>(null);

  useEffect(() => {
    async function fetchClienteData() {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, empresa_id")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setClienteNome(profile.nome);
      }

      // Fetch portal_clients + contexto
      const { data: pc } = await supabase
        .from("portal_clients")
        .select("id, nome")
        .eq("user_id", user.id)
        .maybeSingle();

      if (pc) {
        setClienteNome(pc.nome);

        const { data: ctx } = await supabase
          .from("client_contexto")
          .select("onboarding_ativo, proxima_acao_descricao, proxima_acao_prazo_data, proxima_acao_prazo_horario, reuniao_data, reuniao_horario, reuniao_assunto")
          .eq("portal_client_id", pc.id)
          .maybeSingle();

        if (ctx) {
          setOnboardingAtivo(ctx.onboarding_ativo || false);
          if (ctx.proxima_acao_descricao) {
            setProximaAcao({
              descricao: ctx.proxima_acao_descricao,
              prazoData: ctx.proxima_acao_prazo_data || "",
              prazoHorario: ctx.proxima_acao_prazo_horario || "",
            });
          }
          if (ctx.reuniao_data || ctx.reuniao_assunto) {
            setReuniao({
              data: ctx.reuniao_data || "",
              horario: ctx.reuniao_horario || "",
              assunto: ctx.reuniao_assunto || "",
            });
          }
        }
      }

      setLoading(false);
    }

    fetchClienteData();
  }, [user]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

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
    <ClienteLayout onboardingAtivo={onboardingAtivo}>
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

        {/* Info Cards: Próxima Ação + Reunião */}
        {(proximaAcao || reuniao) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {proximaAcao && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Próxima Ação</h3>
                </div>
                <p className="text-foreground font-medium">{proximaAcao.descricao}</p>
                {(proximaAcao.prazoData || proximaAcao.prazoHorario) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {proximaAcao.prazoData && formatDate(proximaAcao.prazoData)}
                      {proximaAcao.prazoHorario && ` às ${proximaAcao.prazoHorario}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {reuniao && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-5 w-5" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Próxima Reunião</h3>
                </div>
                {reuniao.assunto && (
                  <p className="text-foreground font-medium">{reuniao.assunto}</p>
                )}
                {(reuniao.data || reuniao.horario) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {reuniao.data && formatDate(reuniao.data)}
                      {reuniao.horario && ` às ${reuniao.horario}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
