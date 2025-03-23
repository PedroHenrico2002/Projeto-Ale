
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Link } from 'react-router-dom';
import { ChevronUp, Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">LegendaryFood</h3>
              <p className="text-sm text-primary-foreground/80 max-w-xs">
                Delivering the best food experience to your doorstep with a wide variety of restaurants.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  Home
                </Link>
                <Link to="/restaurants" className="text-sm text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  Restaurants
                </Link>
                <Link to="/cart" className="text-sm text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  Your Cart
                </Link>
                <Link to="/profile" className="text-sm text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  Your Profile
                </Link>
              </nav>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Contact</h4>
              <div className="flex flex-col space-y-2">
                <a href="tel:+123456789" className="text-sm text-primary-foreground/80 hover:text-primary-foreground btn-transition flex items-center gap-2">
                  <Phone size={16} /> +1 234 567 890
                </a>
                <a href="mailto:support@legendaryfood.com" className="text-sm text-primary-foreground/80 hover:text-primary-foreground btn-transition flex items-center gap-2">
                  <Mail size={16} /> support@legendaryfood.com
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground btn-transition">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} LegendaryFood. All rights reserved.
            </p>
            <button 
              onClick={scrollToTop}
              className="mt-4 md:mt-0 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground p-2 rounded-full btn-transition"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
