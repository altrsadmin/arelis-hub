import axios, { AxiosInstance } from 'axios';
import { 
  EvolutionApiConfig, 
  Instance, 
  CreateInstanceResponse,
  ConnectionState,
  InstanceError 
} from './types';

export class EvolutionApiClient {
  private client: AxiosInstance;

  constructor(config: EvolutionApiConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      }
    });
  }

  /**
   * Create a new WhatsApp instance
   */
  async createInstance(instanceName: string): Promise<Instance> {
    try {
      const response = await this.client.post<CreateInstanceResponse>('/instance/create', {
        instanceName,
        webhook: null, // We'll handle webhooks through our own system
        events: false  // We'll handle events through our own system
      });

      return {
        instanceName: response.data.instance.instanceName,
        status: response.data.instance.status as any,
        state: response.data.instance.state as any,
        qrcode: response.data.instance.qrcode || undefined
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all instances
   */
  async fetchInstances(): Promise<Instance[]> {
    try {
      const response = await this.client.get<{ instances: Instance[] }>('/instance/fetchInstances');
      return response.data.instances;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Connect an instance
   */
  async connectInstance(instanceName: string): Promise<void> {
    try {
      await this.client.post(`/instance/connect/${instanceName}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get instance connection state
   */
  async getConnectionState(instanceName: string): Promise<ConnectionState> {
    try {
      const response = await this.client.get<ConnectionState>(`/instance/connectionState/${instanceName}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout from an instance
   */
  async logoutInstance(instanceName: string): Promise<void> {
    try {
      await this.client.delete(`/instance/logout/${instanceName}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete an instance
   */
  async deleteInstance(instanceName: string): Promise<void> {
    try {
      await this.client.delete(`/instance/delete/${instanceName}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data) {
      const errorData = error.response.data as InstanceError;
      return new Error(`Evolution API Error: ${errorData.message}`);
    }
    return error;
  }

  /**
   * Set webhook configuration for an instance
   */
  async setWebhook(instanceName: string, config: WebhookConfig): Promise<WebhookConfig> {
    try {
      const response = await this.client.post<WebhookResponse>(
        `/webhook/set/${instanceName}`,
        config
      );
      return response.data.webhook;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get webhook configuration for an instance
   */
  async getWebhook(instanceName: string): Promise<WebhookConfig> {
    try {
      const response = await this.client.get<WebhookResponse>(
        `/webhook/get/${instanceName}`
      );
      return response.data.webhook;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Set instance settings
   */
  async setSettings(instanceName: string, settings: Settings): Promise<Settings> {
    try {
      const response = await this.client.post<SettingsResponse>(
        `/settings/set/${instanceName}`,
        settings
      );
      return response.data.settings;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}