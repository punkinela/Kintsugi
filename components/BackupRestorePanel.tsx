'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Download, Upload, AlertTriangle, CheckCircle2,
  Clock, Database, Calendar, Info, RefreshCw, X
} from 'lucide-react';
import {
  downloadBackup,
  restoreFromFile,
  getBackupSummary,
  exportAllData
} from '@/utils/backup';

interface BackupRestorePanelProps {
  onClose?: () => void;
}

export default function BackupRestorePanel({ onClose }: BackupRestorePanelProps) {
  const [backupSummary, setBackupSummary] = useState(getBackupSummary());
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    downloadBackup();
    setBackupSummary(getBackupSummary());
    setRestoreStatus({
      type: 'success',
      message: 'Backup downloaded successfully!'
    });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setRestoreStatus({ type: null, message: '' });
    }, 3000);
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreStatus({ type: null, message: '' });

    try {
      const result = await restoreFromFile(file);

      if (result.success) {
        setRestoreStatus({
          type: 'success',
          message: `${result.message}. Please refresh the page to see your restored data.`
        });
        setBackupSummary(getBackupSummary());

        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setRestoreStatus({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setRestoreStatus({
        type: 'error',
        message: 'An unexpected error occurred while restoring data.'
      });
    } finally {
      setIsRestoring(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const { lastBackup, daysSinceBackup, totalDataItems, estimatedSize } = backupSummary;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Data Backup & Restore</h2>
              <p className="text-blue-100 text-sm mt-1">Protect your journey, one backup at a time</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Status Message */}
          <AnimatePresence>
            {restoreStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                  restoreStatus.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                }`}
              >
                {restoreStatus.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-sm ${
                  restoreStatus.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {restoreStatus.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 theme-text-primary" />
              Current Data Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4 border theme-border-light">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                  <Calendar className="h-3 w-3" />
                  Last Backup
                </div>
                <div className="text-gray-900 dark:text-white font-bold">
                  {lastBackup
                    ? new Date(lastBackup).toLocaleDateString()
                    : 'Never'}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4 border theme-border-light">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                  <Clock className="h-3 w-3" />
                  Days Since
                </div>
                <div className="text-gray-900 dark:text-white font-bold">
                  {daysSinceBackup !== null ? `${daysSinceBackup} days` : 'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4 border theme-border-light">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                  <Database className="h-3 w-3" />
                  Data Items
                </div>
                <div className="text-gray-900 dark:text-white font-bold">
                  {totalDataItems}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4 border theme-border-light">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
                  <Info className="h-3 w-3" />
                  Size
                </div>
                <div className="text-gray-900 dark:text-white font-bold">
                  {estimatedSize}
                </div>
              </div>
            </div>
          </div>

          {/* Backup Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 theme-text-primary" />
              Create Backup
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Download all your data including journal entries, achievements, XP progress, and settings.
                Keep this file safe - you can use it to restore your data anytime.
              </p>
              <button
                onClick={handleBackup}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Download className="h-5 w-5" />
                Download Backup File
              </button>
            </div>
          </div>

          {/* Restore Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Upload className="h-5 w-5 theme-text-primary" />
              Restore from Backup
            </h3>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-2 border-amber-200 dark:border-amber-700">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold mb-1">⚠️ Important:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>This will overwrite your current data</li>
                    <li>Only use backup files created by this app</li>
                    <li>The page will refresh after restore</li>
                  </ul>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={handleRestoreClick}
                disabled={isRestoring}
                className="w-full bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload Backup File
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4 border theme-border-light">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Best Practices:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Back up your data weekly or after important entries</li>
                  <li>Store backup files in a safe location (cloud storage, external drive)</li>
                  <li>Keep multiple backups from different dates</li>
                  <li>Test restore occasionally to ensure backups work</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
