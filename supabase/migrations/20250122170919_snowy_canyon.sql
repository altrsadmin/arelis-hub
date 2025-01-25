/*
  # Initial Database Schema

  1. Core Tables
    - users
    - customers
    - agent_types
    - agents
    - active_agents
    - agent_aggregations
    - connector_types
    - webhooks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for service role

  3. Functions & Triggers
    - Timestamp update functions
    - Data sync functions
    - Automatic triggers
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  document text,
  person_type text NOT NULL,
  has_complete_registration boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agent_types table
CREATE TABLE IF NOT EXISTS agent_types (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  fields jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create connector_types table
CREATE TABLE IF NOT EXISTS connector_types (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  fields jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type_id text REFERENCES agent_types(id),
  config jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'inactive',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create active_agents table
CREATE TABLE IF NOT EXISTS active_agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) NOT NULL,
  agent_id uuid REFERENCES agents(id) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agent_aggregations table
CREATE TABLE IF NOT EXISTS agent_aggregations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'inactive',
  config jsonb NOT NULL DEFAULT '{}',
  instances jsonb DEFAULT '[]',
  max_executions integer DEFAULT 0,
  current_executions integer DEFAULT 0,
  renewal_type text DEFAULT 'none',
  pause_on_limit boolean DEFAULT false,
  billing_type text DEFAULT 'monthly',
  billing_value numeric(10,2) DEFAULT 0,
  billing_currency text DEFAULT 'brl',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_execution_at timestamptz,
  last_status_change_at timestamptz,
  last_config_change_at timestamptz,
  customer_data jsonb DEFAULT '{}',
  agent_type_data jsonb DEFAULT '{}',
  execution_history jsonb DEFAULT '[]'
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  events text[] NOT NULL,
  secret text NOT NULL,
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Create webhook_deliveries table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES webhooks(id) ON DELETE CASCADE,
  event_id text REFERENCES webhook_events(id) ON DELETE CASCADE,
  status text NOT NULL,
  error text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers(user_id);
CREATE INDEX IF NOT EXISTS active_agents_user_id_idx ON active_agents(user_id);
CREATE INDEX IF NOT EXISTS active_agents_agent_id_idx ON active_agents(agent_id);
CREATE INDEX IF NOT EXISTS agent_aggregations_agent_id_idx ON agent_aggregations(agent_id);
CREATE INDEX IF NOT EXISTS agent_aggregations_customer_id_idx ON agent_aggregations(customer_id);
CREATE INDEX IF NOT EXISTS agent_aggregations_status_idx ON agent_aggregations(status);
CREATE INDEX IF NOT EXISTS agent_aggregations_uuid_idx ON agent_aggregations(uuid);
CREATE INDEX IF NOT EXISTS webhook_events_status_idx ON webhook_events(status);
CREATE INDEX IF NOT EXISTS webhook_events_type_idx ON webhook_events(type);
CREATE INDEX IF NOT EXISTS webhook_deliveries_webhook_id_idx ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS webhook_deliveries_event_id_idx ON webhook_deliveries(event_id);
CREATE INDEX IF NOT EXISTS webhooks_user_id_idx ON webhooks(user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_aggregations ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read their own customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read agent types"
  ON agent_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read connector types"
  ON connector_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their own active agents"
  ON active_agents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own agent aggregations"
  ON agent_aggregations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM customers c 
    WHERE c.id = agent_aggregations.customer_id 
    AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own webhooks"
  ON webhooks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage webhook events"
  ON webhook_events
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage webhook deliveries"
  ON webhook_deliveries
  FOR ALL
  TO service_role
  USING (true);

-- Create timestamp update functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add comments
COMMENT ON TABLE users IS 'Stores user profile information and roles';
COMMENT ON TABLE customers IS 'Stores customer information';
COMMENT ON TABLE agent_types IS 'Stores available agent types and their configuration fields';
COMMENT ON TABLE connector_types IS 'Stores available connector types and their configuration fields';
COMMENT ON TABLE agents IS 'Stores agent configurations';
COMMENT ON TABLE active_agents IS 'Stores active agent instances';
COMMENT ON TABLE agent_aggregations IS 'Aggregates all agent-related information for external access';
COMMENT ON TABLE webhooks IS 'Stores webhook configurations for external integrations';
COMMENT ON TABLE webhook_events IS 'Stores webhook events to be delivered';
COMMENT ON TABLE webhook_deliveries IS 'Stores webhook delivery attempts and their status';