import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type EntregaStatus = "em_revisao" | "aprovado" | "ajuste_solicitado";

interface EntregaData {
  id: string;
  nome: string;
  status: EntregaStatus;
  links: string[];
  legenda: string | null;
  ajuste_texto: string | null;
  ajuste_data_hora: string | null;
}

export default function ClienteEntregaDetalhe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const entregaId = searchParams.get("id") || "";

  const [entrega, setEntrega] = useState<EntregaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingAtivo, setOnboardingAtivo] = useState(false);
  const [comentario, setComentario] = useState("");
  const [ajusteDialogOpen, setAjusteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!user || !entregaId) return;

      const { data: pc } = await supabase
        .from("portal_clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!pc) { setLoading(false); return; }

      const [entregaRes, ctxRes] = await Promise.all([
        supabase
          .from("client_entregas")
          .select("id, nome, status, link, legenda, ajuste_texto, ajuste_data_hora")
          .eq("id", entregaId)
          .eq("portal_client_id", pc.id)
          .maybeSingle(),
        supabase
          .from("client_contexto")
          .select("onboarding_ativo")
          .eq("portal_client_id", pc.id)
          .maybeSingle(),
      ]);

      if (entregaRes.data) {
        const raw = entregaRes.data as any;
        let links: string[] = [];
        try { links = JSON.parse(raw.link); } catch { if (raw.link) links = [raw.link]; }
        setEntrega({ ...raw, links } as EntregaData);
      }
      if (ctxRes.data) {
        setOnboardingAtivo(ctxRes.data.onboarding_ativo || false);
      }
      setLoading(false);
    }
    fetchData();
  }, [user, entregaId]);

  const handleAprovar = async () => {
    if (!entrega) return;
    setSaving(true);
    const { error } = await supabase
      .from("client_entregas")
      .update({ status: "aprovado", ajuste_texto: null, ajuste_data_hora: null })
      .eq("id", entrega.id);

    if (error) {
      toast.error("Erro ao aprovar entrega");
      console.error(error);
    } else {
      setEntrega({ ...entrega, status: "aprovado", ajuste_texto: null, ajuste_data_hora: null });
      toast.success("Entrega aprovada!");
    }
    setSaving(false);
  };

  const handleSolicitarAjuste = async () => {
    if (!entrega || !comentario.trim()) return;
    setSaving(true);
    const dataHora = new Date().toLocaleString("pt-BR");
    const { error } = await supabase
      .from("client_entregas")
      .update({
        status: "ajuste_solicitado",
        ajuste_texto: comentario,
        ajuste_data_hora: dataHora,
      })
      .eq("id", entrega.id);

    if (error) {
      toast.error("Erro ao solicitar ajuste");
      console.error(error);
    } else {
      setEntrega({
        ...entrega,
        status: "ajuste_solicitado",
        ajuste_texto: comentario,
        ajuste_data_hora: dataHora,
      });
      toast.success("Ajuste solicitado!");
      setAjusteDialogOpen(false);
      setComentario("");
    }
    setSaving(false);
  };

  const getStatusBadge = () => {
    if (!entrega) return null;
    switch (entrega.status) {
      case "aprovado":
        return <StatusBadge variant="success">Aprovado</StatusBadge>;
      case "ajuste_solicitado":
        return <StatusBadge variant="warning">Ajuste solicitado</StatusBadge>;
      default:
        return <StatusBadge variant="warning">Em revisão</StatusBadge>;
    }
  };

  if (loading) {
    return (
      <ClienteLayout onboardingAtivo={onboardingAtivo}>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </ClienteLayout>
    );
  }

  if (!entrega) {
    return (
      <ClienteLayout onboardingAtivo={onboardingAtivo}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Entrega não encontrada</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </ClienteLayout>
    );
  }

  return (
    <ClienteLayout onboardingAtivo={onboardingAtivo}>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{entrega.nome}</h1>
            <div className="mt-1 flex items-center gap-2">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full bg-muted">
              {entrega.links.length > 0 ? (
                <div className="relative">
                  {/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(entrega.links[currentImageIndex]) ? (
                    <img src={entrega.links[currentImageIndex]} alt={`${entrega.nome} - ${currentImageIndex + 1}`} className="w-full max-h-[500px] object-contain" />
                  ) : /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(entrega.links[currentImageIndex]) ? (
                    <video src={entrega.links[currentImageIndex]} controls className="w-full max-h-[500px]" />
                  ) : /\.pdf(\?.*)?$/i.test(entrega.links[currentImageIndex]) ? (
                    <iframe src={entrega.links[currentImageIndex]} className="w-full h-[500px]" title={entrega.nome} />
                  ) : (
                    <div className="aspect-video w-full flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Pré-visualização não disponível</p>
                    </div>
                  )}
                  {entrega.links.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(i => i > 0 ? i - 1 : entrega.links.length - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(i => i < entrega.links.length - 1 ? i + 1 : 0)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                        {entrega.links.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`h-2 w-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Nenhum arquivo disponível</p>
                </div>
              )}
            </div>
            {entrega.legenda && (
              <div className="border-t border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">{entrega.legenda}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ajuste Solicitado */}
        {entrega.status === "ajuste_solicitado" && entrega.ajuste_texto && (
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-warning">
                <Clock className="h-6 w-6 text-warning-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Ajuste solicitado</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Seu pedido foi enviado. Aguarde o retorno da equipe.
                </p>
                <div className="mt-3 rounded-lg bg-background p-3">
                  <p className="text-sm text-foreground">{entrega.ajuste_texto}</p>
                  {entrega.ajuste_data_hora && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Enviado em {entrega.ajuste_data_hora}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        {entrega.status === "em_revisao" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-semibold text-foreground">O que você achou?</h2>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="h-14 w-full gap-2"
                  onClick={handleAprovar}
                  disabled={saving}
                >
                  <CheckCircle className="h-5 w-5" />
                  {saving ? "Salvando..." : "Aprovar entrega"}
                </Button>

                <Dialog open={ajusteDialogOpen} onOpenChange={setAjusteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="h-14 w-full gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Solicitar ajuste
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar ajuste</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-start gap-3 rounded-lg bg-warning/10 p-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-warning" />
                        <p className="text-sm text-muted-foreground">
                          Descreva o que precisa ser ajustado. Sua solicitação será enviada para a equipe.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ajuste-texto">Descreva o ajuste necessário</Label>
                        <Textarea
                          id="ajuste-texto"
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          placeholder="Descreva os ajustes necessários..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setAjusteDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSolicitarAjuste} disabled={!comentario.trim() || saving}>
                        {saving ? "Enviando..." : "Enviar solicitação"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aprovado */}
        {entrega.status === "aprovado" && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success">
                <CheckCircle className="h-6 w-6 text-success-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Entrega aprovada!</h3>
                <p className="text-sm text-muted-foreground">
                  Obrigado pelo feedback. A equipe seguirá para as próximas etapas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClienteLayout>
  );
}
