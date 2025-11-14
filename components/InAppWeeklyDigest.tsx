'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Minus, Star, Zap, Award, Target, MessageSquare, Sparkles, ChevronRight, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';

interface InAppWeeklyDigestProps {
  weeklyData?: WeeklyData;
  onSetGoals?: () => void;
  onViewEntry?: (entryId: string) => void;
  onLogAchievement?: () => void;
}

interface WeeklyData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  stats: WeekStats;
  topAchievements: Achievement[];
  insights: Insight[];
  badges: Badge[];
  goals: Goal[];
  comparison: WeekComparison;
}

interface WeekStats {
  entriesAdded: number;
  xpGained: number;
  confidenceScore: number;
  streakDays: number;
  minutesInApp: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

interface Insight {
  type: 'celebration' | 'motivation' | 'tip' | 'milestone';
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: Date;
}

interface Goal {
  id: string;
  title: string;
  progress: number; // 0-100
  target: string;
  completed: boolean;
}

interface WeekComparison {
  previousWeekEntries: number;
  previousWeekXP: number;
  previousWeekConfidence: number;
}

// Mock data generator for demo purposes
function generateMockWeeklyData(): WeeklyData {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  return {
    weekNumber: Math.ceil((today.getDate()) / 7),
    startDate: weekStart,
    endDate: today,
    stats: {
      entriesAdded: 8,
      xpGained: 450,
      confidenceScore: 78,
      streakDays: 5,
      minutesInApp: 42
    },
    topAchievements: [
      {
        id: '1',
        title: 'Led successful project migration',
        description: 'Migrated legacy system to cloud infrastructure, reducing costs by 40%',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        impact: 'high',
        category: 'Leadership'
      },
      {
        id: '2',
        title: 'Mentored junior developer',
        description: 'Helped team member resolve critical bug and learn debugging techniques',
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        impact: 'medium',
        category: 'Collaboration'
      }
    ],
    insights: [],
    badges: [
      {
        id: 'streak-5',
        name: '5-Day Streak',
        description: 'Logged achievements 5 days in a row',
        icon: '🔥',
        rarity: 'rare',
        earnedDate: today
      }
    ],
    goals: [
      {
        id: 'entries',
        title: 'Log 10 achievements',
        progress: 80,
        target: '10 entries',
        completed: false
      },
      {
        id: 'confidence',
        title: 'Reach 80% confidence score',
        progress: 97,
        target: '80 points',
        completed: false
      }
    ],
    comparison: {
      previousWeekEntries: 5,
      previousWeekXP: 320,
      previousWeekConfidence: 72
    }
  };
}

export default function InAppWeeklyDigest({ weeklyData, onSetGoals, onViewEntry, onLogAchievement }: InAppWeeklyDigestProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('highlights');

  // Track feature usage
  useEffect(() => {
    const usageData = JSON.parse(localStorage.getItem('ai_feature_usage') || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!usageData.weeklyDigest) {
      usageData.weeklyDigest = { views: 0, lastUsed: null, dates: [] };
    }

    usageData.weeklyDigest.views += 1;
    usageData.weeklyDigest.lastUsed = today;

    if (!usageData.weeklyDigest.dates.includes(today)) {
      usageData.weeklyDigest.dates.push(today);
    }

    localStorage.setItem('ai_feature_usage', JSON.stringify(usageData));
  }, []);

  // Use provided data or generate mock data
  const data = weeklyData || generateMockWeeklyData();

  // Calculate trends
  const trends = useMemo(() => {
    const entriesTrend = calculateTrend(data.stats.entriesAdded, data.comparison.previousWeekEntries);
    const xpTrend = calculateTrend(data.stats.xpGained, data.comparison.previousWeekXP);
    const confidenceTrend = calculateTrend(data.stats.confidenceScore, data.comparison.previousWeekConfidence);

    return { entriesTrend, xpTrend, confidenceTrend };
  }, [data]);

  // Generate dynamic insights
  const insights: Insight[] = useMemo(() => {
    const generatedInsights: Insight[] = [];

    // Celebration insights
    if (data.stats.streakDays >= 5) {
      generatedInsights.push({
        type: 'celebration',
        icon: <Trophy className="h-5 w-5 text-yellow-500" />,
        title: 'Amazing Streak!',
        message: `You've logged achievements for ${data.stats.streakDays} days straight! Consistency is building your confidence.`
      });
    }

    if (data.badges.length > 0) {
      generatedInsights.push({
        type: 'milestone',
        icon: <Award className="h-5 w-5 theme-text-primary" />,
        title: 'New Badge Earned!',
        message: `You've unlocked the "${data.badges[0].name}" badge. Keep up the great work!`
      });
    }

    // Motivation insights
    if (trends.confidenceTrend.direction === 'up') {
      generatedInsights.push({
        type: 'celebration',
        icon: <TrendingUp className="h-5 w-5 text-green-500" />,
        title: 'Confidence Rising!',
        message: `Your confidence score increased by ${trends.confidenceTrend.percentage}% this week. You're writing with more assertiveness!`
      });
    }

    if (data.stats.entriesAdded > data.comparison.previousWeekEntries) {
      generatedInsights.push({
        type: 'motivation',
        icon: <Sparkles className="h-5 w-5 text-purple-500" />,
        title: 'More Active Than Last Week!',
        message: `You logged ${data.stats.entriesAdded - data.comparison.previousWeekEntries} more achievements this week. Your future self will thank you!`
      });
    }

    // Tip insights
    generatedInsights.push({
      type: 'tip',
      icon: <Target className="h-5 w-5 text-blue-500" />,
      title: 'Weekly Goal',
      message: 'Set a goal to log at least one achievement per day next week to maintain your momentum.',
      action: {
        label: 'Set Goals',
        onClick: () => onSetGoals?.()
      }
    });

    return generatedInsights;
  }, [data, trends, onSetGoals]);

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    if (direction === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (direction === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
    if (direction === 'up') return 'text-green-600 dark:text-green-400';
    if (direction === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getImpactColor = (impact: Achievement['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    }
  };

  const getRarityGradient = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'theme-gradient-to-r';
      case 'common': return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden theme-gradient-to-r p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8" />
            <div>
              <h2 className="text-3xl font-bold">Your Week in Review</h2>
              <p className="text-white/90 mt-1">
                {formatDateRange(data.startDate, data.endDate)} • Week {data.weekNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<MessageSquare className="h-6 w-6 theme-text-primary" />}
            label="Achievements Logged"
            value={data.stats.entriesAdded}
            trend={trends.entriesTrend}
          />
          <StatCard
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            label="XP Gained"
            value={data.stats.xpGained}
            trend={trends.xpTrend}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            label="Confidence Score"
            value={`${data.stats.confidenceScore}%`}
            trend={trends.confidenceTrend}
          />
          <StatCard
            icon={<Star className="h-6 w-6 text-purple-500" />}
            label="Day Streak"
            value={data.stats.streakDays}
            suffix="days"
          />
        </div>
      </div>

      {/* Insights Section */}
      <CollapsibleSection
        id="insights"
        title="This Week's Insights"
        icon={<Sparkles className="h-5 w-5 theme-text-primary" />}
        count={insights.length}
        expanded={expandedSection === 'insights'}
        onToggle={() => setExpandedSection(expandedSection === 'insights' ? null : 'insights')}
      >
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-lg p-4 border ${
                insight.type === 'celebration'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : insight.type === 'milestone'
                  ? 'theme-bg-primary-light theme-border-light'
                  : insight.type === 'motivation'
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
                  {insight.action && (
                    <button
                      onClick={insight.action.onClick}
                      className="mt-2 text-sm theme-text-primary hover:underline flex items-center gap-1"
                    >
                      {insight.action.label}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Top Achievements */}
      <CollapsibleSection
        id="highlights"
        title="Top Achievements"
        icon={<Trophy className="h-5 w-5 text-yellow-500" />}
        count={data.topAchievements.length}
        expanded={expandedSection === 'highlights'}
        onToggle={() => setExpandedSection(expandedSection === 'highlights' ? null : 'highlights')}
      >
        <div className="space-y-3">
          {data.topAchievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onViewEntry?.(achievement.id)}
              className="bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getImpactColor(achievement.impact)}`}>
                    {achievement.impact.toUpperCase()} IMPACT
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium theme-bg-primary-light theme-text-primary rounded">
                    {achievement.category}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeDate(achievement.date)}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Badges Earned */}
      {data.badges.length > 0 && (
        <CollapsibleSection
          id="badges"
          title="Badges Earned"
          icon={<Award className="h-5 w-5 text-purple-500" />}
          count={data.badges.length}
          expanded={expandedSection === 'badges'}
          onToggle={() => setExpandedSection(expandedSection === 'badges' ? null : 'badges')}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.badges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className={`w-20 h-20 mx-auto rounded-full ${getRarityGradient(badge.rarity)} flex items-center justify-center text-4xl mb-2 shadow-lg`}>
                  {badge.icon}
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white text-sm">{badge.name}</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 capitalize">{badge.rarity} Badge</p>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Goals Progress */}
      <CollapsibleSection
        id="goals"
        title="Goal Progress"
        icon={<Target className="h-5 w-5 text-blue-500" />}
        count={data.goals.length}
        expanded={expandedSection === 'goals'}
        onToggle={() => setExpandedSection(expandedSection === 'goals' ? null : 'goals')}
      >
        <div className="space-y-4">
          {data.goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {goal.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                  <h5 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h5>
                </div>
                <span className={`text-sm font-semibold ${goal.completed ? 'text-green-600' : 'theme-text-primary'}`}>
                  {goal.progress}%
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={goal.completed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'theme-gradient-to-r'}
                  style={{ height: '100%' }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: {goal.target}</p>
            </motion.div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Footer CTA */}
      <div className="p-6 theme-bg-primary-light text-center">
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Keep the Momentum Going!</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          You're making great progress. Log your next achievement to continue building confidence.
        </p>
        <button
          onClick={onLogAchievement}
          className="px-6 py-3 theme-btn-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Log New Achievement
        </button>
      </div>
    </div>
  );
}

// Helper Components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down' | 'stable'; percentage: number };
  suffix?: string;
}

function StatCard({ icon, label, value, trend, suffix }: StatCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}{suffix && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{suffix}</span>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.direction === 'stable' && '→'}
            {Math.abs(trend.percentage)}%
          </div>
        )}
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  count?: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, count, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-kintsugi-dark-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {count !== undefined && (
            <span className="px-2 py-0.5 text-xs font-semibold theme-bg-primary-light theme-text-primary rounded-full">
              {count}
            </span>
          )}
        </div>
        <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility Functions
function calculateTrend(current: number, previous: number): { direction: 'up' | 'down' | 'stable'; percentage: number } {
  if (previous === 0) {
    return { direction: current > 0 ? 'up' : 'stable', percentage: current > 0 ? 100 : 0 };
  }

  const percentageChange = Math.round(((current - previous) / previous) * 100);

  if (Math.abs(percentageChange) < 5) {
    return { direction: 'stable', percentage: Math.abs(percentageChange) };
  }

  return {
    direction: percentageChange > 0 ? 'up' : 'down',
    percentage: Math.abs(percentageChange)
  };
}

function formatDateRange(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
