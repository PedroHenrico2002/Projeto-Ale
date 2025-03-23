
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-display font-bold tracking-tight"
          >
            LegendaryFood
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md text-sm font-medium btn-transition ${
                location.pathname === '/' 
                  ? 'text-accent' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className={`px-4 py-2 rounded-md text-sm font-medium btn-transition ${
                location.pathname === '/restaurants' 
                  ? 'text-accent' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Restaurants
            </Link>
            <Link 
              to="/tracking" 
              className={`px-4 py-2 rounded-md text-sm font-medium btn-transition ${
                location.pathname === '/tracking' 
                  ? 'text-accent' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Track Order
            </Link>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative btn-transition text-foreground/80 hover:text-foreground"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <Link 
              to="/login" 
              className="hidden md:flex items-center"
              aria-label="User account"
            >
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User size={16} />
                <span>Login</span>
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden btn-transition text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`
          fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out md:hidden 
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ top: '60px' }}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`px-4 py-3 rounded-md text-lg font-medium ${
                location.pathname === '/' 
                  ? 'bg-accent/10 text-accent' 
                  : 'hover:bg-muted'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className={`px-4 py-3 rounded-md text-lg font-medium ${
                location.pathname === '/restaurants' 
                  ? 'bg-accent/10 text-accent' 
                  : 'hover:bg-muted'
              }`}
            >
              Restaurants
            </Link>
            <Link 
              to="/tracking" 
              className={`px-4 py-3 rounded-md text-lg font-medium ${
                location.pathname === '/tracking' 
                  ? 'bg-accent/10 text-accent' 
                  : 'hover:bg-muted'
              }`}
            >
              Track Order
            </Link>
            <Link 
              to="/login" 
              className={`px-4 py-3 rounded-md text-lg font-medium ${
                location.pathname === '/login' 
                  ? 'bg-accent/10 text-accent' 
                  : 'hover:bg-muted'
              }`}
            >
              Login / Sign Up
            </Link>
          </nav>
          
          <div className="mt-auto">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LegendaryFood
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
