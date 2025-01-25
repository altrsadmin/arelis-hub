-- Temporarily disable RLS on all tables to allow full access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE active_agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_aggregations DISABLE ROW LEVEL SECURITY;
ALTER TABLE connector_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries DISABLE ROW LEVEL SECURITY;

-- Drop existing policies that might be restricting access
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can read their own customers" ON customers;
DROP POLICY IF EXISTS "Anyone can read agent types" ON agent_types;
DROP POLICY IF EXISTS "Anyone can read connector types" ON connector_types;
DROP POLICY IF EXISTS "Users can read agents" ON agents;
DROP POLICY IF EXISTS "Users can read their own active agents" ON active_agents;
DROP POLICY IF EXISTS "Users can read their own agent aggregations" ON agent_aggregations;
DROP POLICY IF EXISTS "Users can manage their own webhooks" ON webhooks;
DROP POLICY IF EXISTS "Service role can manage webhook events" ON webhook_events;
DROP POLICY IF EXISTS "Service role can manage webhook deliveries" ON webhook_deliveries;

-- Create new policies that allow full access
CREATE POLICY "Allow full access" ON users FOR ALL USING (true);
CREATE POLICY "Allow full access" ON customers FOR ALL USING (true);
CREATE POLICY "Allow full access" ON agent_types FOR ALL USING (true);
CREATE POLICY "Allow full access" ON agents FOR ALL USING (true);
CREATE POLICY "Allow full access" ON active_agents FOR ALL USING (true);
CREATE POLICY "Allow full access" ON agent_aggregations FOR ALL USING (true);
CREATE POLICY "Allow full access" ON connector_types FOR ALL USING (true);
CREATE POLICY "Allow full access" ON webhooks FOR ALL USING (true);
CREATE POLICY "Allow full access" ON webhook_events FOR ALL USING (true);
CREATE POLICY "Allow full access" ON webhook_deliveries FOR ALL USING (true);