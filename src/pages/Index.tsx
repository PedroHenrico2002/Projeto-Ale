import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/supabaseService';

// Categorias
const categories = [
  {
    id: 'restaurants',
    name: 'Restaurantes',
    icon: (
      <div className="bg-orange-500 rounded-lg p-3 w-16 h-16 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
          <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zm2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5z"/>
        </svg>
      </div>
    ),
    link: '/restaurants?category=restaurants'
  },
  {
    id: 'desserts',
    name: 'Sobremesa',
    icon: (
      <div className="bg-pink-500 rounded-lg p-3 w-16 h-16 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
          <path d="M6 1a1.5 1.5 0 0 0-1.5 1.5H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1.5A1.5 1.5 0 0 0 10 1H6ZM5 3h6a1 1 0 0 1 1 1v1.5H4V4a1 1 0 0 1 1-1Zm7 6.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5ZM8 8v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5Zm-3 0v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5Zm8 1.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5ZM8 11v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5Zm-3 0v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5Z"/>
        </svg>
      </div>
    ),
    link: '/restaurants?category=desserts'
  }
];

// Restaurantes principais
const mainRestaurants = [
  {
    id: '2',
    name: 'Restaurante Japonês',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japonesa',
    rating: 4.9,
    deliveryTime: '30-45 min',
    minOrder: 'R$25,00',
  },
  {
    id: '3',
    name: 'Churrascaria Gaúcha',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Churrasco',
    rating: 4.7,
    deliveryTime: '35-50 min',
    minOrder: 'R$30,00',
  },
  {
    id: '4',
    name: 'Comida Caseira',
    image: 'https://images.unsplash.com/photo-1547928576-f8d1c7a1b709?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Brasileira',
    rating: 4.5,
    deliveryTime: '20-35 min',
    minOrder: 'R$12,90',
  },
];

// Restaurantes de sobremesa
const dessertRestaurants = [
  {
    id: '1',
    name: 'Doce Paixão',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Bolos',
    rating: 4.9,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,90',
    featured: true,
  },
  {
    id: '7',
    name: 'Confeitaria Doce Sonho',
    image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Confeitaria',
    rating: 4.8,
    deliveryTime: '25-40 min',
    minOrder: 'R$7,50',
  },
  {
    id: '6',
    name: 'Gelato Italiano',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Sorvetes e Gelatos',
    rating: 4.6,
    deliveryTime: '15-30 min',
    minOrder: 'R$6,50',
  },
  {
    id: '8',
    name: 'Açaí Tropical',
    image: 'https://images.unsplash.com/photo-1502825751399-28baa9b81995?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Açaí e Smoothies',
    rating: 4.7,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,50',
  },
];

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await profileService.getProfile(user.id);
          setUserName(profile.display_name || profile.name);
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          setUserName(user.email?.split('@')[0] || 'Usuário');
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          {/* Welcome Message */}
          {user && userName && (
            <div className="mb-6 p-4 glass-effect rounded-lg border border-primary/20">
              <h2 className="text-lg font-medium text-primary">Bem-vindo, {userName}!</h2>
              <p className="text-sm text-muted-foreground">O que você deseja pedir hoje?</p>
            </div>
          )}
          
          {/* Auth Call to Action */}
          {!user && !loading && (
            <div className="mb-6 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
              <h2 className="text-xl font-semibold text-primary mb-2">Crie sua conta personalizada</h2>
              <p className="text-muted-foreground mb-4">Faça login para ter acesso completo aos restaurantes e criar seu ambiente personalizado</p>
              <Link 
                to="/auth" 
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Entrar ou Criar Conta
              </Link>
            </div>
          )}
          
          {/* Categories */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={category.link}
                className="flex flex-col items-center"
              >
                {category.icon}
                <span className="mt-2 text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Restaurants Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Restaurantes</h2>
              <Link to="/restaurants" className="text-sm text-red-600">
                Ver todos
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {mainRestaurants.slice(0, 2).map((restaurant) => (
                <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="block">
                  <div className="flex items-center border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-gray-200">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                      <div className="flex items-center text-yellow-500 text-sm">
                        <span className="mr-1">★</span>
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{restaurant.deliveryTime}</span>
                        <span>{restaurant.minOrder}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Sobremesa Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Sobremesa</h2>
              <Link to="/restaurants" className="text-sm text-red-600">
                Ver todos
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {dessertRestaurants.slice(0, 2).map((restaurant) => (
                <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="block">
                  <div className="flex items-center border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 bg-gray-200">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                      <div className="flex items-center text-yellow-500 text-sm">
                        <span className="mr-1">★</span>
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{restaurant.deliveryTime}</span>
                        <span>{restaurant.minOrder}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
