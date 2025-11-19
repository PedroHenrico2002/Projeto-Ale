import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  code: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: RequestBody = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email e código são obrigatórios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Criar cliente Supabase com service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar código no banco de dados
    const { data: authCode, error: fetchError } = await supabase
      .from("auth_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single();

    if (fetchError || !authCode) {
      console.log("Código não encontrado ou inválido");
      return new Response(
        JSON.stringify({ error: "Código inválido" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verificar se o código expirou
    const expiresAt = new Date(authCode.expires_at);
    if (expiresAt < new Date()) {
      console.log("Código expirado");
      return new Response(
        JSON.stringify({ error: "Código expirado" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Marcar código como usado
    await supabase
      .from("auth_codes")
      .update({ used: true })
      .eq("id", authCode.id);

    // Verificar se o usuário já existe
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    const existingUser = users?.find(u => u.email === email);

    if (existingUser) {
      // Usuário existe, fazer login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: code, // Temporário, vamos usar OTP na próxima versão
      });

      // Como não podemos fazer login direto com OTP, vamos criar um token de acesso
      // Gerar link mágico de login
      const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });

      if (magicLinkError) {
        console.error("Erro ao gerar magic link:", magicLinkError);
        return new Response(
          JSON.stringify({ error: "Erro ao autenticar usuário" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Usuário autenticado: ${email}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          user: magicLinkData.user,
          session: magicLinkData.properties,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Usuário não existe, criar conta
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          email,
        },
      });

      if (signUpError) {
        console.error("Erro ao criar usuário:", signUpError);
        return new Response(
          JSON.stringify({ error: "Erro ao criar usuário" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Gerar link mágico para o novo usuário
      const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });

      if (magicLinkError) {
        console.error("Erro ao gerar magic link:", magicLinkError);
        return new Response(
          JSON.stringify({ error: "Erro ao autenticar usuário" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Novo usuário criado: ${email}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          user: magicLinkData.user,
          session: magicLinkData.properties,
          isNewUser: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("Erro na função verify-auth-code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});