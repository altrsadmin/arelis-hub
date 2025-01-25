import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../lib/utils/logger';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      logger.debug('Toggling theme', { from: theme, to: newTheme });
      setTheme(newTheme);
      logger.info('Tema alterado:', { theme: newTheme });
    } catch (error) {
      logger.error('Erro ao alterar tema:', error);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-2 py-1 text-gray-300 hover:text-white transition-colors rounded"
      title={t('settings.theme.title')}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}