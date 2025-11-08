'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Briefcase, Award, TrendingUp, X, Check, Plus, Brain, Lightbulb } from 'lucide-react';
import type { UserProfile } from '@/types';

interface AutoProfileBuilderProps {
  entries: {
    id: string;
    text: string;
    date: Date;
  }[];
  currentProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

interface ProfileSuggestion {
  id: string;
  type: 'skill' | 'bio' | 'achievement';
  title: string;
  value: string;
  confidence: number;
  reasoning: string;
  source: string[]; // Entry IDs that support this
}

interface GrowthMindsetAnalysis {
  score: number; // 0-100, where higher = more growth mindset
  classification: 'fixed' | 'mixed' | 'growth';
  patterns: {
    type: 'fixed' | 'growth';
    examples: string[];
    count: number;
  }[];
  insights: string[];
  recommendations: string[];
}

export default function AutoProfileBuilder({ entries, currentProfile, onUpdateProfile }: AutoProfileBuilderProps) {
  const [suggestions, setSuggestions] = useState<ProfileSuggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [showGrowthMindset, setShowGrowthMindset] = useState(false);

  const growthMindsetAnalysis = useMemo(() => {
    return analyzeGrowthMindset(entries);
  }, [entries]);

  useEffect(() => {
    if (entries.length > 0) {
      const newSuggestions = generateProfileSuggestions(entries, currentProfile);
      setSuggestions(newSuggestions);
    }
  }, [entries, currentProfile]);

  const applySuggestion = (suggestion: ProfileSuggestion) => {
    const updates: Partial<UserProfile> = {};

    if (suggestion.type === 'skill') {
      const currentSkills = currentProfile.skills || [];
      if (!currentSkills.includes(suggestion.value)) {
        updates.skills = [...currentSkills, suggestion.value];
      }
    } else if (suggestion.type === 'bio') {
      updates.bio = suggestion.value;
    }

    onUpdateProfile(updates);
    setAppliedSuggestions(prev => new Set(prev).add(suggestion.id));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set(prev).add(suggestionId));
  };

  const visibleSuggestions = suggestions.filter(
    s => !appliedSuggestions.has(s.id) && !dismissedSuggestions.has(s.id)
  );

  const getGrowthMindsetColor = (classification: GrowthMindsetAnalysis['classification']) => {
    switch (classification) {
      case 'growth': return 'from-green-500 to-emerald-500';
      case 'mixed': return 'from-yellow-500 to-orange-500';
      case 'fixed': return 'from-red-500 to-pink-500';
    }
  };

  const getGrowthMindsetMessage = (classification: GrowthMindsetAnalysis['classification']) => {
    switch (classification) {
      case 'growth': return 'You demonstrate a strong growth mindset! You view challenges as opportunities to learn.';
      case 'mixed': return 'You show both growth and fixed mindset patterns. Focus on learning from setbacks.';
      case 'fixed': return 'Consider reframing challenges as learning opportunities rather than limitations.';
    }
  };

  if (entries.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Growth Mindset Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 theme-gradient-to-r rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Growth Mindset Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on Carol Dweck's research on mindset and learning
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGrowthMindset(!showGrowthMindset)}
            className="text-sm theme-text-primary hover:underline"
          >
            {showGrowthMindset ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {/* Score Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mindset Score</span>
            <span className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
              {growthMindsetAnalysis.classification}
            </span>
          </div>
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${growthMindsetAnalysis.score}%` }}
              className={`h-full bg-gradient-to-r ${getGrowthMindsetColor(growthMindsetAnalysis.classification)}`}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getGrowthMindsetMessage(growthMindsetAnalysis.classification)}
          </p>
        </div>

        {/* Detailed Analysis */}
        <AnimatePresence>
          {showGrowthMindset && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6 space-y-4"
            >
              {/* Patterns */}
              <div className="grid md:grid-cols-2 gap-4">
                {growthMindsetAnalysis.patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-4 border-2 ${
                      pattern.type === 'growth'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <h4 className={`text-sm font-semibold mb-2 ${
                      pattern.type === 'growth' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                    }`}>
                      {pattern.type === 'growth' ? '✓ Growth Mindset' : '⚠ Fixed Mindset'} ({pattern.count})
                    </h4>
                    <ul className="text-xs space-y-1">
                      {pattern.examples.slice(0, 3).map((example, i) => (
                        <li key={i} className={
                          pattern.type === 'growth' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        }>
                          • "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Insights from Your Language
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  {growthMindsetAnalysis.insights.map((insight, idx) => (
                    <li key={idx}>• {insight}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="theme-bg-primary-light rounded-lg p-4 border theme-border-light">
                <h4 className="text-sm font-semibold theme-text-primary mb-2">
                  Recommendations to Strengthen Growth Mindset
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {growthMindsetAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Auto-Profile Suggestions */}
      {visibleSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 theme-gradient-to-r rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Auto-Profile Builder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {visibleSuggestions.length} suggestion{visibleSuggestions.length !== 1 ? 's' : ''} based on your impact log
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {visibleSuggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      suggestion.type === 'skill' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      suggestion.type === 'bio' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      {suggestion.type === 'skill' && <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                      {suggestion.type === 'bio' && <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                      {suggestion.type === 'achievement' && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{suggestion.reasoning}</p>
                      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">"{suggestion.value}"</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Confidence: {suggestion.confidence}%
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          From {suggestion.source.length} entr{suggestion.source.length === 1 ? 'y' : 'ies'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => applySuggestion(suggestion)}
                    className="flex-1 px-4 py-2 theme-btn-primary text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Profile
                  </button>
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {appliedSuggestions.size > 0 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-400">
                {appliedSuggestions.size} suggestion{appliedSuggestions.size !== 1 ? 's' : ''} applied to your profile
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// GROWTH MINDSET ANALYSIS (Carol Dweck Research)
// ============================================

function analyzeGrowthMindset(entries: { text: string }[]): GrowthMindsetAnalysis {
  const allText = entries.map(e => e.text).join(' ');

  const growthPatterns: { examples: string[]; count: number } = { examples: [], count: 0 };
  const fixedPatterns: { examples: string[]; count: number } = { examples: [], count: 0 };

  // Growth Mindset Indicators (Dweck, 2006)
  const growthIndicators = [
    { pattern: /\blearn(ed|ing)?\b/gi, example: 'learned' },
    { pattern: /\bgrow(th|ing|n)?\b/gi, example: 'growth' },
    { pattern: /\bimprove(d|ment)?\b/gi, example: 'improved' },
    { pattern: /\bchallenge(d|s)?\b/gi, example: 'challenge' },
    { pattern: /\bdevelop(ed|ing|ment)?\b/gi, example: 'developed' },
    { pattern: /\bprogress(ed|ing)?\b/gi, example: 'progress' },
    { pattern: /\beffort\b/gi, example: 'effort' },
    { pattern: /\bpractice(d)?\b/gi, example: 'practice' },
    { pattern: /\bstrategies\b/gi, example: 'strategies' },
    { pattern: /\badapt(ed|ing)?\b/gi, example: 'adapted' },
    { pattern: /\btried (new|different)\b/gi, example: 'tried new' },
    { pattern: /\bfeedback\b/gi, example: 'feedback' }
  ];

  // Fixed Mindset Indicators
  const fixedIndicators = [
    { pattern: /\b(can't|cannot|couldn't)\b/gi, example: "can't" },
    { pattern: /\bnot (good|smart|talented) enough\b/gi, example: 'not good enough' },
    { pattern: /\b(always|never) (been|was)\b/gi, example: 'always been' },
    { pattern: /\bborn with\b/gi, example: 'born with' },
    { pattern: /\bnatural(ly)? (talent|gift)\b/gi, example: 'natural talent' },
    { pattern: /\btoo (hard|difficult)\b/gi, example: 'too hard' },
    { pattern: /\bgave up\b/gi, example: 'gave up' },
    { pattern: /\bimpossible\b/gi, example: 'impossible' }
  ];

  // Count growth indicators
  growthIndicators.forEach(({ pattern, example }) => {
    const matches = allText.match(pattern);
    if (matches) {
      growthPatterns.count += matches.length;
      if (growthPatterns.examples.length < 10) {
        growthPatterns.examples.push(example);
      }
    }
  });

  // Count fixed indicators
  fixedIndicators.forEach(({ pattern, example }) => {
    const matches = allText.match(pattern);
    if (matches) {
      fixedPatterns.count += matches.length;
      if (fixedPatterns.examples.length < 10) {
        fixedPatterns.examples.push(example);
      }
    }
  });

  // Calculate score (0-100)
  const total = growthPatterns.count + fixedPatterns.count;
  const score = total === 0 ? 50 : Math.round((growthPatterns.count / total) * 100);

  // Classification
  let classification: GrowthMindsetAnalysis['classification'];
  if (score >= 65) classification = 'growth';
  else if (score >= 35) classification = 'mixed';
  else classification = 'fixed';

  // Generate insights
  const insights: string[] = [];
  if (growthPatterns.count > fixedPatterns.count) {
    insights.push('You frequently use learning-oriented language, showing openness to development');
  }
  if (fixedPatterns.count > 5) {
    insights.push('Some language patterns suggest fixed mindset beliefs about abilities');
  }
  if (growthPatterns.count > 10) {
    insights.push('You demonstrate strong growth mindset through emphasis on effort and progress');
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (classification !== 'growth') {
    recommendations.push('Replace "I can\'t" with "I can\'t YET" to emphasize learning potential');
    recommendations.push('Focus on the process and effort, not just outcomes');
    recommendations.push('View challenges as opportunities to develop new capabilities');
  }
  if (fixedPatterns.count > 0) {
    recommendations.push('Reframe setbacks as learning experiences rather than limitations');
  }
  recommendations.push('Continue documenting your growth journey to reinforce progress mindset');

  return {
    score,
    classification,
    patterns: [
      { type: 'growth', examples: growthPatterns.examples, count: growthPatterns.count },
      { type: 'fixed', examples: fixedPatterns.examples, count: fixedPatterns.count }
    ],
    insights,
    recommendations
  };
}

// ============================================
// AUTO-PROFILE SUGGESTIONS
// ============================================

function generateProfileSuggestions(
  entries: { id: string; text: string }[],
  currentProfile: UserProfile
): ProfileSuggestion[] {
  const suggestions: ProfileSuggestion[] = [];
  const allText = entries.map(e => e.text).join(' ');

  // Extract skills
  const skillPatterns = [
    { skill: 'leadership', pattern: /\b(led|leading|managed|directed|supervised)\b/gi },
    { skill: 'project management', pattern: /\b(project|projects|deadline|timeline|scoped)\b/gi },
    { skill: 'communication', pattern: /\b(presented|presentation|communicated|explained|documented)\b/gi },
    { skill: 'problem-solving', pattern: /\b(solved|debugged|troubleshoot|fixed|resolved)\b/gi },
    { skill: 'data analysis', pattern: /\b(data|analytics|analyzed|metrics|reporting)\b/gi },
    { skill: 'collaboration', pattern: /\b(collaborated|team|partnered|cross-functional)\b/gi },
    { skill: 'technical writing', pattern: /\b(documentation|documented|wrote|writing)\b/gi },
    { skill: 'mentoring', pattern: /\b(mentor|mentored|coached|trained|teaching)\b/gi }
  ];

  skillPatterns.forEach(({ skill, pattern }) => {
    const matches = allText.match(pattern);
    if (matches && matches.length >= 3) {
      const currentSkills = (currentProfile.skills || []).map(s => s.toLowerCase());
      if (!currentSkills.includes(skill.toLowerCase())) {
        const sourceEntries = entries.filter(e => pattern.test(e.text)).map(e => e.id);
        suggestions.push({
          id: `skill-${skill}`,
          type: 'skill',
          title: `Add "${skill}" to your skills`,
          value: skill,
          confidence: Math.min(95, 60 + matches.length * 5),
          reasoning: `Found ${matches.length} references to ${skill} in your impact log`,
          source: sourceEntries
        });
      }
    }
  });

  // Generate bio suggestion
  if (!currentProfile.bio || currentProfile.bio.length < 50) {
    const topSkills = suggestions.slice(0, 3).map(s => s.value);
    if (topSkills.length > 0 && currentProfile.profession) {
      const bioSuggestion = `${currentProfile.profession} with demonstrated expertise in ${topSkills.join(', ')}. Proven track record of delivering impactful results through ${topSkills[0]} and cross-functional collaboration.`;

      suggestions.push({
        id: 'bio-auto',
        type: 'bio',
        title: 'Add professional bio',
        value: bioSuggestion,
        confidence: 85,
        reasoning: 'Generated from your documented achievements and skills',
        source: entries.map(e => e.id)
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
