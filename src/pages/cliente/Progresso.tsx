import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Etapa {
  id: string;
  nome: string;
  status: "concluido" | "atual" | "pendente";
}

const etapas: Etapa[] = [
  { id: "1", nome: "Briefing", status: "concluido" },
  { id: "2", nome: "Pesquisa e Referências", status: "concluido" },
  { id: "3", nome: "Wireframes", status: "concluido" },
  { id: "4", nome: "Design da Nova Home", status: "atual" },
  { id: "5", nome: "Ajustes e Revisões", status: "pendente" },
  { id: "6", nome: "Aprovação Final", status: "pendente" },
];

export default function ClienteProgresso() {
  return (
    <ClienteLayout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progresso</h1>
          <p className="text-muted-foreground">
            Acompanhe as etapas do seu projeto
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {etapas.map((etapa, index) => {
            const isLast = index === etapas.length - 1;
            
            return (
              <div
                key={etapa.id}
                className="relative flex gap-4 pb-8 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Linha vertical */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[15px] top-8 h-full w-0.5",
                      etapa.status === "concluido" ? "bg-success" : "bg-border"
                    )}
                  />
                )}

                {/* Ícone */}
                <div className="relative z-10">
                  {etapa.status === "concluido" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
                      <CheckCircle className="h-5 w-5 text-success-foreground" />
                    </div>
                  ) : etapa.status === "atual" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div
                  className={cn(
                    "flex-1 rounded-xl border p-4 transition-all",
                    etapa.status === "atual"
                      ? "border-primary/30 bg-primary/5"
                      : etapa.status === "concluido"
                      ? "border-success/20 bg-success/5"
                      : "border-border bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={cn(
                        "font-semibold",
                        etapa.status === "pendente"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {etapa.nome}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        etapa.status === "concluido"
                          ? "bg-success/10 text-success"
                          : etapa.status === "atual"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {etapa.status === "concluido"
                        ? "Concluído"
                        : etapa.status === "atual"
                        ? "Em andamento"
                        : "Pendente"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ClienteLayout>
  );
}
