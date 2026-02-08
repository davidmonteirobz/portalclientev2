import { FolderOpen, FileImage, FileText, Palette, Link2, ExternalLink } from "lucide-react";

const arquivos = [
  { 
    nome: "Logo Principal", 
    tipo: "imagem" as const,
    link: "drive.google.com/...",
    icon: FileImage
  },
  { 
    nome: "Manual de Marca", 
    tipo: "documento" as const,
    link: "drive.google.com/...",
    icon: FileText
  },
  { 
    nome: "Paleta de Cores", 
    tipo: "design" as const,
    link: "figma.com/...",
    icon: Palette
  },
  { 
    nome: "Referências Visuais", 
    tipo: "link" as const,
    link: "notion.so/...",
    icon: Link2
  },
];

export function ArquivosPreview() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderOpen className="h-6 w-6" />
          Arquivos
        </h3>
        <p className="text-muted-foreground mt-1">Acesse todos os materiais do seu projeto</p>
      </div>

      {/* Grid de arquivos */}
      <div className="grid grid-cols-2 gap-4">
        {arquivos.map((arquivo, index) => (
          <div 
            key={index}
            className="rounded-xl border border-border p-4 hover:bg-muted/30 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <arquivo.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{arquivo.nome}</p>
                <p className="text-xs text-muted-foreground truncate">{arquivo.link}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end">
              <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                Abrir
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="rounded-xl bg-muted/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          Todos os arquivos abrem em uma nova aba no serviço original (Google Drive, Figma, etc.)
        </p>
      </div>
    </div>
  );
}
