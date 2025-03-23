
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: string;
  featured?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  minOrder,
  featured = false,
}) => {
  return (
    <Link 
      to={`/restaurants/${id}`} 
      className={cn(
        "group block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-card animate-scale-in",
        featured ? "border-2 border-accent shadow-lg" : "border border-border hover:border-accent/50"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-accent/90 text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-1 group-hover:text-accent transition-colors">
            {name}
          </h3>
          <div className="flex items-center space-x-1 bg-secondary rounded-full px-2 py-0.5">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3">{cuisine}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock size={14} className="mr-1" />
            <span>{deliveryTime}</span>
          </div>
          <div className="text-muted-foreground">
            Min. {minOrder}
          </div>
        </div>
      </div>
    </Link>
  );
};
