import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { logger } from '../utils/logger';
import { useConnection } from '../../contexts/ConnectionContext';
import { useToast } from '../../components/ui/Toast';

// Interface para opções de consulta
interface QueryOptions<T> {
  // Filtro para a consulta
  filter?: Record<string, any>;
  // Ordenação para a consulta
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  // Limite de registros para a consulta
  limit?: number;
  // Offset para a consulta
  offset?: number;
  // Inclusão de relacionamentos para a consulta
  include?: string[];
  // Seleção de colunas para a consulta
  select?: string[];
}

// Interface para opções de mutação
interface MutationOptions<T> {
  // ID do registro para a mutação
  id?: string;
  // Função de callback para sucesso na mutação
  onSuccess?: (data: T) => void;
  // Função de callback para erro na mutação
  onError?: (error: Error) => void;
}

// Interface para opções de deleção
interface DeleteOptions<T> {
  // Função de callback para sucesso na deleção
  onSuccess?: () => void;
  // Função de callback para erro na deleção
  onError?: (error: Error) => void;
}

// Função padrão para consultas
const defaultQueryFn = async <T>(key: string, options?: QueryOptions<T>): Promise<T> => {
  try {
    // Verifica se há conexão com o servidor
    const { isConnected } = useConnection();
    if (!isConnected) {
      throw new Error('Sem conexão com o servidor');
    }

    // Cria a consulta
    let query = supabase.from(key).select('*');

    // Aplica filtros
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Aplica ordenação
    if (options?.orderBy) {
      query = query.order(
        options.orderBy.column,
        { ascending: options.orderBy.ascending ?? true }
      );
    }

    // Executa a consulta
    const { data, error } = await query;

    // Verifica se houve erro
    if (error) {
      throw error;
    }

    // Verifica se há dados
    if (!data) {
      throw new Error('Nenhum dado encontrado');
    }

    // Registra o sucesso da consulta
    logger.info(`Dados carregados com sucesso da tabela ${key}`);
    return data as T;
  } catch (error) {
    // Registra o erro da consulta
    logger.error(`Erro ao carregar dados da tabela ${key}:`, error);
    throw error;
  }
};

// Função padrão para mutações (criar/atualizar)
const defaultMutationFn = async <T>({ key, data }: { key: string; data: Partial<T>; id?: string }): Promise<T> => {
  try {
    // Verifica se há conexão com o servidor
    const { isConnected } = useConnection();
    if (!isConnected) {
      throw new Error('Sem conexão com o servidor');
    }

    // Cria a mutação
    let query = supabase.from(key);

    // Verifica se é uma atualização
    if (data.id) {
      // Atualização
      const { data: updatedData, error } = await query
        .update(data)
        .eq('id', data.id)
        .select()
        .single();

      // Verifica se houve erro
      if (error) throw error;
      return updatedData as T;
    } else {
      // Inserção
      const { data: insertedData, error } = await query
        .insert(data)
        .select()
        .single();

      // Verifica se houve erro
      if (error) throw error;
      return insertedData as T;
    }
  } catch (error) {
    // Registra o erro da mutação
    logger.error(`Erro na mutação da tabela ${key}:`, error);
    throw error;
  }
};

// Função padrão para deleção
const defaultDeleteFn = async (key: string, id: string): Promise<void> => {
  try {
    // Verifica se há conexão com o servidor
    const { isConnected } = useConnection();
    if (!isConnected) {
      throw new Error('Sem conexão com o servidor');
    }

    // Executa a deleção
    const { error } = await supabase
      .from(key)
      .delete()
      .eq('id', id);

    // Verifica se houve erro
    if (error) throw error;
  } catch (error) {
    // Registra o erro da deleção
    logger.error('Delete error', error as Error);
    throw error;
  }
};

// Hook para consultas com cache
export function useQueryCache<T>(
  key: string,
  options?: QueryOptions<T>,
  queryOptions?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  // Cria o cliente de cache
  const queryClient = useQueryClient();
  // Obtém a conexão
  const { isConnected } = useConnection();
  // Obtém o toast
  const { showToast } = useToast();

  // Cria a consulta com cache
  return useQuery<T, Error>({
    queryKey: [key, options],
    queryFn: () => defaultQueryFn<T>(key, options),
    enabled: isConnected,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    ...queryOptions,
    onError: (error) => {
      // Registra o erro da consulta
      logger.error(`Erro na consulta ${key}:`, error);
      // Mostra o toast de erro
      showToast({
        type: 'error',
        message: `Erro ao carregar dados: ${error.message}`
      });
    }
  });
}

// Hook para mutações com cache
export function useMutationCache<T>(
  key: string,
  options?: MutationOptions<T>,
  mutationOptions?: Omit<UseMutationOptions<T, Error, Partial<T>>, 'mutationFn'>
) {
  // Cria o cliente de cache
  const queryClient = useQueryClient();
  // Obtém a conexão
  const { isConnected } = useConnection();
  // Obtém o toast
  const { showToast } = useToast();

  // Cria a mutação com cache
  return useMutation<T, Error, Partial<T>>({
    mutationFn: (data) => defaultMutationFn<T>({ key, data, id: options?.id }),
    onSuccess: (data) => {
      // Invalida o cache após uma mutação bem-sucedida
      queryClient.invalidateQueries({ queryKey: [key] });
      // Registra o sucesso da mutação
      logger.info(`Mutação bem-sucedida na tabela ${key}`);
      // Chama a função de callback de sucesso
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // Registra o erro da mutação
      logger.error(`Erro na mutação da tabela ${key}:`, error);
      // Mostra o toast de erro
      showToast({
        type: 'error',
        message: `Erro ao realizar mutação: ${error.message}`
      });
      // Chama a função de callback de erro
      options?.onError?.(error);
    },
    ...mutationOptions,
  });
}

// Hook para deleção com cache
export function useDeleteCache<T>(
  key: string,
  options?: DeleteOptions<T>,
  mutationOptions?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) {
  // Cria o cliente de cache
  const queryClient = useQueryClient();
  // Obtém a conexão
  const { isConnected } = useConnection();
  // Obtém o toast
  const { showToast } = useToast();

  // Cria a deleção com cache
  return useMutation<void, Error, string>({
    mutationFn: (id) => defaultDeleteFn(key, id),
    onSuccess: () => {
      // Invalida o cache após uma deleção bem-sucedida
      queryClient.invalidateQueries({ queryKey: [key] });
      // Chama a função de callback de sucesso
      options?.onSuccess?.();
    },
    onError: (error) => {
      // Registra o erro da deleção
      logger.error('Delete error', error as Error);
      // Mostra o toast de erro
      showToast({
        type: 'error',
        message: `Erro ao deletar: ${error.message}`
      });
      // Chama a função de callback de erro
      options?.onError?.(error);
    },
    ...mutationOptions,
  });
}

// Hook para limpar o cache de consultas
export const useClearQueryCache = () => {
  const queryClient = useQueryClient();
  return () => {
    logger.info('Limpando cache de consultas');
    return queryClient.clear();
  };
};