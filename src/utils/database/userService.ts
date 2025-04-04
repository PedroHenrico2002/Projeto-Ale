
/**
 * Serviço para gerenciamento de usuários
 */

import { User } from './types'; // Importa o tipo de dados de usuário
import { getAll, getById, create, update, remove } from './crudOperations'; // Importa operações CRUD genéricas

// Exporta funções específicas para gerenciamento de usuários
export const userService = {
  // Obtém todos os usuários
  getAll: () => getAll<User>('users'), // Busca todos os usuários no banco de dados
  
  // Obtém um usuário específico por ID
  getById: (id: string) => getById<User>('users', id), // Busca um usuário pelo ID
  
  // Cria um novo usuário
  create: (data: Omit<User, 'id'>) => create<User>('users', data), // Cria um novo usuário no banco de dados
  
  // Atualiza um usuário existente
  update: (id: string, data: Partial<User>) => update<User>('users', id, data), // Atualiza um usuário existente
  
  // Remove um usuário
  remove: (id: string) => remove<User>('users', id) // Remove um usuário do banco de dados
};
