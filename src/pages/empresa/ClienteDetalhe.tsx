import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Plus,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { EmpresaLayout } from "@/components/empresa/EmpresaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Entrega {
  id: string;
  nome: string;
  status: "em_revisao" | "aprovado";
  link: string;
}

interface Material {
  id: string;
  nome: string;
  link: string;
}

export default function EmpresaClienteDetalhe() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get("id") || "1";

  // Estados do cliente
  const [cliente] = useState({
    id: clienteId,
    nome: "Maria Silva",
    negocio: "Studio Bella",
    servico: "Design Mensal",
  });

  const [faseAtual, setFaseAtual] = useState("Design da Nova Home");
  const [progressoEntrega, setProgressoEntrega] = useState<"inicio" | "andamento" | "finalizando">("andamento");
  const [proximaAcao, setProximaAcao] = useState({
    descricao: "Revisar protótipo da Home",
    prazoData: "2026-02-03",
    prazoHorario: "18:00",
  });
  const [reuniao, setReuniao] = useState({
    data: "2026-02-05",
    horario: "14:00",
    tipo: "Revisão",
  });
  const [observacoesInternas, setObservacoesInternas] = useState(
    "Cliente prefere tons mais claros. Prazo flexível para esta entrega."
  );

  const [entregas, setEntregas] = useState<Entrega[]>([
    { id: "1", nome: "Wireframe Home", status: "aprovado", link: "https://figma.com/..." },
    { id: "2", nome: "Design Home v1", status: "em_revisao", link: "https://figma.com/..." },
  ]);

  const [materiais, setMateriais] = useState<Material[]>([
    { id: "1", nome: "Identidade Visual", link: "https://drive.google.com/..." },
    { id: "2", nome: "Briefing", link: "https://notion.so/..." },
    { id: "3", nome: "Textos", link: "https://docs.google.com/..." },
  ]);

  const [novaEntregaDialog, setNovaEntregaDialog] = useState(false);
  const [novaEntrega, setNovaEntrega] = useState({ nome: "", link: "" });

  const [novoMaterialDialog, setNovoMaterialDialog] = useState(false);
  const [novoMaterial, setNovoMaterial] = useState({ nome: "", link: "" });

  const handleAddEntrega = () => {
    if (novaEntrega.nome && novaEntrega.link) {
      setEntregas([
        ...entregas,
        { id: Date.now().toString(), nome: novaEntrega.nome, status: "em_revisao", link: novaEntrega.link },
      ]);
      setNovaEntrega({ nome: "", link: "" });
      setNovaEntregaDialog(false);
    }
  };

  const handleAddMaterial = () => {
    if (novoMaterial.nome && novoMaterial.link) {
      setMateriais([
        ...materiais,
        { id: Date.now().toString(), nome: novoMaterial.nome, link: novoMaterial.link },
      ]);
      setNovoMaterial({ nome: "", link: "" });
      setNovoMaterialDialog(false);
    }
  };

  const toggleEntregaStatus = (id: string) => {
    setEntregas(
      entregas.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "aprovado" ? "em_revisao" : "aprovado" }
          : e
      )
    );
  };

  return (
    <EmpresaLayout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/empresa/clientes")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{cliente.nome}</h1>
                {cliente.negocio && (
                  <span className="text-lg text-muted-foreground">
                    • {cliente.negocio}
                  </span>
                )}
              </div>
              <StatusBadge variant="primary" className="mt-1">
                {cliente.servico}
              </StatusBadge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Editar cadastro
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Seção 1 - Contexto Atual */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contexto Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="fase">Fase ou entrega atual</Label>
                  <Input
                    id="fase"
                    value={faseAtual}
                    onChange={(e) => setFaseAtual(e.target.value)}
                    placeholder="Ex: Design da Nova Home"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aparece no portal como: "Agora estamos em: {faseAtual}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seção 2 - Progresso */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Progresso da Entrega Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(["inicio", "andamento", "finalizando"] as const).map((estado) => (
                    <Button
                      key={estado}
                      variant={progressoEntrega === estado ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProgressoEntrega(estado)}
                      className="flex-1 capitalize"
                    >
                      {estado === "inicio" ? "Início" : estado === "andamento" ? "Em andamento" : "Finalizando"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seção 3 - Próxima Ação */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Próxima Ação do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="acao">Descrição da ação</Label>
                  <Input
                    id="acao"
                    value={proximaAcao.descricao}
                    onChange={(e) => setProximaAcao({ ...proximaAcao, descricao: e.target.value })}
                    placeholder="Ex: Revisar protótipo da Home"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prazoData">Prazo - Data</Label>
                    <Input
                      id="prazoData"
                      type="date"
                      value={proximaAcao.prazoData}
                      onChange={(e) => setProximaAcao({ ...proximaAcao, prazoData: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prazoHorario">Prazo - Horário</Label>
                    <Input
                      id="prazoHorario"
                      type="time"
                      value={proximaAcao.prazoHorario}
                      onChange={(e) => setProximaAcao({ ...proximaAcao, prazoHorario: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção 4 - Próxima Reunião */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Próxima Reunião
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={reuniao.data}
                      onChange={(e) => setReuniao({ ...reuniao, data: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      type="time"
                      value={reuniao.horario}
                      onChange={(e) => setReuniao({ ...reuniao, horario: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={reuniao.tipo}
                    onValueChange={(value) => setReuniao({ ...reuniao, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alinhamento">Alinhamento</SelectItem>
                      <SelectItem value="Revisão">Revisão</SelectItem>
                      <SelectItem value="Kickoff">Kickoff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Seção 5 - Entregas */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Entregas</CardTitle>
                  <Dialog open={novaEntregaDialog} onOpenChange={setNovaEntregaDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Entrega</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nome da entrega</Label>
                          <Input
                            value={novaEntrega.nome}
                            onChange={(e) => setNovaEntrega({ ...novaEntrega, nome: e.target.value })}
                            placeholder="Ex: Design Home v2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input
                            value={novaEntrega.link}
                            onChange={(e) => setNovaEntrega({ ...novaEntrega, link: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNovaEntregaDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddEntrega}>Adicionar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entregas.map((entrega) => (
                    <div
                      key={entrega.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleEntregaStatus(entrega.id)}>
                          {entrega.status === "aprovado" ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <Clock className="h-5 w-5 text-warning" />
                          )}
                        </button>
                        <span className="font-medium">{entrega.nome}</span>
                        <StatusBadge
                          variant={entrega.status === "aprovado" ? "success" : "warning"}
                        >
                          {entrega.status === "aprovado" ? "Aprovado" : "Em revisão"}
                        </StatusBadge>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={entrega.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                  {entregas.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Nenhuma entrega cadastrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seção 6 - Materiais */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Materiais do Projeto</CardTitle>
                  <Dialog open={novoMaterialDialog} onOpenChange={setNovoMaterialDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Material</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nome do material</Label>
                          <Input
                            value={novoMaterial.nome}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })}
                            placeholder="Ex: Referências"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input
                            value={novoMaterial.link}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, link: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNovoMaterialDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddMaterial}>Adicionar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materiais.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <span className="font-medium">{material.nome}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={material.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => setMateriais(materiais.filter((m) => m.id !== material.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seção 7 - Observações Internas */}
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-muted-foreground">
                  Observações Internas
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Somente visível para a empresa
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={observacoesInternas}
                  onChange={(e) => setObservacoesInternas(e.target.value)}
                  placeholder="Anotações internas sobre este cliente..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmpresaLayout>
  );
}
