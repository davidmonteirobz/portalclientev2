import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8 text-center animate-fade-in">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Portal</h1>
          <p className="text-lg text-muted-foreground">
            Sistema de Gestão de Clientes
          </p>
        </div>

        {/* Cards de acesso */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Área da Empresa */}
          <Link
            to="/empresa/clientes"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 transition-all card-hover"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary">
              <Building2 className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Área da Empresa
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Painel operacional
              </p>
            </div>
          </Link>

          {/* Portal do Cliente */}
          <Link
            to="/cliente/dashboard"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 transition-all card-hover"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent">
              <Users className="h-8 w-8 text-accent transition-colors group-hover:text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Portal do Cliente
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Acompanhamento
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          Selecione uma área para continuar
        </p>
      </div>
    </div>
  );
};

export default Index;
