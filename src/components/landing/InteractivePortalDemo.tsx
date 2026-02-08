import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Send, FolderOpen } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";
import { OnboardingPreview } from "./OnboardingPreview";
import { EntregasPreview } from "./EntregasPreview";
import { ArquivosPreview } from "./ArquivosPreview";

type TabType = "inicio" | "onboarding" | "entregas" | "arquivos";

const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { 
    id: "inicio", 
    label: "Início", 
    icon: (
      <div className="h-3 w-3 grid grid-cols-2 gap-0.5">
        <div className="bg-current rounded-[1px]" />
        <div className="bg-current rounded-[1px]" />
        <div className="bg-current rounded-[1px]" />
        <div className="bg-current rounded-[1px]" />
      </div>
    )
  },
  { id: "onboarding", label: "Onboarding", icon: <Rocket className="h-4 w-4" /> },
  { id: "entregas", label: "Entregas", icon: <Send className="h-4 w-4" /> },
  { id: "arquivos", label: "Arquivos", icon: <FolderOpen className="h-4 w-4" /> },
];

export function InteractivePortalDemo() {
  const [activeTab, setActiveTab] = useState<TabType>("inicio");

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="overflow-hidden border-border/50 bg-card shadow-xl">
        {/* Browser Frame */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
            </div>
            <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
              meuportal.agencia.com.br
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Header do Portal com Menu Navegável */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-background rounded-sm" />
                  <div className="bg-background rounded-sm" />
                  <div className="bg-background rounded-sm" />
                  <div className="bg-background rounded-sm" />
                </div>
              </div>
              <span className="font-semibold text-foreground">Meu Portal</span>
            </div>
            
            {/* Menu Clicável */}
            <div className="flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo Dinâmico */}
          <div className="min-h-[500px]">
            {activeTab === "inicio" && <DashboardPreview onNavigate={setActiveTab} />}
            {activeTab === "onboarding" && <OnboardingPreview />}
            {activeTab === "entregas" && <EntregasPreview />}
            {activeTab === "arquivos" && <ArquivosPreview />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
