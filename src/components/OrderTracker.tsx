
import React from 'react';
import { CheckCircle2, Clock, PackageOpen, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderStatus = 'preparing' | 'ready' | 'delivering' | 'delivered';

interface OrderTrackerProps {
  status: OrderStatus;
  estimatedDelivery: string;
  className?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  status,
  estimatedDelivery,
  className,
}) => {
  const steps = [
    { key: 'preparing', label: 'Preparing', icon: Clock },
    { key: 'ready', label: 'Ready', icon: PackageOpen },
    { key: 'delivering', label: 'On the Way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStepStatus = (step: string) => {
    const statusIndex = steps.findIndex(s => s.key === status);
    const stepIndex = steps.findIndex(s => s.key === step);
    
    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className={cn("w-full bg-card rounded-xl border border-border p-6", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-medium">Tracking Your Order</h3>
        <p className="text-sm text-muted-foreground">
          Estimated delivery by {estimatedDelivery}
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
                    {stepStatus === 'current' && `Your order is ${step.label.toLowerCase()}...`}
                    {stepStatus === 'completed' && `Your order has been ${step.label.toLowerCase()}`}
                    {stepStatus === 'upcoming' && `Waiting to be ${step.label.toLowerCase()}`}
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
