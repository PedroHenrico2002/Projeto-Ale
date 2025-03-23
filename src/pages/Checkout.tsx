
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { OrderSummary } from '@/components/OrderSummary';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Check, ChevronLeft, CreditCard, MapPin, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock data
const deliveryAddress = '350 Fifth Avenue, New York, NY 10118';

const orderSummaryItems = [
  {
    id: '1',
    name: 'Legendary Burger (2) + options',
    quantity: 1,
    price: '$25.98',
  },
  {
    id: '2',
    name: 'Garlic Parmesan Fries (L)',
    quantity: 1,
    price: '$5.99',
  },
];

const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Credit Card',
    icon: CreditCard,
    cardNumber: '**** **** **** 4242',
    expires: '12/25',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: CreditCard,
    email: 'user@example.com',
  },
];

const deliveryTimes = [
  {
    id: 'asap',
    label: 'As soon as possible',
    estimate: '15-25 min',
  },
  {
    id: 'scheduled',
    label: 'Schedule for later',
    options: [
      { id: 'today-1', label: 'Today, 12:00 PM - 12:30 PM' },
      { id: 'today-2', label: 'Today, 12:30 PM - 1:00 PM' },
      { id: 'today-3', label: 'Today, 1:00 PM - 1:30 PM' },
    ],
  },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [deliveryOption, setDeliveryOption] = useState(deliveryTimes[0].id);
  const [scheduledTime, setScheduledTime] = useState('');
  
  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    navigate('/order-complete');
  };
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <Link
              to="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Back to Cart</span>
            </Link>
          </div>
          
          <h1 className="heading-lg mb-6">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium flex items-center">
                    <MapPin size={18} className="mr-2 text-accent" />
                    Delivery Address
                  </h2>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="mb-1">{deliveryAddress}</p>
                      <p className="text-sm text-muted-foreground">Delivery instructions: None</p>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Delivery Time */}
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium flex items-center">
                    <Calendar size={18} className="mr-2 text-accent" />
                    Delivery Time
                  </h2>
                </div>
                
                <div className="p-5 space-y-4">
                  {deliveryTimes.map((option) => (
                    <div key={option.id} className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={() => {
                            setDeliveryOption(option.id);
                            if (option.id === 'scheduled' && option.options) {
                              setScheduledTime(option.options[0].id);
                            } else {
                              setScheduledTime('');
                            }
                          }}
                          className="h-4 w-4 text-accent"
                        />
                        <span>{option.label}</span>
                        {option.estimate && (
                          <span className="text-sm text-muted-foreground">
                            (estimated {option.estimate})
                          </span>
                        )}
                      </label>
                      
                      {deliveryOption === option.id && option.id === 'scheduled' && option.options && (
                        <div className="ml-7 space-y-2">
                          {option.options.map((timeSlot) => (
                            <label key={timeSlot.id} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="scheduledTime"
                                value={timeSlot.id}
                                checked={scheduledTime === timeSlot.id}
                                onChange={() => setScheduledTime(timeSlot.id)}
                                className="h-4 w-4 text-accent"
                              />
                              <span>{timeSlot.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border">
                  <h2 className="font-medium flex items-center">
                    <CreditCard size={18} className="mr-2 text-accent" />
                    Payment Method
                  </h2>
                </div>
                
                <div className="p-5 space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                        ${selectedPayment === method.id
                          ? 'border-accent bg-accent/5'
                          : 'border-input hover:bg-muted/50'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="h-4 w-4 text-accent"
                        />
                        
                        <div className="ml-3 flex items-center">
                          <method.icon size={18} className="mr-2" />
                          <span>{method.name}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {method.cardNumber || method.email}
                      </div>
                    </label>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2">
                    Add New Payment Method
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={orderSummaryItems}
                subtotal="$31.97"
                tax="$2.88"
                deliveryFee="$3.99"
                total="$38.84"
              />
              
              <div className="mt-6 space-y-4">
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12"
                  onClick={handlePlaceOrder}
                >
                  <Check size={16} className="mr-2" />
                  <span>Place Order</span>
                </Button>
                
                <p className="text-xs text-muted-foreground flex items-center justify-center">
                  <Shield size={14} className="mr-1" />
                  <span>Your payment information is processed securely</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
