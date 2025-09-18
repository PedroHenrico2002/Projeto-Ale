import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Check, ChevronLeft, CreditCard, MapPin, Shield } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { orderService } from '@/utils/database/orderService';
import { useCart } from '@/contexts/CartContext';

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
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart, getRestaurantId } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [deliveryOption, setDeliveryOption] = useState(deliveryTimes[0].id);
  const [scheduledTime, setScheduledTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Calculate order totals
  const subtotal = getTotalPrice();
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer um pedido');
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      navigate('/cart');
      return;
    }

    setLoading(true);

    try {
      // Get user's default address or use first available address
      const { data: addresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (!addresses || addresses.length === 0) {
        toast.error('Você precisa cadastrar um endereço para fazer pedidos');
        navigate('/profile');
        return;
      }

      const address = addresses[0];
      const restaurantId = getRestaurantId();

      if (!restaurantId) {
        toast.error('Erro: Restaurante não identificado');
        return;
      }

      // Create order data using cart items
      const orderData = {
        restaurant_id: restaurantId,
        delivery_address_id: address.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options || []
        })),
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total: total,
        payment_method: selectedPayment,
        notes: ''
      };

      // Save order to database
      const order = await orderService.create(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      toast.success('Pedido realizado com sucesso!');
      navigate('/order-complete', { state: { orderId: order.id, orderData } });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
              <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
                <h3 className="font-medium mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => {
                    const optionsPrice = item.options?.reduce((total, opt) => total + opt.price, 0) || 0;
                    const itemTotal = (item.price + optionsPrice) * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>R${itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Entrega</span>
                      <span>R${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impostos</span>
                      <span>R${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>R${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12"
                  onClick={handlePlaceOrder}
                  disabled={loading || items.length === 0}
                >
                  <Check size={16} className="mr-2" />
                  <span>{loading ? 'Processando...' : 'Finalizar Pedido'}</span>
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
      </div>
    </Layout>
  );
};

export default Checkout;
