import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    className?: string;
  };
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  primaryAction,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  className
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-[#0099ff]/10 to-[#2afbc6]/10 p-2 dark:from-[#0099ff]/20 dark:to-[#2afbc6]/20">
          <Icon className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {showSearch && (
          <div className="flex-1 sm:w-80">
            <Input
              icon={Search}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full"
            />
          </div>
        )}
        {primaryAction && (
          <Button
            icon={primaryAction.icon}
            onClick={primaryAction.onClick}
            variant={primaryAction.variant}
            className={cn('shrink-0', primaryAction.className)}
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </header>
  );
}
