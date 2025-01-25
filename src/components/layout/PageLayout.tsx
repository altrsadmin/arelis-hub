import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils/cn';
import { PageHeader } from './PageHeader';

interface PageLayoutProps {
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
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  icon,
  title,
  description,
  primaryAction,
  showSearch,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
  className
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-full w-full space-y-6 p-6', className)}>
      <PageHeader
        icon={icon}
        title={title}
        description={description}
        primaryAction={primaryAction}
        showSearch={showSearch}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
      />
      <main>{children}</main>
    </div>
  );
}

interface PageGridProps {
  children: React.ReactNode;
  className?: string;
  empty?: boolean;
}

export function PageGrid({ children, className, empty }: PageGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        {
          'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3': !empty,
          'grid-cols-1': empty
        },
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function PageCard({ children, className, onClick }: PageCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white/50 p-6 backdrop-blur-sm transition-all duration-200 hover:border-[#0099ff] dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-[#2afbc6]',
        className
      )}
    >
      {children}
    </button>
  );
}
