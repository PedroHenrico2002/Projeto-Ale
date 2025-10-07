
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';
import confetti from 'canvas-confetti';
import { OrderDetails } from '@/types/order';

// This hook manages the order details state and related functionality
export const useOrderDetails = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [showDeliveredDialog, setShowDeliveredDialog] = useState(false);
  
  useEffect(() => {
    const orderData = sessionStorage.getItem('orderDetails');
    
    if (!orderData) {
      navigate('/restaurants');
      return;
    }
    
    try {
      const parsedOrder = JSON.parse(orderData) as OrderDetails;
      
      const storedAddresses = localStorage.getItem('savedAddresses');
      if (storedAddresses) {
        const addresses = JSON.parse(storedAddresses);
        const defaultAddress = addresses.find((addr: any) => addr.isDefault);
        
        if (defaultAddress) {
          const formattedAddress = `${defaultAddress.street}, ${defaultAddress.number} - ${defaultAddress.neighborhood}, ${defaultAddress.city} - ${defaultAddress.state}`;
          
          parsedOrder.address = formattedAddress;
          sessionStorage.setItem('orderDetails', JSON.stringify(parsedOrder));
        }
      }
      
      setOrder(parsedOrder);
      
      const stateProgression = [
        { status: 'preparing' as const, delay: 3000, estimatedDelivery: '15-20 min' },
        { status: 'ready' as const, delay: 5000, estimatedDelivery: '10-15 min' },
        { status: 'delivering' as const, delay: 7000, estimatedDelivery: '5-10 min' },
        { status: 'delivered' as const, delay: 0, estimatedDelivery: 'Entregue' }
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
              const updated = { 
                ...prev, 
                status: state.status, 
                estimatedDelivery: state.estimatedDelivery 
              };
              
              sessionStorage.setItem('orderDetails', JSON.stringify(updated));
              
              if (state.status === 'delivered') {
                setShowDeliveredDialog(true);
                saveOrderToHistory(updated);
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
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    
    const user = JSON.parse(userJson);
    const userId = user.email;
    
    const historyKey = `orderHistory_${userId}`;
    let orderHistory: OrderDetails[] = [];
    
    if (localStorage.getItem(historyKey)) {
      orderHistory = JSON.parse(localStorage.getItem(historyKey) as string);
    }
    
    if (!orderHistory.some(o => o.orderNumber === completedOrder.orderNumber)) {
      orderHistory.push(completedOrder);
      localStorage.setItem(historyKey, JSON.stringify(orderHistory));
    }
    
    const globalHistoryJson = localStorage.getItem('orderHistory');
    let globalHistory: OrderDetails[] = [];
    
    if (globalHistoryJson) {
      globalHistory = JSON.parse(globalHistoryJson);
    }
    
    if (!globalHistory.some(o => o.orderNumber === completedOrder.orderNumber)) {
      globalHistory.push(completedOrder);
      localStorage.setItem('orderHistory', JSON.stringify(globalHistory));
    }
  };
  
  const handleRateOrder = (rating: number) => {
    if (!order || rating === 0) return;
    
    const updatedOrder = { ...order, rating };
    setOrder(updatedOrder);
    
    sessionStorage.setItem('orderDetails', JSON.stringify(updatedOrder));
    
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      const userId = user.email;
      
      const historyKey = `orderHistory_${userId}`;
      const existingHistoryJson = localStorage.getItem(historyKey);
      
      if (existingHistoryJson) {
        const orderHistory = JSON.parse(existingHistoryJson);
        const updatedHistory = orderHistory.map((item: OrderDetails) => 
          item.orderNumber === order.orderNumber ? { ...item, rating } : item
        );
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      }
      
      const globalHistoryJson = localStorage.getItem('orderHistory');
      if (globalHistoryJson) {
        const globalHistory = JSON.parse(globalHistoryJson);
        const updatedGlobalHistory = globalHistory.map((item: OrderDetails) => 
          item.orderNumber === order.orderNumber ? { ...item, rating } : item
        );
        localStorage.setItem('orderHistory', JSON.stringify(updatedGlobalHistory));
      }
    }
    
    setShowDeliveredDialog(false);
    toast.success('Obrigado pela sua avaliação!');
  };

  return {
    order,
    showDeliveredDialog,
    setShowDeliveredDialog,
    handleRateOrder
  };
};
