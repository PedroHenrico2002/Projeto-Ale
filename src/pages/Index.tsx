
import React from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FoodCard } from '@/components/FoodCard';
import { ArrowRight, Clock, Leaf, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

// Mock data
const featuredRestaurants = [
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
];

const popularFoods = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Legendary Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    description: 'Angus beef patty, special sauce, lettuce, cheese, pickles, onions on a brioche bun',
    price: '$12.99',
    popular: true,
  },
  {
    id: '2',
    restaurantId: '3',
    name: 'Dragon Roll',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    description: 'Eel, cucumber, avocado, topped with thinly sliced avocado and sweet sauce',
    price: '$15.99',
    popular: true,
  },
  {
    id: '3',
    restaurantId: '2',
    name: 'Fettuccine Alfredo',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    description: 'Fresh fettuccine tossed with butter and Parmesan cheese',
    price: '$14.99',
    popular: true,
  },
];

const Index: React.FC = () => {
  const handleAddToCart = () => {
    toast.success('Item added to cart!');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="section-padding bg-secondary/50">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center text-center animate-fade-in">
              <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Clock size={28} />
              </div>
              <h3 className="font-medium text-xl mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your food delivered in under 30 minutes, or the delivery is free.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center text-center animate-fade-in delay-100">
              <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Leaf size={28} />
              </div>
              <h3 className="font-medium text-xl mb-2">Fresh Food</h3>
              <p className="text-muted-foreground">
                We only work with the best restaurants that use fresh ingredients.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center text-center animate-fade-in delay-200">
              <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                <ThumbsUp size={28} />
              </div>
              <h3 className="font-medium text-xl mb-2">Quality Service</h3>
              <p className="text-muted-foreground">
                Dedicated customer support to assist you with any concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants Section */}
      <section className="section-padding">
        <div className="page-container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="heading-lg mb-2">Featured Restaurants</h2>
              <p className="text-muted-foreground">
                Discover the best restaurants in your area
              </p>
            </div>
            
            <Link to="/restaurants">
              <Button variant="ghost" className="flex items-center gap-1">
                <span>View All</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredRestaurants.map((restaurant) => (
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
        </div>
      </section>
      
      {/* Popular Food Section */}
      <section className="section-padding bg-muted/50">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="heading-lg mb-4">Popular Right Now</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The most ordered items and dishes from top restaurants
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {popularFoods.map((food) => (
              <FoodCard
                key={food.id}
                id={food.id}
                restaurantId={food.restaurantId}
                name={food.name}
                image={food.image}
                description={food.description}
                price={food.price}
                popular={food.popular}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* App Download Section */}
      <section className="section-padding bg-accent/5">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                Download Our App
              </div>
              
              <h2 className="heading-lg">
                Get the Full Experience on Your Mobile
              </h2>
              
              <p className="text-muted-foreground">
                Order food, track your delivery in real-time, and receive exclusive app-only offers.
                Download the LegendaryFood app today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  App Store
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                >
                  Google Play
                </Button>
              </div>
            </div>
            
            <div className="relative max-w-md mx-auto">
              <div className="relative z-10 animate-slide-up">
                <img
                  src="https://images.unsplash.com/photo-1592832122594-caa13e6ee76f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                  alt="Mobile app"
                  className="rounded-xl shadow-xl"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full bg-accent/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
