
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OrderTracker } from '@/components/OrderTracker';
import { 
  MapPin, Clock, Receipt, CreditCard, Star, ChevronLeft,
  CheckCircle2, AlertTriangle, TruckIcon, CookingPot, PackageCheck
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import { PaymentMethod } from '@/components/PaymentMethods';
import confetti from 'canvas-confetti';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

interface OrderDetails {
  restaurantName: string;
  restaurantId: string;
  items: OrderItem[];
  totalValue: number;
  orderNumber: string;
  orderTime: string;
  estimatedDelivery: string;
  address: string;
  status: 'preparing' | 'ready' | 'delivering' | 'delivered';
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    number: string;
    name: string;
  } | null;
  rating?: number;
}

type OrderHistoryItem = OrderDetails;

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [showDeliveredDialog, setShowDeliveredDialog] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  // For demo purposes, we'll simulate order progression
  useEffect(() => {
    const orderData = sessionStorage.getItem('orderDetails');
    
    if (!orderData) {
      navigate('/restaurants');
      return;
    }
    
    try {
      // Parse initial order details
      const parsedOrder = JSON.parse(orderData) as OrderDetails;
      setOrder(parsedOrder);
      
      // Simulate order progression
      const stateProgression = [
        { status: 'preparing' as const, delay: 10000 }, // 10 seconds
        { status: 'ready' as const, delay: 15000 },     // 15 seconds
        { status: 'delivering' as const, delay: 20000 },// 20 seconds
        { status: 'delivered' as const, delay: 0 }      // End state
      ];
      
      let timeoutIds: NodeJS.Timeout[] = [];
      
      if (parsedOrder.status !== 'delivered') {
        let currentIndex = stateProgression.findIndex(state => state.status === parsedOrder.status);
        if (currentIndex === -1) currentIndex = 0;
        
        for (let i = currentIndex; i < stateProgression.length; i++) {
          const state = stateProgression[i];
          const delay = stateProgression.slice(0, i).reduce((acc, s) => acc + s.delay, 0);
          
          const id = setTimeout(() => {
            setOrder(prev => {
              if (!prev) return null;
              const updated = { ...prev, status: state.status };
              
              // Update in sessionStorage too
              sessionStorage.setItem('orderDetails', JSON.stringify(updated));
              
              // Show delivered dialog when delivered
              if (state.status === 'delivered') {
                setShowDeliveredDialog(true);
                saveOrderToHistory(updated);
                // Display confetti effect
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }
              
              return updated;
            });
          }, delay);
          
          timeoutIds.push(id);
        }
      } else if (parsedOrder.status === 'delivered') {
        // If already delivered, just show dialog
        setShowDeliveredDialog(true);
      }
      
      return () => {
        timeoutIds.forEach(id => clearTimeout(id));
      };
    } catch (error) {
      console.error('Error parsing order details:', error);
      navigate('/restaurants');
    }
  }, [navigate]);
  
  const saveOrderToHistory = (completedOrder: OrderDetails) => {
    // Get user from localStorage
    const userJson = localStorage.getItem('user');
    if (!userJson) return; // Don't save if no user
    
    const user = JSON.parse(userJson);
    const userId = user.email; // Use email as unique identifier
    
    // Get existing order history for this user
    const historyKey = `orderHistory_${userId}`;
    const existingHistoryJson = localStorage.getItem(historyKey);
    let orderHistory: OrderHistoryItem[] = [];
    
    if (existingHistoryJson) {
      orderHistory = JSON.parse(existingHistoryJson);
    }
    
    // Add this order to history if not already there
    if (!orderHistory.some(o => o.orderNumber === completedOrder.orderNumber)) {
      orderHistory.push(completedOrder);
      localStorage.setItem(historyKey, JSON.stringify(orderHistory));
    }
    
    // Also update the global order history for backward compatibility
    const globalHistoryJson = localStorage.getItem('orderHistory');
    let globalHistory: OrderHistoryItem[] = [];
    
    if (globalHistoryJson) {
      globalHistory = JSON.parse(globalHistoryJson);
    }
    
    if (!globalHistory.some(o => o.orderNumber === completedOrder.orderNumber)) {
      globalHistory.push(completedOrder);
      localStorage.setItem('orderHistory', JSON.stringify(globalHistory));
    }
  };
  
  const handleRateOrder = () => {
    if (!order || rating === 0) return;
    
    // Update order with rating
    const updatedOrder = { ...order, rating };
    setOrder(updatedOrder);
    
    // Update in session storage
    sessionStorage.setItem('orderDetails', JSON.stringify(updatedOrder));
    
    // Update in history
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      const userId = user.email;
      
      // Update user-specific history
      const historyKey = `orderHistory_${userId}`;
      const existingHistoryJson = localStorage.getItem(historyKey);
      
      if (existingHistoryJson) {
        const orderHistory = JSON.parse(existingHistoryJson);
        const updatedHistory = orderHistory.map((item: OrderHistoryItem) => 
          item.orderNumber === order.orderNumber ? { ...item, rating } : item
        );
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      }
      
      // Update global history
      const globalHistoryJson = localStorage.getItem('orderHistory');
      if (globalHistoryJson) {
        const globalHistory = JSON.parse(globalHistoryJson);
        const updatedGlobalHistory = globalHistory.map((item: OrderHistoryItem) => 
          item.orderNumber === order.orderNumber ? { ...item, rating } : item
        );
        localStorage.setItem('orderHistory', JSON.stringify(updatedGlobalHistory));
      }
    }
    
    setShowDeliveredDialog(false);
    toast.success('Obrigado pela sua avaliação!');
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
  
  const getStatusIcon = () => {
    if (!order) return null;
    
    switch (order.status) {
      case 'preparing':
        return <CookingPot size={20} className="text-yellow-500" />;
      case 'ready':
        return <PackageCheck size={20} className="text-blue-500" />;
      case 'delivering':
        return <TruckIcon size={20} className="text-purple-500" />;
      case 'delivered':
        return <CheckCircle2 size={20} className="text-green-500" />;
      default:
        return <AlertTriangle size={20} className="text-red-500" />;
    }
  };
  
  const statusText = () => {
    if (!order) return '';
    
    switch (order.status) {
      case 'preparing':
        return 'Preparando seu pedido';
      case 'ready':
        return 'Pedido pronto para entrega';
      case 'delivering':
        return 'Pedido a caminho';
      case 'delivered':
        return 'Pedido entregue';
      default:
        return 'Status desconhecido';
    }
  };
  
  if (!order) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <p className="text-center">Carregando detalhes do pedido...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Voltar</span>
            </button>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border overflow-hidden mb-6">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold">Acompanhe seu Pedido</h1>
                  <div className="text-sm text-gray-500">
                    Pedido {order.orderNumber} • {new Date(order.orderTime).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon()}
                  <span className="ml-2 font-medium">{statusText()}</span>
                </div>
              </div>
              
              <div className="p-4">
                <OrderTracker status={order.status} />
                
                <div className="mt-6 space-y-4">
                  <div className="border-t pt-4">
                    <h2 className="font-medium mb-2">Detalhes da Entrega</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <MapPin size={18} className="mr-2 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Endereço de Entrega</p>
                          <p className="text-sm text-gray-600">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock size={18} className="mr-2 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Tempo Estimado</p>
                          <p className="text-sm text-gray-600">{order.estimatedDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Receipt size={18} className="mr-2 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Restaurante</p>
                          <p className="text-sm text-gray-600">{order.restaurantName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CreditCard size={18} className="mr-2 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Forma de Pagamento</p>
                          <p className="text-sm text-gray-600">
                            {getPaymentMethodName(order.paymentMethod)}
                            {order.paymentDetails && order.paymentMethod !== 'cash' && (
                              <span className="ml-1">
                                (•••• {order.paymentDetails.number.slice(-4)})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h2 className="font-medium mb-2">Itens do Pedido</h2>
                    <div className="space-y-2">
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
                    <div className="border-t mt-3 pt-3">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total</span>
                        <span className="text-lg">R${order.totalValue.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rating section (shown only for delivered orders) */}
            {order.status === 'delivered' && !order.rating && (
              <div className="bg-white rounded-lg border p-4 text-center">
                <h3 className="font-semibold mb-2">Avaliar Restaurante:</h3>
                <div className="flex justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={32}
                      className={`cursor-pointer transition-colors ${
                        (hoverRating || rating) >= star 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                <Button 
                  onClick={handleRateOrder}
                  disabled={rating === 0}
                  className={`${rating === 0 ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'} text-white`}
                >
                  Enviar Avaliação
                </Button>
              </div>
            )}
            
            {/* Already rated */}
            {order.status === 'delivered' && order.rating && (
              <div className="bg-white rounded-lg border p-4 text-center">
                <h3 className="font-semibold mb-2">Sua Avaliação:</h3>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={32}
                      className={`${
                        order.rating >= star 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-600">Obrigado pela sua avaliação!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delivered Dialog */}
      <Dialog open={showDeliveredDialog} onOpenChange={setShowDeliveredDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Pedido Entregue!</DialogTitle>
            <DialogDescription className="text-center">
              Seu pedido foi entregue com sucesso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
          
          <div className="text-center mb-4">
            <h3 className="font-semibold mb-2">Avaliar Restaurante:</h3>
            <div className="flex justify-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={32}
                  className={`cursor-pointer transition-colors ${
                    (hoverRating || rating) >= star 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRateOrder}
              disabled={rating === 0}
            >
              Confirmar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default OrderDetails;
