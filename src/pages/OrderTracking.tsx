
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { OrderTracker } from '@/components/OrderTracker';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Clock, Home, MapPin, MessageCircle, Phone, User 
} from 'lucide-react';

const OrderTracking: React.FC = () => {
  const [status, setStatus] = useState<'preparing' | 'ready' | 'delivering' | 'delivered'>('preparing');
  const [elapsedTime, setElapsedTime] = useState(0); // in minutes
  const [estimatedDelivery, setEstimatedDelivery] = useState('12:45 PM');
  
  // Simulate order status changing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      // Change status based on elapsed time
      if (elapsedTime >= 2 && elapsedTime < 4) {
        setStatus('ready');
      } else if (elapsedTime >= 4 && elapsedTime < 7) {
        setStatus('delivering');
      } else if (elapsedTime >= 7) {
        setStatus('delivered');
        clearInterval(interval);
      }
    }, 2000); // Update every 2 seconds for demo purpose
    
    return () => clearInterval(interval);
  }, [elapsedTime]);
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <h1 className="heading-lg mb-6">Track Your Order</h1>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Tracking */}
            <div className="lg:col-span-2 space-y-6">
              <OrderTracker 
                status={status}
                estimatedDelivery={estimatedDelivery}
              />
              
              {/* Delivery Info */}
              {(status === 'delivering' || status === 'delivered') && (
                <div className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up">
                  <div className="p-5 border-b border-border">
                    <h2 className="font-medium">Delivery Info</h2>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                        <User size={24} className="text-muted-foreground" />
                      </div>
                      
                      <div className="ml-4">
                        <h3 className="font-medium">Michael Johnson</h3>
                        <p className="text-sm text-muted-foreground">Your delivery driver</p>
                      </div>
                      
                      <div className="ml-auto flex space-x-2">
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full">
                          <Phone size={16} />
                        </Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full">
                          <MessageCircle size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock size={16} className="text-muted-foreground mr-2" />
                        <span className="text-sm">
                          {status === 'delivered' 
                            ? 'Delivered at 12:43 PM' 
                            : 'Estimated arrival in 5-10 minutes'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Map Placeholder */}
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in h-64 lg:h-80 relative">
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Map view would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium">Order Summary</h2>
                </div>
                
                <div className="p-5">
                  <p className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span>LF-45678</span>
                  </p>
                  
                  <p className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Placed at:</span>
                    <span>12:15 PM</span>
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>2× Legendary Burger</span>
                      <span>$25.98</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1× Garlic Parmesan Fries (L)</span>
                      <span>$5.99</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>$31.97</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$2.88</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>$3.99</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>$38.84</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium">Delivery Address</h2>
                </div>
                
                <div className="p-5 flex items-start">
                  <Home size={18} className="mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm">350 Fifth Avenue, New York, NY 10118</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Delivery instructions: None
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => {}}
              >
                <MessageCircle size={16} className="mr-2" />
                <span>Contact Support</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
