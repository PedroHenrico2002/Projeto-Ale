
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderRatingProps {
  isDelivered: boolean;
  currentRating?: number;
  onRateOrder: (rating: number) => void;
}

const OrderRating: React.FC<OrderRatingProps> = ({ 
  isDelivered, 
  currentRating, 
  onRateOrder
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  if (!isDelivered) {
    return null;
  }
  
  if (currentRating) {
    return (
      <div className="bg-white rounded-lg border p-4 text-center">
        <h3 className="font-semibold mb-2">Sua Avaliação:</h3>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              size={32}
              className={`${
                currentRating >= star 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-gray-600">Obrigado pela sua avaliação!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border p-4 text-center">
      <h3 className="font-semibold mb-2">Avaliar Restaurante:</h3>
      <div className="flex justify-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            size={32}
            className={`cursor-pointer transition-colors ${
              (hoverRating || rating) >= star 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
      </div>
      <Button 
        onClick={() => onRateOrder(rating)}
        disabled={rating === 0}
        className={`${rating === 0 ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'} text-white`}
      >
        Enviar Avaliação
      </Button>
    </div>
  );
};

export default OrderRating;
