import React from 'react';
import { useQueryCache, useMutationCache } from '../../lib/hooks/useQueryCache';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ConnectorType {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'select';
    options?: string[];
  }>;
}

interface Connector {
  id?: string;
  name: string;
  type_id: string;
  config: Record<string, any>;
  status?: 'active' | 'inactive';
}

interface ConnectorFormProps {
  isOpen: boolean;
  onClose: () => void;
  connector?: Connector;
  onSuccess?: () => void;
}

type Step = 'type' | 'basic' | 'config' | 'review';

export function ConnectorForm({ isOpen, onClose, connector, onSuccess }: ConnectorFormProps) {
  const { t } = useLanguage();
  const [step, setStep] = React.useState<Step>('type');
  const [selectedType, setSelectedType] = React.useState<ConnectorType | null>(null);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const { data: connectorTypes, isLoading: loadingTypes } = useQueryCache<ConnectorType[]>('connector_types');

  const { mutate: saveConnector, isLoading: saving } = useMutationCache<Connector>('connectors', {
    id: connector?.id,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    }
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = t('common.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      switch (step) {
        case 'type':
          setStep('basic');
          break;
        case 'basic':
          setStep('config');
          break;
        case 'config':
          setStep('review');
          break;
      }
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'basic':
        setStep('type');
        break;
      case 'config':
        setStep('basic');
        break;
      case 'review':
        setStep('config');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedType) return;

    await saveConnector({
      name: formData.name,
      type_id: selectedType.id,
      config: formData,
      status: connector?.status || 'inactive'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={connector ? t('connectors.editConnector') : t('connectors.newConnector')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 'type' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('connectors.type.title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('connectors.type.description')}
            </p>
            
            {loadingTypes ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {connectorTypes?.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200
                      ${selectedType?.id === type.id
                        ? 'border-[#0099ff] dark:border-[#2afbc6] bg-[#0099ff]/10 dark:bg-[#2afbc6]/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#0099ff] dark:hover:border-[#2afbc6]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={type.icon} alt={type.name} className="w-8 h-8" />
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('connectors.basic.title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('connectors.basic.description')}
            </p>
            
            <Input
              label={t('connectors.basic.name')}
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={touched.name ? errors.name : undefined}
              onBlur={() => setTouched({ ...touched, name: true })}
            />
          </div>
        )}

        {step === 'config' && selectedType?.fields && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('connectors.config.title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('connectors.config.description')}
            </p>
            
            {selectedType.fields.map((field) => (
              <div key={field.name}>
                {field.type === 'text' && (
                  <Input
                    label={field.label}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    error={touched[field.name] ? errors[field.name] : undefined}
                    onBlur={() => setTouched({ ...touched, [field.name]: true })}
                    type={field.name.toLowerCase().includes('password') ? 'password' : 'text'}
                  />
                )}
                {field.type === 'select' && field.options && (
                  <Select
                    label={field.label}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    error={touched[field.name] ? errors[field.name] : undefined}
                    onBlur={() => setTouched({ ...touched, [field.name]: true })}
                    options={field.options}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('connectors.review')}
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <img src={selectedType?.icon} alt={selectedType?.name} className="h-5 w-5" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {t('connectors.connectorType')}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedType?.name}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {t('connectors.connectorName')}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          {step !== 'type' ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              icon={<img src="/arrow-left.svg" alt="Arrow Left" />}
            >
              {t('common.back')}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              icon={<img src="/x.svg" alt="X" />}
            >
              {t('common.cancel')}
            </Button>
          )}

          {step !== 'review' ? (
            <Button
              type="button"
              onClick={handleNext}
              icon={<img src="/arrow-right.svg" alt="Arrow Right" />}
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              type="submit"
              loading={saving}
              icon={<img src="/save.svg" alt="Save" />}
            >
              {connector ? t('common.update') : t('common.create')}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}