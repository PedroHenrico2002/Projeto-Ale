
/**
 * Operações CRUD genéricas para entidades do banco de dados
 */

import { initializeDatabase } from './utils';
import { generateId } from './utils';

// Busca todas as entidades de um tipo específico
export const getAll = <T,>(entity: string): T[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(entity) || '[]');
};

// Busca uma entidade específica por ID
export const getById = <T,>(entity: string, id: string): T | undefined => {
  const items = getAll<T>(entity);
  return (items as any[]).find(item => item.id === id);
};

// Cria uma nova entidade
export const create = <T,>(entity: string, data: Omit<T, 'id'>): T => {
  const items = getAll<T>(entity);
  const newItem = { ...data, id: generateId() } as T;
  localStorage.setItem(entity, JSON.stringify([...items, newItem]));
  return newItem;
};

// Atualiza uma entidade existente
export const update = <T extends { id: string }>(entity: string, id: string, data: Partial<T>): T | undefined => {
  const items = getAll<T>(entity);
  const itemIndex = (items as any[]).findIndex(item => item.id === id);
  
  if (itemIndex === -1) return undefined;
  
  const updatedItem = { ...items[itemIndex], ...data };
  const updatedItems = [...items];
  updatedItems[itemIndex] = updatedItem;
  
  localStorage.setItem(entity, JSON.stringify(updatedItems));
  return updatedItem;
};

// Remove uma entidade
export const remove = <T extends { id: string }>(entity: string, id: string): boolean => {
  const items = getAll<T>(entity);
  const filteredItems = (items as any[]).filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  localStorage.setItem(entity, JSON.stringify(filteredItems));
  return true;
};
