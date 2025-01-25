import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/utils/logger';
import { useNavigate } from 'react-router-dom';

// Componente de login
const Login: React.FC = () => {
  // Hooks para gerenciamento de estado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks de contexto e navegação
  const { signIn, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Efeito para redirecionamento quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/agents');
    }
  }, [isAuthenticated, navigate]);

  // Handler para submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      logger.debug('Tentando realizar login', { email });
      await signIn(email, password);
      // O redirecionamento será feito pelo useEffect quando isAuthenticated mudar
    } catch (err) {
      logger.error('Erro no login', err as Error);
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#0099ff] dark:text-[#2afbc6]">
            ARELIS HUB
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.signInMessage')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-[#0099ff] dark:focus:ring-[#2afbc6] focus:border-[#0099ff] dark:focus:border-[#2afbc6] focus:z-10 sm:text-sm bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-[#0099ff] dark:focus:ring-[#2afbc6] focus:border-[#0099ff] dark:focus:border-[#2afbc6] focus:z-10 sm:text-sm bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0099ff] hover:bg-[#0099ff]/90 dark:bg-[#2afbc6] dark:hover:bg-[#2afbc6]/90 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0099ff] dark:focus:ring-[#2afbc6]"
              icon={LogIn}
            >
              {loading ? t('common.loading') : t('auth.signIn')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;