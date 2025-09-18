import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { OrderTracker } from '@/components/OrderTracker';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/lib/toast';

interface OrderData {
  id: string;
  items: any[];
  total: number;
  subtotal: number;
  delivery_fee: number;
  restaurant_id: string;
  delivery_address_id: string;
  status: string;
  created_at: string;
}

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderStatus, setOrderStatus] = useState<'preparing' | 'ready' | 'delivering' | 'delivered'>('preparing');
  const [estimatedTime, setEstimatedTime] = useState('25-35 min');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = location.state?.orderId || 'demo-order';

  useEffect(() => {
    // Fetch order data from database
    const fetchOrder = async () => {
      if (orderId === 'demo-order') {
        // Demo data
        setOrderData({
          id: orderId,
          items: [
            { name: 'Hambúrguer Especial', quantity: 2, price: 12.99 },
            { name: 'Batata Frita', quantity: 1, price: 5.99 }
          ],
          total: 37.96,
          subtotal: 31.97,
          delivery_fee: 5.99,
          restaurant_id: 'demo-restaurant',
          delivery_address_id: 'demo-address',
          status: 'preparing',
          created_at: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user?.id)
          .single();

        if (error) throw error;
        
        setOrderData(data as OrderData);
        setOrderStatus(data.status as any);
      } catch (error) {
        console.error('Erro ao buscar dados do pedido:', error);
        toast.error('Erro ao carregar dados do pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);
  
  if (loading) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <div className="text-center">
              <p>Carregando dados do pedido...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!orderData) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <div className="text-center">
              <p>Pedido não encontrado.</p>
              <Button onClick={() => navigate('/orders')} className="mt-4">
                Ver Todos os Pedidos
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'preparing':
        return 'Seu pedido está sendo preparado com carinho';
      case 'ready':
        return 'Pedido pronto! O entregador está a caminho';
      case 'delivering':
        return 'Seu pedido está a caminho!';
      case 'delivered':
        return 'Pedido entregue com sucesso!';
      default:
        return 'Acompanhando seu pedido...';
    }
  };
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Acompanhe seu Pedido</h1>
            <p className="text-muted-foreground">Pedido #{orderId}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <div className="flex items-center mb-4">
                  <Clock size={20} className="text-accent mr-2" />
                  <h2 className="font-medium">Status do Pedido</h2>
                </div>
                
                <div className="mb-6">
                  <p className="text-lg font-medium mb-2">{getStatusMessage()}</p>
                  <p className="text-muted-foreground">Tempo estimado: {estimatedTime}</p>
                </div>
                
                <OrderTracker 
                  status={orderStatus}
                  estimatedDelivery={estimatedTime}
                  address="Rua das Flores, 123 - Centro, São Paulo, SP"
                />
              </div>
              
              {/* Restaurant Info */}
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h3 className="font-medium mb-4">Detalhes do Restaurante</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-muted rounded-lg mr-3">
                      <img 
                        src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                        alt="Restaurante"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Restaurante Exemplo</h4>
                      <p className="text-sm text-muted-foreground">Comida Brasileira</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone size={16} className="mr-1" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle size={16} className="mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h3 className="font-medium mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3 mb-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Entrega</span>
                      <span>R${orderData.delivery_fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>R${orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-start">
                    <MapPin size={16} className="text-muted-foreground mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Endereço de Entrega</p>
                      <p className="text-sm text-muted-foreground">
                        Rua das Flores, 123 - Centro<br />
                        São Paulo, SP
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/orders')}
                >
                  Ver Todos os Pedidos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;