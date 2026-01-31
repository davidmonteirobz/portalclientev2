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
  Circle,
  Rocket,
  AlertCircle,
} from "lucide-react";
import { EmpresaLayout } from "@/components/empresa/EmpresaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";

interface AjusteSolicitado {
  texto: string;
  dataHora: string;
}

interface Entrega {
  id: string;
  nome: string;
  status: "em_revisao" | "aprovado" | "ajuste_solicitado";
  link: string;
  ajuste?: AjusteSolicitado;
}

interface Material {
  id: string;
  nome: string;
  link: string;
}

interface EtapaOnboarding {
  id: string;
  nome: string;
  status: "concluido" | "atual" | "pendente";
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

  // Estado do Onboarding
  const [onboarding, setOnboarding] = useState({
    nome: "Onboarding do Serviço",
    ativo: true,
    etapas: [
      { id: "1", nome: "Reunião inicial", status: "concluido" as const },
      { id: "2", nome: "Briefing", status: "concluido" as const },
      { id: "3", nome: "Envio de materiais", status: "concluido" as const },
      { id: "4", nome: "Setup inicial", status: "atual" as const },
      { id: "5", nome: "Aprovação final", status: "pendente" as const },
    ] as EtapaOnboarding[],
  });

  const [novaEtapaDialog, setNovaEtapaDialog] = useState(false);
  const [novaEtapa, setNovaEtapa] = useState("");

  const [faseAtual, setFaseAtual] = useState("Design da Nova Home");
  const [proximaAcao, setProximaAcao] = useState({
    descricao: "Revisar protótipo da Home",
    prazoData: "2026-02-03",
    prazoHorario: "18:00",
  });
  const [reuniao, setReuniao] = useState({
    data: "2026-02-05",
    horario: "14:00",
    assunto: "Revisão do protótipo da home",
  });
  const [observacoesInternas, setObservacoesInternas] = useState(
    "Cliente prefere tons mais claros. Prazo flexível para esta entrega."
  );

  const [entregas, setEntregas] = useState<Entrega[]>([
    { id: "1", nome: "Wireframe Home", status: "aprovado", link: "https://figma.com/..." },
    { id: "2", nome: "Design Home v1", status: "em_revisao", link: "https://figma.com/..." },
    { 
      id: "3", 
      nome: "Design Home v2", 
      status: "ajuste_solicitado", 
      link: "https://figma.com/...",
      ajuste: {
        texto: "Gostaria que o banner principal fosse mais alto e com cores mais vibrantes. Também seria bom adicionar um botão de CTA mais visível.",
        dataHora: "31/01/2026, 14:30",
      }
    },
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

  const handleEntregaEmAndamento = (id: string) => {
    setEntregas(
      entregas.map((e) =>
        e.id === id
          ? { ...e, status: "em_revisao", ajuste: undefined }
          : e
      )
    );
  };

  const handleEntregaResolvida = (id: string) => {
    setEntregas(
      entregas.map((e) =>
        e.id === id
          ? { ...e, status: "aprovado", ajuste: undefined }
          : e
      )
    );
  };

  const toggleEntregaStatus = (id: string) => {
    setEntregas(
      entregas.map((e) => {
        if (e.id !== id) return e;
        if (e.status === "ajuste_solicitado") return e; // Não altera pelo toggle se tem ajuste
        return { ...e, status: e.status === "aprovado" ? "em_revisao" : "aprovado" };
      })
    );
  };

  // Funções do Onboarding
  const handleAddEtapa = () => {
    if (novaEtapa.trim()) {
      const newEtapa: EtapaOnboarding = {
        id: Date.now().toString(),
        nome: novaEtapa.trim(),
        status: "pendente",
      };
      setOnboarding({
        ...onboarding,
        etapas: [...onboarding.etapas, newEtapa],
      });
      setNovaEtapa("");
      setNovaEtapaDialog(false);
    }
  };

  const handleRemoveEtapa = (id: string) => {
    setOnboarding({
      ...onboarding,
      etapas: onboarding.etapas.filter((e) => e.id !== id),
    });
  };

  const cycleEtapaStatus = (id: string) => {
    setOnboarding({
      ...onboarding,
      etapas: onboarding.etapas.map((e) => {
        if (e.id !== id) return e;
        const nextStatus = e.status === "pendente" ? "atual" : e.status === "atual" ? "concluido" : "pendente";
        return { ...e, status: nextStatus };
      }),
    });
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

            {/* Seção 2 - Onboarding */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Rocket className="h-4 w-4" />
                    Onboarding
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="onboarding-ativo" className="text-sm text-muted-foreground">
                      {onboarding.ativo ? "Ativo" : "Concluído"}
                    </Label>
                    <Switch
                      id="onboarding-ativo"
                      checked={onboarding.ativo}
                      onCheckedChange={(checked) =>
                        setOnboarding({ ...onboarding, ativo: checked })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="onboarding-nome">Nome do onboarding</Label>
                  <Input
                    id="onboarding-nome"
                    value={onboarding.nome}
                    onChange={(e) =>
                      setOnboarding({ ...onboarding, nome: e.target.value })
                    }
                    placeholder="Ex: Onboarding do Serviço"
                  />
                </div>

                {/* Lista de Etapas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Etapas</Label>
                    <Dialog open={novaEtapaDialog} onOpenChange={setNovaEtapaDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">
                          <Plus className="h-3 w-3" />
                          Adicionar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nova Etapa</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Nome da etapa</Label>
                            <Input
                              value={novaEtapa}
                              onChange={(e) => setNovaEtapa(e.target.value)}
                              placeholder="Ex: Reunião inicial"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setNovaEtapaDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddEtapa}>Adicionar</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-1.5">
                    {onboarding.etapas.map((etapa) => (
                      <div
                        key={etapa.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-2.5",
                          etapa.status === "concluido"
                            ? "border-success/30 bg-success/5"
                            : etapa.status === "atual"
                            ? "border-primary/30 bg-primary/5"
                            : "border-border bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cycleEtapaStatus(etapa.id)}
                            className="flex-shrink-0"
                          >
                            {etapa.status === "concluido" ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : etapa.status === "atual" ? (
                              <Clock className="h-4 w-4 text-primary" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              etapa.status === "pendente"
                                ? "text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {etapa.nome}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveEtapa(etapa.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {onboarding.etapas.length === 0 && (
                      <p className="py-3 text-center text-sm text-muted-foreground">
                        Nenhuma etapa cadastrada
                      </p>
                    )}
                  </div>
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
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    value={reuniao.assunto}
                    onChange={(e) => setReuniao({ ...reuniao, assunto: e.target.value })}
                    placeholder="Ex: Revisão do protótipo, Alinhamento de briefing..."
                  />
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
                <div className="space-y-3">
                  {entregas.map((entrega) => (
                    <div
                      key={entrega.id}
                      className={cn(
                        "rounded-lg border bg-background p-3",
                        entrega.status === "ajuste_solicitado"
                          ? "border-warning/30"
                          : "border-border"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleEntregaStatus(entrega.id)}
                            disabled={entrega.status === "ajuste_solicitado"}
                          >
                            {entrega.status === "aprovado" ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : entrega.status === "ajuste_solicitado" ? (
                              <AlertCircle className="h-5 w-5 text-warning" />
                            ) : (
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <span className="font-medium">{entrega.nome}</span>
                          <StatusBadge
                            variant={
                              entrega.status === "aprovado"
                                ? "success"
                                : entrega.status === "ajuste_solicitado"
                                ? "warning"
                                : "muted"
                            }
                          >
                            {entrega.status === "aprovado"
                              ? "Aprovado"
                              : entrega.status === "ajuste_solicitado"
                              ? "Ajuste solicitado"
                              : "Em revisão"}
                          </StatusBadge>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={entrega.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>

                      {/* Detalhes do Ajuste Solicitado */}
                      {entrega.status === "ajuste_solicitado" && entrega.ajuste && (
                        <div className="mt-3 space-y-3 border-t border-warning/20 pt-3">
                          <div className="rounded-lg bg-warning/5 p-3">
                            <p className="text-sm text-foreground">{entrega.ajuste.texto}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Solicitado em {entrega.ajuste.dataHora}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleEntregaEmAndamento(entrega.id)}
                            >
                              <Clock className="mr-1.5 h-4 w-4" />
                              Marcar como em andamento
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEntregaResolvida(entrega.id)}
                            >
                              <CheckCircle className="mr-1.5 h-4 w-4" />
                              Marcar como resolvido
                            </Button>
                          </div>
                        </div>
                      )}
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
