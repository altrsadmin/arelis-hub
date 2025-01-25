import { supabase } from '../supabase';
import { logger } from './logger';

export async function testConnection(): Promise<boolean> {
  try {
    // Teste de sessão
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logger.error('Session test failed', sessionError);
      return false;
    }

    // Teste de acesso aos dados
    if (session) {
      const { data, error: dataError } = await supabase
        .from('agents')
        .select('id')
        .limit(1);

      if (dataError) {
        logger.error('Data access test failed', dataError);
        return false;
      }

      if (data) {
        logger.info('Connection test successful', { 
          hasSession: true,
          hasData: true 
        });
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('Connection test failed', error as Error);
    return false;
  }
}