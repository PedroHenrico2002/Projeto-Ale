
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

// Interface para as propriedades do componente
interface DeliveryMapProps {
  // Status atual da entrega
  status: 'delivering' | 'delivered';
  // Endereço de entrega (opcional)
  deliveryAddress?: string;
}

// Componente que exibe o mapa de entrega
export const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  status, 
  deliveryAddress 
}) => {
  // Referência para o elemento do mapa
  const mapRef = useRef<HTMLDivElement>(null);
  // Estado para controlar a posição do entregador (simulação)
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  // Estado para armazenar as coordenadas do restaurante (ponto de partida)
  const [restaurant] = useState({ lat: -23.550520, lng: -46.633308 });
  // Estado para armazenar as coordenadas do cliente (ponto de chegada)
  const [customer] = useState({ lat: -23.563895, lng: -46.654124 });
  
  // Efeito para animar o progresso da entrega
  useEffect(() => {
    // Se o status for "entregue", defina o progresso como 100%
    if (status === 'delivered') {
      setDeliveryProgress(100);
      return;
    }
    
    // Caso contrário, simule o progresso do entregador
    const interval = setInterval(() => {
      setDeliveryProgress(prev => {
        // Incrementa o progresso em pequenos passos
        const newProgress = prev + 0.5;
        // Se chegar a 95%, pare (deixamos os últimos 5% para quando realmente for entregue)
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 500);
    
    // Limpe o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [status]);
  
  // Calcule a posição atual do entregador com base no progresso
  const getCurrentPosition = () => {
    // Interpolação linear entre as coordenadas do restaurante e do cliente
    const lat = restaurant.lat + (customer.lat - restaurant.lat) * (deliveryProgress / 100);
    const lng = restaurant.lng + (customer.lng - restaurant.lng) * (deliveryProgress / 100);
    return { lat, lng };
  };
  
  // Obtenha a posição atual do entregador
  const currentPosition = getCurrentPosition();
  
  return (
    <div className="mt-4 mb-6">
      <div className="bg-gray-100 rounded-lg p-1">
        <h3 className="text-sm font-medium mb-2 px-2">Acompanhe o entregador no mapa</h3>
        
        {/* Container do mapa */}
        <div 
          ref={mapRef} 
          className="relative h-48 bg-gray-200 rounded overflow-hidden border"
        >
          {/* Representação visual simples do mapa */}
          <div className="absolute inset-0 bg-blue-50">
            {/* Linha de percurso */}
            <div 
              className="absolute"
              style={{
                top: `${50}%`,
                left: `${20}%`,
                width: `${60}%`,
                height: '3px',
                backgroundColor: '#ccc'
              }}
            />
            
            {/* Parte percorrida */}
            <div 
              className="absolute"
              style={{
                top: `${50}%`,
                left: `${20}%`,
                width: `${60 * deliveryProgress / 100}%`,
                height: '3px',
                backgroundColor: '#ef4444'
              }}
            />
            
            {/* Marcador do restaurante */}
            <div 
              className="absolute flex items-center justify-center"
              style={{
                top: `${50}%`,
                left: `${20}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="p-1 bg-red-600 rounded-full">
                <MapPin size={16} className="text-white" />
              </div>
              <span className="absolute mt-8 text-xs font-medium">Restaurante</span>
            </div>
            
            {/* Marcador do cliente */}
            <div 
              className="absolute flex items-center justify-center"
              style={{
                top: `${50}%`,
                left: `${80}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="p-1 bg-red-600 rounded-full">
                <MapPin size={16} className="text-white" />
              </div>
              <span className="absolute mt-8 text-xs font-medium">Seu endereço</span>
            </div>
            
            {/* Marcador do entregador */}
            <div 
              className="absolute flex items-center justify-center z-10"
              style={{
                top: `${50}%`,
                left: `${20 + 60 * deliveryProgress / 100}%`,
                transform: 'translate(-50%, -50%)',
                transition: 'left 0.5s ease-in-out'
              }}
            >
              <div className="p-1 bg-purple-600 rounded-full animate-pulse">
                <Navigation size={16} className="text-white" />
              </div>
              <span className="absolute mt-8 text-xs font-medium">Entregador</span>
            </div>
          </div>
        </div>
        
        {/* Informações sobre a entrega */}
        <div className="text-xs text-gray-500 p-2">
          {status === 'delivered' ? (
            <p>Seu pedido foi entregue com sucesso!</p>
          ) : (
            <p>Seu pedido está a caminho. Tempo estimado restante: {Math.max(5, 30 - Math.floor(deliveryProgress / 3))} min</p>
          )}
          {deliveryAddress && (
            <p className="mt-1">Endereço de entrega: {deliveryAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
};
