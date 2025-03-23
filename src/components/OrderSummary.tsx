
import React from 'react';
import { Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  expanded?: boolean;
  className?: string;
  onCheckout?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  deliveryFee,
  total,
  expanded = false,
  className,
  onCheckout,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  return (
    <div className={cn("bg-card rounded-xl border border-border animate-fade-in", className)}>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Order Summary</h3>
          
          <button 
            className="flex items-center text-sm text-muted-foreground hover:text-accent transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span>Hide details</span>
                <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                <span>Show details</span>
                <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </button>
        </div>
        
        {/* Order items */}
        {isExpanded && (
          <div className="mb-5 space-y-4 animate-slide-down">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-start">
                  <div className="bg-accent/10 text-accent w-6 h-6 rounded-full flex items-center justify-center mr-3">
                    {item.quantity}
                  </div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Price breakdown */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{tax}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{deliveryFee}</span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-border font-medium">
            <span>Total</span>
            <span className="text-lg">{total}</span>
          </div>
        </div>
      </div>
      
      {onCheckout && (
        <div className="p-5 border-t border-border bg-muted/30">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Info size={14} className="mr-2" />
            <span>Free delivery on orders over $30</span>
          </div>
          
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={onCheckout}
          >
            <Check size={16} className="mr-2" />
            <span>Proceed to Checkout</span>
          </Button>
        </div>
      )}
    </div>
  );
};
