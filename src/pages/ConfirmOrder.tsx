
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, CreditCard, Truck, DollarSign, LogIn } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';

const ConfirmOrder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { items, getTotalPrice, getRestaurantId } = useCart();
  
  // Generate order number
  const orderNumber = `LF-${Math.floor(10000 + Math.random() * 90000)}`;
  
  useEffect(() => {
    // Check if cart has items
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      navigate('/cart');
      return;
    }
  }, [items, navigate]);
  
  const handleConfirmOrder = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      navigate('/cart');
      return;
    }
    
    // Navigate to checkout with cart data
    navigate('/checkout');
  };
  
  const handleLogin = () => {
    navigate('/auth');
  };
  
  // Calculate totals
  const subtotal = getTotalPrice();
  const restaurantName = items.length > 0 ? items[0].restaurantName : 'Restaurante';
  const restaurantId = getRestaurantId();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <div className="text-center">
              <p>Carregando dados do pedido...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <Link
              to={`/restaurants/${restaurantId}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Voltar para o Restaurante</span>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-6">Confirmar Pedido</h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border overflow-hidden mb-6">
              <div className="border-b p-4">
                <h2 className="font-semibold text-lg">{restaurantName}</h2>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>Número do Pedido: </span>
                  <span className="font-medium">{orderNumber}</span>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  {items.map((item) => {
                    const optionsPrice = item.options?.reduce((total, opt) => total + opt.price, 0) || 0;
                    const itemTotal = (item.price + optionsPrice) * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-start">
                          <span className="bg-accent/20 text-accent w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
                            {item.quantity}
                          </span>
                          <div>
                            <span className="block">{item.name}</span>
                            {item.options && item.options.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                {item.options.map((option, index) => (
                                  <span key={index}>
                                    {option.name}: {Array.isArray(option.value) ? option.value.join(', ') : option.value}
                                    {option.price > 0 && ` (+R$${option.price.toFixed(2)})`}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-medium">R${itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Valor Total</span>
                    <span className="text-xl">R${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-gray-500 mb-2">
                Por favor, confirme seu pedido. Uma vez confirmado, seu pedido será processado.
              </p>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg"
              onClick={handleConfirmOrder}
              disabled={loading || items.length === 0}
            >
              <Check size={18} className="mr-2" />
              {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Faça login para continuar</DialogTitle>
            <DialogDescription className="text-center">
              Você precisa estar logado para concluir seu pedido.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <LogIn size={48} className="text-red-500" />
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleLogin}
            >
              Fazer Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ConfirmOrder;
