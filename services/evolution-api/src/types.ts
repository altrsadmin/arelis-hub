export interface EvolutionApiConfig {
  baseUrl: string;
  apiKey: string;
}

export interface Instance {
  instanceName: string;
  status: 'open' | 'connecting' | 'close' | 'error';
  state: 'connecting' | 'connected' | 'disconnected' | 'qrcode';
  qrcode?: string;
  number?: string;
}

export interface CreateInstanceResponse {
  instance: {
    instanceName: string;
    status: string;
    state: string;
    qrcode: string | null;
  };
}

export interface ConnectionState {
  state: 'connecting' | 'connected' | 'disconnected' | 'qrcode';
  statusReason: number;
  qrcode?: string;
  number?: string;
}

export interface WebhookConfig {
  enabled: boolean;
  url: string;
  webhook_by_events?: boolean;
  events?: string[];
}

export interface WebhookResponse {
  webhook: WebhookConfig;
}

export interface Settings {
  reject_call?: boolean;
  msg_call?: string;
  groups_ignore?: boolean;
  always_online?: boolean;
  read_messages?: boolean;
  read_status?: boolean;
}

export interface SettingsResponse {
  settings: Settings;
}

export interface InstanceError {
  error: string;
  message: string;
}