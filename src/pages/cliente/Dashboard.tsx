import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Package,
  FolderOpen,
  Target,
} from "lucide-react";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { InfoCard } from "@/components/ui/info-card";

export default function ClienteDashboard() {
  // Dados mockados que viriam da empresa
  const clienteNome = "Maria";
  const servicoAtivo = "Design Mensal";
  const faseAtual = "Design da Nova Home";
  const progressoEntrega = 65; // Calculado: inicio=25, andamento=65, finalizando=90
  const proximaAcao = "Revisar protótipo da Home";
  const proximaReuniao = {
    data: "05 de Fevereiro",
    horario: "14:00",
    tipo: "Revisão",
  };

  return (
    <ClienteLayout>
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

        {/* Progresso da Entrega */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Progresso da entrega atual</h2>
              <span className="text-sm text-muted-foreground">{progressoEntrega}%</span>
            </div>
            <ProgressBar value={progressoEntrega} size="lg" animated />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Início</span>
              <span>Em andamento</span>
              <span>Finalizando</span>
            </div>
          </CardContent>
        </Card>

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
                    {proximaAcao}
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
                    {proximaReuniao.tipo}
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="flex-1 gap-2">
            <Link to="/cliente/entregas">
              <Package className="h-5 w-5" />
              Ver entregas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 gap-2">
            <Link to="/cliente/materiais">
              <FolderOpen className="h-5 w-5" />
              Acessar materiais
            </Link>
          </Button>
        </div>
      </div>
    </ClienteLayout>
  );
}
