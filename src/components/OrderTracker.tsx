
import React from 'react';
import { CheckCircle2, Clock, PackageCheck, TruckIcon } from 'lucide-react';
import { DeliveryMap } from './DeliveryMap';

export interface OrderTrackerProps {
  status: 'preparing' | 'ready' | 'delivering' | 'delivered';
  estimatedDelivery?: string;
  address?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ status, estimatedDelivery, address }) => {
  // Define the steps for the order process
  const steps = [
    { key: 'preparing', label: 'Preparando' },
    { key: 'ready', label: 'Pronto para entrega' },
    { key: 'delivering', label: 'A caminho' },
    { key: 'delivered', label: 'Entregue' }
  ];
  
  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.key === status);
  
  // Verifica se o pedido está em trânsito ou foi entregue para exibir o mapa
  const showMap = status === 'delivering' || status === 'delivered';
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStepIndex 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index === 0 && <Clock className="w-5 h-5" />}
                {index === 1 && <PackageCheck className="w-5 h-5" />}
                {index === 2 && <TruckIcon className="w-5 h-5" />}
                {index === 3 && <CheckCircle2 className="w-5 h-5" />}
              </div>
              <span className="text-xs text-center mt-1 font-medium">{step.label}</span>
            </div>
            
            {/* Connecting line (except after the last item) */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  index < currentStepIndex 
                    ? 'bg-red-600' 
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mapa de entrega (apenas quando estiver a caminho ou entregue) */}
      {showMap && (
        <DeliveryMap status={status as 'delivering' | 'delivered'} deliveryAddress={address} />
      )}
      
      {estimatedDelivery && (
        <div className="mt-3 text-center text-sm text-gray-500">
          <span className="font-medium">Tempo estimado de entrega:</span> {estimatedDelivery}
        </div>
      )}
    </div>
  );
};
