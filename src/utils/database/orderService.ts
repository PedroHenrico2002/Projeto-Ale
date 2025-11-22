/**
 * Serviço de Gerenciamento de Pedidos
 * 
 * Responsável por todas as operações relacionadas a pedidos (orders)
 * Inclui criação, leitura, atualização e exclusão de pedidos no Supabase
 */

// Importa os tipos necessários
import { OrderDetails, OrderItem } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

// ===== FUNÇÃO AUXILIAR: CONVERTER FORMATO DO BANCO =====

/**
 * Converte um pedido do formato do banco de dados para o formato OrderDetails
 * Busca informações relacionadas (restaurante, endereço) e calcula horários
 * @param dbOrder - Pedido no formato retornado pelo Supabase
 * @returns Pedido no formato OrderDetails usado pela aplicação
 */
const mapDatabaseOrderToOrderDetails = async (dbOrder: any): Promise<OrderDetails> => {
  // Busca o nome do restaurante pelo ID
  const { data: restaurant } = await supabase
    .from('restaurants')              // Tabela de restaurantes
    .select('name')                   // Seleciona apenas o nome
    .eq('id', dbOrder.restaurant_id)  // Filtra pelo ID do restaurante
    .single();                        // Retorna um único resultado

  // Busca os dados do endereço de entrega pelo ID
  const { data: address } = await supabase
    .from('addresses')                        // Tabela de endereços
    .select('street, number, neighborhood, city')  // Seleciona campos necessários
    .eq('id', dbOrder.delivery_address_id)    // Filtra pelo ID do endereço
    .single();                                // Retorna um único resultado

  // Formata o endereço completo como string
  const addressString = address 
    ? `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}`
    : 'Endereço não encontrado';

  // ===== CÁLCULO DO TEMPO DE ENTREGA ESTIMADO =====
  
  // Converte a data de criação do pedido para objeto Date
  const orderTime = new Date(dbOrder.created_at);
  
  // Calcula horário de entrega mínimo (30 minutos após o pedido)
  const deliveryTime = new Date(orderTime.getTime() + 30 * 60000);
  
  // Calcula horário de entrega máximo (45 minutos após o pedido)
  const deliveryEndTime = new Date(orderTime.getTime() + 45 * 60000);
  
  // Formata horário mínimo como string "HH:MM"
  const deliveryTimeStr = `${deliveryTime.getHours()}:${String(deliveryTime.getMinutes()).padStart(2, '0')}`;
  
  // Formata horário máximo como string "HH:MM"
  const deliveryEndTimeStr = `${deliveryEndTime.getHours()}:${String(deliveryEndTime.getMinutes()).padStart(2, '0')}`;

  // Retorna o objeto OrderDetails formatado
  return {
    restaurantName: restaurant?.name || 'Restaurante não encontrado',  // Nome do restaurante
    restaurantId: dbOrder.restaurant_id,                               // ID do restaurante
    items: Array.isArray(dbOrder.items) ? dbOrder.items : [],         // Lista de itens (garante que é array)
    totalValue: Number(dbOrder.total),                                 // Valor total (converte para número)
    orderNumber: dbOrder.id,                                           // Número do pedido (ID)
    orderTime: dbOrder.created_at,                                     // Horário de criação
    estimatedDelivery: `Hoje, ${deliveryTimeStr} - ${deliveryEndTimeStr}`,  // Entrega estimada
    address: addressString,                                            // Endereço formatado
    status: dbOrder.status as 'preparing' | 'ready' | 'delivering' | 'delivered',  // Status do pedido
    paymentMethod: dbOrder.payment_method as any || 'cash',            // Método de pagamento
    paymentDetails: null                                               // Detalhes de pagamento (não usado)
  };
};

// ===== SERVIÇO DE PEDIDOS =====

/**
 * Objeto que exporta todas as funções de gerenciamento de pedidos
 */
export const orderService = {
  
  // ===== FUNÇÃO: BUSCAR TODOS OS PEDIDOS DO USUÁRIO =====
  
  /**
   * Busca todos os pedidos do usuário autenticado
   * @returns Array de pedidos no formato OrderDetails
   * @throws Error se o usuário não estiver autenticado
   */
  getAll: async (): Promise<OrderDetails[]> => {
    // Obtém os dados do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verifica se o usuário está autenticado
    if (!user) throw new Error('User not authenticated');

    // Busca todos os pedidos do usuário no banco de dados
    const { data, error } = await supabase
      .from('orders')                              // Tabela de pedidos
      .select('*')                                 // Seleciona todos os campos
      .eq('user_id', user.id)                      // Filtra pelo ID do usuário
      .order('created_at', { ascending: false });  // Ordena do mais recente para o mais antigo

    // Se houver erro, lança exceção
    if (error) throw error;
    
    // Se não houver dados, retorna array vazio
    if (!data) return [];

    // Converte todos os pedidos para o formato OrderDetails
    const orderDetails = await Promise.all(
      data.map(order => mapDatabaseOrderToOrderDetails(order))
    );

    // Retorna a lista de pedidos formatados
    return orderDetails;
  },
  
  // ===== FUNÇÃO: BUSCAR PEDIDO POR ID =====
  
  /**
   * Busca um pedido específico pelo ID
   * @param orderId - ID do pedido a ser buscado
   * @returns Pedido no formato OrderDetails
   * @throws Error se o usuário não estiver autenticado ou pedido não encontrado
   */
  getById: async (orderId: string): Promise<OrderDetails> => {
    // Obtém os dados do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verifica se o usuário está autenticado
    if (!user) throw new Error('User not authenticated');

    // Busca o pedido específico no banco de dados
    const { data, error } = await supabase
      .from('orders')                  // Tabela de pedidos
      .select('*')                     // Seleciona todos os campos
      .eq('id', orderId)               // Filtra pelo ID do pedido
      .eq('user_id', user.id)          // Garante que o pedido pertence ao usuário
      .single();                       // Retorna um único resultado

    // Se houver erro, lança exceção
    if (error) throw error;
    
    // Converte e retorna o pedido no formato OrderDetails
    return mapDatabaseOrderToOrderDetails(data);
  },
  
  // ===== FUNÇÃO: CRIAR NOVO PEDIDO =====
  
  /**
   * Cria um novo pedido no banco de dados
   * @param orderData - Dados do pedido a ser criado
   * @returns Pedido criado
   * @throws Error se o usuário não estiver autenticado
   */
  create: async (orderData: {
    restaurant_id: string;        // ID do restaurante
    delivery_address_id: string;  // ID do endereço de entrega
    items: any[];                 // Lista de itens do pedido
    subtotal: number;             // Subtotal dos itens
    delivery_fee: number;         // Taxa de entrega
    total: number;                // Valor total
    payment_method?: string;      // Método de pagamento (opcional)
    notes?: string;               // Observações (opcional)
  }) => {
    // Obtém os dados do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verifica se o usuário está autenticado
    if (!user) throw new Error('User not authenticated');

    // Insere o novo pedido no banco de dados
    const { data, error } = await supabase
      .from('orders')       // Tabela de pedidos
      .insert({
        user_id: user.id,   // ID do usuário autenticado
        ...orderData,       // Spread dos dados do pedido
        status: 'pending'   // Status inicial: pendente
      })
      .select()             // Retorna os dados do pedido criado
      .single();            // Retorna um único resultado

    // Se houver erro, lança exceção
    if (error) throw error;
    
    // Retorna o pedido criado
    return data;
  },
  
  // ===== FUNÇÃO: ATUALIZAR PEDIDO =====
  
  /**
   * Atualiza um pedido existente
   * @param orderId - ID do pedido a ser atualizado
   * @param updates - Objeto com os campos a serem atualizados
   * @returns Pedido atualizado
   * @throws Error se o usuário não estiver autenticado
   */
  update: async (orderId: string, updates: any) => {
    // Obtém os dados do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verifica se o usuário está autenticado
    if (!user) throw new Error('User not authenticated');

    // Atualiza o pedido no banco de dados
    const { data, error } = await supabase
      .from('orders')              // Tabela de pedidos
      .update(updates)             // Aplica as atualizações
      .eq('id', orderId)           // Filtra pelo ID do pedido
      .eq('user_id', user.id)      // Garante que o pedido pertence ao usuário
      .select()                    // Retorna os dados atualizados
      .single();                   // Retorna um único resultado

    // Se houver erro, lança exceção
    if (error) throw error;
    
    // Retorna o pedido atualizado
    return data;
  },
  
  // ===== FUNÇÃO: REMOVER PEDIDO =====
  
  /**
   * Remove um pedido do banco de dados
   * @param orderId - ID do pedido a ser removido
   * @returns true se removido com sucesso
   * @throws Error se o usuário não estiver autenticado
   */
  remove: async (orderId: string) => {
    // Obtém os dados do usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verifica se o usuário está autenticado
    if (!user) throw new Error('User not authenticated');

    // Remove o pedido do banco de dados
    const { error } = await supabase
      .from('orders')           // Tabela de pedidos
      .delete()                 // Operação de deleção
      .eq('id', orderId)        // Filtra pelo ID do pedido
      .eq('user_id', user.id);  // Garante que o pedido pertence ao usuário

    // Se houver erro, lança exceção
    if (error) throw error;
    
    // Retorna true indicando sucesso
    return true;
  }
};
