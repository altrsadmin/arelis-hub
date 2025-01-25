import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Connector } from '../../types/connector';
import { logger } from '../utils/logger';

interface UseConnectorsOptions {
  page?: number;
  limit?: number;
  filter?: string;
}

// Hook personalizado para buscar e gerenciar conectores
export function useConnectors(options: UseConnectorsOptions = {}) {
  const {
    page = 1,
    limit = 10,
    filter = ''
  } = options;

  // Função para buscar conectores do Supabase
  const fetchConnectors = async (): Promise<{ data: Connector[]; count: number }> => {
    try {
      logger.debug('Buscando lista de conectores', { page, limit, filter });
      
      // Primeiro, buscar o total de registros para paginação
      const { count } = await supabase
        .from('connectors')
        .select('*', { count: 'exact', head: true });

      // Depois, buscar os dados com paginação
      const { data, error } = await supabase
        .from('connectors')
        .select(`
          id,
          name,
          description,
          status,
          created_at,
          type:connector_types(
            id,
            name
          ),
          customer:customers(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        logger.error('Erro ao buscar conectores:', error);
        throw error;
      }

      logger.debug('Conectores encontrados:', { count: data?.length, total: count });
      return { 
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      logger.error('Erro inesperado ao buscar conectores:', error);
      throw error;
    }
  };

  // Usando o React Query para gerenciar o estado e cache dos dados
  const query = useQuery({
    queryKey: ['connectors', { page, limit, filter }],
    queryFn: fetchConnectors,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    keepPreviousData: true, // Mantém os dados antigos enquanto carrega os novos
    refetchOnWindowFocus: false, // Não recarrega ao focar a janela
    refetchOnMount: false // Não recarrega ao montar o componente se tiver cache
  });

  return {
    data: query.data?.data || [],
    totalCount: query.data?.count || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isPreviousData: query.isPreviousData
  };
}
