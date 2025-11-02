'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award, BarChart3, Target } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { getEngagementData } from '@/utils/engagement';

interface GrowthData {
  totalCount: number;
  thisWeek: number;
  thisMonth: number;
  byCategory: { [key: string]: number };
  bySize: { micro: number; small: number; medium: number; major: number };
  trend: 'up' | 'down' | 'stable';
  weeklyData: { week: string; count: number }[];
}

export default function AccomplishmentGrowthChart() {
  const [growthData, setGrowthData] = useState<GrowthData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateGrowthData();
  }, []);

  const calculateGrowthData = () => {
    const data = getEngagementData();
    const entries = data.journalEntries || [];
    
    if (entries.length === 0) {
      setGrowthData(null);
      return;
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Count by time period
    const thisWeek = entries.filter(e => new Date(e.date) >= oneWeekAgo).length;
    const lastWeek = entries.filter(e => {
      const date = new Date(e.date);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;
    const thisMonth = entries.filter(e => new Date(e.date) >= oneMonthAgo).length;

    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (thisWeek > lastWeek) trend = 'up';
    else if (thisWeek < lastWeek) trend = 'down';

    // Count by category
    const byCategory: { [key: string]: number } = {};
    entries.forEach(entry => {
      const cat = entry.category || 'General';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    // Estimate size based on text length and keywords
    const bySize = { micro: 0, small: 0, medium: 0, major: 0 };
    entries.forEach(entry => {
      const text = entry.accomplishment.toLowerCase();
      const length = entry.accomplishment.length;
      
      if (text.includes('launched') || text.includes('led team') || text.includes('promoted') || length > 200) {
        bySize.major++;
      } else if (text.includes('project') || text.includes('presented') || length > 100) {
        bySize.medium++;
      } else if (text.includes('completed') || text.includes('learned') || length > 50) {
        bySize.small++;
      } else {
        bySize.micro++;
      }
    });

    // Weekly data for last 4 weeks
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const count = entries.filter(e => {
        const date = new Date(e.date);
        return date >= weekStart && date < weekEnd;
      }).length;
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        count
      });
    }

    setGrowthData({
      totalCount: entries.length,
      thisWeek,
      thisMonth,
      byCategory,
      bySize,
      trend,
      weeklyData
    });
  };

  if (!growthData) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
            Start Tracking Your Growth!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add accomplishments to see your progress visualized here
          </p>
        </div>
      </div>
    );
  }

  const maxWeeklyCount = Math.max(...growthData.weeklyData.map(w => w.count), 1);
  const topCategories = Object.entries(growthData.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100">
              Your Growth Journey
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {growthData.totalCount} accomplishments tracked
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Total */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {growthData.totalCount}
          </div>
        </div>

        {/* This Week */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-800 dark:text-green-300">This Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {growthData.thisWeek}
            </div>
            {growthData.trend === 'up' && <span className="text-green-600">📈</span>}
            {growthData.trend === 'down' && <span className="text-orange-600">📉</span>}
            {growthData.trend === 'stable' && <span className="text-gray-600">➡️</span>}
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-300">This Month</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {growthData.thisMonth}
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Weekly Trend
        </h4>
        <div className="flex items-end justify-between gap-2 h-32">
          {growthData.weeklyData.map((week, index) => {
            const height = (week.count / maxWeeklyCount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg min-h-[4px] relative group"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {week.count} {week.count === 1 ? 'accomplishment' : 'accomplishments'}
                  </div>
                </motion.div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{week.week}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          {/* By Size */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              By Size
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
                <div className="text-2xl mb-1">🌱</div>
                <div className="text-lg font-bold text-green-900 dark:text-green-100">
                  {growthData.bySize.micro}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">Micro</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {growthData.bySize.small}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Small</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center border border-purple-200 dark:border-purple-800">
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {growthData.bySize.medium}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300">Medium</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center border border-orange-200 dark:border-orange-800">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                  {growthData.bySize.major}
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-300">Major</div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Top Categories
            </h4>
            <div className="space-y-2">
              {topCategories.map(([category, count], index) => {
                const percentage = (count / growthData.totalCount) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-purple-300 dark:border-purple-700">
            <p className="text-sm text-center text-purple-900 dark:text-purple-200 font-medium">
              {growthData.trend === 'up' && '🎉 You\'re on fire! Your momentum is building!'}
              {growthData.trend === 'stable' && '💪 Consistency is key! Keep documenting your wins!'}
              {growthData.trend === 'down' && '🌱 Every accomplishment counts! Add more this week!'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
