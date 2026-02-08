import { CheckCircle, Clock, Rocket, Circle } from "lucide-react";

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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in bg-white">
      {/* Header */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <Rocket className="h-5 w-5 md:h-6 md:w-6 text-neutral-900" />
          Onboarding do Serviço
        </h3>
        <p className="text-sm md:text-base text-neutral-500 mt-1">
          Acompanhe o progresso do início do seu projeto
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-neutral-500">Progresso geral</span>
          <span className="font-medium text-neutral-900">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 md:h-3 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div 
            className="h-full rounded-full bg-neutral-900 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {etapas.map((etapa, index) => (
          <div key={index} className="relative flex gap-3 md:gap-4">
            {/* Linha vertical */}
            {index < etapas.length - 1 && (
              <div className="absolute left-[15px] md:left-[19px] top-8 md:top-10 bottom-0 w-0.5 bg-neutral-200" />
            )}
            
            {/* Ícone */}
            <div className="relative z-10 flex-shrink-0">
              {etapa.status === "done" ? (
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-600 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              ) : etapa.status === "current" ? (
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-neutral-100 border-2 border-neutral-900 flex items-center justify-center">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-neutral-900" />
                </div>
              ) : (
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center">
                  <Circle className="h-3 w-3 md:h-4 md:w-4 text-neutral-300" />
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className={`flex-1 pb-4 md:pb-6 ${etapa.status === "pending" ? "opacity-50" : ""}`}>
              <div className={`rounded-xl p-3 md:p-4 ${
                etapa.status === "current" 
                  ? "bg-neutral-900/5 border border-neutral-900/10" 
                  : etapa.status === "done"
                  ? "bg-neutral-50 border border-neutral-200"
                  : "bg-neutral-50 border border-neutral-100"
              }`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-sm md:text-base text-neutral-900">{etapa.nome}</p>
                  {etapa.status === "done" && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                      Concluído
                    </span>
                  )}
                  {etapa.status === "current" && (
                    <span className="text-xs bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                      Em andamento
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-neutral-500 mt-1">{etapa.descricao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
