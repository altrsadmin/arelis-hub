import { EventEmitter } from 'events';
import { 
  NotificameHubClient,
  NotificameHubConfig,
  SendMessageOptions,
  MessageResponse,
  MessageStatus,
  WebhookConfig,
  WebhookEvent
} from './';

export class NotificameHubService extends EventEmitter {
  private client: NotificameHubClient;
  private messageStatuses: Map<string, MessageStatus> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private webhookConfig?: WebhookConfig;

  constructor(config: NotificameHubConfig) {
    super();
    this.client = new NotificameHubClient(config);
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    try {
      // Load webhook configuration
      this.webhookConfig = await this.client.getWebhookConfig();
    } catch (error) {
      this.emit('error', error);
    }
  }

  /**
   * Send a message
   */
  async sendMessage(options: SendMessageOptions): Promise<MessageResponse> {
    const response = await this.client.sendMessage(options);
    
    // Start polling for message status
    this.startPolling(response.id);
    
    return response;
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    const status = await this.client.getMessageStatus(messageId);
    this.messageStatuses.set(messageId, status);
    return status;
  }

  /**
   * Configure webhook
   */
  async configureWebhook(config: WebhookConfig): Promise<void> {
    await this.client.configureWebhook(config);
    this.webhookConfig = config;
  }

  /**
   * Get webhook configuration
   */
  getWebhookConfig(): WebhookConfig | undefined {
    return this.webhookConfig;
  }

  /**
   * Handle incoming webhook event
   */
  handleWebhookEvent(event: WebhookEvent): void {
    const { type, data } = event;

    switch (type) {
      case 'message.status':
        this.handleMessageStatus(data);
        break;
      default:
        this.emit('webhookEvent', event);
    }
  }

  private handleMessageStatus(data: any): void {
    const status: MessageStatus = {
      id: data.messageId,
      status: data.status,
      timestamp: data.timestamp,
      error: data.error
    };

    this.messageStatuses.set(status.id, status);
    this.emit('messageStatus', status);

    // Stop polling if message reached final state
    if (['delivered', 'read', 'failed'].includes(status.status)) {
      this.stopPolling(status.id);
    }
  }

  /**
   * Start polling for message status
   */
  private startPolling(messageId: string): void {
    if (this.pollingIntervals.has(messageId)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const status = await this.getMessageStatus(messageId);
        
        // Stop polling if message reached final state
        if (['delivered', 'read', 'failed'].includes(status.status)) {
          this.stopPolling(messageId);
        }
      } catch (error) {
        this.emit('error', { messageId, error });
      }
    }, 5000); // Poll every 5 seconds

    this.pollingIntervals.set(messageId, interval);
  }

  /**
   * Stop polling for message status
   */
  private stopPolling(messageId: string): void {
    const interval = this.pollingIntervals.get(messageId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(messageId);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
    this.messageStatuses.clear();
    this.removeAllListeners();
  }
}