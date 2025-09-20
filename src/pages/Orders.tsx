import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Star, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { OrderStatusIcon, getStatusText } from '@/components/order/OrderStatusIcon';
import { toast } from '@/lib/toast';

interface Order {
  id: string;
  items: any[];
  total: number;
  subtotal: number;
  delivery_fee: number;
  restaurant_id: string;
  status: string;
  created_at: string;
  rating?: number;
  restaurant?: {
    name: string;
    cuisine: string;
    image_url?: string;
  };
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            name,
            cuisine,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar histórico de pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'bg-orange-100 text-orange-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="page-container">
            <div className="text-center">
              <p>Carregando histórico de pedidos...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe o histórico dos seus pedidos</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não fez nenhum pedido. Explore nossos restaurantes!
                </p>
                <Button onClick={() => navigate('/restaurants')}>
                  Ver Restaurantes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        {/* Restaurant Image */}
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {order.restaurant?.image_url ? (
                            <img
                              src={order.restaurant.image_url}
                              alt={order.restaurant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ShoppingBag size={24} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{order.restaurant?.name || 'Restaurante'}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              <OrderStatusIcon status={order.status as any} />
                              <span className="ml-1">{getStatusText(order.status as any)}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            Pedido #{order.id.slice(-8).toUpperCase()}
                          </p>
                          
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock size={14} />
                              <span>{formatDate(order.created_at)}</span>
                            </div>
                            <p>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                          </div>

                          {/* Rating */}
                          {order.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium">{order.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex flex-col lg:items-end gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-lg">R$ {order.total.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/order-tracking', { 
                              state: { orderId: order.id } 
                            })}
                          >
                            Ver Detalhes
                          </Button>
                          
                          {order.status === 'delivered' && order.restaurant && (
                            <Button
                              size="sm"
                              onClick={() => navigate(`/restaurants/${order.restaurant_id}`)}
                            >
                              Pedir Novamente
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;