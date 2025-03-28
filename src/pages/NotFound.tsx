
/**
 * Página de Erro 404 (Não Encontrado)
 * 
 * Esta página é exibida quando o usuário tenta acessar uma rota que não existe.
 * Também registra um log do erro no console para fins de depuração.
 */

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Componente NotFound
 * 
 * Exibe uma mensagem amigável quando uma página não é encontrada
 * e registra o erro no console para facilitar a depuração
 */
const NotFound = () => {
  // Obtém informações sobre a rota atual
  const location = useLocation();

  // Registra o erro no console quando o componente é montado
  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Ops! Página não encontrada</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar para a Página Inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;
