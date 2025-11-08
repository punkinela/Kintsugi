'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Download, X, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { shouldRecommendBackup, getBackupSummary, downloadBackup } from '@/utils/backup';

export default function AutoBackupReminder() {
  const [showReminder, setShowReminder] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [backupSummary, setBackupSummary] = useState(getBackupSummary());

  useEffect(() => {
    // Check if we should show the backup reminder
    const checkBackup = () => {
      const shouldShow = shouldRecommendBackup();
      const dismissedRecently = localStorage.getItem('backupReminderDismissed');

      if (dismissedRecently) {
        const dismissedDate = new Date(dismissedRecently);
        const daysSinceDismissed = Math.floor(
          (new Date().getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Don't show if dismissed within last 3 days
        if (daysSinceDismissed < 3) {
          setShowReminder(false);
          return;
        }
      }

      setShowReminder(shouldShow);
      setBackupSummary(getBackupSummary());
    };

    // Check on mount
    checkBackup();

    // Check daily
    const interval = setInterval(checkBackup, 1000 * 60 * 60 * 24); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const handleBackupNow = () => {
    downloadBackup();
    setShowReminder(false);
    setDismissed(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('backupReminderDismissed', new Date().toISOString());
    setShowReminder(false);
    setDismissed(true);
  };

  if (!showReminder || dismissed) return null;

  const { lastBackup, daysSinceBackup, totalDataItems } = backupSummary;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl shadow-2xl border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Backup Reminder</h3>
                  <p className="text-amber-100 text-xs">Protect your data</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Warning Message */}
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {daysSinceBackup === null
                    ? "You haven't backed up your data yet!"
                    : `It's been ${daysSinceBackup} days since your last backup`}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Your journal entries, achievements, and progress could be lost if you clear your browser data.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                  <Calendar className="h-3 w-3" />
                  Last Backup
                </div>
                <div className="text-gray-900 dark:text-white font-bold text-sm">
                  {lastBackup
                    ? new Date(lastBackup).toLocaleDateString()
                    : 'Never'}
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Data Items
                </div>
                <div className="text-gray-900 dark:text-white font-bold text-sm">
                  {totalDataItems} items
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleBackupNow}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Download className="h-4 w-4" />
                Backup Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Remind Later
              </button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Backup file will be downloaded to your computer. Keep it safe!
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
