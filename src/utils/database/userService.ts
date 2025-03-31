
/**
 * Serviço para gerenciamento de usuários
 */

import { User } from './types';
import { getAll, getById, create, update, remove } from './crudOperations';

// Exporta funções específicas para gerenciamento de usuários
export const userService = {
  // Obtém todos os usuários
  getAll: () => getAll<User>('users'),
  
  // Obtém um usuário específico por ID
  getById: (id: string) => getById<User>('users', id),
  
  // Cria um novo usuário
  create: (data: Omit<User, 'id'>) => create<User>('users', data),
  
  // Atualiza um usuário existente
  update: (id: string, data: Partial<User>) => update<User>('users', id, data),
  
  // Remove um usuário
  remove: (id: string) => remove<User>('users', id)
};
