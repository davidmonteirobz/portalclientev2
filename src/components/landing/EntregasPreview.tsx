import { Package, CheckCircle, Clock, Eye, MessageSquare } from "lucide-react";

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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in bg-white">
      {/* Header */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <Package className="h-5 w-5 md:h-6 md:w-6" />
          Entregas
        </h3>
        <p className="text-sm md:text-base text-neutral-500 mt-1">
          Visualize e aprove as entregas do seu projeto
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="rounded-xl bg-neutral-50 p-2.5 md:p-3 border border-neutral-200 text-center">
          <p className="text-xl md:text-2xl font-bold text-neutral-900">3</p>
          <p className="text-xs text-neutral-500">Total</p>
        </div>
        <div className="rounded-xl bg-green-50 p-2.5 md:p-3 border border-green-200 text-center">
          <p className="text-xl md:text-2xl font-bold text-green-600">2</p>
          <p className="text-xs text-neutral-500">Aprovadas</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-2.5 md:p-3 border border-amber-200 text-center">
          <p className="text-xl md:text-2xl font-bold text-amber-600">1</p>
          <p className="text-xs text-neutral-500">Em revisão</p>
        </div>
      </div>

      {/* Lista de entregas */}
      <div className="space-y-2 md:space-y-3">
        {entregas.map((entrega, index) => (
          <div 
            key={index}
            className="rounded-xl border border-neutral-200 p-3 md:p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            {/* Mobile layout: stack vertical */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm md:text-base text-neutral-900">{entrega.nome}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs md:text-sm text-neutral-500">Enviado em {entrega.data}</p>
                  {entrega.comentarios > 0 && (
                    <div className="flex items-center gap-1 text-neutral-500 text-xs md:hidden">
                      <MessageSquare className="h-3 w-3" />
                      {entrega.comentarios}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between md:gap-3">
                {/* Status badge */}
                {entrega.status === "aprovado" ? (
                  <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Aprovado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    Em revisão
                  </span>
                )}
                
                <div className="flex items-center gap-2">
                  {entrega.comentarios > 0 && (
                    <div className="hidden md:flex items-center gap-1 text-neutral-500 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      {entrega.comentarios}
                    </div>
                  )}
                  <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-neutral-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
