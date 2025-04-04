
import React from 'react';
import { MapPin, Clock, Receipt, CreditCard } from 'lucide-react';
import { PaymentMethod } from '@/components/PaymentMethods';
import { OrderItem } from '@/types/order';

interface OrderDetailsProps {
  restaurantName: string;
  address: string;
  estimatedDelivery: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    number: string;
    name: string;
  } | null;
  items: OrderItem[];
  totalValue: number;
}

export const getPaymentMethodName = (method: PaymentMethod): string => {
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

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  restaurantName, 
  address, 
  estimatedDelivery, 
  paymentMethod, 
  paymentDetails, 
  items, 
  totalValue 
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="border-t pt-4">
        <h2 className="font-medium mb-2">Detalhes da Entrega</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <MapPin size={18} className="mr-2 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Endereço de Entrega</p>
              <p className="text-sm text-gray-600">
                {address}
                <span className="block mt-1 text-xs text-red-500">
                  Entrega estimada em {estimatedDelivery}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock size={18} className="mr-2 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Tempo Estimado</p>
              <p className="text-sm text-gray-600">{estimatedDelivery}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Receipt size={18} className="mr-2 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Restaurante</p>
              <p className="text-sm text-gray-600">{restaurantName}</p>
            </div>
          </div>
          <div className="flex items-start">
            <CreditCard size={18} className="mr-2 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Forma de Pagamento</p>
              <p className="text-sm text-gray-600">
                {getPaymentMethodName(paymentMethod)}
                {paymentDetails && paymentMethod !== 'cash' && (
                  <span className="ml-1">
                    (•••• {paymentDetails.number.slice(-4)})
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
          {items.map((item) => (
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
            <span className="text-lg">R${totalValue.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
