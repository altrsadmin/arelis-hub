import React from 'react';
import { Plus } from 'lucide-react';
import { ActiveAgentCard } from './ActiveAgentCard';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ActiveAgent } from '../../types/agent';

interface AgentListProps {
  agents: ActiveAgent[];
  onActivate: () => void;
  onRefresh: () => void;
}

export function AgentList({ agents, onActivate, onRefresh }: AgentListProps) {
  const { t } = useLanguage();

  const EmptyCard = () => (
    <button
      onClick={onActivate}
      className="group h-full min-h-[280px] bg-white/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#0099ff] dark:hover:border-[#2afbc6] backdrop-blur-sm transition-all duration-200 p-6 flex flex-col items-center justify-center gap-4"
    >
      <div className="p-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg group-hover:bg-[#0099ff]/10 dark:group-hover:bg-[#2afbc6]/10 transition-colors duration-200">
        <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]">
          {t('agents.newAgent')}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('agents.emptyDescription')}
        </p>
      </div>
    </button>
  );

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {agents?.map(agent => (
        <ActiveAgentCard
          key={agent.id}
          agent={agent}
          onRefresh={onRefresh}
        />
      ))}
      <EmptyCard />
    </div>
  );
}