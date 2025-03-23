
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative bg-gradient-to-b from-primary/5 to-background pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="page-container">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in">
            Fast Delivery in 30 Minutes
          </div>
          
          <h1 className="heading-xl mb-6">
            Get Your Favorite Food Delivered to Your Doorstep
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Order from the best local restaurants with easy, on-demand delivery. 
            Enjoy your favorite meals from the comfort of your home.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Enter your address"
                className="pl-10 pr-4 py-3 rounded-lg w-full sm:w-80 bg-background border border-input focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => navigate('/restaurants')}
            >
              Find Food
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="font-bold text-foreground mr-2">500+</span> 
              <span>Restaurants</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-foreground mr-2">30k+</span> 
              <span>Active Users</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-foreground mr-2">15k+</span> 
              <span>Food Items</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
    </section>
  );
};
