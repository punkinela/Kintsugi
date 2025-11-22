'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, TrendingUp } from 'lucide-react';
import { UserProfile } from '@/types';
import { useState, useEffect } from 'react';
import PotteryVisual from './PotteryVisual';
import PotterySelection from './PotterySelection';
import { getPotteryData, initializePotteryData, updateAllCracksGoldFill, updateUnlockedStyles } from '@/utils/potteryStorage';
import { PotteryData } from '@/types/pottery';

interface KintsugiWelcomeBannerProps {
  user: UserProfile | null;
  currentStreak: number;
  totalEntries: number;
  onGetInsight: () => void;
  isLoading: boolean;
  journalEntries?: any[]; // For pottery crack updates
}

export default function KintsugiWelcomeBanner({
  user,
  currentStreak,
  totalEntries,
  onGetInsight,
  isLoading,
  journalEntries = []
}: KintsugiWelcomeBannerProps) {
  const [potteryData, setPotteryData] = useState<PotteryData | null>(null);
  const [showPotterySelection, setShowPotterySelection] = useState(false);

  // Calculate user's golden moments (entries where they showed growth)
  const goldenMoments = Math.floor(totalEntries * 0.3); // Simplified calculation

  // Load pottery data
  useEffect(() => {
    const data = getPotteryData();
    if (data) {
      // Update pottery with latest entries
      const updated = updateAllCracksGoldFill(data, journalEntries);
      const withUnlocks = updateUnlockedStyles(updated, totalEntries);
      setPotteryData(withUnlocks);
    } else if (user) {
      // Show pottery selection for new users
      setShowPotterySelection(true);
    }
  }, [totalEntries, journalEntries?.length]);

  const handlePotterySelect = (styleId: any) => {
    const newData = initializePotteryData(styleId);
    setPotteryData(newData);
    setShowPotterySelection(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br theme-gradient-to-r rounded-2xl shadow-2xl"
    >
      {/* Pottery Selection Modal */}
      {showPotterySelection && (
        <PotterySelection
          currentEntryCount={totalEntries}
          onSelect={handlePotterySelect}
          onClose={() => setShowPotterySelection(false)}
        />
      )}

      {/* Main Content - NO overlays for crisp text */}

      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        {/* Header with Kintsugi Philosophy */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            {/* Pottery Visual (if available) */}
            {potteryData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:block flex-shrink-0"
              >
                <PotteryVisual
                  potteryData={potteryData}
                  size="small"
                  interactive={false}
                  journalEntries={journalEntries}
                />
              </motion.div>
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex-shrink-0 bg-white/20 rounded-2xl p-4 shadow-lg"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  Welcome back, {user?.name || 'Friend'}! 👋
                </h2>
                {/* Pronunciation Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400/30 to-yellow-300/30 rounded-full border border-amber-300/50 shadow-lg"
                  title="Kintsugi pronunciation guide"
                >
                  <span className="text-white font-bold text-sm">金継ぎ</span>
                  <span className="text-white/90 text-xs">Kintsugi</span>
                  <span className="text-white/70 text-xs italic">(kin-TSU-gi)</span>
                </motion.div>
              </div>
              <p className="text-white/90 text-lg mb-3">
                {user?.profession ? (
                  <>Own your impact as a {user.profession}—wins, challenges, and all</>
                ) : (
                  <>Own your impact—wins, challenges, and all</>
                )}
              </p>

              {/* Unified Philosophy Quote */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white/95 text-sm font-semibold mb-2">
                  Own Your Impact + Kintsugi Philosophy
                </p>
                <p className="text-white/90 text-xs mb-2">
                  Your impact isn't just your accomplishments—it's also how you've grown through challenges.
                  Like Kintsugi pottery repaired with gold, your struggles make your story MORE valuable, not less.
                </p>
                <p className="text-white/80 text-xs italic">
                  "Celebrate your wins AND honor your resilience. Both are part of owning your impact."
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetInsight}
              disabled={isLoading}
              className="hidden sm:flex flex-shrink-0 items-center px-6 py-3 bg-white theme-text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart className="h-5 w-5 mr-2" />
              Document Impact
            </motion.button>
          </div>

          {/* Kintsugi Stats - Reframed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Consistent Impact</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold mt-1">{currentStreak} days 🔥</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Showing up daily</p>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Your Impact Story</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold mt-1">{totalEntries} ✍️</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Wins + growth documented</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Golden Moments</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold mt-1">{goldenMoments} ✨</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Challenges turned to gold</p>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-3">
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Get Insight Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetInsight}
            disabled={isLoading}
            className="sm:hidden w-full flex items-center justify-center px-6 py-3 bg-white theme-text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="h-5 w-5 mr-2" />
            {isLoading ? 'Generating...' : 'Get Insight'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
