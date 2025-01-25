import { EvolutionApiClient } from './client';
import { EvolutionApiConfig, Instance, ConnectionState } from './types';
import { EventEmitter } from 'events';

export class EvolutionApiService extends EventEmitter {
  private client: EvolutionApiClient;
  private instances: Map<string, Instance> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private webhookConfigs: Map<string, WebhookConfig> = new Map();
  private instanceSettings: Map<string, Settings> = new Map();

  constructor(config: EvolutionApiConfig) {
    super();
    this.client = new EvolutionApiClient(config);
  }

  /**
   * Configure webhook for an instance
   */
  async configureWebhook(
    instanceName: string,
    config: WebhookConfig
  ): Promise<WebhookConfig> {
    const webhook = await this.client.setWebhook(instanceName, config);
    this.webhookConfigs.set(instanceName, webhook);
    return webhook;
  }

  /**
   * Get webhook configuration for an instance
   */
  async getWebhookConfig(instanceName: string): Promise<WebhookConfig | undefined> {
    try {
      const webhook = await this.client.getWebhook(instanceName);
      this.webhookConfigs.set(instanceName, webhook);
      return webhook;
    } catch (error) {
      return this.webhookConfigs.get(instanceName);
    }
  }

  /**
   * Configure instance settings
   */
  async configureSettings(
    instanceName: string,
    settings: Settings
  ): Promise<Settings> {
    const updatedSettings = await this.client.setSettings(instanceName, settings);
    this.instanceSettings.set(instanceName, updatedSettings);
    return updatedSettings;
  }

  /**
   * Get instance settings
   */
  getSettings(instanceName: string): Settings | undefined {
    return this.instanceSettings.get(instanceName);
  }

  /**
   * Initialize instance monitoring
   */
  async initialize(): Promise<void> {
    // Fetch existing instances
    const instances = await this.client.fetchInstances();
    for (const instance of instances) {
      this.instances.set(instance.instanceName, instance);
      
      // Load webhook config
      try {
        const webhook = await this.client.getWebhook(instance.instanceName);
        this.webhookConfigs.set(instance.instanceName, webhook);
      } catch (error) {
        this.emit('error', { 
          instanceName: instance.instanceName, 
          error: new Error('Failed to load webhook config')
        });
      }
      
      // Start monitoring
      this.startPolling(instance.instanceName);
    }
  }

  /**
   * Create a new WhatsApp instance
   */
  async createInstance(instanceName: string): Promise<Instance> {
    const instance = await this.client.createInstance(instanceName);
    this.instances.set(instanceName, instance);
    this.startPolling(instanceName);
    return instance;
  }

  /**
   * Get instance by name
   */
  getInstance(instanceName: string): Instance | undefined {
    return this.instances.get(instanceName);
  }

  /**
   * Get all instances
   */
  getAllInstances(): Instance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Connect an instance
   */
  async connectInstance(instanceName: string): Promise<void> {
    await this.client.connectInstance(instanceName);
    this.startPolling(instanceName);
  }

  /**
   * Logout from an instance
   */
  async logoutInstance(instanceName: string): Promise<void> {
    await this.client.logoutInstance(instanceName);
    this.stopPolling(instanceName);
    this.instances.delete(instanceName);
  }

  /**
   * Delete an instance
   */
  async deleteInstance(instanceName: string): Promise<void> {
    await this.client.deleteInstance(instanceName);
    this.stopPolling(instanceName);
    this.instances.delete(instanceName);
  }

  /**
   * Start polling for instance state changes
   */
  private startPolling(instanceName: string): void {
    if (this.pollingIntervals.has(instanceName)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const state = await this.client.getConnectionState(instanceName);
        const instance = this.instances.get(instanceName);

        if (instance && (instance.state !== state.state || instance.qrcode !== state.qrcode)) {
          const previousState = instance.state;
          
          // Update instance state
          instance.state = state.state;
          instance.qrcode = state.qrcode;
          instance.number = state.number;
          
          // Emit state change event
          this.emit('stateChange', {
            instanceName,
            previousState,
            currentState: state.state,
            qrcode: state.qrcode,
            number: state.number
          });
        }
      } catch (error) {
        this.emit('error', { instanceName, error });
      }
    }, 3000); // Poll every 3 seconds

    this.pollingIntervals.set(instanceName, interval);
  }

  /**
   * Stop polling for instance state changes
   */
  private stopPolling(instanceName: string): void {
    const interval = this.pollingIntervals.get(instanceName);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(instanceName);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
    this.webhookConfigs.clear();
    this.instanceSettings.clear();
    this.instances.clear();
    this.removeAllListeners();
  }
}