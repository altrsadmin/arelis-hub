import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Workflow } from '../../types/workflow';
import { logger } from '../utils/logger';

interface UseWorkflowsOptions {
  page?: number;
  limit?: number;
  filter?: string;
}

// Hook personalizado para buscar e gerenciar workflows
export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const {
    page = 1,
    limit = 10,
    filter = ''
  } = options;

  // Função para buscar workflows do Supabase
  const fetchWorkflows = async (): Promise<{ data: Workflow[]; count: number }> => {
    try {
      logger.debug('Buscando lista de workflows', { page, limit, filter });
      
      // Primeiro, buscar o total de registros para paginação
      const { count } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true });

      // Depois, buscar os dados com paginação
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          id,
          name,
          description,
          status,
          created_at,
          type:workflow_types(
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
        logger.error('Erro ao buscar workflows:', error);
        throw error;
      }

      logger.debug('Workflows encontrados:', { count: data?.length, total: count });
      return { 
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      logger.error('Erro inesperado ao buscar workflows:', error);
      throw error;
    }
  };

  // Usando o React Query para gerenciar o estado e cache dos dados
  const query = useQuery({
    queryKey: ['workflows', { page, limit, filter }],
    queryFn: fetchWorkflows,
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
