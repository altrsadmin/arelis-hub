import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { logger } from '../lib/utils/logger';
import { useToast } from '../components/ui/Toast';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    logger.info('Estado de autenticação atualizado:', { 
      isAuthenticated, 
      hasUser: !!user,
      loading 
    });
  }, [isAuthenticated, user, loading]);

  useEffect(() => {
    logger.info('Iniciando verificação de sessão...');
    
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logger.error('Erro ao verificar sessão:', error);
        return;
      }

      if (session?.user) {
        logger.info('Sessão existente encontrada:', { 
          userId: session.user.id,
          email: session.user.email 
        });
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        logger.info('Nenhuma sessão encontrada');
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.info('Mudança no estado de autenticação:', { 
        event, 
        hasSession: !!session,
        userId: session?.user?.id 
      });
      
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setIsAuthenticated(true);
        logger.info('Usuário autenticado com sucesso');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        logger.info('Usuário desconectado');
      }
      
      setLoading(false);
    });

    return () => {
      logger.info('Limpando subscription de auth');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Iniciando processo de login...', { email });
      setLoading(true);

      // Verificar se já existe uma sessão
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        logger.info('Sessão existente encontrada durante login');
        setUser(sessionData.session.user);
        setIsAuthenticated(true);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Erro no login:', error);
        showToast({
          type: 'error',
          message: 'Email ou senha inválidos'
        });
        throw error;
      }

      if (data?.user) {
        logger.info('Login bem-sucedido:', { 
          userId: data.user.id,
          email: data.user.email 
        });
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        logger.warn('Login sem erro mas sem usuário retornado');
      }
    } catch (error) {
      logger.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      logger.info('Logout realizado com sucesso');
    } catch (error) {
      logger.error('Erro ao fazer logout:', error);
      showToast({
        type: 'error',
        message: 'Erro ao fazer logout'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}