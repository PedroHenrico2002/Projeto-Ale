import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Check, MapPin } from 'lucide-react';
import { PaymentMethods, PaymentMethod } from '@/components/PaymentMethods';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { orderService } from '@/utils/database/orderService';
import { toast } from '@/lib/toast';

interface PaymentData {
  method: PaymentMethod;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, isLoading: cartLoading, getTotalPrice, clearCart, getRestaurantId } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    // Wait for cart to finish loading before checking
    if (cartLoading) return;
    
    if (items.length === 0) {
      toast.error('Carrinho vazio');
      navigate('/cart');
      return;
    }

    if (!user) {
      toast.error('Faça login para continuar');
      navigate('/auth');
      return;
    }

    fetchUserData();
    fetchRestaurantData();
  }, [items, cartLoading, navigate, user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data: addresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (addresses && addresses.length > 0) {
        setUserAddresses(addresses);
        // Seleciona o endereço padrão ou o primeiro
        const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    }
  };

  const fetchRestaurantData = async () => {
    const restaurantId = getRestaurantId();
    if (!restaurantId) return;

    try {
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (data) {
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Erro ao buscar restaurante:', error);
    }
  };

  const handlePaymentSelect = (payment: PaymentData) => {
    setPaymentData(payment);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Selecione um endereço de entrega');
      return;
    }

    if (!paymentData) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    if (items.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    setLoading(true);

    try {
      const restaurantId = getRestaurantId();
      if (!restaurantId) {
        throw new Error('Restaurante não identificado');
      }

      const subtotal = getTotalPrice();
      const deliveryFee = restaurant?.delivery_fee || 5.99;
      const total = subtotal + deliveryFee;

      const orderData = {
        restaurant_id: restaurantId,
        delivery_address_id: selectedAddressId,
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
        payment_method: JSON.stringify(paymentData),
        status: 'pending',
        notes: ''
      };

      const order = await orderService.create(orderData);
      console.log('Pedido criado:', order);
      console.log('Order ID:', order.id);
      
      clearCart();
      
      toast.success('Pedido realizado com sucesso!');
      
      // Navigate to order confirmation with order ID
      navigate('/order-confirmation', { 
        state: { 
          orderId: order.id
        },
        replace: true
      });
      
      console.log('Navegando para order-confirmation com orderId:', order.id);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const deliveryFee = restaurant?.delivery_fee || 5.99;
  const total = subtotal + deliveryFee;

  if (cartLoading || !user || items.length === 0) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="page-container">
            <div className="text-center">
              <p>Carregando checkout...</p>
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
              to="/confirm-order"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Voltar
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário de Checkout */}
            <div className="lg:col-span-2 space-y-6">
              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userAddresses.length > 0 ? (
                    <div className="space-y-3">
                      {userAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">
                                {address.street}, {address.number}
                              </p>
                              {address.complement && (
                                <p className="text-sm text-muted-foreground">{address.complement}</p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {address.neighborhood} - {address.city}, {address.state}
                              </p>
                              <p className="text-sm text-muted-foreground">CEP: {address.zip_code}</p>
                            </div>
                            {selectedAddressId === address.id && (
                              <Check size={20} className="text-accent flex-shrink-0 ml-2" />
                            )}
                          </div>
                          {address.is_default && (
                            <span className="inline-block mt-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                              Endereço Padrão
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-3">Nenhum endereço cadastrado</p>
                      <Button variant="outline" onClick={() => navigate('/profile')}>
                        Adicionar Endereço
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Forma de Pagamento */}
              <PaymentMethods 
                onPaymentSelect={handlePaymentSelect}
                selectedMethod={paymentData?.method}
              />
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => {
                    const optionsPrice = item.options?.reduce((total, opt) => total + opt.price, 0) || 0;
                    const itemTotal = (item.price + optionsPrice) * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 mt-6"
                    onClick={handlePlaceOrder}
                    disabled={loading || !paymentData || !selectedAddressId}
                  >
                    <Check size={16} className="mr-2" />
                    {loading ? 'Processando...' : `Finalizar Pedido - R$ ${total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;