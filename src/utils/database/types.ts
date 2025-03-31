
/**
 * Definições de tipos para as entidades do banco de dados
 */

// Tipo para usuário
export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  authType: string;
  createdAt: string;
}

// Tipo para endereço
export interface Address {
  id: string;
  userId: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  isDefault: boolean;
  restaurantId?: string;
  isRestaurantAddress?: boolean;
}

// Tipo para categoria
export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// Tipo para restaurante
export interface Restaurant {
  id: string;
  name: string;
  categoryId: string;
  imageUrl?: string;
  cuisine?: string;
  deliveryTime?: string;
  minOrder?: string;
  rating?: number;
  addressId?: string;
}

// Tipo para item do cardápio
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
}
