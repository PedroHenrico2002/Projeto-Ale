/**
 * Contexto do Carrinho de Compras
 * 
 * Este arquivo implementa o gerenciamento de estado global do carrinho usando React Context.
 * Permite que todos os componentes da aplicação acessem e modifiquem o carrinho de compras.
 */

// Importa as dependências necessárias do React e das bibliotecas
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

// ===== TIPOS E INTERFACES =====

/**
 * Interface que define a estrutura de um item no carrinho
 */
export interface CartItem {
  id: string;                    // ID único do item
  restaurantId: string;          // ID do restaurante de origem
  restaurantName: string;        // Nome do restaurante
  name: string;                  // Nome do item
  image: string;                 // URL da imagem do item
  price: number;                 // Preço unitário base do item
  quantity: number;              // Quantidade selecionada
  options?: {                    // Opções adicionais (opcional)
    name: string;                // Nome da opção (ex: "Tamanho")
    value: string | string[];    // Valor selecionado (ex: "Grande" ou ["Bacon", "Queijo"])
    price: number;               // Preço adicional da opção
  }[];
}

/**
 * Interface que define os métodos e propriedades disponíveis no contexto do carrinho
 */
interface CartContextType {
  items: CartItem[];                                          // Lista de itens no carrinho
  isLoading: boolean;                                         // Indica se está carregando dados
  addItem: (item: Omit<CartItem, 'quantity'>) => void;       // Adiciona um item ao carrinho
  removeItem: (id: string) => void;                          // Remove um item do carrinho
  updateQuantity: (id: string, quantity: number) => void;    // Atualiza quantidade de um item
  clearCart: () => void;                                      // Limpa todos os itens do carrinho
  getTotalItems: () => number;                               // Retorna quantidade total de itens
  getTotalPrice: () => number;                               // Retorna preço total do carrinho
  getRestaurantId: () => string | null;                      // Retorna ID do restaurante atual
}

// Cria o contexto do carrinho (inicialmente undefined)
const CartContext = createContext<CartContextType | undefined>(undefined);

// ===== HOOK CUSTOMIZADO =====

/**
 * Hook customizado para acessar o contexto do carrinho
 * Lança erro se usado fora do CartProvider
 */
export const useCart = () => {
  // Obtém o contexto atual
  const context = useContext(CartContext);
  
  // Verifica se o hook está sendo usado dentro do provider
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  // Retorna o contexto válido
  return context;
};

// ===== PROVIDER DO CARRINHO =====

/**
 * Componente Provider que envolve a aplicação e fornece o contexto do carrinho
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado que armazena a lista de itens do carrinho
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Estado que indica se os dados estão sendo carregados
  const [isLoading, setIsLoading] = useState(true);

  // ===== EFEITO: CARREGA CARRINHO DO LOCALSTORAGE =====
  
  /**
   * Efeito executado uma vez quando o componente é montado
   * Carrega os dados do carrinho salvos no localStorage
   */
  useEffect(() => {
    try {
      // Tenta buscar os dados do carrinho no localStorage
      const savedCart = localStorage.getItem('cart');
      
      // Se houver dados salvos
      if (savedCart) {
        // Converte a string JSON para objeto JavaScript
        const parsedCart = JSON.parse(savedCart);
        
        // Log para debug
        console.log('Loaded cart from localStorage:', parsedCart);
        
        // Atualiza o estado com os dados carregados
        setItems(parsedCart);
      } else {
        // Log caso não haja carrinho salvo
        console.log('No cart found in localStorage');
      }
    } catch (error) {
      // Se houver erro ao carregar (ex: JSON corrompido)
      console.error('Error loading cart from localStorage:', error);
      
      // Remove os dados corrompidos do localStorage
      localStorage.removeItem('cart');
    } finally {
      // Independente do resultado, marca o carregamento como concluído
      setIsLoading(false);
    }
  }, []); // Array vazio = executa apenas uma vez na montagem

  // ===== EFEITO: SALVA CARRINHO NO LOCALSTORAGE =====
  
  /**
   * Efeito executado sempre que os itens do carrinho mudam
   * Salva os dados atualizados no localStorage
   */
  useEffect(() => {
    // Converte o array de itens para string JSON e salva
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]); // Executado sempre que 'items' muda

  // ===== FUNÇÃO: ADICIONAR ITEM =====
  
  /**
   * Adiciona um novo item ao carrinho ou incrementa quantidade se já existir
   * @param newItem - Item a ser adicionado (sem o campo quantity)
   */
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    // Atualiza o estado usando a função callback para garantir acesso ao estado mais recente
    setItems(prevItems => {
      // Verifica se há itens no carrinho e se são de restaurantes diferentes
      if (prevItems.length > 0 && prevItems[0].restaurantId !== newItem.restaurantId) {
        // Mostra erro: não pode misturar itens de restaurantes diferentes
        toast.error('Você só pode pedir de um restaurante por vez. Limpe o carrinho para pedir de outro restaurante.');
        // Retorna o estado anterior sem modificações
        return prevItems;
      }

      // Procura se já existe um item idêntico (mesmo ID e mesmas opções)
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === newItem.id && 
        JSON.stringify(item.options) === JSON.stringify(newItem.options)
      );

      // Se o item já existe no carrinho
      if (existingItemIndex !== -1) {
        // Cria uma cópia do array de itens
        const updatedItems = [...prevItems];
        
        // Incrementa a quantidade do item existente
        updatedItems[existingItemIndex].quantity += 1;
        
        // Mostra notificação de sucesso
        toast.success('Quantidade atualizada no carrinho!');
        
        // Retorna o array atualizado
        return updatedItems;
      } else {
        // Item não existe, adiciona como novo com quantidade inicial = 1
        toast.success('Item adicionado ao carrinho!');
        
        // Retorna array anterior + novo item
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  // ===== FUNÇÃO: REMOVER ITEM =====
  
  /**
   * Remove um item do carrinho pelo ID
   * @param id - ID do item a ser removido
   */
  const removeItem = (id: string) => {
    // Atualiza o estado filtrando o item a ser removido
    setItems(prevItems => {
      // Filtra todos os itens exceto aquele com o ID especificado
      // Também remove itens que começam com o mesmo ID (itens com opções)
      const updatedItems = prevItems.filter(item => 
        !(item.id === id || item.id.startsWith(id + '_'))
      );
      
      // Mostra notificação de sucesso
      toast.success('Item removido do carrinho!');
      
      // Retorna o array filtrado
      return updatedItems;
    });
  };

  // ===== FUNÇÃO: ATUALIZAR QUANTIDADE =====
  
  /**
   * Atualiza a quantidade de um item específico no carrinho
   * @param id - ID do item a ser atualizado
   * @param quantity - Nova quantidade desejada
   */
  const updateQuantity = (id: string, quantity: number) => {
    // Se a quantidade for 0 ou negativa, remove o item
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    // Atualiza o estado mapeando os itens
    setItems(prevItems =>
      prevItems.map(item =>
        // Se for o item a ser atualizado, cria novo objeto com quantidade atualizada
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // ===== FUNÇÃO: LIMPAR CARRINHO =====
  
  /**
   * Remove todos os itens do carrinho
   */
  const clearCart = () => {
    // Define o array de itens como vazio
    setItems([]);
    
    // Mostra notificação de sucesso
    toast.success('Carrinho limpo!');
  };

  // ===== FUNÇÃO: CALCULAR TOTAL DE ITENS =====
  
  /**
   * Calcula e retorna o número total de itens no carrinho
   * @returns Quantidade total de itens (somando todas as quantidades)
   */
  const getTotalItems = () => {
    // Usa reduce para somar todas as quantidades
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // ===== FUNÇÃO: CALCULAR PREÇO TOTAL =====
  
  /**
   * Calcula e retorna o preço total do carrinho
   * @returns Valor total em reais (inclui preços base + opções × quantidades)
   */
  const getTotalPrice = () => {
    // Usa reduce para somar os valores de todos os itens
    return items.reduce((total, item) => {
      // Calcula o preço das opções adicionais do item (se houver)
      const optionsPrice = item.options?.reduce((optTotal, opt) => optTotal + opt.price, 0) || 0;
      
      // Soma: (preço base + opções) × quantidade
      return total + ((item.price + optionsPrice) * item.quantity);
    }, 0);
  };

  // ===== FUNÇÃO: OBTER ID DO RESTAURANTE =====
  
  /**
   * Retorna o ID do restaurante do qual os itens foram adicionados
   * @returns ID do restaurante ou null se o carrinho estiver vazio
   */
  const getRestaurantId = () => {
    // Se houver itens, retorna o restaurantId do primeiro item
    // (todos os itens devem ser do mesmo restaurante)
    return items.length > 0 ? items[0].restaurantId : null;
  };

  // ===== RENDERIZAÇÃO DO PROVIDER =====
  
  // Retorna o Provider com todos os valores e funções disponíveis
  return (
    <CartContext.Provider value={{
      items,              // Lista de itens
      isLoading,          // Estado de carregamento
      addItem,            // Função para adicionar item
      removeItem,         // Função para remover item
      updateQuantity,     // Função para atualizar quantidade
      clearCart,          // Função para limpar carrinho
      getTotalItems,      // Função para obter total de itens
      getTotalPrice,      // Função para obter preço total
      getRestaurantId,    // Função para obter ID do restaurante
    }}>
      {children}
    </CartContext.Provider>
  );
};
