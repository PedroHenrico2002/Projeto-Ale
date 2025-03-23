
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { RestaurantCard } from '@/components/RestaurantCard';
import { LocationSelector } from '@/components/LocationSelector';
import { Button } from '@/components/ui/button';
import { ChevronDown, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock data
const restaurants = [
  {
    id: '1',
    name: 'Burger Heaven',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'American, Burgers',
    rating: 4.8,
    deliveryTime: '15-25 min',
    minOrder: '$15',
    featured: true,
  },
  {
    id: '2',
    name: 'Pasta Paradise',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian, Pasta',
    rating: 4.7,
    deliveryTime: '25-35 min',
    minOrder: '$20',
  },
  {
    id: '3',
    name: 'Sushi Sensation',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japanese, Sushi',
    rating: 4.9,
    deliveryTime: '30-40 min',
    minOrder: '$25',
  },
  {
    id: '4',
    name: 'Veggie Delight',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Vegetarian, Healthy',
    rating: 4.6,
    deliveryTime: '20-30 min',
    minOrder: '$18',
  },
  {
    id: '5',
    name: 'Taco Express',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mexican, Tacos',
    rating: 4.5,
    deliveryTime: '15-25 min',
    minOrder: '$12',
  },
  {
    id: '6',
    name: 'Spice & Rice',
    image: 'https://images.unsplash.com/photo-1455279032140-49a3221378c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Indian, Curry',
    rating: 4.7,
    deliveryTime: '30-40 min',
    minOrder: '$22',
  },
];

const cuisineFilters = [
  'All',
  'American',
  'Italian',
  'Japanese',
  'Mexican',
  'Indian',
  'Vegetarian',
];

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Rating (high to low)' },
  { value: 'deliveryTime', label: 'Delivery time' },
  { value: 'minOrder', label: 'Minimum order' },
];

const Restaurants: React.FC = () => {
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [showFilters, setShowFilters] = useState(false);

  const handleLocationSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    toast.success('Delivery location updated!');
  };

  // Filter restaurants based on search query and active filter
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || 
                          restaurant.cuisine.toLowerCase().includes(activeFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / Filters */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
              <LocationSelector onSelectLocation={handleLocationSelect} />
              
              {/* Filter Section - Mobile Toggle */}
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    <span>Filters & Sort</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
                
                {showFilters && (
                  <div className="mt-4 p-4 bg-card rounded-xl border border-border animate-fade-in">
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Sort By</h3>
                      <div className="space-y-2">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                              selectedSort.value === option.value 
                                ? 'bg-accent/10 text-accent font-medium' 
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedSort(option)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Cuisine</h3>
                      <div className="flex flex-wrap gap-2">
                        {cuisineFilters.map((filter) => (
                          <button
                            key={filter}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              activeFilter === filter 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                            onClick={() => setActiveFilter(filter)}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Desktop Filters */}
              <div className="hidden md:block space-y-6">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-medium mb-4">Sort By</h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedSort.value === option.value 
                            ? 'bg-accent/10 text-accent font-medium' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedSort(option)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-medium mb-4">Cuisine</h3>
                  <div className="space-y-2">
                    {cuisineFilters.map((filter) => (
                      <button
                        key={filter}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === filter 
                            ? 'bg-accent/10 text-accent font-medium' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content / Restaurant listings */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="heading-lg mb-2">Restaurants</h1>
                <p className="text-muted-foreground mb-4">
                  {address 
                    ? `Delivering to: ${address.split(',')[0]}...` 
                    : 'Enter your address to see delivery options'}
                </p>
                
                {/* Search bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search restaurants or cuisines"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
                
                {/* Mobile filters chip bar */}
                <div className="mt-4 flex md:hidden items-center gap-2 overflow-x-auto pb-2">
                  <button
                    className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full border border-input bg-card"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal size={14} />
                    <span className="text-sm">Filters</span>
                  </button>
                  
                  {cuisineFilters.map((filter) => (
                    <button
                      key={filter}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm ${
                        activeFilter === filter 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Results */}
              {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      id={restaurant.id}
                      name={restaurant.name}
                      image={restaurant.image}
                      cuisine={restaurant.cuisine}
                      rating={restaurant.rating}
                      deliveryTime={restaurant.deliveryTime}
                      minOrder={restaurant.minOrder}
                      featured={restaurant.featured}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('All');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Restaurants;
