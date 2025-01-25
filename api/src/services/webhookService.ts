import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '../utils/errors';
import { verifyWebhookSignature } from '../utils/crypto';

export async function listWebhooks(supabase: SupabaseClient) {
  const { data: webhooks, error } = await supabase
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(500, 'Failed to list webhooks');
  }

  return webhooks;
}

export async function createWebhook(supabase: SupabaseClient, data: any) {
  const { data: webhook, error } = await supabase
    .from('webhooks')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new ApiError(500, 'Failed to create webhook');
  }

  return webhook;
}

export async function deleteWebhook(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('webhooks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new ApiError(500, 'Failed to delete webhook');
  }
}

export async function processWebhook(
  supabase: SupabaseClient,
  id: string,
  signature: string,
  payload: any
) {
  const { data: webhook, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !webhook) {
    throw new ApiError(404, 'Webhook not found');
  }

  // Verify signature
  if (!verifyWebhookSignature(payload, signature, webhook.secret)) {
    throw new ApiError(401, 'Invalid webhook signature');
  }

  // Process webhook based on type
  switch (payload.type) {
    case 'agent.status.changed':
      await handleAgentStatusChange(supabase, payload);
      break;
    // Add other webhook types as needed
  }
}

async function handleAgentStatusChange(supabase: SupabaseClient, payload: any) {
  const { agent_uuid, new_status } = payload.data;

  const { error } = await supabase
    .from('agent_aggregations')
    .update({ status: new_status })
    .eq('uuid', agent_uuid);

  if (error) {
    throw new ApiError(500, 'Failed to process webhook');
  }
}