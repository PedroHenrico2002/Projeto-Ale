
/**
 * Arquivo principal da aplicação (Entry Point)
 * 
 * Este arquivo é o ponto de entrada da aplicação React.
 * Ele inicializa a renderização do componente App no elemento raiz do DOM.
 */

import React from 'react'; // Importa o núcleo do React
import { createRoot } from 'react-dom/client'; // Importa a API de renderização do React 18
import App from './App.tsx'; // Importa o componente principal da aplicação
import './index.css'; // Importa os estilos globais da aplicação

// Seleciona o elemento raiz onde a aplicação React será montada
const rootElement = document.getElementById('root');

// Verifica se o elemento raiz existe no DOM
if (!rootElement) {
  throw new Error('Elemento raiz não encontrado - verifique se existe um elemento com id="root" no HTML');
}

// Cria uma raiz React usando a nova API createRoot do React 18
const root = createRoot(rootElement);

// Renderiza o componente App dentro do modo StrictMode para detectar problemas potenciais
root.render(
  <React.StrictMode> {/* Ativa verificações adicionais durante o desenvolvimento */}
    <App /> {/* Renderiza o componente principal App */}
  </React.StrictMode>
);
