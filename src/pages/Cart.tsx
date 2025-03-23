
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { LocationSelector } from '@/components/LocationSelector';
import { OrderSummary } from '@/components/OrderSummary';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock data
const cartItems = [
  {
    id: '1',
    name: 'Legendary Burger',
    quantity: 2,
    unitPrice: '$12.99',
    totalPrice: '$25.98',
    options: ['Large (+$3.00)', 'Extra Cheese (+$1.50)'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Burger Heaven',
  },
  {
    id: '2',
    name: 'Garlic Parmesan Fries',
    quantity: 1,
    unitPrice: '$5.99',
    totalPrice: '$5.99',
    options: ['Large (+$2.00)'],
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Burger Heaven',
  },
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(cartItems);
  const [address, setAddress] = useState('');
  
  const handleLocationSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    toast.success('Delivery location updated!');
  };
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Item removed from cart!');
  };
  
  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared!');
  };
  
  const handleCheckout = () => {
    if (!address) {
      toast.error('Please select a delivery address first');
      return;
    }
    
    navigate('/checkout');
  };
  
  // Calculate totals
  const subtotal = '$31.97';
  const tax = '$2.88';
  const deliveryFee = '$3.99';
  const total = '$38.84';
  
  const orderSummaryItems = items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.totalPrice,
  }));
  
  // Check if cart is empty
  const isCartEmpty = items.length === 0;
  
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
              <span>Continue Shopping</span>
            </Link>
          </div>
          
          <h1 className="heading-lg mb-6">Your Cart</h1>
          
          {isCartEmpty ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <h2 className="text-lg font-medium mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/restaurants')}
              >
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                  <div className="p-5 flex items-center justify-between border-b border-border">
                    <h2 className="font-medium">Cart Items ({items.length})</h2>
                    <button
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center"
                      onClick={clearCart}
                    >
                      <Trash2 size={14} className="mr-1" />
                      <span>Clear All</span>
                    </button>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.id} className="p-5 flex items-center">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mb-1">{item.restaurantName}</p>
                              
                              <div className="text-sm text-muted-foreground">
                                {item.options.map((option, index) => (
                                  <span key={index} className="mr-2">{option}</span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-3 md:mt-0 md:text-right">
                              <div className="text-sm mb-2">
                                <span className="text-muted-foreground">{item.unitPrice} × {item.quantity} = </span>
                                <span className="font-medium">{item.totalPrice}</span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                
                                <span className="text-sm font-medium">{item.quantity}</span>
                                
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <LocationSelector onSelectLocation={handleLocationSelect} />
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  items={orderSummaryItems}
                  subtotal={subtotal}
                  tax={tax}
                  deliveryFee={deliveryFee}
                  total={total}
                  expanded={true}
                  onCheckout={handleCheckout}
                />
                
                <div className="mt-6 bg-card rounded-xl border border-border p-5 animate-fade-in">
                  <h3 className="font-medium mb-4">Have a Promo Code?</h3>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 rounded-l-md border border-r-0 border-input focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                    <Button className="rounded-l-none bg-accent hover:bg-accent/90 text-accent-foreground">
                      Apply
                    </Button>
                  </div>
                </div>
                
                <Link to="/restaurants" className="mt-6 block">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                  >
                    <span>Add More Items</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
