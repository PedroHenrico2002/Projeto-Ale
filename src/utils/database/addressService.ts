
/**
 * Serviço para gerenciamento de endereços
 */

import { Address } from './types';
import { getAll, getById, create, update, remove } from './crudOperations';

// Exporta funções específicas para gerenciamento de endereços
export const addressService = {
  // Obtém todos os endereços
  getAll: () => getAll<Address>('addresses'),
  
  // Obtém todos os endereços de um usuário específico
  getByUserId: (userId: string) => {
    const addresses = getAll<Address>('addresses');
    return addresses.filter(address => address.userId === userId);
  },
  
  // Obtém um endereço específico por ID
  getById: (id: string) => getById<Address>('addresses', id),
  
  // Cria um novo endereço
  create: (data: Omit<Address, 'id'>) => create<Address>('addresses', data),
  
  // Atualiza um endereço existente
  update: (id: string, data: Partial<Address>) => update<Address>('addresses', id, data),
  
  // Remove um endereço
  remove: (id: string) => remove<Address>('addresses', id)
};
