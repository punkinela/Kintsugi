'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  iconColor?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconColor = 'text-gray-400'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`w-16 h-16 ${iconColor} mb-4`}>
        <Icon className="w-full h-full" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
