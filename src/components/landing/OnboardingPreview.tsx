import { CheckCircle, Clock, Rocket } from "lucide-react";

const etapas = [
  { nome: "Reunião inicial", descricao: "Alinhamento de expectativas e escopo", status: "done" as const },
  { nome: "Briefing", descricao: "Coleta de informações e referências", status: "done" as const },
  { nome: "Envio de materiais", descricao: "Logo, textos e imagens", status: "done" as const },
  { nome: "Setup inicial", descricao: "Configuração do ambiente de trabalho", status: "current" as const },
  { nome: "Aprovação final", descricao: "Validação e entrega do projeto", status: "pending" as const },
];

export function OnboardingPreview() {
  const completedCount = etapas.filter(e => e.status === "done").length;
  const progress = (completedCount / etapas.length) * 100;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Rocket className="h-6 w-6" />
          Onboarding do Serviço
        </h3>
        <p className="text-muted-foreground mt-1">Acompanhe o progresso do início do seu projeto</p>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso geral</span>
          <span className="font-medium text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-3 rounded-full bg-foreground transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {etapas.map((etapa, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Linha vertical */}
            {index < etapas.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border" />
            )}
            
            {/* Ícone */}
            <div className="relative z-10 flex-shrink-0">
              {etapa.status === "done" ? (
                <div className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-background" />
                </div>
              ) : etapa.status === "current" ? (
                <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className={`flex-1 pb-6 ${etapa.status === "pending" ? "opacity-50" : ""}`}>
              <div className={`rounded-xl p-4 ${
                etapa.status === "current" 
                  ? "bg-primary/10 border border-primary/20" 
                  : etapa.status === "done"
                  ? "bg-muted/50 border border-border"
                  : "bg-muted/30 border border-border/50"
              }`}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{etapa.nome}</p>
                  {etapa.status === "done" && (
                    <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">
                      Concluído
                    </span>
                  )}
                  {etapa.status === "current" && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Em andamento
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{etapa.descricao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
