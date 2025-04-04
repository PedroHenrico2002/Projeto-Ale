
/**
 * Serviço para gerenciamento de endereços
 */

import { Address } from './types'; // Importa o tipo de dados de endereço
import { getAll, getById, create, update, remove } from './crudOperations'; // Importa operações CRUD genéricas

// Exporta funções específicas para gerenciamento de endereços
export const addressService = {
  // Obtém todos os endereços
  getAll: () => getAll<Address>('addresses'), // Busca todos os endereços no banco de dados
  
  // Obtém todos os endereços de um usuário específico
  getByUserId: (userId: string) => {
    const addresses = getAll<Address>('addresses'); // Busca todos os endereços
    return addresses.filter(address => address.userId === userId); // Filtra apenas os endereços do usuário específico
  },
  
  // Obtém um endereço específico por ID
  getById: (id: string) => getById<Address>('addresses', id), // Busca um endereço pelo ID
  
  // Cria um novo endereço
  create: (data: Omit<Address, 'id'>) => create<Address>('addresses', data), // Cria um novo endereço no banco de dados
  
  // Atualiza um endereço existente
  update: (id: string, data: Partial<Address>) => update<Address>('addresses', id, data), // Atualiza um endereço existente
  
  // Remove um endereço
  remove: (id: string) => remove<Address>('addresses', id) // Remove um endereço do banco de dados
};
