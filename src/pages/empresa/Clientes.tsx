import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ChevronRight, Building2, User, Upload, FileSpreadsheet, Loader2, Trash2 } from "lucide-react";
import { EmpresaLayout } from "@/components/empresa/EmpresaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

type StatusContrato = "ativo" | "pausado" | "rescindido";

interface Cliente {
  id: string;
  nome: string;
  negocio?: string;
  servico: string;
  status: string;
  whatsapp?: string;
  email: string;
}

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  ativo: { label: "Contrato ativo", variant: "success" },
  pausado: { label: "Contrato pausado", variant: "warning" },
  rescindido: { label: "Contrato rescindido", variant: "destructive" },
  pendente: { label: "Pendente", variant: "warning" },
};

export default function EmpresaClientes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    negocio: "",
    servico: "",
    whatsapp: "",
    email: "",
  });

  // Fetch empresa_id then clients
  const fetchClientes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: empresaData } = await supabase
        .from("empresas")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!empresaData) {
        setClientes([]);
        return;
      }

      const { data, error } = await supabase
        .from("portal_clients")
        .select("id, nome, negocio, servico, status, whatsapp, email")
        .eq("empresa_id", empresaData.id)
        .order("invited_at", { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar clientes:", err);
      toast({ title: "Erro ao carregar clientes", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [user]);

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.negocio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.servico.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCadastrar = async () => {
    if (!user || !novoCliente.nome || !novoCliente.email) return;
    try {
      setSubmitting(true);
      const { data: empresaData } = await supabase
        .from("empresas")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!empresaData) {
        toast({ title: "Empresa não encontrada", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("portal_clients").insert({
        empresa_id: empresaData.id,
        nome: novoCliente.nome,
        email: novoCliente.email,
        negocio: novoCliente.negocio || null,
        servico: novoCliente.servico,
        whatsapp: novoCliente.whatsapp || null,
      });

      if (error) throw error;

      toast({ title: "Cliente cadastrado com sucesso!" });
      setDialogOpen(false);
      setNovoCliente({ nome: "", negocio: "", servico: "", whatsapp: "", email: "" });
      fetchClientes();
    } catch (err: any) {
      console.error("Erro ao cadastrar:", err);
      toast({ title: "Erro ao cadastrar cliente", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadModelo = () => {
    const headers = ["Nome", "Negócio", "Serviço", "WhatsApp", "E-mail"];
    const exemploRow = ["Maria Silva", "Studio Bella", "Design Mensal", "(11) 99999-9999", "maria@email.com"];
    const csvContent = [
      headers.join(","),
      exemploRow.map((cell) => `"${cell}"`).join(","),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_clientes.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name);
      setImportDialogOpen(false);
    }
  };

  const handleDeleteCliente = async () => {
    if (!clienteToDelete) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("portal_clients")
        .delete()
        .eq("id", clienteToDelete.id);
      if (error) throw error;
      toast({ title: "Cliente excluído com sucesso" });
      setClienteToDelete(null);
      fetchClientes();
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      toast({ title: "Erro ao excluir cliente", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <EmpresaLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie seus clientes e acesse seus portais
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Importar</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Importar clientes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Arquivo da planilha</Label>
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Arraste o arquivo ou clique para selecionar
                      </p>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="max-w-[200px]"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Modelo de planilha</p>
                      <p className="text-xs text-muted-foreground">
                        Baixe o modelo para preencher corretamente
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleDownloadModelo}>
                      Baixar
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo cliente</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastrar novo cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do cliente *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Maria Silva"
                      value={novoCliente.nome}
                      onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="negocio">Nome do negócio (opcional)</Label>
                    <Input
                      id="negocio"
                      placeholder="Ex: Studio Bella"
                      value={novoCliente.negocio}
                      onChange={(e) => setNovoCliente({ ...novoCliente, negocio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servico">Serviço ativo *</Label>
                    <Input
                      id="servico"
                      placeholder="Ex: Design mensal, Site institucional"
                      value={novoCliente.servico}
                      onChange={(e) => setNovoCliente({ ...novoCliente, servico: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(00) 00000-0000"
                      value={novoCliente.whatsapp}
                      onChange={(e) => setNovoCliente({ ...novoCliente, whatsapp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@email.com"
                      value={novoCliente.email}
                      onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCadastrar} disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Cadastrar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Lista de Clientes */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {clientesFiltrados.map((cliente, index) => (
              <div
                key={cliente.id}
                className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all card-hover animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/empresa/cliente-detalhe?id=${cliente.id}`)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {cliente.negocio ? (
                        <Building2 className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{cliente.nome}</h3>
                      {cliente.negocio && (
                        <p className="text-sm text-muted-foreground truncate">{cliente.negocio}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cliente.servico && (
                          <StatusBadge variant="primary" className="whitespace-nowrap">{cliente.servico}</StatusBadge>
                        )}
                        {statusConfig[cliente.status] && (
                          <StatusBadge variant={statusConfig[cliente.status].variant} className="whitespace-nowrap">
                            {statusConfig[cliente.status].label}
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                </div>
              </div>
            ))}

            {clientesFiltrados.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-medium text-foreground">
                  Nenhum cliente encontrado
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Tente uma busca diferente"
                    : "Adicione seu primeiro cliente"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </EmpresaLayout>
  );
}
