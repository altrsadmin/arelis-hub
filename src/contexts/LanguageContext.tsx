import * as React from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { logger } from '../lib/utils/logger';
import { translations, Translations } from '../lib/i18n/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Obtém o idioma do navegador ou usa 'pt' como padrão
const getBrowserLanguage = (): string => {
  try {
    const browserLang = navigator.language.split('-')[0];
    logger.debug('Idioma do navegador:', browserLang);
    return translations.hasOwnProperty(browserLang) ? browserLang : 'pt';
  } catch (error) {
    logger.error('Erro ao obter idioma do navegador:', error);
    return 'pt';
  }
};

// Obtém o idioma salvo no localStorage ou do navegador
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem('language');
    logger.debug('Idioma salvo:', saved);
    return saved || getBrowserLanguage();
  } catch (error) {
    logger.error('Erro ao obter idioma salvo:', error);
    return 'pt';
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(getSavedLanguage());

  // Salva o idioma no localStorage quando mudar
  const setLanguage = useCallback((lang: string) => {
    try {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
      logger.debug('Idioma alterado para:', lang);
    } catch (error) {
      logger.error('Erro ao salvar idioma:', error);
    }
  }, []);

  // Função de tradução melhorada
  const t = useCallback((key: string, defaultValue?: string): string => {
    try {
      logger.debug(`Buscando tradução para: ${key} (idioma: ${language})`);
      
      // Verifica se o idioma existe
      if (!translations[language]) {
        logger.error(`Idioma ${language} não encontrado nas traduções`);
        return defaultValue || key;
      }

      const keys = key.split('.');
      let value: any = translations[language];
      
      // Debug do caminho de navegação
      let currentPath = '';
      
      for (const k of keys) {
        currentPath += (currentPath ? '.' : '') + k;
        
        if (!value || typeof value !== 'object') {
          logger.warn(`Caminho inválido em ${currentPath} para a chave: ${key}`);
          return defaultValue || key;
        }
        
        value = value[k];
        logger.debug(`Navegando: ${currentPath} = ${JSON.stringify(value)}`);
      }

      if (typeof value !== 'string') {
        logger.warn(`Valor não é string para a chave: ${key} (tipo: ${typeof value})`);
        return defaultValue || key;
      }

      return value;
    } catch (error) {
      logger.error(`Erro ao buscar tradução para a chave: ${key}`, error);
      return defaultValue || key;
    }
  }, [language]);

  // Debug das traduções em desenvolvimento
  useEffect(() => {
    logger.debug('Idioma atual:', language);
    logger.debug('Traduções disponíveis:', Object.keys(translations));
    
    // Verifica se as traduções para o idioma atual existem
    if (!translations[language]) {
      logger.error(`Traduções não encontradas para o idioma: ${language}`);
    } else {
      logger.debug(`Traduções carregadas para ${language}:`, Object.keys(translations[language]));
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
}