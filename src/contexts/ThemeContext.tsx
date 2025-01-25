import * as React from 'react';
import { logger } from '../lib/utils/logger';

// Tipos para o tema
type Theme = 'light' | 'dark';

// Interface do contexto do tema
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Criação do contexto com valor inicial
const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

ThemeContext.displayName = 'ThemeContext';

// Hook para usar o tema
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}

// Função para obter o tema inicial
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

// Provedor do tema
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);

  // Função para atualizar o tema
  const updateTheme = React.useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      logger.error('Erro ao salvar tema:', error);
    }
  }, []);

  // Efeito para atualizar a classe do documento
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Valor do contexto
  const contextValue = React.useMemo(() => ({
    theme,
    setTheme: updateTheme,
  }), [theme, updateTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}