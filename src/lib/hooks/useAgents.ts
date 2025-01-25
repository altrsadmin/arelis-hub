import { useState, useCallback } from 'react';
import { useQueryCache, useMutationCache } from './useQueryCache';
import type { ActiveAgent, AgentType } from '../../types/agent';

export function useAgents() {
  // Get active agents with customer and agent type data
  const { 
    data: agents,
    loading,
    error,
    refetch
  } = useQueryCache<ActiveAgent>('agent_aggregations', {
    select: `
      *,
      customer:customers(name, email),
      agent:agents(
        name,
        type:agent_types(name, description)
      )
    `,
    options: {
      count: 'exact'
    }
  });

  // Get available agent types
  const {
    data: agentTypes
  } = useQueryCache<AgentType>('agent_types');

  // Mutation for updating agent status
  const { mutate: updateStatus } = useMutationCache<ActiveAgent>(
    'agent_aggregations',
    {
      onSuccess: refetch
    }
  );

  // Toggle agent status
  const toggleStatus = useCallback(async (agent: ActiveAgent) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    
    await updateStatus({
      id: agent.id,
      status: newStatus,
      last_status_change_at: new Date().toISOString()
    });
  }, [updateStatus]);

  // Get stats
  const stats = {
    total: agents?.length || 0,
    active: agents?.filter(a => a.status === 'active').length || 0,
    paused: agents?.filter(a => a.status === 'paused').length || 0,
    totalExecutions: agents?.reduce((sum, a) => sum + a.current_executions, 0) || 0
  };

  return {
    agents,
    agentTypes,
    loading,
    error,
    stats,
    toggleStatus,
    refetch
  };
}