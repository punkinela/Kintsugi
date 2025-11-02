'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, Lightbulb, X } from 'lucide-react';
import {
  detectAccomplishmentSize,
  detectDismissiveLanguage,
  getEncouragement,
  getExamplesBySize,
  accomplishmentExamples,
} from '@/data/accomplishmentExamples';
import { validateAccomplishment } from '@/utils/accomplishmentValidator';

interface AccomplishmentHelperProps {
  text: string;
  onTextChange?: (text: string) => void;
  showHelper?: boolean;
}

export default function AccomplishmentHelper({ text, onTextChange, showHelper = true }: AccomplishmentHelperProps) {
  const [size, setSize] = useState<'micro' | 'small' | 'medium' | 'major'>('micro');
  const [encouragement, setEncouragement] = useState<{ text: string; emoji: string } | null>(null);
  const [dismissiveWarning, setDismissiveWarning] = useState<{ message: string; emoji: string } | null>(null);
  const [validationWarning, setValidationWarning] = useState<{ message: string; emoji: string; suggestion?: string } | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    if (text.length > 10) {
      // First validate if it's an actionable accomplishment
      const validation = validateAccomplishment(text);
      
      if (!validation.isValid) {
        setValidationWarning({
          message: validation.message!,
          emoji: validation.emoji!,
          suggestion: validation.suggestion
        });
        setEncouragement(null);
        setDismissiveWarning(null);
        return;
      } else {
        setValidationWarning(null);
      }
      
      // Then check for size and dismissive language
      const detectedSize = detectAccomplishmentSize(text);
      setSize(detectedSize);
      setEncouragement(getEncouragement(detectedSize));
      
      const dismissive = detectDismissiveLanguage(text);
      if (dismissive.isDismissive) {
        setDismissiveWarning({ message: dismissive.message!, emoji: dismissive.emoji! });
      } else {
        setDismissiveWarning(null);
      }
    } else {
      setEncouragement(null);
      setDismissiveWarning(null);
      setValidationWarning(null);
    }
  }, [text]);

  if (!showHelper) return null;

  const sizeEmojis = {
    micro: '🌱',
    small: '⭐',
    medium: '🚀',
    major: '🏆',
  };

  const sizeLabels = {
    micro: 'Micro Win',
    small: 'Small Win',
    medium: 'Medium Win',
    major: 'Major Win',
  };

  const sizeColors = {
    micro: 'from-green-400 to-emerald-500',
    small: 'from-blue-400 to-indigo-500',
    medium: 'from-purple-400 to-pink-500',
    major: 'from-yellow-400 to-orange-500',
  };

  return (
    <div className="space-y-3">
      {/* Validation Warning (Physical Attributes, Privilege, etc.) */}
      <AnimatePresence>
        {validationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-400 dark:border-orange-600 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{validationWarning.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <h4 className="font-bold text-orange-800 dark:text-orange-300">
                    Focus on Actions, Not Attributes
                  </h4>
                </div>
                <p className="text-orange-700 dark:text-orange-400 text-sm mb-2">
                  {validationWarning.message}
                </p>
                {validationWarning.suggestion && (
                  <p className="text-orange-600 dark:text-orange-300 text-sm font-medium">
                    💡 {validationWarning.suggestion}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dismissive Language Warning */}
      <AnimatePresence>
        {dismissiveWarning && !validationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{dismissiveWarning.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h4 className="font-bold text-red-800 dark:text-red-300">
                    Don't Minimize Your Success!
                  </h4>
                </div>
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {dismissiveWarning.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accomplishment Size & Encouragement */}
      <AnimatePresence>
        {encouragement && !dismissiveWarning && !validationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`bg-gradient-to-r ${sizeColors[size]} rounded-xl p-4 text-white shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">{sizeEmojis[size]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="font-bold">
                    {sizeLabels[size]} Detected!
                  </h4>
                </div>
                <p className="text-sm opacity-90">
                  {encouragement.text}
                </p>
              </div>
              <div className="text-3xl">{encouragement.emoji}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Need Ideas?" Button */}
      {text.length < 5 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowExamples(!showExamples)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-indigo-800 dark:text-indigo-300">
            {showExamples ? 'Hide Examples' : 'Need Ideas? See Examples'}
          </span>
        </motion.button>
      )}

      {/* Examples Grid */}
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  All Accomplishments Count!
                </h4>
                <button
                  onClick={() => setShowExamples(false)}
                  className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Micro Accomplishments */}
                <div>
                  <h5 className="font-semibold text-sm text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                    🌱 Micro Wins (These Count Too!)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {accomplishmentExamples.micro.slice(0, 6).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onTextChange) {
                            onTextChange(example.text);
                          }
                          setShowExamples(false);
                        }}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left border border-green-200 dark:border-green-800"
                      >
                        <span className="text-xl">{example.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{example.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Small Accomplishments */}
                <div>
                  <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    ⭐ Small Wins (Daily Victories!)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {accomplishmentExamples.small.slice(0, 6).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onTextChange) {
                            onTextChange(example.text);
                          }
                          setShowExamples(false);
                        }}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left border border-blue-200 dark:border-blue-800"
                      >
                        <span className="text-xl">{example.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{example.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medium Accomplishments */}
                <div>
                  <h5 className="font-semibold text-sm text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                    🚀 Medium Wins (Significant Progress!)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {accomplishmentExamples.medium.slice(0, 4).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onTextChange) {
                            onTextChange(example.text);
                          }
                          setShowExamples(false);
                        }}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left border border-purple-200 dark:border-purple-800"
                      >
                        <span className="text-xl">{example.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{example.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Major Accomplishments */}
                <div>
                  <h5 className="font-semibold text-sm text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                    🏆 Major Wins (Remarkable Achievements!)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {accomplishmentExamples.major.slice(0, 4).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onTextChange) {
                            onTextChange(example.text);
                          }
                          setShowExamples(false);
                        }}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left border border-orange-200 dark:border-orange-800"
                      >
                        <span className="text-xl">{example.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{example.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reminder */}
              <div className="mt-4 p-3 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg border border-pink-300 dark:border-pink-700">
                <p className="text-sm text-center text-purple-800 dark:text-purple-300 font-medium">
                  💜 Remember: ALL accomplishments deserve recognition! 💜
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Guide (always visible when typing) */}
      {text.length > 5 && (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>🌱</span>
            <span>Micro</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>Small</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚀</span>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏆</span>
            <span>Major</span>
          </div>
        </div>
      )}
    </div>
  );
}
