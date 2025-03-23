
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { OrderTracker } from '@/components/OrderTracker';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, MapPin, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderComplete: React.FC = () => {
  const navigate = useNavigate();
  
  // Random order number
  const orderNumber = `LF-${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Trigger confetti effect when component mounts
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#9b87f5', '#7E69AB', '#6E59A5'],
      });
      
      confetti({
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#9b87f5', '#7E69AB', '#6E59A5'],
      });
    }, 250);
    
    return () => clearInterval(confettiInterval);
  }, []);
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-10 animate-slide-down">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                <Check size={30} />
              </div>
              
              <h1 className="heading-lg mb-3">Order Confirmed!</h1>
              
              <p className="text-muted-foreground mb-6">
                Your order has been placed successfully and is being prepared.
              </p>
              
              <div className="inline-block bg-secondary px-4 py-2 rounded-md text-sm">
                <span className="text-muted-foreground">Order Number: </span>
                <span className="font-semibold">{orderNumber}</span>
              </div>
            </div>
            
            {/* Order Tracking */}
            <div className="space-y-8">
              <OrderTracker 
                status="preparing"
                estimatedDelivery="12:45 PM"
              />
              
              {/* Order Details */}
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium">Order Details</h2>
                </div>
                
                <div className="divide-y divide-border">
                  <div className="p-5 flex items-start">
                    <ShoppingBag size={18} className="mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Items</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>2× Legendary Burger</span>
                          <span className="text-muted-foreground">$25.98</span>
                        </li>
                        <li className="flex justify-between">
                          <span>1× Garlic Parmesan Fries (L)</span>
                          <span className="text-muted-foreground">$5.99</span>
                        </li>
                        <li className="flex justify-between font-medium border-t border-border pt-2 mt-2">
                          <span>Total</span>
                          <span>$38.84</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-5 flex items-start">
                    <MapPin size={18} className="mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Delivery Address</h3>
                      <p className="text-sm">350 Fifth Avenue, New York, NY 10118</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/tracking')}
                >
                  <span>Track Order</span>
                  <ChevronRight size={16} className="ml-1" />
                </Button>
                
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => navigate('/')}
                >
                  <span>Continue Shopping</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderComplete;
