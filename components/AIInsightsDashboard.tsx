'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, Heart, RefreshCw, Sparkles } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';
import {
  analyzePatterns,
  recommendAffirmations,
  type Pattern,
  type AffirmationRecommendation
} from '@/utils/aiHelpers';
import { JournalEntry } from '@/types/engagement';

export default function AIInsightsDashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [affirmations, setAffirmations] = useState<AffirmationRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getEngagementData();
    setEntries(data.journalEntries || []);

    // Auto-analyze if enough entries
    if (data.journalEntries && data.journalEntries.length >= 3) {
      handleAnalyze(data.journalEntries);
    }
  };

  const handleAnalyze = (entriesToAnalyze?: JournalEntry[]) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const dataToAnalyze = entriesToAnalyze || entries;
      const detectedPatterns = analyzePatterns(dataToAnalyze);
      const recommendations = recommendAffirmations(dataToAnalyze);

      setPatterns(detectedPatterns);
      setAffirmations(recommendations);
      setLastAnalyzed(new Date());
      setIsAnalyzing(false);
    }, 1200);
  };

  const getPatternIcon = (type: Pattern['type']) => {
    switch (type) {
      case 'strength':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'growth-area':
        return <Lightbulb className="h-5 w-5 theme-text-primary" />;
      case 'trend':
        return <Brain className="h-5 w-5 text-blue-600" />;
      case 'insight':
        return <Sparkles className="h-5 w-5 text-purple-600" />;
    }
  };

  const getPatternColor = (type: Pattern['type']) => {
    switch (type) {
      case 'strength':
        return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'growth-area':
        return 'theme-bg-primary-light  border-yellow-200 dark:theme-border-primary';
      case 'trend':
        return 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800';
      case 'insight':
        return 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Insights & Patterns
          </h2>
          <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary mt-1">
            Personalized insights based on your journal entries
          </p>
        </div>

        {entries.length >= 3 && (
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        )}
      </div>

      {/* Last Analyzed */}
      {lastAnalyzed && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last analyzed: {lastAnalyzed.toLocaleTimeString()}
        </div>
      )}

      {/* Patterns */}
      {patterns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detected Patterns
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${getPatternColor(pattern.type)} rounded-xl p-5 border-2`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-black/20 rounded-lg">
                    {getPatternIcon(pattern.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {pattern.title}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-black/20 text-gray-700 dark:text-gray-300">
                        {pattern.confidence}% confidence
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {pattern.description}
                    </p>

                    {/* Data visualization hint */}
                    {pattern.type === 'strength' && pattern.data && (
                      <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(pattern.data).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs px-2 py-1 bg-white dark:bg-black/20 rounded-full"
                            >
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Affirmations */}
      {affirmations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Recommended Affirmations for You
          </h3>

          <div className="space-y-3">
            {affirmations.map((affirmation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-5 border border-pink-200 dark:border-pink-800"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center text-lg">
                    💖
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300">
                        {affirmation.category}
                      </span>
                    </div>

                    <p className="text-base font-medium text-gray-900 dark:text-white mb-2 leading-relaxed">
                      "{affirmation.affirmation}"
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💡 {affirmation.reason}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Not Enough Data */}
      {entries.length < 3 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800 text-center">
          <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
            Keep Journaling to Unlock Insights
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Log at least 3 accomplishments to get personalized AI insights and pattern analysis.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${
                    i < entries.length
                      ? 'bg-purple-600'
                      : 'bg-gray-300 dark:bg-gray-700'
                  } flex items-center justify-center text-white font-semibold`}
                >
                  {i < entries.length ? '✓' : i + 1}
                </div>
              ))}
            </div>
            <span>{entries.length} / 3 entries</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-8 border theme-border-light dark:border-kintsugi-dark-700 text-center">
          <RefreshCw className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Analyzing Your Patterns...
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Processing {entries.length} journal entries
          </p>
        </div>
      )}
    </div>
  );
}
