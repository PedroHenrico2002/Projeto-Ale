
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ShoppingBag } from 'lucide-react';
import { toast } from '@/lib/toast';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

interface Order {
  restaurantName: string;
  items: OrderItem[];
  totalValue: number;
  orderNumber: string;
}

const ConfirmOrder: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    // Recuperar os dados do pedido do sessionStorage
    const orderData = sessionStorage.getItem('currentOrder');
    
    if (!orderData) {
      // Redirecionar se não houver dados de pedido
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
    // Aqui você poderia enviar o pedido para um servidor
    // Simulando confirmação bem-sucedida
    toast.success('Pedido confirmado com sucesso!');
    navigate('/order-complete');
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
              to={`/restaurants/${order.restaurantName}`}
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
                <h2 className="font-semibold text-lg">Resumo do Pedido</h2>
                <p className="text-gray-500">{order.restaurantName}</p>
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
    </Layout>
  );
};

export default ConfirmOrder;
