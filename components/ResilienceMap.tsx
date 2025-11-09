'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Lightbulb, Calendar, Sparkles, Info, ChevronRight, Target } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import PremiumBadge from './PremiumBadge';
import { JournalEntry } from '@/types/engagement';
import {
  analyzeEntriesSentiment,
  detectPatterns,
  identifyGoldenSeams,
  getSentimentTrend,
  getResilienceScore,
  type EntryWithSentiment,
  type Pattern,
  type GoldenSeam
} from '@/utils/sentimentAnalysis';

interface ResilienceMapProps {
  entries: JournalEntry[];
}

export default function ResilienceMap({ entries }: ResilienceMapProps) {
  const { isPremium } = usePremium();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [selectedSeam, setSelectedSeam] = useState<GoldenSeam | null>(null);

  const handleAnalyze = () => {
    if (!isPremium) {
      setShowPremiumPrompt(true);
      return;
    }

    setHasAnalyzed(true);
  };

  // Perform analysis
  const analyzedEntries = useMemo(() => {
    if (!hasAnalyzed || entries.length === 0) return [];
    return analyzeEntriesSentiment(entries);
  }, [entries, hasAnalyzed]);

  const patterns = useMemo(() => {
    if (analyzedEntries.length === 0) return [];
    return detectPatterns(analyzedEntries);
  }, [analyzedEntries]);

  const goldenSeams = useMemo(() => {
    if (analyzedEntries.length === 0) return [];
    return identifyGoldenSeams(analyzedEntries);
  }, [analyzedEntries]);

  const sentimentTrend = useMemo(() => {
    if (analyzedEntries.length === 0) return [];
    return getSentimentTrend(analyzedEntries);
  }, [analyzedEntries]);

  const resilienceScore = useMemo(() => {
    return getResilienceScore(goldenSeams);
  }, [goldenSeams]);

  const getSentimentColor = (score: number): string => {
    if (score >= 0.5) return 'bg-green-500';
    if (score >= 0.2) return 'bg-emerald-400';
    if (score >= -0.2) return 'bg-gray-400';
    if (score >= -0.5) return 'bg-orange-400';
    return 'bg-red-500';
  };

  const getScoreLevelColor = (level: string): string => {
    switch (level) {
      case 'exceptional': return 'from-purple-500 to-pink-500';
      case 'strong': return 'from-blue-500 to-indigo-500';
      case 'moderate': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 theme-text-primary" />
            Resilience Map
          </h3>
          {!isPremium && <PremiumBadge size="sm" />}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          See your pattern of overcoming - not isolated incidents, but a proven track record of resilience
        </p>
      </div>

      {/* Analyze Button */}
      {!hasAnalyzed && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-900 dark:text-indigo-100 font-medium mb-1">
                  Discover your resilience patterns
                </p>
                <p className="text-xs text-indigo-800 dark:text-indigo-200">
                  We'll analyze your emotional journey across all documented experiences to reveal:
                  <strong> recurring themes, growth trajectories, and your golden seams</strong> - the moments where challenges transformed into strengths.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={entries.length < 3}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="h-5 w-5" />
            Reveal My Resilience Patterns
          </button>

          {entries.length < 3 && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Document at least 3 experiences to see patterns
            </p>
          )}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {hasAnalyzed && analyzedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Resilience Score */}
            <div className={`bg-gradient-to-br ${getScoreLevelColor(resilienceScore.level)} rounded-xl p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold mb-1">Your Resilience Score</h4>
                  <p className="text-sm text-white/90">{resilienceScore.description}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{resilienceScore.score}</div>
                  <div className="text-xs uppercase tracking-wide opacity-90">{resilienceScore.level}</div>
                </div>
              </div>

              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${resilienceScore.score}%` }}
                />
              </div>
            </div>

            {/* Golden Seams */}
            {goldenSeams.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 theme-text-primary" />
                  <h5 className="text-md font-bold text-gray-900 dark:text-white">
                    Your Golden Seams ({goldenSeams.length})
                  </h5>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Each seam shows a complete resilience journey: challenge → growth → triumph
                </p>

                <div className="space-y-3">
                  {goldenSeams.map((seam) => (
                    <motion.div
                      key={seam.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-700 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedSeam(selectedSeam?.id === seam.id ? null : seam)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                              {seam.timespan} days to recovery
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full">
                              {seam.strengthGained}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-amber-600 dark:text-amber-400 transition-transform ${selectedSeam?.id === seam.id ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Timeline Preview */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getSentimentColor(seam.challenge.sentiment.score)}`} />
                        <div className="flex-1 h-1 bg-gradient-to-r from-amber-300 to-yellow-400" />
                        {seam.growth.map((_, idx) => (
                          <div key={idx} className="w-2 h-2 rounded-full bg-amber-400" />
                        ))}
                        <div className="flex-1 h-1 bg-gradient-to-r from-yellow-400 to-green-400" />
                        <div className={`w-3 h-3 rounded-full ${getSentimentColor(seam.win.sentiment.score)}`} />
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        From <strong>"{seam.challenge.accomplishment.substring(0, 50)}..."</strong> to <strong>"{seam.win.accomplishment.substring(0, 50)}..."</strong>
                      </p>

                      {/* Expanded Details */}
                      {selectedSeam?.id === seam.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700 space-y-3"
                        >
                          <div>
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-1">Challenge:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{seam.challenge.accomplishment}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(seam.challenge.date).toLocaleDateString()}</p>
                          </div>

                          {seam.growth.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-1">Growth Steps:</p>
                              {seam.growth.map((g, idx) => (
                                <p key={idx} className="text-sm text-gray-600 dark:text-gray-400 ml-3">• {g.accomplishment}</p>
                              ))}
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-1">Triumph:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{seam.win.accomplishment}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(seam.win.date).toLocaleDateString()}</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recurring Patterns */}
            {patterns.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 theme-text-primary" />
                  <h5 className="text-md font-bold text-gray-900 dark:text-white">
                    Recurring Themes ({patterns.length})
                  </h5>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Patterns you consistently demonstrate across your experiences
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {patterns.slice(0, 6).map((pattern) => (
                    <motion.div
                      key={pattern.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h6 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                          {pattern.name}
                        </h6>
                        <span className="text-xs px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                          {pattern.frequency}x
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {pattern.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment Timeline */}
            {sentimentTrend.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 theme-text-primary" />
                  <h5 className="text-md font-bold text-gray-900 dark:text-white">
                    Emotional Journey
                  </h5>
                </div>

                <div className="flex items-end gap-1 h-32">
                  {sentimentTrend.map((point, idx) => {
                    const height = ((point.score + 1) / 2) * 100; // Convert -1 to 1 scale to 0-100%
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-end group relative"
                      >
                        <div
                          className={`w-full ${getSentimentColor(point.score)} rounded-t transition-all hover:opacity-80`}
                          style={{ height: `${height}%` }}
                        />
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          {new Date(point.date).toLocaleDateString()}<br />
                          {point.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Oldest</span>
                  <span>Most Recent</span>
                </div>
              </div>
            )}

            {/* Re-analyze */}
            <button
              onClick={handleAnalyze}
              className="w-full mt-4 py-2 px-4 border-2 border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Re-analyze with Latest Experiences
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Prompt */}
      {showPremiumPrompt && (
        <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
          <div className="flex items-start gap-3">
            <PremiumBadge size="md" />
            <div>
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                Premium Feature
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mb-3">
                Unlock Resilience Map to see your patterns of overcoming, emotional journey visualization, and golden seams connecting challenges to strengths.
              </p>
              <button
                onClick={() => setShowPremiumPrompt(false)}
                className="text-xs text-amber-700 dark:text-amber-300 font-semibold hover:underline"
              >
                Enable dev mode in Settings → Diagnostic to test this feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
