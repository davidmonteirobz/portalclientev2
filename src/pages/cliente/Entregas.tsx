import { Link } from "react-router-dom";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronRight, Package, Calendar } from "lucide-react";

interface Entrega {
  id: string;
  nome: string;
  data: string;
  status: "em_revisao" | "aprovado";
}

const entregas: Entrega[] = [
  { id: "1", nome: "Wireframe Home", data: "25 Jan 2026", status: "aprovado" },
  { id: "2", nome: "Design Home v1", data: "01 Fev 2026", status: "em_revisao" },
  { id: "3", nome: "Design Sobre Nós", data: "28 Jan 2026", status: "aprovado" },
];

export default function ClienteEntregas() {
  return (
    <ClienteLayout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entregas</h1>
          <p className="text-muted-foreground">
            Visualize e aprove suas entregas
          </p>
        </div>

        {/* Lista de Entregas */}
        <div className="space-y-3">
          {entregas.map((entrega, index) => (
            <Card
              key={entrega.id}
              className="group transition-all card-hover animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {entrega.nome}
                      </h3>
                      <div className="mt-1 flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {entrega.data}
                        </div>
                        <StatusBadge
                          variant={entrega.status === "aprovado" ? "success" : "warning"}
                        >
                          {entrega.status === "aprovado" ? "Aprovado" : "Em revisão"}
                        </StatusBadge>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Link to={`/cliente/entrega-detalhe?id=${entrega.id}`}>
                      Visualizar
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {entregas.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium text-foreground">
              Nenhuma entrega ainda
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Suas entregas aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </ClienteLayout>
  );
}
