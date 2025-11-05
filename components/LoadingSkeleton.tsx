'use client';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'stat' | 'chart';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'text',
  count = 1,
  className = ''
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (variant === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {skeletons.map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
        {skeletons.map((_, i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-kintsugi-dark-800 rounded-lg shadow-lg p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md p-3 w-12 h-12"></div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`animate-pulse bg-white dark:bg-kintsugi-dark-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  // card variant
  return (
    <div className={`space-y-6 ${className}`}>
      {skeletons.map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-kintsugi-dark-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
