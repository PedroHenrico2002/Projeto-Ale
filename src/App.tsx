
/**
 * Componente principal da aplicação
 * 
 * Este componente configura:
 * 1. Provedor de consultas React Query para gerenciamento de estado e dados
 * 2. Sistema de notificações toast
 * 3. Sistema de tooltips
 * 4. Roteamento da aplicação
 */

import React from 'react';
import { Toaster } from "@/components/ui/toaster"; // Importa o componente de notificações toast (primeiro estilo)
import { Toaster as Sonner } from "@/components/ui/sonner"; // Importa o componente de notificações toast (segundo estilo)
import { TooltipProvider } from "@/components/ui/tooltip"; // Importa o provedor de tooltips
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importa o React Query para gerenciamento de estado
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importa componentes de roteamento

// Importação de todas as páginas da aplicação
import Index from "./pages/Index"; // Página inicial
import Login from "./pages/Login"; // Página de login
import Restaurants from "./pages/Restaurants"; // Página de listagem de restaurantes
import RestaurantDetails from "./pages/RestaurantDetails"; // Página de detalhes do restaurante
import FoodDetails from "./pages/FoodDetails"; // Página de detalhes do item de comida
import Cart from "./pages/Cart"; // Página do carrinho
import ConfirmOrder from "./pages/ConfirmOrder"; // Página de confirmação do pedido
import Checkout from "./pages/Checkout"; // Página de checkout/pagamento
import OrderComplete from "./pages/OrderComplete"; // Página de conclusão do pedido
import OrderTracking from "./pages/OrderTracking"; // Página de rastreamento de pedido
import OrderDetails from "./pages/OrderDetails"; // Página de detalhes do pedido
import Orders from "./pages/Orders"; // Página de lista de pedidos
import SystemDocumentation from "./pages/SystemDocumentation"; // Página de documentação do sistema
import NotFound from "./pages/NotFound"; // Página 404 - não encontrado
import { CrudManager } from "./components/CrudManager"; // Componente para gerenciar CRUD administrativo

/**
 * Componente App
 * 
 * Configura o ambiente da aplicação e define as rotas disponíveis
 */
const App = () => {
  // Cria uma nova instância de QueryClient para gerenciamento de estado e cache de dados
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}> {/* Provedor de contexto de React Query para toda aplicação */}
      <TooltipProvider> {/* Provedor de tooltips para toda aplicação */}
        {/* Sistemas de notificação toast (dois diferentes para mais opções de UI) */}
        <Toaster /> {/* Primeiro sistema de notificações toast */}
        <Sonner /> {/* Segundo sistema de notificações toast */}
        
        {/* Configura o roteamento da aplicação */}
        <BrowserRouter> {/* Componente principal de roteamento do React Router */}
          <Routes> {/* Container para definir as rotas disponíveis */}
            {/* Página inicial */}
            <Route path="/" element={<Index />} /> {/* Rota para a página inicial */}
            
            {/* Autenticação */}
            <Route path="/login" element={<Login />} /> {/* Rota para a página de login */}
            
            {/* Navegação de restaurantes e cardápio */}
            <Route path="/restaurants" element={<Restaurants />} /> {/* Rota para a listagem de restaurantes */}
            <Route path="/restaurants/:restaurantId" element={<RestaurantDetails />} /> {/* Rota para detalhes de um restaurante específico */}
            <Route path="/food/:restaurantId/:foodId" element={<FoodDetails />} /> {/* Rota para detalhes de um item de comida específico */}
            
            {/* Fluxo de pedido */}
            <Route path="/cart" element={<Cart />} /> {/* Rota para o carrinho de compras */}
            <Route path="/confirm-order" element={<ConfirmOrder />} /> {/* Rota para confirmação do pedido */}
            <Route path="/checkout" element={<Checkout />} /> {/* Rota para o checkout/pagamento */}
            <Route path="/order-complete" element={<OrderComplete />} /> {/* Rota para a confirmação de pedido finalizado */}
            
            {/* Gerenciamento de pedidos */}
            <Route path="/tracking" element={<OrderTracking />} /> {/* Rota para acompanhamento de pedido em tempo real */}
            <Route path="/order-details" element={<OrderDetails />} /> {/* Rota para detalhes de um pedido específico */}
            <Route path="/orders" element={<Orders />} /> {/* Rota para histórico de pedidos */}
            
            {/* Área administrativa e documentação */}
            <Route path="/documentation" element={<SystemDocumentation />} /> {/* Rota para documentação do sistema */}
            <Route path="/admin" element={<CrudManager />} /> {/* Rota para o painel administrativo CRUD */}
            
            {/* Rota curinga para capturar caminhos inexistentes */}
            <Route path="*" element={<NotFound />} /> {/* Rota para página 404 (não encontrado) */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App; // Exporta o componente App como padrão
