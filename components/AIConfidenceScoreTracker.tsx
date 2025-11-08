'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, BarChart3, Calendar, Award, Target, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface AIConfidenceScoreTrackerProps {
  entries?: ImpactEntry[];
  compact?: boolean;
}

interface ImpactEntry {
  id: string;
  text: string;
  date: Date;
}

interface ConfidenceAnalysis {
  score: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  currentPeriodScore: number;
  previousPeriodScore: number;
  languagePatterns: {
    actionVerbs: number;
    quantifiers: number;
    minimizers: number;
    hedging: number;
    passiveVoice: number;
  };
  insights: Insight[];
  timeline: TimelinePoint[];
  comparison: {
    early: EntryAnalysis;
    recent: EntryAnalysis;
  };
}

interface Insight {
  type: 'strength' | 'improvement' | 'warning';
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface TimelinePoint {
  date: string;
  score: number;
  label: string;
}

interface EntryAnalysis {
  period: string;
  score: number;
  example: string;
  patterns: string[];
}

export default function AIConfidenceScoreTracker({ entries = [], compact = false }: AIConfidenceScoreTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [showDetails, setShowDetails] = useState(false);

  // Track feature usage
  useEffect(() => {
    const usageData = JSON.parse(localStorage.getItem('ai_feature_usage') || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!usageData.confidenceScoreTracker) {
      usageData.confidenceScoreTracker = { views: 0, lastUsed: null, dates: [] };
    }

    usageData.confidenceScoreTracker.views += 1;
    usageData.confidenceScoreTracker.lastUsed = today;

    if (!usageData.confidenceScoreTracker.dates.includes(today)) {
      usageData.confidenceScoreTracker.dates.push(today);
    }

    localStorage.setItem('ai_feature_usage', JSON.stringify(usageData));
  }, []);

  const analysis = useMemo(() => {
    if (entries.length === 0) return null;
    return analyzeConfidenceProgress(entries, selectedPeriod);
  }, [entries, selectedPeriod]);

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full theme-bg-primary-light mb-4">
          <BarChart3 className="h-8 w-8 theme-text-primary" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Start Tracking Your Confidence
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Add impact log entries to track how your confidence and communication style evolve over time.
        </p>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (analysis.trend === 'increasing') return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (analysis.trend === 'decreasing') return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (analysis.trend === 'increasing') return 'text-green-600 dark:text-green-400';
    if (analysis.trend === 'decreasing') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'theme-text-primary';
    if (score >= 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg theme-bg-primary-light border theme-border-light`}>
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getScoreColor(analysis.currentPeriodScore)}`}>
            Confidence: {analysis.currentPeriodScore}/100
          </span>
          {analysis.trend !== 'stable' && (
            <span className={`text-xs ${getTrendColor()}`}>
              {analysis.trend === 'increasing' ? '↑' : '↓'} {Math.abs(analysis.trendPercentage)}%
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 theme-gradient-to-r rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confidence Score Tracker</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your communication confidence over time</p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 bg-gray-100 dark:bg-kintsugi-dark-900 rounded-lg p-1">
            {(['week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'theme-bg-primary text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-800'
                }`}
              >
                {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Current Score */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Score</div>
            <div className={`text-4xl font-bold ${getScoreColor(analysis.currentPeriodScore)}`}>
              {analysis.currentPeriodScore}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">out of 100</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trend</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              {getTrendIcon()}
              <span className={`text-2xl font-bold ${getTrendColor()} capitalize`}>
                {analysis.trend}
              </span>
            </div>
            <div className={`text-sm font-semibold mt-1 ${getTrendColor()}`}>
              {analysis.trend === 'increasing' ? '+' : analysis.trend === 'decreasing' ? '-' : '±'}
              {Math.abs(analysis.trendPercentage)}%
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entries Analyzed</div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {entries.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">total</div>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 theme-text-primary" />
          Confidence Over Time
        </h4>
        <div className="relative h-32">
          {/* Simple line chart visualization */}
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {analysis.timeline.map((point, idx) => {
              const heightPercentage = point.score;
              const isHighest = point.score === Math.max(...analysis.timeline.map(p => p.score));
              const isLowest = point.score === Math.min(...analysis.timeline.map(p => p.score));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`w-full rounded-t-lg ${
                      isHighest
                        ? 'bg-gradient-to-t from-green-500 to-green-400'
                        : isLowest
                        ? 'bg-gradient-to-t from-red-500 to-red-400'
                        : 'theme-gradient-to-r'
                    } relative group cursor-pointer`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                        Score: {point.score}
                      </div>
                    </div>
                  </motion.div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    {point.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Patterns */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 theme-text-primary" />
          Language Pattern Analysis
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <PatternCard
            label="Action Verbs"
            value={analysis.languagePatterns.actionVerbs}
            type="strength"
            description="Strong, confident language"
          />
          <PatternCard
            label="Quantified Results"
            value={analysis.languagePatterns.quantifiers}
            type="strength"
            description="Data-driven achievements"
          />
          <PatternCard
            label="Minimizing Words"
            value={analysis.languagePatterns.minimizers}
            type="warning"
            description="Words that undermine confidence"
          />
          <PatternCard
            label="Hedging Language"
            value={analysis.languagePatterns.hedging}
            type="warning"
            description="Uncertain or tentative phrasing"
          />
        </div>
      </div>

      {/* Insights */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 theme-text-primary" />
          Key Insights
        </h4>
        <div className="space-y-3">
          {analysis.insights.map((insight, idx) => (
            <InsightCard key={idx} insight={insight} />
          ))}
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg hover:bg-gray-100 dark:hover:bg-kintsugi-dark-800 transition-colors mb-4"
        >
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 theme-text-primary" />
            <span className="font-semibold text-gray-900 dark:text-white">Your Growth Journey</span>
          </div>
          <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {/* Early Entries */}
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
                      <span className="text-xl">📝</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-900 dark:text-red-200">{analysis.comparison.early.period}</h5>
                      <p className="text-xs text-red-700 dark:text-red-400">Confidence Score: {analysis.comparison.early.score}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-kintsugi-dark-800 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{analysis.comparison.early.example}"</p>
                  </div>
                  <div className="space-y-1">
                    {analysis.comparison.early.patterns.map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-red-800 dark:text-red-300">
                        <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span>{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Entries */}
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                      <span className="text-xl">🌟</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-900 dark:text-green-200">{analysis.comparison.recent.period}</h5>
                      <p className="text-xs text-green-700 dark:text-green-400">Confidence Score: {analysis.comparison.recent.score}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-kintsugi-dark-800 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{analysis.comparison.recent.example}"</p>
                  </div>
                  <div className="space-y-1">
                    {analysis.comparison.recent.patterns.map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-green-800 dark:text-green-300">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span>{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Growth Summary */}
              <div className="theme-bg-primary-light rounded-lg p-4 border theme-border-light text-center">
                <p className="text-sm font-semibold theme-text-primary mb-1">
                  You've improved your confidence score by {analysis.comparison.recent.score - analysis.comparison.early.score} points!
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Keep documenting your achievements to continue this positive trend.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper Components
interface PatternCardProps {
  label: string;
  value: number;
  type: 'strength' | 'warning';
  description: string;
}

function PatternCard({ label, value, type, description }: PatternCardProps) {
  const isStrength = type === 'strength';

  return (
    <div className={`rounded-lg p-3 border ${
      isStrength
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold ${
          isStrength ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'
        }`}>
          {label}
        </span>
        <span className={`text-2xl font-bold ${
          isStrength ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
        }`}>
          {value}
        </span>
      </div>
      <p className={`text-xs ${
        isStrength ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'
      }`}>
        {description}
      </p>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const bgColor = {
    strength: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    improvement: 'theme-bg-primary-light theme-border-light',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  };

  return (
    <div className={`rounded-lg p-3 border ${bgColor[insight.type]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
        <div>
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
        </div>
      </div>
    </div>
  );
}

// Analysis Logic
function analyzeConfidenceProgress(entries: ImpactEntry[], period: 'week' | 'month' | 'all'): ConfidenceAnalysis {
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate scores for each entry
  const scoredEntries = sortedEntries.map(entry => ({
    ...entry,
    score: calculateConfidenceScore(entry.text)
  }));

  // Split into periods
  const midpoint = Math.floor(scoredEntries.length / 2);
  const earlyEntries = scoredEntries.slice(0, midpoint);
  const recentEntries = scoredEntries.slice(midpoint);

  const currentPeriodScore = Math.round(
    recentEntries.reduce((sum, e) => sum + e.score, 0) / recentEntries.length
  );
  const previousPeriodScore = Math.round(
    earlyEntries.reduce((sum, e) => sum + e.score, 0) / earlyEntries.length
  );

  const trendPercentage = Math.round(
    ((currentPeriodScore - previousPeriodScore) / previousPeriodScore) * 100
  );

  let trend: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(trendPercentage) < 5) trend = 'stable';
  else trend = trendPercentage > 0 ? 'increasing' : 'decreasing';

  // Analyze language patterns
  const allText = entries.map(e => e.text).join(' ');
  const languagePatterns = {
    actionVerbs: (allText.match(/\b(led|created|designed|implemented|launched|improved|increased|reduced|developed|built|achieved|delivered|managed|coordinated)\b/gi) || []).length,
    quantifiers: (allText.match(/\d+%|\d+/g) || []).length,
    minimizers: (allText.match(/\b(just|only|simply|maybe|perhaps|might|try|kind of|sort of|a little)\b/gi) || []).length,
    hedging: (allText.match(/\b(I think|I believe|possibly|probably|somewhat|fairly|rather)\b/gi) || []).length,
    passiveVoice: (allText.match(/\b(was|were) (done|completed|handled|managed|improved)\b/gi) || []).length
  };

  // Generate insights
  const insights: Insight[] = [];

  if (trend === 'increasing') {
    insights.push({
      type: 'strength',
      title: 'Confidence is Growing!',
      message: `Your confidence score has increased by ${Math.abs(trendPercentage)}% over time. You're using stronger, more assertive language.`,
      icon: <TrendingUp className="h-5 w-5 text-green-600" />
    });
  }

  if (languagePatterns.actionVerbs > 10) {
    insights.push({
      type: 'strength',
      title: 'Strong Action Language',
      message: `You're using ${languagePatterns.actionVerbs} action verbs, which demonstrates ownership of your accomplishments.`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />
    });
  }

  if (languagePatterns.minimizers > 5) {
    insights.push({
      type: 'warning',
      title: 'Watch for Minimizing Language',
      message: `Found ${languagePatterns.minimizers} instances of minimizing words. Try removing "just", "only", and "simply" to sound more confident.`,
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
    });
  }

  if (languagePatterns.quantifiers > 8) {
    insights.push({
      type: 'strength',
      title: 'Great Use of Metrics',
      message: `You're backing up your achievements with ${languagePatterns.quantifiers} quantified results - this adds credibility!`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />
    });
  } else {
    insights.push({
      type: 'improvement',
      title: 'Add More Quantifiable Results',
      message: 'Including specific numbers and percentages makes your impact more concrete and impressive.',
      icon: <Target className="h-5 w-5 theme-text-primary" />
    });
  }

  // Create timeline
  const timeline: TimelinePoint[] = scoredEntries
    .slice(-6)
    .map((entry, idx) => ({
      date: entry.date.toISOString(),
      score: entry.score,
      label: `Entry ${scoredEntries.length - 5 + idx}`
    }));

  // Create comparison
  const comparison = {
    early: {
      period: 'Early Entries',
      score: previousPeriodScore,
      example: earlyEntries[0]?.text.slice(0, 120) + '...' || '',
      patterns: analyzePatterns(earlyEntries.map(e => e.text).join(' '))
    },
    recent: {
      period: 'Recent Entries',
      score: currentPeriodScore,
      example: recentEntries[recentEntries.length - 1]?.text.slice(0, 120) + '...' || '',
      patterns: analyzePatterns(recentEntries.map(e => e.text).join(' '))
    }
  };

  return {
    score: currentPeriodScore,
    trend,
    trendPercentage,
    currentPeriodScore,
    previousPeriodScore,
    languagePatterns,
    insights,
    timeline,
    comparison
  };
}

function calculateConfidenceScore(text: string): number {
  let score = 50;

  // Positive indicators
  if (/\b(led|created|designed|implemented|launched|improved|increased|reduced|developed|built|achieved|delivered|managed|coordinated)\b/i.test(text)) {
    score += 15;
  }
  if (/\d+%|\d+/.test(text)) score += 10;
  if (text.length > 100) score += 5;
  if (/\b(result|outcome|impact|success|achievement)\b/i.test(text)) score += 10;

  // Negative indicators
  const minimizers = (text.match(/\b(just|only|simply|maybe|perhaps|might|try|kind of|sort of|a little)\b/gi) || []).length;
  score -= minimizers * 5;

  const hedging = (text.match(/\b(I think|I believe|possibly|probably|somewhat|fairly|rather)\b/gi) || []).length;
  score -= hedging * 3;

  return Math.max(0, Math.min(100, score));
}

function analyzePatterns(text: string): string[] {
  const patterns: string[] = [];

  const minimizers = (text.match(/\b(just|only|simply|maybe|perhaps)\b/gi) || []).length;
  if (minimizers > 3) patterns.push(`Used ${minimizers} minimizing words that undercut confidence`);

  const actionVerbs = (text.match(/\b(led|created|designed|implemented|launched|improved)\b/gi) || []).length;
  if (actionVerbs > 0) patterns.push(`Used ${actionVerbs} strong action verbs showing ownership`);

  const hasMetrics = /\d+%|\d+/.test(text);
  if (hasMetrics) patterns.push('Included quantifiable results and metrics');
  else patterns.push('Missing specific numbers or percentages');

  return patterns;
}
