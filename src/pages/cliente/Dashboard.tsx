import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Package,
  FolderOpen,
  Target,
  Rocket,
  CheckCircle,
  Circle,
} from "lucide-react";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

interface EtapaOnboarding {
  id: string;
  nome: string;
  status: "concluido" | "atual" | "pendente";
}

export default function ClienteDashboard() {
  // Dados mockados que viriam da empresa
  const clienteNome = "Maria";
  const servicoAtivo = "Design Mensal";
  
  // Onboarding
  const onboarding = {
    nome: "Onboarding do Serviço",
    ativo: true,
    etapas: [
      { id: "1", nome: "Reunião inicial", status: "concluido" as const },
      { id: "2", nome: "Briefing", status: "concluido" as const },
      { id: "3", nome: "Envio de materiais", status: "concluido" as const },
      { id: "4", nome: "Setup inicial", status: "atual" as const },
      { id: "5", nome: "Aprovação final", status: "pendente" as const },
    ] as EtapaOnboarding[],
  };
  
  const etapasConcluidas = onboarding.etapas.filter(e => e.status === "concluido").length;
  const totalEtapas = onboarding.etapas.length;
  const progressoOnboarding = Math.round((etapasConcluidas / totalEtapas) * 100);

  // Quando onboarding está ativo, sincroniza com a etapa atual
  const etapaAtual = onboarding.etapas.find(e => e.status === "atual");
  const faseAtual = onboarding.ativo && etapaAtual 
    ? etapaAtual.nome 
    : "Design da Nova Home"; // Fase fixa após onboarding

  const proximaAcao = {
    descricao: "Revisar protótipo da Home",
    prazoData: "03 de Fevereiro",
    prazoHorario: "18:00",
  };
  const proximaReuniao = {
    data: "05 de Fevereiro",
    horario: "14:00",
    assunto: "Revisão do protótipo da home",
  };

  return (
    <ClienteLayout onboardingAtivo={onboarding.ativo}>
      <div className="animate-fade-in space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Olá, {clienteNome}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Acompanhe o andamento do seu{" "}
            <span className="font-medium text-primary">{servicoAtivo}</span>
          </p>
        </div>

        {/* Contexto Atual - Destaque */}
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Agora estamos em
                </p>
                <p className="text-xl font-semibold text-foreground">{faseAtual}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bloco de Onboarding - só aparece quando ativo */}
        {onboarding.ativo && (
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">{onboarding.nome}</h2>
                </div>
                <span className="text-sm text-muted-foreground">{progressoOnboarding}%</span>
              </div>
              <ProgressBar value={progressoOnboarding} size="lg" animated />
              <div className="mt-4 space-y-2">
                {onboarding.etapas.map((etapa) => (
                  <div
                    key={etapa.id}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      etapa.status === "pendente" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {etapa.status === "concluido" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : etapa.status === "atual" ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={cn(etapa.status === "atual" && "font-medium")}>
                      {etapa.nome}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/cliente/onboarding"
                className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Ver detalhes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Grid de Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Próxima Ação */}
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-warning/20">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sua próxima ação
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {proximaAcao.descricao}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Até dia {proximaAcao.prazoData} às {proximaAcao.prazoHorario}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próxima Reunião */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Próxima reunião
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {proximaReuniao.data} às {proximaReuniao.horario}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {proximaReuniao.assunto}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    O link será enviado pelo WhatsApp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <span className="text-lg font-medium">Acessar materiais</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </ClienteLayout>
  );
}
