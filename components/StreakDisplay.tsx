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
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 rounded-full text-kintsugi-gold-50 shadow-lg border border-kintsugi-gold-400/30"
      >
        <Flame className="w-5 h-5 text-kintsugi-gold-200" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-kintsugi-gold-100/90">Streak</span>
          <span className="text-lg font-bold leading-none text-kintsugi-gold-50">{currentStreak}</span>
        </div>
      </motion.div>

      {/* Longest Streak */}
      {longestStreak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-kintsugi-gold-500 to-kintsugi-gold-700 rounded-full text-kintsugi-gold-50 shadow-lg border border-kintsugi-gold-400/20"
        >
          <Trophy className="w-5 h-5 text-kintsugi-gold-200" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-kintsugi-gold-100/90">Best</span>
            <span className="text-lg font-bold leading-none text-kintsugi-gold-50">{longestStreak}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
