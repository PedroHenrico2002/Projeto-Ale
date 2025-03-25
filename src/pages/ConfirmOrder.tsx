
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, CreditCard, Truck, DollarSign, LogIn } from 'lucide-react';
import { toast } from '@/lib/toast';
import { PaymentMethod, CardDetails } from '@/components/PaymentMethods';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

interface Order {
  restaurantName: string;
  restaurantId: string;
  items: OrderItem[];
  totalValue: number;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentDetails: CardDetails | null;
}

const ConfirmOrder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  useEffect(() => {
    // Check login status
    const userJson = localStorage.getItem('user');
    setIsLoggedIn(!!userJson);
    
    // Recover order data from sessionStorage
    const orderData = sessionStorage.getItem('currentOrder');
    
    if (!orderData) {
      // Redirect if no order data
      toast.error('Nenhum pedido em andamento');
      navigate('/restaurants');
      return;
    }
    
    try {
      const parsedOrder = JSON.parse(orderData);
      setOrder(parsedOrder);
    } catch (error) {
      console.error('Erro ao analisar os dados do pedido:', error);
      toast.error('Erro ao carregar os dados do pedido');
      navigate('/restaurants');
    }
  }, [navigate]);
  
  const handleConfirmOrder = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    
    // Continue with order confirmation
    if (order) {
      // Simulate delivery time (30-45 minutes from now)
      const now = new Date();
      const deliveryTime = new Date(now.getTime() + 30 * 60000);
      const deliveryEndTime = new Date(now.getTime() + 45 * 60000);
      
      const deliveryTimeStr = `${deliveryTime.getHours()}:${String(deliveryTime.getMinutes()).padStart(2, '0')}`;
      const deliveryEndTimeStr = `${deliveryEndTime.getHours()}:${String(deliveryEndTime.getMinutes()).padStart(2, '0')}`;
      
      const orderDetails = {
        ...order,
        orderTime: now.toISOString(),
        estimatedDelivery: `Hoje, ${deliveryTimeStr} - ${deliveryEndTimeStr}`,
        address: "Rua Augusta, 1500 - Consolação, São Paulo",
        status: 'preparing' as const
      };
      
      sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      toast.success('Pedido confirmado com sucesso!');
      navigate('/order-details');
    }
  };
  
  const handleLogin = () => {
    // Save current order to session storage so we can return to it
    sessionStorage.setItem('returnToConfirmOrder', 'true');
    navigate('/login');
  };
  
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit':
      case 'debit':
        return <CreditCard className="h-5 w-5" />;
      case 'meal':
        return <DollarSign className="h-5 w-5" />;
      case 'cash':
        return <Truck className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };
  
  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'credit':
        return 'Cartão de Crédito';
      case 'debit':
        return 'Cartão de Débito';
      case 'meal':
        return 'Vale Refeição';
      case 'cash':
        return 'Pagamento na Entrega';
      default:
        return 'Cartão de Crédito';
    }
  };
  
  if (!order) {
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
  
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <Link
              to={`/restaurants/${order.restaurantId}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Voltar para o Restaurante</span>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-6">Confirmar Pedido</h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border overflow-hidden mb-6">
              <div className="border-b p-4">
                <h2 className="font-semibold text-lg">{order.restaurantName}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  <span>Número do Pedido: </span>
                  <span className="font-medium text-gray-700">{order.orderNumber}</span>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-start">
                        <span className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          {item.quantity}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mt-4">
                  <div className="flex items-center mb-2">
                    {getPaymentMethodIcon(order.paymentMethod)}
                    <span className="ml-2 font-medium">{getPaymentMethodName(order.paymentMethod)}</span>
                  </div>
                  
                  {order.paymentDetails && order.paymentMethod !== 'cash' && (
                    <div className="text-sm text-gray-600">
                      <p>Cartão: {order.paymentDetails.number}</p>
                      <p>Titular: {order.paymentDetails.name}</p>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Valor Total</span>
                    <span className="text-xl">R${order.totalValue.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-gray-500 mb-2">
                Por favor, confirme seu pedido. Uma vez confirmado, seu pedido será processado.
              </p>
            </div>
            
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
              onClick={handleConfirmOrder}
            >
              <Check size={18} className="mr-2" />
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Faça login para continuar</DialogTitle>
            <DialogDescription className="text-center">
              Você precisa estar logado para concluir seu pedido.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <LogIn size={48} className="text-red-500" />
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogin}
            >
              Fazer Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ConfirmOrder;
