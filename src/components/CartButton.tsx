import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartButton: React.FC = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <Button
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-14 w-14 shadow-lg"
      size="icon"
    >
      <div className="relative">
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </Button>
  );
};