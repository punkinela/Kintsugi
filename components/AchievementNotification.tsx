'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { EnhancedAchievement } from '@/types/gamification';

interface AchievementNotificationProps {
  achievement: EnhancedAchievement | null;
  onClose: () => void;
}

const TIER_COLORS = {
  bronze: 'from-orange-500 to-amber-600',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-400 to-blue-500',
  diamond: 'from-purple-500 to-pink-600',
};

const TIER_GLOW = {
  bronze: 'shadow-orange-500/50',
  silver: 'shadow-gray-400/50',
  gold: 'shadow-yellow-500/50',
  platinum: 'shadow-cyan-500/50',
  diamond: 'shadow-purple-500/50',
};

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-[9999]"
        >
          <motion.div
            className={`
              bg-gradient-to-br ${TIER_COLORS[achievement.tier]}
              rounded-2xl shadow-2xl ${TIER_GLOW[achievement.tier]}
              p-6 min-w-[320px] max-w-md border-2 border-white/20
            `}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShow(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="text-4xl"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                {achievement.icon}
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-white" />
                  <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                    Achievement Unlocked!
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {achievement.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/90 text-sm mb-3">
              {achievement.description}
            </p>

            {/* Rewards */}
            <div className="flex items-center gap-4 pt-3 border-t border-white/20">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⚡</span>
                <span className="text-white font-bold">+{achievement.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⭐</span>
                <span className="text-white font-bold">+{achievement.pointsReward} Points</span>
              </div>
            </div>

            {/* Tier badge */}
            <div className="absolute top-3 right-12">
              <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-black/20 rounded-full uppercase">
                {achievement.tier}
              </span>
            </div>

            {/* Sparkle effects */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-2 right-16 text-2xl animate-pulse">✨</span>
              <span className="absolute bottom-2 left-4 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</span>
              <span className="absolute top-1/2 right-8 text-lg animate-pulse" style={{ animationDelay: '1s' }}>💫</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
