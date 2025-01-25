import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#282a36] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('errors.pageNotFound')}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('errors.pageNotFoundMessage')}
        </p>

        <Button
          onClick={() => navigate('/')}
          icon={Home}
          className="mx-auto"
        >
          {t('common.backToHome')}
        </Button>
      </div>
    </div>
  );
}