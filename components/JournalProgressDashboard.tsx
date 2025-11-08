'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Clock, Calendar, PenTool } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { useEffect, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

interface JournalProgressDashboardProps {
  entries: JournalEntry[];
}

interface PersonalRecord {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle: string;
}

export default function JournalProgressDashboard({ entries }: JournalProgressDashboardProps) {
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);

  useEffect(() => {
    calculateRecords();
    calculateWeeklyData();
  }, [entries]);

  const calculateRecords = () => {
    if (entries.length === 0) {
      setRecords([]);
      return;
    }

    // Most entries in a day
    const entriesByDate: { [date: string]: number } = {};
    entries.forEach(entry => {
      const date = new Date(entry.date).toDateString();
      entriesByDate[date] = (entriesByDate[date] || 0) + 1;
    });
    const maxEntriesInDay = Math.max(...Object.values(entriesByDate));

    // Most entries in a week
    const entriesByWeek: { [week: string]: number } = {};
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toDateString();
      entriesByWeek[weekKey] = (entriesByWeek[weekKey] || 0) + 1;
    });
    const maxEntriesInWeek = Math.max(...Object.values(entriesByWeek));

    // Total word count (estimate based on character count)
    const totalWords = entries.reduce((sum, entry) => {
      const words = (entry.accomplishment?.length || 0) + (entry.reflection?.length || 0);
      return sum + Math.floor(words / 5); // rough estimate: 5 chars per word
    }, 0);

    // Average entry length
    const avgLength = Math.floor(totalWords / entries.length);

    // Most productive time
    const hourCounts: { [hour: number]: number } = {};
    entries.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const mostProductiveHour = parseInt(
      Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '12'
    );
    const timeOfDay =
      mostProductiveHour < 12
        ? 'Morning'
        : mostProductiveHour < 17
        ? 'Afternoon'
        : mostProductiveHour < 21
        ? 'Evening'
        : 'Night';

    const newRecords: PersonalRecord[] = [
      {
        title: 'Most Entries',
        value: maxEntriesInDay,
        subtitle: 'in a single day',
        icon: Award,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        title: 'Best Week',
        value: maxEntriesInWeek,
        subtitle: 'entries in one week',
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: 'Total Words',
        value: totalWords.toLocaleString(),
        subtitle: 'words written',
        icon: PenTool,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Peak Time',
        value: timeOfDay,
        subtitle: `${mostProductiveHour % 12 || 12}${mostProductiveHour < 12 ? 'AM' : 'PM'}`,
        icon: Clock,
        color: 'from-purple-500 to-pink-500'
      },
      {
        title: 'Avg Length',
        value: avgLength,
        subtitle: 'words per entry',
        icon: BarChart3,
        color: 'from-indigo-500 to-purple-500'
      },
      {
        title: 'Total Days',
        value: Object.keys(entriesByDate).length,
        subtitle: 'unique days journaled',
        icon: Calendar,
        color: 'from-rose-500 to-red-500'
      }
    ];

    setRecords(newRecords);
  };

  const calculateWeeklyData = () => {
    const last7Weeks: number[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const count = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      }).length;

      last7Weeks.push(count);
    }

    setWeeklyData(last7Weeks);
  };

  const getWeekLabel = (weeksAgo: number) => {
    if (weeksAgo === 0) return 'This\nWeek';
    if (weeksAgo === 1) return 'Last\nWeek';
    return `${weeksAgo}w\nago`;
  };

  const maxWeeklyValue = Math.max(...weeklyData, 1);

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 text-center"
      >
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Start Your Journey
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first entry to unlock your personal progress dashboard!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personal records and trends
            </p>
          </div>
        </div>
      </div>

      {/* Personal Records Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {records.map((record, index) => {
          const Icon = record.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${record.color} text-white shadow-lg`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative">
                <Icon className="h-6 w-6 mb-2 opacity-90" />
                <p className="text-sm opacity-90 mb-1">{record.title}</p>
                <p className="text-2xl font-bold">
                  {typeof record.value === 'number' ? (
                    <AnimatedCounter value={record.value} className="inline" />
                  ) : (
                    record.value
                  )}
                </p>
                <p className="text-xs opacity-75 mt-1">{record.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Weekly Trend
        </h4>

        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((count, index) => {
            const heightPercentage = (count / maxWeeklyValue) * 100;
            const isCurrentWeek = index === weeklyData.length - 1;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`w-full rounded-t-lg ${
                    isCurrentWeek
                      ? 'bg-gradient-to-t from-kintsugi-gold-500 to-amber-400'
                      : 'bg-gradient-to-t from-indigo-500 to-purple-500'
                  } min-h-[20px] relative group cursor-pointer`}
                  title={`${count} ${count === 1 ? 'entry' : 'entries'}`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {count} {count === 1 ? 'entry' : 'entries'}
                  </div>

                  {/* Value label */}
                  {count > 0 && (
                    <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
                      {count}
                    </span>
                  )}
                </motion.div>

                <span className="text-xs text-center text-gray-600 dark:text-gray-400 leading-tight whitespace-pre-line">
                  {getWeekLabel(weeklyData.length - 1 - index)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Trend Insight */}
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {weeklyData[weeklyData.length - 1] > weeklyData[weeklyData.length - 2] ? (
              <>
                <strong className="text-green-600 dark:text-green-400">📈 Trending Up!</strong> You're journaling more this week. Keep the momentum going!
              </>
            ) : weeklyData[weeklyData.length - 1] === weeklyData[weeklyData.length - 2] ? (
              <>
                <strong className="text-blue-600 dark:text-blue-400">📊 Consistent!</strong> You're maintaining steady progress. Great job!
              </>
            ) : (
              <>
                <strong className="theme-text-primary dark:theme-text-secondary">💪 Keep Going!</strong> Every entry counts. You've got this!
              </>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
