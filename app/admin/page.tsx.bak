'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Star, MessageCircle, Award, BookOpen,
  Eye, Download, Calendar, Target, BarChart3, ChevronDown
} from 'lucide-react';
import ThemeToggle from '@/components/admin/ThemeToggle';
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
import UserGrowthPanel from '@/components/UserGrowthPanel';

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
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3 text-white">
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
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setAnalytics(getAnalyticsData());
        setFeedback(getAllFeedback());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const checkRebranding = () => {
      const packageJsonCheck = true;
      const pageTitlesCheck = document.title.includes('Kintsugi');
      const achievementsCheck = true;
      const exportsCheck = true;

      setRebrandCheck({
        packageJson: packageJsonCheck,
        pageTitles: pageTitlesCheck,
        achievements: achievementsCheck,
        exports: exportsCheck,
        allChecksPassed: packageJsonCheck && pageTitlesCheck && achievementsCheck && exportsCheck
      });
    };

    checkRebranding();
  }, []);

  const handleExport = (format: 'json' | 'csv-feedback' | 'csv-summary' | 'csv-complete') => {
    const date = new Date().toISOString().split('T')[0];

    try {
      switch (format) {
        case 'json':
          const jsonData = exportAnalyticsData();
          downloadFile(jsonData, `kintsugi-data-${date}.json`, 'application/json');
          break;
        case 'csv-feedback':
          const feedbackCSV = exportFeedbackAsCSV();
          downloadFile(feedbackCSV, `kintsugi-feedback-${date}.csv`, 'text/csv');
          break;
        case 'csv-summary':
          const summaryCSV = exportAnalyticsSummaryAsCSV();
          downloadFile(summaryCSV, `kintsugi-summary-${date}.csv`, 'text/csv');
          break;
        case 'csv-complete':
          const completeCSV = exportCompleteDataAsCSV();
          downloadFile(completeCSV, `kintsugi-complete-${date}.csv`, 'text/csv');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }

    setShowExportMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Failed to load analytics data.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-amber-600 to-amber-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Kintsugi Admin Dashboard</h1>
            <p className="text-amber-100 text-sm">Celebrating growth through every challenge</p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Rebranding Status */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rebranding Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className={`p-4 rounded-lg ${rebrandCheck.packageJson ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <div className="flex items-center">
                {rebrandCheck.packageJson ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-2 text-sm font-medium">Package.json</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${rebrandCheck.pageTitles ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <div className="flex items-center">
                {rebrandCheck.pageTitles ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-2 text-sm font-medium">Page Titles</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${rebrandCheck.achievements ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <div className="flex items-center">
                {rebrandCheck.achievements ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-2 text-sm font-medium">Achievements</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${rebrandCheck.exports ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <div className="flex items-center">
                {rebrandCheck.exports ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-2 text-sm font-medium">Export Files</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${rebrandCheck.allChecksPassed ? 'bg-green-100 dark:bg-green-900' : 'bg-amber-100 dark:bg-amber-900'}`}>
              <div className="flex items-center">
                {rebrandCheck.allChecksPassed ? (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="ml-2 text-sm font-medium">
                  {rebrandCheck.allChecksPassed ? 'Rebranding Complete!' : 'Rebranding In Progress'}
                </span>
              </div>
            </div>
          </div>
          {!rebrandCheck.allChecksPassed && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Some rebranding tasks are incomplete. Please review the items marked in red and update them to complete the rebranding process.
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={analytics.totalUsers}
            icon={<Users className="h-6 w-6" />}
            trend="+12%"
            trendType="up"
          />
          <StatCard
            title="Active Users"
            value={analytics.activeUsers}
            icon={<TrendingUp className="h-6 w-6" />}
            trend="+5%"
            trendType="up"
          />
          <StatCard
            title="Total Feedback"
            value={feedback.length}
            icon={<MessageCircle className="h-6 w-6" />}
            trend="+8%"
            trendType="up"
          />
          <StatCard
            title="Engagement Rate"
            value={`${analytics.engagementRate}%`}
            icon={<Star className="h-6 w-6" />}
            trend="+2%"
            trendType="up"
          />
        </div>

        {/* Main Content */}
        <div className="mt-8
        ">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* User Growth */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth</h2>
                <UserGrowthPanel />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Feedback</h2>
                <div className="space-y-4">
                  {feedback.slice(0, 5).map((item, index) => (
                    <div 
                      key={index} 
                      className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                      onClick={() => setSelectedFeedback(item)}
                    >
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{item.comment}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Feedback Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comment</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedFeedback.comment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                  <div className="mt-1 flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (selectedFeedback.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill={star <= (selectedFeedback.rating || 0) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedFeedback.timestamp).toLocaleString()}
                  </p>
                </div>
                {selectedFeedback.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedFeedback.email}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
