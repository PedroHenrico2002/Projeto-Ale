import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [codeSent, setCodeSent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-auth-code', {
        body: { email }
      });

      if (error) {
        throw error;
      }

      setCodeSent(true);
      toast({
        title: "Código enviado!",
        description: "Verifique seu email para obter o código de autenticação.",
      });
    } catch (error: any) {
      console.error('Erro ao enviar código:', error);
      setError(error.message || 'Erro ao enviar código. Tente novamente.');
      toast({
        title: "Erro ao enviar código",
        description: error.message || 'Tente novamente em alguns instantes.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError('Por favor, insira o código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-auth-code', {
        body: { email, code }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Usar as propriedades retornadas para fazer login
      const { properties } = data.session;
      
      // Fazer login usando o hashed_token
      const { error: signInError } = await supabase.auth.verifyOtp({
        email,
        token: properties.hashed_token,
        type: 'magiclink'
      });

      if (signInError) {
        // Tentar método alternativo: setSession
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: properties.access_token,
          refresh_token: properties.refresh_token
        });

        if (sessionError) {
          throw sessionError;
        }
      }

      toast({
        title: data.isNewUser ? "Conta criada com sucesso!" : "Login realizado com sucesso!",
        description: data.isNewUser ? "Bem-vindo!" : "Bem-vindo de volta!",
      });
      
      navigate(from);
    } catch (error: any) {
      console.error('Erro ao verificar código:', error);
      
      if (error.message.includes('inválido')) {
        setError('Código inválido. Verifique e tente novamente.');
      } else if (error.message.includes('expirado')) {
        setError('Código expirado. Solicite um novo código.');
        setCodeSent(false);
        setCode('');
      } else {
        setError(error.message || 'Erro ao verificar código. Tente novamente.');
      }
      
      toast({
        title: "Erro na autenticação",
        description: error.message || 'Tente novamente.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setCode('');
    setCodeSent(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Legendary Food</CardTitle>
            <CardDescription>
              {!codeSent 
                ? 'Insira seu email para receber o código de acesso'
                : 'Digite o código enviado para seu email'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!codeSent ? (
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
                  {loading ? 'Enviando código...' : 'Enviar código'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-center block">
                    Código de verificação
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Código enviado para: <span className="font-medium">{email}</span>
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || code.length !== 6}
                  >
                    {loading ? 'Verificando...' : 'Verificar código'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendCode}
                    disabled={loading}
                  >
                    Solicitar novo código
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};