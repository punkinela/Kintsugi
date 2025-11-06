'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import JourneyAwareAffirmation from '@/components/JourneyAwareAffirmation';
import FreshStartWelcome from '@/components/FreshStartWelcome';
import FAQSidebar from '@/components/FAQSidebar';

/**
 * Test Page for New Research-Backed Features
 *
 * Navigate to http://localhost:3000/test-features to see:
 * - Journey-aware affirmations with auto-rotation
 * - Fresh Start welcome messages
 * - Enhanced FAQ with research citations
 */

export default function TestFeaturesPage() {
  const [showFAQ, setShowFAQ] = useState(false);

  // Mock user profile for testing
  const testUser = {
    name: 'Test User',
    gender: 'woman', // Change to: 'man', 'non-binary', or undefined
    ethnicity: 'asian', // Or any other value
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🧪 Research-Backed Features Test Page
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Testing all new features with mock data
            </p>
          </div>

          {/* FAQ Button */}
          <button
            onClick={() => setShowFAQ(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Help & FAQ
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6">
          {/* Fresh Start Welcome */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              1️⃣ Fresh Start Welcome Component
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Shows research-backed return messages. Simulating a return after 5 days:
            </p>
            <FreshStartWelcome userName={testUser.name} />
          </div>

          {/* Journey-Aware Affirmation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              2️⃣ Journey-Aware Affirmation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Auto-rotates on page load. Uses spaced repetition + filters by demographics + journey stage.
              Refresh the page to see a different affirmation!
            </p>
            <JourneyAwareAffirmation profile={testUser} />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              📝 Testing Instructions
            </h2>
            <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <strong>To test different user profiles:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Change <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">gender</code> to 'woman', 'man', or 'non-binary'</li>
                  <li>Change <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">createdAt</code> to simulate different journey stages</li>
                  <li>Refresh the page to trigger new affirmation selection</li>
                </ul>
              </div>
              <div>
                <strong>To test FAQ:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Click the "Help & FAQ" button in the top right</li>
                  <li>Expand any question to see research citations</li>
                  <li>Note: FAQ is organized into 4 sections with research backing</li>
                </ul>
              </div>
              <div>
                <strong>To test Fresh Start Effect:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Current simulation shows a 5-day absence</li>
                  <li>Check console: Journey stage should be "skeptic" (under 7 days)</li>
                  <li>To test Monday message: Wait until Monday or modify date logic</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Journey Stage Info */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
            <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
              🎯 Current Journey Stage Detection
            </h2>
            <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <p><strong>Days in app:</strong> 5 days (simulated)</p>
              <p><strong>Expected stage:</strong> Skeptic (Days 1-7)</p>
              <p><strong>Affirmations shown:</strong> Low-barrier, micro-wins, social proof focus</p>
              <p><strong>Research applied:</strong> Prochaska & DiClemente (1983) - Transtheoretical Model</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p>✨ All features implement research-backed behavioral psychology</p>
          <p className="mt-1">See <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">RESEARCH_BACKED_ENHANCEMENTS.md</code> for full documentation</p>
        </div>
      </div>

      {/* FAQ Sidebar */}
      <FAQSidebar isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    </div>
  );
}
