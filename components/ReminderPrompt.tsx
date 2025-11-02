'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock } from 'lucide-react';
import { getEngagementData, saveEngagementData } from '@/utils/engagement';

interface ReminderPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReminderPrompt({ isOpen, onClose }: ReminderPromptProps) {
  const [reminderTime, setReminderTime] = useState('09:00');
  const [enabled, setEnabled] = useState(() => {
    return getEngagementData().reminderEnabled;
  });

  const handleSave = () => {
    const data = getEngagementData();
    data.reminderEnabled = enabled;
    data.reminderTime = reminderTime;
    saveEngagementData(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-3xl shadow-2xl p-8 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-kintsugi-gold-100/50 dark:hover:bg-kintsugi-gold-900/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kintsugi-gold-600 to-kintsugi-gold-800 rounded-full mb-4">
              <Bell className="w-6 h-6 text-kintsugi-gold-50" />
            </div>
            <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-2">
              Daily Reminder
            </h2>
            <p className="text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80">
              Get a gentle reminder to celebrate your remarkability
            </p>
          </div>

          <div className="space-y-6">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-4 bg-kintsugi-gold-50/50 dark:bg-kintsugi-gold-900/10 rounded-xl border border-kintsugi-gold-100 dark:border-kintsugi-gold-800/30">
              <div>
                <p className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">Enable Reminders</p>
                <p className="text-sm text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/70">Get notified daily</p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  enabled ? 'bg-kintsugi-gold-600' : 'bg-kintsugi-gold-200 dark:bg-kintsugi-gold-800/50'
                }`}
              >
                <motion.div
                  animate={{ x: enabled ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-kintsugi-surface dark:bg-kintsugi-gold-100 rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Time Picker */}
            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                  Reminder Time
                </label>
                <div className="flex items-center gap-3 p-4 bg-kintsugi-gold-50/50 dark:bg-kintsugi-gold-900/10 rounded-xl border border-kintsugi-gold-100 dark:border-kintsugi-gold-800/30">
                  <Clock className="w-5 h-5 text-kintsugi-gold-600/80 dark:text-kintsugi-gold-400/80" />
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="flex-1 bg-transparent text-kintsugi-dark-900 dark:text-kintsugi-gold-100 font-medium focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Info Box */}
            <div className="bg-kintsugi-gold-50/50 dark:bg-kintsugi-gold-900/10 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/30 rounded-xl p-4">
              <p className="text-sm text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80">
                <strong>Research shows:</strong> Daily engagement with positive affirmations increases 
                self-efficacy and reduces imposter syndrome. Consistent practice leads to lasting change.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 text-kintsugi-gold-50 font-semibold hover:from-kintsugi-gold-700 hover:to-kintsugi-gold-900 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
