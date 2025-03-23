
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simple validation
      if (!email || !password) {
        toast.error('Please fill all fields');
        return;
      }
      
      // Mock login successful
      toast.success('Login successful!');
      navigate('/');
    } else {
      // Simple validation
      if (!name || !email || !password) {
        toast.error('Please fill all fields');
        return;
      }
      
      // Mock registration successful
      toast.success('Registration successful! Please log in');
      setIsLogin(true);
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
                  <h1 className="heading-md mb-2">{isLogin ? 'Welcome back' : 'Create an account'}</h1>
                  <p className="text-muted-foreground">
                    {isLogin 
                      ? 'Enter your credentials to access your account' 
                      : 'Fill in your details to get started'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                            <User size={18} />
                          </div>
                          <Input 
                            id="name"
                            type="text"
                            placeholder="John Doe"
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
                          placeholder="name@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        {isLogin && (
                          <Link
                            to="/forgot-password"
                            className="text-sm text-accent hover:text-accent/80 transition-colors"
                          >
                            Forgot password?
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
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      className="ml-1 text-accent hover:text-accent/80 transition-colors font-medium"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-muted/30 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <Link to="/terms" className="text-foreground/80 hover:text-foreground underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-foreground/80 hover:text-foreground underline">
                      Privacy Policy
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
