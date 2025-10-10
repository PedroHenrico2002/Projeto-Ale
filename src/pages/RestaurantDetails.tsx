/**
 * Página de Detalhes do Restaurante
 * 
 * Exibe informações completas de um restaurante específico e seu cardápio:
 * - Cabeçalho com foto, nome, avaliação e informações de entrega
 * - Menu organizado por categorias
 * - Controle de quantidade e adição ao carrinho
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ChevronLeft, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { restaurantService, menuItemService } from '@/services/supabaseService';

const RestaurantDetails: React.FC = () => {
  // Extrai o ID do restaurante da URL
  const { restaurantId } = useParams<{ restaurantId: string }>();
  
  // Hook de navegação para voltar à página anterior
  const navigate = useNavigate();
  
  // Função do contexto do carrinho para adicionar itens
  const { addItem } = useCart();
  
  // Dados do restaurante atual
  const [restaurant, setRestaurant] = useState<any>(null);
  
  // Lista de itens do menu do restaurante
  const [menuItems, setMenuItems] = useState<any[]>([]);
  
  // Indica se os dados ainda estão sendo carregados
  const [loading, setLoading] = useState(true);
  
  // Armazena a quantidade selecionada de cada item (por ID)
  // Exemplo: { "item-123": 2, "item-456": 1 }
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  /**
   * Efeito: Carrega dados do restaurante e menu quando o componente é montado
   * ou quando o restaurantId muda
   */
  useEffect(() => {
    const loadRestaurantData = async () => {
      // Se não houver ID, não faz nada
      if (!restaurantId) return;
      
      try {
        // Inicia o carregamento
        setLoading(true);
        
        // Busca dados do restaurante e menu em paralelo (mais rápido)
        const [restaurantData, menuData] = await Promise.all([
          restaurantService.getById(restaurantId),
          menuItemService.getByRestaurantId(restaurantId)
        ]);
        
        // Atualiza os estados com os dados recebidos
        setRestaurant(restaurantData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar restaurante');
      } finally {
        // Finaliza o carregamento
        setLoading(false);
      }
    };

    loadRestaurantData();
  }, [restaurantId]);
  
  /**
   * Volta para a página anterior
   */
  const handleBack = () => {
    navigate(-1);
  };
  
  /**
   * Altera a quantidade de um item
   * @param itemId - ID do item
   * @param delta - Mudança na quantidade (+1 ou -1)
   */
  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities(prev => {
      // Obtém a quantidade atual (ou 0 se não existir)
      const current = prev[itemId] || 0;
      
      // Calcula a nova quantidade (mínimo 0)
      const newQuantity = Math.max(0, current + delta);
      
      // Retorna o novo objeto de quantidades com o item atualizado
      return { ...prev, [itemId]: newQuantity };
    });
  };
  
  /**
   * Adiciona um item ao carrinho com a quantidade selecionada
   * @param item - Dados do item do menu
   */
  const handleAddToCart = (item: any) => {
    // Obtém a quantidade selecionada (mínimo 1)
    const quantity = quantities[item.id] || 1;
    
    // Adiciona o item N vezes ao carrinho (onde N é a quantidade)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id, // ID do item
        restaurantId: item.restaurant_id, // ID do restaurante
        restaurantName: restaurant.name, // Nome do restaurante
        name: item.name, // Nome do item
        price: item.price, // Preço unitário
        image: item.image_url // URL da imagem
      });
    }
    
    // Exibe notificação de sucesso
    toast.success(`${quantity}x ${item.name} adicionado ao carrinho`);
    
    // Reseta a quantidade do item para 0
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };
  
  // Renderiza estado de carregamento
  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="page-container">
            <div className="text-center py-8">Carregando...</div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Renderiza mensagem se o restaurante não for encontrado
  if (!restaurant) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="page-container">
            <div className="text-center">
              <h1 className="heading-lg mb-4">Restaurante não encontrado</h1>
              <Button onClick={handleBack}>Voltar</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /**
   * Agrupa os itens do menu por categoria
   * Resultado: { "Entradas": [...items], "Pratos Principais": [...items], ... }
   */
  const groupedItems = menuItems.reduce((acc, item) => {
    // Define a categoria (ou "Outros" se não houver)
    const category = item.category || 'Outros';
    
    // Se a categoria ainda não existe no acumulador, cria um array vazio
    if (!acc[category]) {
      acc[category] = [];
    }
    
    // Adiciona o item à categoria correspondente
    acc[category].push(item);
    
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted pt-20 pb-16">
        <div className="page-container">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>

          {/* Cabeçalho do Restaurante */}
          <div className="mb-6">
            {/* Imagem de capa do restaurante */}
            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
              <img
                src={restaurant.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Nome e descrição */}
            <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-muted-foreground mb-2">{restaurant.cuisine}</p>
            
            {/* Informações: avaliação, tempo de entrega, pedido mínimo */}
            <div className="flex items-center gap-4 text-sm">
              {/* Avaliação com estrela */}
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{restaurant.rating || 0}</span>
              </div>
              
              {/* Tempo de entrega */}
              <span className="text-muted-foreground">{restaurant.delivery_time}</span>
              
              {/* Pedido mínimo */}
              <span className="text-muted-foreground">
                Pedido mínimo: R$ {restaurant.min_order?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Itens do Menu */}
          {menuItems.length === 0 ? (
            // Mensagem quando não há itens disponíveis
            <div className="text-center py-8 glass-effect rounded-lg">
              <p className="text-muted-foreground">Nenhum item disponível no momento</p>
            </div>
          ) : (
            // Lista de itens agrupados por categoria
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  {/* Título da categoria */}
                  <h2 className="text-xl font-bold mb-4">{category}</h2>
                  
                  {/* Grid de itens da categoria */}
                  <div className="grid gap-4">
                    {(items as any[]).map((item) => {
                      // Obtém a quantidade selecionada deste item
                      const quantity = quantities[item.id] || 0;
                      
                      return (
                        <div
                          key={item.id}
                          className="glass-effect rounded-lg overflow-hidden border border-primary/10 hover:border-primary/30 transition-all"
                        >
                          <div className="flex gap-4 p-4">
                            {/* Imagem do Item */}
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Informações do Item */}
                            <div className="flex-1 min-w-0">
                              {/* Nome */}
                              <h3 className="font-semibold mb-1">{item.name}</h3>
                              
                              {/* Descrição (máximo 2 linhas) */}
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {item.description}
                              </p>
                              
                              {/* Preço e avaliação */}
                              <div className="flex items-center gap-2 mb-2">
                                {/* Preço */}
                                <span className="text-lg font-bold text-primary">
                                  R$ {item.price.toFixed(2)}
                                </span>
                                
                                {/* Avaliação (se houver) */}
                                {item.rating && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span>{item.rating}</span>
                                  </div>
                                )}
                              </div>

                              {/* Controles de Quantidade */}
                              <div className="flex items-center gap-3">
                                {/* Botões - / + */}
                                <div className="flex items-center gap-2 bg-background/50 rounded-lg p-1">
                                  {/* Botão Diminuir */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={quantity === 0}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  
                                  {/* Número da quantidade */}
                                  <span className="w-8 text-center font-medium">
                                    {quantity}
                                  </span>
                                  
                                  {/* Botão Aumentar */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                {/* Botão Adicionar ao Carrinho */}
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(item)}
                                  disabled={quantity === 0}
                                  className="flex items-center gap-2"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetails;
