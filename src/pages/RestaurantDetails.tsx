
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ChevronLeft, Star } from 'lucide-react';
import { toast } from '@/lib/toast';

// Dados simulados para os restaurantes
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
    name: 'Gelato Italiano',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Sorvetes e Gelatos',
    rating: 4.6,
    deliveryTime: '15-30 min',
    minOrder: 'R$6,50',
    menu: [
      {
        id: '201',
        name: 'Gelato de Pistache',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Gelato italiano autêntico de pistache',
        price: 'R$18,90',
        priceValue: 18.90
      },
      {
        id: '202',
        name: 'Sorvete de Chocolate Belga',
        image: 'https://images.unsplash.com/photo-1563894923499-f65aff78a0d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Sorvete cremoso de chocolate belga premium',
        price: 'R$16,50',
        priceValue: 16.50
      },
      {
        id: '203',
        name: 'Sundae de Caramelo',
        image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Sundae com sorvete de baunilha, calda de caramelo e amendoim',
        price: 'R$14,90',
        priceValue: 14.90
      },
      {
        id: '204',
        name: 'Banana Split',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Clássica banana split com três sabores de sorvete e coberturas especiais',
        price: 'R$22,90',
        priceValue: 22.90
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Confeitaria Doce Sonho',
    image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Confeitaria',
    rating: 4.8,
    deliveryTime: '25-40 min',
    minOrder: 'R$7,50',
    menu: [
      {
        id: '301',
        name: 'Croissant Recheado',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Croissant francês recheado com creme de avelã',
        price: 'R$12,90',
        priceValue: 12.90
      },
      {
        id: '302',
        name: 'Éclair de Chocolate',
        image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Éclair recheado com creme de confeiteiro e coberto com ganache de chocolate',
        price: 'R$9,90',
        priceValue: 9.90
      },
      {
        id: '303',
        name: 'Macarons Sortidos',
        image: 'https://images.unsplash.com/photo-1558326567-98166e4c1917?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Caixa com 6 macarons sortidos de sabores variados',
        price: 'R$21,90',
        priceValue: 21.90
      },
      {
        id: '304',
        name: 'Torta Mil Folhas',
        image: 'https://images.unsplash.com/photo-1464195244916-405fa0a8763d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Clássica torta mil folhas com creme de baunilha',
        price: 'R$18,50',
        priceValue: 18.50
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Açaí Tropical',
    image: 'https://images.unsplash.com/photo-1502825751399-28baa9b81995?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Açaí e Smoothies',
    rating: 4.7,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,50',
    menu: [
      {
        id: '401',
        name: 'Açaí Tradicional',
        image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Açaí tradicional com banana, granola e mel',
        price: 'R$15,90',
        priceValue: 15.90
      },
      {
        id: '402',
        name: 'Smoothie de Frutas Vermelhas',
        image: 'https://images.unsplash.com/photo-1506802913710-40e2e66339c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Smoothie refrescante de frutas vermelhas com iogurte natural',
        price: 'R$12,50',
        priceValue: 12.50
      },
      {
        id: '403',
        name: 'Açaí com Mix de Frutas',
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Açaí com mix de frutas frescas, leite condensado e granola',
        price: 'R$19,90',
        priceValue: 19.90
      },
      {
        id: '404',
        name: 'Bowl Energia',
        image: 'https://images.unsplash.com/photo-1573590330099-d6c7355ec595?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
        description: 'Bowl energético com açaí, banana, morango, granola e pasta de amendoim',
        price: 'R$22,90',
        priceValue: 22.90
      }
    ]
  }
};

// Tipo para itens do carrinho
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
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  
  // Buscar os detalhes do restaurante com base no ID
  const restaurant = restaurantId ? restaurantsData[restaurantId as keyof typeof restaurantsData] : null;
  
  useEffect(() => {
    // Calcular o valor total sempre que cartItems mudar
    const newTotal = cartItems.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    setTotalValue(newTotal);
  }, [cartItems]);
  
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
      // Verificar se o item já está no carrinho
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Aumentar a quantidade se o item já estiver no carrinho
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Adicionar novo item ao carrinho
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
          // Diminuir a quantidade se houver mais de um
          updatedItems[existingItemIndex].quantity -= 1;
          return updatedItems;
        } else {
          // Remover o item se a quantidade for 1
          return prev.filter(item => item.id !== itemId);
        }
      }
      
      return prev;
    });
  };
  
  const handleFinishOrder = () => {
    if (cartItems.length === 0) {
      toast.error('Adicione itens ao carrinho primeiro');
      return;
    }
    
    // Armazenar o pedido no sessionStorage para usar na página de confirmação
    sessionStorage.setItem('currentOrder', JSON.stringify({
      restaurantName: restaurant.name,
      items: cartItems,
      totalValue: totalValue,
      orderNumber: `#${Math.floor(10000 + Math.random() * 90000)}`
    }));
    
    navigate('/confirm-order');
  };
  
  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Voltar</span>
            </button>
          </div>
          
          {/* Header do restaurante */}
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
            {/* Menu */}
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
            
            {/* Carrinho */}
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
