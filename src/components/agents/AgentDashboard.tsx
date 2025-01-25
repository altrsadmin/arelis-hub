import React from 'react';
import { useMutationCache } from '../../lib/hooks/useQueryCache';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ActiveAgent } from '../../types/agent';

interface AgentDashboardProps {
  agent: ActiveAgent;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

export function AgentDashboard({ agent, isOpen, onClose, onEdit, onRefresh }: AgentDashboardProps) {
  const { t } = useLanguage();
  const { mutate: updateStatus, loading } = useMutationCache('agent_aggregations');

  const handleStatusToggle = async () => {
    await updateStatus({
      id: agent.id,
      status: agent.status === 'active' ? 'paused' : 'active',
      last_status_change_at: new Date().toISOString()
    });
    onRefresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      default: return 'danger';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={agent.name}
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                <Activity className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
              </div>
              <Badge variant={getStatusColor(agent.status)}>
                {t(`agents.status.${agent.status}`)}
              </Badge>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('agents.executions')}
              </h4>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {agent.current_executions} / {agent.max_executions || '∞'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                <Users className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('agents.customer')}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {agent.customer_data.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agent.customer_data.email}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                <Bot className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('agents.type')}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {agent.agent_type_data.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agent.agent_type_data.description}
              </p>
            </div>
          </div>
        </div>

        {/* Instances */}
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('agents.instances')}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {agent.instances.length} {t('agents.activeInstances')}
            </span>
          </div>

          <div className="space-y-4">
            {agent.instances.map((instance, index) => (
              <div
                key={instance.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {instance.name}
                  </h4>
                  {instance.webhook_url && (
                    <code className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 block">
                      {instance.webhook_url}
                    </code>
                  )}
                </div>
                <Badge variant={instance.status === 'connected' ? 'success' : 'warning'}>
                  {t(`agents.instanceStatus.${instance.status}`)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Execution History */}
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('agents.executionHistory')}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={onRefresh}
            >
              {t('common.refresh')}
            </Button>
          </div>

          <div className="space-y-4">
            {agent.execution_history.slice(0, 5).map((execution, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={execution.status === 'success' ? 'success' : 'danger'}>
                      {execution.status}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(execution.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {execution.error && (
                    <p className="text-sm text-red-500 mt-1">
                      {execution.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={handleStatusToggle}
            loading={loading}
            icon={agent.status === 'active' ? PauseCircle : PlayCircle}
          >
            {agent.status === 'active' ? t('common.pause') : t('common.resume')}
          </Button>
          <Button
            onClick={onEdit}
            icon={Settings2}
          >
            {t('common.edit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}