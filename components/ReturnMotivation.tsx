'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Flame, Award, Calendar, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReturnMotivation() {
  const [nextGoals, setNextGoals] = useState<any[]>([]);
  const [streakInfo, setStreakInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadGoals = () => {
      const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
      const currentStreak = engagement.currentStreak || 0;
      const journalEntries = engagement.journalEntries || [];
      const achievements = engagement.achievements || [];

    // Calculate next goals
    const goals = [];

    // Streak goals
    if (currentStreak === 0) {
      goals.push({
        icon: <Flame className="h-5 w-5" />,
        title: 'Start Your Streak!',
        description: 'Come back tomorrow to start building your daily streak',
        color: 'from-orange-500 to-red-600',
      });
    } else {
      const nextStreakMilestone = currentStreak < 3 ? 3 : currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 100 ? 100 : currentStreak + 100;
      const daysUntilMilestone = nextStreakMilestone - currentStreak;
      goals.push({
        icon: <Flame className="h-5 w-5" />,
        title: `${daysUntilMilestone} ${daysUntilMilestone === 1 ? 'Day' : 'Days'} to ${nextStreakMilestone}-Day Streak!`,
        description: `Keep going! Don't break your ${currentStreak}-day streak`,
        color: 'from-orange-500 to-red-600',
        progress: (currentStreak / nextStreakMilestone) * 100,
      });
    }

    // Impact entry goals
    const entryCount = journalEntries.length;
    const nextEntryMilestone = entryCount < 5 ? 5 : entryCount < 10 ? 10 : entryCount < 25 ? 25 : entryCount < 50 ? 50 : entryCount < 100 ? 100 : entryCount + 100;
    const entriesUntilMilestone = nextEntryMilestone - entryCount;
    if (entriesUntilMilestone <= 10) {
      goals.push({
        icon: <Target className="h-5 w-5" />,
        title: `${entriesUntilMilestone} ${entriesUntilMilestone === 1 ? 'Entry' : 'Entries'} to ${nextEntryMilestone} Total!`,
        description: 'Unlock a new achievement milestone',
        color: 'from-purple-500 to-pink-600',
        progress: (entryCount / nextEntryMilestone) * 100,
      });
    }

    // Achievement goals
    const achievementCount = achievements.length;
    const totalAchievements = 35; // We have 35+ achievements
    if (achievementCount < totalAchievements) {
      goals.push({
        icon: <Award className="h-5 w-5" />,
        title: `${totalAchievements - achievementCount} More Achievements to Unlock!`,
        description: 'Keep tracking your progress to earn all achievements',
        color: 'from-blue-500 to-indigo-600',
        progress: (achievementCount / totalAchievements) * 100,
      });
    }

    // Weekly goal
    const today = new Date();
    const thisWeek = journalEntries.filter((e: any) => {
      const entryDate = new Date(e.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });
    const weeklyGoal = 7; // One entry per day
    if (thisWeek.length < weeklyGoal) {
      goals.push({
        icon: <Calendar className="h-5 w-5" />,
        title: `${weeklyGoal - thisWeek.length} More ${weeklyGoal - thisWeek.length === 1 ? 'Entry' : 'Entries'} This Week`,
        description: 'Reach your weekly goal of 7 entries',
        color: 'from-green-500 to-teal-600',
        progress: (thisWeek.length / weeklyGoal) * 100,
      });
    }

      setNextGoals(goals.slice(0, 3)); // Show top 3 goals

      // Set streak info for reminder
      setStreakInfo({
        current: currentStreak,
        lastEntry: journalEntries.length > 0 ? journalEntries[journalEntries.length - 1].date : null,
      });
    };

    // Load goals initially
    loadGoals();

    // Listen for storage changes
    const handleDataChange = () => {
      loadGoals();
    };

    window.addEventListener('storage', handleDataChange);
    window.addEventListener('kintsugi-data-updated', handleDataChange);

    return () => {
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('kintsugi-data-updated', handleDataChange);
    };
  }, []);

  if (nextGoals.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 overflow-hidden"
    >
      <div className="bg-gradient-to-r theme-gradient-to-r px-6 py-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-white" />
          <h3 className="text-xl font-bold text-white">Your Next Goals</h3>
        </div>
        <p className="text-white/90 text-sm mt-1">
          Keep up the momentum! Here's what's coming next
        </p>
      </div>

      <div className="p-6 space-y-4">
        {nextGoals.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${goal.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {goal.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {goal.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {goal.description}
                </p>
                {goal.progress !== undefined && (
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${goal.color}`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {Math.round(goal.progress)}% complete
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Come back tomorrow reminder */}
        {streakInfo && streakInfo.current > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800"
          >
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 theme-text-primary dark:text-orange-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                  Don't break your {streakInfo.current}-day streak!
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">
                  Come back tomorrow to keep the momentum going 🔥
                </p>
              </div>
              <ArrowRight className="h-4 w-4 theme-text-primary dark:text-orange-400 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
