
/**
 * Serviço para gerenciamento de categorias
 */

import { Category } from './types';
import { getAll, getById, create, update, remove } from './crudOperations';

// Exporta funções específicas para gerenciamento de categorias
export const categoryService = {
  // Obtém todas as categorias
  getAll: () => getAll<Category>('categories'),
  
  // Obtém uma categoria específica por ID
  getById: (id: string) => getById<Category>('categories', id),
  
  // Cria uma nova categoria
  create: (data: Omit<Category, 'id'>) => create<Category>('categories', data),
  
  // Atualiza uma categoria existente
  update: (id: string, data: Partial<Category>) => update<Category>('categories', id, data),
  
  // Remove uma categoria
  remove: (id: string) => remove<Category>('categories', id)
};
