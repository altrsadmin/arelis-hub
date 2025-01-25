import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Customer } from '../../types/customer';
import { logger } from '../utils/logger';

// Hook personalizado para buscar e gerenciar clientes
export function useCustomers() {
  // Função para buscar clientes do Supabase
  const fetchCustomers = async (): Promise<Customer[]> => {
    try {
      logger.debug('Buscando lista de clientes');
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Erro ao buscar clientes:', error);
        throw error;
      }

      logger.debug('Clientes encontrados:', { count: data?.length });
      return data || [];
    } catch (error) {
      logger.error('Erro inesperado ao buscar clientes:', error);
      throw error;
    }
  };

  // Usando o React Query para gerenciar o estado e cache dos dados
  const query = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
