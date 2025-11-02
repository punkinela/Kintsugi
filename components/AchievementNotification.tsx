'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';
import { Achievement } from '@/types/engagement';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                {achievement.icon}
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Achievement Unlocked!</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                <p className="text-white/90 text-sm">{achievement.description}</p>
              </div>
            </div>
          </div>

          {/* Sparkle effects */}
          <div className="absolute top-2 right-2 text-2xl animate-pulse">✨</div>
          <div className="absolute bottom-2 left-2 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
