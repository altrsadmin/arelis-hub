/*
  # Initial Data Migration

  1. Data
    - Creates admin user
    - Inserts agent types
    - Inserts connector types

  2. Security
    - Uses secure password hashing
    - Validates data integrity
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Create admin user if doesn't exist
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    confirmation_token
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@arelis.online',
    crypt('@Arelis1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Admin"}'::jsonb,
    now(),
    now(),
    'authenticated',
    ''
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@arelis.online'
  )
  RETURNING id INTO admin_id;

  -- Insert into users table if admin was created
  IF admin_id IS NOT NULL THEN
    INSERT INTO users (id, email, name, role, status)
    VALUES (
      admin_id,
      'admin@arelis.online',
      'Admin',
      'admin',
      'active'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Insert Agent Types
INSERT INTO agent_types (id, name, description, fields) VALUES
(
  'n8n',
  'N8N',
  'Integration with N8N workflow automation',
  jsonb_build_array(
    jsonb_build_object(
      'name', 'name',
      'label', 'Agent Name',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'chat_trigger_url',
      'label', 'Chat Trigger URL',
      'type', 'text',
      'required', true
    )
  )
),
(
  'dify',
  'DIFY',
  'Integration with DIFY AI platform',
  jsonb_build_array(
    jsonb_build_object(
      'name', 'name',
      'label', 'Agent Name',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'type',
      'label', 'Agent Type',
      'type', 'select',
      'required', true,
      'options', jsonb_build_array(
        jsonb_build_object('value', 'chat', 'label', 'CHAT'),
        jsonb_build_object('value', 'flow', 'label', 'FLOW'),
        jsonb_build_object('value', 'agent', 'label', 'AGENT')
      )
    ),
    jsonb_build_object(
      'name', 'endpoint_api',
      'label', 'Endpoint API',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'secret_key',
      'label', 'Secret Key',
      'type', 'password',
      'required', true
    )
  )
)
ON CONFLICT (id) DO NOTHING;

-- Insert Connector Types
INSERT INTO connector_types (id, name, description, fields) VALUES
(
  'evolution-api-v2',
  'Evolution API v2 (WhatsApp)',
  'Integration with Evolution API v2 for WhatsApp messaging',
  jsonb_build_array(
    jsonb_build_object(
      'name', 'name',
      'label', 'Name',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'api_url',
      'label', 'API URL',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'secret_key',
      'label', 'SECRET KEY',
      'type', 'password',
      'required', true
    )
  )
),
(
  'notificame-hub',
  'NotificaMe HUB',
  'Integration with NotificaMe HUB for multi-channel messaging',
  jsonb_build_array(
    jsonb_build_object(
      'name', 'name',
      'label', 'Name',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'api_url',
      'label', 'API URL',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'secret_key',
      'label', 'SECRET KEY',
      'type', 'password',
      'required', true
    )
  )
),
(
  'waba',
  'WABA',
  'WhatsApp Business API integration (Coming Soon)',
  jsonb_build_array(
    jsonb_build_object(
      'name', 'name',
      'label', 'Name',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'phone_number_id',
      'label', 'Phone Number ID',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'business_account_id',
      'label', 'Business Account ID',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'name', 'access_token',
      'label', 'Access Token',
      'type', 'password',
      'required', true
    ),
    jsonb_build_object(
      'name', 'webhook_verify_token',
      'label', 'Webhook Verify Token',
      'type', 'password',
      'required', true
    )
  )
)
ON CONFLICT (id) DO NOTHING;