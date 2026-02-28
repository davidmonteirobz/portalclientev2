import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { hexToHsl } from "@/lib/utils";

interface EmpresaTheme {
  corPrimaria: string;
  logoUrl: string | null;
}

interface EmpresaThemeContextType {
  theme: EmpresaTheme;
  themeStyles: React.CSSProperties;
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

  // Salva no localStorage quando muda
  useEffect(() => {
    localStorage.setItem("empresa-theme", JSON.stringify(theme));
  }, [theme]);

  // Gera CSS variables para aplicar em containers escopados
  const themeStyles = (() => {
    const hsl = hexToHsl(theme.corPrimaria);
    return {
      "--primary": hsl,
      "--sidebar-primary": hsl,
      "--sidebar-background": hsl,
      "--ring": hsl,
    } as React.CSSProperties;
  })();

  const updateCorPrimaria = (cor: string) => {
    setTheme((prev) => ({ ...prev, corPrimaria: cor }));
  };

  const updateLogoUrl = (url: string | null) => {
    setTheme((prev) => ({ ...prev, logoUrl: url }));
  };

  return (
    <EmpresaThemeContext.Provider value={{ theme, themeStyles, setTheme, updateCorPrimaria, updateLogoUrl }}>
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
