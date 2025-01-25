import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '../utils/errors';
import axios from 'axios';
import { generateWebhookSignature } from '../utils/crypto';

let supabaseClient: SupabaseClient;

export function setupWebhookProcessor(supabase: SupabaseClient) {
  supabaseClient = supabase;
  startWebhookProcessor();
}

export async function publishEvent(type: string, data: any) {
  const event = {
    id: `evt_${Date.now()}`,
    type,
    created: new Date().toISOString(),
    data
  };

  const { error } = await supabaseClient
    .from('webhook_events')
    .insert([{ ...event, status: 'pending' }]);

  if (error) {
    throw new ApiError(500, 'Failed to publish event');
  }
}

async function startWebhookProcessor() {
  setInterval(async () => {
    try {
      // Get pending events
      const { data: events, error } = await supabaseClient
        .from('webhook_events')
        .select('*')
        .eq('status', 'pending')
        .limit(100);

      if (error) {
        console.error('Failed to fetch webhook events:', error);
        return;
      }

      // Process each event
      for (const event of events) {
        await processEvent(event);
      }
    } catch (error) {
      console.error('Webhook processor error:', error);
    }
  }, 5000); // Run every 5 seconds
}

async function processEvent(event: any) {
  try {
    // Get webhooks subscribed to this event type
    const { data: webhooks, error } = await supabaseClient
      .from('webhooks')
      .select('*')
      .contains('events', [event.type]);

    if (error) {
      throw error;
    }

    // Send event to each webhook
    for (const webhook of webhooks) {
      try {
        const signature = generateWebhookSignature(event, webhook.secret);

        await axios.post(webhook.url, event, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature
          },
          timeout: 5000
        });

        // Update delivery status
        await supabaseClient
          .from('webhook_deliveries')
          .insert([{
            webhook_id: webhook.id,
            event_id: event.id,
            status: 'delivered'
          }]);

      } catch (error) {
        // Log failed delivery
        await supabaseClient
          .from('webhook_deliveries')
          .insert([{
            webhook_id: webhook.id,
            event_id: event.id,
            status: 'failed',
            error: error.message
          }]);
      }
    }

    // Mark event as processed
    await supabaseClient
      .from('webhook_events')
      .update({ status: 'processed' })
      .eq('id', event.id);

  } catch (error) {
    console.error('Failed to process event:', error);
    
    // Mark event as failed
    await supabaseClient
      .from('webhook_events')
      .update({ 
        status: 'failed',
        error: error.message
      })
      .eq('id', event.id);
  }
}