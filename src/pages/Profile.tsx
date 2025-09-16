import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { profileService } from '@/services/supabaseService';
import { Navigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userProfile = await profileService.getProfile(user.id);
          setProfile(userProfile);
          setDisplayName(userProfile.display_name || '');
          setPhone(userProfile.phone || '');
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      await profileService.updateProfile(user.id, {
        display_name: displayName,
        phone: phone
      });
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="page-container pt-20 pb-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">Meu Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nome de exibição</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Como você gostaria de ser chamado?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={updating}>
                    {updating ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ambiente Personalizado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium text-primary">Seus Pedidos</h4>
                      <p className="text-sm text-muted-foreground">Histórico e pedidos ativos</p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium text-primary">Favoritos</h4>
                      <p className="text-sm text-muted-foreground">Restaurantes e pratos preferidos</p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium text-primary">Endereços</h4>
                      <p className="text-sm text-muted-foreground">Locais de entrega salvos</p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium text-primary">Preferências</h4>
                      <p className="text-sm text-muted-foreground">Configurações personalizadas</p>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={signOut}
                    className="w-full"
                  >
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};