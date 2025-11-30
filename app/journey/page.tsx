'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Journey Page Redirect
 *
 * The journey functionality has been unified into the main app.
 * This page redirects to the main app's Profile tab.
 *
 * Part of the Kintsugi Unified App migration - see KINTSUGI_UNIFIED_APP_SPEC.md
 */
export default function JourneyRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main app - the Profile tab contains all journey features
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-kintsugi-dark-900 dark:to-kintsugi-dark-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to your unified dashboard...
        </p>
      </div>
    </div>
  );
}
