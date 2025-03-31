
/**
 * Arquivo de índice para exportar todos os serviços de banco de dados
 */

// Inicialização do banco de dados
import { initializeDatabase } from './utils';

// Exportar tipos
export * from './types';

// Exportar serviços
export { userService } from './userService';
export { addressService } from './addressService';
export { categoryService } from './categoryService';
export { restaurantService } from './restaurantService';
export { menuItemService } from './menuItemService';

// Inicializar o banco de dados quando o módulo é importado
initializeDatabase();
