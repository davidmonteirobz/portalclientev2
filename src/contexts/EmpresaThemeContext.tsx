import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { hexToHsl } from "@/lib/utils";

interface EmpresaTheme {
  corPrimaria: string;
  logoUrl: string | null;
}

interface EmpresaThemeContextType {
  theme: EmpresaTheme;
  setTheme: (theme: EmpresaTheme) => void;
  updateCorPrimaria: (cor: string) => void;
  updateLogoUrl: (url: string | null) => void;
}

const EmpresaThemeContext = createContext<EmpresaThemeContextType | undefined>(undefined);

interface EmpresaThemeProviderProps {
  children: ReactNode;
}

export function EmpresaThemeProvider({ children }: EmpresaThemeProviderProps) {
  const [theme, setTheme] = useState<EmpresaTheme>(() => {
    const saved = localStorage.getItem("empresa-theme");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { corPrimaria: "#000000", logoUrl: null };
      }
    }
    return { corPrimaria: "#000000", logoUrl: null };
  });

  // Aplica cor dinamicamente via CSS variables
  useEffect(() => {
    const hsl = hexToHsl(theme.corPrimaria);
    document.documentElement.style.setProperty("--primary", hsl);
    
    // Também atualiza sidebar-primary para manter consistência
    document.documentElement.style.setProperty("--sidebar-primary", hsl);
    
    // Salva no localStorage
    localStorage.setItem("empresa-theme", JSON.stringify(theme));
  }, [theme]);

  const updateCorPrimaria = (cor: string) => {
    setTheme((prev) => ({ ...prev, corPrimaria: cor }));
  };

  const updateLogoUrl = (url: string | null) => {
    setTheme((prev) => ({ ...prev, logoUrl: url }));
  };

  return (
    <EmpresaThemeContext.Provider value={{ theme, setTheme, updateCorPrimaria, updateLogoUrl }}>
      {children}
    </EmpresaThemeContext.Provider>
  );
}

export function useEmpresaTheme() {
  const context = useContext(EmpresaThemeContext);
  if (context === undefined) {
    throw new Error("useEmpresaTheme must be used within an EmpresaThemeProvider");
  }
  return context;
}
