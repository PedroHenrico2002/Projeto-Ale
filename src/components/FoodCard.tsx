
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  id: string;
  restaurantId: string;
  name: string;
  image: string;
  description: string;
  price: string;
  popular?: boolean;
  onAddToCart?: () => void;
  className?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  id,
  restaurantId,
  name,
  image,
  description,
  price,
  popular = false,
  onAddToCart,
  className,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart();
  };

  return (
    <Link 
      to={`/food/${restaurantId}/${id}`}
      className={cn(
        "group flex flex-col bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 hover:shadow-lg hover:border-accent/20 animate-fade-in",
        className
      )}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {popular && (
          <div className="absolute top-3 left-3 bg-accent/90 text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
            Popular
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <h3 className="font-medium text-lg mb-1 group-hover:text-accent transition-colors">
          {name}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-semibold">{price}</span>
          
          <Button
            size="sm"
            className="rounded-full h-9 w-9 p-0 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleAddToCart}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </Link>
  );
};
