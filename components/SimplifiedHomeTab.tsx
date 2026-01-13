'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, ChevronRight, Plus, TrendingUp } from 'lucide-react';
import XPBar from './XPBar';
import { useFeatureUnlock, getNextUnlock } from '@/hooks/useFeatureUnlock';

interface SimplifiedHomeTabProps {
  onQuickCapture: () => void;
  onGrowthMindset?: () => void;
  currentStreak: number;
}

export default function SimplifiedHomeTab({
  onQuickCapture,
  onGrowthMindset,
  currentStreak
}: SimplifiedHomeTabProps) {
  const { level, isUnlocked, nextUnlock, canAccessGrowthMindset } = useFeatureUnlock();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Welcome Banner for Level 1 users */}
      <AnimatePresence>
        {showWelcome && level === 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 relative overflow-hidden"
          >
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-3 right-3 text-amber-400 hover:text-amber-600 transition-colors"
            >
              ×
            </button>

            <div className="flex items-start gap-4">
              <div className="text-4xl">🏺</div>
              <div>
                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                  Welcome to Your Journey of Golden Repair
                </h2>
                <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
                  In Kintsugi, broken pottery is repaired with gold, making it more beautiful than before.
                  Your career setbacks are not flaws—they're golden seams that make you uniquely valuable.
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-xs italic">
                  Start by documenting your first impact below. Each entry brings you closer to unlocking
                  new features and insights.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level & XP Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Awakening Phase
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Level {level}
            </h3>
          </div>
          {currentStreak > 0 && (
            <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {currentStreak} day streak
              </span>
            </div>
          )}
        </div>
        <XPBar compact />
      </motion.div>

      {/* Main Action: Document Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={onQuickCapture}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Document Your Impact</h3>
                <p className="text-purple-100 text-sm">
                  What did you accomplish today? +50 XP
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>

      {/* Growth Mindset (Level 2+) */}
      {canAccessGrowthMindset ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onGrowthMindset}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl p-4 shadow-lg transition-all hover:shadow-xl group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Growth Mindset Tracker</h3>
                  <p className="text-amber-100 text-xs">
                    Transform setbacks into strengths +40 XP
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-500 dark:text-gray-400">
                Growth Mindset Tracker
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Unlocks at Level 2 • Transform setbacks into strengths
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Daily Affirmation - Inline Simple Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
              Today's Affirmation
            </p>
            <p className="text-gray-800 dark:text-gray-100 text-sm italic leading-relaxed">
              "Your journey matters. Every step forward—no matter how small—is adding gold to your story."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Next Unlock Preview */}
      {nextUnlock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Coming at Level {nextUnlock.level}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                <strong>{nextUnlock.feature}</strong> • {nextUnlock.message}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Locked Tabs Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        {!isUnlocked('insightsTab') && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Insights Tab</strong> unlocks at Level 5
            </span>
          </div>
        )}
        {!isUnlocked('yourEdgeTab') && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Your Edge Tab</strong> unlocks at Level 10
            </span>
          </div>
        )}
      </motion.div>

      {/* Philosophy Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center pt-4 pb-8"
      >
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          "Like a vessel beginning its journey, you are learning that imperfections
          are not flaws—they are the starting points of transformation."
        </p>
        <p className="text-xs text-amber-500 mt-1 font-medium">
          — Awakening Phase: Embrace Imperfection
        </p>
      </motion.div>
    </div>
  );
}
