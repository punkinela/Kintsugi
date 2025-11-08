'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, TrendingUp, Award, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface DiscoveredStrength {
  strength: string;
  sourceEntry: string;
  entryDate: string;
  context: string;
  category: 'resilience' | 'emotional' | 'professional' | 'interpersonal' | 'cognitive';
}

interface StrengthArchaeologyProps {
  entries: JournalEntry[];
}

export default function StrengthArchaeology({ entries }: StrengthArchaeologyProps) {
  const [discoveredStrengths, setDiscoveredStrengths] = useState<DiscoveredStrength[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedStrength, setExpandedStrength] = useState<number | null>(null);

  // Strength patterns to look for in challenge narratives
  const strengthPatterns = [
    {
      keywords: ['dealt with', 'handled', 'managed', 'coped with', 'stressed', 'overwhelmed'],
      strength: 'Stress Management',
      category: 'emotional' as const,
      context: 'Navigated high-pressure situations'
    },
    {
      keywords: ['client was angry', 'difficult conversation', 'confrontation', 'conflict'],
      strength: 'Emotional Regulation',
      category: 'emotional' as const,
      context: 'Maintained composure under pressure'
    },
    {
      keywords: ['had to learn', 'figured out', 'taught myself', 'researched'],
      strength: 'Self-Directed Learning',
      category: 'cognitive' as const,
      context: 'Acquired new knowledge independently'
    },
    {
      keywords: ['didn\'t know', 'was confused', 'unclear', 'ambiguous'],
      strength: 'Tolerance for Ambiguity',
      category: 'cognitive' as const,
      context: 'Operated effectively despite uncertainty'
    },
    {
      keywords: ['deadline', 'time pressure', 'rushed', 'urgent'],
      strength: 'Time Management',
      category: 'professional' as const,
      context: 'Met critical deadlines'
    },
    {
      keywords: ['juggled', 'multiple', 'priorities', 'competing'],
      strength: 'Priority Management',
      category: 'professional' as const,
      context: 'Balanced competing demands'
    },
    {
      keywords: ['explained', 'presented', 'communicated', 'clarified'],
      strength: 'Clear Communication',
      category: 'interpersonal' as const,
      context: 'Articulated complex ideas effectively'
    },
    {
      keywords: ['disagreed', 'pushed back', 'advocated', 'stood up'],
      strength: 'Professional Assertiveness',
      category: 'interpersonal' as const,
      context: 'Defended position diplomatically'
    },
    {
      keywords: ['mistake', 'error', 'wrong', 'failed'],
      strength: 'Accountability',
      category: 'professional' as const,
      context: 'Took responsibility for outcomes'
    },
    {
      keywords: ['tried again', 'persisted', 'kept going', 'didn\'t give up'],
      strength: 'Persistence',
      category: 'resilience' as const,
      context: 'Continued despite setbacks'
    },
    {
      keywords: ['adjusted', 'pivoted', 'changed approach', 'adapted'],
      strength: 'Adaptability',
      category: 'resilience' as const,
      context: 'Modified strategy when needed'
    },
    {
      keywords: ['recovered', 'bounced back', 'moved on', 'got back up'],
      strength: 'Resilience',
      category: 'resilience' as const,
      context: 'Recovered from setbacks'
    },
    {
      keywords: ['different perspective', 'another way', 'creative solution', 'innovative'],
      strength: 'Creative Problem-Solving',
      category: 'cognitive' as const,
      context: 'Found novel approaches'
    },
    {
      keywords: ['mediated', 'resolved', 'facilitated', 'negotiated'],
      strength: 'Conflict Resolution',
      category: 'interpersonal' as const,
      context: 'Brokered solutions between parties'
    },
    {
      keywords: ['mentored', 'helped', 'supported', 'coached'],
      strength: 'Supportive Leadership',
      category: 'interpersonal' as const,
      context: 'Guided others through challenges'
    }
  ];

  // Analyze entries for hidden strengths
  const analyzeStrengths = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const discovered: DiscoveredStrength[] = [];

      entries.forEach(entry => {
        const entryText = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();

        strengthPatterns.forEach(pattern => {
          const hasKeywords = pattern.keywords.some(keyword =>
            entryText.includes(keyword.toLowerCase())
          );

          if (hasKeywords) {
            // Avoid duplicates
            const alreadyDiscovered = discovered.some(
              d => d.strength === pattern.strength && d.entryDate === entry.date
            );

            if (!alreadyDiscovered) {
              discovered.push({
                strength: pattern.strength,
                sourceEntry: entry.accomplishment.substring(0, 100),
                entryDate: entry.date,
                context: pattern.context,
                category: pattern.category
              });
            }
          }
        });
      });

      // Sort by date (most recent first)
      discovered.sort((a, b) =>
        new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
      );

      setDiscoveredStrengths(discovered);
      setIsAnalyzing(false);
    }, 1500); // Simulate AI processing
  };

  // Analyze when component mounts
  useEffect(() => {
    if (entries.length > 0) {
      analyzeStrengths();
    }
  }, [entries.length]);

  // Category colors
  const categoryConfig = {
    resilience: {
      color: 'theme-gradient-to-r',
      bg: 'theme-bg-primary-light',
      border: 'theme-border-light dark:theme-border-primary',
      text: 'theme-text-primary',
      icon: TrendingUp
    },
    emotional: {
      color: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: Sparkles
    },
    professional: {
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: Award
    },
    interpersonal: {
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: Gem
    },
    cognitive: {
      color: 'from-rose-500 to-red-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-300',
      icon: TrendingUp
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(discoveredStrengths.map(s => s.category)));

  // Filter by category
  const filteredStrengths = selectedCategory
    ? discoveredStrengths.filter(s => s.category === selectedCategory)
    : discoveredStrengths;

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r theme-gradient-to-br">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gem className="h-6 w-6 theme-text-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Strength Archaeology
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Strengths discovered through adversity
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold theme-text-primary">
              {discoveredStrengths.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              strengths found
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-gradient-to-r theme-gradient-to-r text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All ({discoveredStrengths.length})
            </button>

            {categories.map(category => {
              const count = discoveredStrengths.filter(s => s.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? `bg-gradient-to-r ${categoryConfig[category].color} text-white`
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths List */}
      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center gap-3 theme-text-primary">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
                <span className="text-sm font-medium">Analyzing your experiences...</span>
              </div>
            </motion.div>
          ) : filteredStrengths.length === 0 ? (
            <div className="text-center py-12">
              <Gem className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Add more journal entries to discover hidden strengths
              </p>
            </div>
          ) : (
            filteredStrengths.map((strength, index) => {
              const config = categoryConfig[strength.category];
              const Icon = config.icon;
              const isExpanded = expandedStrength === index;

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${config.bg} ${config.border} border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all`}
                  onClick={() => setExpandedStrength(isExpanded ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 bg-gradient-to-r ${config.color} rounded-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1">
                        <h4 className={`text-lg font-bold ${config.text} mb-1`}>
                          {strength.strength}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {strength.context}
                        </p>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                            >
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                From entry on {new Date(strength.entryDate).toLocaleDateString()}:
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                "{strength.sourceEntry}..."
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 bg-gradient-to-r theme-gradient-to-br border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">もったいない Mottainai:</span> "Nothing is wasted" -
          Every challenge you've faced has revealed capabilities you might not have recognized.
          These strengths are exportable to your resume and performance reviews.
        </p>
      </div>
    </div>
  );
}
