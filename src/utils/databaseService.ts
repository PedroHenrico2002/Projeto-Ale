// Types for our entities
export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  authType: string;
  createdAt: string;
}

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

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

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

// Initialize database if it doesn't exist
const initializeDatabase = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('addresses')) {
    localStorage.setItem('addresses', JSON.stringify([]));
  }
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([
      { id: '1', name: 'Pizza', icon: '🍕' },
      { id: '2', name: 'Burger', icon: '🍔' },
      { id: '3', name: 'Sushi', icon: '🍣' },
      { id: '4', name: 'Salad', icon: '🥗' },
      { id: '5', name: 'Sobremesas', icon: '🍰' },
      { id: '6', name: 'Bebidas', icon: '🥤' }
    ]));
  }
  if (!localStorage.getItem('restaurants')) {
    localStorage.setItem('restaurants', JSON.stringify([]));
  }
  if (!localStorage.getItem('menuItems')) {
    localStorage.setItem('menuItems', JSON.stringify([]));
  }
};

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generic CRUD operations
const getAll = <T,>(entity: string): T[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(entity) || '[]');
};

const getById = <T,>(entity: string, id: string): T | undefined => {
  const items = getAll<T>(entity);
  return (items as any[]).find(item => item.id === id);
};

const create = <T,>(entity: string, data: Omit<T, 'id'>): T => {
  const items = getAll<T>(entity);
  const newItem = { ...data, id: generateId() } as T;
  localStorage.setItem(entity, JSON.stringify([...items, newItem]));
  return newItem;
};

const update = <T extends { id: string }>(entity: string, id: string, data: Partial<T>): T | undefined => {
  const items = getAll<T>(entity);
  const itemIndex = (items as any[]).findIndex(item => item.id === id);
  
  if (itemIndex === -1) return undefined;
  
  const updatedItem = { ...items[itemIndex], ...data };
  const updatedItems = [...items];
  updatedItems[itemIndex] = updatedItem;
  
  localStorage.setItem(entity, JSON.stringify(updatedItems));
  return updatedItem;
};

const remove = <T extends { id: string }>(entity: string, id: string): boolean => {
  const items = getAll<T>(entity);
  const filteredItems = (items as any[]).filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  localStorage.setItem(entity, JSON.stringify(filteredItems));
  return true;
};

// Specific entity operations
export const userService = {
  getAll: () => getAll<User>('users'),
  getById: (id: string) => getById<User>('users', id),
  create: (data: Omit<User, 'id'>) => create<User>('users', data),
  update: (id: string, data: Partial<User>) => update<User>('users', id, data),
  remove: (id: string) => remove<User>('users', id)
};

export const addressService = {
  getAll: () => getAll<Address>('addresses'),
  getByUserId: (userId: string) => {
    const addresses = getAll<Address>('addresses');
    return addresses.filter(address => address.userId === userId);
  },
  getById: (id: string) => getById<Address>('addresses', id),
  create: (data: Omit<Address, 'id'>) => create<Address>('addresses', data),
  update: (id: string, data: Partial<Address>) => update<Address>('addresses', id, data),
  remove: (id: string) => remove<Address>('addresses', id)
};

export const categoryService = {
  getAll: () => getAll<Category>('categories'),
  getById: (id: string) => getById<Category>('categories', id),
  create: (data: Omit<Category, 'id'>) => create<Category>('categories', data),
  update: (id: string, data: Partial<Category>) => update<Category>('categories', id, data),
  remove: (id: string) => remove<Category>('categories', id)
};

export const restaurantService = {
  getAll: () => getAll<Restaurant>('restaurants'),
  getById: (id: string) => getById<Restaurant>('restaurants', id),
  create: (data: Omit<Restaurant, 'id'>) => create<Restaurant>('restaurants', data),
  update: (id: string, data: Partial<Restaurant>) => update<Restaurant>('restaurants', id, data),
  remove: (id: string) => remove<Restaurant>('restaurants', id)
};

// Update menuItemService to include filtering
export const menuItemService = {
  getAll: () => getAll<MenuItem>('menuItems'),
  getByRestaurantId: (restaurantId: string) => {
    const menuItems = getAll<MenuItem>('menuItems');
    return menuItems.filter(item => item.restaurantId === restaurantId);
  },
  getById: (id: string) => getById<MenuItem>('menuItems', id),
  create: (data: Omit<MenuItem, 'id'>) => create<MenuItem>('menuItems', data),
  update: (id: string, data: Partial<MenuItem>) => update<MenuItem>('menuItems', id, data),
  remove: (id: string) => remove<MenuItem>('menuItems', id),
  
  // Filter functions
  filterByName: (name: string) => {
    const menuItems = getAll<MenuItem>('menuItems');
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  },
  
  sortAlphabetically: () => {
    const menuItems = getAll<MenuItem>('menuItems');
    return [...menuItems].sort((a, b) => a.name.localeCompare(b.name));
  },
  
  sortByRating: () => {
    const menuItems = getAll<MenuItem>('menuItems');
    return [...menuItems].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};

// Initialize the database when the module is imported
initializeDatabase();
