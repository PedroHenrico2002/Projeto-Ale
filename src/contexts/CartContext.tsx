import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options?: {
    name: string;
    value: string | string[];
    price: number;
  }[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRestaurantId: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Check if adding from different restaurant
      if (prevItems.length > 0 && prevItems[0].restaurantId !== newItem.restaurantId) {
        toast.error('Você só pode pedir de um restaurante por vez. Limpe o carrinho para pedir de outro restaurante.');
        return prevItems;
      }

      // Check if item with same options already exists
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === newItem.id && 
        JSON.stringify(item.options) === JSON.stringify(newItem.options)
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        toast.success('Quantidade atualizada no carrinho!');
        return updatedItems;
      } else {
        // Add new item
        toast.success('Item adicionado ao carrinho!');
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => 
        !(item.id === id || item.id.startsWith(id + '_'))
      );
      toast.success('Item removido do carrinho!');
      return updatedItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Carrinho limpo!');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const optionsPrice = item.options?.reduce((optTotal, opt) => optTotal + opt.price, 0) || 0;
      return total + ((item.price + optionsPrice) * item.quantity);
    }, 0);
  };

  const getRestaurantId = () => {
    return items.length > 0 ? items[0].restaurantId : null;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getRestaurantId,
    }}>
      {children}
    </CartContext.Provider>
  );
};