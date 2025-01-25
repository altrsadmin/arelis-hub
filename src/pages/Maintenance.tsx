import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Wrench } from 'lucide-react';

export default function Maintenance() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#282a36] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('maintenance.title')}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('maintenance.message')}
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('maintenance.estimatedTime')}: 2 hours
        </div>
      </div>
    </div>
  );
}