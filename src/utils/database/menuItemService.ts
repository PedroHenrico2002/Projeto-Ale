
/**
 * Serviço para gerenciamento de itens do cardápio
 */

import { MenuItem } from './types'; // Importa o tipo de dados de item de menu
import { getAll, getById, create, update, remove } from './crudOperations'; // Importa operações CRUD genéricas

// Exporta funções específicas para gerenciamento de itens do cardápio
export const menuItemService = {
  // Obtém todos os itens do cardápio
  getAll: () => getAll<MenuItem>('menuItems'), // Busca todos os itens de menu no banco de dados
  
  // Obtém todos os itens do cardápio de um restaurante específico
  getByRestaurantId: (restaurantId: string) => {
    const menuItems = getAll<MenuItem>('menuItems'); // Busca todos os itens de menu
    return menuItems.filter(item => item.restaurantId === restaurantId); // Filtra apenas os itens do restaurante específico
  },
  
  // Obtém um item do cardápio específico por ID
  getById: (id: string) => getById<MenuItem>('menuItems', id), // Busca um item de menu pelo ID
  
  // Cria um novo item do cardápio
  create: (data: Omit<MenuItem, 'id'>) => create<MenuItem>('menuItems', data), // Cria um novo item de menu no banco de dados
  
  // Atualiza um item do cardápio existente
  update: (id: string, data: Partial<MenuItem>) => update<MenuItem>('menuItems', id, data), // Atualiza um item de menu existente
  
  // Remove um item do cardápio
  remove: (id: string) => remove<MenuItem>('menuItems', id), // Remove um item de menu do banco de dados
  
  // Filtra itens do cardápio por nome
  filterByName: (name: string) => {
    const menuItems = getAll<MenuItem>('menuItems'); // Busca todos os itens de menu
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase()) // Filtra itens cujo nome contém o texto de busca (case insensitive)
    );
  },
  
  // Ordena itens do cardápio alfabeticamente por nome
  sortAlphabetically: () => {
    const menuItems = getAll<MenuItem>('menuItems'); // Busca todos os itens de menu
    return [...menuItems].sort((a, b) => a.name.localeCompare(b.name)); // Ordena alfabeticamente pelo nome
  },
  
  // Ordena itens do cardápio por avaliação (maior primeiro)
  sortByRating: () => {
    const menuItems = getAll<MenuItem>('menuItems'); // Busca todos os itens de menu
    return [...menuItems].sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Ordena pela avaliação (maior para menor)
  }
};
