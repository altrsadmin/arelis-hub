import React, { useState, useEffect } from 'react';
import { useMutationCache } from '../../lib/hooks/useQueryCache';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ActiveAgent } from '../../types/agent';

interface AgentEditFormProps {
  agent: ActiveAgent;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AgentEditForm({ agent, isOpen, onClose, onSuccess }: AgentEditFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    maxExecutions: 0,
    renewalType: 'none' as const,
    pauseOnLimit: false,
    billingType: 'monthly' as const,
    billingValue: 0,
    billingCurrency: 'brl' as const
  });

  const { mutate: updateAgent, loading } = useMutationCache('agent_aggregations', {
    id: agent.id,
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        maxExecutions: agent.max_executions,
        renewalType: agent.renewal_type,
        pauseOnLimit: agent.pause_on_limit,
        billingType: agent.billing_type,
        billingValue: agent.billing_value,
        billingCurrency: agent.billing_currency
      });
    }
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateAgent({
      name: formData.name,
      max_executions: formData.maxExecutions,
      renewal_type: formData.renewalType,
      pause_on_limit: formData.pauseOnLimit,
      billing_type: formData.billingType,
      billing_value: formData.billingValue,
      billing_currency: formData.billingCurrency,
      last_config_change_at: new Date().toISOString()
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('agents.editAgent')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t('agents.agentName')}
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
        />

        <Input
          type="number"
          label={t('agents.maxExecutions')}
          value={formData.maxExecutions}
          onChange={e => setFormData({ ...formData, maxExecutions: parseInt(e.target.value) })}
          min={0}
          helperText={t('agents.maxExecutionsHelp')}
          fullWidth
        />

        <Select
          label={t('agents.renewalType.title')}
          value={formData.renewalType}
          onChange={e => setFormData({ ...formData, renewalType: e.target.value as typeof formData.renewalType })}
          options={[
            { value: 'none', label: t('agents.renewalType.none') },
            { value: 'daily', label: t('agents.renewalType.daily') },
            { value: 'monthly', label: t('agents.renewalType.monthly') }
          ]}
          fullWidth
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.pauseOnLimit}
            onChange={e => setFormData({ ...formData, pauseOnLimit: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-[#2afbc6] focus:ring-[#2afbc6] transition-colors"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('agents.pauseOnLimit')}
          </span>
        </label>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {t('agents.billingSettings')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t('agents.billingType')}
              value={formData.billingType}
              onChange={e => setFormData({ ...formData, billingType: e.target.value as typeof formData.billingType })}
              options={[
                { value: 'monthly', label: t('agents.monthlyFee') },
                { value: 'execution', label: t('agents.perExecution') }
              ]}
              fullWidth
            />

            <Select
              label={t('agents.currency')}
              value={formData.billingCurrency}
              onChange={e => setFormData({ ...formData, billingCurrency: e.target.value as typeof formData.billingCurrency })}
              options={[
                { value: 'brl', label: t('agents.currencies.brl') },
                { value: 'usd', label: t('agents.currencies.usd') },
                { value: 'eur', label: t('agents.currencies.eur') }
              ]}
              fullWidth
            />

            <Input
              type="number"
              label={t('agents.value')}
              value={formData.billingValue}
              onChange={e => setFormData({ ...formData, billingValue: parseFloat(e.target.value) })}
              min={0}
              step={0.01}
              fullWidth
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}