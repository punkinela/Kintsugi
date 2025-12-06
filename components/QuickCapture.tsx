'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Check } from 'lucide-react';
import { getEngagementData, saveEngagementData, updateStreakFromEntries } from '@/utils/engagement';
import { awardXP, incrementStat } from '@/utils/gamification';
import { JournalEntry } from '@/types/engagement';

interface QuickCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function QuickCapture({ isOpen, onClose, onSaved }: QuickCaptureProps) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const handleQuickSave = () => {
    if (!text.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      accomplishment: text,
      category: 'Quick Capture',
    };

    const data = getEngagementData();
    data.journalEntries.unshift(entry);
    saveEngagementData(data);

    // Update streak based on all impact entries
    updateStreakFromEntries();

    // Award XP for impact entry
    const xpResult = awardXP('journal');

    // Update gamification stats
    incrementStat('totalJournalEntries', 1);

    // Trigger data update events for other components
    window.dispatchEvent(new Event('kintsugi-data-updated'));
    window.dispatchEvent(new Event('gamification-update'));

    // Dispatch level-up event if leveled up (triggers philosophy celebration)
    if (xpResult.leveledUp && xpResult.newLevel) {
      window.dispatchEvent(new CustomEvent('kintsugi-level-up', {
        detail: { newLevel: xpResult.newLevel, oldLevel: xpResult.oldLevel }
      }));
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setText('');
      onSaved();
      onClose();
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleQuickSave();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl"
          >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br theme-gradient-to-r rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Quick Capture
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Capture your win or a moment of growth!
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {saved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Saved! 🎉
                </p>
              </motion.div>
            ) : (
              <>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="What did you accomplish? (e.g., 'Completed the project presentation')"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  autoFocus
                />
                
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleQuickSave}
                    disabled={!text.trim()}
                    className="flex-1 bg-gradient-to-r theme-gradient-to-r text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Quick Save
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Tip: Press Cmd/Ctrl + Enter to save quickly
                </p>
              </>
            )}
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
