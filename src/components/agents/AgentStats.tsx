import React from 'react';
import { Bot, PauseCircle, Activity, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../contexts/LanguageContext';

interface AgentStatsProps {
  stats: {
    total: number;
    active: number;
    paused: number;
    totalExecutions: number;
  };
}

export function AgentStats({ stats }: AgentStatsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <Bot className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
          <Badge variant="success">{t('common.active')}</Badge>
        </div>
        <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats.active}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('agents.stats.activeAgents')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-[#ff00b7]/10 rounded-lg">
            <PauseCircle className="h-5 w-5 text-[#ff00b7]" />
          </div>
          <Badge variant="warning">{t('common.paused')}</Badge>
        </div>
        <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats.paused}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('agents.stats.pausedAgents')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <Users className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('common.total')}</span>
        </div>
        <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats.total}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('agents.stats.totalAgents')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <Activity className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('common.total')}</span>
        </div>
        <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats.totalExecutions}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('agents.stats.totalExecutions')}
        </p>
      </div>
    </div>
  );
}