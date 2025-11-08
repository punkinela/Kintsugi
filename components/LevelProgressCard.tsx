'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, Zap, Trophy, Crown } from 'lucide-react';
import { getCurrentLevelInfo, getGamificationData } from '@/utils/gamification';
import { LEVEL_TITLES } from '@/types/gamification';

export default function LevelProgressCard() {
  const levelInfo = getCurrentLevelInfo();
  const gamificationData = getGamificationData();

  // Get next level title
  const nextLevelTitle = LEVEL_TITLES[levelInfo.level + 1] || 'Max Level';

  // Calculate level tier for visual styling
  const getTier = (level: number) => {
    if (level >= 45) return { name: 'Legendary', color: 'from-purple-500 to-pink-500', icon: '👑' };
    if (level >= 35) return { name: 'Epic', color: 'from-blue-500 to-purple-500', icon: '🌟' };
    if (level >= 25) return { name: 'Rare', color: 'from-green-500 to-teal-500', icon: '💎' };
    if (level >= 15) return { name: 'Uncommon', color: 'from-yellow-500 to-orange-500', icon: '🏆' };
    return { name: 'Common', color: 'from-gray-400 to-gray-600', icon: '⭐' };
  };

  const currentTier = getTier(levelInfo.level);
  const nextTier = getTier(levelInfo.level + 1);

  return (
    <div className="space-y-4">
      {/* Main Level Card */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${currentTier.color} rounded-2xl p-6 text-white`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, transparent 30%, white 30%, white 70%, transparent 70%)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Level Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl">{currentTier.icon}</span>
                <div>
                  <div className="text-sm font-medium opacity-90">{currentTier.name} Tier</div>
                  <h3 className="text-2xl font-bold">{levelInfo.title}</h3>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm opacity-90">Level</div>
              <motion.div
                key={levelInfo.level}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-5xl font-black"
              >
                {levelInfo.level}
              </motion.div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Progress to Level {levelInfo.level + 1}</span>
              <span className="font-semibold">{Math.round(levelInfo.progress)}%</span>
            </div>

            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="opacity-75">{levelInfo.xp} / {levelInfo.xpToNextLevel} XP</span>
              <span className="flex items-center gap-1 font-semibold">
                <Crown className="h-3 w-3" />
                {nextLevelTitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Star className="h-5 w-5 theme-text-primary" />}
          label="Total XP"
          value={levelInfo.totalXP.toLocaleString()}
          bgColor="theme-bg-primary-light dark:bg-yellow-900/10"
          borderColor="border-yellow-200 dark:border-yellow-900/30"
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-blue-500" />}
          label="Points"
          value={gamificationData.points.toLocaleString()}
          bgColor="bg-blue-50 dark:bg-blue-900/10"
          borderColor="border-blue-200 dark:border-blue-900/30"
        />
      </div>

      {/* Level Tiers Preview */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border theme-border-light dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 theme-text-primary" />
          Level Tiers
        </h4>

        <div className="space-y-2">
          {[
            { min: 1, max: 14, ...getTier(1) },
            { min: 15, max: 24, ...getTier(15) },
            { min: 25, max: 34, ...getTier(25) },
            { min: 35, max: 44, ...getTier(35) },
            { min: 45, max: 50, ...getTier(45) },
          ].map((tier, index) => {
            const isCurrentTier = levelInfo.level >= tier.min && levelInfo.level <= tier.max;
            const isCompleted = levelInfo.level > tier.max;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                  isCurrentTier
                    ? 'theme-bg-primary-light dark:bg-kintsugi-gold-900/20 border theme-border-accent dark:theme-border-primary'
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30'
                    : 'bg-gray-50 dark:bg-kintsugi-dark-900/50 border border-gray-200 dark:border-kintsugi-dark-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tier.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white">
                      {tier.name} Tier
                    </div>
                    <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
                      Levels {tier.min}-{tier.max}
                    </div>
                  </div>
                </div>

                {isCurrentTier && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 theme-bg-primary text-white text-xs font-semibold rounded"
                  >
                    Current
                  </motion.div>
                )}

                {isCompleted && (
                  <div className="text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
  borderColor
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-4 border ${borderColor}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">{label}</span>
      </div>
      <div className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">{value}</div>
    </div>
  );
}
