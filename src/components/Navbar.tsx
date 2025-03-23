
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [address, setAddress] = useState('Rua Augusta, 1500');
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Location */}
          <div className="flex items-center text-sm">
            <MapPin size={18} className="text-red-500 mr-1" />
            <span className="text-gray-800">{address}</span>
            <button className="text-primary ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-red-600">Be Legendary</h1>
          </Link>
          
          {/* Auth */}
          <div className="flex items-center">
            <Link to="/login" className="text-sm text-red-600 hover:text-red-700">
              Entrar / Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
