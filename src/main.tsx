
/**
 * Arquivo principal da aplicação (Entry Point)
 * 
 * Este arquivo é o ponto de entrada da aplicação React.
 * Ele inicializa a renderização do componente App no elemento raiz do DOM.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
