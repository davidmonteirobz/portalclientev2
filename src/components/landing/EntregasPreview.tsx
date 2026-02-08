import { Send, CheckCircle, Clock, Eye, MessageSquare } from "lucide-react";

const entregas = [
  { 
    nome: "Protótipo da Home", 
    status: "revisao" as const, 
    data: "03 Fev 2026",
    comentarios: 2
  },
  { 
    nome: "Logo Final", 
    status: "aprovado" as const, 
    data: "28 Jan 2026",
    comentarios: 0
  },
  { 
    nome: "Identidade Visual", 
    status: "aprovado" as const, 
    data: "25 Jan 2026",
    comentarios: 3
  },
];

export function EntregasPreview() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Send className="h-6 w-6" />
          Entregas
        </h3>
        <p className="text-muted-foreground mt-1">Visualize e aprove as entregas do seu projeto</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-muted/50 p-3 border border-border text-center">
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-xl bg-success/10 p-3 border border-success/20 text-center">
          <p className="text-2xl font-bold text-success">2</p>
          <p className="text-xs text-muted-foreground">Aprovadas</p>
        </div>
        <div className="rounded-xl bg-warning/10 p-3 border border-warning/20 text-center">
          <p className="text-2xl font-bold text-warning">1</p>
          <p className="text-xs text-muted-foreground">Em revisão</p>
        </div>
      </div>

      {/* Lista de entregas */}
      <div className="space-y-3">
        {entregas.map((entrega, index) => (
          <div 
            key={index}
            className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{entrega.nome}</p>
                  {entrega.status === "aprovado" ? (
                    <span className="flex items-center gap-1 text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      Aprovado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" />
                      Em revisão
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Enviado em {entrega.data}</p>
              </div>
              <div className="flex items-center gap-3">
                {entrega.comentarios > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MessageSquare className="h-4 w-4" />
                    {entrega.comentarios}
                  </div>
                )}
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
