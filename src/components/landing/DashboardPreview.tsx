import { 
  CheckCircle, 
  Clock, 
  Settings, 
  Rocket, 
  Send, 
  FolderOpen, 
  ArrowRight,
  ListChecks
} from "lucide-react";

interface DashboardPreviewProps {
  onNavigate: (tab: "inicio" | "onboarding" | "entregas" | "arquivos") => void;
}

export function DashboardPreview({ onNavigate }: DashboardPreviewProps) {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Saudação */}
      <div>
        <h3 className="text-2xl font-bold text-foreground">Olá, Maria!</h3>
        <p className="text-muted-foreground">Bem-vindo(a) ao seu portal. Aqui você encontra tudo sobre o seu projeto em um só lugar.</p>
      </div>

      {/* Contexto Atual */}
      <div className="rounded-xl bg-muted/50 p-4 flex items-center gap-4 border border-border">
        <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center">
          <Settings className="h-6 w-6 text-background" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Agora estamos em</p>
          <p className="text-lg font-semibold text-foreground">Setup inicial</p>
        </div>
      </div>

      {/* Onboarding do Serviço */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Onboarding do Serviço
          </p>
          <span className="text-sm text-muted-foreground">60%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-2 w-3/5 rounded-full bg-foreground transition-all duration-1000" />
        </div>
        <div className="space-y-2">
          {[
            { nome: "Reunião inicial", done: true },
            { nome: "Briefing", done: true },
            { nome: "Envio de materiais", done: true },
            { nome: "Setup inicial", current: true },
            { nome: "Aprovação final", pending: true },
          ].map((etapa, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {etapa.done ? (
                <CheckCircle className="h-4 w-4 text-foreground" />
              ) : etapa.current ? (
                <Clock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
              )}
              <span className={etapa.pending ? "text-muted-foreground" : "text-foreground"}>
                {etapa.nome}
              </span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => onNavigate("onboarding")}
          className="flex items-center gap-1 text-sm font-medium text-foreground pt-1 hover:underline"
        >
          Ver detalhes
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Cards de ação */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-warning/10 p-4 flex items-start gap-3 border border-warning/20">
          <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sua próxima ação</p>
            <p className="font-semibold text-foreground">Revisar protótipo da Home</p>
            <p className="text-sm text-muted-foreground">Até dia 03 de Fevereiro às 18:00</p>
          </div>
        </div>
        <div className="rounded-xl bg-muted/50 p-4 flex items-start gap-3 border border-border">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Próxima reunião</p>
            <p className="font-semibold text-foreground">05 de Fevereiro às 14:00</p>
            <p className="text-sm text-muted-foreground">Revisão do protótipo da home</p>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="space-y-3">
        <button 
          onClick={() => onNavigate("entregas")}
          className="w-full rounded-xl bg-foreground p-4 flex items-center justify-between text-background hover:bg-foreground/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Send className="h-5 w-5" />
            <span className="font-medium">Ver entregas</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onNavigate("arquivos")}
          className="w-full rounded-xl border-2 border-border p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Acessar arquivos</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
