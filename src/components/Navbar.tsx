
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, ChevronDown, ShoppingBag } from 'lucide-react';
import { AddressDialog } from './AddressDialog';

export const Navbar: React.FC = () => {
  const [address, setAddress] = useState('Rua Augusta, 1500');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(user.name);
    }
    
    // Get default address
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };
  
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress.split(' - ')[0]); // Only show street and number in navbar
    
    // Update address in order details if on order details page
    const orderDetails = sessionStorage.getItem('orderDetails');
    if (orderDetails) {
      const parsedOrder = JSON.parse(orderDetails);
      parsedOrder.address = newAddress;
      sessionStorage.setItem('orderDetails', JSON.stringify(parsedOrder));
      
      // Refresh the page if on order details page to reflect the address change
      if (window.location.pathname.includes('order-details')) {
        window.location.reload();
      }
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Location */}
          <div className="flex items-center text-sm">
            <MapPin size={18} className="text-red-500 mr-1" />
            <button 
              className="text-gray-800 hover:text-red-600 transition-colors flex items-center"
              onClick={() => setShowAddressDialog(true)}
            >
              <span>{address}</span>
              <ChevronDown size={16} className="ml-1 text-red-500" />
            </button>
            
            <AddressDialog 
              open={showAddressDialog} 
              onOpenChange={setShowAddressDialog}
              onAddressChange={handleAddressChange}
            />
          </div>
          
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-red-600">Be Legendary</h1>
            </Link>
            
            <Link to="/orders" className="text-sm text-gray-700 hover:text-red-600 flex items-center">
              <ShoppingBag size={16} className="mr-1" />
              Pedidos
            </Link>
          </div>
          
          {/* Auth */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <User size={18} className="text-red-600" />
                <span className="text-sm text-gray-800">{userName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 ml-2"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-red-600 hover:text-red-700">
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
