'use client';

import { motion } from 'framer-motion';
import { Flame, TrendingUp, Calendar, Award, Zap } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';

interface StreakMilestone {
  days: number;
  title: string;
  icon: string;
  reward: string;
  color: string;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: 'Getting Started', icon: '🔥', reward: '+100 XP', color: 'from-orange-400 to-red-500' },
  { days: 7, title: 'Week Warrior', icon: '💪', reward: '+250 XP', color: 'from-blue-400 to-purple-500' },
  { days: 14, title: 'Two Week Champion', icon: '🏆', reward: '+500 XP', color: 'from-purple-400 to-pink-500' },
  { days: 30, title: 'Monthly Master', icon: '👑', reward: '+1000 XP', color: 'theme-gradient-to-r' },
  { days: 60, title: 'Consistency King', icon: '🌟', reward: '+2000 XP', color: 'from-green-400 to-teal-500' },
  { days: 100, title: 'Century Club', icon: '💎', reward: '+5000 XP', color: 'from-cyan-400 to-blue-600' },
];

export default function EnhancedStreakTracker() {
  const engagement = getEngagementData();
  const { currentStreak, longestStreak } = engagement;

  // Find next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > currentStreak) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const progressToNext = nextMilestone ? (currentStreak / nextMilestone.days) * 100 : 100;

  // Find achieved milestones
  const achievedMilestones = STREAK_MILESTONES.filter(m => m.days <= currentStreak);

  return (
    <div className="space-y-4">
      {/* Main Streak Display */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-2xl p-6 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                <Flame className="h-6 w-6" />
              </motion.div>
              <div>
                <h3 className="text-sm font-medium opacity-90">Current Streak</h3>
                <p className="text-3xl font-bold">{currentStreak} Days</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Award className="h-5 w-5 opacity-75" />
                <span className="text-sm opacity-90">Best Streak</span>
              </div>
              <p className="text-2xl font-bold">{longestStreak} Days</p>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Next Milestone: {nextMilestone.title}</span>
              <span className="font-semibold">{nextMilestone.days} days</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs opacity-75">
              <span>{currentStreak} days</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {nextMilestone.reward}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border theme-border-light dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 theme-text-primary" />
          Streak Milestones
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STREAK_MILESTONES.map((milestone, index) => {
            const achieved = currentStreak >= milestone.days;
            const isNext = milestone.days === nextMilestone.days;

            return (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  achieved
                    ? 'bg-gradient-to-br ' + milestone.color + ' border-transparent text-white'
                    : isNext
                    ? 'border-kintsugi-gold-400 theme-bg-primary-light dark:bg-kintsugi-gold-900/20'
                    : 'theme-border-light dark:border-kintsugi-dark-600 bg-gray-50 dark:bg-kintsugi-dark-900/50'
                }`}
              >
                {achieved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <Award className="h-3 w-3 text-white" />
                  </motion.div>
                )}

                <div className="text-2xl mb-1">{milestone.icon}</div>
                <div className="text-xs font-semibold mb-1">{milestone.days} Days</div>
                <div className={`text-xs ${achieved ? 'text-white/90' : 'text-kintsugi-dark-600 dark:theme-text-secondary'}`}>
                  {milestone.title}
                </div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${achieved ? 'text-white/75' : 'theme-text-primary dark:theme-text-primary'}`}>
                  <Zap className="h-3 w-3" />
                  {milestone.reward}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Total Visits"
          value={engagement.visitCount}
          color="blue"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Milestones Hit"
          value={achievedMilestones.length}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Next in"
          value={`${nextMilestone.days - currentStreak}d`}
          color="purple"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 theme-text-primary dark:text-orange-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-lg p-3 border theme-border-light dark:border-kintsugi-dark-700">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div className="text-xl font-bold text-kintsugi-dark-900 dark:text-white">{value}</div>
      <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">{label}</div>
    </div>
  );
}
