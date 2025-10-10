/**
 * Página do Carrinho de Compras
 * 
 * Gerencia o carrinho de compras do usuário com funcionalidades de:
 * - Visualização de itens adicionados
 * - Alteração de quantidade de cada item
 * - Remoção de itens individuais ou limpeza total
 * - Cálculo de subtotal, taxa de entrega, impostos e total
 * - Aplicação de códigos promocionais
 * - Seleção de localização de entrega
 * - Navegação para checkout
 */

import React from 'react';
import { Layout } from '@/components/Layout';
import { LocationSelector } from '@/components/LocationSelector';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
  // Hook de navegação para redirecionar o usuário
  const navigate = useNavigate();
  
  // Obtém funções e dados do contexto do carrinho
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  
  // Estado do código promocional digitado pelo usuário
  const [promoCode, setPromoCode] = React.useState('');
  
  // Percentual de desconto aplicado (0 a 1, onde 0.1 = 10%)
  const [discount, setDiscount] = React.useState(0);
  
  /**
   * Manipula a seleção de uma localização de entrega
   * @param selectedAddress - Endereço selecionado pelo usuário
   */
  const handleLocationSelect = (selectedAddress: string) => {
    toast.success('Localização de entrega atualizada!');
  };
  
  /**
   * Redireciona o usuário para a página de checkout
   */
  const handleCheckout = () => {
    navigate('/checkout');
  };

  /**
   * Aplica um código promocional se for válido
   */
  const handleApplyPromo = () => {
    // Valida o código (case-insensitive)
    if (promoCode.toLowerCase() === 'primeiracompra') {
      // Aplica 10% de desconto
      setDiscount(0.1);
      toast.success('Código promocional aplicado! 10% de desconto no total.');
    } else {
      // Código inválido
      toast.error('Código promocional inválido');
      setDiscount(0);
    }
  };
  
  // ===== CÁLCULOS DE VALORES =====
  
  // Subtotal: soma dos preços de todos os itens (incluindo opções)
  const subtotal = getTotalPrice();
  
  // Taxa de entrega fixa
  const deliveryFee = 5.99;
  
  // Impostos: 10% do subtotal
  const tax = subtotal * 0.1;
  
  // Total antes do desconto
  const totalBeforeDiscount = subtotal + deliveryFee + tax;
  
  // Valor do desconto em reais
  const discountAmount = totalBeforeDiscount * discount;
  
  // Total final (após desconto)
  const total = totalBeforeDiscount - discountAmount;
  
  // Verifica se o carrinho está vazio
  const isCartEmpty = items.length === 0;
  
  return (
    <Layout>
      <div className="pt-28 pb-16">
        <div className="page-container">
          {/* Link para continuar comprando */}
          <div className="mb-6">
            <Link
              to="/restaurants"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Continuar Comprando</span>
            </Link>
          </div>
          
          {/* Título da página */}
          <h1 className="heading-lg mb-6">Seu Carrinho</h1>
          
          {isCartEmpty ? (
            // ===== CARRINHO VAZIO =====
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <h2 className="text-lg font-medium mb-3">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Parece que você ainda não adicionou nenhum item ao seu carrinho.
              </p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/restaurants')}
              >
                Ver Restaurantes
              </Button>
            </div>
          ) : (
            // ===== CARRINHO COM ITENS =====
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna da Esquerda: Itens e Localização */}
              <div className="lg:col-span-2 space-y-6">
                {/* Card com lista de itens do carrinho */}
                <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
                  {/* Cabeçalho: quantidade de itens e botão limpar */}
                  <div className="p-5 flex items-center justify-between border-b border-border">
                    <h2 className="font-medium">Itens do Carrinho ({items.length})</h2>
                    <button
                      className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center"
                      onClick={clearCart}
                    >
                      <Trash2 size={14} className="mr-1" />
                      <span>Limpar Tudo</span>
                    </button>
                  </div>
                  
                  {/* Lista de itens */}
                  <div className="divide-y divide-border">
                    {items.map((item) => {
                      // Calcula o preço das opções adicionais (se houver)
                      const optionsPrice = item.options?.reduce((total, opt) => total + opt.price, 0) || 0;
                      
                      // Preço total do item (preço base + opções) × quantidade
                      const itemTotalPrice = (item.price + optionsPrice) * item.quantity;
                      
                      return (
                        <div key={item.id} className="p-5 flex items-center">
                          {/* Imagem do item */}
                          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Informações e controles do item */}
                          <div className="ml-4 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              {/* Nome, restaurante e opções */}
                              <div>
                                <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mb-1">{item.restaurantName}</p>
                                
                                {/* Exibe opções adicionais (se houver) */}
                                {item.options && item.options.length > 0 && (
                                  <div className="text-sm text-muted-foreground">
                                    {item.options.map((option, index) => (
                                      <span key={index} className="mr-2">
                                        {option.name}: {Array.isArray(option.value) ? option.value.join(', ') : option.value}
                                        {option.price > 0 && ` (+R$${option.price.toFixed(2)})`}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Preço e controles de quantidade */}
                              <div className="mt-3 md:mt-0 md:text-right">
                                {/* Cálculo: (preço unitário × quantidade = total) */}
                                <div className="text-sm mb-2">
                                  <span className="text-muted-foreground">
                                    R${(item.price + optionsPrice).toFixed(2)} × {item.quantity} = 
                                  </span>
                                  <span className="font-medium">R${itemTotalPrice.toFixed(2)}</span>
                                </div>
                                
                                {/* Botões de controle: -, quantidade, +, deletar */}
                                <div className="flex items-center space-x-3">
                                  {/* Botão Diminuir Quantidade */}
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  
                                  {/* Exibe a quantidade atual */}
                                  <span className="text-sm font-medium">{item.quantity}</span>
                                  
                                  {/* Botão Aumentar Quantidade */}
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus size={14} />
                                  </Button>
                                  
                                  {/* Botão Remover Item */}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Seletor de Localização de Entrega */}
                <LocationSelector onSelectLocation={handleLocationSelect} />
              </div>
              
              {/* Coluna da Direita: Resumo do Pedido */}
              <div className="lg:col-span-1">
                {/* Card: Resumo do Pedido */}
                <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
                  <h3 className="font-medium mb-4">Resumo do Pedido</h3>
                  
                  {/* Linhas de valores */}
                  <div className="space-y-3 mb-4">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Taxa de Entrega */}
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Entrega</span>
                      <span>R${deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    {/* Impostos */}
                    <div className="flex justify-between text-sm">
                      <span>Impostos</span>
                      <span>R${tax.toFixed(2)}</span>
                    </div>
                    
                    {/* Desconto (exibe apenas se houver) */}
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto (10%)</span>
                        <span>-R${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Linha separadora e total */}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>R${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botão Finalizar Pedido */}
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleCheckout}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
                
                {/* Card: Código Promocional */}
                <div className="mt-6 bg-card rounded-xl border border-border p-5 animate-fade-in">
                  <h3 className="font-medium mb-4">Tem um Código Promocional?</h3>
                  
                  {/* Campo de input + botão aplicar */}
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Digite o código promocional"
                      className="flex-1 rounded-l-md border border-r-0 border-input focus:border-accent focus:ring-1 focus:ring-accent px-3 py-2"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button 
                      className="rounded-l-none bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={handleApplyPromo}
                    >
                      Aplicar
                    </Button>
                  </div>
                  
                  {/* Mensagem de sucesso (exibe apenas se houver desconto aplicado) */}
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2">✓ Código aplicado com sucesso!</p>
                  )}
                </div>
                
                {/* Link: Adicionar Mais Itens */}
                <Link to="/restaurants" className="mt-6 block">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                  >
                    <span>Adicionar Mais Itens</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
