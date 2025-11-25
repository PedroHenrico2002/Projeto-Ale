/**
 * Serviço de Integração com Supabase
 * 
 * Centraliza todas as operações CRUD (Create, Read, Update, Delete) para as tabelas do Supabase.
 * Fornece uma camada de abstração para facilitar o acesso ao banco de dados.
 */

// Importa o cliente do Supabase e os tipos do banco de dados
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// ===== DEFINIÇÃO DE TIPOS =====

// Tipos para Categorias
type Category = Database['public']['Tables']['categories']['Row'];          // Tipo para leitura
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];  // Tipo para inserção
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];  // Tipo para atualização

// Tipos para Restaurantes
type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert'];
type RestaurantUpdate = Database['public']['Tables']['restaurants']['Update'];

// Tipos para Itens do Menu
type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

// Tipos para Endereços
type Address = Database['public']['Tables']['addresses']['Row'];
type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

// Tipos para Pedidos
type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

// Tipos para Perfis de Usuário
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// ===== SERVIÇO DE CATEGORIAS =====

/**
 * Serviço para gerenciar operações relacionadas a categorias de restaurantes
 */
export const categoryService = {
  /**
   * Busca todas as categorias ordenadas por nome
   * @returns Array de categorias
   */
  async getAll() {
    const { data, error } = await supabase
      .from('categories')           // Tabela de categorias
      .select('*')                  // Seleciona todos os campos
      .order('name');               // Ordena por nome alfabeticamente
    
    if (error) throw error;         // Lança erro se houver falha
    return data || [];              // Retorna dados ou array vazio
  },

  /**
   * Busca uma categoria específica por ID
   * @param id - ID da categoria
   * @returns Categoria encontrada
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')           // Tabela de categorias
      .select('*')                  // Seleciona todos os campos
      .eq('id', id)                 // Filtra pelo ID
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna a categoria
  },

  /**
   * Cria uma nova categoria
   * @param category - Dados da categoria a ser criada
   * @returns Categoria criada
   */
  async create(category: CategoryInsert) {
    const { data, error } = await supabase
      .from('categories')           // Tabela de categorias
      .insert(category)             // Insere nova categoria
      .select()                     // Retorna os dados inseridos
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna a categoria criada
  },

  /**
   * Atualiza uma categoria existente
   * @param id - ID da categoria
   * @param category - Dados a serem atualizados
   * @returns Categoria atualizada
   */
  async update(id: string, category: CategoryUpdate) {
    const { data, error } = await supabase
      .from('categories')           // Tabela de categorias
      .update(category)             // Atualiza com novos dados
      .eq('id', id)                 // Filtra pelo ID
      .select()                     // Retorna os dados atualizados
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna a categoria atualizada
  },

  /**
   * Remove uma categoria
   * @param id - ID da categoria a ser removida
   */
  async remove(id: string) {
    const { error } = await supabase
      .from('categories')           // Tabela de categorias
      .delete()                     // Opera deleção
      .eq('id', id);                // Filtra pelo ID
    
    if (error) throw error;         // Lança erro se houver falha
  }
};

// ===== SERVIÇO DE RESTAURANTES =====

/**
 * Serviço para gerenciar operações relacionadas a restaurantes
 */
export const restaurantService = {
  /**
   * Busca todos os restaurantes com suas categorias e endereços
   * @returns Array de restaurantes com dados relacionados
   */
  async getAll() {
    const { data, error } = await supabase
      .from('restaurants')          // Tabela de restaurantes
      .select(`
        *,
        categories(name, icon),
        addresses!restaurants_address_id_fkey(*)
      `)                            // Seleciona restaurante + categoria + endereço
      .order('name');               // Ordena por nome
    
    if (error) throw error;         // Lança erro se houver falha
    return data || [];              // Retorna dados ou array vazio
  },

  /**
   * Busca um restaurante específico por ID com dados relacionados
   * @param id - ID do restaurante
   * @returns Restaurante com categoria e endereço
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('restaurants')          // Tabela de restaurantes
      .select(`
        *,
        categories(name, icon),
        addresses!restaurants_address_id_fkey(*)
      `)                            // Seleciona restaurante + categoria + endereço
      .eq('id', id)                 // Filtra pelo ID
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o restaurante
  },

  /**
   * Cria um novo restaurante
   * @param restaurant - Dados do restaurante a ser criado
   * @returns Restaurante criado
   */
  async create(restaurant: RestaurantInsert) {
    const { data, error } = await supabase
      .from('restaurants')          // Tabela de restaurantes
      .insert(restaurant)           // Insere novo restaurante
      .select()                     // Retorna os dados inseridos
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o restaurante criado
  },

  /**
   * Atualiza um restaurante existente
   * @param id - ID do restaurante
   * @param restaurant - Dados a serem atualizados
   * @returns Restaurante atualizado
   */
  async update(id: string, restaurant: RestaurantUpdate) {
    const { data, error } = await supabase
      .from('restaurants')          // Tabela de restaurantes
      .update(restaurant)           // Atualiza com novos dados
      .eq('id', id)                 // Filtra pelo ID
      .select()                     // Retorna os dados atualizados
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o restaurante atualizado
  },

  /**
   * Remove um restaurante
   * @param id - ID do restaurante a ser removido
   */
  async remove(id: string) {
    const { error } = await supabase
      .from('restaurants')          // Tabela de restaurantes
      .delete()                     // Opera deleção
      .eq('id', id);                // Filtra pelo ID
    
    if (error) throw error;         // Lança erro se houver falha
  }
};

// ===== SERVIÇO DE ITENS DO MENU =====

/**
 * Serviço para gerenciar operações relacionadas a itens do menu
 */
export const menuItemService = {
  /**
   * Busca todos os itens do menu ordenados por nome
   * @returns Array de itens do menu
   */
  async getAll() {
    const { data, error } = await supabase
      .from('menu_items')           // Tabela de itens do menu
      .select('*')                  // Seleciona todos os campos
      .order('name');               // Ordena por nome
    
    if (error) throw error;         // Lança erro se houver falha
    return data || [];              // Retorna dados ou array vazio
  },

  /**
   * Busca itens do menu de um restaurante específico (apenas disponíveis)
   * @param restaurantId - ID do restaurante
   * @returns Array de itens do menu disponíveis
   */
  async getByRestaurantId(restaurantId: string) {
    const { data, error } = await supabase
      .from('menu_items')                           // Tabela de itens do menu
      .select('*')                                  // Seleciona todos os campos
      .eq('restaurant_id', restaurantId)            // Filtra pelo ID do restaurante
      .eq('is_available', true)                     // Apenas itens disponíveis
      .order('category', { ascending: true })       // Ordena por categoria
      .order('name', { ascending: true });          // Depois por nome
    
    if (error) throw error;                         // Lança erro se houver falha
    return data || [];                              // Retorna dados ou array vazio
  },

  /**
   * Busca um item do menu específico por ID
   * @param id - ID do item
   * @returns Item do menu encontrado
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('menu_items')           // Tabela de itens do menu
      .select('*')                  // Seleciona todos os campos
      .eq('id', id)                 // Filtra pelo ID
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o item
  },

  /**
   * Cria um novo item do menu
   * @param menuItem - Dados do item a ser criado
   * @returns Item do menu criado
   */
  async create(menuItem: MenuItemInsert) {
    const { data, error } = await supabase
      .from('menu_items')           // Tabela de itens do menu
      .insert(menuItem)             // Insere novo item
      .select()                     // Retorna os dados inseridos
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o item criado
  },

  /**
   * Atualiza um item do menu existente
   * @param id - ID do item
   * @param menuItem - Dados a serem atualizados
   * @returns Item do menu atualizado
   */
  async update(id: string, menuItem: MenuItemUpdate) {
    const { data, error } = await supabase
      .from('menu_items')           // Tabela de itens do menu
      .update(menuItem)             // Atualiza com novos dados
      .eq('id', id)                 // Filtra pelo ID
      .select()                     // Retorna os dados atualizados
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o item atualizado
  },

  /**
   * Remove um item do menu
   * @param id - ID do item a ser removido
   */
  async remove(id: string) {
    const { error } = await supabase
      .from('menu_items')           // Tabela de itens do menu
      .delete()                     // Opera deleção
      .eq('id', id);                // Filtra pelo ID
    
    if (error) throw error;         // Lança erro se houver falha
  }
};

// ===== SERVIÇO DE ENDEREÇOS =====

/**
 * Serviço para gerenciar operações relacionadas a endereços
 */
export const addressService = {
  /**
   * Busca todos os endereços ordenados por data de criação
   * @returns Array de endereços
   */
  async getAll() {
    const { data, error } = await supabase
      .from('addresses')            // Tabela de endereços
      .select('*')                  // Seleciona todos os campos
      .order('created_at');         // Ordena por data de criação
    
    if (error) throw error;         // Lança erro se houver falha
    return data || [];              // Retorna dados ou array vazio
  },

  /**
   * Busca endereços de um usuário específico
   * @param userId - ID do usuário
   * @returns Array de endereços do usuário
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('addresses')            // Tabela de endereços
      .select('*')                  // Seleciona todos os campos
      .eq('user_id', userId)        // Filtra pelo ID do usuário
      .order('created_at');         // Ordena por data de criação
    
    if (error) throw error;         // Lança erro se houver falha
    return data || [];              // Retorna dados ou array vazio
  },

  /**
   * Busca um endereço específico por ID
   * @param id - ID do endereço
   * @returns Endereço encontrado
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('addresses')            // Tabela de endereços
      .select('*')                  // Seleciona todos os campos
      .eq('id', id)                 // Filtra pelo ID
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o endereço
  },

  /**
   * Cria um novo endereço
   * @param address - Dados do endereço a ser criado
   * @returns Endereço criado
   */
  async create(address: AddressInsert) {
    const { data, error } = await supabase
      .from('addresses')            // Tabela de endereços
      .insert(address)              // Insere novo endereço
      .select()                     // Retorna os dados inseridos
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o endereço criado
  },

  /**
   * Atualiza um endereço existente
   * @param id - ID do endereço
   * @param address - Dados a serem atualizados
   * @returns Endereço atualizado
   */
  async update(id: string, address: AddressUpdate) {
    const { data, error } = await supabase
      .from('addresses')            // Tabela de endereços
      .update(address)              // Atualiza com novos dados
      .eq('id', id)                 // Filtra pelo ID
      .select()                     // Retorna os dados atualizados
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o endereço atualizado
  },

  /**
   * Remove um endereço
   * @param id - ID do endereço a ser removido
   */
  async remove(id: string) {
    const { error } = await supabase
      .from('addresses')            // Tabela de endereços
      .delete()                     // Opera deleção
      .eq('id', id);                // Filtra pelo ID
    
    if (error) throw error;         // Lança erro se houver falha
  }
};

// ===== SERVIÇO DE PEDIDOS =====

/**
 * Serviço para gerenciar operações relacionadas a pedidos
 */
export const orderService = {
  /**
   * Busca todos os pedidos com dados de restaurantes e endereços
   * @returns Array de pedidos ordenados do mais recente para o mais antigo
   */
  async getAll() {
    const { data, error } = await supabase
      .from('orders')                           // Tabela de pedidos
      .select(`
        *,
        restaurants(name, image_url),
        addresses(*)
      `)                                        // Seleciona pedido + restaurante + endereço
      .order('created_at', { ascending: false }); // Ordena do mais recente para o mais antigo
    
    if (error) throw error;                     // Lança erro se houver falha
    return data || [];                          // Retorna dados ou array vazio
  },

  /**
   * Busca pedidos de um usuário específico
   * @param userId - ID do usuário
   * @returns Array de pedidos do usuário
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')                           // Tabela de pedidos
      .select(`
        *,
        restaurants(name, image_url),
        addresses(*)
      `)                                        // Seleciona pedido + restaurante + endereço
      .eq('user_id', userId)                    // Filtra pelo ID do usuário
      .order('created_at', { ascending: false }); // Ordena do mais recente para o mais antigo
    
    if (error) throw error;                     // Lança erro se houver falha
    return data || [];                          // Retorna dados ou array vazio
  },

  /**
   * Busca um pedido específico por ID com dados relacionados
   * @param id - ID do pedido
   * @returns Pedido com restaurante e endereço
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')               // Tabela de pedidos
      .select(`
        *,
        restaurants(name, image_url),
        addresses(*)
      `)                            // Seleciona pedido + restaurante + endereço
      .eq('id', id)                 // Filtra pelo ID
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o pedido
  },

  /**
   * Cria um novo pedido
   * @param order - Dados do pedido a ser criado
   * @returns Pedido criado
   */
  async create(order: OrderInsert) {
    const { data, error } = await supabase
      .from('orders')               // Tabela de pedidos
      .insert(order)                // Insere novo pedido
      .select()                     // Retorna os dados inseridos
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o pedido criado
  },

  /**
   * Atualiza um pedido existente
   * @param id - ID do pedido
   * @param order - Dados a serem atualizados
   * @returns Pedido atualizado
   */
  async update(id: string, order: OrderUpdate) {
    const { data, error } = await supabase
      .from('orders')               // Tabela de pedidos
      .update(order)                // Atualiza com novos dados
      .eq('id', id)                 // Filtra pelo ID
      .select()                     // Retorna os dados atualizados
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o pedido atualizado
  },

  /**
   * Remove um pedido
   * @param id - ID do pedido a ser removido
   */
  async remove(id: string) {
    const { error } = await supabase
      .from('orders')               // Tabela de pedidos
      .delete()                     // Opera deleção
      .eq('id', id);                // Filtra pelo ID
    
    if (error) throw error;         // Lança erro se houver falha
  }
};

// ===== SERVIÇO DE PERFIS =====

/**
 * Serviço para gerenciar operações relacionadas a perfis de usuário
 */
export const profileService = {
  /**
   * Busca o perfil de um usuário específico
   * @param userId - ID do usuário
   * @returns Perfil do usuário
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')             // Tabela de perfis
      .select('*')                  // Seleciona todos os campos
      .eq('user_id', userId)        // Filtra pelo ID do usuário
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o perfil
  },

  /**
   * Atualiza o perfil de um usuário
   * @param userId - ID do usuário
   * @param profile - Dados a serem atualizados
   * @returns Perfil atualizado
   */
  async updateProfile(userId: string, profile: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')             // Tabela de perfis
      .update(profile)              // Atualiza com novos dados
      .eq('user_id', userId)        // Filtra pelo ID do usuário
      .select()                     // Retorna os dados atualizados
      .single();                    // Retorna um único resultado
    
    if (error) throw error;         // Lança erro se houver falha
    return data;                    // Retorna o perfil atualizado
  },

  /**
   * Exclui a conta de um usuário completamente do sistema
   * Chama a edge function que tem permissões de admin para excluir o usuário
   */
  async deleteAccount() {
    // Obtém o token de autenticação atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    // Chama a edge function para excluir a conta
    const { data, error } = await supabase.functions.invoke('delete-user-account', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error; // Lança erro se houver falha
    return data; // Retorna a resposta da função
  }
};
