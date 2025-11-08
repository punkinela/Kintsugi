'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, CheckCircle, AlertCircle } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface RichnessMetrics {
  score: number; // 0-100
  wins: number;
  challenges: number;
  growth: number;
  diversity: number; // Variety of experiences
  depth: number; // Reflection quality
  feedback: string;
  level: 'Emerging' | 'Developing' | 'Rich' | 'Masterful';
}

interface JourneyRichnessScoreProps {
  entries: JournalEntry[];
}

export default function JourneyRichnessScore({ entries }: JourneyRichnessScoreProps) {
  const metrics = useMemo((): RichnessMetrics => {
    if (entries.length === 0) {
      return {
        score: 0,
        wins: 0,
        challenges: 0,
        growth: 0,
        diversity: 0,
        depth: 0,
        feedback: 'Start documenting your journey',
        level: 'Emerging'
      };
    }

    // Classify entries
    const challengeWords = ['difficult', 'struggle', 'challenge', 'hard', 'failed', 'problem'];
    const winWords = ['success', 'accomplished', 'achieved', 'completed', 'won'];
    const growthWords = ['learned', 'grew', 'realized', 'understood', 'discovered'];

    let wins = 0;
    let challenges = 0;
    let growth = 0;

    entries.forEach(entry => {
      const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();

      if (winWords.some(w => text.includes(w))) wins++;
      if (challengeWords.some(w => text.includes(w))) challenges++;
      if (growthWords.some(w => text.includes(w)) || entry.reflection) growth++;
    });

    // Calculate diversity (variety of categories/tags)
    const uniqueCategories = new Set(entries.map(e => e.category).filter(Boolean));
    const uniqueTags = new Set(entries.flatMap(e => e.tags || []));
    const diversity = (uniqueCategories.size * 10) + (uniqueTags.size * 2);

    // Calculate depth (quality of reflections)
    const withReflection = entries.filter(e => e.reflection && e.reflection.length > 50).length;
    const depth = (withReflection / entries.length) * 100;

    // Calculate balance score
    const hasWins = wins > 0;
    const hasChallenges = challenges > 0;
    const hasGrowth = growth > 0;

    let balanceScore = 0;
    if (hasWins && hasChallenges) balanceScore = 40; // Both wins and challenges
    else if (hasWins || hasChallenges) balanceScore = 20; // Only one type

    if (hasGrowth) balanceScore += 30; // Bonus for reflection/growth
    if (diversity > 20) balanceScore += 15; // Bonus for variety
    if (depth > 50) balanceScore += 15; // Bonus for deep reflection

    const score = Math.min(100, balanceScore);

    // Determine level and feedback
    let level: RichnessMetrics['level'] = 'Emerging';
    let feedback = '';

    if (score >= 80) {
      level = 'Masterful';
      feedback = 'Your journey has incredible depth and texture! You document wins, challenges, and growth with nuance.';
    } else if (score >= 60) {
      level = 'Rich';
      feedback = 'Your story is developing beautiful complexity. Keep documenting both triumphs and trials.';
    } else if (score >= 40) {
      level = 'Developing';
      feedback = 'Your journey is gaining texture. Try documenting more variety—both successes and struggles.';
    } else {
      level = 'Emerging';
      if (!hasChallenges) {
        feedback = 'Your journey looks great! Consider also documenting challenges to show your complete story.';
      } else if (!hasWins) {
        feedback = 'You\'re documenting struggles well. Balance this by celebrating wins too!';
      } else {
        feedback = 'Keep building your story. More entries will add richness to your journey.';
      }
    }

    return {
      score,
      wins,
      challenges,
      growth,
      diversity: Math.min(100, diversity),
      depth,
      feedback,
      level
    };
  }, [entries]);

  // Visual config by level
  const levelConfig = {
    Emerging: {
      color: 'from-gray-400 to-gray-500',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-300 dark:border-gray-700',
      icon: AlertCircle
    },
    Developing: {
      color: 'from-blue-400 to-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      icon: TrendingUp
    },
    Rich: {
      color: 'from-purple-400 to-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-300 dark:border-purple-700',
      icon: CheckCircle
    },
    Masterful: {
      color: 'theme-gradient-to-r',
      bg: 'theme-bg-primary-light',
      border: 'theme-border-primary',
      icon: Award
    }
  };

  const config = levelConfig[metrics.level];
  const Icon = config.icon;

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${config.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 theme-text-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Journey Richness Score
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Celebrating authentic, textured stories
              </p>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-full ${config.color} text-white font-bold`}>
            {metrics.level}
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative inline-block"
        >
          {/* Circular Progress */}
          <svg className="w-48 h-48 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-gray-200 dark:text-gray-700"
            />

            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="url(#richnessGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: metrics.score / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: 2 * Math.PI * 88,
                strokeDashoffset: 0
              }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="richnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--theme-primary)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--theme-secondary)' }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 dark:text-white">
                {metrics.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Richness Score
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Feedback */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-gray-700 dark:text-gray-300 max-w-md mx-auto"
        >
          {metrics.feedback}
        </motion.p>
      </div>

      {/* Metrics Breakdown */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.wins}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Wins</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {metrics.challenges}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Challenges</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.growth}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Growth</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(metrics.diversity)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Diversity</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold theme-text-primary">
              {Math.round(metrics.depth)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Depth</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          What Makes a Rich Journey?
        </h4>

        <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Balance:</strong> Document both wins AND challenges (not just one type)</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Variety:</strong> Diverse categories and tags show multifaceted growth</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Reflection:</strong> Deep, thoughtful reflections add meaning</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Growth:</strong> Connect challenges to lessons learned</span>
          </div>
        </div>
      </div>

      {/* Philosophy Note */}
      <div className={`px-6 py-4 ${config.bg} border-t border-gray-200 dark:border-gray-700`}>
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">侘寂 Wabi-Sabi:</span> A rich journey celebrates
          imperfection and variety. Stories with only successes lack depth; stories with only
          struggles lack hope. Your authentic, textured story—with all its varied experiences—
          is what makes you remarkable.
        </p>
      </div>
    </div>
  );
}
