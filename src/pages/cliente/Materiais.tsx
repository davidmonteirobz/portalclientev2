import { Link } from "react-router-dom";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Image, Palette, FileEdit, LayoutDashboard, Package, ArrowRight } from "lucide-react";

interface Material {
  id: string;
  nome: string;
  icon: React.ElementType;
  link: string;
}

const materiais: Material[] = [
  { id: "1", nome: "Identidade Visual", icon: Palette, link: "https://drive.google.com/..." },
  { id: "2", nome: "Briefing", icon: FileText, link: "https://notion.so/..." },
  { id: "3", nome: "Textos", icon: FileEdit, link: "https://docs.google.com/..." },
  { id: "4", nome: "Referências", icon: Image, link: "https://pinterest.com/..." },
];

export default function ClienteMateriais() {
  // Dados mockados - onboarding ativo viria da empresa
  const onboardingAtivo = true;
  
  return (
    <ClienteLayout onboardingAtivo={onboardingAtivo}>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arquivos</h1>
          <p className="text-muted-foreground">
            Acesse os arquivos do seu projeto
          </p>
        </div>

        {/* Grid de Materiais */}
        <div className="grid gap-4 sm:grid-cols-2">
          {materiais.map((material, index) => {
            const Icon = material.icon;
            return (
              <Card
                key={material.id}
                className="group transition-all card-hover animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {material.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Clique para acessar
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <a href={material.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Nota */}
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            💡 Os arquivos são hospedados externamente. Se tiver problemas de acesso, entre em contato pelo WhatsApp.
          </p>
        </div>

        {/* CTAs - Mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          <Link
            to="/cliente/dashboard"
            className="flex items-center justify-between rounded-2xl bg-primary px-6 py-5 text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-lg font-medium">Início</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <Link
            to="/cliente/entregas"
            className="flex items-center justify-between rounded-2xl border-2 border-primary bg-transparent px-6 py-5 text-primary transition-all hover:bg-primary/5 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <Package className="h-6 w-6" />
              <span className="text-lg font-medium">Entregas</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </ClienteLayout>
  );
}
