'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Trash2,
  Database,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';
import {
  exportDataAsJSON,
  exportJournalAsCSV,
  importDataFromJSON,
  clearAllData,
  getDataStats,
  markBackupCompleted
} from '@/utils/dataManagement';
import {
  getAllBackups,
  restoreFromBackup,
  downloadBackup,
  importBackup,
  getBackupStats,
  type BackupData
} from '@/utils/autoBackup';

interface DataManagementProps {
  onDataImported?: () => void;
  onDataCleared?: () => void;
}

export default function DataManagement({ onDataImported, onDataCleared }: DataManagementProps) {
  const [stats, setStats] = useState(getDataStats());
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);
  const [autoBackups, setAutoBackups] = useState<BackupData[]>([]);
  const [backupStats, setBackupStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load auto-backups
    setAutoBackups(getAllBackups());
    setBackupStats(getBackupStats());
  }, []);

  const handleExportJSON = () => {
    exportDataAsJSON();
    markBackupCompleted();
    setStats(getDataStats());
  };

  const handleExportCSV = () => {
    exportJournalAsCSV();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      const success = await importDataFromJSON(file);
      if (success) {
        setImportStatus('success');
        setStats(getDataStats());
        setTimeout(() => {
          onDataImported?.();
          window.location.reload(); // Reload to show imported data
        }, 1500);
      } else {
        setImportStatus(null);
      }
    } catch (error) {
      setImportStatus('error');
      alert('Failed to import data. Please check the file format and try again.');
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = () => {
    const cleared = clearAllData();
    if (cleared) {
      onDataCleared?.();
      window.location.reload();
    }
  };

  const handleRestoreFromAutoBackup = (backup: BackupData) => {
    if (confirm(`Restore data from ${new Date(backup.timestamp).toLocaleString()}?\n\nThis will replace your current data.`)) {
      restoreFromBackup(backup);
      window.location.reload();
    }
  };

  const handleDownloadAutoBackup = (backup: BackupData) => {
    downloadBackup(backup);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-gradient-to-br from-kintsugi-gold-50 to-white dark:from-kintsugi-dark-800 dark:to-kintsugi-dark-900 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 theme-bg-primary rounded-lg">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white">
              Your Data
            </h3>
            <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
              Backup and manage your information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Journal Entries" value={stats.journalEntries} />
          <StatCard label="Achievements" value={stats.achievements} />
          <StatCard label="Current Streak" value={`${stats.currentStreak} days`} />
          <StatCard label="Member Since" value={stats.memberSince} small />
        </div>

        <div className="mt-4 pt-4 border-t theme-border-light dark:border-kintsugi-dark-700">
          <div className="flex items-center gap-2 text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
            <Info className="h-4 w-4" />
            <span>Last backup: {stats.lastBackup}</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-4 uppercase tracking-wide">
          Export Data
        </h4>

        <div className="space-y-3">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <FileJson className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-kintsugi-dark-900 dark:text-white">
                  Export Complete Backup (JSON)
                </div>
                <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
                  All data including profile, journal, achievements
                </div>
              </div>
            </div>
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 rounded-lg border border-green-200 dark:border-green-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 dark:bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-kintsugi-dark-900 dark:text-white">
                  Export Journal Entries (CSV)
                </div>
                <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
                  Spreadsheet format for analysis
                </div>
              </div>
            </div>
            <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-4 uppercase tracking-wide">
          Import Data
        </h4>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={handleImportClick}
          disabled={importing}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 dark:bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-kintsugi-dark-900 dark:text-white">
                {importing ? 'Importing...' : 'Restore from Backup'}
              </div>
              <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
                Import previously exported JSON file
              </div>
            </div>
          </div>
          {importStatus === 'success' && (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          )}
          {importStatus === 'error' && (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
        </button>

        {importStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <span>Data imported successfully! Reloading...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Auto-Backup History */}
      {autoBackups.length > 0 && (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white uppercase tracking-wide">
              Auto-Backup History
            </h4>
            <span className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
              {autoBackups.length} backup{autoBackups.length !== 1 ? 's' : ''} available
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {autoBackups.map((backup, index) => (
              <div
                key={backup.version}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-kintsugi-dark-900/50 rounded-lg border border-gray-200 dark:border-kintsugi-dark-700 hover:theme-border-accent dark:hover:border-kintsugi-gold-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 theme-text-primary dark:theme-text-secondary" />
                  <div>
                    <div className="text-sm font-medium text-kintsugi-dark-900 dark:text-white">
                      {new Date(backup.timestamp).toLocaleString()}
                    </div>
                    <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
                      {index === 0 ? 'Most recent' : `${index + 1} backup${index === 1 ? '' : 's'} ago`}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadAutoBackup(backup)}
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                    title="Download this backup"
                  >
                    <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleRestoreFromAutoBackup(backup)}
                    className="p-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                    title="Restore from this backup"
                  >
                    <RotateCcw className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-400">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>Auto-backups are created every 5 minutes. Up to 10 backups are kept. Download important backups to keep them permanently.</span>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-900/50">
        <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-4 uppercase tracking-wide">
          Danger Zone
        </h4>

        <button
          onClick={handleClearData}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 dark:bg-red-600 rounded-lg group-hover:scale-110 transition-transform">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-red-900 dark:text-red-300">
                Delete All Data
              </div>
              <div className="text-xs text-red-700 dark:text-red-400">
                Permanently remove all your information
              </div>
            </div>
          </div>
        </button>

        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>This action cannot be undone. Please export your data first as a backup.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, small = false }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="bg-white dark:bg-kintsugi-dark-900/50 rounded-lg p-3">
      <div className={`font-bold theme-text-primary dark:theme-text-secondary ${small ? 'text-sm' : 'text-2xl'}`}>
        {value}
      </div>
      <div className="text-xs text-kintsugi-dark-600 dark:theme-text-secondary mt-1">
        {label}
      </div>
    </div>
  );
}
