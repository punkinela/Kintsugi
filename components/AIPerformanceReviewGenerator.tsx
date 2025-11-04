'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Copy, Check, Calendar, Filter, Sparkles } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';
import { generatePerformanceReview, type PerformanceReviewSection } from '@/utils/aiHelpers';
import { JournalEntry } from '@/types/engagement';

export default function AIPerformanceReviewGenerator() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year' | 'custom'>('quarter');
  const [customDays, setCustomDays] = useState(90);
  const [isGenerating, setIsGenerating] = useState(false);
  const [review, setReview] = useState<{ summary: string; sections: PerformanceReviewSection[] } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const data = getEngagementData();
    setEntries(data.journalEntries || []);
  };

  const getFilteredEntries = (): JournalEntry[] => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'year':
        cutoffDate.setDate(now.getDate() - 365);
        break;
      case 'custom':
        cutoffDate.setDate(now.getDate() - customDays);
        break;
    }

    return entries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const filteredEntries = getFilteredEntries();
      const timeframeText = timeframe === 'custom' ? `the past ${customDays} days` : `this ${timeframe}`;
      const generated = generatePerformanceReview(filteredEntries, timeframeText);

      setReview(generated);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    if (!review) return;

    let text = `PERFORMANCE REVIEW - ${timeframe.toUpperCase()}\n\n`;
    text += `SUMMARY\n${review.summary}\n\n`;

    review.sections.forEach(section => {
      text += `${section.title.toUpperCase()}\n`;
      text += `${section.content}\n\n`;
      section.bullets.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!review) return;

    let text = `PERFORMANCE REVIEW - ${timeframe.toUpperCase()}\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    text += `${'='.repeat(60)}\n\n`;
    text += `SUMMARY\n${review.summary}\n\n`;

    review.sections.forEach(section => {
      text += `${'='.repeat(60)}\n\n`;
      text += `${section.title.toUpperCase()}\n\n`;
      text += `${section.content}\n\n`;
      text += `Key Accomplishments:\n`;
      section.bullets.forEach(bullet => {
        text += `  • ${bullet}\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-review-${timeframe}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          AI Performance Review Generator
        </h2>
        <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-1">
          Transform your journal entries into professional performance review content
        </p>
      </div>

      {/* Timeframe Selection */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-kintsugi-gold-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Select Timeframe</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {(['week', 'month', 'quarter', 'year', 'custom'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-kintsugi-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {timeframe === 'custom' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Days:</label>
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
              min="1"
              max="365"
              className="px-3 py-1 w-24 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-kintsugi-dark-700 text-gray-900 dark:text-white"
            />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="h-4 w-4" />
          <span>{filteredEntries.length} entries found for selected timeframe</span>
        </div>
      </div>

      {/* Generate Button */}
      {!review && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || filteredEntries.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating Review...' : 'Generate Performance Review'}
        </motion.button>
      )}

      {/* Review Output */}
      {review && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download as Text
            </button>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {review.summary}
            </p>
          </div>

          {/* Sections */}
          {review.sections.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {section.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {section.content}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  Key Accomplishments:
                </h4>
                <ul className="space-y-2">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Generate Again */}
          <button
            onClick={() => setReview(null)}
            className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Generate with Different Timeframe
          </button>
        </motion.div>
      )}

      {/* No Entries Warning */}
      {filteredEntries.length === 0 && !isGenerating && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 text-center">
          <Calendar className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            No Entries Found
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Log some accomplishments in the selected timeframe to generate a review.
          </p>
        </div>
      )}
    </div>
  );
}
