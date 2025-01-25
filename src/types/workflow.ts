// Interface para os campos do workflow
export interface WorkflowField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
  defaultValue?: any;
}

// Interface para os tipos de workflow
export interface WorkflowType {
  id: string;
  name: string;
  description: string;
  fields: WorkflowField[];
  created_at: string;
  updated_at: string;
}

// Interface para os workflows
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  type_id: string;
  customer_id: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  type?: WorkflowType;
  customer?: {
    id: string;
    name: string;
  };
}
