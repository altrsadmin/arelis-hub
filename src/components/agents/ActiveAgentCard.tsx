import React from 'react';
import { useMutationCache } from '../../lib/hooks/useQueryCache';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { Settings2, PauseCircle, PlayCircle, RefreshCw, Users, Zap, Minimize2, Maximize2 } from 'lucide-react';
import { AgentDashboard } from './AgentDashboard';
import { AgentEditForm } from './AgentEditForm';
import type { ActiveAgent } from '../../types/agent';

interface ActiveAgentCardProps {
  agent: ActiveAgent;
  onRefresh: () => void;
}

export function ActiveAgentCard({ agent, onRefresh }: ActiveAgentCardProps) {
  const { t } = useLanguage();
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const { mutate: updateStatus, isLoading: loading } = useMutationCache('agent_aggregations');

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
    <>
      <div 
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 
          dark:border-gray-700/80 backdrop-blur-sm transition-all duration-200 hover:shadow-xl
          hover:border-[#0099ff] dark:hover:border-[#2afbc6] cursor-pointer
          ${expanded ? 'col-span-2 row-span-2' : ''}
        `}
        onClick={() => setShowDashboard(true)}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700/80 bg-gradient-to-r from-[#0099ff]/10 to-transparent dark:from-[#2afbc6]/10 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {agent.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4" />
                {agent.customer_data.name}
                <code className="ml-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {agent.uuid}
                </code>
              </div>
            </div>
            <Badge variant={getStatusColor(agent.status)}>
              {t(`agents.status.${agent.status}`)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Executions Counter */}
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {t('agents.executions')}:
            </div>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#0099ff]/90 dark:bg-[#2afbc6]/90 h-2 rounded-full transition-all duration-500 backdrop-blur-sm"
                  style={{ 
                    width: `${agent.max_executions ? (agent.current_executions / agent.max_executions) * 100 : 100}%` 
                  }}
                />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                {agent.current_executions} / {agent.max_executions || '∞'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={agent.status === 'active' ? PauseCircle : PlayCircle}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusToggle();
                }}
                loading={loading}
              >
                {agent.status === 'active' ? t('common.pause') : t('common.resume')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Settings2}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditForm(true);
                }}
              >
                {t('common.settings')}
              </Button>
            </div>
          </div>

          {/* Instances */}
          {expanded && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white">
                <span>{t('agents.instances')}</span>
              </div>

              <div className="grid gap-2">
                {agent.instances.map(instance => (
                  <div
                    key={instance.id}
                    className="flex items-center justify-between p-2 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {instance.name}
                    </span>
                    <Badge variant={getStatusColor(instance.status)}>
                      {t(`agents.instanceStatus.${instance.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AgentDashboard
        agent={agent}
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        onEdit={() => {
          setShowDashboard(false);
          setShowEditForm(true);
        }}
        onRefresh={onRefresh}
      />

      <AgentEditForm
        agent={agent}
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSuccess={onRefresh}
      />
    </>
  );
}