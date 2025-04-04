
/**
 * Operações CRUD genéricas para entidades do banco de dados
 */

import { initializeDatabase } from './utils'; // Importa função para inicializar o banco de dados
import { generateId } from './utils'; // Importa função para gerar IDs únicos

// Busca todas as entidades de um tipo específico
export const getAll = <T,>(entity: string): T[] => {
  initializeDatabase(); // Garante que o banco de dados está inicializado
  return JSON.parse(localStorage.getItem(entity) || '[]'); // Retorna os dados do localStorage ou um array vazio
};

// Busca uma entidade específica por ID
export const getById = <T,>(entity: string, id: string): T | undefined => {
  const items = getAll<T>(entity); // Obtém todas as entidades do tipo especificado
  return (items as any[]).find(item => item.id === id); // Retorna a entidade com o ID correspondente ou undefined
};

// Cria uma nova entidade
export const create = <T,>(entity: string, data: Omit<T, 'id'>): T => {
  const items = getAll<T>(entity); // Obtém todas as entidades existentes
  const newItem = { ...data, id: generateId() } as T; // Cria uma nova entidade com ID gerado
  localStorage.setItem(entity, JSON.stringify([...items, newItem])); // Salva no localStorage com a nova entidade adicionada
  return newItem; // Retorna a nova entidade criada
};

// Atualiza uma entidade existente
export const update = <T extends { id: string }>(entity: string, id: string, data: Partial<T>): T | undefined => {
  const items = getAll<T>(entity); // Obtém todas as entidades
  const itemIndex = (items as any[]).findIndex(item => item.id === id); // Encontra o índice da entidade a ser atualizada
  
  if (itemIndex === -1) return undefined; // Se não encontrou, retorna undefined
  
  const updatedItem = { ...items[itemIndex], ...data }; // Mescla os dados existentes com os novos
  const updatedItems = [...items]; // Cria uma cópia do array para não modificar o original
  updatedItems[itemIndex] = updatedItem; // Substitui a entidade antiga pela atualizada
  
  localStorage.setItem(entity, JSON.stringify(updatedItems)); // Salva a lista atualizada no localStorage
  return updatedItem; // Retorna a entidade atualizada
};

// Remove uma entidade
export const remove = <T extends { id: string }>(entity: string, id: string): boolean => {
  const items = getAll<T>(entity); // Obtém todas as entidades
  const filteredItems = (items as any[]).filter(item => item.id !== id); // Filtra removendo a entidade com o ID especificado
  
  if (filteredItems.length === items.length) return false; // Se o tamanho não mudou, a entidade não existia
  
  localStorage.setItem(entity, JSON.stringify(filteredItems)); // Salva a lista atualizada no localStorage
  return true; // Retorna true indicando sucesso na remoção
};
