'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Star, MessageCircle, Award, BookOpen,
  Eye, Download, Calendar, Target, BarChart3, ChevronDown, Home
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  getAnalyticsData,
  getAllFeedback,
  exportAnalyticsData,
  exportFeedbackAsCSV,
  exportAnalyticsSummaryAsCSV,
  exportCompleteDataAsCSV,
  downloadFile
} from '@/utils/analytics';
import { AnalyticsData, UserFeedback } from '@/types/analytics';
import Link from 'next/link';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
};

const StatCard = ({ title, value, icon, trend, trendType = 'neutral' }: StatCardProps) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow rounded-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gradient-to-r from-kintsugi-gold-500 to-kintsugi-gold-600 rounded-md p-3 text-white">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColors[trendType]}`}>
                    {trend}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Small delay for smooth loading
        await new Promise(resolve => setTimeout(resolve, 500));

        // Load real data from localStorage
        const analyticsData = getAnalyticsData();
        const feedbackData = getAllFeedback();

        setAnalytics(analyticsData);
        setFeedback(feedbackData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleExportJSON = () => {
    const data = exportAnalyticsData();
    downloadFile(data, `own-your-impact-data-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleExportFeedbackCSV = () => {
    const csv = exportFeedbackAsCSV();
    downloadFile(csv, `own-your-impact-feedback-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleExportSummaryCSV = () => {
    const csv = exportAnalyticsSummaryAsCSV();
    downloadFile(csv, `own-your-impact-summary-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleExportCompleteCSV = () => {
    const csv = exportCompleteDataAsCSV();
    downloadFile(csv, `own-your-impact-complete-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kintsugi-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-kintsugi-gold-600 text-white rounded-md hover:bg-kintsugi-gold-700 focus:outline-none focus:ring-2 focus:ring-kintsugi-gold-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900">
      <header className="bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Own Your Impact - Admin Dashboard</h1>
            <p className="text-kintsugi-gold-100 text-sm mt-1">Track wins • Recognize bias • Advocate for yourself</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to App
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Export Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </button>
          <button
            onClick={handleExportFeedbackCSV}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Feedback CSV
          </button>
          <button
            onClick={handleExportSummaryCSV}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Summary CSV
          </button>
          <button
            onClick={handleExportCompleteCSV}
            className="inline-flex items-center px-4 py-2 bg-kintsugi-gold-600 hover:bg-kintsugi-gold-700 text-white rounded-md shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Complete Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Users"
            value={analytics.activeUsers}
            icon={<Users className="h-6 w-6" />}
            trend={analytics?.userEngagement ? `${analytics.userEngagement.daily} visits` : '0'}
            trendType="up"
          />
          <StatCard
            title="Total Accomplishments"
            value={analytics?.totalAccomplishments.toLocaleString() || '0'}
            icon={<Award className="h-6 w-6" />}
            trend={`${analytics?.averageStreak} day streak`}
            trendType="up"
          />
          <StatCard
            title="Avg. Rating"
            value={analytics?.averageRating ? analytics.averageRating.toFixed(1) : 'N/A'}
            icon={<Star className="h-6 w-6" />}
            trend={analytics?.feedbackCount > 0 ? `${analytics.feedbackCount} reviews` : 'No feedback yet'}
            trendType={analytics?.averageRating >= 4 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Total Feedback"
            value={analytics?.feedbackCount.toLocaleString() || '0'}
            icon={<MessageCircle className="h-6 w-6" />}
            trend="User insights"
            trendType="neutral"
          />
        </div>

        {/* User Engagement, Feature Usage, and Retention */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* User Engagement */}
          <div className="bg-white dark:bg-kintsugi-dark-800 shadow rounded-lg p-6 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
              User Engagement
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Daily Active</span>
                  <span>{analytics?.userEngagement.daily}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(analytics?.userEngagement.daily * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Weekly Active</span>
                  <span>{analytics?.userEngagement.weekly}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(analytics?.userEngagement.weekly * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Monthly Active</span>
                  <span>{analytics?.userEngagement.monthly}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(analytics?.userEngagement.monthly * 3, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="bg-white dark:bg-kintsugi-dark-800 shadow rounded-lg p-6 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
              Feature Usage
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Affirmations</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analytics?.featureUsage.affirmationsViewed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Insights</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analytics?.featureUsage.insightsViewed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Journal Entries</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analytics?.featureUsage.journalEntries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Achievements</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{analytics?.featureUsage.achievementsUnlocked}</span>
              </div>
            </div>
          </div>

          {/* User Retention */}
          <div className="bg-white dark:bg-kintsugi-dark-800 shadow rounded-lg p-6 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
              User Retention
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Day 1</span>
                  <span>{analytics?.userRetention.day1}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${analytics?.userRetention.day1}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Day 7</span>
                  <span>{analytics?.userRetention.day7}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${analytics?.userRetention.day7}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Day 30</span>
                  <span>{analytics?.userRetention.day30}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full"
                    style={{ width: `${analytics?.userRetention.day30}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="mt-8">
          <div className="bg-white dark:bg-kintsugi-dark-800 shadow rounded-lg overflow-hidden border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                User Feedback
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {feedback.length} {feedback.length === 1 ? 'response' : 'responses'}
              </span>
            </div>
            {feedback.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No feedback yet</h3>
                <p className="text-gray-600 dark:text-gray-400">User feedback will appear here once submitted</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {feedback.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill={i < item.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.userProfile?.name || 'Anonymous User'}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kintsugi-gold-100 text-kintsugi-gold-800 dark:bg-kintsugi-gold-900/30 dark:text-kintsugi-gold-200">
                            {item.userProfile?.profession || 'User'}
                          </span>
                        </div>
                        {item.comment && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.comment}</p>
                        )}
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>Experience: </span>
                          <span className="ml-1 font-medium capitalize">{item.experience}</span>
                          <span className="mx-2">•</span>
                          <span>Visits: {item.sessionData.visitCount}</span>
                          <span className="mx-2">•</span>
                          <span>Streak: {item.sessionData.currentStreak} days</span>
                          <span className="mx-2">•</span>
                          <span>Accomplishments: {item.sessionData.accomplishmentsLogged}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
