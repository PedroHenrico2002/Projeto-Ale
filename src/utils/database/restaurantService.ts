
/**
 * Serviço para gerenciamento de restaurantes
 */

import { Restaurant } from './types';
import { getAll, getById, create, update, remove } from './crudOperations';

// Exporta funções específicas para gerenciamento de restaurantes
export const restaurantService = {
  // Obtém todos os restaurantes
  getAll: () => getAll<Restaurant>('restaurants'),
  
  // Obtém um restaurante específico por ID
  getById: (id: string) => getById<Restaurant>('restaurants', id),
  
  // Cria um novo restaurante
  create: (data: Omit<Restaurant, 'id'>) => create<Restaurant>('restaurants', data),
  
  // Atualiza um restaurante existente
  update: (id: string, data: Partial<Restaurant>) => update<Restaurant>('restaurants', id, data),
  
  // Remove um restaurante
  remove: (id: string) => remove<Restaurant>('restaurants', id)
};
