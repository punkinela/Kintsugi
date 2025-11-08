'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  action?: ReactNode;
  delay?: number;
  className?: string;
}

export default function DashboardCard({
  title,
  icon: Icon,
  iconColor = 'theme-text-primary',
  children,
  action,
  delay = 0,
  className = ''
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border theme-border-light dark:theme-border-primary/50 overflow-hidden hover:shadow-xl transition-shadow ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 theme-bg-primary-light dark:bg-theme-primary/30 rounded-lg">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </motion.div>
  );
}
