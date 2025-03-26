import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowDownAZ, Star, TrendingUp } from 'lucide-react';
import { toast } from '@/lib/toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Dados simulados
const restaurants = [
  {
    id: '1',
    name: 'Restaurante Italiano',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italiana',
    rating: 4.8,
    deliveryTime: '25-40 min',
    minOrder: 'R$15,90',
    featured: true,
    orderCount: 120,
    category: 'restaurants'
  },
  {
    id: '2',
    name: 'Restaurante Japonês',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japonesa',
    rating: 4.9,
    deliveryTime: '30-45 min',
    minOrder: 'R$25,00',
    orderCount: 98,
    category: 'restaurants'
  },
  {
    id: '3',
    name: 'Churrascaria Gaúcha',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Churrasco',
    rating: 4.7,
    deliveryTime: '35-50 min',
    minOrder: 'R$30,00',
    orderCount: 76,
    category: 'restaurants'
  },
  {
    id: '4',
    name: 'Comida Caseira',
    image: 'https://images.unsplash.com/photo-1547928576-f8d1c7a1b709?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Brasileira',
    rating: 4.5,
    deliveryTime: '20-35 min',
    minOrder: 'R$12,90',
    orderCount: 145,
    category: 'restaurants'
  },
];

// Sobremesas (enhanced images and data)
const dessertRestaurants = [
  {
    id: '5',
    name: 'Doce Paixão',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Bolos',
    rating: 4.9,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,90',
    featured: true,
    orderCount: 110,
    category: 'desserts'
  },
  {
    id: '6',
    name: 'Gelato Italiano',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Sorvetes e Gelatos Artesanais',
    rating: 4.6,
    deliveryTime: '15-30 min',
    minOrder: 'R$6,50',
    orderCount: 85,
    category: 'desserts',
    featured: true
  },
  {
    id: '7',
    name: 'Confeitaria Doce Sonho',
    image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Confeitaria',
    rating: 4.8,
    deliveryTime: '25-40 min',
    minOrder: 'R$7,50',
    orderCount: 65,
    category: 'desserts'
  },
  {
    id: '8',
    name: 'Açaí Tropical',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Açaí e Smoothies Premium',
    rating: 4.7,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,50',
    orderCount: 92,
    category: 'desserts',
    featured: true
  },
];

const cuisineFilters = [
  'Todos',
  'Italiana',
  'Japonesa',
  'Churrasco',
  'Brasileira',
  'Doces',
  'Sorvetes',
  'Confeitaria',
  'Açaí',
];

// Combine both arrays
const allRestaurants = [...restaurants, ...dessertRestaurants];

const Restaurants: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [sortOption, setSortOption] = useState<'name' | 'rating' | 'orderCount'>('name');
  const [displayedRestaurants, setDisplayedRestaurants] = useState(allRestaurants);
  
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    // First filter by category
    let filteredByCategory = allRestaurants;
    
    if (categoryParam) {
      filteredByCategory = allRestaurants.filter(r => r.category === categoryParam);
    }
    
    // Then apply search filter
    const filtered = filteredByCategory.filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'rating') {
        return b.rating - a.rating;
      } else if (sortOption === 'orderCount') {
        return b.orderCount - a.orderCount;
      }
      return 0;
    });
    
    setDisplayedRestaurants(sorted);
  }, [searchQuery, activeFilter, sortOption, categoryParam]);

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          {/* Search and filters */}
          <div className="mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center text-sm">
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortOption('name')} className="flex items-center">
                    <ArrowDownAZ size={16} className="mr-2" />
                    <span>A-Z</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('rating')} className="flex items-center">
                    <Star size={16} className="mr-2" />
                    <span>Avaliação</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('orderCount')} className="flex items-center">
                    <TrendingUp size={16} className="mr-2" />
                    <span>Mais pedidos</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Category Filters */}
              {categoryParam !== 'desserts' && categoryParam !== 'restaurants' && (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/restaurants?category=restaurants" 
                    className={`text-sm px-3 py-1 rounded-full ${
                      categoryParam === 'restaurants' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Restaurantes
                  </Link>
                  <Link 
                    to="/restaurants?category=desserts" 
                    className={`text-sm px-3 py-1 rounded-full ${
                      categoryParam === 'desserts' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Sobremesas
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Restaurant/Dessert Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-6">
              {categoryParam === 'desserts' ? 'Sobremesas' : 
               categoryParam === 'restaurants' ? 'Restaurantes' : 
               'Todos os Estabelecimentos'}
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {displayedRestaurants.length > 0 ? (
                displayedRestaurants.map((restaurant) => (
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
                ))
              ) : (
                <p className="text-center text-gray-500 my-8">Nenhum resultado encontrado.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Restaurants;
