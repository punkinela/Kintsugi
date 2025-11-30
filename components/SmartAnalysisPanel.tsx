'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Heart, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

interface SmartAnalysisResult {
  success: boolean;
  result?: {
    score: number;
    label: string;
    confidence: number;
    emotions: {
      joy: number;
      pride: number;
      hope: number;
      gratitude: number;
      frustration: number;
      anxiety: number;
      sadness: number;
      determination: number;
    };
    resilience: {
      detected: boolean;
      score: number;
      indicators: string[];
    };
    positiveWords: string[];
    negativeWords: string[];
    analysisMethod: 'local' | 'hybrid' | 'llm';
    culturalNotes?: string;
  };
  error?: string;
}

interface BiasDetectionResult {
  success: boolean;
  result?: {
    biasDetected: boolean;
    biasType?: string;
    originalThought?: string;
    reframe?: string;
    kintsugiConnection?: string;
    confidence: number;
  };
  error?: string;
}

interface SmartAnalysisPanelProps {
  text: string;
  onInsightReceived?: (insight: string) => void;
  showBiasDetection?: boolean;
  compact?: boolean;
}

export default function SmartAnalysisPanel({
  text,
  onInsightReceived,
  showBiasDetection = true,
  compact = false
}: SmartAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<SmartAnalysisResult | null>(null);
  const [biasResult, setBiasResult] = useState<BiasDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!text.trim() || text.length < 10) {
      setError('Please write at least 10 characters for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Run sentiment analysis and bias detection in parallel
      const [sentimentRes, biasRes] = await Promise.all([
        fetch('/api/smart/analyze-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, useDeepAnalysis: true }),
        }),
        showBiasDetection ? fetch('/api/smart/detect-bias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }) : Promise.resolve(null),
      ]);

      const sentimentData: SmartAnalysisResult = await sentimentRes.json();
      setSentimentResult(sentimentData);

      if (biasRes) {
        const biasData: BiasDetectionResult = await biasRes.json();
        setBiasResult(biasData);
      }

      // Extract insight for parent component
      if (sentimentData.result?.culturalNotes && onInsightReceived) {
        // Parse the JSON from culturalNotes if it exists
        try {
          const parsed = JSON.parse(sentimentData.result.culturalNotes.replace(/```json\n?|\n?```/g, ''));
          if (parsed.insight) {
            onInsightReceived(parsed.insight);
          }
        } catch {
          // If not JSON, use as-is
          onInsightReceived(sentimentData.result.culturalNotes);
        }
      }
    } catch (err) {
      setError('Failed to analyze. Smart features may not be enabled.');
      console.error('Smart analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojis: Record<string, string> = {
      joy: '😊',
      pride: '🏆',
      hope: '🌟',
      gratitude: '🙏',
      frustration: '😤',
      anxiety: '😰',
      sadness: '😢',
      determination: '💪',
    };
    return emojis[emotion] || '•';
  };

  const getSentimentColor = (label: string): string => {
    switch (label) {
      case 'very_positive':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'positive':
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
      case 'neutral':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      case 'negative':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'very_negative':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'mixed':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatLabel = (label: string): string => {
    return label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  // Get top emotions (score > 0.3)
  const getTopEmotions = () => {
    if (!sentimentResult?.result?.emotions) return [];
    return Object.entries(sentimentResult.result.emotions)
      .filter(([_, score]) => score > 0.3)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3);
  };

  // Parse Kintsugi insight from culturalNotes
  const getKintsugiInsight = (): string | null => {
    if (!sentimentResult?.result?.culturalNotes) return null;
    try {
      const parsed = JSON.parse(sentimentResult.result.culturalNotes.replace(/```json\n?|\n?```/g, ''));
      return parsed.insight || null;
    } catch {
      return sentimentResult.result.culturalNotes;
    }
  };

  return (
    <div className="mt-4">
      {/* Analyze Button */}
      {!sentimentResult && (
        <button
          onClick={analyzeText}
          disabled={isAnalyzing || !text.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-md"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing with Smart...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get Smart Insights
            </>
          )}
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {sentimentResult?.success && sentimentResult.result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Sentiment Overview */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-600" />
                  Smart Analysis
                  {sentimentResult.result.analysisMethod === 'hybrid' && (
                    <span className="text-xs px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full">
                      Claude Enhanced
                    </span>
                  )}
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(sentimentResult.result.label)}`}>
                  {formatLabel(sentimentResult.result.label)}
                </span>
              </div>

              {/* Top Emotions */}
              {getTopEmotions().length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Emotions Detected:</p>
                  <div className="flex flex-wrap gap-2">
                    {getTopEmotions().map(([emotion, score]) => (
                      <span
                        key={emotion}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-sm"
                      >
                        <span>{getEmotionEmoji(emotion)}</span>
                        <span className="capitalize text-gray-700 dark:text-gray-300">{emotion}</span>
                        <span className="text-xs text-gray-500">({Math.round(score * 100)}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resilience */}
              {sentimentResult.result.resilience.detected && (
                <div className="mb-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Resilience Detected!
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sentimentResult.result.resilience.indicators.map((indicator, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Kintsugi Insight from Claude */}
              {getKintsugiInsight() && (
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-amber-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{getKintsugiInsight()}"
                  </p>
                </div>
              )}
            </div>

            {/* Bias Detection */}
            {biasResult?.success && biasResult.result?.biasDetected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
              >
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Gentle Reframe
                </h4>

                {biasResult.result.biasType && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                    Pattern noticed: {biasResult.result.biasType}
                  </p>
                )}

                {biasResult.result.reframe && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg mb-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      💡 {biasResult.result.reframe}
                    </p>
                  </div>
                )}

                {biasResult.result.kintsugiConnection && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    ✨ {biasResult.result.kintsugiConnection}
                  </p>
                )}
              </motion.div>
            )}

            {/* Re-analyze Button */}
            <button
              onClick={() => {
                setSentimentResult(null);
                setBiasResult(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Clear & analyze again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
