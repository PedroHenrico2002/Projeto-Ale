
/**
 * Funções utilitárias para o banco de dados
 */

// Gera um ID único para novas entidades
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Inicializa o banco de dados com dados de exemplo se estiver vazio
export const initializeDatabase = () => {
  // Importar dados de exemplo
  const { sampleUsers, sampleAddresses, sampleCategories, sampleRestaurants, sampleMenuItems } = require('./sampleData');
  
  // Verificar se os dados já existem e criar se necessário
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  
  if (!localStorage.getItem('addresses')) {
    localStorage.setItem('addresses', JSON.stringify(sampleAddresses));
  }
  
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(sampleCategories));
  }
  
  if (!localStorage.getItem('restaurants')) {
    localStorage.setItem('restaurants', JSON.stringify(sampleRestaurants));
    
    // Adicionar referências de endereço aos restaurantes
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
