'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { getGamificationData } from '@/utils/gamification';
import { LEVEL_TITLES, GROWTH_PHASES, getPhaseForLevel } from '@/types/gamification';

export default function JourneyProgressWidget() {
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const data = getGamificationData();
    setGamificationData(data);
  }, []);

  if (!isClient || !gamificationData) {
    return null;
  }

  const currentPhase = getPhaseForLevel(gamificationData.level);
  const phaseInfo = GROWTH_PHASES[currentPhase];
  const levelTitle = LEVEL_TITLES[gamificationData.level] || 'Curious Explorer';
  const progressPercent = (gamificationData.xp / gamificationData.xpToNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg border border-amber-200 dark:border-gray-700"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Growth Journey
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Level {gamificationData.level} • {levelTitle}
            </p>
          </div>

          {/* Mini Pottery Visual */}
          <div className="relative">
            <svg width="60" height="60" viewBox="0 0 100 100" className="filter drop-shadow-md">
              {/* Pottery vessel */}
              <path
                d="M 50 20 Q 35 25 35 40 L 35 70 Q 35 80 50 85 Q 65 80 65 70 L 65 40 Q 65 25 50 20 Z"
                fill="#d97706"
                stroke="#92400e"
                strokeWidth="1.5"
              />
              {/* Gold seams - more visible at higher levels */}
              <path
                d="M 40 45 Q 50 47 60 45"
                stroke="#fbbf24"
                strokeWidth="2"
                fill="none"
                opacity={gamificationData.level >= 10 ? 1 : 0.3}
              />
              <path
                d="M 38 60 Q 50 58 62 60"
                stroke="#fbbf24"
                strokeWidth="2"
                fill="none"
                opacity={gamificationData.level >= 20 ? 1 : 0.3}
              />
              {/* Sparkle effect for high levels */}
              {gamificationData.level >= 30 && (
                <>
                  <circle cx="45" cy="35" r="2" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="55" cy="35" r="2" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Growth Phase Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${phaseInfo.color} text-white text-sm font-medium mb-4`}>
          <TrendingUp className="h-4 w-4" />
          <span>{phaseInfo.name} Phase</span>
        </div>

        {/* Phase Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {phaseInfo.description}
        </p>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress to Level {gamificationData.level + 1}</span>
            <span className="font-medium text-amber-700 dark:text-amber-400">
              {gamificationData.xp.toLocaleString()} / {gamificationData.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-amber-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {gamificationData.stats.achievementsUnlocked}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {gamificationData.stats.currentStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {gamificationData.points.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Points</div>
          </div>
        </div>

        {/* View Journey Link */}
        <Link
          href="/journey"
          className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg group"
        >
          <span>View Full Journey</span>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
