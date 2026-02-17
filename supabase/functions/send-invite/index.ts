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

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { nome, email, portal_client_id, resend } = await req.json();

    if (!nome || !email || !portal_client_id) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios: nome, email, portal_client_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller owns the empresa that owns this portal_client
    const { data: pc, error: pcError } = await supabaseAdmin
      .from("portal_clients")
      .select("empresa_id")
      .eq("id", portal_client_id)
      .single();

    if (pcError || !pc) {
      return new Response(JSON.stringify({ error: "Cliente não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: empresa } = await supabaseAdmin
      .from("empresas")
      .select("id, nome")
      .eq("id", pc.empresa_id)
      .eq("owner_id", caller.id)
      .single();

    if (!empresa) {
      return new Response(JSON.stringify({ error: "Sem permissão" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If resending, cancel previous pending invites
    if (resend) {
      await supabaseAdmin
        .from("invites")
        .update({ status: "canceled" })
        .eq("portal_client_id", portal_client_id)
        .eq("email", email)
        .eq("status", "pending");
    }

    // Generate secure token
    const token = crypto.randomUUID();

    // Create invite record
    const { error: inviteError } = await supabaseAdmin
      .from("invites")
      .insert({
        portal_client_id,
        empresa_id: empresa.id,
        email,
        nome,
        token,
        status: "pending",
      });

    if (inviteError) {
      console.error("Invite insert error:", inviteError);
      return new Response(JSON.stringify({ error: inviteError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create portal_client_users record (only on first invite, not resend)
    let newUser = null;
    if (!resend) {
      const { data: pcu, error: pcuError } = await supabaseAdmin
        .from("portal_client_users")
        .insert({
          portal_client_id,
          nome,
          email,
          status: "pendente",
        })
        .select("id, nome, email, status")
        .single();

      if (pcuError) {
        console.error("portal_client_users insert error:", pcuError);
        return new Response(JSON.stringify({ error: pcuError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      newUser = pcu;
    }

    // Send invite email using Supabase Auth inviteUserByEmail
    // The redirect URL points to our custom accept-invite page with the token
    const redirectUrl = `https://portalclientev2.lovable.app/accept-invite?token=${token}`;

    const { error: emailError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        nome,
        role: "cliente",
      },
      redirectTo: redirectUrl,
    });

    if (emailError) {
      // If user already exists in auth, that's ok - we still sent the invite record
      console.log("Auth invite note:", emailError.message);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: newUser,
      message: resend ? "Convite reenviado com sucesso" : "Convite enviado com sucesso"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
