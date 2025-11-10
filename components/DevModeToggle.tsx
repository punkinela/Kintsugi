'use client';

import { usePremium } from '@/contexts/PremiumContext';
import { Code, Crown } from 'lucide-react';

export default function DevModeToggle() {
  const { isDevMode, toggleDevMode, hasAPIKey, isPremium } = usePremium();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500 rounded-lg">
            <Code className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              Developer Mode
              {isDevMode && <Crown className="h-5 w-5 text-amber-500" />}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Enable dev mode to test premium features during development. This bypasses premium checks for testing purposes.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Dev Mode Status</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isDevMode ? 'Enabled - All premium features unlocked' : 'Disabled - Normal user experience'}
                  </p>
                </div>
                <button
                  onClick={toggleDevMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDevMode ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDevMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">API Key Status</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {hasAPIKey
                    ? '✓ OpenAI API key detected in environment'
                    : '✗ No API key found. Add NEXT_PUBLIC_OPENAI_API_KEY to .env.local'}
                </p>
                {!hasAPIKey && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    See .env.local.example for setup instructions
                  </p>
                )}
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Premium Status</p>
                <p className={`text-xs font-medium ${isPremium ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {isPremium ? '✓ Premium features available' : '✗ Premium features locked'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
          For Production Use:
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Turn off dev mode to see the user experience</li>
          <li>• Set up Netlify Functions for AI features</li>
          <li>• Implement payment system (Stripe recommended)</li>
          <li>• Add user authentication for premium tiers</li>
        </ul>
      </div>
    </div>
  );
}
