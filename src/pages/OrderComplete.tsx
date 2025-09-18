
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { OrderTracker } from '@/components/OrderTracker';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, MapPin, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/lib/toast';

interface OrderData {
  id: string;
  items: any[];
  total: number;
  restaurant_id: string;
  delivery_address_id: string;
  status: string;
  created_at: string;
}

const OrderComplete: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = location.state?.orderId;
  const orderFromState = location.state?.orderData;
  
  // Random order number for display
  const orderNumber = `LF-${Math.floor(10000 + Math.random() * 90000)}`;

  useEffect(() => {
    if (!orderId) {
      toast.error('Dados do pedido não encontrados');
      navigate('/');
      return;
    }

    // Fetch order data from database
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        
        setOrderData(data as OrderData);
      } catch (error) {
        console.error('Erro ao buscar dados do pedido:', error);
        // Use order data from state if available
        if (orderFromState) {
          setOrderData({
            id: orderId,
            items: orderFromState.items,
            total: orderFromState.total,
            restaurant_id: orderFromState.restaurant_id,
            delivery_address_id: orderFromState.delivery_address_id,
            status: 'pending',
            created_at: new Date().toISOString()
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orderFromState, navigate]);
  
  // Trigger confetti effect when component mounts
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#9b87f5', '#7E69AB', '#6E59A5'],
      });
      
      confetti({
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#9b87f5', '#7E69AB', '#6E59A5'],
      });
    }, 250);
    
    return () => clearInterval(confettiInterval);
  }, []);

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
              <p>Erro ao carregar dados do pedido.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-10 animate-slide-down">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                <Check size={30} />
              </div>
              
              <h1 className="heading-lg mb-3">Pedido Confirmado!</h1>
              
              <p className="text-muted-foreground mb-6">
                Seu pedido foi realizado com sucesso e está sendo preparado.
              </p>
              
              <div className="inline-block bg-secondary px-4 py-2 rounded-md text-sm">
                <span className="text-muted-foreground">Número do Pedido: </span>
                <span className="font-semibold">{orderNumber}</span>
              </div>
            </div>
            
            {/* Order Tracking */}
            <div className="space-y-8">
              <OrderTracker 
                status="preparing"
                estimatedDelivery="25-35 min"
              />
              
              {/* Order Details */}
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium">Detalhes do Pedido</h2>
                </div>
                
                <div className="divide-y divide-border">
                  <div className="p-5 flex items-start">
                    <ShoppingBag size={18} className="mr-3 text-muted-foreground mt-0.5" />
                    <div className="w-full">
                      <h3 className="font-medium mb-1">Itens</h3>
                      <ul className="space-y-2 text-sm">
                        {orderData.items.map((item: any, index: number) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.quantity}× {item.name}</span>
                            <span className="text-muted-foreground">R${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                        <li className="flex justify-between font-medium border-t border-border pt-2 mt-2">
                          <span>Total</span>
                          <span>R${orderData.total.toFixed(2)}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-5 flex items-start">
                    <MapPin size={18} className="mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Endereço de Entrega</h3>
                      <p className="text-sm">Será entregue no endereço cadastrado</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/tracking', { state: { orderId: orderData.id } })}
                >
                  <span>Acompanhar Pedido</span>
                  <ChevronRight size={16} className="ml-1" />
                </Button>
                
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => navigate('/')}
                >
                  <span>Continuar Comprando</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderComplete;
