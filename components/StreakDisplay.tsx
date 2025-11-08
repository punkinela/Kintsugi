'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Current Streak */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-theme-primary to-theme-primary rounded-full text-theme-primary-light shadow-lg border border-theme-secondary/30"
      >
        <Flame className="w-5 h-5 theme-text-secondary" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-theme-accent/90">Streak</span>
          <span className="text-lg font-bold leading-none text-theme-primary-light">{currentStreak}</span>
        </div>
      </motion.div>

      {/* Longest Streak */}
      {longestStreak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-theme-primary to-theme-primary rounded-full text-theme-primary-light shadow-lg border border-theme-secondary/20"
        >
          <Trophy className="w-5 h-5 theme-text-secondary" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-theme-accent/90">Best</span>
            <span className="text-lg font-bold leading-none text-theme-primary-light">{longestStreak}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
