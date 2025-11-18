import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { profileService, orderService } from '@/services/supabaseService';
import { UserAddresses } from '@/components/profile/UserAddresses';
import { UserPaymentMethods } from '@/components/profile/UserPaymentMethods';
import { Navigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
export const Profile: React.FC = () => {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);
  const fetchProfile = async () => {
    if (!user) return;
    try {
      const userProfile = await profileService.getProfile(user.id);
      setProfile(userProfile);
      setDisplayName(userProfile.display_name || '');
      setPhone(userProfile.phone || '');
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const userOrders = await orderService.getByUserId(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };
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
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
    setUpdating(false);
  };
  if (loading) {
    return <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="page-container pt-20 pb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
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
                  Ambiente personalizado sincronizado com o sistema
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user.email || ''} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayName">Nome de exibição</Label>
                      <Input id="displayName" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Como você gostaria de ser chamado?" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
                    </div>
                  </div>

                  <Button type="submit" disabled={updating}>
                    {updating ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Conta Sincronizada</h3>
                    <p className="text-sm text-muted-foreground">
                      Todos os seus dados estão integrados com o Supabase
                    </p>
                  </div>
                  <Button variant="destructive" onClick={signOut}>
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
                <TabsTrigger value="addresses">Endereços</TabsTrigger>
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Seus Pedidos
                    </CardTitle>
                    <CardDescription>
                      Histórico de pedidos sincronizado com o sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? <div className="space-y-4">
                        {orders.slice(0, 3).map((order: any) => <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Pedido #{order.id.substring(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.restaurants?.name}
                                </p>
                                <p className="text-sm">Status: {order.status}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">R$ {order.total}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>)}
                      </div> : <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum pedido encontrado</p>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <UserAddresses />
              </TabsContent>

              <TabsContent value="payments">
                <UserPaymentMethods />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>;
};