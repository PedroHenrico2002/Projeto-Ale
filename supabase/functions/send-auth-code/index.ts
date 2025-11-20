import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
}

const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: RequestBody = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Criar cliente Supabase com service role para acessar auth_codes
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Gerar código de 6 dígitos
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expira em 10 minutos

    // Limpar códigos antigos do mesmo email
    await supabase
      .from("auth_codes")
      .delete()
      .eq("email", email);

    // Salvar código no banco de dados
    const { error: dbError } = await supabase
      .from("auth_codes")
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (dbError) {
      console.error("Erro ao salvar código:", dbError);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar código" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Enviar email com o código
    const { error: emailError } = await resend.emails.send({
      from: "Sistema de Entrega <onboarding@resend.dev>",
      to: [email],
      subject: "Seu código de autenticação",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Código de Autenticação</h1>
          <p style="font-size: 16px; color: #666;">
            Use o código abaixo para fazer login na plataforma:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            Este código expira em 10 minutos.
          </p>
          <p style="font-size: 14px; color: #999;">
            Se você não solicitou este código, ignore este email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Erro ao enviar email:", emailError);
      return new Response(
        JSON.stringify({ error: "Erro ao enviar email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Código ${code} enviado com sucesso para ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "Código enviado com sucesso" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Erro na função send-auth-code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});