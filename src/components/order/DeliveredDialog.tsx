
import React, { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeliveredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRateOrder: (rating: number) => void;
}

const DeliveredDialog: React.FC<DeliveredDialogProps> = ({ 
  open, 
  onOpenChange, 
  onRateOrder 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  const handleRateOrder = () => {
    if (rating === 0) return;
    onRateOrder(rating);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Pedido Entregue!</DialogTitle>
          <DialogDescription className="text-center">
            Seu pedido foi entregue com sucesso.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        
        <div className="text-center mb-4">
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
        </div>
        
        <DialogFooter>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleRateOrder}
            disabled={rating === 0}
          >
            Confirmar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveredDialog;
