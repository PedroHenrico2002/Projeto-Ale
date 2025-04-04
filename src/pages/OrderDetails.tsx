
import React from 'react';
import { Layout } from '@/components/Layout';
import { OrderTracker } from '@/components/OrderTracker';
import OrderHeader from '@/components/order/OrderHeader';
import OrderDetailsComponent from '@/components/order/OrderDetails';
import OrderRating from '@/components/order/OrderRating';
import DeliveredDialog from '@/components/order/DeliveredDialog';
import OrderStatusIcon, { getStatusText } from '@/components/order/OrderStatusIcon';
import { useOrderDetails } from '@/hooks/useOrderDetails';

const OrderDetails: React.FC = () => {
  const { 
    order, 
    showDeliveredDialog, 
    setShowDeliveredDialog, 
    handleRateOrder 
  } = useOrderDetails();
  
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
          <div className="max-w-3xl mx-auto">
            <OrderHeader
              orderNumber={order.orderNumber}
              orderTime={order.orderTime}
            />
            
            <div className="bg-white rounded-lg border overflow-hidden mb-6">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold">Acompanhe seu Pedido</h1>
                  <div className="text-sm text-gray-500">
                    Pedido {order.orderNumber} • {new Date(order.orderTime).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex items-center">
                  <OrderStatusIcon status={order.status} />
                  <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
                </div>
              </div>
              
              <div className="p-4">
                <OrderTracker 
                  status={order.status} 
                  estimatedDelivery={order.estimatedDelivery}
                  address={order.address}
                />
                
                <OrderDetailsComponent
                  restaurantName={order.restaurantName}
                  address={order.address}
                  estimatedDelivery={order.estimatedDelivery}
                  paymentMethod={order.paymentMethod}
                  paymentDetails={order.paymentDetails}
                  items={order.items}
                  totalValue={order.totalValue}
                />
              </div>
            </div>
            
            <OrderRating 
              isDelivered={order.status === 'delivered'}
              currentRating={order.rating}
              onRateOrder={handleRateOrder}
            />
          </div>
        </div>
      </div>
      
      <DeliveredDialog
        open={showDeliveredDialog}
        onOpenChange={setShowDeliveredDialog}
        onRateOrder={handleRateOrder}
      />
    </Layout>
  );
};

export default OrderDetails;
