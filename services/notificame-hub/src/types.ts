export interface NotificameHubConfig {
  baseUrl?: string;
  apiKey: string;
}

export interface SendMessageOptions {
  to: string;
  message: string;
  type?: 'text' | 'image' | 'video' | 'audio' | 'document';
  mediaUrl?: string;
  filename?: string;
  caption?: string;
}

export interface MessageResponse {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
}

export interface MessageStatus {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  error?: string;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    messageId: string;
    status: string;
    timestamp: string;
    error?: string;
  };
}

export interface NotificameError {
  code: string;
  message: string;
  details?: any;
}