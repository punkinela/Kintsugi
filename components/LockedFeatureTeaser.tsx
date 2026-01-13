'use client';

import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

interface LockedFeatureTeaserProps {
  featureName: string;
  unlockLevel: number;
  currentLevel: number;
  description?: string;
  variant?: 'card' | 'inline' | 'tab';
}

export default function LockedFeatureTeaser({
  featureName,
  unlockLevel,
  currentLevel,
  description,
  variant = 'card'
}: LockedFeatureTeaserProps) {
  const levelsToGo = unlockLevel - currentLevel;

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
        <Lock className="w-4 h-4" />
        <span className="text-sm">Unlocks at Level {unlockLevel}</span>
      </div>
    );
  }

  if (variant === 'tab') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full min-h-[400px] p-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <Lock className="w-12 h-12 text-amber-500 dark:text-amber-400" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          {featureName}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-center mb-4 max-w-md">
          {description || `This feature unlocks at Level ${unlockLevel}`}
        </p>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {levelsToGo === 1
                  ? 'Just 1 more level to go!'
                  : `${levelsToGo} levels to unlock`}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Keep logging entries to earn XP and level up
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < Math.min(5, Math.floor((currentLevel / unlockLevel) * 5))
                    ? 'bg-amber-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Level {currentLevel} / {unlockLevel}
          </span>
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
    >
      {/* Decorative locked pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            currentColor 10px,
            currentColor 11px
          )`
        }} />
      </div>

      <div className="relative flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
          <Lock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {featureName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {description || 'This feature is waiting for you!'}
          </p>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Unlocks at Level {unlockLevel}
            </span>
            {levelsToGo <= 3 && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {levelsToGo === 1 ? 'Almost there!' : `${levelsToGo} levels away`}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
