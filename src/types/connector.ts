export interface ConnectorField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select';
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface ConnectorType {
  id: string;
  name: string;
  description: string;
  fields: ConnectorField[];
}

export interface Connector {
  id: string;
  name: string;
  type_id: string;
  config: Record<string, any>;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}