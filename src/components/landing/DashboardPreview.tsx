import { 
  CheckCircle, 
  Clock, 
  Target, 
  Rocket, 
  Package, 
  FolderOpen, 
  ArrowRight,
  Calendar
} from "lucide-react";

interface DashboardPreviewProps {
  onNavigate: (tab: "inicio" | "onboarding" | "entregas" | "arquivos") => void;
}

export function DashboardPreview({ onNavigate }: DashboardPreviewProps) {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      {/* Saudação */}
      <div className="space-y-1 md:space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Olá, Maria!</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Bem-vindo(a) ao seu portal. Aqui você encontra tudo sobre o seu projeto em um só lugar.
        </p>
      </div>

      {/* Contexto Atual */}
      <div className="rounded-xl bg-primary/5 p-4 flex items-center gap-3 border border-primary/20">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Target className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs md:text-sm text-muted-foreground">Agora estamos em</p>
          <p className="text-base md:text-lg font-semibold text-foreground">Setup inicial</p>
        </div>
      </div>

      {/* Onboarding do Serviço */}
      <div className="rounded-xl border border-primary/20 p-4 md:p-5 space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <p className="font-medium text-sm md:text-base text-foreground">Onboarding do Serviço</p>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground">60%</span>
        </div>
        <div className="h-2 md:h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full w-3/5 rounded-full bg-primary transition-all duration-1000" />
        </div>
        <div className="space-y-1.5 md:space-y-2">
          {[
            { nome: "Reunião inicial", done: true },
            { nome: "Briefing", done: true },
            { nome: "Envio de materiais", done: true },
            { nome: "Setup inicial", current: true },
            { nome: "Aprovação final", pending: true },
          ].map((etapa, i) => (
            <div key={i} className="flex items-center gap-2 text-xs md:text-sm">
              {etapa.done ? (
                <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-success" />
              ) : etapa.current ? (
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
              ) : (
                <div className="h-3.5 w-3.5 md:h-4 md:w-4 rounded-full border-2 border-muted-foreground/30" />
              )}
              <span className={etapa.pending ? "text-muted-foreground" : "text-foreground"}>
                {etapa.nome}
              </span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => onNavigate("onboarding")}
          className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary pt-1 hover:underline"
        >
          Ver detalhes
          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>
      </div>

      {/* Cards de ação - Stack vertical no mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Próxima Ação */}
        <div className="rounded-xl bg-warning/5 p-4 flex items-start gap-3 border border-warning/20">
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-warning" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground">Sua próxima ação</p>
            <p className="font-semibold text-sm md:text-base text-foreground">Revisar protótipo da Home</p>
            <p className="text-xs md:text-sm text-muted-foreground">Até dia 03 de Fevereiro às 18:00</p>
          </div>
        </div>

        {/* Próxima Reunião */}
        <div className="rounded-xl bg-muted/50 p-4 flex items-start gap-3 border border-border">
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground">Próxima reunião</p>
            <p className="font-semibold text-sm md:text-base text-foreground">05 de Fevereiro às 14:00</p>
            <p className="text-xs md:text-sm text-muted-foreground">Revisão do protótipo da home</p>
          </div>
        </div>
      </div>

      {/* Botões de ação - Stack vertical */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => onNavigate("entregas")}
          className="w-full rounded-2xl bg-primary px-5 py-4 md:px-6 md:py-5 flex items-center justify-between text-primary-foreground hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <Package className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-medium text-base md:text-lg">Ver entregas</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onNavigate("arquivos")}
          className="w-full rounded-2xl border-2 border-primary bg-transparent px-5 py-4 md:px-6 md:py-5 flex items-center justify-between text-primary hover:bg-primary/5 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <FolderOpen className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-medium text-base md:text-lg">Acessar arquivos</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
