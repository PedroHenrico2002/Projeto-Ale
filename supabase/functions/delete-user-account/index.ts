// Edge Function para excluir conta de usuário
// Esta função é executada no servidor com permissões elevadas

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

// Configura o cliente Supabase com a service role key (permissões de admin)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Handler principal da função
Deno.serve(async (req) => {
  // Define headers CORS para permitir requisições do frontend
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Responde requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Obtém o token de autenticação do header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    // Verifica o usuário autenticado
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Usuário não encontrado');
    }

    // Exclui o usuário do sistema de autenticação
    // Nota: O perfil e outros dados relacionados serão excluídos automaticamente
    // através das configurações de CASCADE no banco de dados
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      throw deleteError;
    }

    // Retorna resposta de sucesso
    return new Response(
      JSON.stringify({ message: 'Conta excluída com sucesso' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    // Retorna resposta de erro
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
