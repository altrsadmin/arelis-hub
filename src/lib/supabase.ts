import { createClient } from '@supabase/supabase-js';
import { logger } from './utils/logger';

// Validate environment variables
if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client with minimal config
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      autoRefreshToken: true,
      storage: localStorage
    },
    db: {
      schema: 'public'
    }
  }
);

// Log auth events in development
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    logger.debug('Auth state changed', { 
      event, 
      user: session?.user?.email,
      role: session?.user?.role
    });
  });
}

// Test connection on init
if (import.meta.env.DEV) {
  import('./utils/test-connection').then(({ testConnection }) => {
    testConnection().then(success => {
      if (!success) {
        logger.error('Initial connection test failed');
      }
    });
  });
}