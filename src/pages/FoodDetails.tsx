import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Star, Clock, Store, ChevronLeft } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useCart } from '@/contexts/CartContext';

// Mock data
const foodDetails = {
  id: '1',
  restaurantId: '1',
  name: 'Legendary Burger',
  images: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
  ],
  description: 'Our signature burger with a juicy Angus beef patty, melted cheddar cheese, crispy bacon, fresh lettuce, tomato, onions, and our special sauce on a toasted brioche bun. Served with a side of crispy fries.',
  price: '$12.99',
  rating: 4.8,
  reviewCount: 256,
  options: [
    {
      name: 'Size',
      type: 'single',
      choices: [
        { id: 'regular', name: 'Regular', price: '$0.00' },
        { id: 'large', name: 'Large', price: '+$3.00' },
      ],
    },
    {
      name: 'Extras',
      type: 'multiple',
      choices: [
        { id: 'cheese', name: 'Extra Cheese', price: '+$1.50' },
        { id: 'bacon', name: 'Extra Bacon', price: '+$2.00' },
        { id: 'avocado', name: 'Avocado', price: '+$1.50' },
      ],
    },
  ],
  restaurant: {
    name: 'Burger Heaven',
    deliveryTime: '15-25 min',
  },
};

const FoodDetails: React.FC = () => {
  const { restaurantId, foodId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({
    Size: 'regular',
    Extras: [],
  });
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleSingleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionName]: value,
    });
  };
  
  const handleMultipleOptionChange = (optionName: string, value: string) => {
    const currentSelections = selectedOptions[optionName] as string[] || [];
    
    if (currentSelections.includes(value)) {
      setSelectedOptions({
        ...selectedOptions,
        [optionName]: currentSelections.filter(item => item !== value),
      });
    } else {
      setSelectedOptions({
        ...selectedOptions,
        [optionName]: [...currentSelections, value],
      });
    }
  };
  
  const addToCart = () => {
    const selectedOptionsForCart = foodDetails.options.map(option => ({
      name: option.name,
      value: selectedOptions[option.name],
      price: option.type === 'single' 
        ? parseFloat(option.choices.find(c => c.id === selectedOptions[option.name])?.price.replace(/[^0-9.]/g, '') || '0')
        : (selectedOptions[option.name] as string[]).reduce((total, choiceId) => {
            const choice = option.choices.find(c => c.id === choiceId);
            return total + parseFloat(choice?.price.replace(/[^0-9.]/g, '') || '0');
          }, 0)
    }));

    const itemToAdd = {
      id: `${foodDetails.id}_${Date.now()}`, // Unique ID for cart item
      restaurantId: foodDetails.restaurantId,
      restaurantName: foodDetails.restaurant.name,
      name: foodDetails.name,
      image: foodDetails.images[0],
      price: parseFloat(foodDetails.price.replace(/[^0-9.]/g, '')),
      options: selectedOptionsForCart
    };

    addItem(itemToAdd);
  };
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              <span>Back</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-muted rounded-xl overflow-hidden aspect-[4/3] animate-fade-in">
                <img 
                  src={foodDetails.images[activeImage]} 
                  alt={foodDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {foodDetails.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${foodDetails.name} view ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="heading-lg mb-2">{foodDetails.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium mr-1">{foodDetails.rating}</span>
                    <span className="text-muted-foreground">({foodDetails.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Store size={14} className="mr-1" />
                    <span>{foodDetails.restaurant.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock size={14} className="mr-1" />
                  <span>Delivery in {foodDetails.restaurant.deliveryTime}</span>
                </div>
                
                <p className="text-muted-foreground">{foodDetails.description}</p>
              </div>
              
              {/* Options */}
              <div className="space-y-6">
                {foodDetails.options.map((option) => (
                  <div key={option.name} className="space-y-3">
                    <h3 className="font-medium">{option.name}</h3>
                    
                    <div className="space-y-2">
                      {option.choices.map((choice) => (
                        <label 
                          key={choice.id}
                          className="flex items-center justify-between p-3 rounded-md border border-input hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center">
                            {option.type === 'single' ? (
                              <input 
                                type="radio" 
                                name={option.name}
                                checked={(selectedOptions[option.name] as string) === choice.id}
                                onChange={() => handleSingleOptionChange(option.name, choice.id)}
                                className="mr-3 h-4 w-4 text-accent"
                              />
                            ) : (
                              <input 
                                type="checkbox" 
                                checked={(selectedOptions[option.name] as string[])?.includes(choice.id) || false}
                                onChange={() => handleMultipleOptionChange(option.name, choice.id)}
                                className="mr-3 h-4 w-4 text-accent"
                              />
                            )}
                            <span>{choice.name}</span>
                          </div>
                          <span className="text-muted-foreground">{choice.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quantity and Add to Cart */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-9 w-9 rounded-full"
                    >
                      <Minus size={16} />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={increaseQuantity}
                      className="h-9 w-9 rounded-full"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
                    onClick={addToCart}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart • {foodDetails.price}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FoodDetails;
