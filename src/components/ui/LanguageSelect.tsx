import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Select } from './Select';

export function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
        <Globe className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
      </div>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')}
        options={[
          { value: 'en', label: t('settings.language.en') },
          { value: 'pt', label: t('settings.language.pt') },
          { value: 'es', label: t('settings.language.es') }
        ]}
        fullWidth
      />
    </div>
  );
}