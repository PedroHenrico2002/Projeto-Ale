import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { OrderTracker } from '@/components/OrderTracker';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, MapPin, Phone, MessageCircle } from 'lucide-react';

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderStatus, setOrderStatus] = useState<'preparing' | 'ready' | 'delivering' | 'delivered'>('preparing');
  const [estimatedTime, setEstimatedTime] = useState('25-35 min');
  
  const orderId = location.state?.orderId || '12345';
  
  // Simulate status progression
  useEffect(() => {
    const statusProgression = ['preparing', 'ready', 'delivering', 'delivered'] as const;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setOrderStatus(statusProgression[currentIndex]);
        
        // Update estimated time based on status
        switch (statusProgression[currentIndex]) {
          case 'ready':
            setEstimatedTime('10-15 min');
            break;
          case 'delivering':
            setEstimatedTime('5-10 min');
            break;
          case 'delivered':
            setEstimatedTime('Entregue!');
            break;
        }
      } else {
        clearInterval(interval);
        // Navigate to completion after delivery
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    }, 10000); // Change status every 10 seconds for demo
    
    return () => clearInterval(interval);
  }, [navigate]);
  
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
                  <div className="flex justify-between text-sm">
                    <span>2x Hambúrguer Especial</span>
                    <span>R$25,98</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>1x Batata Frita</span>
                    <span>R$5,99</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R$31,97</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Entrega</span>
                      <span>R$5,99</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>R$37,96</span>
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