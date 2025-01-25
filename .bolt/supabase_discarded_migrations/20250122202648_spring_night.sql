-- Clean up all demo data while preserving system structure and admin user

-- Disable triggers temporarily to avoid update timestamp triggers
ALTER TABLE users DISABLE TRIGGER ALL;
ALTER TABLE customers DISABLE TRIGGER ALL;
ALTER TABLE agents DISABLE TRIGGER ALL;
ALTER TABLE active_agents DISABLE TRIGGER ALL;
ALTER TABLE agent_aggregations DISABLE TRIGGER ALL;
ALTER TABLE webhooks DISABLE TRIGGER ALL;
ALTER TABLE webhook_events DISABLE TRIGGER ALL;
ALTER TABLE webhook_deliveries DISABLE TRIGGER ALL;

-- Delete all data except admin user
DELETE FROM webhook_deliveries;
DELETE FROM webhook_events;
DELETE FROM webhooks;
DELETE FROM agent_aggregations;
DELETE FROM active_agents;
DELETE FROM agents;
DELETE FROM customers;
DELETE FROM users WHERE email != 'admin@arelis.online';

-- Re-enable triggers
ALTER TABLE users ENABLE TRIGGER ALL;
ALTER TABLE customers ENABLE TRIGGER ALL;
ALTER TABLE agents ENABLE TRIGGER ALL;
ALTER TABLE active_agents ENABLE TRIGGER ALL;
ALTER TABLE agent_aggregations ENABLE TRIGGER ALL;
ALTER TABLE webhooks ENABLE TRIGGER ALL;
ALTER TABLE webhook_events ENABLE TRIGGER ALL;
ALTER TABLE webhook_deliveries ENABLE TRIGGER ALL;

-- Reset sequences
ALTER SEQUENCE IF EXISTS customers_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS agents_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS active_agents_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS agent_aggregations_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS webhooks_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS webhook_events_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS webhook_deliveries_id_seq RESTART WITH 1;

-- Vacuum tables to reclaim space and update statistics
VACUUM ANALYZE customers;
VACUUM ANALYZE agents;
VACUUM ANALYZE active_agents;
VACUUM ANALYZE agent_aggregations;
VACUUM ANALYZE webhooks;
VACUUM ANALYZE webhook_events;
VACUUM ANALYZE webhook_deliveries;