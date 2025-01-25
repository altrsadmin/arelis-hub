import React, { useState, useEffect } from 'react';
import { X, Plus, Settings2, ArrowLeft, Save, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import { useQueryCache, useMutationCache } from '../../lib/hooks/useQueryCache';
import { AgentInstanceCard } from './AgentInstanceCard';
import { AgentSettingsModal } from './AgentSettingsModal';
import type { Customer } from '../../types/customer';
import type { Agent } from '../../types/agent';

interface ActivateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'customer' | 'agent' | 'config' | 'review';

export function ActivateAgentModal({ isOpen, onClose, onSuccess }: ActivateAgentModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('customer');
  const [formData, setFormData] = useState({
    customerId: '',
    agentId: '',
    maxExecutions: 0,
    renewalType: 'none' as 'none' | 'daily' | 'monthly',
    pauseOnLimit: false,
    instances: [] as Array<{
      id: string;
      name: string;
      webhook_url?: string;
      status?: 'connecting' | 'connected' | 'disconnected' | 'qrcode';
      qrcode?: string;
    }>
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSettings, setShowSettings] = useState(false);

  const { data: customers, isLoading: loadingCustomers } = useQueryCache<Customer>('customers', {
    filter: { status: 'active' }
  });

  const { data: agents, isLoading: loadingAgents } = useQueryCache<Agent>('agents', {
    filter: { status: 'active' }
  });

  const { mutate: activateAgent, isPending: activating } = useMutationCache('active_agents', {
    onSuccess: () => {
      onSuccess?.();
      onClose();
    }
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('customer');
      setFormData({
        customerId: '',
        agentId: '',
        maxExecutions: 0,
        renewalType: 'none',
        pauseOnLimit: false,
        instances: []
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const validate = (currentStep: Step) => {
    const newErrors: Record<string, string> = {};
    
    // No required fields - all validations removed
    
    setErrors(newErrors);
    return true; // Always return true since no validations
  };

  const handleNext = () => {
    if (validate(step)) {
      switch (step) {
        case 'customer':
          setStep('agent');
          break;
        case 'agent':
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
      case 'agent':
        setStep('customer');
        break;
      case 'config':
        setStep('agent');
        break;
      case 'review':
        setStep('config');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(step)) return;

    await activateAgent({
      customer_id: formData.customerId,
      agent_id: formData.agentId,
      max_executions: formData.maxExecutions,
      renewal_type: formData.renewalType,
      pause_on_limit: formData.pauseOnLimit,
      instances: formData.instances.map(instance => ({
        name: instance.name,
        webhook_url: instance.webhook_url
      }))
    });
  };

  const handleAddInstance = () => {
    setFormData(prev => ({
      ...prev,
      instances: [
        ...prev.instances,
        {
          id: Math.random().toString(36).substring(7),
          name: `Instance ${prev.instances.length + 1}`
        }
      ]
    }));
  };

  const handleRemoveInstance = (id: string) => {
    setFormData(prev => ({
      ...prev,
      instances: prev.instances.filter(i => i.id !== id)
    }));
  };

  const handleUpdateInstance = (id: string, updates: Partial<typeof formData.instances[0]>) => {
    setFormData(prev => ({
      ...prev,
      instances: prev.instances.map(instance =>
        instance.id === id ? { ...instance, ...updates } : instance
      )
    }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {(['customer', 'agent', 'config', 'review'] as Step[]).map((s, i) => (
        <React.Fragment key={s}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${step === s 
                ? 'border-[#0099ff] dark:border-[#2afbc6] bg-[#0099ff]/10 dark:bg-[#2afbc6]/10' 
                : 'border-gray-300 dark:border-gray-600'}`}
          >
            <span className={`text-sm font-medium
              ${step === s 
                ? 'text-[#0099ff] dark:text-[#2afbc6]' 
                : 'text-gray-500 dark:text-gray-400'}`}>
              {i + 1}
            </span>
          </div>
          {i < 3 && (
            <div className={`w-16 h-0.5 mx-2
              ${i < ['customer', 'agent', 'config', 'review'].indexOf(step)
                ? 'bg-[#0099ff] dark:bg-[#2afbc6]'
                : 'bg-gray-300 dark:border-gray-600'}`} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderCustomerSelection = () => (
    <div className="space-y-6">
      <Select
        label={t('agents.selectCustomer')}
        value={formData.customerId}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, customerId: e.target.value }));
          setTouched(prev => ({ ...prev, customerId: true }));
        }}
        error={touched.customerId ? errors.customerId : undefined}
        options={[
          { value: '', label: t('agents.selectCustomer') },
          ...(customers || []).map(customer => ({
            value: customer.id,
            label: customer.name
          }))
        ]}
        required
        fullWidth
      />
    </div>
  );

  const renderAgentSelection = () => (
    <div className="space-y-6">
      <Select
        label={t('agents.selectAgent')}
        value={formData.agentId}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, agentId: e.target.value }));
          setTouched(prev => ({ ...prev, agentId: true }));
        }}
        error={touched.agentId ? errors.agentId : undefined}
        options={[
          { value: '', label: t('agents.selectAgent') },
          ...(agents || []).map(agent => ({
            value: agent.id,
            label: agent.name
          }))
        ]}
        required
        fullWidth
      />
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-6">
      <Input
        type="number"
        label={t('agents.maxExecutions')}
        value={formData.maxExecutions}
        onChange={(e) => setFormData(prev => ({ ...prev, maxExecutions: parseInt(e.target.value) }))}
        min={0}
        helperText={t('agents.maxExecutionsHelp')}
        fullWidth
      />

      <Select
        label={t('agents.renewalType.title')}
        value={formData.renewalType}
        onChange={(e) => setFormData(prev => ({ ...prev, renewalType: e.target.value as typeof formData.renewalType }))}
        helperText={t('agents.renewalType.help')}
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
          onChange={(e) => setFormData(prev => ({ ...prev, pauseOnLimit: e.target.checked }))}
          className="w-4 h-4 rounded border-gray-300 text-[#2afbc6] focus:ring-[#2afbc6] transition-colors"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('agents.pauseOnLimit')}
        </span>
      </label>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {t('agents.instances')}
          </h4>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddInstance}
            icon={Plus}
            size="sm"
          >
            {t('agents.addInstance')}
          </Button>
        </div>

        <div className="grid gap-4">
          {formData.instances.map((instance) => (
            <AgentInstanceCard
              key={instance.id}
              instance={instance}
              status={{
                status: instance.status || 'connecting',
                qrCode: instance.qrcode
              }}
              onRemove={() => handleRemoveInstance(instance.id)}
              onUpdate={(updates) => handleUpdateInstance(instance.id, updates)}
            />
          ))}
        </div>

        {errors.instances && (
          <div className="text-sm text-red-600 dark:text-red-400">
            {errors.instances}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={() => setShowSettings(true)}
        icon={Settings2}
        className="w-full justify-center"
      >
        {t('agents.billingSettings')}
      </Button>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t('agents.review')}
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                {t('agents.customer')}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {customers?.find(c => c.id === formData.customerId)?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                {t('agents.agent')}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agents?.find(a => a.id === formData.agentId)?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                {t('agents.configuration')}
              </h5>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('agents.maxExecutions')}:
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.maxExecutions || t('agents.unlimited')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('agents.renewalType.title')}:
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t(`agents.renewalType.${formData.renewalType}`)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('agents.pauseOnLimit')}:
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.pauseOnLimit ? t('common.yes') : t('common.no')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                {t('agents.instances')}
              </h5>
              <div className="mt-2 space-y-2">
                {formData.instances.map((instance) => (
                  <div key={instance.id} className="text-sm text-gray-500 dark:text-gray-400">
                    {instance.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                {t('agents.reviewWarning')}
              </h5>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t('agents.reviewWarningText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#0099ff]/5 to-transparent dark:from-[#2afbc6]/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                <Zap className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('agents.activateAgent')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {renderStepIndicator()}

            {step === 'customer' && renderCustomerSelection()}
            {step === 'agent' && renderAgentSelection()}
            {step === 'config' && renderConfiguration()}
            {step === 'review' && renderReview()}

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              {step !== 'customer' ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  icon={ArrowLeft}
                >
                  {t('common.back')}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  icon={X}
                >
                  {t('common.cancel')}
                </Button>
              )}

              {step !== 'review' ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  icon={Zap}
                >
                  {t('common.next')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={activating}
                  icon={Save}
                  className="bg-[#2afbc6] hover:bg-[#2afbc6]/90 text-gray-900 px-6 font-semibold"
                >
                  {t('common.activate')}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <AgentSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}