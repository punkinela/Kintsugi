'use client';

import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp, Award } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { useEffect, useState } from 'react';

interface StreakCalendarProps {
  entries: JournalEntry[];
}

export default function StreakCalendar({ entries }: StreakCalendarProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [heatmapData, setHeatmapData] = useState<{ [date: string]: number }>({});

  useEffect(() => {
    calculateStreaks();
    generateHeatmapData();
  }, [entries]);

  const calculateStreaks = () => {
    if (entries.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    // Sort entries by date (most recent first)
    const sortedEntries = [...entries].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Get unique days with entries
    const entryDates = sortedEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
    const uniqueDays = [...new Set(entryDates)];

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      if (uniqueDays.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        // Allow for today to not have an entry yet
        break;
      }
    }

    setCurrentStreak(streak);

    // Calculate longest streak
    let maxStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const prevDate = new Date(uniqueDays[i - 1]);
      const currDate = new Date(uniqueDays[i]);
      const dayDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    setLongestStreak(maxStreak);
  };

  const generateHeatmapData = () => {
    const data: { [date: string]: number } = {};

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      data[dateStr] = (data[dateStr] || 0) + 1;
    });

    setHeatmapData(data);
  };

  const getLast90Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return days;
  };

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-kintsugi-gold-200 dark:bg-kintsugi-gold-900/40';
    if (count === 2) return 'theme-bg-secondary dark:bg-kintsugi-gold-700';
    if (count === 3) return 'theme-bg-primary dark:theme-bg-primary';
    return 'theme-bg-primary dark:theme-bg-primary';
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak === 1) return "Great start! Keep it going!";
    if (currentStreak < 7) return "You're building momentum!";
    if (currentStreak < 14) return "One week strong! 🎉";
    if (currentStreak < 30) return "Two weeks in! Amazing!";
    if (currentStreak < 60) return "30-day club member! 🏆";
    return "Legendary dedication! 🌟";
  };

  const last90Days = getLast90Days();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Journaling Streak
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getStreakMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 theme-bg-secondary rounded-lg">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold theme-text-primary dark:text-orange-400">
                {currentStreak} days
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {longestStreak} days
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {entries.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Heatmap Calendar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 theme-text-primary" />
            Last 90 Days
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-3 h-3 rounded-sm bg-kintsugi-gold-200 dark:bg-kintsugi-gold-900/40"></div>
              <div className="w-3 h-3 rounded-sm theme-bg-secondary dark:bg-kintsugi-gold-700"></div>
              <div className="w-3 h-3 rounded-sm theme-bg-primary dark:theme-bg-primary"></div>
              <div className="w-3 h-3 rounded-sm theme-bg-primary dark:theme-bg-primary"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        {/* GitHub-style contribution graph */}
        <div className="grid grid-cols-13 gap-1 sm:gap-2">
          {last90Days.map((date, index) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const count = heatmapData[dateStr] || 0;
            const isToday = dateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005 }}
                whileHover={{ scale: 1.3, zIndex: 10 }}
                className={`w-full aspect-square rounded-sm ${getIntensityColor(count)} ${
                  isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                } cursor-pointer relative group`}
                title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {count} {count === 1 ? 'entry' : 'entries'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Streak Warning */}
      {currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50  border-2 theme-border-accent dark:theme-border-primary/50 rounded-xl p-4"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-amber-700 dark:theme-text-secondary">🔥 Don't break the chain!</strong> You've built a {currentStreak}-day streak. Journal today to keep it going!
          </p>
        </motion.div>
      )}

      {/* Milestones */}
      {currentStreak >= 3 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[3, 7, 14, 30, 60, 90, 180, 365].map(milestone => (
            currentStreak >= milestone && (
              <motion.div
                key={milestone}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-gradient-to-r theme-gradient-to-r text-white text-xs font-semibold rounded-full shadow-md"
              >
                {milestone} Day Club 🏆
              </motion.div>
            )
          ))}
        </div>
      )}
    </motion.div>
  );
}
