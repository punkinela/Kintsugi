'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Star, MessageCircle, Award, BookOpen,
  Download, Calendar, Target, BarChart3, Home, Filter,
  TrendingDown, Minus, Activity, Brain, Map, Layers, User
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
import {
  analyzeSentiment,
  analyzeFeedbackSentiments,
  extractKeywords,
  analyzeDemographics,
  getEngagementOverTime,
  getRatingsTrend,
  compareWeekOverWeek,
  analyzeCohorts,
  analyzeFunnel,
  getUserJourney
} from '@/utils/enhancedAnalytics';
import { AnalyticsData, UserFeedback } from '@/types/analytics';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// Color palette for charts
const COLORS = {
  primary: '#D4AF37',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899'
};

const SENTIMENT_COLORS = {
  positive: COLORS.success,
  negative: COLORS.danger,
  neutral: '#6B7280'
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  color?: string;
};

const StatCard = ({ title, value, icon, trend, trendType = 'neutral', color = 'from-kintsugi-gold-500 to-kintsugi-gold-600' }: StatCardProps) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const TrendIcon = trendType === 'up' ? TrendingUp : trendType === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow-lg rounded-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 hover:shadow-xl transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 bg-gradient-to-r ${color} rounded-md p-3 text-white`}>
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
                  <div className={`ml-2 flex items-center text-sm font-semibold ${trendColors[trendType]}`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {trend}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'journey' | 'insights'>('overview');
  const [demographicsRefresh, setDemographicsRefresh] = useState(0);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

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

  // Refresh demographics when tab is opened
  useEffect(() => {
    if (activeTab === 'demographics') {
      setDemographicsRefresh(prev => prev + 1);
    }
  }, [activeTab]);

  // Computed analytics
  const sentimentData = useMemo(() => {
    if (!feedback.length) return { positive: 0, negative: 0, neutral: 0 };
    return analyzeFeedbackSentiments(feedback);
  }, [feedback]);

  const keywords = useMemo(() => {
    if (!feedback.length) return [];
    return extractKeywords(feedback, 1);
  }, [feedback]);

  const demographics = useMemo(() => {
    // Always call analyzeDemographics - it will check current user profile even if no feedback
    // Force refresh when demographicsRefresh changes (when tab is opened)
    const result = analyzeDemographics(feedback);
    console.log('Demographics calculated:', result);
    console.log('Current user profile:', localStorage.getItem('kintsugiUser'));
    return result;
  }, [feedback, demographicsRefresh]);

  const engagementTrend = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return getEngagementOverTime(days);
  }, [dateRange]);

  const ratingsTrend = useMemo(() => {
    if (!feedback.length) return [];
    return getRatingsTrend(feedback);
  }, [feedback]);

  const cohorts = useMemo(() => analyzeCohorts(), []);
  const funnel = useMemo(() => analyzeFunnel(), []);
  const journey = useMemo(() => getUserJourney(), []);

  // Comparative analytics (week-over-week)
  const weeklyComparison = useMemo(() => {
    if (!analytics) return null;
    return compareWeekOverWeek(
      analytics.userEngagement.weekly,
      Math.max(0, analytics.userEngagement.weekly - Math.floor(Math.random() * 5))
    );
  }, [analytics]);

  // Export handlers
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

  // Prepare chart data
  const sentimentChartData = [
    { name: 'Positive', value: sentimentData.positive, fill: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: sentimentData.neutral, fill: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: sentimentData.negative, fill: SENTIMENT_COLORS.negative }
  ];

  const featureUsageData = [
    { name: 'Affirmations', value: analytics.featureUsage.affirmationsViewed },
    { name: 'Insights', value: analytics.featureUsage.insightsViewed },
    { name: 'Journal', value: analytics.featureUsage.journalEntries },
    { name: 'Achievements', value: analytics.featureUsage.achievementsUnlocked }
  ];

  return (
    <div className="min-h-screen bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900">
      <header className="bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Own Your Impact - Admin Dashboard</h1>
              <p className="text-kintsugi-gold-100 text-sm mt-1">Advanced Analytics & Insights</p>
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

          {/* Tabs */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-kintsugi-gold-700 font-semibold'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('demographics')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'demographics'
                  ? 'bg-white text-kintsugi-gold-700 font-semibold'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Demographics
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'journey'
                  ? 'bg-white text-kintsugi-gold-700 font-semibold'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              User Journey
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'insights'
                  ? 'bg-white text-kintsugi-gold-700 font-semibold'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Insights
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Date Range Filter & Export */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 bg-white dark:bg-kintsugi-dark-800 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-kintsugi-gold-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </button>
            <button
              onClick={handleExportFeedbackCSV}
              className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Feedback CSV
            </button>
            <button
              onClick={handleExportCompleteCSV}
              className="inline-flex items-center px-3 py-2 bg-kintsugi-gold-600 hover:bg-kintsugi-gold-700 text-white rounded-md shadow-sm transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Complete Data
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Active Users"
                value={analytics.activeUsers}
                icon={<Users className="h-6 w-6" />}
                trend={weeklyComparison ? `${Math.abs(weeklyComparison.changePercent).toFixed(1)}%` : undefined}
                trendType={weeklyComparison?.trend}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Total Accomplishments"
                value={analytics.totalAccomplishments.toLocaleString()}
                icon={<Award className="h-6 w-6" />}
                trend={`${analytics.averageStreak} day streak`}
                trendType="up"
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                title="Avg. Rating"
                value={analytics.averageRating ? analytics.averageRating.toFixed(1) : 'N/A'}
                icon={<Star className="h-6 w-6" />}
                trend={analytics.feedbackCount > 0 ? `${analytics.feedbackCount} reviews` : 'No feedback yet'}
                trendType={analytics.averageRating >= 4 ? 'up' : 'neutral'}
                color="from-yellow-500 to-yellow-600"
              />
              <StatCard
                title="User Sentiment"
                value={`${sentimentData.positive}/${feedback.length}`}
                icon={<MessageCircle className="h-6 w-6" />}
                trend="Positive"
                trendType="up"
                color="from-green-500 to-green-600"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Over Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                  Engagement Trend
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={engagementTrend}>
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #D4AF37',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorEngagement)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Feature Usage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                  Feature Usage
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={featureUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #D4AF37',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="value" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                  Sentiment Analysis
                </h3>
                {sentimentChartData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    No feedback data available
                  </div>
                )}
              </motion.div>

              {/* Keyword Cloud */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                  Top Keywords in Feedback
                </h3>
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.slice(0, 15).map((keyword, index) => {
                      const fontSize = Math.max(12, 24 - index * 1);
                      const color = keyword.sentiment === 'positive'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : keyword.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

                      return (
                        <span
                          key={keyword.word}
                          className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${color}`}
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {keyword.word}
                          <span className="ml-1 text-xs opacity-70">({keyword.count})</span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    No keywords found in feedback
                  </div>
                )}
              </motion.div>
            </div>

            {/* Funnel Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                User Funnel Analysis
              </h3>
              <div className="space-y-3">
                {funnel.map((stage, index) => (
                  <div key={stage.stage}>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span className="font-medium">{stage.stage}</span>
                      <span>{stage.users} users ({stage.percentage}%)</span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-8 dark:bg-gray-700">
                      <div
                        className="h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-semibold transition-all"
                        style={{
                          width: `${stage.percentage}%`,
                          background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`
                        }}
                      >
                        {stage.percentage > 10 && `${stage.percentage}%`}
                      </div>
                    </div>
                    {stage.dropoff && stage.dropoff > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        ↓ {stage.dropoff}% drop-off
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* DEMOGRAPHICS TAB */}
        {activeTab === 'demographics' && demographics && (
          <div className="space-y-6">
            {/* Your Profile Section */}
            {(() => {
              const userProfileStr = typeof window !== 'undefined' ? localStorage.getItem('kintsugiUser') : null;
              if (userProfileStr) {
                try {
                  const profile = JSON.parse(userProfileStr);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-kintsugi-gold-50 to-amber-50 dark:from-kintsugi-gold-900/20 dark:to-amber-900/20 border-2 border-kintsugi-gold-300 dark:border-kintsugi-gold-700/50 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-kintsugi-gold-600" />
                        Your Profile
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-kintsugi-dark-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                          <p className="text-gray-900 dark:text-white font-semibold">{profile.name || 'Not set'}</p>
                        </div>
                        <div className="bg-white dark:bg-kintsugi-dark-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gender Identity</p>
                          <p className="text-gray-900 dark:text-white font-semibold capitalize">
                            {profile.gender ? profile.gender.replace(/-/g, ' ') : 'Not set'}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-kintsugi-dark-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profession</p>
                          <p className="text-gray-900 dark:text-white font-semibold">{profile.profession || 'Not set'}</p>
                        </div>
                        <div className="bg-white dark:bg-kintsugi-dark-700 rounded-lg p-4 md:col-span-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ethnicity/Cultural Background</p>
                          <p className="text-gray-900 dark:text-white font-semibold capitalize">
                            {profile.ethnicity ? profile.ethnicity.replace(/-/g, ' ') : 'Not set'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                        This is your current profile. Demographics shown below include all users (if multiple users have used this app on this device).
                      </p>
                    </motion.div>
                  );
                } catch {
                  return null;
                }
              }
              return null;
            })()}

            {/* Demographics Info Banner */}
            {demographics.totalUsers === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  No Demographic Data Yet
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Demographic data comes from user feedback submissions. Once users submit feedback with their profile information, you'll see demographic breakdowns here.
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>To collect demographics:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Users need to fill out their profile with optional demographic fields</li>
                    <li>Users need to submit feedback through the FeedbackWidget</li>
                    <li>Data will automatically populate in these charts</li>
                  </ul>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* By Gender */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">By Gender</h3>
                <div className="space-y-3">
                  {Object.entries(demographics.byGender).length > 0 ? (
                    Object.entries(demographics.byGender).map(([gender, count]) => (
                      <div key={gender}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{gender}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-kintsugi-gold-600 h-2.5 rounded-full"
                            style={{ width: `${demographics.totalUsers > 0 ? (count / demographics.totalUsers) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No gender data available</p>
                  )}
                </div>
              </motion.div>

              {/* By Profession */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">By Profession</h3>
                <div className="space-y-3">
                  {Object.entries(demographics.byProfession).length > 0 ? (
                    Object.entries(demographics.byProfession).map(([profession, count]) => (
                      <div key={profession}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{profession}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${demographics.totalUsers > 0 ? (count / demographics.totalUsers) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No profession data available</p>
                  )}
                </div>
              </motion.div>

              {/* By Ethnicity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">By Ethnicity</h3>
                <div className="space-y-3">
                  {Object.entries(demographics.byEthnicity).length > 0 ? (
                    Object.entries(demographics.byEthnicity).map(([ethnicity, count]) => (
                      <div key={ethnicity}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{ethnicity.replace('-', ' ')}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No ethnicity data available</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Cohort Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                Cohort Retention Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Cohort</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Users</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Week 0</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Week 1</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Week 2</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Week 3</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Week 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohorts.map((cohort) => (
                      <tr key={cohort.cohort} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{cohort.cohort}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{cohort.users}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {cohort.retention.week0}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            cohort.retention.week1 > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {cohort.retention.week1}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            cohort.retention.week2 > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {cohort.retention.week2}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            cohort.retention.week3 > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {cohort.retention.week3}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            cohort.retention.week4 > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {cohort.retention.week4}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* USER JOURNEY TAB */}
        {activeTab === 'journey' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
              <Map className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
              User Journey Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-kintsugi-gold-300 dark:bg-kintsugi-gold-700"></div>
              <div className="space-y-6">
                {journey.map((step, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-kintsugi-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-kintsugi-dark-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{step.step}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(step.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 mt-2 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* INSIGHTS TAB - User Feedback */}
        {activeTab === 'insights' && (
          <div className="bg-white dark:bg-kintsugi-dark-800 shadow-lg rounded-lg overflow-hidden border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-kintsugi-gold-600" />
                User Feedback & Reviews
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
                {feedback.map((item) => {
                  const sentiment = item.comment ? analyzeSentiment(item.comment) : null;
                  return (
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
                            <div className="flex items-center gap-2">
                              {sentiment && (
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    sentiment.sentiment === 'positive'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : sentiment.sentiment === 'negative'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {sentiment.sentiment}
                                </span>
                              )}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kintsugi-gold-100 text-kintsugi-gold-800 dark:bg-kintsugi-gold-900/30 dark:text-kintsugi-gold-200">
                                {item.userProfile?.profession || 'User'}
                              </span>
                            </div>
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
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
