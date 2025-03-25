
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

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
      
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="page-container">
          <div className="flex justify-center">
            <button 
              onClick={scrollToTop}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground p-2 rounded-full btn-transition"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
