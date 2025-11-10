'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Brain, Lightbulb, Loader2, CheckCircle, Info } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import PremiumBadge from './PremiumBadge';
import { extractSkillsFromEntries, categorizeSkills, formatSkillConfidence, type Skill } from '@/utils/lightcast';
import { JournalEntry } from '@/types/engagement';

interface StrengthDiscoveryProps {
  entries: JournalEntry[];
}

export default function StrengthDiscovery({ entries }: StrengthDiscoveryProps) {
  const { isPremium } = usePremium();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  const handleDiscoverStrengths = async () => {
    if (!isPremium) {
      setShowPremiumPrompt(true);
      return;
    }

    if (!entries || entries.length === 0) {
      setError('No documented experiences found. Start documenting your journey to discover your hidden strengths.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract text from entries
      const entryTexts = entries.map(entry => {
        const parts = [];
        if (entry.accomplishment) parts.push(entry.accomplishment);
        if (entry.reflection) parts.push(entry.reflection);
        return parts.join('\n');
      });

      // Call Lightcast API
      const extractedSkills = await extractSkillsFromEntries(entryTexts, 0.6);

      setSkills(extractedSkills);
      setHasAnalyzed(true);
    } catch (err) {
      console.error('Error discovering strengths:', err);
      setError(
        err instanceof Error && err.message.includes('credentials not configured')
          ? 'Lightcast API credentials not configured. Please add your credentials to .env.local'
          : 'Unable to analyze your experiences right now. Please try again later.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categorizedSkills = skills.length > 0 ? categorizeSkills(skills) : new Map();
  const totalSkills = skills.length;

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 theme-text-primary" />
            Strength Discovery
          </h3>
          {!isPremium && <PremiumBadge size="sm" />}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Uncover skills you didn't know you developed through your documented experiences
        </p>
      </div>

      {/* Info Box */}
      {!hasAnalyzed && !isAnalyzing && (
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-purple-900 dark:text-purple-100 font-medium mb-1">
                How it works
              </p>
              <p className="text-xs text-purple-800 dark:text-purple-200">
                We analyze your documented challenges and accomplishments to identify valuable skills you've developed—including ones you might not realize you have. From crisis management to adaptive leadership, your experiences reveal your hidden strengths.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Analyze Button */}
      {!hasAnalyzed && (
        <button
          onClick={handleDiscoverStrengths}
          disabled={isAnalyzing || entries.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing your experiences...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Discover My Strengths
            </>
          )}
        </button>
      )}

      {/* Results */}
      <AnimatePresence>
        {hasAnalyzed && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Summary Stats */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h4 className="text-lg font-bold text-green-900 dark:text-green-100">
                  Your Golden Seams: {totalSkills} Skills Discovered
                </h4>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Based on your documented experiences, we've identified {totalSkills} valuable professional skills. These are the strengths you've developed through your challenges and accomplishments.
              </p>
            </div>

            {/* Categorized Skills */}
            {Array.from(categorizedSkills.entries()).map(([category, categorySkills]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  {category === 'Soft Skills' && <Brain className="h-5 w-5 theme-text-primary" />}
                  {category === 'Technical Skills' && <Lightbulb className="h-5 w-5 theme-text-primary" />}
                  {category === 'Professional Skills' && <Award className="h-5 w-5 theme-text-primary" />}
                  <h5 className="text-md font-bold text-gray-900 dark:text-white">
                    {category} ({categorySkills.length})
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categorySkills.map((skill: Skill) => {
                    const confidenceInfo = formatSkillConfidence(skill.confidence);

                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 bg-white dark:bg-kintsugi-dark-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h6 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {skill.name}
                          </h6>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              confidenceInfo.color === 'green'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : confidenceInfo.color === 'blue'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : confidenceInfo.color === 'yellow'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {confidenceInfo.percentage}
                          </span>
                        </div>

                        {/* Confidence Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              confidenceInfo.color === 'green'
                                ? 'bg-green-500'
                                : confidenceInfo.color === 'blue'
                                ? 'bg-blue-500'
                                : confidenceInfo.color === 'yellow'
                                ? 'bg-yellow-500'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: confidenceInfo.percentage }}
                          />
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {confidenceInfo.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Re-analyze Button */}
            <button
              onClick={handleDiscoverStrengths}
              disabled={isAnalyzing}
              className="w-full mt-4 py-2 px-4 border-2 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Re-analyze with Latest Experiences
            </button>
          </motion.div>
        )}

        {hasAnalyzed && skills.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No specific skills detected yet. Keep documenting your experiences, especially challenges you've overcome and accomplishments you've achieved.
            </p>
            <button
              onClick={handleDiscoverStrengths}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Try analyzing again
            </button>
          </div>
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
                Unlock Strength Discovery to identify valuable skills from your documented experiences. See what makes you unique in the job market.
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
