import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  UserPlus,
  Mail,
  X,
  Save,
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
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type StatusContrato = "ativo" | "pausado" | "rescindido";

const statusContratoConfig: Record<StatusContrato, { label: string; variant: "success" | "warning" | "destructive" }> = {
  ativo: { label: "Contrato ativo", variant: "success" },
  pausado: { label: "Contrato pausado", variant: "warning" },
  rescindido: { label: "Contrato rescindido", variant: "destructive" },
};

interface AjusteSolicitado {
  texto: string;
  dataHora: string;
}

interface Entrega {
  id: string;
  nome: string;
  status: "em_revisao" | "aprovado" | "ajuste_solicitado";
  link: string;
  legenda?: string;
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
  dataConclusao?: string;
}

interface UsuarioCliente {
  id: string;
  nome: string;
  email: string;
  status: "pendente" | "ativo";
}

export default function EmpresaClienteDetalhe() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get("id") || "";
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estados do cliente
  const [cliente, setCliente] = useState({
    id: clienteId,
    nome: "",
    negocio: "",
    servico: "",
  });

  const [statusContrato, setStatusContrato] = useState<StatusContrato>("ativo");

  const [editarCadastroDialog, setEditarCadastroDialog] = useState(false);
  const [clienteEditando, setClienteEditando] = useState({
    nome: "",
    negocio: "",
    servico: "",
  });

  const handleAbrirEditarCadastro = () => {
    setClienteEditando({
      nome: cliente.nome,
      negocio: cliente.negocio || "",
      servico: cliente.servico,
    });
    setEditarCadastroDialog(true);
  };

  const handleSalvarCadastro = () => {
    setCliente({
      ...cliente,
      nome: clienteEditando.nome,
      negocio: clienteEditando.negocio,
      servico: clienteEditando.servico,
    });
    setEditarCadastroDialog(false);
  };

  // Estado do Onboarding
  const [onboarding, setOnboarding] = useState({
    nome: "Onboarding do Serviço",
    ativo: false,
    etapas: [] as EtapaOnboarding[],
  });

  const [novaEtapaDialog, setNovaEtapaDialog] = useState(false);
  const [novaEtapa, setNovaEtapa] = useState("");
  const [novaEtapaData, setNovaEtapaData] = useState("");

  const [faseAtual, setFaseAtual] = useState("");
  const [proximaAcao, setProximaAcao] = useState({
    descricao: "",
    prazoData: "",
    prazoHorario: "",
  });
  const [reuniao, setReuniao] = useState({
    data: "",
    horario: "",
    assunto: "",
  });
  const [observacoesInternas, setObservacoesInternas] = useState("");

  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);

  const [novaEntregaDialog, setNovaEntregaDialog] = useState(false);
  const [novaEntrega, setNovaEntrega] = useState({ nome: "", link: "", legenda: "" });

  const [editarEntregaDialog, setEditarEntregaDialog] = useState(false);
  const [entregaEditando, setEntregaEditando] = useState<{ id: string; nome: string; link: string; legenda: string }>({ id: "", nome: "", link: "", legenda: "" });

  const [novoMaterialDialog, setNovoMaterialDialog] = useState(false);
  const [novoMaterial, setNovoMaterial] = useState({ nome: "", link: "" });

  const [editarMaterialDialog, setEditarMaterialDialog] = useState(false);
  const [materialEditando, setMaterialEditando] = useState<{ id: string; nome: string; link: string }>({ id: "", nome: "", link: "" });

  // Estado dos usuários de acesso ao portal
  const [usuarios, setUsuarios] = useState<UsuarioCliente[]>([]);
  const [novoUsuarioDialog, setNovoUsuarioDialog] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({ nome: "", email: "" });

  // Fetch all client data from Supabase
  useEffect(() => {
    const fetchAll = async () => {
      if (!clienteId) return;
      try {
        setLoading(true);

        // Fetch client info
        const { data: clientData } = await supabase
          .from("portal_clients")
          .select("id, nome, negocio, servico, email, whatsapp, status")
          .eq("id", clienteId)
          .single();

        if (clientData) {
          setCliente({ id: clientData.id, nome: clientData.nome, negocio: clientData.negocio || "", servico: clientData.servico || "" });
          const s = clientData.status as StatusContrato;
          if (s === "ativo" || s === "pausado" || s === "rescindido") setStatusContrato(s);
        }

        // Fetch contexto
        const { data: ctx } = await supabase
          .from("client_contexto")
          .select("*")
          .eq("portal_client_id", clienteId)
          .maybeSingle();

        if (ctx) {
          setFaseAtual(ctx.fase_atual || "");
          setProximaAcao({ descricao: ctx.proxima_acao_descricao || "", prazoData: ctx.proxima_acao_prazo_data || "", prazoHorario: ctx.proxima_acao_prazo_horario || "" });
          setReuniao({ data: ctx.reuniao_data || "", horario: ctx.reuniao_horario || "", assunto: ctx.reuniao_assunto || "" });
          setObservacoesInternas(ctx.observacoes_internas || "");
          setOnboarding(prev => ({ ...prev, nome: ctx.onboarding_nome || "Onboarding do Serviço", ativo: ctx.onboarding_ativo || false }));
        }

        // Fetch entregas
        const { data: entregasData } = await supabase
          .from("client_entregas")
          .select("*")
          .eq("portal_client_id", clienteId)
          .order("created_at");

        if (entregasData) {
          setEntregas(entregasData.map((e: any) => ({
            id: e.id,
            nome: e.nome,
            status: e.status as any,
            link: e.link,
            legenda: e.legenda || undefined,
            ajuste: e.ajuste_texto ? { texto: e.ajuste_texto, dataHora: e.ajuste_data_hora || "" } : undefined,
          })));
        }

        // Fetch materiais
        const { data: matData } = await supabase
          .from("client_materiais")
          .select("*")
          .eq("portal_client_id", clienteId)
          .order("created_at");

        if (matData) {
          setMateriais(matData.map((m: any) => ({ id: m.id, nome: m.nome, link: m.link })));
        }

        // Fetch onboarding etapas
        const { data: etapasData } = await supabase
          .from("client_onboarding_etapas")
          .select("*")
          .eq("portal_client_id", clienteId)
          .order("ordem");

        if (etapasData) {
          setOnboarding(prev => ({
            ...prev,
            etapas: etapasData.map((e: any) => ({ id: e.id, nome: e.nome, status: e.status as any, dataConclusao: e.data_conclusao || "" })),
          }));
        }

        // Fetch usuarios
        const { data: usersData } = await supabase
          .from("portal_client_users")
          .select("id, nome, email, status")
          .eq("portal_client_id", clienteId);

        if (usersData) {
          setUsuarios(usersData.map((u: any) => ({ id: u.id, nome: u.nome, email: u.email, status: u.status })));
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [clienteId]);

  // ===== SALVAR TUDO =====
  const handleSalvarAlteracoes = async () => {
    setSalvando(true);
    try {
      // 1. Update portal_clients (nome, negocio, servico, status)
      const { error: clientError } = await supabase
        .from("portal_clients")
        .update({ nome: cliente.nome, negocio: cliente.negocio || null, servico: cliente.servico, status: statusContrato })
        .eq("id", clienteId);

      if (clientError) {
        console.error("Erro ao atualizar cliente:", clientError);
        toast.error("Sem permissão para salvar. Verifique se está logado com a conta da empresa.");
        setSalvando(false);
        return;
      }

      // 2. Upsert contexto
      await supabase
        .from("client_contexto")
        .upsert({
          portal_client_id: clienteId,
          fase_atual: faseAtual,
          proxima_acao_descricao: proximaAcao.descricao,
          proxima_acao_prazo_data: proximaAcao.prazoData,
          proxima_acao_prazo_horario: proximaAcao.prazoHorario,
          reuniao_data: reuniao.data,
          reuniao_horario: reuniao.horario,
          reuniao_assunto: reuniao.assunto,
          observacoes_internas: observacoesInternas,
          onboarding_nome: onboarding.nome,
          onboarding_ativo: onboarding.ativo,
        }, { onConflict: "portal_client_id" });

      // 3. Sync entregas: delete all, re-insert
      await supabase.from("client_entregas").delete().eq("portal_client_id", clienteId);
      if (entregas.length > 0) {
        await supabase.from("client_entregas").insert(
          entregas.map((e) => ({
            portal_client_id: clienteId,
            nome: e.nome,
            link: e.link,
            legenda: e.legenda || null,
            status: e.status,
            ajuste_texto: e.ajuste?.texto || null,
            ajuste_data_hora: e.ajuste?.dataHora || null,
          }))
        );
      }

      // 4. Sync materiais: delete all, re-insert
      await supabase.from("client_materiais").delete().eq("portal_client_id", clienteId);
      if (materiais.length > 0) {
        await supabase.from("client_materiais").insert(
          materiais.map((m) => ({
            portal_client_id: clienteId,
            nome: m.nome,
            link: m.link,
          }))
        );
      }

      // 5. Sync onboarding etapas: delete all, re-insert
      await supabase.from("client_onboarding_etapas").delete().eq("portal_client_id", clienteId);
      if (onboarding.etapas.length > 0) {
        await supabase.from("client_onboarding_etapas").insert(
          onboarding.etapas.map((e, i) => ({
            portal_client_id: clienteId,
            nome: e.nome,
            status: e.status,
            ordem: i,
            data_conclusao: e.dataConclusao || "",
          }))
        );
      }

      toast.success("Alterações salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast.error("Erro ao salvar alterações");
    } finally {
      setSalvando(false);
    }
  };

  const handleAddEntrega = () => {
    if (!novaEntrega.nome.trim()) {
      toast.error("Preencha o nome da entrega");
      return;
    }
    if (!novaEntrega.link.trim()) {
      toast.error("Preencha o link da entrega");
      return;
    }
    setEntregas([
      ...entregas,
      { id: Date.now().toString(), nome: novaEntrega.nome.trim(), status: "em_revisao", link: novaEntrega.link.trim(), legenda: novaEntrega.legenda?.trim() || undefined },
    ]);
    setNovaEntrega({ nome: "", link: "", legenda: "" });
    setNovaEntregaDialog(false);
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

  const handleExcluirEntrega = (id: string) => {
    setEntregas(entregas.filter((e) => e.id !== id));
    toast.success("Entrega removida");
  };

  const handleEditarEntrega = (entrega: Entrega) => {
    setEntregaEditando({ id: entrega.id, nome: entrega.nome, link: entrega.link, legenda: entrega.legenda || "" });
    setEditarEntregaDialog(true);
  };

  const handleSalvarEntrega = () => {
    setEntregas(entregas.map((e) => e.id === entregaEditando.id ? { ...e, nome: entregaEditando.nome, link: entregaEditando.link, legenda: entregaEditando.legenda || undefined } : e));
    setEditarEntregaDialog(false);
  };

  const handleEditarMaterial = (material: Material) => {
    setMaterialEditando({ id: material.id, nome: material.nome, link: material.link });
    setEditarMaterialDialog(true);
  };

  const handleSalvarMaterial = () => {
    setMateriais(materiais.map((m) => m.id === materialEditando.id ? { ...m, nome: materialEditando.nome, link: materialEditando.link } : m));
    setEditarMaterialDialog(false);
  };

  const handleEntregaEmAndamento = (id: string) => {
    setEntregas(entregas.map((e) => e.id === id ? { ...e, status: "em_revisao", ajuste: undefined } : e));
  };

  const handleEntregaResolvida = (id: string) => {
    setEntregas(entregas.map((e) => e.id === id ? { ...e, status: "aprovado", ajuste: undefined } : e));
  };

  const toggleEntregaStatus = (id: string) => {
    setEntregas(entregas.map((e) => {
      if (e.id !== id) return e;
      if (e.status === "ajuste_solicitado") return e;
      return { ...e, status: e.status === "aprovado" ? "em_revisao" : "aprovado" };
    }));
  };

  // Funções do Onboarding
  const handleAddEtapa = () => {
    if (novaEtapa.trim()) {
      setOnboarding({
        ...onboarding,
        etapas: [...onboarding.etapas, { id: Date.now().toString(), nome: novaEtapa.trim(), status: "pendente", dataConclusao: novaEtapaData || "" }],
      });
      setNovaEtapa("");
      setNovaEtapaData("");
      setNovaEtapaDialog(false);
    }
  };

  const handleRemoveEtapa = (id: string) => {
    setOnboarding({ ...onboarding, etapas: onboarding.etapas.filter((e) => e.id !== id) });
  };

  const handleChangeEtapaStatus = (id: string, newStatus: "pendente" | "atual" | "concluido") => {
    setOnboarding({
      ...onboarding,
      etapas: onboarding.etapas.map((e) => {
        if (e.id !== id) return e;
        const dataConclusao = newStatus === "concluido" && !e.dataConclusao
          ? new Date().toISOString().split("T")[0]
          : newStatus !== "concluido" ? "" : e.dataConclusao;
        return { ...e, status: newStatus, dataConclusao };
      }),
    });
  };

  const handleChangeEtapaDataConclusao = (id: string, date: string) => {
    setOnboarding({
      ...onboarding,
      etapas: onboarding.etapas.map((e) => e.id === id ? { ...e, dataConclusao: date } : e),
    });
  };

  // Funções de usuários do portal
  const [enviandoConvite, setEnviandoConvite] = useState(false);
  const [reenviandoConvite, setReenviandoConvite] = useState<string | null>(null);

  const sendInvite = async (nome: string, email: string, resend = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      "https://byilgvjorlntlldvjexq.supabase.co/functions/v1/send-invite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5aWxndmpvcmxudGxsZHZqZXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzQ5MTksImV4cCI6MjA4NjY1MDkxOX0.C_NVXPpKc-9rEquqF86ph7vi4GcDw2oc3MtJn8JcfQc",
        },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), portal_client_id: clienteId, resend }),
      }
    );
    return { res, result: await res.json() };
  };

  const handleAddUsuario = async () => {
    if (novoUsuario.nome.trim() && novoUsuario.email.trim()) {
      setEnviandoConvite(true);
      try {
        const { res, result } = await sendInvite(novoUsuario.nome, novoUsuario.email);
        if (!res.ok) {
          toast.error(result.error || "Erro ao enviar convite");
        } else {
          if (result.user) {
            setUsuarios([...usuarios, { id: result.user.id, nome: result.user.nome, email: result.user.email, status: result.user.status }]);
          }
          toast.success("Convite enviado! O cliente receberá um e-mail para criar sua senha.");
        }
      } catch (err) {
        toast.error("Erro ao enviar convite");
      } finally {
        setEnviandoConvite(false);
      }
      setNovoUsuario({ nome: "", email: "" });
      setNovoUsuarioDialog(false);
    }
  };

  const handleResendInvite = async (usuario: UsuarioCliente) => {
    setReenviandoConvite(usuario.id);
    try {
      const { res, result } = await sendInvite(usuario.nome, usuario.email, true);
      if (!res.ok) {
        toast.error(result.error || "Erro ao reenviar convite");
      } else {
        toast.success("Convite reenviado com sucesso!");
      }
    } catch {
      toast.error("Erro ao reenviar convite");
    } finally {
      setReenviandoConvite(null);
    }
  };

  const handleRemoveUsuario = async (id: string) => {
    await supabase.from("portal_client_users").delete().eq("id", id);
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  return (
    <EmpresaLayout>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
      <div className="animate-fade-in space-y-8 overflow-hidden">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("/empresa/clientes")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Dialog open={editarCadastroDialog} onOpenChange={setEditarCadastroDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" onClick={handleAbrirEditarCadastro}>
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Editar cadastro</span>
                    <span className="sm:hidden">Editar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar cadastro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nome">Nome do cliente *</Label>
                      <Input id="edit-nome" value={clienteEditando.nome} onChange={(e) => setClienteEditando({ ...clienteEditando, nome: e.target.value })} placeholder="Ex: Maria Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-negocio">Nome do negócio (opcional)</Label>
                      <Input id="edit-negocio" value={clienteEditando.negocio} onChange={(e) => setClienteEditando({ ...clienteEditando, negocio: e.target.value })} placeholder="Ex: Studio Bella" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-servico">Serviço ativo *</Label>
                      <Input id="edit-servico" value={clienteEditando.servico} onChange={(e) => setClienteEditando({ ...clienteEditando, servico: e.target.value })} placeholder="Ex: Design Mensal" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setEditarCadastroDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSalvarCadastro}>Salvar</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={handleSalvarAlteracoes} disabled={salvando} className="gap-2">
                {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="hidden sm:inline">Salvar alterações</span>
                <span className="sm:hidden">Salvar</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground whitespace-nowrap">{cliente.nome}</h1>
            {cliente.negocio && <p className="text-base text-muted-foreground">{cliente.negocio}</p>}
            <div className="pt-1">
              <StatusBadge variant="primary" className="whitespace-nowrap">{cliente.servico}</StatusBadge>
            </div>
          </div>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fase">Tipo de contrato ou projeto</Label>
                    <Input id="fase" value={faseAtual} onChange={(e) => setFaseAtual(e.target.value)} placeholder="Ex: Design da Nova Home" />
                    <p className="text-xs text-muted-foreground">Aparece no portal como: "Agora estamos em: {faseAtual}"</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Status do contrato</Label>
                    <Select value={statusContrato} onValueChange={(value) => setStatusContrato(value as StatusContrato)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Contrato ativo</SelectItem>
                        <SelectItem value="pausado">Contrato pausado</SelectItem>
                        <SelectItem value="rescindido">Contrato rescindido</SelectItem>
                      </SelectContent>
                    </Select>
                    <StatusBadge variant={statusContratoConfig[statusContrato].variant}>{statusContratoConfig[statusContrato].label}</StatusBadge>
                  </div>
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
                    <Label htmlFor="onboarding-ativo" className="text-sm text-muted-foreground">{onboarding.ativo ? "Ativo" : "Concluído"}</Label>
                    <Switch id="onboarding-ativo" checked={onboarding.ativo} onCheckedChange={(checked) => setOnboarding({ ...onboarding, ativo: checked })} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="onboarding-nome">Nome do onboarding</Label>
                  <Input id="onboarding-nome" value={onboarding.nome} onChange={(e) => setOnboarding({ ...onboarding, nome: e.target.value })} placeholder="Ex: Onboarding do Serviço" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Etapas</Label>
                    <Dialog open={novaEtapaDialog} onOpenChange={setNovaEtapaDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs"><Plus className="h-3 w-3" />Adicionar</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Nova Etapa</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Nome da etapa</Label>
                            <Input value={novaEtapa} onChange={(e) => setNovaEtapa(e.target.value)} placeholder="Ex: Reunião inicial" />
                          </div>
                          <div className="space-y-2">
                            <Label>Data de entrega (opcional)</Label>
                            <Input type="date" value={novaEtapaData} onChange={(e) => setNovaEtapaData(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setNovaEtapaDialog(false)}>Cancelar</Button>
                          <Button onClick={handleAddEtapa}>Adicionar</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-1.5">
                    {onboarding.etapas.map((etapa) => (
                      <div key={etapa.id} className={cn("rounded-lg border p-3 space-y-2", etapa.status === "concluido" ? "border-success/30 bg-success/5" : etapa.status === "atual" ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30")}>
                        <div className="flex items-center justify-between">
                          <span className={cn("text-sm font-medium", etapa.status === "pendente" ? "text-muted-foreground" : "text-foreground")}>{etapa.nome}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveEtapa(etapa.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={etapa.status} onValueChange={(v) => handleChangeEtapaStatus(etapa.id, v as any)}>
                            <SelectTrigger className="h-7 text-xs w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="atual">Em andamento</SelectItem>
                              <SelectItem value="concluido">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={etapa.dataConclusao || ""}
                            onChange={(e) => handleChangeEtapaDataConclusao(etapa.id, e.target.value)}
                            className="h-7 text-xs w-[140px]"
                          />
                        </div>
                      </div>
                    ))}
                    {onboarding.etapas.length === 0 && <p className="py-3 text-center text-sm text-muted-foreground">Nenhuma etapa cadastrada</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção 3 - Próxima Ação */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Próxima Ação do Cliente</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="acao">Descrição da ação</Label>
                  <Input id="acao" value={proximaAcao.descricao} onChange={(e) => setProximaAcao({ ...proximaAcao, descricao: e.target.value })} placeholder="Ex: Revisar protótipo da Home" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prazoData">Prazo - Data</Label>
                    <Input id="prazoData" type="date" value={proximaAcao.prazoData} onChange={(e) => setProximaAcao({ ...proximaAcao, prazoData: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prazoHorario">Prazo - Horário</Label>
                    <Input id="prazoHorario" type="time" value={proximaAcao.prazoHorario} onChange={(e) => setProximaAcao({ ...proximaAcao, prazoHorario: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção 4 - Próxima Reunião */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4" />Próxima Reunião</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" value={reuniao.data} onChange={(e) => setReuniao({ ...reuniao, data: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input id="horario" type="time" value={reuniao.horario} onChange={(e) => setReuniao({ ...reuniao, horario: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input id="assunto" value={reuniao.assunto} onChange={(e) => setReuniao({ ...reuniao, assunto: e.target.value })} placeholder="Ex: Revisão do protótipo, Alinhamento de briefing..." />
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
                      <Button size="sm" variant="outline" className="gap-1"><Plus className="h-3.5 w-3.5" />Adicionar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Nova Entrega</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nome da entrega *</Label>
                          <Input value={novaEntrega.nome} onChange={(e) => setNovaEntrega({ ...novaEntrega, nome: e.target.value })} placeholder="Ex: Design Home v2" />
                        </div>
                        <div className="space-y-2">
                          <Label>Link *</Label>
                          <Input value={novaEntrega.link} onChange={(e) => setNovaEntrega({ ...novaEntrega, link: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Legenda (opcional)</Label>
                          <Textarea value={novaEntrega.legenda} onChange={(e) => setNovaEntrega({ ...novaEntrega, legenda: e.target.value })} placeholder="Descreva o que está sendo entregue..." rows={3} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNovaEntregaDialog(false)}>Cancelar</Button>
                        <Button onClick={handleAddEntrega}>Adicionar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entregas.map((entrega) => (
                    <div key={entrega.id} className={cn("rounded-lg border bg-background p-3", entrega.status === "ajuste_solicitado" ? "border-warning/30" : "border-border")}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <button onClick={() => toggleEntregaStatus(entrega.id)} disabled={entrega.status === "ajuste_solicitado"} className="flex-shrink-0">
                            {entrega.status === "aprovado" ? <CheckCircle className="h-5 w-5 text-success" /> : entrega.status === "ajuste_solicitado" ? <AlertCircle className="h-5 w-5 text-warning" /> : <Clock className="h-5 w-5 text-muted-foreground" />}
                          </button>
                          <span className="font-medium truncate">{entrega.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-8 sm:pl-0">
                          <StatusBadge variant={entrega.status === "aprovado" ? "success" : entrega.status === "ajuste_solicitado" ? "warning" : "muted"}>
                            {entrega.status === "aprovado" ? "Aprovado" : entrega.status === "ajuste_solicitado" ? "Ajuste solicitado" : "Em revisão"}
                          </StatusBadge>
                          <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => handleEditarEntrega(entrega)}><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="flex-shrink-0 text-foreground hover:text-destructive" onClick={() => handleExcluirEntrega(entrega.id)} aria-label="Excluir entrega" title="Excluir entrega"><Trash2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="flex-shrink-0" asChild>
                            <a href={entrega.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                          </Button>
                        </div>
                      </div>
                      {entrega.status === "ajuste_solicitado" && entrega.ajuste && (
                        <div className="mt-3 space-y-3 border-t border-warning/20 pt-3">
                          <div className="rounded-lg bg-warning/5 p-3">
                            <p className="text-sm text-foreground">{entrega.ajuste.texto}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Solicitado em {entrega.ajuste.dataHora}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleEntregaEmAndamento(entrega.id)}>
                              <Clock className="mr-1.5 h-4 w-4" />Marcar como em andamento
                            </Button>
                            <Button size="sm" className="w-full" onClick={() => handleEntregaResolvida(entrega.id)}>
                              <CheckCircle className="mr-1.5 h-4 w-4" />Marcar como resolvido
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {entregas.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma entrega cadastrada</p>}
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
                      <Button size="sm" variant="outline" className="gap-1"><Plus className="h-3.5 w-3.5" />Adicionar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Novo Material</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nome do material</Label>
                          <Input value={novoMaterial.nome} onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })} placeholder="Ex: Referências" />
                        </div>
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input value={novoMaterial.link} onChange={(e) => setNovoMaterial({ ...novoMaterial, link: e.target.value })} placeholder="https://..." />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNovoMaterialDialog(false)}>Cancelar</Button>
                        <Button onClick={handleAddMaterial}>Adicionar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materiais.map((material) => (
                    <div key={material.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <span className="font-medium">{material.nome}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditarMaterial(material)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={material.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setMateriais(materiais.filter((m) => m.id !== material.id))}>
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
                <CardTitle className="text-base text-muted-foreground">Observações Internas</CardTitle>
                <p className="text-xs text-muted-foreground">Somente visível para a empresa</p>
              </CardHeader>
              <CardContent>
                <Textarea value={observacoesInternas} onChange={(e) => setObservacoesInternas(e.target.value)} placeholder="Anotações internas sobre este cliente..." rows={4} />
              </CardContent>
            </Card>

            {/* Seção 8 - Acesso ao Portal */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base"><UserPlus className="h-4 w-4" />Acesso ao Portal</CardTitle>
                  <Dialog open={novoUsuarioDialog} onOpenChange={setNovoUsuarioDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1"><Plus className="h-3.5 w-3.5" />Adicionar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Novo Acesso</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nome do usuário</Label>
                          <Input value={novoUsuario.nome} onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} placeholder="Ex: Maria Silva" />
                        </div>
                        <div className="space-y-2">
                          <Label>E-mail (será o login)</Label>
                          <Input type="email" value={novoUsuario.email} onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })} placeholder="maria@email.com" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNovoUsuarioDialog(false)}>Cancelar</Button>
                        <Button onClick={handleAddUsuario} disabled={enviandoConvite}>{enviandoConvite ? "Enviando..." : "Adicionar"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground">Usuários com acesso ao portal do cliente</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hidden sm:flex">
                          <span className="text-sm font-medium">{usuario.nome.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-sm">{usuario.nome}</p>
                          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground"><Mail className="h-3 w-3 flex-shrink-0" />{usuario.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge variant={usuario.status === "ativo" ? "success" : "warning"}>{usuario.status === "ativo" ? "Ativo" : "Pendente"}</StatusBadge>
                        {usuario.status === "pendente" && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => handleResendInvite(usuario)} disabled={reenviandoConvite === usuario.id}>
                            {reenviandoConvite === usuario.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                            Reenviar
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveUsuario(usuario.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {usuarios.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Nenhum usuário cadastrado</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      )}

      {/* Dialog Editar Entrega */}
      <Dialog open={editarEntregaDialog} onOpenChange={setEditarEntregaDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Entrega</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nome da entrega</Label><Input value={entregaEditando.nome} onChange={(e) => setEntregaEditando({ ...entregaEditando, nome: e.target.value })} /></div>
            <div className="space-y-2"><Label>Link</Label><Input value={entregaEditando.link} onChange={(e) => setEntregaEditando({ ...entregaEditando, link: e.target.value })} /></div>
            <div className="space-y-2"><Label>Legenda (opcional)</Label><Input value={entregaEditando.legenda} onChange={(e) => setEntregaEditando({ ...entregaEditando, legenda: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditarEntregaDialog(false)}>Cancelar</Button>
            <Button onClick={handleSalvarEntrega}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Material */}
      <Dialog open={editarMaterialDialog} onOpenChange={setEditarMaterialDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Material</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nome do material</Label><Input value={materialEditando.nome} onChange={(e) => setMaterialEditando({ ...materialEditando, nome: e.target.value })} /></div>
            <div className="space-y-2"><Label>Link</Label><Input value={materialEditando.link} onChange={(e) => setMaterialEditando({ ...materialEditando, link: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditarMaterialDialog(false)}>Cancelar</Button>
            <Button onClick={handleSalvarMaterial}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </EmpresaLayout>
  );
}
