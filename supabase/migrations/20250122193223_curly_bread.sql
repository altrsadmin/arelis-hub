-- Create admin user
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Only create admin user if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@arelis.online'
  ) THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
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
    ) VALUES (
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
    )
    RETURNING id INTO admin_id;

    -- Insert into users table
    INSERT INTO users (
      id,
      email,
      name,
      role,
      status
    ) VALUES (
      admin_id,
      'admin@arelis.online',
      'Admin',
      'admin',
      'active'
    );
  END IF;
END $$;