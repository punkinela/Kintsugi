'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Award,
  Hash,
  Tag,
  FileText,
  Smile,
  Flame,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getEngagementData } from '@/utils/engagement';
import {
  calculatePersonalStats,
  analyzeJournalingPatterns,
  getEntriesTimeSeries
} from '@/utils/advancedAnalytics';
import { downloadFile } from '@/utils/analytics';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899'];

export default function PersonalStatsDashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [patterns, setPatterns] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const engagement = getEngagementData();
    const journalEntries = engagement.journalEntries || [];
    setEntries(journalEntries);

    if (journalEntries.length > 0) {
      setStats(calculatePersonalStats(journalEntries));
      setPatterns(analyzeJournalingPatterns(journalEntries));
      setTimeSeriesData(getEntriesTimeSeries(journalEntries, 'day'));
    } else {
      setStats(null);
      setPatterns(null);
      setTimeSeriesData([]);
    }

    // Listen for storage changes from other tabs/components
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event when data changes in same tab
    window.addEventListener('kintsugi-data-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kintsugi-data-updated', handleStorageChange);
    };
  }, [refreshKey]);

  if (!stats) {
    return (
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-12 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700 text-center">
        <BarChart3 className="h-12 w-12 mx-auto text-kintsugi-gold-400 mb-3" />
        <p className="text-kintsugi-dark-600 dark:text-kintsugi-gold-400">
          Start journaling to see your personal statistics!
        </p>
      </div>
    );
  }

  const exportStats = () => {
    const report = `
PERSONAL STATISTICS REPORT
Generated: ${new Date().toLocaleDateString()}

=== WRITING STATISTICS ===
Total Entries: ${stats.totalEntries}
Total Words: ${stats.totalWords}
Average Words per Entry: ${stats.averageWordsPerEntry}
Longest Entry: ${stats.longestEntry} words
Shortest Entry: ${stats.shortestEntry} words

=== ACTIVITY ===
Entries This Week: ${stats.entriesThisWeek}
Entries This Month: ${stats.entriesThisMonth}
Most Productive Month: ${stats.mostProductiveMonth}
Current Streak: ${stats.currentStreak} days
Longest Streak: ${stats.longestStreak} days

=== PATTERNS ===
Preferred Writing Time: ${patterns.preferredTime}
Most Productive Day: ${patterns.mostProductiveDay}
Journaling Frequency: ${patterns.journalingFrequency} entries/week
Consistency Score: ${patterns.consistencyScore}/100

=== CATEGORIES ===
${stats.favoriteCategories.map((c: any) => `${c.category}: ${c.count}`).join('\n')}

=== TOP TAGS ===
${stats.topTags.map((t: any) => `#${t.tag}: ${t.count}`).join('\n')}

=== MOOD DISTRIBUTION ===
${stats.moodDistribution.map((m: any) => `${m.mood}: ${m.count} (${m.percentage}%)`).join('\n')}
    `.trim();

    downloadFile(report, `personal-stats-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-kintsugi-gold-600" />
            Personal Statistics
          </h2>
          <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-1">
            Comprehensive overview of your journaling journey
          </p>
        </div>

        <button
          onClick={exportStats}
          className="flex items-center gap-2 px-4 py-2 bg-kintsugi-gold-600 hover:bg-kintsugi-gold-700 text-white rounded-lg transition-colors font-medium"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Total Entries"
          value={stats.totalEntries}
          color="blue"
        />
        <StatCard
          icon={<Hash className="h-5 w-5" />}
          label="Total Words"
          value={stats.totalWords.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          color="orange"
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="Longest Streak"
          value={`${stats.longestStreak} days`}
          color="green"
        />
      </div>

      {/* Writing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
          <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-kintsugi-gold-600" />
            Writing Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Average words per entry</span>
              <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white">{stats.averageWordsPerEntry}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Longest entry</span>
              <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white">{stats.longestEntry} words</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Shortest entry</span>
              <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white">{stats.shortestEntry} words</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Most productive month</span>
              <span className="text-sm font-bold text-kintsugi-dark-900 dark:text-white">{stats.mostProductiveMonth}</span>
            </div>
          </div>
        </div>

        {/* Journaling Patterns */}
        {patterns && (
          <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-kintsugi-gold-600" />
              Journaling Patterns
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Preferred time</span>
                <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white capitalize">{patterns.preferredTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Most productive day</span>
                <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white">{patterns.mostProductiveDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Frequency</span>
                <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white">{patterns.journalingFrequency}/week</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">Consistency score</span>
                  <span className="text-lg font-bold text-kintsugi-dark-900 dark:text-white">{patterns.consistencyScore}/100</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-kintsugi-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${patterns.consistencyScore}%` }}
                    className="h-full bg-gradient-to-r from-kintsugi-gold-500 to-kintsugi-gold-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entries Over Time */}
      {timeSeriesData.length > 0 && (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
          <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-kintsugi-gold-600" />
            Entries Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Categories & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorite Categories */}
        {stats.favoriteCategories.length > 0 && (
          <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-kintsugi-gold-600" />
              Top Categories
            </h3>
            <div className="space-y-3">
              {stats.favoriteCategories.map((cat: any, index: number) => {
                const percentage = (cat.count / stats.totalEntries) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-kintsugi-dark-700 dark:text-kintsugi-gold-300 capitalize">
                        {cat.category}
                      </span>
                      <span className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400">
                        {cat.count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-kintsugi-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Tags */}
        {stats.topTags.length > 0 && (
          <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-kintsugi-gold-600" />
              Top Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.topTags.map((tag: any, index: number) => (
                <motion.span
                  key={tag.tag}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${COLORS[index % COLORS.length]}20`,
                    color: COLORS[index % COLORS.length]
                  }}
                >
                  #{tag.tag}
                  <span className="opacity-75 text-xs">×{tag.count}</span>
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mood Distribution */}
      {stats.moodDistribution.length > 0 && (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
          <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4 flex items-center gap-2">
            <Smile className="h-5 w-5 text-kintsugi-gold-600" />
            Mood Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.moodDistribution.map((mood: any) => (
              <div key={mood.mood} className="text-center">
                <div className="text-4xl mb-2">
                  {mood.mood === 'great' && '😄'}
                  {mood.mood === 'good' && '🙂'}
                  {mood.mood === 'neutral' && '😐'}
                  {mood.mood === 'challenging' && '😟'}
                  {mood.mood === 'difficult' && '😞'}
                </div>
                <div className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">
                  {mood.percentage}%
                </div>
                <div className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400 capitalize">
                  {mood.mood}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Entries This Week</div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.entriesThisWeek}</div>
            </div>
            <Calendar className="h-12 w-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Entries This Month</div>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.entriesThisMonth}</div>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'purple' | 'orange' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">{value}</div>
      <div className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400">{label}</div>
    </div>
  );
}
