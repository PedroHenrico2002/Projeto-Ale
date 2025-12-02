import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Chrome, Mail, Phone, User, Lock, MapPin, Home } from 'lucide-react';

// Componente principal de autenticação
export const Auth: React.FC = () => {
  // Estados para os campos do formulário de login/cadastro
  const [email, setEmail] = useState(''); // Email do usuário
  const [password, setPassword] = useState(''); // Senha do usuário
  const [name, setName] = useState(''); // Nome completo do usuário
  const [phone, setPhone] = useState(''); // Telefone do usuário (opcional)
  
  // Estados para os campos do endereço (cadastro)
  const [zipCode, setZipCode] = useState(''); // CEP
  const [street, setStreet] = useState(''); // Rua/Logradouro
  const [number, setNumber] = useState(''); // Número
  const [complement, setComplement] = useState(''); // Complemento (opcional)
  const [neighborhood, setNeighborhood] = useState(''); // Bairro
  const [city, setCity] = useState(''); // Cidade
  const [state, setState] = useState(''); // Estado (UF)
  
  // Estados de controle do componente
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string>(''); // Mensagem de erro
  const [loadingCep, setLoadingCep] = useState(false); // Estado de busca do CEP
  
  // Hooks de navegação
  const navigate = useNavigate(); // Hook para navegação entre páginas
  const location = useLocation(); // Hook para obter a localização atual
  const from = (location.state as any)?.from?.pathname || '/'; // Página de origem

  // Função para formatar telefone no padrão brasileiro
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função para formatar CEP no padrão brasileiro
  const formatCep = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Aplica máscara XXXXX-XXX
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Função para buscar endereço pelo CEP usando a API ViaCEP
  const handleCepBlur = async () => {
    // Limpa o CEP para validação
    const cleanCep = zipCode.replace(/\D/g, '');
    
    // Verifica se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) return;
    
    // Ativa estado de carregamento
    setLoadingCep(true);
    
    try {
      // Faz requisição para a API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      // Verifica se o CEP foi encontrado
      if (!data.erro) {
        // Preenche os campos com os dados retornados
        setStreet(data.logradouro || ''); // Rua
        setNeighborhood(data.bairro || ''); // Bairro
        setCity(data.localidade || ''); // Cidade
        setState(data.uf || ''); // Estado
      } else {
        // CEP não encontrado
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Erro na requisição
      console.error('Erro ao buscar CEP:', error);
    } finally {
      // Desativa estado de carregamento
      setLoadingCep(false);
    }
  };

  // Função de validação dos campos de cadastro
  const validateSignUpForm = (): string | null => {
    // Validação do nome
    if (!name || name.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }
    if (name.trim().length > 100) {
      return 'Nome deve ter no máximo 100 caracteres';
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
      return 'Nome deve conter apenas letras';
    }
    
    // Validação do email
    if (!email || !email.includes('@')) {
      return 'Por favor, insira um email válido';
    }
    if (email.length > 255) {
      return 'Email deve ter no máximo 255 caracteres';
    }
    
    // Validação da senha
    if (!password || password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    if (password.length > 128) {
      return 'Senha deve ter no máximo 128 caracteres';
    }
    
    // Validação do telefone (se preenchido)
    if (phone) {
      const phoneNumbers = phone.replace(/\D/g, '');
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        return 'Telefone inválido. Use o formato (XX) XXXXX-XXXX';
      }
    }
    
    // Validação do CEP
    const cleanCep = zipCode.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length !== 8) {
      return 'CEP deve ter 8 dígitos';
    }
    
    // Validação da rua
    if (!street || street.trim().length < 3) {
      return 'Rua deve ter pelo menos 3 caracteres';
    }
    
    // Validação do número
    if (!number || number.trim().length === 0) {
      return 'Número é obrigatório';
    }
    
    // Validação do bairro
    if (!neighborhood || neighborhood.trim().length < 2) {
      return 'Bairro deve ter pelo menos 2 caracteres';
    }
    
    // Validação da cidade
    if (!city || city.trim().length < 2) {
      return 'Cidade deve ter pelo menos 2 caracteres';
    }
    
    // Validação do estado
    if (!state || state.length !== 2) {
      return 'Estado deve ter 2 caracteres (UF)';
    }
    
    return null; // Validação passou
  };

  // Função para criar nova conta de usuário
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Executar validações
    const validationError = validateSignUpForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Criar nova conta no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name.trim(),
            phone: phone || null,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Se a conta foi criada e temos um user_id, salvar o endereço
      if (data.user) {
        // Aguardar um momento para garantir que o perfil foi criado
        setTimeout(async () => {
          try {
            // Inserir o endereço no banco de dados
            const { error: addressError } = await supabase.from('addresses').insert({
              user_id: data.user!.id,
              street: street.trim(),
              number: number.trim(),
              complement: complement.trim() || null,
              neighborhood: neighborhood.trim(),
              city: city.trim(),
              state: state.toUpperCase(),
              zip_code: zipCode.replace(/\D/g, ''),
              is_default: true, // Primeiro endereço é o padrão
            });
            
            if (addressError) {
              console.error('Erro ao salvar endereço:', addressError);
            }
          } catch (err) {
            console.error('Erro ao salvar endereço:', err);
          }
        }, 1000);
      }

      // Verificar se requer confirmação de email
      if (data.user && !data.session) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar sua conta. Confira também a caixa de spam.",
        });
        // Limpar campos
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setZipCode('');
        setStreet('');
        setNumber('');
        setComplement('');
        setNeighborhood('');
        setCity('');
        setState('');
      } else if (data.session) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado em instantes.",
        });
        setTimeout(() => navigate(from), 1000);
      }
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Faça login.';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer login com email/senha
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }
    if (!password) {
      setError('Por favor, insira sua senha');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fazer login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Verificar se email foi confirmado
      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        setError('Por favor, confirme seu email antes de fazer login.');
        toast({
          title: "Email não confirmado",
          description: "Verifique seu email e confirme sua conta.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      navigate(from);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Confirme seu email antes de fazer login';
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer login com Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Chamar método de login OAuth do Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          scopes: 'email profile',
        },
      });

      if (error) throw error;
      // Redirecionamento é automático
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      setError('Erro ao conectar com Google. Tente novamente.');
      toast({
        title: "Erro no login com Google",
        description: "Não foi possível conectar com sua conta Google.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Legendary Food</CardTitle>
            <CardDescription>
              Crie sua conta e tenha seu ambiente personalizado
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Botão de Login com Google */}
            <Button 
              variant="outline" 
              className="w-full mb-4" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continuar com Google
            </Button>
            
            {/* Separador */}
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                ou continue com email
              </span>
            </div>
            
            {/* Tabs para alternar entre Login e Cadastro */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              {/* Aba de Login */}
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Campo Email */}
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      maxLength={255}
                    />
                  </div>
                  
                  {/* Campo Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Senha <span className="text-destructive">*</span>
                    </Label>
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
              
              {/* Aba de Cadastro */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Seção: Dados Pessoais */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dados Pessoais
                    </h3>
                    
                    {/* Campo Nome */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-name" className="text-xs">
                        Nome Completo <span className="text-destructive">*</span>
                        <span className="text-muted-foreground ml-1">(3-100 caracteres)</span>
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                        minLength={3}
                        maxLength={100}
                      />
                    </div>
                    
                    {/* Campo Email */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-email" className="text-xs">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        maxLength={255}
                      />
                    </div>
                    
                    {/* Campo Senha */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-password" className="text-xs">
                        Senha <span className="text-destructive">*</span>
                        <span className="text-muted-foreground ml-1">(mínimo 6 caracteres)</span>
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                        maxLength={128}
                      />
                    </div>
                    
                    {/* Campo Telefone */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-phone" className="text-xs flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Telefone
                        <span className="text-muted-foreground ml-1">(opcional)</span>
                      </Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        disabled={loading}
                        maxLength={15}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Seção: Endereço */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço de Entrega
                    </h3>
                    
                    {/* Campo CEP */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-cep" className="text-xs">
                        CEP <span className="text-destructive">*</span>
                        <span className="text-muted-foreground ml-1">(8 dígitos)</span>
                      </Label>
                      <Input
                        id="signup-cep"
                        type="text"
                        placeholder="XXXXX-XXX"
                        value={zipCode}
                        onChange={(e) => setZipCode(formatCep(e.target.value))}
                        onBlur={handleCepBlur}
                        required
                        disabled={loading || loadingCep}
                        maxLength={9}
                      />
                      {loadingCep && <span className="text-xs text-muted-foreground">Buscando endereço...</span>}
                    </div>
                    
                    {/* Campo Rua */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-street" className="text-xs">
                        Rua/Logradouro <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="signup-street"
                        type="text"
                        placeholder="Nome da rua"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                        disabled={loading}
                        maxLength={200}
                      />
                    </div>
                    
                    {/* Campos Número e Complemento */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="signup-number" className="text-xs">
                          Número <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="signup-number"
                          type="text"
                          placeholder="123 ou S/N"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          required
                          disabled={loading}
                          maxLength={20}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="signup-complement" className="text-xs">
                          Complemento
                        </Label>
                        <Input
                          id="signup-complement"
                          type="text"
                          placeholder="Apto, Bloco"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                    </div>
                    
                    {/* Campo Bairro */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-neighborhood" className="text-xs">
                        Bairro <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="signup-neighborhood"
                        type="text"
                        placeholder="Nome do bairro"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        required
                        disabled={loading}
                        maxLength={100}
                      />
                    </div>
                    
                    {/* Campos Cidade e Estado */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <Label htmlFor="signup-city" className="text-xs">
                          Cidade <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="signup-city"
                          type="text"
                          placeholder="Nome da cidade"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="signup-state" className="text-xs">
                          UF <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="signup-state"
                          type="text"
                          placeholder="SP"
                          value={state}
                          onChange={(e) => setState(e.target.value.toUpperCase())}
                          required
                          disabled={loading}
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                  
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
