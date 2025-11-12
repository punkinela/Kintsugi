'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Star, MessageCircle, Award, BookOpen,
  Download, Calendar, Target, BarChart3, Home, Filter,
  TrendingDown, Minus, Activity, Brain, Map, Layers, User,
  HelpCircle, Settings, Sparkles, Zap, Trophy, Shield, Heart
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeSelector from '@/components/ThemeSelector';
import PotteryStyleChanger from '@/components/PotteryStyleChanger';
import DashboardCard from '@/components/DashboardCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import KintsugiJournalInsights from '@/components/KintsugiJournalInsights';
import StreakCalendar from '@/components/StreakCalendar';
import JournalProgressDashboard from '@/components/JournalProgressDashboard';
import MilestoneTracker from '@/components/MilestoneTracker';
import KintsugiUserJourney from '@/components/KintsugiUserJourney';
import KintsugiInsightsDashboard from '@/components/KintsugiInsightsDashboard';
// Phase 13: Kintsugi Philosophy Features
import TransformationHeatmap from '@/components/TransformationHeatmap';
import StrengthArchaeology from '@/components/StrengthArchaeology';
import JourneyRichnessScore from '@/components/JourneyRichnessScore';
import InteractiveKintsugiVessel from '@/components/InteractiveKintsugiVessel';
import GoldenSeamTimeline from '@/components/GoldenSeamTimeline';
import KintsugiPortfolioGenerator from '@/components/KintsugiPortfolioGenerator';
// New AI-Powered Features
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import AIPerformanceReviewGenerator from '@/components/AIPerformanceReviewGenerator';
import ExportManager from '@/components/ExportManager';
import InAppWeeklyDigest from '@/components/InAppWeeklyDigest';
import AutoProfileBuilder from '@/components/AutoProfileBuilder';
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
import { JournalEntry } from '@/types/engagement';
import { getEngagementData } from '@/utils/engagement';
import { initializeTheme } from '@/utils/themes';
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

const StatCard = ({ title, value, icon, trend, trendType = 'neutral', color = 'theme-gradient-to-r' }: StatCardProps) => {
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
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow-lg rounded-xl border theme-border-light dark:theme-border-primary/50 hover:shadow-2xl hover:theme-border-accent dark:hover:border-kintsugi-gold-700 transition-all cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className={`flex-shrink-0 bg-gradient-to-r ${color} rounded-xl p-3 text-white shadow-lg group-hover:shadow-xl transition-shadow`}
          >
            {icon}
          </motion.div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </div>
                {trend && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`ml-2 flex items-center text-sm font-semibold ${trendColors[trendType]}`}
                  >
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {trend}
                  </motion.div>
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
  const [activeTab, setActiveTab] = useState<'overview' | 'journal' | 'demographics' | 'journey' | 'insights' | 'settings'>('overview');
  const [demographicsRefresh, setDemographicsRefresh] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const analyticsData = getAnalyticsData();
        const feedbackData = getAllFeedback();

        // Load impact entries from engagement data
        const engagementData = getEngagementData();
        setJournalEntries(engagementData.journalEntries || []);
        setCurrentStreak(engagementData.currentStreak || 0);

        // Load user profile
        const storedUser = localStorage.getItem('userProfile');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Load user questions from FAQ
        const questions = JSON.parse(localStorage.getItem('kintsugi_user_questions') || '[]');
        setUserQuestions(questions);

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

  // Initialize theme system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTheme();
    }
  }, []);

  // Listen for theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleThemeChange = () => {
      // Force re-render when theme changes
      setDemographicsRefresh(prev => prev + 1);
    };

    window.addEventListener('theme-changed', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
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
      <div className="min-h-screen theme-bg-primary-light dark:bg-kintsugi-dark-900">
        {/* Header Skeleton */}
        <div className="theme-gradient-to-r shadow-xl">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-white/30 rounded w-64 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-48"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <LoadingSkeleton variant="stat" count={4} className="mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton variant="chart" />
            <LoadingSkeleton variant="chart" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-bg-primary-light dark:bg-kintsugi-dark-900">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 theme-bg-primary text-white rounded-md hover:bg-kintsugi-gold-700 focus:outline-none focus:ring-2 focus:ring-kintsugi-gold-500 focus:ring-offset-2"
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
    { name: 'Impact Log', value: analytics.featureUsage.journalEntries },
    { name: 'Achievements', value: analytics.featureUsage.achievementsUnlocked }
  ];

  // AI Feature Adoption Data
  const aiFeatureUsage = JSON.parse(localStorage.getItem('ai_feature_usage') || '{}');
  const aiFeatureAdoptionData = [
    {
      name: 'Profile Builder',
      value: aiFeatureUsage.autoProfileBuilder?.views || 0,
      uniqueDays: aiFeatureUsage.autoProfileBuilder?.dates?.length || 0,
      lastUsed: aiFeatureUsage.autoProfileBuilder?.lastUsed || 'Never'
    },
    {
      name: 'Weekly Digest',
      value: aiFeatureUsage.weeklyDigest?.views || 0,
      uniqueDays: aiFeatureUsage.weeklyDigest?.dates?.length || 0,
      lastUsed: aiFeatureUsage.weeklyDigest?.lastUsed || 'Never'
    },
    {
      name: 'Career Gap',
      value: aiFeatureUsage.careerGapAnalyzer?.views || 0,
      uniqueDays: aiFeatureUsage.careerGapAnalyzer?.dates?.length || 0,
      lastUsed: aiFeatureUsage.careerGapAnalyzer?.lastUsed || 'Never'
    },
    {
      name: 'Confidence',
      value: aiFeatureUsage.confidenceScoreTracker?.views || 0,
      uniqueDays: aiFeatureUsage.confidenceScoreTracker?.dates?.length || 0,
      lastUsed: aiFeatureUsage.confidenceScoreTracker?.lastUsed || 'Never'
    },
    {
      name: 'Smart Search',
      value: aiFeatureUsage.smartTaggingSearch?.views || 0,
      uniqueDays: aiFeatureUsage.smartTaggingSearch?.dates?.length || 0,
      lastUsed: aiFeatureUsage.smartTaggingSearch?.lastUsed || 'Never'
    },
    {
      name: 'Interview Prep',
      value: aiFeatureUsage.interviewPrepGenerator?.views || 0,
      uniqueDays: aiFeatureUsage.interviewPrepGenerator?.dates?.length || 0,
      lastUsed: aiFeatureUsage.interviewPrepGenerator?.lastUsed || 'Never'
    }
  ];

  const totalAIFeatureViews = aiFeatureAdoptionData.reduce((sum, feature) => sum + feature.value, 0);

  // Gamification Metrics
  const gamificationData = JSON.parse(localStorage.getItem('gamificationData') || '{}');
  const gamificationStats = gamificationData.stats || {};
  const hasGamificationData = gamificationData.xp !== undefined;

  return (
    <div className="min-h-screen theme-bg-primary-light dark:bg-kintsugi-dark-900">
      <header className="theme-gradient-to-r shadow-2xl relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-start mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Personal Insights</h1>
                  <p className="text-white/90 text-base mt-1">Your Transformation Journey, Visualized</p>
                </div>
              </div>
            </motion.div>
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to App
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'overview', label: 'Golden Gallery', icon: Sparkles },
              { id: 'journal', label: 'Your Golden Seams', icon: BookOpen },
              { id: 'demographics', label: 'Your Profile', icon: User },
              { id: 'journey', label: 'Transformation Path', icon: Map },
              { id: 'insights', label: 'Patterns of Repair', icon: Brain },
              { id: 'settings', label: 'Workshop Tools', icon: Settings }
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                  activeTab === tab.id
                    ? 'bg-white text-kintsugi-gold-700 shadow-lg scale-105'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            ))}
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
              className="px-4 py-2 bg-white dark:bg-kintsugi-dark-800 border theme-border-light dark:theme-border-primary/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-kintsugi-gold-500"
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
              className="inline-flex items-center px-3 py-2 theme-bg-primary hover:bg-kintsugi-gold-700 text-white rounded-md shadow-sm transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Complete Data
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3"
        >
          <div className="flex-shrink-0 bg-blue-500 rounded-lg p-2">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              🔒 Your Data, Your Eyes Only
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              All insights shown here are from <strong>YOUR browser's local storage</strong>.
              No data is sent to servers. No one else can see this—not even us.
              This is your personal reflection mirror. 🪞
            </p>
          </div>
        </motion.div>

        {/* OVERVIEW TAB → GOLDEN GALLERY */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Opening Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Your Golden Gallery 🏺
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Welcome to your personal transformation archive. Every number here represents
                a moment you chose to honor your cracks and fill them with gold.
              </p>
            </motion.div>

            {/* Stats Cards - Kintsugi Language */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Your Journey"
                value={analytics.activeUsers === 1 ? "Active" : analytics.activeUsers}
                icon={<Sparkles className="h-6 w-6" />}
                trend={weeklyComparison ? `${Math.abs(weeklyComparison.changePercent).toFixed(1)}% this week` : undefined}
                trendType={weeklyComparison?.trend}
                color="from-amber-500 to-orange-500"
              />
              <StatCard
                title="Golden Moments"
                value={analytics.totalAccomplishments.toLocaleString()}
                icon={<Award className="h-6 w-6" />}
                trend={`${analytics.averageStreak} day healing streak`}
                trendType="up"
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                title="Healing Resonance"
                value={analytics.averageRating ? `${analytics.averageRating.toFixed(1)} ❤️` : 'N/A'}
                icon={<Heart className="h-6 w-6" />}
                trend={analytics.feedbackCount > 0 ? `${analytics.feedbackCount} reflections` : 'No feedback yet'}
                trendType={analytics.averageRating >= 4 ? 'up' : 'neutral'}
                color="from-pink-500 to-rose-500"
              />
              <StatCard
                title="Transformation Energy"
                value={`${sentimentData.positive}/${feedback.length || 1}`}
                icon={<Sparkles className="h-6 w-6" />}
                trend="Glowing with hope"
                trendType="up"
                color="from-green-500 to-teal-500"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Over Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 theme-text-primary" />
                  The Golden Wave
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Watch how healing spreads through time ✨
                </p>
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
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 theme-text-primary" />
                  Tools for Repair
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Which golden practices resonate most? 🛠️
                </p>
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
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 theme-text-primary" />
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
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 theme-text-primary" />
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

            {/* AI Feature Adoption (Phase 14) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 theme-text-primary" />
                  AI Feature Adoption (Phase 14)
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Views: <span className="font-bold theme-text-primary">{totalAIFeatureViews}</span>
                </div>
              </div>
              {totalAIFeatureViews > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={aiFeatureAdoptionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis
                        dataKey="name"
                        stroke="#6B7280"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #D4AF37',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-gray-800 p-3 rounded-lg border border-kintsugi-gold-600">
                                <p className="font-bold text-white">{data.name}</p>
                                <p className="text-sm text-gray-300">Views: {data.value}</p>
                                <p className="text-sm text-gray-300">Unique Days: {data.uniqueDays}</p>
                                <p className="text-sm text-gray-400">Last Used: {data.lastUsed}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS.purple} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {aiFeatureAdoptionData.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-kintsugi-dark-700 p-3 rounded-lg border theme-border-light"
                      >
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{feature.name}</div>
                        <div className="text-lg font-bold theme-text-primary">{feature.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {feature.uniqueDays} days • {feature.lastUsed !== 'Never' ? new Date(feature.lastUsed).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">No AI feature usage data yet.<br/>Start using the new AI features to see adoption metrics!</p>
                </div>
              )}
            </motion.div>

            {/* Gamification Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.475 }}
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 theme-text-primary" />
                  Gamification & Engagement
                </h3>
                {hasGamificationData && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Level: <span className="font-bold theme-text-primary">{gamificationData.level || 1}</span>
                  </div>
                )}
              </div>
              {hasGamificationData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">XP</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {gamificationData.totalXpEarned?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Current: {gamificationData.xp || 0} / {gamificationData.xpToNextLevel || 100}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Level</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {gamificationData.level || 1}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Points: {gamificationData.points?.toLocaleString() || 0}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {gamificationStats.currentStreak || 0}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Longest: {gamificationStats.longestStreak || 0} days
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between mb-2">
                      <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Achievements</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                      {gamificationStats.achievementsUnlocked || 0}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Challenges: {gamificationStats.challengesCompleted || 0}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-kintsugi-dark-700 p-3 rounded-lg border theme-border-light">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Accomplishments</div>
                    <div className="text-lg font-bold theme-text-primary">{gamificationStats.totalAccomplishments || 0}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-kintsugi-dark-700 p-3 rounded-lg border theme-border-light">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Journal Entries</div>
                    <div className="text-lg font-bold theme-text-primary">{gamificationStats.totalJournalEntries || 0}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-kintsugi-dark-700 p-3 rounded-lg border theme-border-light">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Visits</div>
                    <div className="text-lg font-bold theme-text-primary">{gamificationStats.totalVisits || 0}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-kintsugi-dark-700 p-3 rounded-lg border theme-border-light">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Days Active</div>
                    <div className="text-lg font-bold theme-text-primary">{gamificationStats.daysActive || 0}</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                  <Trophy className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">No gamification data available.<br/>Start engaging with the app to earn XP and unlock achievements!</p>
                </div>
              )}
            </motion.div>

            {/* Funnel Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 theme-text-primary" />
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

            {/* User Questions from FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 theme-text-primary" />
                User Questions ({userQuestions.length})
              </h3>
              {userQuestions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userQuestions.slice().reverse().map((q) => (
                    <div
                      key={q.id}
                      className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                        {q.question}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {new Date(q.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                        {q.email && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {q.email}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                  <HelpCircle className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">No user questions yet</p>
                  <p className="text-xs mt-1">Questions submitted via FAQ will appear here</p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* IMPACT LOG TAB */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            {/* Kintsugi Philosophy & Insights */}
            <KintsugiJournalInsights entries={journalEntries} />

            {/* Phase 13: Journey Richness Score - User Story Quality */}
            <JourneyRichnessScore entries={journalEntries} />

            {/* Phase 13: Transformation Heatmap - Golden Repair Days */}
            <TransformationHeatmap entries={journalEntries} monthsToShow={6} />

            {/* Phase 13: Golden Seam Timeline - Challenge-to-Growth Connections */}
            <GoldenSeamTimeline entries={journalEntries} />

            {/* Streak Calendar & Progress in Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StreakCalendar entries={journalEntries} />
              <JournalProgressDashboard entries={journalEntries} />
            </div>

            {/* Milestone Tracker */}
            <MilestoneTracker
              entryCount={journalEntries.length}
              currentStreak={currentStreak}
            />
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
                      className="bg-gradient-to-r theme-bg-primary-light  border-2 theme-border-accent dark:theme-border-primary/50 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 theme-text-primary" />
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
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
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
                            className="theme-bg-primary h-2.5 rounded-full"
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
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
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
                className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
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
              className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 theme-text-primary" />
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

        {/* USER JOURNEY TAB - Kintsugi Philosophy */}
        {activeTab === 'journey' && (
          <KintsugiUserJourney entries={journalEntries} user={user} />
        )}

        {/* INSIGHTS TAB - Kintsugi Community Analytics */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Weekly Digest Summary */}
            <InAppWeeklyDigest />

            {/* Community Insights Dashboard */}
            <KintsugiInsightsDashboard feedback={feedback} />

            {/* AI Pattern Analysis */}
            <AIInsightsDashboard />

            {/* User Profile Auto-Builder */}
            {user && journalEntries.length > 0 && (
              <AutoProfileBuilder
                entries={journalEntries.map(entry => ({
                  id: entry.id,
                  text: `${entry.accomplishment} ${entry.reflection || ''}`,
                  date: new Date(entry.date)
                }))}
                currentProfile={user}
                onUpdateProfile={(updates) => {
                  // Admin view only - updates not applied
                  console.log('Profile updates (admin view):', updates);
                }}
              />
            )}

            {/* Phase 13: Strength Archaeology - AI Strength Discovery */}
            <StrengthArchaeology entries={journalEntries} />

            {/* Phase 13: Interactive Kintsugi Vessel - 3D Visualization */}
            <InteractiveKintsugiVessel entries={journalEntries} />

            {/* Professional Export Tools */}
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Professional Export Tools
              </h3>

              {/* AI Performance Review Generator */}
              <div className="mb-6">
                <AIPerformanceReviewGenerator />
              </div>

              {/* Kintsugi Portfolio Generator */}
              <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <KintsugiPortfolioGenerator
                  entries={journalEntries}
                  userName={user?.name || 'User'}
                  userProfession={user?.profession || 'Professional'}
                />
              </div>

              {/* Export Manager */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <ExportManager />
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB - Theme & Appearance */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Pottery Style Changer */}
            <PotteryStyleChanger />

            {/* Theme Settings */}
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Appearance Settings
              </h2>
              <ThemeSelector />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
