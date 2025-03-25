
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [hasRegisteredUsers, setHasRegisteredUsers] = useState(false);
  const [shouldReturnToConfirmOrder, setShouldReturnToConfirmOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there are any registered users in localStorage
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      setHasRegisteredUsers(true);
    } else {
      // If no registered users, force to registration view
      setIsLogin(false);
    }
    
    // Check if we should return to confirm order page
    const returnToConfirmOrder = sessionStorage.getItem('returnToConfirmOrder');
    if (returnToConfirmOrder) {
      setShouldReturnToConfirmOrder(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simple validation
      if (!email || !password) {
        toast.error('Por favor, preencha todos os campos');
        return;
      }
      
      // Check if user exists in registered users
      const registeredUsers = localStorage.getItem('registeredUsers');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        const user = users.find((u: any) => u.email === email);
        
        if (user) {
          // In a real app, we would validate password here
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('Login realizado com sucesso!');
          
          // Clear return flag in session storage
          if (shouldReturnToConfirmOrder) {
            sessionStorage.removeItem('returnToConfirmOrder');
            navigate('/confirm-order');
          } else {
            navigate('/');
          }
        } else {
          toast.error('Usuário não encontrado. Por favor, cadastre-se primeiro.');
          setIsLogin(false);
        }
      } else {
        toast.error('Não há usuários cadastrados. Por favor, cadastre-se primeiro.');
        setIsLogin(false);
      }
    } else {
      // Registration
      // Simple validation
      if (!name || !email || !password) {
        toast.error('Por favor, preencha todos os campos');
        return;
      }
      
      // Create new user
      const newUser = {
        name,
        email,
      };
      
      // Save to registered users
      const registeredUsers = localStorage.getItem('registeredUsers');
      let users = [];
      if (registeredUsers) {
        users = JSON.parse(registeredUsers);
      }
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // Also log the user in
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Cadastro realizado com sucesso! Você está conectado.');
      
      // Clear return flag in session storage
      if (shouldReturnToConfirmOrder) {
        sessionStorage.removeItem('returnToConfirmOrder');
        navigate('/confirm-order');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="page-container">
          <div className="max-w-md mx-auto">
            {/* Form Card */}
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden animate-scale-in">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="heading-md mb-2">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
                  <p className="text-muted-foreground">
                    {isLogin 
                      ? 'Digite suas credenciais para acessar sua conta' 
                      : 'Preencha seus dados para começar'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                            <User size={18} />
                          </div>
                          <Input 
                            id="name"
                            type="text"
                            placeholder="João da Silva"
                            className="pl-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                          <Mail size={18} />
                        </div>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="nome@exemplo.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Senha</Label>
                        {isLogin && (
                          <Link
                            to="/forgot-password"
                            className="text-sm text-accent hover:text-accent/80 transition-colors"
                          >
                            Esqueceu a senha?
                          </Link>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                          <Lock size={18} />
                        </div>
                        <Input 
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isLogin ? 'Entrar' : 'Criar Conta'}
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </form>
                
                {hasRegisteredUsers && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                      <button
                        type="button"
                        className="ml-1 text-accent hover:text-accent/80 transition-colors font-medium"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? 'Cadastre-se' : 'Entrar'}
                      </button>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-muted/30 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Ao continuar, você concorda com nossos{' '}
                    <Link to="/terms" className="text-foreground/80 hover:text-foreground underline">
                      Termos de Serviço
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacy" className="text-foreground/80 hover:text-foreground underline">
                      Política de Privacidade
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
