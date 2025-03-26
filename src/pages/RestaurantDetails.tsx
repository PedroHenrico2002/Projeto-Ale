import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ChevronLeft, Star, AlertCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { PaymentMethods, PaymentMethod, CardDetails } from '@/components/PaymentMethods';

const restaurantsData = {
  '1': {
    id: '1',
    name: 'Doce Paixão',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Bolos',
    rating: 4.9,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,90',
    featured: true,
    menu: [
      {
        id: '101',
        name: 'Bolo de Chocolate com Frutas',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Delicioso bolo de chocolate decorado com frutas frescas',
        price: 'R$29,90',
        priceValue: 29.90
      },
      {
        id: '102',
        name: 'Torta de Morango',
        image: 'https://images.unsplash.com/photo-1455268745580-72a73648e5e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Torta de morango com creme de baunilha e massa crocante',
        price: 'R$27,50',
        priceValue: 27.50
      },
      {
        id: '103',
        name: 'Cupcake de Red Velvet',
        image: 'https://images.unsplash.com/photo-1519869325930-281384150729?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Cupcake red velvet com cobertura de cream cheese',
        price: 'R$8,90',
        priceValue: 8.90
      },
      {
        id: '104',
        name: 'Doces Variados',
        image: 'https://images.unsplash.com/photo-1581798459219-318e68f60ae5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Caixa com 12 unidades de doces variados (brigadeiros, beijinhos e cajuzinhos)',
        price: 'R$24,90',
        priceValue: 24.90
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Restaurante Japonês',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japonesa',
    rating: 4.9,
    deliveryTime: '30-45 min',
    minOrder: 'R$25,00',
    menu: [
      
    ]
  },
  '3': {
    id: '3',
    name: 'Churrascaria Gaúcha',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Churrasco',
    rating: 4.7,
    deliveryTime: '35-50 min',
    minOrder: 'R$30,00',
    menu: [
      
    ]
  },
  '4': {
    id: '4',
    name: 'Comida Caseira',
    image: 'https://images.unsplash.com/photo-1547928576-f8d1c7a1b709?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Brasileira',
    rating: 4.5,
    deliveryTime: '20-35 min',
    minOrder: 'R$12,90',
    menu: [
      
    ]
  },
  '6': {
    id: '6',
    name: 'Gelato Italiano',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Sorvetes e Gelatos Artesanais',
    rating: 4.6,
    deliveryTime: '15-30 min',
    minOrder: 'R$6,50',
    featured: true,
    menu: [
      {
        id: '601',
        name: 'Gelato de Pistache Tradicional',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Gelato italiano autêntico de pistache, feito com ingredientes importados da Sicília',
        price: 'R$18,90',
        priceValue: 18.90
      },
      {
        id: '602',
        name: 'Sorvete de Chocolate Belga Premium',
        image: 'https://images.unsplash.com/photo-1563894923499-f65aff78a0d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Sorvete cremoso de chocolate belga premium com 70% de cacau e pedaços de chocolate',
        price: 'R$16,50',
        priceValue: 16.50
      },
      {
        id: '603',
        name: 'Sundae de Caramelo Salgado',
        image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Sundae especial com sorvete de baunilha, calda de caramelo salgado e amendoim torrado',
        price: 'R$14,90',
        priceValue: 14.90
      },
      {
        id: '604',
        name: 'Banana Split Clássica',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Clássica banana split com três sabores de sorvete (chocolate, morango e baunilha) e coberturas especiais',
        price: 'R$22,90',
        priceValue: 22.90
      },
      {
        id: '605',
        name: 'Gelato de Stracciatella',
        image: 'https://images.unsplash.com/photo-1584278858021-91b1319e5c64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Tradicional gelato de creme com lascas de chocolate amargo importado',
        price: 'R$17,90',
        priceValue: 17.90
      }
    ]
  },
  '8': {
    id: '8',
    name: 'Açaí Tropical',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Açaí e Smoothies Premium',
    rating: 4.7,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,50',
    featured: true,
    menu: [
      {
        id: '801',
        name: 'Açaí Tradicional na Tigela',
        image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Açaí tradicional na tigela com banana, granola e mel orgânico',
        price: 'R$15,90',
        priceValue: 15.90
      },
      {
        id: '802',
        name: 'Smoothie de Frutas Vermelhas',
        image: 'https://images.unsplash.com/photo-1506802913710-40e2e66339c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Smoothie refrescante de frutas vermelhas (morango, framboesa e amora) com iogurte natural',
        price: 'R$12,50',
        priceValue: 12.50
      },
      {
        id: '803',
        name: 'Açaí Especial com Mix de Frutas',
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Açaí premium com mix de frutas frescas (morango, kiwi, banana), leite condensado e granola artesanal',
        price: 'R$19,90',
        priceValue: 19.90
      },
      {
        id: '804',
        name: 'Bowl Energia Amazônica',
        image: 'https://images.unsplash.com/photo-1573590330099-d6c7355ec595?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Bowl energético com açaí amazônico, banana, morango, granola, castanhas brasileiras e pasta de amendoim natural',
        price: 'R$22,90',
        priceValue: 22.90
      },
      {
        id: '805',
        name: 'Açaí com Cupuaçu',
        image: 'https://images.unsplash.com/photo-1606213651356-0adb205dec89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Mistura especial de açaí com cupuaçu, servida com granola e mel',
        price: 'R$18,50',
        priceValue: 18.50
      }
    ]
  }
};

interface CartItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

const RestaurantDetails: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('credit');
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const restaurant = restaurantId ? restaurantsData[restaurantId as keyof typeof restaurantsData] : null;
  
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    setTotalValue(newTotal);
  }, [cartItems]);

  // Validate if the form is complete based on payment method
  useEffect(() => {
    if (selectedPayment === 'cash') {
      setIsFormValid(true);
    } else {
      setIsFormValid(!!selectedCard);
    }
  }, [selectedPayment, selectedCard]);
  
  const handleBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };
  
  if (!restaurant) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <div className="text-center">
              <h1 className="heading-lg mb-4">Restaurante não encontrado</h1>
              <Button 
                onClick={() => navigate('/restaurants')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Voltar para Restaurantes
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const addToCart = (item: any) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prev, { 
          id: item.id, 
          name: item.name, 
          price: item.price,
          priceValue: item.priceValue,
          quantity: 1 
        }];
      }
    });
    
    toast.success('Item adicionado ao carrinho!');
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prev];
        if (updatedItems[existingItemIndex].quantity > 1) {
          updatedItems[existingItemIndex].quantity -= 1;
          return updatedItems;
        } else {
          return prev.filter(item => item.id !== itemId);
        }
      }
      
      return prev;
    });
  };
  
  const handlePaymentSelect = (method: PaymentMethod, cardDetails: CardDetails | null) => {
    setSelectedPayment(method);
    setSelectedCard(cardDetails);
  };
  
  const handleFinishOrder = () => {
    if (cartItems.length === 0) {
      toast.error('Adicione itens ao carrinho primeiro');
      return;
    }
    
    setShowPaymentOptions(true);
  };
  
  const handleConfirmOrder = () => {
    if (!isFormValid) {
      if (selectedPayment !== 'cash') {
        toast.error('Adicione um cartão para continuar');
      }
      return;
    }
    
    sessionStorage.setItem('currentOrder', JSON.stringify({
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      items: cartItems,
      totalValue: totalValue,
      orderNumber: `#${Math.floor(10000 + Math.random() * 90000)}`,
      paymentMethod: selectedPayment,
      paymentDetails: selectedCard
    }));
    
    navigate('/confirm-order', { state: { from: `/restaurants/${restaurantId}` } });
  };
  
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Voltar</span>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">{restaurant.name}</h1>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 font-medium">{restaurant.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600">{restaurant.cuisine}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600">{restaurant.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Cardápio</h2>
              
              <div className="space-y-4">
                {restaurant.menu.map((item) => (
                  <div key={item.id} className="flex border rounded-lg overflow-hidden bg-white">
                    <div className="w-24 h-24 bg-gray-200">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500 flex-grow">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">{item.price}</span>
                        <div className="flex items-center">
                          {cartItems.find(cartItem => cartItem.id === item.id) && (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="mx-2 font-medium">
                                {cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              </span>
                            </>
                          )}
                          <Button 
                            size="sm"
                            className="rounded-full h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => addToCart(item)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg border p-4 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Seu pedido</h2>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingCart size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                    <p className="text-sm text-gray-400 mt-1">Adicione itens do cardápio</p>
                  </div>
                ) : (
                  <>
                    {!showPaymentOptions ? (
                      <>
                        <div className="space-y-3 mb-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div className="flex items-start">
                                <span className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                                  {item.quantity}
                                </span>
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <span className="font-medium">{item.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span className="text-lg">R${totalValue.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleFinishOrder}
                        >
                          Finalizar Pedido
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          <h3 className="font-medium">Forma de pagamento</h3>
                          <PaymentMethods 
                            onSelectPayment={handlePaymentSelect}
                            selectedMethod={selectedPayment}
                          />
                        </div>
                        
                        {!isFormValid && selectedPayment !== 'cash' && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>Adicione um cartão para continuar com o pedido</span>
                          </div>
                        )}
                        
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <span>Forma de pagamento</span>
                            <span>
                              {selectedPayment === 'credit' && 'Crédito'}
                              {selectedPayment === 'debit' && 'Débito'}
                              {selectedPayment === 'meal' && 'Vale Refeição'}
                              {selectedPayment === 'cash' && 'Pagar na entrega'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span className="text-lg">R${totalValue.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowPaymentOptions(false)}
                          >
                            Voltar
                          </Button>
                          <Button 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleConfirmOrder}
                            disabled={!isFormValid}
                          >
                            Confirmar Pedido
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetails;
