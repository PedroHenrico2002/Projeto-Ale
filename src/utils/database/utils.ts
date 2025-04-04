
/**
 * Funções utilitárias para o banco de dados
 */

import { sampleUsers, sampleAddresses, sampleCategories, sampleRestaurants, sampleMenuItems } from './sampleData'; // Importa dados de exemplo

// Gera um ID único para novas entidades
export const generateId = (): string => {
  // Cria um ID aleatório baseado em caracteres alfanuméricos
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Inicializa o banco de dados com dados de exemplo se estiver vazio
export const initializeDatabase = () => {
  // Verificar se os dados já existem e criar se necessário
  if (!localStorage.getItem('users')) {
    // Se não existir dados de usuários, adiciona os dados de exemplo ao localStorage
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  
  if (!localStorage.getItem('addresses')) {
    // Se não existir dados de endereços, adiciona os dados de exemplo ao localStorage
    localStorage.setItem('addresses', JSON.stringify(sampleAddresses));
  }
  
  if (!localStorage.getItem('categories')) {
    // Se não existir dados de categorias, adiciona os dados de exemplo ao localStorage
    localStorage.setItem('categories', JSON.stringify(sampleCategories));
  }
  
  if (!localStorage.getItem('restaurants')) {
    // Se não existir dados de restaurantes, adiciona os dados de exemplo ao localStorage
    localStorage.setItem('restaurants', JSON.stringify(sampleRestaurants));
    
    // Adicionar referências de endereço aos restaurantes
    const restaurants = sampleRestaurants;
    // Itera sobre cada endereço para vincular ao restaurante correspondente
    sampleAddresses.forEach(address => {
      if (address.restaurantId) {
        // Encontra o índice do restaurante que corresponde ao endereço
        const restaurantIndex = restaurants.findIndex(r => r.id === address.restaurantId);
        if (restaurantIndex !== -1) {
          // Atualiza o restaurante com a referência ao endereço
          restaurants[restaurantIndex].addressId = address.id;
        }
      }
    });
    // Salva os restaurantes atualizados no localStorage
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  }
  
  if (!localStorage.getItem('menuItems')) {
    // Se não existir dados de itens de menu, adiciona os dados de exemplo ao localStorage
    localStorage.setItem('menuItems', JSON.stringify(sampleMenuItems));
  }
  
  // Exibe mensagem de sucesso no console
  console.log('Banco de dados inicializado com sucesso!');
};
