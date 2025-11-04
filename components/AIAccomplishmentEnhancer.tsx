'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Copy, Check, AlertCircle, TrendingUp, X } from 'lucide-react';
import {
  detectBiasPatterns,
  getBiasScore,
  enhanceAccomplishment,
  formatForExport,
  type BiasPattern,
  type EnhancementSuggestion
} from '@/utils/aiHelpers';

interface AIAccomplishmentEnhancerProps {
  text: string;
  onApply?: (enhanced: string) => void;
  mode?: 'inline' | 'modal';
}

export default function AIAccomplishmentEnhancer({ text, onApply, mode = 'inline' }: AIAccomplishmentEnhancerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patterns, setPatterns] = useState<BiasPattern[]>([]);
  const [suggestions, setSuggestions] = useState<EnhancementSuggestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const detectedPatterns = detectBiasPatterns(text);
      const enhancements = enhanceAccomplishment(text);

      setPatterns(detectedPatterns);
      setSuggestions(enhancements);
      setShowResults(true);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySuggestion = (enhanced: string) => {
    if (onApply) {
      onApply(enhanced);
    }
    handleCopy(enhanced);
  };

  const biasScore = getBiasScore(patterns);
  const enhancedText = formatForExport(text, patterns);

  return (
    <div className="space-y-4">
      {/* Analyze Button */}
      {!showResults && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Enhance with AI'}
        </motion.button>
      )}

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Bias Score Card */}
            <div className={`rounded-xl p-4 border-2 ${
              biasScore >= 80
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : biasScore >= 60
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${
                    biasScore >= 80 ? 'text-green-600' : biasScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Confidence Score: {biasScore}/100
                  </h3>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {biasScore >= 80
                  ? '✨ Great! Your language is confident and clear.'
                  : biasScore >= 60
                  ? '⚠️ Good, but there\'s room to strengthen your language.'
                  : '🔴 Consider revising to sound more confident and direct.'}
              </p>
            </div>

            {/* Detected Patterns */}
            {patterns.length > 0 && (
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Detected Patterns ({patterns.length})
                </h3>
                <div className="space-y-2">
                  {patterns.map((pattern, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        pattern.severity === 'high'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : pattern.severity === 'medium'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-white dark:bg-black/20 capitalize">
                          {pattern.type.replace(/-/g, ' ')}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            "{pattern.text}"
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {pattern.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhancement Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Enhancement Suggestions
                </h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 capitalize">
                          {suggestion.type.replace(/-/g, ' ')}
                        </span>
                        <button
                          onClick={() => handleApplySuggestion(suggestion.enhanced)}
                          className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        {suggestion.explanation}
                      </p>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium">Enhanced: </span>
                        {suggestion.enhanced}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Version */}
            {patterns.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Auto-Enhanced Version
                  </h3>
                  <button
                    onClick={() => handleCopy(enhancedText)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {enhancedText}
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                  ✨ Removed {patterns.length} minimizing pattern{patterns.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* No Issues */}
            {patterns.length === 0 && suggestions.length === 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
                <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Looking Good! 🎉
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your accomplishment is well-written with confident language. No changes needed!
                </p>
              </div>
            )}

            {/* Try Again Button */}
            <button
              onClick={() => {
                setShowResults(false);
                setPatterns([]);
                setSuggestions([]);
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Analyze Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
