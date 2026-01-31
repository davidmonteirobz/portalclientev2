import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Image, Palette, FileEdit } from "lucide-react";

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
  return (
    <ClienteLayout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Materiais</h1>
          <p className="text-muted-foreground">
            Acesse os materiais do seu projeto
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
            💡 Os materiais são hospedados externamente. Se tiver problemas de acesso, entre em contato pelo WhatsApp.
          </p>
        </div>
      </div>
    </ClienteLayout>
  );
}
