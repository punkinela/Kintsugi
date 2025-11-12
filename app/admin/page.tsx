'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin Page Redirect
 *
 * This page redirects to /journey (the new Personal Insights URL)
 * Maintains backward compatibility for any existing bookmarks or links
 */
export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /journey immediately
    router.replace('/journey');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-theme-primary-light to-purple-50 dark:from-kintsugi-dark-900 dark:to-purple-900/20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 theme-border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to Personal Insights...</p>
      </div>
    </div>
  );
}
