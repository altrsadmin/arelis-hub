import axios, { AxiosInstance } from 'axios';
import { 
  NotificameHubConfig,
  SendMessageOptions,
  MessageResponse,
  MessageStatus,
  WebhookConfig,
  NotificameError
} from './types';

export class NotificameHubClient {
  private client: AxiosInstance;
  private static readonly DEFAULT_BASE_URL = 'https://hub.notificame.com.br/api/v1';

  constructor(config: NotificameHubConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl || NotificameHubClient.DEFAULT_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    });
  }

  /**
   * Send a message
   */
  async sendMessage(options: SendMessageOptions): Promise<MessageResponse> {
    try {
      const payload: any = {
        to: options.to,
        message: options.message
      };

      if (options.type && options.type !== 'text') {
        payload.type = options.type;
        payload.media_url = options.mediaUrl;
        
        if (options.filename) {
          payload.filename = options.filename;
        }
        
        if (options.caption) {
          payload.caption = options.caption;
        }
      }

      const response = await this.client.post<MessageResponse>('/messages', payload);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      const response = await this.client.get<MessageStatus>(`/messages/${messageId}/status`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Configure webhook
   */
  async configureWebhook(config: WebhookConfig): Promise<void> {
    try {
      await this.client.post('/webhooks', config);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get webhook configuration
   */
  async getWebhookConfig(): Promise<WebhookConfig> {
    try {
      const response = await this.client.get<WebhookConfig>('/webhooks');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data) {
      const errorData = error.response.data as NotificameError;
      return new Error(`NotificaMe HUB Error: ${errorData.message}`);
    }
    return error;
  }
}