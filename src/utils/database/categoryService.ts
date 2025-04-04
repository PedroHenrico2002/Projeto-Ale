
/**
 * Serviço para gerenciamento de categorias
 */

import { Category } from './types'; // Importa o tipo de dados de categoria
import { getAll, getById, create, update, remove } from './crudOperations'; // Importa operações CRUD genéricas

// Exporta funções específicas para gerenciamento de categorias
export const categoryService = {
  // Obtém todas as categorias
  getAll: () => getAll<Category>('categories'), // Busca todas as categorias no banco de dados
  
  // Obtém uma categoria específica por ID
  getById: (id: string) => getById<Category>('categories', id), // Busca uma categoria pelo ID
  
  // Cria uma nova categoria
  create: (data: Omit<Category, 'id'>) => create<Category>('categories', data), // Cria uma nova categoria no banco de dados
  
  // Atualiza uma categoria existente
  update: (id: string, data: Partial<Category>) => update<Category>('categories', id, data), // Atualiza uma categoria existente
  
  // Remove uma categoria
  remove: (id: string) => remove<Category>('categories', id) // Remove uma categoria do banco de dados
};
