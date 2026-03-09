import { useState, useRef, useEffect } from "react";
import { EmpresaLayout } from "@/components/empresa/EmpresaLayout";
import { useEmpresaTheme } from "@/contexts/EmpresaThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Check, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Configuracoes() {
  const { theme, updateCorPrimaria, updateLogoUrl, saveThemeToDb } = useEmpresaTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [corTemp, setCorTemp] = useState(theme.corPrimaria);
  const [logoTemp, setLogoTemp] = useState(theme.logoUrl);

  // Sync temp state when theme loads from DB
  useEffect(() => {
    setCorTemp(theme.corPrimaria);
    setLogoTemp(theme.logoUrl);
  }, [theme.corPrimaria, theme.logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O logo deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoTemp(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoTemp(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      await saveThemeToDb(corTemp, logoTemp);
      updateCorPrimaria(corTemp);
      updateLogoUrl(logoTemp);
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const hasChanges = corTemp !== theme.corPrimaria || logoTemp !== theme.logoUrl;

  return (
    <EmpresaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Personalize a aparência do portal</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Identidade Visual</CardTitle>
              <CardDescription>
                Defina o logo e a cor primária da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div className="space-y-3">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                    {logoTemp ? (
                      <img
                        src={logoTemp}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {logoTemp ? "Alterar Logo" : "Enviar Logo"}
                    </Button>
                    {logoTemp && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="text-destructive hover:text-destructive"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG ou SVG. Máximo 2MB.
                </p>
              </div>

              {/* Cor Primária */}
              <div className="space-y-3">
                <Label>Cor Primária</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Input
                      type="color"
                      value={corTemp}
                      onChange={(e) => setCorTemp(e.target.value)}
                      className="h-12 w-16 cursor-pointer border-2 p-1"
                    />
                  </div>
                  <Input
                    type="text"
                    value={corTemp.toUpperCase()}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        setCorTemp(value);
                      }
                    }}
                    className="w-28 font-mono uppercase"
                    maxLength={7}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Esta cor será aplicada em toda a plataforma
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="w-full"
              >
                <Check className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
              <CardDescription>
                Veja como ficará a aparência do portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preview Header */}
                <div 
                  className="flex items-center gap-3 rounded-lg p-4"
                  style={{ backgroundColor: corTemp }}
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/20">
                    {logoTemp ? (
                      <img
                        src={logoTemp}
                        alt="Logo Preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <LayoutDashboard className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="font-semibold text-white">Meu Portal</span>
                </div>

                {/* Preview Menu */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex gap-2">
                    <div
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                      style={{ backgroundColor: corTemp }}
                    >
                      Menu Ativo
                    </div>
                    <div className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                      Menu Inativo
                    </div>
                  </div>
                </div>

                {/* Preview Button */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: corTemp }}
                  >
                    Botão Primário
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Botão Secundário
                  </Button>
                </div>

                {/* Preview Progress */}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Progresso</div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full w-3/4 rounded-full transition-all"
                      style={{ backgroundColor: corTemp }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmpresaLayout>
  );
}
