'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Rocket, Star, Crown, Zap, CheckCircle, Lock } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface MilestoneTrackerProps {
  entryCount: number;
  currentStreak: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  type: 'entries' | 'streak';
  icon: any;
  color: string;
  reward: string;
}

export default function MilestoneTracker({ entryCount, currentStreak }: MilestoneTrackerProps) {
  const milestones: Milestone[] = [
    {
      id: 'first-entry',
      title: 'First Step',
      description: 'Create your first journal entry',
      target: 1,
      type: 'entries',
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      reward: '+10 XP'
    },
    {
      id: 'five-entries',
      title: 'Getting Started',
      description: 'Write 5 journal entries',
      target: 5,
      type: 'entries',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      reward: '+25 XP'
    },
    {
      id: 'three-day-streak',
      title: '3-Day Warrior',
      description: 'Maintain a 3-day streak',
      target: 3,
      type: 'streak',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      reward: '+50 XP'
    },
    {
      id: 'ten-entries',
      title: 'Active Journaler',
      description: 'Write 10 journal entries',
      target: 10,
      type: 'entries',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500',
      reward: '+75 XP'
    },
    {
      id: 'week-streak',
      title: 'Week Champion',
      description: 'Maintain a 7-day streak',
      target: 7,
      type: 'streak',
      icon: Rocket,
      color: 'from-yellow-500 to-orange-500',
      reward: '+100 XP'
    },
    {
      id: 'fifty-entries',
      title: 'Dedicated Writer',
      description: 'Write 50 journal entries',
      target: 50,
      type: 'entries',
      icon: Crown,
      color: 'from-indigo-500 to-purple-500',
      reward: '+200 XP'
    },
    {
      id: 'thirty-day-streak',
      title: '30-Day Legend',
      description: 'Maintain a 30-day streak',
      target: 30,
      type: 'streak',
      icon: Trophy,
      color: 'from-kintsugi-gold-500 to-amber-500',
      reward: '+500 XP'
    },
    {
      id: 'hundred-entries',
      title: 'Elite Journaler',
      description: 'Write 100 journal entries',
      target: 100,
      type: 'entries',
      icon: Star,
      color: 'from-pink-500 to-rose-500',
      reward: '+1000 XP'
    },
  ];

  const getMilestoneProgress = (milestone: Milestone) => {
    const current = milestone.type === 'entries' ? entryCount : currentStreak;
    const progress = Math.min((current / milestone.target) * 100, 100);
    const isUnlocked = current >= milestone.target;
    const isNext = !isUnlocked && (
      milestones
        .filter(m => m.type === milestone.type)
        .sort((a, b) => a.target - b.target)
        .findIndex(m => m.id === milestone.id) ===
      milestones
        .filter(m => m.type === milestone.type && (m.type === 'entries' ? entryCount : currentStreak) < m.target)
        .sort((a, b) => a.target - b.target)
        .findIndex(m => m.id === milestone.id)
    );

    return { progress, isUnlocked, isNext, current };
  };

  const unlockedCount = milestones.filter(m => getMilestoneProgress(m).isUnlocked).length;
  const nextMilestone = milestones.find(m => !getMilestoneProgress(m).isUnlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-kintsugi-gold-500 to-amber-500 rounded-xl shadow-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Journey Milestones
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount} of {milestones.length} achieved
            </p>
          </div>
        </div>

        {/* Overall Progress Ring */}
        <ProgressRing
          progress={(unlockedCount / milestones.length) * 100}
          size={80}
          strokeWidth={6}
          color="#D4AF37"
          backgroundColor="#FEF3C7"
          showPercentage={true}
        />
      </div>

      {/* Next Milestone Highlight */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 bg-gradient-to-r ${nextMilestone.color} rounded-xl text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Up Next</p>
              <p className="text-xl font-bold">{nextMilestone.title}</p>
              <p className="text-sm opacity-90 mt-1">{nextMilestone.description}</p>
              <div className="mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 w-full max-w-[200px] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getMilestoneProgress(nextMilestone).progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-white h-full rounded-full"
                    />
                  </div>
                  <span className="font-semibold">
                    {getMilestoneProgress(nextMilestone).current}/{nextMilestone.target}
                  </span>
                </div>
              </div>
            </div>
            <nextMilestone.icon className="h-12 w-12 opacity-80" />
          </div>
        </motion.div>
      )}

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {milestones.map((milestone, index) => {
          const { progress, isUnlocked, isNext, current } = getMilestoneProgress(milestone);
          const Icon = milestone.icon;

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isUnlocked
                  ? `bg-gradient-to-br ${milestone.color} border-transparent text-white shadow-lg`
                  : isNext
                  ? 'bg-white dark:bg-gray-800 border-kintsugi-gold-300 dark:border-kintsugi-gold-700'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
              }`}
            >
              {/* Lock Icon for Locked Milestones */}
              {!isUnlocked && !isNext && (
                <div className="absolute top-2 right-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              )}

              {/* Check Icon for Unlocked Milestones */}
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <Icon className={`h-6 w-6 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
                </div>

                <div className="flex-1">
                  <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {milestone.title}
                  </h4>
                  <p className={`text-sm mt-1 ${isUnlocked ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                    {milestone.description}
                  </p>

                  {/* Progress Bar for Active Milestone */}
                  {!isUnlocked && isNext && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{current}/{milestone.target}</span>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${milestone.color} rounded-full`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reward Badge */}
                  <div className="mt-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-white/20 backdrop-blur-sm text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {milestone.reward}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Encouragement Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800/30 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong className="text-green-700 dark:text-green-400">🎯 Keep Going!</strong>{' '}
          {unlockedCount === 0 && "Start your journey by creating your first entry!"}
          {unlockedCount > 0 && unlockedCount < 3 && "You're building momentum! Every entry counts."}
          {unlockedCount >= 3 && unlockedCount < 6 && "Impressive progress! You're becoming a consistent journaler."}
          {unlockedCount >= 6 && unlockedCount < milestones.length && "You're on fire! Only a few milestones left."}
          {unlockedCount === milestones.length && "🎉 Legendary! You've unlocked all milestones!"}
        </p>
      </div>
    </motion.div>
  );
}
