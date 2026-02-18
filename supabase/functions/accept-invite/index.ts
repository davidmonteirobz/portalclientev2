import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // POST with action=validate or action=accept
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.action === "validate") {
        return handleValidate(body.token, supabaseAdmin);
      }
      return handleAccept(body, supabaseAdmin);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
});

async function handleValidate(token: string | null, supabaseAdmin: any) {
  try {
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token não fornecido", valid: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: invite, error } = await supabaseAdmin
      .from("invites")
      .select("id, nome, email, status, expires_at, empresa_id")
      .eq("token", token)
      .single();

    if (error || !invite) {
      return new Response(
        JSON.stringify({ error: "Convite não encontrado", valid: false }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(invite.expires_at) < new Date()) {
      await supabaseAdmin.from("invites").update({ status: "expired" }).eq("id", invite.id);
      return new Response(
        JSON.stringify({ error: "Convite expirado", valid: false }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (invite.status !== "pending") {
      return new Response(
        JSON.stringify({
          error: invite.status === "accepted" ? "Convite já utilizado" : "Convite inválido",
          valid: false,
        }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: empresa } = await supabaseAdmin
      .from("empresas")
      .select("nome")
      .eq("id", invite.empresa_id)
      .single();

    return new Response(
      JSON.stringify({
        valid: true,
        nome: invite.nome,
        email: invite.email,
        empresa_nome: empresa?.nome || "",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("validate error:", err);
    return new Response(
      JSON.stringify({ error: err.message, valid: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

async function handleAccept(body: any, supabaseAdmin: any) {
  try {
    const { token, password } = body;

    if (!token || !password) {
      return new Response(
        JSON.stringify({ error: "Token e senha são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("invites")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .single();

    if (inviteError || !invite) {
      return new Response(
        JSON.stringify({ error: "Convite inválido ou já utilizado" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(invite.expires_at) < new Date()) {
      await supabaseAdmin.from("invites").update({ status: "expired" }).eq("id", invite.id);
      return new Response(
        JSON.stringify({ error: "Convite expirado" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u: any) => u.email === invite.email);

    let userId: string;

    if (existingUser) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password, email_confirm: true, user_metadata: { nome: invite.nome, role: "cliente" } }
      );
      if (updateError) {
        console.error("Update user error:", updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = existingUser.id;
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: invite.email,
        password,
        email_confirm: true,
        user_metadata: { nome: invite.nome, role: "cliente" },
      });
      if (createError) {
        console.error("Create user error:", createError);
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = newUser.user.id;
    }

    await supabaseAdmin.from("invites")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invite.id);

    await supabaseAdmin.from("portal_client_users")
      .update({ status: "ativo" })
      .eq("email", invite.email)
      .eq("portal_client_id", invite.portal_client_id);

    await supabaseAdmin.from("portal_clients")
      .update({ user_id: userId, status: "ativo", activated_at: new Date().toISOString() })
      .eq("id", invite.portal_client_id);

    return new Response(
      JSON.stringify({ success: true, message: "Conta criada com sucesso!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("accept-invite error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
