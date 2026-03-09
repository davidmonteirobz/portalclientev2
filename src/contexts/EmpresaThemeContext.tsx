import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { hexToHsl } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EmpresaTheme {
  corPrimaria: string;
  logoUrl: string | null;
}

interface EmpresaThemeContextType {
  theme: EmpresaTheme;
  themeStyles: React.CSSProperties;
  empresaId: string | null;
  loading: boolean;
  setTheme: (theme: EmpresaTheme) => void;
  updateCorPrimaria: (cor: string) => void;
  updateLogoUrl: (url: string | null) => void;
  saveThemeToDb: (cor: string, logo: string | null) => Promise<void>;
}

const defaultTheme: EmpresaTheme = { corPrimaria: "#000000", logoUrl: null };

const EmpresaThemeContext = createContext<EmpresaThemeContextType | undefined>(undefined);

interface EmpresaThemeProviderProps {
  children: ReactNode;
}

export function EmpresaThemeProvider({ children }: EmpresaThemeProviderProps) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<EmpresaTheme>(defaultTheme);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load theme from DB based on user's empresa
  useEffect(() => {
    if (!user) {
      setTheme(defaultTheme);
      setEmpresaId(null);
      setLoading(false);
      return;
    }

    const loadTheme = async () => {
      try {
        setLoading(true);

        // First try: user is empresa owner
        const { data: empresaOwner } = await supabase
          .from("empresas")
          .select("id, cor_primaria, logo_url")
          .eq("owner_id", user.id)
          .single();

        if (empresaOwner) {
          setEmpresaId(empresaOwner.id);
          setTheme({
            corPrimaria: empresaOwner.cor_primaria || "#000000",
            logoUrl: empresaOwner.logo_url || null,
          });
          setLoading(false);
          return;
        }

        // Second try: user is a client — get empresa_id from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("empresa_id")
          .eq("user_id", user.id)
          .single();

        if (profile?.empresa_id) {
          const { data: empresa } = await supabase
            .from("empresas")
            .select("id, cor_primaria, logo_url")
            .eq("id", profile.empresa_id)
            .single();

          if (empresa) {
            setEmpresaId(empresa.id);
            setTheme({
              corPrimaria: empresa.cor_primaria || "#000000",
              logoUrl: empresa.logo_url || null,
            });
            setLoading(false);
            return;
          }
        }

        // Fallback
        setTheme(defaultTheme);
      } catch (err) {
        console.error("Error loading theme:", err);
        setTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [user]);

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

  const saveThemeToDb = useCallback(async (cor: string, logo: string | null) => {
    if (!empresaId) return;
    const { error } = await supabase
      .from("empresas")
      .update({
        cor_primaria: cor,
        logo_url: logo,
      })
      .eq("id", empresaId);

    if (error) {
      console.error("Error saving theme:", error);
      throw error;
    }
  }, [empresaId]);

  return (
    <EmpresaThemeContext.Provider value={{ theme, themeStyles, empresaId, loading, setTheme, updateCorPrimaria, updateLogoUrl, saveThemeToDb }}>
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
