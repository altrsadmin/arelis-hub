-- Create admin user with proper password hashing
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Only create admin user if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@arelis.online'
  ) THEN
    -- Insert into auth.users with properly hashed password
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
      confirmation_token,
      aud,
      is_super_admin
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'admin@arelis.online',
      crypt('@Arelis1234', gen_salt('bf', 10)), -- Use proper bcrypt hashing
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Admin"}'::jsonb,
      now(),
      now(),
      'authenticated',
      '',
      'authenticated',
      true
    )
    RETURNING id INTO admin_id;

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_id,
      format('{"sub":"%s","email":"%s"}', admin_id::text, 'admin@arelis.online')::jsonb,
      'email',
      now(),
      now(),
      now()
    );

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