
/**
 * Componente de Navegação Principal
 * 
 * Este componente exibe a barra de navegação superior presente em todas as páginas,
 * gerenciando o endereço de entrega, login/logout do usuário e links rápidos.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, ChevronDown, ShoppingBag, Settings } from 'lucide-react';
import { AddressDialog } from './AddressDialog';
import { useAuth } from '@/hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  // Estados locais para gerenciar informações do usuário e endereço
  const [address, setAddress] = useState('Rua Augusta, 1500');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const navigate = useNavigate();
  
  /**
   * Effect para carregar endereço padrão quando o componente é montado
   */
  useEffect(() => {
    // Carrega o endereço padrão salvo (se existir)
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedAddresses) {
      const addresses = JSON.parse(storedAddresses);
      const defaultAddress = addresses.find((addr: any) => addr.isDefault);
      if (defaultAddress) {
        const formattedAddress = `${defaultAddress.street}, ${defaultAddress.number}`;
        setAddress(formattedAddress);
      }
    }
  }, []);

  /**
   * Função para realizar o logout do usuário
   * Remove dados da sessão e retorna à página inicial
   */
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  /**
   * Função para atualizar o endereço de entrega selecionado
   * @param newAddress - Novo endereço selecionado pelo usuário
   */
  const handleAddressChange = (newAddress: string) => {
    // Atualiza o endereço exibido na barra de navegação (apenas rua e número)
    setAddress(newAddress.split(' - ')[0]);
    
    // Atualiza o endereço nos detalhes do pedido (se estiver na página de detalhes)
    const orderDetails = sessionStorage.getItem('orderDetails');
    if (orderDetails) {
      const parsedOrder = JSON.parse(orderDetails);
      parsedOrder.address = newAddress;
      sessionStorage.setItem('orderDetails', JSON.stringify(parsedOrder));
      
      // Atualiza a página se estiver na tela de detalhes do pedido
      if (window.location.pathname.includes('order-details')) {
        window.location.reload();
      }
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Seção de localização/endereço */}
          <div className="flex items-center text-sm">
            <MapPin size={18} className="text-red-500 mr-1" />
            <button 
              className="text-gray-800 hover:text-red-600 transition-colors flex items-center"
              onClick={() => setShowAddressDialog(true)}
            >
              <span>{address}</span>
              <ChevronDown size={16} className="ml-1 text-red-500" />
            </button>
            
            {/* Diálogo para seleção de endereço */}
            <AddressDialog 
              open={showAddressDialog} 
              onOpenChange={setShowAddressDialog}
              onAddressChange={handleAddressChange}
            />
          </div>
          
          {/* Logo e links principais */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-red-600">Be Legendary</h1>
            </Link>
            
            <Link to="/orders" className="text-sm text-gray-700 hover:text-red-600 flex items-center">
              <ShoppingBag size={16} className="mr-1" />
              Pedidos
            </Link>
            
            <Link to="/admin" className="text-sm text-gray-700 hover:text-red-600 flex items-center">
              <Settings size={16} className="mr-1" />
              Admin
            </Link>
          </div>
          
          {/* Área de autenticação */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="flex items-center space-x-2 hover:text-red-600 transition-colors">
                  <User size={18} className="text-red-600" />
                  <span className="text-sm text-gray-800">Perfil</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 ml-2"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-sm text-red-600 hover:text-red-700">
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
