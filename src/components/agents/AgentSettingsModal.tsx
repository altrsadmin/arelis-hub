import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';

interface AgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentSettingsModal({ isOpen, onClose }: AgentSettingsModalProps) {
  const { t } = useLanguage();
  const [billingType, setBillingType] = useState('monthly');
  const [currency, setCurrency] = useState('brl');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const formatValue = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'brl': return 'R$';
      case 'usd': return '$';
      case 'eur': return '€';
      default: return '';
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Add your save logic here
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('agents.billingSettings')}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {t('agents.billingConfiguration')}
          </h4>

          <Select
            label={t('agents.billingType')}
            value={billingType}
            onChange={(e) => setBillingType(e.target.value)}
            options={[
              { value: 'monthly', label: t('agents.monthlyFee') },
              { value: 'execution', label: t('agents.perExecution') }
            ]}
            required
            fullWidth
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Select
              label={t('agents.currency')}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'brl', label: t('agents.currencies.brl') },
                { value: 'usd', label: t('agents.currencies.usd') },
                { value: 'eur', label: t('agents.currencies.eur') }
              ]}
              required
              fullWidth
            />

            <div className="relative">
              <Input
                type="text"
                label={t('agents.value')}
                value={value}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  setValue(formatValue(val));
                }}
                required
                fullWidth
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {getCurrencySymbol(currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
          >
            {t('common.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}