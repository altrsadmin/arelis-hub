import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '../utils/errors';
import { publishEvent } from './webhookProcessor';

interface ListAgentsOptions {
  status?: string;
  customerId?: string;
  page: number;
  perPage: number;
}

export async function listAgents(supabase: SupabaseClient, options: ListAgentsOptions) {
  let query = supabase
    .from('agent_aggregations')
    .select('*');

  if (options.status) {
    query = query.eq('status', options.status);
  }

  if (options.customerId) {
    query = query.eq('customer_id', options.customerId);
  }

  const { data: agents, error, count } = await query
    .range(
      (options.page - 1) * options.perPage,
      options.page * options.perPage - 1
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(500, 'Failed to list agents');
  }

  return {
    data: agents,
    pagination: {
      page: options.page,
      per_page: options.perPage,
      total: count
    }
  };
}

export async function getAgent(supabase: SupabaseClient, uuid: string) {
  const { data: agent, error } = await supabase
    .from('agent_aggregations')
    .select('*')
    .eq('uuid', uuid)
    .single();

  if (error) {
    throw new ApiError(500, 'Failed to get agent');
  }

  return agent;
}

export async function updateAgentStatus(
  supabase: SupabaseClient,
  uuid: string,
  status: string
) {
  const { data: agent, error } = await supabase
    .from('agent_aggregations')
    .update({ status })
    .eq('uuid', uuid)
    .select()
    .single();

  if (error) {
    throw new ApiError(500, 'Failed to update agent status');
  }

  // Publish event for webhooks
  await publishEvent('agent.status.changed', {
    agent_uuid: uuid,
    previous_status: agent.status,
    new_status: status
  });

  return agent;
}

export async function getAgentMetrics(supabase: SupabaseClient, uuid: string) {
  const { data: agent, error } = await supabase
    .from('agent_aggregations')
    .select(`
      current_executions,
      max_executions,
      last_execution_at,
      execution_history
    `)
    .eq('uuid', uuid)
    .single();

  if (error) {
    throw new ApiError(500, 'Failed to get agent metrics');
  }

  return {
    current_executions: agent.current_executions,
    max_executions: agent.max_executions,
    last_execution_at: agent.last_execution_at,
    execution_history: agent.execution_history
  };
}