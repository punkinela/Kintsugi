'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, AlertCircle, Lightbulb } from 'lucide-react';

interface MushinReflectionModeProps {
  text: string;
  onTextChange?: (text: string) => void;
  isActive?: boolean;
}

interface LanguageSuggestion {
  original: string;
  suggested: string;
  reason: string;
  position: number;
}

// Mushin (無心) - "No Mind" or acceptance without judgment
// Detects self-critical language patterns and suggests neutral alternatives
export default function MushinReflectionMode({
  text,
  onTextChange,
  isActive = false
}: MushinReflectionModeProps) {
  const [suggestions, setSuggestions] = useState<LanguageSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Patterns of self-critical language and neutral alternatives
  const criticalPatterns = [
    {
      pattern: /\b(I failed|I'm a failure|I messed up)\b/gi,
      suggest: 'This didn\'t go as planned',
      reason: 'Observe the outcome without self-judgment'
    },
    {
      pattern: /\b(I'm terrible at|I'm bad at|I suck at)\b/gi,
      suggest: 'I\'m learning about',
      reason: 'Frame as growth opportunity'
    },
    {
      pattern: /\b(I should have|I should've)\b/gi,
      suggest: 'Next time I could',
      reason: 'Look forward instead of dwelling on the past'
    },
    {
      pattern: /\b(I'm so stupid|I'm an idiot|I'm dumb)\b/gi,
      suggest: 'I made a choice that',
      reason: 'Separate action from identity'
    },
    {
      pattern: /\b(I always|I never)\b/gi,
      suggest: 'Sometimes I',
      reason: 'Avoid absolute thinking'
    },
    {
      pattern: /\b(I can't|I'll never)\b/gi,
      suggest: 'I haven\'t yet',
      reason: 'Keep possibility open'
    },
    {
      pattern: /\b(I'm worthless|I'm useless)\b/gi,
      suggest: 'I\'m experiencing a challenge',
      reason: 'Name the feeling, not your identity'
    },
    {
      pattern: /\b(everyone else|everyone)\b/gi,
      suggest: 'some people',
      reason: 'Avoid comparison thinking'
    },
    {
      pattern: /\b(it was my fault|I ruined)\b/gi,
      suggest: 'I contributed to',
      reason: 'Share responsibility appropriately'
    },
    {
      pattern: /\b(I hate myself|I hate that I)\b/gi,
      suggest: 'I notice that I',
      reason: 'Observe without harsh judgment'
    }
  ];

  // Analyze text for critical language patterns
  useEffect(() => {
    if (!isActive || !text) {
      setSuggestions([]);
      return;
    }

    const foundSuggestions: LanguageSuggestion[] = [];

    criticalPatterns.forEach(({ pattern, suggest, reason }) => {
      const matches = text.matchAll(pattern);

      for (const match of matches) {
        if (match.index !== undefined) {
          foundSuggestions.push({
            original: match[0],
            suggested: suggest,
            reason: reason,
            position: match.index
          });
        }
      }
    });

    // Sort by position in text
    foundSuggestions.sort((a, b) => a.position - b.position);

    // Limit to 3 most important suggestions
    setSuggestions(foundSuggestions.slice(0, 3));
  }, [text, isActive]);

  // Apply a suggestion
  const applySuggestion = (suggestion: LanguageSuggestion) => {
    if (!onTextChange) return;

    const newText = text.replace(
      new RegExp(suggestion.original, 'gi'),
      suggestion.suggested
    );
    onTextChange(newText);
  };

  if (!isActive || suggestions.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 space-y-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Mushin Mode: Non-Judgmental Observation
              </h4>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Hide
            </button>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        Instead of{' '}
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          "{suggestion.original}"
                        </span>
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        Try:{' '}
                        <span className="font-semibold text-green-700 dark:text-green-300">
                          "{suggestion.suggested}"
                        </span>
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        {suggestion.reason}
                      </p>
                    </div>

                    {onTextChange && (
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                      >
                        Apply Suggestion
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Philosophy Note */}
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-semibold">無心 Mushin:</span> "No mind" -
              observing experiences without attaching harsh judgment. This practice
              helps you document challenges with compassion and clarity.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
