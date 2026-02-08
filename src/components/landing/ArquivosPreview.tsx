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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderOpen className="h-5 w-5 md:h-6 md:w-6" />
          Arquivos
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Acesse todos os materiais do seu projeto
        </p>
      </div>

      {/* Grid de arquivos - 1 coluna no mobile, 2 no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {arquivos.map((arquivo, index) => (
          <div 
            key={index}
            className="rounded-xl border border-border p-3 md:p-4 hover:bg-muted/30 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <arquivo.icon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-foreground truncate">{arquivo.nome}</p>
                <p className="text-xs text-muted-foreground truncate">{arquivo.link}</p>
              </div>
              <div className="flex items-center">
                <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Abrir</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="rounded-xl bg-muted/50 p-3 md:p-4 border border-border">
        <p className="text-xs md:text-sm text-muted-foreground text-center">
          Todos os arquivos abrem em uma nova aba no serviço original (Google Drive, Figma, etc.)
        </p>
      </div>
    </div>
  );
}
