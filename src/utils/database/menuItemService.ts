
/**
 * Serviço para gerenciamento de itens do cardápio
 */

import { MenuItem } from './types';
import { getAll, getById, create, update, remove } from './crudOperations';

// Exporta funções específicas para gerenciamento de itens do cardápio
export const menuItemService = {
  // Obtém todos os itens do cardápio
  getAll: () => getAll<MenuItem>('menuItems'),
  
  // Obtém todos os itens do cardápio de um restaurante específico
  getByRestaurantId: (restaurantId: string) => {
    const menuItems = getAll<MenuItem>('menuItems');
    return menuItems.filter(item => item.restaurantId === restaurantId);
  },
  
  // Obtém um item do cardápio específico por ID
  getById: (id: string) => getById<MenuItem>('menuItems', id),
  
  // Cria um novo item do cardápio
  create: (data: Omit<MenuItem, 'id'>) => create<MenuItem>('menuItems', data),
  
  // Atualiza um item do cardápio existente
  update: (id: string, data: Partial<MenuItem>) => update<MenuItem>('menuItems', id, data),
  
  // Remove um item do cardápio
  remove: (id: string) => remove<MenuItem>('menuItems', id),
  
  // Filtra itens do cardápio por nome
  filterByName: (name: string) => {
    const menuItems = getAll<MenuItem>('menuItems');
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  },
  
  // Ordena itens do cardápio alfabeticamente por nome
  sortAlphabetically: () => {
    const menuItems = getAll<MenuItem>('menuItems');
    return [...menuItems].sort((a, b) => a.name.localeCompare(b.name));
  },
  
  // Ordena itens do cardápio por avaliação (maior primeiro)
  sortByRating: () => {
    const menuItems = getAll<MenuItem>('menuItems');
    return [...menuItems].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};
