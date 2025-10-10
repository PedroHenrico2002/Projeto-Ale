/**
 * Página de Listagem de Restaurantes
 * 
 * Exibe todos os restaurantes disponíveis com funcionalidades de:
 * - Busca por nome ou tipo de cozinha
 * - Ordenação (alfabética ou por avaliação)
 * - Filtro por categoria (URL parameter)
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowDownAZ, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { restaurantService } from '@/services/supabaseService';

const Restaurants: React.FC = () => {
  // Hook para ler parâmetros da URL (ex: ?category=desserts)
  const [searchParams] = useSearchParams();
  
  // Estado para o texto de busca digitado pelo usuário
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para a opção de ordenação selecionada
  const [sortOption, setSortOption] = useState<'name' | 'rating'>('name');
  
  // Lista de restaurantes carregados do banco de dados
  const [restaurants, setRestaurants] = useState<any[]>([]);
  
  // Indica se os dados ainda estão sendo carregados
  const [loading, setLoading] = useState(true);
  
  // Extrai o parâmetro 'category' da URL (ex: 'desserts', 'restaurants')
  const categoryParam = searchParams.get('category');

  /**
   * Efeito: Carrega os restaurantes ao montar o componente
   */
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        // Inicia o carregamento
        setLoading(true);
        
        // Busca todos os restaurantes do banco de dados
        const data = await restaurantService.getAll();
        
        // Atualiza o estado com os dados recebidos
        setRestaurants(data);
      } catch (error) {
        console.error('Error loading restaurants:', error);
        
        // Exibe notificação de erro ao usuário
        toast({
          title: "Erro ao carregar restaurantes",
          description: "Não foi possível carregar a lista de restaurantes.",
          variant: "destructive",
        });
      } finally {
        // Finaliza o carregamento (sucesso ou erro)
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  /**
   * Memo: Calcula a lista filtrada e ordenada de restaurantes
   * Recalcula apenas quando restaurants, searchQuery, sortOption ou categoryParam mudam
   */
  const displayedRestaurants = React.useMemo(() => {
    // Começa com todos os restaurantes
    let filtered = restaurants;
    
    // FILTRO POR CATEGORIA (da URL)
    if (categoryParam) {
      if (categoryParam === 'desserts') {
        // Filtra apenas sobremesas/docerias
        filtered = filtered.filter((restaurant) =>
          restaurant.cuisine.toLowerCase().includes('doce') ||
          restaurant.cuisine.toLowerCase().includes('sorvete') ||
          restaurant.cuisine.toLowerCase().includes('açaí') ||
          restaurant.cuisine.toLowerCase().includes('confeitaria') ||
          restaurant.cuisine.toLowerCase().includes('gelato') ||
          restaurant.name.toLowerCase().includes('doce')
        );
      } else if (categoryParam === 'restaurants') {
        // Filtra apenas restaurantes (exclui sobremesas)
        filtered = filtered.filter((restaurant) =>
          !restaurant.cuisine.toLowerCase().includes('doce') &&
          !restaurant.cuisine.toLowerCase().includes('sorvete') &&
          !restaurant.cuisine.toLowerCase().includes('açaí') &&
          !restaurant.cuisine.toLowerCase().includes('confeitaria') &&
          !restaurant.cuisine.toLowerCase().includes('gelato')
        );
      }
    }
    
    // FILTRO POR BUSCA (campo de texto)
    if (searchQuery) {
      filtered = filtered.filter((restaurant) => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // ORDENAÇÃO
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'name') {
        // Ordena alfabeticamente por nome
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'rating') {
        // Ordena por avaliação (maior primeiro)
        return b.rating - a.rating;
      }
      return 0;
    });
    
    return sorted;
  }, [restaurants, searchQuery, sortOption, categoryParam]);

  // Renderiza estado de carregamento
  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="page-container">
            <div className="text-center py-8">Carregando restaurantes...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="page-container">
          {/* Seção de Busca e Filtros */}
          <div className="mb-6">
            {/* Campo de busca com ícone */}
            <div className="relative mb-4">
              {/* Ícone de lupa posicionado dentro do input */}
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              
              {/* Input de busca */}
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Barra de ordenação e filtros de categoria */}
            <div className="flex items-center justify-between mb-4">
              {/* Dropdown de ordenação */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center text-sm">
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* Opção: Ordenar A-Z */}
                  <DropdownMenuItem onClick={() => setSortOption('name')} className="flex items-center">
                    <ArrowDownAZ size={16} className="mr-2" />
                    <span>A-Z</span>
                  </DropdownMenuItem>
                  
                  {/* Opção: Ordenar por avaliação */}
                  <DropdownMenuItem onClick={() => setSortOption('rating')} className="flex items-center">
                    <Star size={16} className="mr-2" />
                    <span>Avaliação</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Filtros de Categoria */}
              <div className="flex items-center space-x-2">
                <Link 
                  to="/restaurants" 
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Todos os Restaurantes
                </Link>
              </div>
            </div>
          </div>
          
          {/* Seção de Listagem de Restaurantes */}
          <section className="mb-10">
            {/* Título dinâmico baseado na categoria */}
            <h2 className="text-xl font-bold mb-6">
              {categoryParam === 'desserts' 
                ? 'Sobremesas' 
                : categoryParam === 'restaurants' 
                  ? 'Restaurantes' 
                  : 'Todos os Restaurantes'}
            </h2>
            
            {/* Grid de Restaurantes */}
            <div className="grid grid-cols-1 gap-4">
              {displayedRestaurants.length > 0 ? (
                // Mapeia cada restaurante para um card
                displayedRestaurants.map((restaurant) => (
                  <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`} className="block">
                    {/* Card do Restaurante */}
                    <div className="flex items-center border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                      {/* Imagem do restaurante */}
                      <div className="w-20 h-20 bg-gray-200">
                        <img 
                          src={restaurant.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Informações do restaurante */}
                      <div className="flex-1 p-3">
                        <h3 className="font-medium">{restaurant.name}</h3>
                        <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                        
                        {/* Avaliação com estrela */}
                        <div className="flex items-center text-yellow-500 text-sm">
                          <span className="mr-1">★</span>
                          <span>{restaurant.rating}</span>
                        </div>
                        
                        {/* Tempo de entrega e pedido mínimo */}
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>{restaurant.delivery_time}</span>
                          <span>R$ {restaurant.min_order.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // Mensagem quando não há resultados
                <p className="text-center text-gray-500 my-8">Nenhum resultado encontrado.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Restaurants;
