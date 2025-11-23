import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const Auth: React.FC = () => {
  // Estado para armazenar o email do usuário
  const [email, setEmail] = useState('');
  // Estado para armazenar o código de verificação enviado por email
  const [code, setCode] = useState('');
  // Estado para controlar se o código foi enviado
  const [codeSent, setCodeSent] = useState(false);
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

  // Função para enviar código de verificação por email
  const handleSendCode = async (e: React.FormEvent) => {
    // Prevenir comportamento padrão do formulário
    e.preventDefault();
    
    // Validação: verificar se o email é válido
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    // Ativar estado de carregamento
    setLoading(true);
    // Limpar mensagens de erro anteriores
    setError('');

    try {
      // Chamar edge function para enviar código de autenticação
      const { data, error: functionError } = await supabase.functions.invoke('send-auth-code', {
        body: { email }
      });

      // Se houver erro ao enviar código, lançar exceção
      if (functionError) throw functionError;

      // Código enviado com sucesso
      setCodeSent(true);
      toast({
        title: "Código enviado!",
        description: "Verifique seu email. O código expira em 10 minutos.",
      });
    } catch (error: any) {
      // Log do erro no console para debugging
      console.error('Erro ao enviar código:', error);
      
      // Definir mensagem de erro amigável
      setError(error.message || 'Erro ao enviar código. Tente novamente.');
      
      // Mostrar toast com erro
      toast({
        title: "Erro ao enviar código",
        description: error.message || 'Tente novamente em alguns instantes.',
        variant: "destructive",
      });
    } finally {
      // Desativar estado de carregamento
      setLoading(false);
    }
  };

  // Função para verificar código e fazer login
  const handleVerifyCode = async (e: React.FormEvent) => {
    // Prevenir comportamento padrão do formulário
    e.preventDefault();
    
    // Validação: verificar se o código foi preenchido
    if (!code || code.length !== 6) {
      setError('Por favor, insira o código de 6 dígitos');
      return;
    }

    // Ativar estado de carregamento
    setLoading(true);
    // Limpar mensagens de erro anteriores
    setError('');

    try {
      // Chamar edge function para verificar código
      const { data, error: functionError } = await supabase.functions.invoke('verify-auth-code', {
        body: { email, code }
      });

      // Se houver erro ao verificar código, lançar exceção
      if (functionError) throw functionError;

      // Verificar se recebemos um magic link
      if (data?.magic_link) {
        // Redirecionar para o magic link para autenticar
        window.location.href = data.magic_link;
      } else {
        throw new Error('Código inválido ou expirado');
      }
    } catch (error: any) {
      // Log do erro no console para debugging
      console.error('Erro ao verificar código:', error);
      
      // Definir mensagem de erro apropriada
      if (error.message.includes('invalid') || error.message.includes('expired')) {
        setError('Código inválido ou expirado. Solicite um novo código.');
      } else {
        setError(error.message || 'Erro ao verificar código. Tente novamente.');
      }
      
      // Mostrar toast com erro
      toast({
        title: "Erro ao verificar código",
        description: error.message.includes('invalid') || error.message.includes('expired')
          ? 'Código inválido ou expirado. Solicite um novo código.'
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
              {codeSent ? 'Digite o código enviado para seu email' : 'Entre com seu email para continuar'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!codeSent ? (
              // Formulário para solicitar código de verificação
              <form onSubmit={handleSendCode} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando código...' : 'Enviar código de verificação'}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Um código de 6 dígitos será enviado para seu email
                </p>
              </form>
            ) : (
              // Formulário para verificar código
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Verificação</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    disabled={loading}
                    autoFocus
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enviado para: {email}
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
                  {loading ? 'Verificando...' : 'Verificar código'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setCodeSent(false);
                    setCode('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Voltar
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSendCode}
                  disabled={loading}
                >
                  Reenviar código
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};