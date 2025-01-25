import { EvolutionApiService } from '@arelis/evolution-api';
import { NotificameHubService } from '@arelis/notificame-hub';
import { supabase } from '../supabase';

interface AgentServiceConfig {
  evolutionApi: {
    baseUrl: string;
    apiKey: string;
  };
  notificameHub: {
    apiKey: string;
  };
}

class AgentService {
  private evolutionApi: EvolutionApiService;
  private notificameHub: NotificameHubService;
  private webhookUrl: string;

  constructor(config: AgentServiceConfig) {
    this.evolutionApi = new EvolutionApiService(config.evolutionApi);
    this.notificameHub = new NotificameHubService(config.notificameHub);
    
    // Webhook URL will be set by the backend
    this.webhookUrl = process.env.WEBHOOK_URL || '';

    // Handle Evolution API events
    this.evolutionApi.on('stateChange', this.handleEvolutionStateChange.bind(this));
    this.evolutionApi.on('error', this.handleEvolutionError.bind(this));

    // Handle NotificaMe events
    this.notificameHub.on('messageStatus', this.handleNotificameStatus.bind(this));
    this.notificameHub.on('error', this.handleNotificameError.bind(this));
  }

  async initialize() {
    await Promise.all([
      this.evolutionApi.initialize(),
      this.notificameHub.initialize()
    ]);
  }

  async createInstance(agentId: string, type: string) {
    switch (type) {
      case 'evolution-api-v2':
        return this.createEvolutionInstance(agentId);
      case 'notificame-hub':
        return this.createNotificameInstance(agentId);
      default:
        throw new Error(`Unsupported agent type: ${type}`);
    }
  }

  private async createEvolutionInstance(agentId: string) {
    // Create instance with unique name
    const instanceName = `agent_${agentId}_${Date.now()}`;
    const instance = await this.evolutionApi.createInstance(instanceName);

    // Configure webhook
    await this.evolutionApi.configureWebhook(instanceName, {
      enabled: true,
      url: `${this.webhookUrl}/evolution/${instanceName}`,
      webhook_by_events: true,
      events: [
        'messages.upsert',
        'messages.update',
        'connection.update'
      ]
    });

    // Configure settings
    await this.evolutionApi.configureSettings(instanceName, {
      reject_call: true,
      msg_call: 'Calls are not supported',
      groups_ignore: true,
      always_online: true,
      read_messages: true
    });

    return {
      instanceName,
      status: instance.status,
      state: instance.state,
      qrcode: instance.qrcode
    };
  }

  private async createNotificameInstance(agentId: string) {
    // Configure webhook for the instance
    await this.notificameHub.configureWebhook({
      url: `${this.webhookUrl}/notificame/${agentId}`,
      events: ['message.status'],
      secret: process.env.WEBHOOK_SECRET || 'default-secret'
    });

    return {
      instanceName: `notificame_${agentId}`,
      status: 'active',
      state: 'connected'
    };
  }

  async connectInstance(instanceName: string, type: string) {
    if (type === 'evolution-api-v2') {
      await this.evolutionApi.connectInstance(instanceName);
    }
    // NotificaMe doesn't require explicit connection
  }

  async disconnectInstance(instanceName: string, type: string) {
    if (type === 'evolution-api-v2') {
      await this.evolutionApi.logoutInstance(instanceName);
    }
  }

  async deleteInstance(instanceName: string, type: string) {
    if (type === 'evolution-api-v2') {
      await this.evolutionApi.deleteInstance(instanceName);
    }
  }

  private async handleEvolutionStateChange(event: any) {
    const { instanceName, currentState, qrcode } = event;

    // Update instance status in database
    await supabase
      .from('agent_instances')
      .update({
        state: currentState,
        qrcode: qrcode || null,
        updated_at: new Date().toISOString()
      })
      .eq('instance_name', instanceName);
  }

  private async handleEvolutionError(error: any) {
    console.error('Evolution API Error:', error);
    // Log error and potentially notify monitoring system
  }

  private async handleNotificameStatus(status: any) {
    // Update message status in database
    await supabase
      .from('message_status')
      .update({
        status: status.status,
        error: status.error || null,
        updated_at: new Date().toISOString()
      })
      .eq('message_id', status.id);
  }

  private async handleNotificameError(error: any) {
    console.error('NotificaMe Error:', error);
    // Log error and potentially notify monitoring system
  }

  destroy() {
    this.evolutionApi.destroy();
    this.notificameHub.destroy();
  }
}

// Create singleton instance
export const agentService = new AgentService({
  evolutionApi: {
    baseUrl: process.env.EVOLUTION_API_URL || '',
    apiKey: process.env.EVOLUTION_API_KEY || ''
  },
  notificameHub: {
    apiKey: process.env.NOTIFICAME_API_KEY || ''
  }
});