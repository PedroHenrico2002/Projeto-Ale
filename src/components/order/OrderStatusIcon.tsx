
import React from 'react';
import { 
  CheckCircle2, AlertTriangle, TruckIcon, CookingPot, PackageCheck, Clock, CheckCircle 
} from 'lucide-react';

interface OrderStatusIconProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';
}

const OrderStatusIcon: React.FC<OrderStatusIconProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Clock size={20} className="text-orange-500" />;
    case 'confirmed':
      return <CheckCircle size={20} className="text-blue-600" />;
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

export const getStatusText = (status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered'): string => {
  switch (status) {
    case 'pending':
      return 'Pedido pendente';
    case 'confirmed':
      return 'Pedido confirmado';
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

export default OrderStatusIcon;
