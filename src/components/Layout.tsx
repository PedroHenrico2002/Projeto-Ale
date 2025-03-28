
/**
 * Componente de Layout Principal
 * 
 * Estrutura básica de todas as páginas, incluindo:
 * - Barra de navegação superior
 * - Área de conteúdo principal
 * - Rodapé com botão para retornar ao topo
 */

import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

// Define o tipo das props esperadas pelo componente
interface LayoutProps {
  children: ReactNode; // Conteúdo a ser renderizado dentro do layout
}

/**
 * Layout padrão da aplicação
 * @param children - Conteúdo a ser renderizado dentro do layout
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  /**
   * Função para rolar suavemente até o topo da página
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegação superior */}
      <Navbar />
      
      {/* Área de conteúdo principal */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Rodapé da página */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="page-container">
          <div className="flex justify-center">
            {/* Botão para voltar ao topo da página */}
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
