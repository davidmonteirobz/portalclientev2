import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ChevronRight, Building2, User } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Cliente {
  id: string;
  nome: string;
  negocio?: string;
  servico: string;
  whatsapp: string;
  email: string;
}

const clientesMock: Cliente[] = [
  {
    id: "1",
    nome: "Maria Silva",
    negocio: "Studio Bella",
    servico: "Design Mensal",
    whatsapp: "(11) 99999-9999",
    email: "maria@studiobella.com",
  },
  {
    id: "2",
    nome: "João Santos",
    negocio: "TechStart",
    servico: "Site Institucional",
    whatsapp: "(21) 98888-8888",
    email: "joao@techstart.io",
  },
  {
    id: "3",
    nome: "Ana Costa",
    servico: "Criativos para Redes",
    whatsapp: "(31) 97777-7777",
    email: "ana.costa@email.com",
  },
];

export default function EmpresaClientes() {
  const navigate = useNavigate();
  const [clientes] = useState<Cliente[]>(clientesMock);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    negocio: "",
    servico: "",
    whatsapp: "",
    email: "",
  });

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.negocio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.servico.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCadastrar = () => {
    // Simulação de cadastro
    setDialogOpen(false);
    setNovoCliente({ nome: "", negocio: "", servico: "", whatsapp: "", email: "" });
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo cliente
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
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, nome: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negocio">Nome do negócio (opcional)</Label>
                  <Input
                    id="negocio"
                    placeholder="Ex: Studio Bella"
                    value={novoCliente.negocio}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, negocio: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servico">Serviço ativo *</Label>
                  <Input
                    id="servico"
                    placeholder="Ex: Design mensal, Site institucional"
                    value={novoCliente.servico}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, servico: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={novoCliente.whatsapp}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, whatsapp: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@email.com"
                    value={novoCliente.email}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCadastrar}>Cadastrar</Button>
              </div>
            </DialogContent>
          </Dialog>
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
        <div className="space-y-3">
          {clientesFiltrados.map((cliente, index) => (
            <div
              key={cliente.id}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all card-hover animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {cliente.negocio ? (
                    <Building2 className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{cliente.nome}</h3>
                    {cliente.negocio && (
                      <span className="text-sm text-muted-foreground">
                        • {cliente.negocio}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge variant="primary">{cliente.servico}</StatusBadge>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => navigate(`/empresa/cliente-detalhe?id=${cliente.id}`)}
              >
                Gerenciar
                <ChevronRight className="h-4 w-4" />
              </Button>
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
      </div>
    </EmpresaLayout>
  );
}
