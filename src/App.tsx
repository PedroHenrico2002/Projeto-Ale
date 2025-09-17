import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { CartButton } from "@/components/CartButton";

// Public pages
import { Auth } from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import Index from "@/pages/Index";
import Restaurants from "@/pages/Restaurants";
import RestaurantDetails from "@/pages/RestaurantDetails";
import FoodDetails from "@/pages/FoodDetails";
import NotFound from "@/pages/NotFound";
import SystemDocumentation from "@/pages/SystemDocumentation";
import { CrudManager } from "./components/CrudManager";

// Protected pages
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import ConfirmOrder from "@/pages/ConfirmOrder";
import OrderComplete from "@/pages/OrderComplete";
import OrderTracking from "@/pages/OrderTracking";
import OrderDetails from "@/pages/OrderDetails";
import Orders from "@/pages/Orders";

// Create QueryClient outside component to prevent recreation
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Index />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:restaurantId" element={<RestaurantDetails />} />
            <Route path="/food/:restaurantId/:foodId" element={<FoodDetails />} />
            <Route path="/documentation" element={<SystemDocumentation />} />
            
            {/* Protected routes */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/confirm-order" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
            <Route path="/order-complete" element={<ProtectedRoute><OrderComplete /></ProtectedRoute>} />
            <Route path="/tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="/order-details" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><CrudManager /></ProtectedRoute>} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <CartButton />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;