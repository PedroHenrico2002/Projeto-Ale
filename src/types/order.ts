
import { PaymentMethod } from '@/components/PaymentMethods';

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

export interface OrderDetails {
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

export type OrderHistoryItem = OrderDetails;
