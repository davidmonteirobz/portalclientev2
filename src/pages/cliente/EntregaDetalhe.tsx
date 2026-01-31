import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClienteLayout } from "@/components/cliente/ClienteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ClienteEntregaDetalhe() {
  const navigate = useNavigate();
  // Dados mockados - onboarding ativo viria da empresa
  const onboardingAtivo = true;
  const [searchParams] = useSearchParams();
  const entregaId = searchParams.get("id") || "2";

  // Mock data
  const entrega = {
    id: entregaId,
    nome: "Design Home v1",
    status: "em_revisao" as "em_revisao" | "aprovado",
    link: "https://figma.com/...",
    previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
  };

  const [comentario, setComentario] = useState("");
  const [ajusteDialogOpen, setAjusteDialogOpen] = useState(false);
  const [aprovado, setAprovado] = useState(false);

  const handleAprovar = () => {
    setAprovado(true);
  };

  const handleSolicitarAjuste = () => {
    setAjusteDialogOpen(false);
    setComentario("");
  };

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
              <StatusBadge
                variant={aprovado ? "success" : entrega.status === "aprovado" ? "success" : "warning"}
              >
                {aprovado ? "Aprovado" : entrega.status === "aprovado" ? "Aprovado" : "Em revisão"}
              </StatusBadge>
            </div>
          </div>
        </div>

        {/* Preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full bg-muted">
              <img
                src={entrega.previewImage}
                alt={entrega.nome}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                <Button asChild variant="secondary" className="gap-2">
                  <a href={entrega.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Abrir no Figma
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        {!aprovado && entrega.status !== "aprovado" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-semibold text-foreground">O que você achou?</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAprovar}
                >
                  <CheckCircle className="h-5 w-5" />
                  Aprovar entrega
                </Button>

                <Dialog open={ajusteDialogOpen} onOpenChange={setAjusteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="flex-1 gap-2">
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
                      <Textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Descreva os ajustes necessários..."
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setAjusteDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSolicitarAjuste}>Enviar solicitação</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aprovado */}
        {(aprovado || entrega.status === "aprovado") && (
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
