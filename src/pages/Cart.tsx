import React from 'react';
import { Layout } from '@/components/Layout';
import { LocationSelector } from '@/components/LocationSelector';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const [promoCode, setPromoCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  
  const handleLocationSelect = (selectedAddress: string) => {
    toast.success('Localização de entrega atualizada!');
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'primeiracompra') {
      setDiscount(0.1); // 10% de desconto
      toast.success('Código promocional aplicado! 10% de desconto no total.');
    } else {
      toast.error('Código promocional inválido');
      setDiscount(0);
    }
  };
  
  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = 5.99;
  const tax = subtotal * 0.1;
  const totalBeforeDiscount = subtotal + deliveryFee + tax;
  const discountAmount = totalBeforeDiscount * discount;
  const total = totalBeforeDiscount - discountAmount;
  
  // Check if cart is empty
  const isCartEmpty = items.length === 0;
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <Link
              to="/restaurants"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Continuar Comprando</span>
            </Link>
          </div>
          
          <h1 className="heading-lg mb-6">Seu Carrinho</h1>
          
          {isCartEmpty ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <h2 className="text-lg font-medium mb-3">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Parece que você ainda não adicionou nenhum item ao seu carrinho.
              </p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/restaurants')}
              >
                Ver Restaurantes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                  <div className="p-5 flex items-center justify-between border-b border-border">
                    <h2 className="font-medium">Itens do Carrinho ({items.length})</h2>
                    <button
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center"
                      onClick={clearCart}
                    >
                      <Trash2 size={14} className="mr-1" />
                      <span>Limpar Tudo</span>
                    </button>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {items.map((item) => {
                      const optionsPrice = item.options?.reduce((total, opt) => total + opt.price, 0) || 0;
                      const itemTotalPrice = (item.price + optionsPrice) * item.quantity;
                      
                      return (
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
                                
                                {item.options && item.options.length > 0 && (
                                  <div className="text-sm text-muted-foreground">
                                    {item.options.map((option, index) => (
                                      <span key={index} className="mr-2">
                                        {option.name}: {Array.isArray(option.value) ? option.value.join(', ') : option.value}
                                        {option.price > 0 && ` (+R$${option.price.toFixed(2)})`}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3 md:mt-0 md:text-right">
                                <div className="text-sm mb-2">
                                  <span className="text-muted-foreground">R${(item.price + optionsPrice).toFixed(2)} × {item.quantity} = </span>
                                  <span className="font-medium">R${itemTotalPrice.toFixed(2)}</span>
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
                      );
                    })}
                  </div>
                </div>
                
                <LocationSelector onSelectLocation={handleLocationSelect} />
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
                  <h3 className="font-medium mb-4">Resumo do Pedido</h3>
                  
                  <div className="space-y-3 mb-4">
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
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto (10%)</span>
                        <span>-R${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>R${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleCheckout}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
                
                <div className="mt-6 bg-card rounded-xl border border-border p-5 animate-fade-in">
                  <h3 className="font-medium mb-4">Tem um Código Promocional?</h3>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Digite o código promocional"
                      className="flex-1 rounded-l-md border border-r-0 border-input focus:border-accent focus:ring-1 focus:ring-accent px-3 py-2"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button 
                      className="rounded-l-none bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handleApplyPromo}
                    >
                      Aplicar
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2">✓ Código aplicado com sucesso!</p>
                  )}
                </div>
                
                <Link to="/restaurants" className="mt-6 block">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                  >
                    <span>Adicionar Mais Itens</span>
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