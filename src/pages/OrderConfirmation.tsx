import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, MapPin, Clock, CheckCircle2, Package, Truck, ChefHat, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  payment_method: string;
  created_at: string;
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState('30-40 min');
  const [currentStep, setCurrentStep] = useState(0);

  const orderId = location.state?.orderId;

  const steps = [
    { 
      key: 'pending', 
      label: 'Pedido Recebido',
      icon: Store,
      description: 'Aguardando confirmação'
    },
    { 
      key: 'confirmed', 
      label: 'Confirmado',
      icon: CheckCircle2,
      description: 'Restaurante confirmou'
    },
    { 
      key: 'preparing', 
      label: 'Preparando',
      icon: ChefHat,
      description: 'Seu pedido está sendo preparado'
    },
    { 
      key: 'ready', 
      label: 'Pronto',
      icon: Package,
      description: 'Aguardando entregador'
    },
    { 
      key: 'delivering', 
      label: 'A Caminho',
      icon: Truck,
      description: 'Pedido saiu para entrega'
    },
    { 
      key: 'delivered', 
      label: 'Entregue',
      icon: CheckCircle2,
      description: 'Pedido entregue com sucesso'
    }
  ];

  useEffect(() => {
    if (!orderId) {
      toast.error('ID do pedido não encontrado');
      navigate('/orders');
      return;
    }

    fetchOrderData();
    
    // Set up real-time updates
    const subscription = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          const newOrder = payload.new as OrderData;
          setOrderData(newOrder);
          updateEstimatedTime(newOrder.status);
          updateCurrentStep(newOrder.status as OrderStatus);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId, navigate]);

  const updateCurrentStep = (status: OrderStatus) => {
    const stepIndex = steps.findIndex(step => step.key === status);
    setCurrentStep(stepIndex);
  };

  const updateEstimatedTime = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        setEstimatedTime('30-40 min');
        break;
      case 'preparing':
        setEstimatedTime('20-30 min');
        break;
      case 'ready':
        setEstimatedTime('10-15 min');
        break;
      case 'delivering':
        setEstimatedTime('5-10 min');
        break;
      case 'delivered':
        setEstimatedTime('Entregue');
        break;
      default:
        setEstimatedTime('25-35 min');
    }
  };

  const fetchOrderData = async () => {
    if (!user) return;

    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setOrderData(orderData as OrderData);
      updateEstimatedTime(orderData.status);
      updateCurrentStep(orderData.status as OrderStatus);

      // Fetch restaurant data
      if (orderData.restaurant_id) {
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', orderData.restaurant_id)
          .single();

        if (restaurantData) {
          setRestaurant(restaurantData);
        }
      }

      // Fetch address data
      if (orderData.delivery_address_id) {
        const { data: addressData } = await supabase
          .from('addresses')
          .select('*')
          .eq('id', orderData.delivery_address_id)
          .single();

        if (addressData) {
          setAddress(addressData);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do pedido:', error);
      toast.error('Erro ao carregar dados do pedido');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 pb-16 bg-background">
          <div className="page-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!orderData) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 pb-16 bg-background">
          <div className="page-container">
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">Pedido não encontrado</p>
              <Button onClick={() => navigate('/orders')}>
                Ver Todos os Pedidos
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const orderNumber = `#${orderData.id.slice(-8).toUpperCase()}`;

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="page-container max-w-3xl">
          {/* Header */}
          <div className="mb-6 pt-4">
            <Link
              to="/orders"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Voltar
            </Link>
          </div>

          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <CheckCircle2 size={48} className="text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground">
              Pedido {orderNumber}
            </p>
          </div>

          {/* Restaurant Info Card */}
          {restaurant && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {restaurant.image_url ? (
                      <img 
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store size={32} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-xl">{restaurant.name}</h2>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/orders')}
                    className="text-primary"
                  >
                    Ver pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estimated Time Card */}
          <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Clock size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Previsão de entrega</p>
                    <p className="text-2xl font-bold text-primary">{estimatedTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Tracker */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-6">Acompanhe seu pedido</h3>
              
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.key} className="relative">
                      <div className={`flex items-start gap-4 ${isCompleted ? '' : 'opacity-40'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/20 animate-pulse' : ''}`}>
                          <StepIcon size={20} />
                        </div>
                        
                        <div className="flex-1 pb-4">
                          <p className="font-medium">{step.label}</p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className={`absolute left-5 top-10 w-0.5 h-8 -ml-px ${
                          index < currentStep ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Resumo do pedido</h3>
              
              <div className="space-y-3 mb-4">
                {orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{item.quantity}x {item.name}</p>
                      {item.options && item.options.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {item.options.map((opt: any) => opt.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ {orderData.delivery_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary">R$ {orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {address && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Endereço de entrega</h3>
                    <p className="text-sm">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood}, {address.city} - {address.state}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <Button 
            className="w-full h-12 text-lg"
            onClick={() => navigate('/orders')}
          >
            Ver Histórico de Pedidos
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
