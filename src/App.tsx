
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
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importação de todas as páginas da aplicação
import Index from "./pages/Index";
import Login from "./pages/Login";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import ConfirmOrder from "./pages/ConfirmOrder";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import OrderTracking from "./pages/OrderTracking";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import SystemDocumentation from "./pages/SystemDocumentation";
import NotFound from "./pages/NotFound";
import { CrudManager } from "./components/CrudManager";

/**
 * Componente App
 * 
 * Configura o ambiente da aplicação e define as rotas disponíveis
 */
const App = () => {
  // Cria uma nova instância de QueryClient para gerenciamento de estado e cache de dados
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Sistemas de notificação toast (dois diferentes para mais opções de UI) */}
        <Toaster />
        <Sonner />
        
        {/* Configura o roteamento da aplicação */}
        <BrowserRouter>
          <Routes>
            {/* Página inicial */}
            <Route path="/" element={<Index />} />
            
            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            
            {/* Navegação de restaurantes e cardápio */}
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:restaurantId" element={<RestaurantDetails />} />
            <Route path="/food/:restaurantId/:foodId" element={<FoodDetails />} />
            
            {/* Fluxo de pedido */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/confirm-order" element={<ConfirmOrder />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-complete" element={<OrderComplete />} />
            
            {/* Gerenciamento de pedidos */}
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* Área administrativa e documentação */}
            <Route path="/documentation" element={<SystemDocumentation />} />
            <Route path="/admin" element={<CrudManager />} />
            
            {/* Rota curinga para capturar caminhos inexistentes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
