import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find invite by token
    const { data: invite, error } = await supabaseAdmin
      .from("invites")
      .select("id, nome, email, status, expires_at, empresa_id")
      .eq("token", token)
      .single();

    if (error || !invite) {
      return new Response(JSON.stringify({ error: "Convite não encontrado", valid: false }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      // Update status to expired
      await supabaseAdmin
        .from("invites")
        .update({ status: "expired" })
        .eq("id", invite.id);

      return new Response(JSON.stringify({ error: "Convite expirado", valid: false }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check status
    if (invite.status !== "pending") {
      return new Response(JSON.stringify({ 
        error: invite.status === "accepted" ? "Convite já utilizado" : "Convite inválido", 
        valid: false 
      }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get empresa name
    const { data: empresa } = await supabaseAdmin
      .from("empresas")
      .select("nome")
      .eq("id", invite.empresa_id)
      .single();

    return new Response(JSON.stringify({
      valid: true,
      nome: invite.nome,
      email: invite.email,
      empresa_nome: empresa?.nome || "",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("validate-invite error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
