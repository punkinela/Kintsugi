'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, X } from 'lucide-react';
import AIBadge from '@/components/AIBadge';

interface AISmartWritingCoachProps {
  text: string;
  onSuggestionApply?: (newText: string) => void;
  compact?: boolean;
}

interface WritingFeedback {
  impactLevel: 'weak' | 'moderate' | 'strong' | 'exceptional';
  score: number;
  issues: {
    type: 'minimizing' | 'vague' | 'missing-metrics' | 'passive';
    text: string;
    suggestion: string;
    replacement?: string;
  }[];
  strengths: string[];
  suggestions: {
    type: 'add-metrics' | 'be-specific' | 'use-action-verbs' | 'quantify';
    message: string;
    example?: string;
  }[];
}

export default function AISmartWritingCoach({ text, onSuggestionApply, compact = false }: AISmartWritingCoachProps) {
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCoach, setShowCoach] = useState(true);

  useEffect(() => {
    if (!text.trim()) {
      setFeedback(null);
      return;
    }

    // Analyze text in real-time
    const analyzedFeedback = analyzeText(text);
    setFeedback(analyzedFeedback);
  }, [text]);

  const analyzeText = (inputText: string): WritingFeedback => {
    const issues: WritingFeedback['issues'] = [];
    const strengths: string[] = [];
    const suggestions: WritingFeedback['suggestions'] = [];
    let score = 50; // Start at base score

    // Detect minimizing language
    const minimizingWords = ['just', 'only', 'simply', 'maybe', 'perhaps', 'might', 'try', 'kind of', 'sort of', 'a little'];
    minimizingWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(inputText)) {
        issues.push({
          type: 'minimizing',
          text: word,
          suggestion: `Remove "${word}" to sound more confident`,
          replacement: inputText.replace(regex, '')
        });
        score -= 5;
      }
    });

    // Check for metrics/numbers
    const hasNumbers = /\d+/.test(inputText);
    if (hasNumbers) {
      strengths.push('Includes quantifiable results');
      score += 15;
    } else {
      suggestions.push({
        type: 'add-metrics',
        message: 'Add numbers or percentages to quantify your impact',
        example: 'e.g., "reduced processing time by 40%" or "helped 15+ team members"'
      });
      score -= 10;
    }

    // Check for action verbs
    const actionVerbs = ['led', 'created', 'designed', 'implemented', 'launched', 'improved', 'increased', 'reduced', 'developed', 'built', 'achieved', 'delivered', 'managed', 'coordinated'];
    const hasActionVerb = actionVerbs.some(verb => new RegExp(`\\b${verb}\\b`, 'i').test(inputText));
    if (hasActionVerb) {
      strengths.push('Uses strong action verbs');
      score += 10;
    } else {
      suggestions.push({
        type: 'use-action-verbs',
        message: 'Start with a strong action verb',
        example: 'led, created, implemented, improved, delivered'
      });
    }

    // Check for vague language
    const vagueTerms = ['some', 'various', 'several', 'multiple', 'many', 'good', 'nice', 'great', 'helped out'];
    vagueTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(inputText)) {
        issues.push({
          type: 'vague',
          text: term,
          suggestion: `Be specific instead of using "${term}"`,
        });
        score -= 3;
      }
    });

    // Check for passive voice indicators
    const passiveIndicators = ['was done', 'were completed', 'was handled', 'were managed', 'was improved'];
    passiveIndicators.forEach(phrase => {
      if (inputText.toLowerCase().includes(phrase)) {
        issues.push({
          type: 'passive',
          text: phrase,
          suggestion: 'Use active voice to show your direct impact',
        });
        score -= 5;
      }
    });

    // Check length
    if (inputText.length > 100) {
      strengths.push('Good detail level');
      score += 5;
    }

    // Check for outcome/result words
    const outcomeWords = ['result', 'outcome', 'impact', 'success', 'achievement', 'improved', 'increased', 'reduced', 'saved'];
    const hasOutcome = outcomeWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(inputText));
    if (hasOutcome) {
      strengths.push('Describes outcomes and results');
      score += 10;
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine impact level
    let impactLevel: WritingFeedback['impactLevel'];
    if (score >= 80) impactLevel = 'exceptional';
    else if (score >= 60) impactLevel = 'strong';
    else if (score >= 40) impactLevel = 'moderate';
    else impactLevel = 'weak';

    return { impactLevel, score, issues, strengths, suggestions };
  };

  const getImpactColor = (level: WritingFeedback['impactLevel']) => {
    switch (level) {
      case 'exceptional': return 'from-green-500 to-emerald-600';
      case 'strong': return 'theme-gradient-to-r';
      case 'moderate': return 'from-yellow-500 to-orange-500';
      case 'weak': return 'from-red-500 to-pink-500';
    }
  };

  const getImpactIcon = (level: WritingFeedback['impactLevel']) => {
    switch (level) {
      case 'exceptional': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'strong': return <TrendingUp className="h-5 w-5 theme-text-primary" />;
      case 'moderate': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'weak': return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  if (!feedback || !showCoach) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm"
      >
        {getImpactIcon(feedback.impactLevel)}
        <span className="font-medium">Impact Score: {feedback.score}/100</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 theme-text-primary" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Writing Coach</h3>
            <AIBadge compact />
          </div>
          <button
            onClick={() => setShowCoach(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Impact Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Impact Level</span>
            <div className="flex items-center gap-2">
              {getImpactIcon(feedback.impactLevel)}
              <span className="text-sm font-semibold capitalize">{feedback.impactLevel}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${feedback.score}%` }}
              className={`h-full bg-gradient-to-r ${getImpactColor(feedback.impactLevel)}`}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Weak</span>
            <span>Moderate</span>
            <span>Strong</span>
            <span>Exceptional</span>
          </div>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-sm theme-text-primary hover:underline text-left mb-2"
        >
          {isExpanded ? 'Hide' : 'Show'} Details ({feedback.issues.length} issues, {feedback.suggestions.length} suggestions)
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Strengths */}
              {feedback.strengths.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                    ✓ Strengths
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    {feedback.strengths.map((strength, idx) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Issues */}
              {feedback.issues.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    ⚠ Issues to Fix
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
                    {feedback.issues.map((issue, idx) => (
                      <li key={idx}>
                        <span className="font-medium">"{issue.text}"</span> - {issue.suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {feedback.suggestions.length > 0 && (
                <div className="theme-bg-primary-light rounded-lg p-3">
                  <h4 className="text-sm font-semibold theme-text-primary mb-2">
                    💡 Suggestions
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    {feedback.suggestions.map((suggestion, idx) => (
                      <li key={idx}>
                        <div>{suggestion.message}</div>
                        {suggestion.example && (
                          <div className="text-xs italic mt-1 opacity-75">{suggestion.example}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
