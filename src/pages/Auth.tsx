import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const Auth: React.FC = () => {
  // Estado para armazenar o email do usuário
  const [email, setEmail] = useState('');
  // Estado para armazenar a senha do usuário
  const [password, setPassword] = useState('');
  // Estado para armazenar o nome completo do usuário
  const [name, setName] = useState('');
  // Estado de carregamento para desabilitar botões durante requisições
  const [loading, setLoading] = useState(false);
  // Estado para mensagens de erro
  const [error, setError] = useState<string>('');
  
  // Hook para navegação entre páginas
  const navigate = useNavigate();
  // Hook para obter a localização atual
  const location = useLocation();
  // Página de origem para redirecionar após login
  const from = (location.state as any)?.from?.pathname || '/';

  // Função para criar nova conta de usuário
  const handleSignUp = async (e: React.FormEvent) => {
    // Prevenir comportamento padrão do formulário
    e.preventDefault();
    
    // Validação: verificar se o email é válido
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    // Validação: senha deve ter pelo menos 6 caracteres
    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validação: nome não pode estar vazio
    if (!name || name.trim().length === 0) {
      setError('Por favor, insira seu nome completo');
      return;
    }

    // Ativar estado de carregamento
    setLoading(true);
    // Limpar mensagens de erro anteriores
    setError('');

    try {
      // Criar nova conta no Supabase Auth
      // O redirect URL garante que o usuário seja redirecionado após confirmar o email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, // Email do usuário
        password, // Senha do usuário
        options: {
          // URL para onde o usuário será redirecionado após confirmar o email
          // window.location.origin pega a URL base do site (ex: https://seusite.com)
          emailRedirectTo: `${window.location.origin}/`,
          // Dados adicionais do usuário salvos em user_metadata
          // Esses dados serão usados pelo trigger do banco para criar o perfil
          data: {
            name: name.trim() // Nome do usuário (remove espaços extras)
          }
        }
      });

      // Se houver erro na criação da conta, lançar exceção
      if (signUpError) throw signUpError;

      // Verificar se o Supabase requer confirmação de email
      // Se data.user existe mas session é null, significa que precisa confirmar email
      if (data.user && !data.session) {
        // Email de confirmação enviado - usuário precisa verificar email
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar sua conta. Confira também a caixa de spam.",
        });
        // Limpar os campos do formulário
        setEmail('');
        setPassword('');
        setName('');
      } else if (data.session) {
        // Se já está logado (confirmação de email desabilitada no Supabase)
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado em instantes.",
        });
        
        // Aguardar um pouco para garantir que o perfil foi criado no banco
        // O trigger handle_new_user cria automaticamente o perfil
        setTimeout(() => {
          // Redirecionar para a página de origem ou home
          navigate(from);
        }, 1000);
      }
    } catch (error: any) {
      // Log do erro no console para debugging
      console.error('Erro ao criar conta:', error);
      
      // Definir mensagem de erro amigável
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      // Mensagens específicas para erros comuns
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Faça login.';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Mostrar toast com erro
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Desativar estado de carregamento
      setLoading(false);
    }
  };

  // Função para fazer login
  const handleSignIn = async (e: React.FormEvent) => {
    // Prevenir comportamento padrão do formulário
    e.preventDefault();
    
    // Validação: verificar se o email é válido
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    // Validação: senha não pode estar vazia
    if (!password) {
      setError('Por favor, insira sua senha');
      return;
    }

    // Ativar estado de carregamento
    setLoading(true);
    // Limpar mensagens de erro anteriores
    setError('');

    try {
      // Tentar fazer login com email e senha
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email, // Email do usuário
        password, // Senha do usuário
      });

      // Se houver erro no login, lançar exceção
      if (signInError) throw signInError;

      // Verificar se o email foi confirmado
      // email_confirmed_at é null se o email não foi verificado
      if (data.user && !data.user.email_confirmed_at) {
        // Se o email não foi confirmado, fazer logout e mostrar erro
        await supabase.auth.signOut();
        setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
        toast({
          title: "Email não confirmado",
          description: "Por favor, verifique seu email e confirme sua conta antes de fazer login.",
          variant: "destructive",
        });
        return;
      }

      // Login bem-sucedido e email confirmado
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      
      // Redirecionar para a página de origem ou home
      navigate(from);
    } catch (error: any) {
      // Log do erro no console para debugging
      console.error('Erro ao fazer login:', error);
      
      // Definir mensagem de erro apropriada
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      // Mensagens específicas para erros comuns
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Mostrar toast com erro
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Desativar estado de carregamento
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Legendary Food</CardTitle>
            <CardDescription>
              Crie sua conta e tenha seu ambiente personalizado
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Tabs para alternar entre Login e Cadastro */}
            <Tabs defaultValue="login" className="w-full">
              {/* Lista de abas */}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              {/* Conteúdo da aba de Login */}
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Exibir alerta de erro se houver */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Campo de Email */}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  
                  {/* Campo de Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Botão de Submit */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Conteúdo da aba de Cadastro */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Exibir alerta de erro se houver */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Campo de Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  
                  {/* Campo de Email */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Campo de Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  
                  {/* Botão de Submit */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                  
                  {/* Informação sobre verificação de email */}
                  <p className="text-xs text-muted-foreground text-center">
                    Você receberá um email de confirmação após criar sua conta
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};