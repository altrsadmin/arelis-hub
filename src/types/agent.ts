export interface AgentType {
  id: string;
  name: string;
  description: string;
  fields: AgentField[];
}

export interface AgentField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select';
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface Agent {
  id: string;
  uuid: string;
  name: string;
  type_id: string;
  config: Record<string, any>;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AgentInstance {
  id: string;
  name: string;
  webhook_url?: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'qrcode';
  qrcode?: string;
}

export interface ActiveAgent {
  id: string;
  uuid: string;
  agent_id: string;
  customer_id: string;
  status: 'active' | 'paused' | 'stopped';
  config: Record<string, any>;
  instances: AgentInstance[];
  max_executions: number;
  current_executions: number;
  renewal_type: 'none' | 'daily' | 'monthly';
  pause_on_limit: boolean;
  billing_type: 'monthly' | 'execution';
  billing_value: number;
  billing_currency: 'brl' | 'usd' | 'eur';
  created_at: string;
  updated_at: string;
  last_execution_at?: string;
  last_status_change_at?: string;
  last_config_change_at?: string;
  customer_data: {
    name: string;
    email: string;
  };
  agent_type_data: {
    name: string;
    description: string;
  };
  execution_history: Array<{
    timestamp: string;
    status: string;
    error?: string;
  }>;
}