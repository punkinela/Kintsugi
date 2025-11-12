'use client';

import { Sparkles } from 'lucide-react';

interface AIBadgeProps {
  compact?: boolean;
  className?: string;
}

/**
 * AIBadge Component
 *
 * Visual indicator that a feature uses AI/ML technology.
 * Use this to make AI features immediately recognizable to users.
 *
 * @param compact - If true, shows smaller version (default: false)
 * @param className - Additional Tailwind classes
 */
export default function AIBadge({ compact = false, className = '' }: AIBadgeProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-sm ${className}`}
        title="This feature uses AI/ML technology"
      >
        <Sparkles className="h-2.5 w-2.5" />
        AI
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg ${className}`}
      title="This feature uses AI/ML technology"
    >
      <Sparkles className="h-3 w-3" />
      AI-POWERED
    </span>
  );
}

/**
 * AIBadgeInline Component
 *
 * Inline version for use within text/headings
 */
export function AIBadgeInline() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full align-middle ml-2">
      <Sparkles className="h-2 w-2" />
      AI
    </span>
  );
}
