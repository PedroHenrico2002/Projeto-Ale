
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderHeaderProps {
  orderNumber: string;
  orderTime: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ orderNumber, orderTime }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Voltar</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Acompanhe seu Pedido</h1>
            <div className="text-sm text-gray-500">
              Pedido {orderNumber} • {new Date(orderTime).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHeader;
