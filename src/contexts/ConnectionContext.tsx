import * as React from 'react';
import { createContext, useContext, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/utils/logger';
import { useToast } from '../components/ui/Toast';

interface ConnectionContextType {
  isConnected: boolean;
  isChecking: boolean;
  checkConnection: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType>({
  isConnected: false,
  isChecking: true,
  checkConnection: async () => {},
});

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  // Função para verificar a conexão
  const checkConnectionFn = useCallback(async () => {
    try {
      const { error } = await supabase.from('customers').select('count');
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erro de conexão:', error);
      showToast('Erro ao conectar com o servidor. Verifique sua conexão.', 'error');
      return false;
    }
  }, [showToast]);

  // Query para verificar a conexão
  const { data: isConnected = false, isLoading: isChecking, refetch } = useQuery({
    queryKey: ['connection'],
    queryFn: checkConnectionFn,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Verifica a cada 30 segundos
  });

  // Função exposta para verificar a conexão manualmente
  const checkConnection = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Monitora mudanças na conexão
  useEffect(() => {
    if (isConnected) {
      showToast('Conexão estabelecida com sucesso!', 'success');
    }
  }, [isConnected, showToast]);

  const value = {
    isConnected,
    isChecking,
    checkConnection,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection deve ser usado dentro de um ConnectionProvider');
  }
  return context;
}
