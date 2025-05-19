
import React, { useEffect, useRef, useState } from 'react';

// Interface para as propriedades do componente
interface DeliveryMapProps {
  // Status atual da entrega
  status: 'delivering' | 'delivered';
  // Endereço de entrega (opcional)
  deliveryAddress?: string;
  // Habilitar rastreamento em tempo real
  realTimeTracking?: boolean;
}

// Componente que exibe o progresso da entrega
export const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  status, 
  deliveryAddress,
  realTimeTracking = false
}) => {
  // Estado para controlar a posição do entregador (simulação)
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  // Estado para armazenar as coordenadas do restaurante (ponto de partida)
  const [restaurant] = useState({ lat: -23.550520, lng: -46.633308 });
  // Estado para armazenar as coordenadas do cliente (ponto de chegada)
  const [customer] = useState({ lat: -23.563895, lng: -46.654124 });
  // Estado para armazenar o timestamp da última atualização
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  // Tempo estimado total da entrega em milissegundos (15 minutos)
  const totalDeliveryTimeMs = 15 * 60 * 1000;
  // Referência para o intervalo de atualização
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Efeito para animar o progresso da entrega
  useEffect(() => {
    // Se o status for "entregue", defina o progresso como 100%
    if (status === 'delivered') {
      setDeliveryProgress(100);
      return;
    }
    
    // Caso contrário, simule o progresso do entregador em tempo real
    if (realTimeTracking) {
      const startTime = Date.now() - (deliveryProgress / 100) * totalDeliveryTimeMs;
      
      // Função para atualizar o progresso
      const updateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min((elapsedTime / totalDeliveryTimeMs) * 100, 95);
        setDeliveryProgress(progress);
        setLastUpdateTime(Date.now());
      };
      
      // Atualiza inicialmente
      updateProgress();
      
      // Configura um intervalo para atualização frequente (a cada 1 segundo)
      intervalRef.current = setInterval(updateProgress, 1000);
      
      // Limpe o intervalo quando o componente for desmontado
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      // Comportamento original para compatibilidade
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
    }
  }, [status, realTimeTracking]);
  
  // Calcula o tempo restante estimado
  const getRemainingTime = () => {
    if (status === 'delivered') return '0 min';
    
    const progressPercentage = deliveryProgress / 100;
    const remainingPercentage = 1 - progressPercentage;
    const remainingTimeMs = remainingPercentage * totalDeliveryTimeMs;
    const remainingMinutes = Math.ceil(remainingTimeMs / (60 * 1000));
    
    return `${remainingMinutes} min`;
  };
  
  return (
    <div className="mt-4 mb-6">
      <div className="bg-gray-100 rounded-lg p-4">
        {/* Informações sobre a entrega */}
        <div className="text-sm">
          {status === 'delivered' ? (
            <p>Seu pedido foi entregue com sucesso!</p>
          ) : (
            <div>
              <p>Seu pedido está a caminho. Tempo estimado restante: {getRemainingTime()}</p>
              {realTimeTracking && (
                <p className="mt-1 text-xs text-green-600">
                  Última atualização: {new Date(lastUpdateTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
          {deliveryAddress && (
            <p className="mt-1">Endereço de entrega: {deliveryAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
};
