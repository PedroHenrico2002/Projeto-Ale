
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { LocationSelector } from '@/components/LocationSelector';
import { Button } from '@/components/ui/button';
import { ChevronDown, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from '@/lib/toast';

// Dados simulados
const restaurants = [
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
    id: '2',
    name: 'Gelato Italiano',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Sorvetes e Gelatos',
    rating: 4.6,
    deliveryTime: '15-30 min',
    minOrder: 'R$6,50',
  },
  {
    id: '3',
    name: 'Confeitaria Doce Sonho',
    image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Confeitaria',
    rating: 4.8,
    deliveryTime: '25-40 min',
    minOrder: 'R$7,50',
  },
  {
    id: '4',
    name: 'Açaí Tropical',
    image: 'https://images.unsplash.com/photo-1502825751399-28baa9b81995?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Açaí e Smoothies',
    rating: 4.7,
    deliveryTime: '20-35 min',
    minOrder: 'R$5,50',
  },
];

const cuisineFilters = [
  'Todos',
  'Doces',
  'Sorvetes',
  'Bolos',
  'Açaí',
  'Confeitaria',
];

const sortOptions = [
  { value: 'recommended', label: 'Recomendados' },
  { value: 'rating', label: 'Avaliação (maior para menor)' },
  { value: 'deliveryTime', label: 'Tempo de entrega' },
  { value: 'minOrder', label: 'Pedido mínimo' },
];

const Restaurants: React.FC = () => {
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [showFilters, setShowFilters] = useState(false);

  const handleLocationSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    toast.success('Local de entrega atualizado!');
  };

  // Filtrar restaurantes com base na consulta de pesquisa e filtro ativo
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'Todos' || 
                        restaurant.cuisine.toLowerCase().includes(activeFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          <section>
            <h2 className="text-xl font-bold mb-6">Sobremesa</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="block">
                  <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                    <div className="w-20 h-20 bg-gray-200">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-medium">{restaurant.name}</h3>
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

export default Restaurants;
