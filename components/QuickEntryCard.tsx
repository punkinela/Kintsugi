'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import AISmartWritingCoach from '@/components/AISmartWritingCoach';

interface QuickEntryCardProps {
  onSave: (text: string) => void;
}

export default function QuickEntryCard({ onSave }: QuickEntryCardProps) {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const quickPrompts = [
    "Today's biggest win:",
    "I'm proud of:",
    "One thing I learned:",
    "I feel grateful for:",
    "A challenge I overcame:",
  ];

  const handleQuickSave = async () => {
    if (!text.trim()) return;

    setIsSaving(true);

    // Celebrate immediately (Fogg Behavior Model: immediate reinforcement)
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    // Save the entry
    await onSave(text);

    // Show success message
    setShowSuccess(true);
    setText('');
    setIsSaving(false);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const estimatedTime = Math.ceil(text.length / 200 * 60); // ~200 chars per minute

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="theme-bg-primary-light rounded-2xl shadow-lg border-2 theme-border-primary p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 theme-gradient-to-r rounded-xl shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Quick Entry
              <span className="text-xs font-normal text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full">
                30 seconds
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Capture your thoughts lightning-fast
            </p>
          </div>
        </div>

        {/* Time Indicator */}
        {text.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400"
          >
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}s</span>
          </motion.div>
        )}
      </div>

      {/* Quick Prompt Buttons */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Start with a prompt:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setText(prompt + ' ')}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's one win from today? (Keep it short and sweet!)"
          className="w-full h-24 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          maxLength={280}
        />

        {/* Character Counter */}
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {text.length}/280
        </div>
      </div>

      {/* AI Writing Coach */}
      {text.trim().length > 10 && (
        <div className="mt-4">
          <AISmartWritingCoach text={text} compact={false} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuickSave}
          disabled={!text.trim() || isSaving}
          className={`flex-1 px-6 py-3 theme-btn-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            isSaving ? 'animate-pulse' : ''
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Save Quick Entry
            </>
          )}
        </motion.button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            Perfect! Your quick entry is saved. You're building momentum! 🎉
          </span>
        </motion.div>
      )}

      {/* Encouraging Message */}
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-lg">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <strong className="text-purple-700 dark:text-purple-400">💡 Tiny Habits Research:</strong> Even 30-second entries help build consistent Impact Loging habits. Short is better than skipping!
        </p>
      </div>
    </motion.div>
  );
}
