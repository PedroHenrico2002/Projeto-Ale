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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  // Função para criar nova conta com verificação de email
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
      setError('Por favor, insira seu nome');
      return;
    }

    // Ativar estado de carregamento
    setLoading(true);
    // Limpar mensagens de erro anteriores
    setError('');

    try {
      // Criar nova conta no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, // Email do usuário
        password, // Senha do usuário
        options: {
          // URL para onde o usuário será redirecionado após confirmar o email
          emailRedirectTo: `${window.location.origin}/`,
          // Dados adicionais do usuário (salvos em user_metadata)
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
        // Mostrar mensagem de sucesso com instrução para verificar email
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar sua conta. Confira também a caixa de spam.",
        });
        // Limpar os campos do formulário
        setEmail('');
        setPassword('');
        setName('');
      } else {
        // Se já está logado (confirmação de email desabilitada no Supabase)
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado em instantes.",
        });
        
        // Aguardar um pouco para garantir que o perfil foi criado no banco
        setTimeout(() => {
          // Redirecionar para a página de origem ou home
          navigate(from);
        }, 1000);
      }
    } catch (error: any) {
      // Log do erro no console para debugging
      console.error('Erro ao criar conta:', error);
      
      // Definir mensagem de erro amigável
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
      
      // Mostrar toast com erro
      toast({
        title: "Erro ao criar conta",
        description: error.message || 'Tente novamente em alguns instantes.',
        variant: "destructive",
      });
    } finally {
      // Desativar estado de carregamento
      setLoading(false);
    }
  };

  // Função para fazer login com verificação de email confirmado
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
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor, confirme seu email antes de fazer login');
      } else {
        setError(error.message || 'Erro ao fazer login. Tente novamente.');
      }
      
      // Mostrar toast com erro
      toast({
        title: "Erro no login",
        description: error.message.includes('Invalid login credentials') 
          ? 'Email ou senha incorretos' 
          : error.message.includes('Email not confirmed')
          ? 'Confirme seu email antes de fazer login'
          : 'Tente novamente.',
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
              Entre ou crie sua conta para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
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
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome</Label>
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
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};