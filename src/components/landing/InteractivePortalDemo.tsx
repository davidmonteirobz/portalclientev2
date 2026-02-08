import { useState } from "react";
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
      {/* Wrapper com tema claro forçado */}
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-white/5 border border-white/10">
        {/* Browser Frame - escuro para combinar com landing */}
        <div className="bg-neutral-800 px-4 py-3 border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="ml-4 flex-1 rounded-md bg-neutral-700 px-3 py-1 text-xs text-neutral-400">
              meuportal.agencia.com.br
            </div>
          </div>
        </div>

        {/* Portal Preview com fundo branco */}
        <div className="bg-white text-neutral-900">
          {/* Header do Portal com Menu Navegável */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 md:px-6 md:py-4 bg-white">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-neutral-900 flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="font-semibold text-neutral-900 text-sm md:text-base">Meu Portal</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
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
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-900"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-neutral-200 bg-white p-3 animate-fade-in">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all w-full text-left ${
                      activeTab === item.id
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
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
          <div className="min-h-[400px] md:min-h-[500px] bg-white">
            {activeTab === "inicio" && <DashboardPreview onNavigate={handleTabChange} />}
            {activeTab === "onboarding" && <OnboardingPreview />}
            {activeTab === "entregas" && <EntregasPreview />}
            {activeTab === "arquivos" && <ArquivosPreview />}
          </div>
        </div>
      </div>
    </div>
  );
}
