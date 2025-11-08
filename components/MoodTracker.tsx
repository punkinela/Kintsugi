'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getEngagementData } from '@/utils/engagement';
import { getMoodData, getMoodTrend, getAverageMood, getMoodCalendar } from '@/utils/advancedAnalytics';

const MOOD_EMOJIS = {
  'great': '😄',
  'good': '🙂',
  'neutral': '😐',
  'challenging': '😟',
  'difficult': '😞'
};

const MOOD_COLORS = {
  'great': '#10b981',
  'good': '#3b82f6',
  'neutral': '#6b7280',
  'challenging': '#f59e0b',
  'difficult': '#ef4444'
};

export default function MoodTracker() {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const engagement = getEngagementData();
    setEntries(engagement.journalEntries);
  }, []);

  const moodData = getMoodData(entries, timeRange);
  const trend = getMoodTrend(entries);
  const avgMood = getAverageMood(entries, timeRange);

  // Prepare chart data
  const chartData = moodData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: d.score,
    mood: d.mood
  }));

  // Mood distribution
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalMoods = (Object.values(moodCounts) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
            <Smile className="h-6 w-6 theme-text-primary" />
            Mood Tracking
          </h2>
          <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary mt-1">
            Track your emotional journey over time
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {([7, 30, 90] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'theme-bg-primary text-white'
                  : 'bg-white dark:bg-kintsugi-dark-800 text-kintsugi-dark-600 dark:theme-text-secondary hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Mood */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{avgMood >= 4 ? '😄' : avgMood >= 3 ? '🙂' : '😐'}</div>
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Average Mood</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {avgMood.toFixed(1)}/5.0
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Last {timeRange} days</div>
        </div>

        {/* Trend */}
        <div className={`bg-gradient-to-br rounded-xl p-6 border ${
          trend === 'improving'
            ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
            : trend === 'declining'
            ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
            : 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {trend === 'improving' && <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />}
            {trend === 'declining' && <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />}
            {trend === 'stable' && <Minus className="h-8 w-8 text-gray-600 dark:text-gray-400" />}
            <div>
              <div className={`text-sm font-medium ${
                trend === 'improving' ? 'text-green-700 dark:text-green-300' :
                trend === 'declining' ? 'text-red-700 dark:text-red-300' :
                'text-gray-700 dark:text-gray-300'
              }`}>
                Mood Trend
              </div>
              <div className={`text-2xl font-bold ${
                trend === 'improving' ? 'text-green-900 dark:text-green-100' :
                trend === 'declining' ? 'text-red-900 dark:text-red-100' :
                'text-gray-900 dark:text-gray-100'
              }`}>
                {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
              </div>
            </div>
          </div>
        </div>

        {/* Total Entries with Mood */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Tracked Days</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {moodData.length}
              </div>
            </div>
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            {((moodData.length / timeRange) * 100).toFixed(0)}% completion
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      {chartData.length > 0 ? (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
          <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4">
            Mood Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any, name: any, props: any) => [
                  `${props.payload.mood} (${value}/5)`,
                  'Mood'
                ]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMood)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-12 border theme-border-light dark:border-kintsugi-dark-700 text-center">
          <Meh className="h-12 w-12 mx-auto theme-text-secondary mb-3" />
          <p className="text-kintsugi-dark-600 dark:theme-text-secondary">
            No mood data available yet. Start tracking your mood with journal entries!
          </p>
        </div>
      )}

      {/* Mood Distribution */}
      {totalMoods > 0 && (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
          <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4">
            Mood Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => {
              const count = moodCounts[mood] || 0;
              const percentage = totalMoods > 0 ? (count / totalMoods) * 100 : 0;

              return (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-kintsugi-dark-700 dark:theme-text-secondary capitalize">
                        {mood}
                      </span>
                      <span className="text-kintsugi-dark-600 dark:theme-text-secondary">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-kintsugi-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: MOOD_COLORS[mood as keyof typeof MOOD_COLORS] }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
