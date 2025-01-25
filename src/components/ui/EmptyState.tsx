import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ElementType;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <Icon className="h-8 w-8 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-6">
        <Button
          onClick={onAction}
          icon={Plus}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}