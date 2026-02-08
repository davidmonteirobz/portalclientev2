import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Send, FolderOpen, Menu, X, LayoutDashboard } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";
import { OnboardingPreview } from "./OnboardingPreview";
import { EntregasPreview } from "./EntregasPreview";
import { ArquivosPreview } from "./ArquivosPreview";

type TabType = "inicio" | "onboarding" | "entregas" | "arquivos";

const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { 
    id: "inicio", 
    label: "Início", 
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  { id: "onboarding", label: "Onboarding", icon: <Rocket className="h-4 w-4" /> },
  { id: "entregas", label: "Entregas", icon: <Send className="h-4 w-4" /> },
  { id: "arquivos", label: "Arquivos", icon: <FolderOpen className="h-4 w-4" /> },
];

export function InteractivePortalDemo() {
  const [activeTab, setActiveTab] = useState<TabType>("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

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
          <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-sm md:text-base">Meu Portal</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-border bg-card p-3 animate-fade-in">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all w-full text-left ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo Dinâmico */}
          <div className="min-h-[400px] md:min-h-[500px]">
            {activeTab === "inicio" && <DashboardPreview onNavigate={handleTabChange} />}
            {activeTab === "onboarding" && <OnboardingPreview />}
            {activeTab === "entregas" && <EntregasPreview />}
            {activeTab === "arquivos" && <ArquivosPreview />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
