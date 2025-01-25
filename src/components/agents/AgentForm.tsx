import React, { useState, useEffect } from 'react';
import { useQueryCache, useMutationCache } from '../../lib/hooks/useQueryCache';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Bot, ArrowRight, ArrowLeft, Save, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Agent, AgentType } from '../../types/agent';

interface AgentFormProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: Agent;
  onSuccess: () => void;
}

type Step = 'type' | 'basic' | 'config' | 'review';

interface FormData {
  name: string;
  type_id: string;
  config: Record<string, any>;
  status: 'active' | 'inactive';
}

export function AgentForm({ isOpen, onClose, agent, onSuccess }: AgentFormProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<AgentType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type_id: '',
    config: {},
    status: 'active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [canAdvance, setCanAdvance] = useState(false);

  // Busca tipos de agentes disponíveis
  const { data: agentTypes = [], isLoading: loadingTypes } = useQueryCache<AgentType>('agent_types');
  
  // Mutação para salvar/atualizar agente
  const { mutate, isLoading: saving } = useMutationCache<Agent>('agents', {
    id: agent?.id,
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  // Inicializa formulário com dados do agente se estiver editando
  useEffect(() => {
    if (agent && agentTypes) {
      const type = agentTypes.find(t => t.id === agent.type_id);
      setSelectedType(type || null);
      setFormData({
        name: agent.name,
        type_id: agent.type_id,
        config: agent.config,
        status: agent.status
      });
      setCanAdvance(true);
      setStep('basic');
    }
  }, [agent, agentTypes]);

  // Valida campos do formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'type' && !selectedType) {
      newErrors.type = t('validation.required');
    }

    if (step === 'basic') {
      if (!formData.name) {
        newErrors.name = t('validation.required');
      }
    }

    if (step === 'config' && selectedType) {
      selectedType.fields.forEach(field => {
        if (field.required && !formData.config[field.name]) {
          newErrors[field.name] = t('validation.required');
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipula mudança nos campos
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value
      }
    }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Avança para próxima etapa
  const handleNext = () => {
    if (validateForm()) {
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

  // Volta para etapa anterior
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

  // Envia formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await mutate({
        ...formData,
        type_id: selectedType?.id || '',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={agent ? t('agents.editAgent') : t('agents.newAgent')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Conteúdo do formulário baseado na etapa atual */}
        {step === 'type' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('agents.selectType')}</h3>
            <div className="grid grid-cols-1 gap-4">
              {loadingTypes ? (
                <LoadingSpinner />
              ) : (
                agentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(type);
                      setFormData(prev => ({
                        ...prev,
                        type_id: type.id
                      }));
                      setCanAdvance(true);
                    }}
                    className={`p-4 rounded-lg border ${
                      selectedType?.id === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5" />
                      <div className="text-left">
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {step === 'basic' && (
          <div className="space-y-4">
            <Input
              label={t('agents.name')}
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }));
                setCanAdvance(!!e.target.value);
              }}
              error={errors.name}
              required
            />
          </div>
        )}

        {step === 'config' && selectedType && (
          <div className="space-y-4">
            {selectedType.fields.map((field) => (
              <div key={field.name}>
                {field.type === 'select' ? (
                  <Select
                    label={field.label}
                    value={formData.config[field.name] || ''}
                    onChange={(value) => handleChange(field.name, value)}
                    options={field.options || []}
                    error={errors[field.name]}
                    required={field.required}
                  />
                ) : (
                  <Input
                    type={field.type}
                    label={field.label}
                    value={formData.config[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    error={errors[field.name]}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-medium">{t('agents.type')}</h5>
                  <p className="text-sm text-gray-500">{selectedType?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-medium">{t('agents.name')}</h5>
                  <p className="text-sm text-gray-500">{formData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-medium">{t('agents.configuration')}</h5>
                  <div className="text-sm text-gray-500">
                    {selectedType?.fields.map((field) => (
                      <p key={field.name}>
                        {field.label}: {formData.config[field.name]}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <h5 className="font-medium text-yellow-800">
                    {t('agents.reviewWarning')}
                  </h5>
                  <p className="text-sm text-yellow-700">
                    {t('agents.reviewDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between">
          <div>
            {step !== 'type' && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                icon={ArrowLeft}
              >
                {t('common.back')}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              icon={X}
            >
              {t('common.cancel')}
            </Button>

            {step !== 'review' ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance}
                icon={ArrowRight}
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                type="submit"
                loading={saving}
                icon={Save}
              >
                {agent ? t('common.update') : t('common.create')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}