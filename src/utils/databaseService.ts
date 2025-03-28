
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

// Generate a unique ID
// Moving this function up before it's used
const generateId = (): string => {
  // Function: Generate a random unique ID for new entities
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Sample data for initial population
const sampleRestaurants = [
  {
    id: '1',
    name: 'Doce Paixão',
    categoryId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Bolos',
    deliveryTime: '20-35 min',
    minOrder: 'R$5,90',
    rating: 4.9,
    addressId: '1'  // Adding addressId property
  },
  {
    id: '2',
    name: 'Restaurante Japonês',
    categoryId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japonesa',
    deliveryTime: '30-45 min',
    minOrder: 'R$25,00',
    rating: 4.9,
    addressId: '2'
  },
  {
    id: '3',
    name: 'Churrascaria Gaúcha',
    categoryId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Churrasco',
    deliveryTime: '35-50 min',
    minOrder: 'R$30,00',
    rating: 4.7,
    addressId: '3'
  },
  {
    id: '4',
    name: 'Comida Caseira',
    categoryId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1547928576-f8d1c7a1b709?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Brasileira',
    deliveryTime: '20-35 min',
    minOrder: 'R$12,90',
    rating: 4.5,
    addressId: '4'
  },
  {
    id: '6',
    name: 'Gelato Italiano',
    categoryId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Sorvetes e Gelatos Artesanais',
    deliveryTime: '15-30 min',
    minOrder: 'R$6,50',
    rating: 4.6,
    addressId: '6'
  },
  {
    id: '7',
    name: 'Confeitaria Doce Sonho',
    categoryId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Doces e Confeitaria',
    deliveryTime: '25-40 min',
    minOrder: 'R$7,50',
    rating: 4.8,
    addressId: '7'
  },
  {
    id: '8',
    name: 'Açaí Tropical',
    categoryId: '5',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Açaí e Smoothies Premium',
    deliveryTime: '20-35 min',
    minOrder: 'R$5,50',
    rating: 4.7,
    addressId: '8'
  }
];

// Sample menu items data
const sampleMenuItems = [
  // Doce Paixão
  { id: '101', restaurantId: '1', name: 'Bolo de Chocolate com Frutas', description: 'Delicioso bolo de chocolate decorado com frutas frescas', price: 29.9, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Sobremesas', rating: 4.8 },
  { id: '102', restaurantId: '1', name: 'Torta de Morango', description: 'Torta de morango com creme de baunilha e massa crocante', price: 27.5, imageUrl: 'https://images.unsplash.com/photo-1455268745580-72a73648e5e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Sobremesas', rating: 4.7 },
  { id: '103', restaurantId: '1', name: 'Cupcake de Red Velvet', description: 'Cupcake red velvet com cobertura de cream cheese', price: 8.9, imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Doces', rating: 4.9 },
  { id: '104', restaurantId: '1', name: 'Doces Variados', description: 'Caixa com 12 unidades de doces variados (brigadeiros, beijinhos e cajuzinhos)', price: 24.9, imageUrl: 'https://images.unsplash.com/photo-1581798459219-318e68f60ae5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Doces', rating: 4.6 },
  { id: '105', restaurantId: '1', name: 'Cheesecake de Frutas Vermelhas', description: 'Cheesecake cremoso com calda de frutas vermelhas e base de biscoito', price: 34.9, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Sobremesas', rating: 4.9 },
  
  // Restaurante Japonês
  { id: '201', restaurantId: '2', name: 'Combo Sushi Premium (30 peças)', description: 'Seleção de 30 peças com os melhores rolls, uramakis e niguiris do chef', price: 79.9, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Combos', rating: 4.9 },
  { id: '202', restaurantId: '2', name: 'Sashimi de Salmão (12 fatias)', description: 'Fatias frescas de salmão importado servidas com molho shoyu especial e wasabi', price: 45.9, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Sashimi', rating: 4.8 },
  { id: '203', restaurantId: '2', name: 'Temaki Especial', description: 'Temaki recheado com salmão, cream cheese, manga e cebolinha', price: 24.9, imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45625a9296d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Temaki', rating: 4.7 },
  { id: '204', restaurantId: '2', name: 'Yakisoba Tradicional', description: 'Macarrão oriental salteado com legumes frescos e tiras de frango ou carne (escolha na observação)', price: 38.9, imageUrl: 'https://images.unsplash.com/photo-1617421753170-46511a9d73bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Pratos Quentes', rating: 4.6 },
  { id: '205', restaurantId: '2', name: 'Gyoza (6 unidades)', description: 'Pastéis japoneses grelhados, recheados com carne de porco e legumes', price: 22.5, imageUrl: 'https://images.unsplash.com/photo-1625938145744-937239906491?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Entradas', rating: 4.7 },
  
  // Churrascaria Gaúcha
  { id: '301', restaurantId: '3', name: 'Picanha Premium (400g)', description: 'Corte nobre de picanha, grelhada no ponto desejado, acompanha farofa, vinagrete e pão de alho', price: 79.9, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Carnes', rating: 4.9 },
  { id: '302', restaurantId: '3', name: 'Costela Gaúcha (500g)', description: 'Costela bovina assada lentamente por 8 horas, extremamente macia, servida com mandioca cozida', price: 64.9, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Carnes', rating: 4.8 },
  
  // More menu items for other restaurants...
  { id: '401', restaurantId: '4', name: 'Feijoada Completa', description: 'Tradicional feijoada com carnes nobres, acompanha arroz, couve, farofa, laranja e torresmo', price: 36.9, imageUrl: 'https://images.unsplash.com/photo-1571809839227-b2ac3d261257?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Pratos Principais', rating: 4.8 },
  { id: '601', restaurantId: '6', name: 'Gelato de Pistache Tradicional', description: 'Gelato italiano autêntico de pistache, feito com ingredientes importados da Sicília', price: 18.9, imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Gelatos', rating: 4.9 },
  { id: '701', restaurantId: '7', name: 'Éclair de Chocolate', description: 'Massa choux crocante recheada com creme de chocolate belga e cobertura de ganache', price: 12.9, imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Doces Finos', rating: 4.7 },
  { id: '801', restaurantId: '8', name: 'Açaí Tradicional na Tigela', description: 'Açaí tradicional na tigela com banana, granola e mel orgânico', price: 15.9, imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80', category: 'Açaí', rating: 4.8 }
];

// Sample restaurant addresses
const sampleAddresses = [
  { 
    id: '1', 
    userId: 'system', 
    street: 'Av. Paulista', 
    number: '1500', 
    complement: 'Loja 25', 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '1',
    isRestaurantAddress: true
  },
  { 
    id: '2', 
    userId: 'system', 
    street: 'Rua Augusta', 
    number: '2200', 
    complement: 'Piso 2', 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '2',
    isRestaurantAddress: true
  },
  { 
    id: '3', 
    userId: 'system', 
    street: 'Av. Ipiranga', 
    number: '200', 
    complement: 'Térreo', 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '3',
    isRestaurantAddress: true
  },
  { 
    id: '4', 
    userId: 'system', 
    street: 'Rua Oscar Freire', 
    number: '498', 
    complement: 'Loja 10', 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '4',
    isRestaurantAddress: true
  },
  { 
    id: '6', 
    userId: 'system', 
    street: 'Av. Brigadeiro Faria Lima', 
    number: '2232', 
    complement: 'Loja 15', 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '6',
    isRestaurantAddress: true
  },
  { 
    id: '7', 
    userId: 'system', 
    street: 'Rua dos Pinheiros', 
    number: '320', 
    complement: null, 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '7',
    isRestaurantAddress: true
  },
  { 
    id: '8', 
    userId: 'system', 
    street: 'Alameda Santos', 
    number: '1293', 
    complement: 'Loja 22', 
    city: 'São Paulo', 
    isDefault: false,
    restaurantId: '8',
    isRestaurantAddress: true
  }
];

// Sample users
const sampleUsers = [
  {
    id: generateId(),
    name: 'Administrador',
    email: 'admin@belegendary.com',
    authType: 'email',
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Maria Silva',
    email: 'maria@example.com',
    authType: 'email',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: generateId(),
    name: 'João Santos',
    email: 'joao@example.com',
    authType: 'google',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: generateId(),
    name: 'Ana Oliveira',
    email: 'ana@example.com',
    authType: 'facebook',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  }
];

// Initialize database if it doesn't exist
const initializeDatabase = () => {
  // Function: Initialize the database with sample data if empty
  
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  
  if (!localStorage.getItem('addresses')) {
    localStorage.setItem('addresses', JSON.stringify(sampleAddresses));
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
    localStorage.setItem('restaurants', JSON.stringify(sampleRestaurants));
    
    // Add address references to restaurants
    const restaurants = sampleRestaurants;
    sampleAddresses.forEach(address => {
      if (address.restaurantId) {
        const restaurantIndex = restaurants.findIndex(r => r.id === address.restaurantId);
        if (restaurantIndex !== -1) {
          restaurants[restaurantIndex].addressId = address.id;
        }
      }
    });
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  }
  
  if (!localStorage.getItem('menuItems')) {
    localStorage.setItem('menuItems', JSON.stringify(sampleMenuItems));
  }
};

// Generic CRUD operations
const getAll = <T,>(entity: string): T[] => {
  // Function: Get all items of a specific entity type from localStorage
  initializeDatabase();
  return JSON.parse(localStorage.getItem(entity) || '[]');
};

const getById = <T,>(entity: string, id: string): T | undefined => {
  // Function: Get a specific item by ID from an entity collection
  const items = getAll<T>(entity);
  return (items as any[]).find(item => item.id === id);
};

const create = <T,>(entity: string, data: Omit<T, 'id'>): T => {
  // Function: Create a new item in an entity collection
  const items = getAll<T>(entity);
  const newItem = { ...data, id: generateId() } as T;
  localStorage.setItem(entity, JSON.stringify([...items, newItem]));
  return newItem;
};

const update = <T extends { id: string }>(entity: string, id: string, data: Partial<T>): T | undefined => {
  // Function: Update an existing item in an entity collection
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
  // Function: Remove an item from an entity collection
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
    // Function: Get all addresses for a specific user
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
    // Function: Get all menu items for a specific restaurant
    const menuItems = getAll<MenuItem>('menuItems');
    return menuItems.filter(item => item.restaurantId === restaurantId);
  },
  getById: (id: string) => getById<MenuItem>('menuItems', id),
  create: (data: Omit<MenuItem, 'id'>) => create<MenuItem>('menuItems', data),
  update: (id: string, data: Partial<MenuItem>) => update<MenuItem>('menuItems', id, data),
  remove: (id: string) => remove<MenuItem>('menuItems', id),
  
  // Filter functions
  filterByName: (name: string) => {
    // Function: Filter menu items by name
    const menuItems = getAll<MenuItem>('menuItems');
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  },
  
  sortAlphabetically: () => {
    // Function: Sort menu items alphabetically by name
    const menuItems = getAll<MenuItem>('menuItems');
    return [...menuItems].sort((a, b) => a.name.localeCompare(b.name));
  },
  
  sortByRating: () => {
    // Function: Sort menu items by rating (highest first)
    const menuItems = getAll<MenuItem>('menuItems');
    return [...menuItems].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};

// Initialize the database when the module is imported
initializeDatabase();
