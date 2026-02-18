import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type InviteState = "loading" | "valid" | "invalid" | "expired" | "used" | "success";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [state, setState] = useState<InviteState>("loading");
  const [inviteData, setInviteData] = useState({ nome: "", email: "", empresa_nome: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      setErrorMessage("Link de convite inválido. Verifique se o link está completo.");
      return;
    }

    const validate = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/accept-invite`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
            body: JSON.stringify({ action: "validate", token }),
          }
        );
        const data = await res.json();

        if (res.ok && data.valid) {
          setInviteData({ nome: data.nome, email: data.email, empresa_nome: data.empresa_nome });
          setState("valid");
        } else if (res.status === 410) {
          setState(data.error?.includes("utilizado") ? "used" : "expired");
          setErrorMessage(data.error);
        } else {
          setState("invalid");
          setErrorMessage(data.error || "Convite inválido.");
        }
      } catch {
        setState("invalid");
        setErrorMessage("Erro ao validar convite. Tente novamente.");
      }
    };

    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setState("success");
        toast.success("Conta criada com sucesso!");

        // Try auto-login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: inviteData.email,
          password,
        });

        if (!loginError) {
          setTimeout(() => navigate("/cliente/dashboard"), 1500);
        } else {
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        toast.error(data.error || "Erro ao criar conta.");
      }
    } catch {
      toast.error("Erro ao processar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        {state === "loading" && (
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Validando convite...</p>
          </CardContent>
        )}

        {state === "valid" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Criar sua senha</CardTitle>
              <p className="text-sm text-muted-foreground">
                Você foi convidado por <strong>{inviteData.empresa_nome}</strong>
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={inviteData.nome} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input value={inviteData.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar senha *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta e acessar"
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {state === "success" && (
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">Conta criada!</h2>
              <p className="text-sm text-muted-foreground">Redirecionando...</p>
            </div>
          </CardContent>
        )}

        {(state === "invalid" || state === "expired" || state === "used") && (
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold">
                {state === "expired" ? "Convite expirado" : state === "used" ? "Convite já utilizado" : "Convite inválido"}
              </h2>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com a empresa para solicitar um novo convite.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Ir para o login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
