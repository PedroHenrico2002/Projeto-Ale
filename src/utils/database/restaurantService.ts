
/**
 * Serviço para gerenciamento de restaurantes
 */

import { Restaurant } from './types'; // Importa o tipo de dados de restaurante
import { getAll, getById, create, update, remove } from './crudOperations'; // Importa operações CRUD genéricas

// Exporta funções específicas para gerenciamento de restaurantes
export const restaurantService = {
  // Obtém todos os restaurantes
  getAll: () => getAll<Restaurant>('restaurants'), // Busca todos os restaurantes no banco de dados
  
  // Obtém um restaurante específico por ID
  getById: (id: string) => getById<Restaurant>('restaurants', id), // Busca um restaurante pelo ID
  
  // Cria um novo restaurante
  create: (data: Omit<Restaurant, 'id'>) => create<Restaurant>('restaurants', data), // Cria um novo restaurante no banco de dados
  
  // Atualiza um restaurante existente
  update: (id: string, data: Partial<Restaurant>) => update<Restaurant>('restaurants', id, data), // Atualiza um restaurante existente
  
  // Remove um restaurante
  remove: (id: string) => remove<Restaurant>('restaurants', id) // Remove um restaurante do banco de dados
};
