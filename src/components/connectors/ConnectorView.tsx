import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Connector } from '../../types/connector';

interface ConnectorViewProps {
  connector: Connector;
  onClose: () => void;
}

export function ConnectorView({ connector, onClose }: ConnectorViewProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('connectors.viewConnector')}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Detalhes do Conector */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('common.name')}
          </h3>
          <p className="mt-1 text-base text-gray-900 dark:text-white">
            {connector.name}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('common.description')}
          </h3>
          <p className="mt-1 text-base text-gray-900 dark:text-white">
            {connector.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('common.type')}
          </h3>
          <p className="mt-1 text-base text-gray-900 dark:text-white">
            {connector.type}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('common.status')}
          </h3>
          <p className="mt-1 text-base text-gray-900 dark:text-white">
            {connector.status}
          </p>
        </div>

        {connector.config && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('connectors.configuration')}
            </h3>
            <pre className="mt-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
              <code className="text-sm">
                {JSON.stringify(connector.config, null, 2)}
              </code>
            </pre>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('common.createdAt')}
          </h3>
          <p className="mt-1 text-base text-gray-900 dark:text-white">
            {new Date(connector.created_at).toLocaleString()}
          </p>
        </div>

        {connector.updated_at && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('common.updatedAt')}
            </h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">
              {new Date(connector.updated_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
