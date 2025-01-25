import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      logger.debug('Lendo do localStorage', { key, hasValue: !!item });
      
      if (!item) {
        return initialValue;
      }

      try {
        const parsedItem = JSON.parse(item);
        return parsedItem;
      } catch (parseError) {
        logger.error('Erro ao fazer parse do valor do localStorage', parseError as Error);
        return initialValue;
      }
    } catch (error) {
      logger.error('Erro ao ler do localStorage', error as Error);
      return initialValue;
    }
  });

  // Função para atualizar o valor no localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permite passar uma função para atualizar o valor
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salva no state
      setStoredValue(valueToStore);
      
      // Salva no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        logger.debug('Escrevendo no localStorage', { key, value: valueToStore });
      }
    } catch (error) {
      logger.error('Erro ao escrever no localStorage', error as Error);
    }
  }, [key, storedValue]);

  // Sincroniza com outros componentes que usam o mesmo key
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
          logger.debug('Valor do localStorage atualizado externamente', { key, newValue });
        } catch (error) {
          logger.error('Erro ao processar mudança do localStorage', error as Error);
        }
      }
    }

    // Adiciona listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Remove listener na desmontagem
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}