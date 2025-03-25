import React from 'react';
import { CheckCircle2, Clock, MapPin, Truck, Bike, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type OrderStatus = 'preparing' | 'ready' | 'delivering' | 'delivered';

interface OrderTrackerProps {
  status: OrderStatus;
  estimatedDelivery: string;
  className?: string;
  simplified?: boolean;
  onRate?: (rating: number) => void;
  currentRating?: number;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  status,
  estimatedDelivery,
  className,
  simplified = false,
  onRate,
  currentRating = 0
}) => {
  const steps = [
    { key: 'preparing', label: 'Preparando', icon: Clock },
    { key: 'ready', label: 'Pronto', icon: CheckCircle2 },
    { key: 'delivering', label: 'A caminho', icon: Truck },
    { key: 'delivered', label: 'Entregue', icon: CheckCircle2 },
  ];

  const getStepStatus = (step: string) => {
    const statusIndex = steps.findIndex(s => s.key === status);
    const stepIndex = steps.findIndex(s => s.key === step);
    
    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'current';
    return 'upcoming';
  };

  const getProgressPercentage = () => {
    switch (status) {
      case 'preparing': return 25;
      case 'ready': return 50;
      case 'delivering': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  if (simplified) {
    return (
      <div className={cn("w-full", className)}>
        <div className="mb-2">
          <p className="text-gray-600 text-sm mb-1">
            Previsão de entrega
          </p>
          <h3 className="text-base font-semibold">{estimatedDelivery}</h3>
        </div>
        
        <div className="relative w-full h-10 mb-4">
          <Progress 
            value={getProgressPercentage()} 
            className="h-2 bg-green-100" 
          />
          
          {status === 'delivering' && (
            <div 
              className="absolute top-0 left-0 transition-all duration-500 animate-bounce"
              style={{ left: `${Math.min(70, getProgressPercentage())}%`, transform: 'translateY(-50%)' }}
            >
              <Bike className="text-green-600" size={24} />
            </div>
          )}
          
          {status === 'delivered' && (
            <div 
              className="absolute top-0 right-0 transform -translate-y-1/2"
            >
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-green-500 text-white rounded-full p-1">
            {status === 'delivering' ? <Bike size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <div>
            <p className="text-sm font-medium">
              {status === 'preparing' && 'O pedido está sendo preparado e logo sairá pra entrega'}
              {status === 'ready' && 'Seu pedido está pronto e será enviado em breve'}
              {status === 'delivering' && 'Seu pedido está a caminho'}
              {status === 'delivered' && 'Seu pedido foi entregue'}
            </p>
            
            {status === 'delivered' && onRate && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Avaliar restaurante:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onRate(star)}
                      className={`transition-colors ${
                        star <= currentRating 
                          ? "text-yellow-400" 
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      <Star 
                        size={24} 
                        className="cursor-pointer" 
                        fill={star <= currentRating ? "currentColor" : "none"} 
                      />
                    </button>
                  ))}
                </div>
                <Button 
                  variant="link" 
                  className="text-red-600 p-0 h-auto mt-2" 
                  asChild
                >
                  <Link to="/">Voltar para o início</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-card rounded-xl border border-border p-6", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-medium">Acompanhando Seu Pedido</h3>
        <p className="text-sm text-muted-foreground">
          Previsão de entrega: {estimatedDelivery}
        </p>
      </div>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted z-0 transform -translate-x-1/2"></div>
        
        {/* Steps */}
        <div className="relative z-10 space-y-8">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.key);
            return (
              <div key={step.key} className="flex items-start">
                <div 
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center relative z-10",
                    {
                      'bg-accent text-accent-foreground animate-pulse': stepStatus === 'current',
                      'bg-accent/20 text-accent': stepStatus === 'completed',
                      'bg-muted text-muted-foreground': stepStatus === 'upcoming',
                    }
                  )}
                >
                  <step.icon size={22} />
                </div>
                
                <div className="ml-4 flex-1">
                  <h4 
                    className={cn(
                      "font-medium text-base mb-1",
                      {
                        'text-accent': stepStatus === 'current',
                        'text-foreground': stepStatus === 'completed',
                        'text-muted-foreground': stepStatus === 'upcoming',
                      }
                    )}
                  >
                    {step.label}
                  </h4>
                  
                  <p 
                    className={cn(
                      "text-sm",
                      {
                        'text-muted-foreground': stepStatus === 'current' || stepStatus === 'completed',
                        'text-muted-foreground/70': stepStatus === 'upcoming',
                      }
                    )}
                  >
                    {stepStatus === 'current' && `Seu pedido está ${step.label.toLowerCase()}...`}
                    {stepStatus === 'completed' && `Seu pedido foi ${step.label.toLowerCase()}`}
                    {stepStatus === 'upcoming' && `Aguardando para ser ${step.label.toLowerCase()}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
