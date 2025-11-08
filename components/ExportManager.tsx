'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, File, FileSpreadsheet, Printer, Check } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';
import { exportToCSV, exportToMarkdown, exportToPDF, exportToWord } from '@/utils/exportUtils';
import { JournalEntry } from '@/types/engagement';

export default function ExportManager() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const data = getEngagementData();
    setEntries(data.journalEntries || []);
  };

  const handleExport = async (format: 'csv' | 'markdown' | 'pdf' | 'word') => {
    if (entries.length === 0) {
      alert('No journal entries to export. Create some entries first!');
      return;
    }

    setIsExporting(true);

    // Simulate processing time for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      switch (format) {
        case 'csv':
          exportToCSV(entries);
          break;
        case 'markdown':
          exportToMarkdown(entries, { includeMetadata: true, includeStats: true });
          break;
        case 'pdf':
          exportToPDF(entries, 'My Accomplishments Journal');
          break;
        case 'word':
          exportToWord(entries, 'My Accomplishments Journal');
          break;
      }

      setExportedFormat(format);
      setTimeout(() => setExportedFormat(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: 'pdf' as const,
      name: 'PDF Document',
      description: 'Professional format, perfect for printing and sharing',
      icon: <FileText className="h-8 w-8" />,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      format: 'word' as const,
      name: 'Word Document',
      description: 'Editable .rtf format compatible with Word, Google Docs',
      icon: <File className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      format: 'csv' as const,
      name: 'CSV Spreadsheet',
      description: 'Import into Excel, Google Sheets, or any spreadsheet app',
      icon: <FileSpreadsheet className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      format: 'markdown' as const,
      name: 'Markdown File',
      description: 'Plain text format for developers and note-taking apps',
      icon: <FileText className="h-8 w-8" />,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
          <Download className="h-6 w-6 theme-text-primary" />
          Export Your Accomplishments
        </h2>
        <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary mt-1">
          Download your journal entries in your preferred format
        </p>
      </div>

      {/* Stats */}
      <div className="theme-bg-primary-light dark:bg-theme-primary/20 rounded-xl p-4 border theme-border-light dark:theme-border-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
              Ready to export
            </p>
            <p className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          {entries.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
                Date range
              </p>
              <p className="text-sm font-medium text-kintsugi-dark-900 dark:text-white">
                {new Date(entries[entries.length - 1].date).toLocaleDateString()} - {new Date(entries[0].date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions.map((option) => (
          <motion.div
            key={option.format}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${option.bgColor} rounded-xl p-6 border-2 ${option.borderColor} cursor-pointer transition-all`}
            onClick={() => handleExport(option.format)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-br ${option.color} rounded-xl text-white`}>
                {option.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {option.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {option.description}
                </p>

                <button
                  disabled={isExporting || entries.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${option.color} text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {exportedFormat === option.format ? (
                    <>
                      <Check className="h-4 w-4" />
                      Exported!
                    </>
                  ) : isExporting ? (
                    <>
                      <Download className="h-4 w-4 animate-bounce" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export as {option.format.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Print Button */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border theme-border-light dark:border-kintsugi-dark-700">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <Printer className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Quick Print
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Print directly from your browser with our optimized print stylesheet
            </p>

            <button
              onClick={() => window.print()}
              disabled={entries.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="h-4 w-4" />
              Print Current Page
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          💡 Export Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• <strong>PDF:</strong> Best for printing and professional sharing</li>
          <li>• <strong>Word:</strong> Edit and customize before your performance review</li>
          <li>• <strong>CSV:</strong> Analyze your data in spreadsheets</li>
          <li>• <strong>Markdown:</strong> Keep plain text backups or use in note apps</li>
        </ul>
      </div>

      {/* No Entries State */}
      {entries.length === 0 && (
        <div className="theme-bg-primary-light dark:bg-yellow-900/20 rounded-xl p-8 border border-yellow-200 dark:theme-border-primary text-center">
          <FileText className="h-16 w-16 theme-text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
            No Entries to Export
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Start journaling your accomplishments to enable export functionality.
          </p>
        </div>
      )}
    </div>
  );
}
