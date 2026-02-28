import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Rocket, 
  Package, 
  FolderOpen,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEmpresaTheme } from "@/contexts/EmpresaThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface ClienteLayoutProps {
  children: ReactNode;
  onboardingAtivo?: boolean;
}

const getMenuItems = (onboardingAtivo: boolean) => {
  const items = [
    { label: "Início", icon: LayoutDashboard, path: "/cliente/dashboard" },
  ];
  
  if (onboardingAtivo) {
    items.push({ label: "Onboarding", icon: Rocket, path: "/cliente/onboarding" });
  }
  
  items.push(
    { label: "Entregas", icon: Package, path: "/cliente/entregas" },
    { label: "Arquivos", icon: FolderOpen, path: "/cliente/materiais" }
  );
  
  return items;
};

export function ClienteLayout({ children, onboardingAtivo = true }: ClienteLayoutProps) {
  const location = useLocation();
  const { theme, themeStyles } = useEmpresaTheme();
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = getMenuItems(onboardingAtivo);

  const LogoComponent = () => (
    theme.logoUrl ? (
      <img src={theme.logoUrl} alt="Logo" className="h-9 w-9 rounded-lg object-contain" />
    ) : (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
      </div>
    )
  );

  return (
    <div className="min-h-screen w-full bg-background" style={themeStyles}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <LogoComponent />
            <span className="text-lg font-semibold text-foreground">Meu Portal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
           </nav>

          {/* Desktop Logout */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex text-muted-foreground hover:text-foreground"
            onClick={signOut}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-border bg-card p-4 md:hidden">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={signOut}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}
