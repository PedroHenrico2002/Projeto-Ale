
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
import { addressService } from '@/services/supabaseService';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [address, setAddress] = useState('Selecione um endereço');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadDefaultAddress();
  }, [user]);

  const loadDefaultAddress = async () => {
    if (!user) {
      setAddress('Selecione um endereço');
      return;
    }

    try {
      const addresses = await addressService.getByUserId(user.id);
      const defaultAddress = addresses.find(addr => addr.is_default);
      
      if (defaultAddress) {
        const formattedAddress = `${defaultAddress.street}, ${defaultAddress.number}`;
        setAddress(formattedAddress);
      } else if (addresses.length > 0) {
        const formattedAddress = `${addresses[0].street}, ${addresses[0].number}`;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Erro ao carregar endereço:', error);
    }
  };

  /**
   * Função para realizar o logout do usuário
   * Remove dados da sessão e retorna à página inicial
   */
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleAddressChange = () => {
    loadDefaultAddress();
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div></div>
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-red-600">Be Legendary</h1>
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
              <div className="text-sm text-gray-500">
                Faça login para acessar todas as funcionalidades
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
