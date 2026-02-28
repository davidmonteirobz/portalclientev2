import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, LayoutDashboard, ChevronLeft, ChevronRight, Menu, X, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEmpresaTheme } from "@/contexts/EmpresaThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface EmpresaLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { label: "Clientes", icon: Users, path: "/empresa/clientes" },
  { label: "Configurações", icon: Settings, path: "/empresa/configuracoes" },
];

export function EmpresaLayout({ children }: EmpresaLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme, themeStyles } = useEmpresaTheme();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const LogoComponent = () => (
    theme.logoUrl ? (
      <img src={theme.logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
    ) : (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
        <LayoutDashboard className="h-4 w-4 text-sidebar-primary-foreground" />
      </div>
    )
  );

  return (
    <div className="flex min-h-screen w-full bg-background" style={themeStyles}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-sidebar px-4">
          <div className="flex items-center gap-2">
            <LogoComponent />
            <span className="font-semibold text-sidebar-foreground">Portal</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-300",
          isMobile
            ? cn(
                "w-64 transform",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                "top-14 h-[calc(100vh-3.5rem)]"
              )
            : cn(collapsed ? "w-16" : "w-64")
        )}
      >
        {/* Logo - Desktop only */}
        {!isMobile && (
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <LogoComponent />
                <span className="font-semibold text-sidebar-foreground">Portal</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(isMobile || !collapsed) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {(isMobile || !collapsed) && <span>Sair</span>}
          </Button>
          {(isMobile || !collapsed) && (
            <p className="text-xs text-sidebar-muted">Área da Empresa</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "ml-0 pt-14" : collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
