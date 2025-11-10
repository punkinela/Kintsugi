'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Copy, CheckCircle, Sparkles, TrendingUp, Users, Lightbulb, Award, MessageSquare, Filter, Check, X } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import PremiumBadge from './PremiumBadge';
import { JournalEntry } from '@/types/engagement';
import {
  entriesToResumeBullets,
  groupBulletsByCategory,
  generateResumeSection,
  exportToPlainText,
  tailorToJobDescription,
  type ResumeBullet
} from '@/utils/resumeFormatter';

interface ResumeGeneratorProps {
  entries: JournalEntry[];
}

const CATEGORY_ICONS = {
  leadership: Users,
  achievement: TrendingUp,
  creation: Lightbulb,
  collaboration: Users,
  analysis: FileText,
  communication: MessageSquare,
};

const CATEGORY_NAMES = {
  leadership: 'Leadership & Management',
  achievement: 'Key Achievements',
  creation: 'Development & Innovation',
  collaboration: 'Collaboration & Teamwork',
  analysis: 'Analysis & Strategy',
  communication: 'Communication & Presentations',
};

export default function ResumeGenerator({ entries }: ResumeGeneratorProps) {
  const { isPremium } = usePremium();
  const [bullets, setBullets] = useState<ResumeBullet[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterByMetrics, setFilterByMetrics] = useState(false);
  const [showJobTailor, setShowJobTailor] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const handleGenerate = () => {
    if (!isPremium) {
      setShowPremiumPrompt(true);
      return;
    }

    const resumeBullets = entriesToResumeBullets(entries);
    setBullets(resumeBullets);
    setHasGenerated(true);
  };

  const toggleBullet = (id: string) => {
    setBullets(prev =>
      prev.map(b => b.id === id ? { ...b, selected: !b.selected } : b)
    );
  };

  const selectAll = () => {
    setBullets(prev => prev.map(b => ({ ...b, selected: true })));
  };

  const deselectAll = () => {
    setBullets(prev => prev.map(b => ({ ...b, selected: false })));
  };

  const handleCopy = async () => {
    const text = generateResumeSection(bullets, {
      includeMetricsOnly: filterByMetrics,
      sortBy: 'date',
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = () => {
    const text = exportToPlainText(bullets);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kintsugi-resume-bullets.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTailor = () => {
    if (!jobDescription.trim()) return;

    const tailored = tailorToJobDescription(bullets, jobDescription, 10);
    const tailoredIds = new Set(tailored.map(b => b.id));

    setBullets(prev =>
      prev.map(b => ({
        ...b,
        selected: tailoredIds.has(b.id),
      }))
    );

    setShowJobTailor(false);
  };

  const filteredBullets = useMemo(() => {
    if (filterByMetrics) {
      return bullets.filter(b => b.metrics && b.metrics.length > 0);
    }
    return bullets;
  }, [bullets, filterByMetrics]);

  const groupedBullets = useMemo(() => {
    return groupBulletsByCategory(filteredBullets);
  }, [filteredBullets]);

  const selectedCount = bullets.filter(b => b.selected).length;
  const totalCount = bullets.length;

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 theme-text-primary" />
            Career-Ready Resume Generator
          </h3>
          {!isPremium && <PremiumBadge size="sm" />}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Transform your documented experiences into professional, ATS-optimized resume bullets
        </p>
      </div>

      {/* Generate Button */}
      {!hasGenerated && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                  Your story, professionally told
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  We'll convert your documented accomplishments into powerful resume bullets using proven formulas:
                  <strong> Action Verb + Task + Result</strong>. Perfect for ATS systems and hiring managers.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={entries.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FileText className="h-5 w-5" />
            Generate Resume Bullets
          </button>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {hasGenerated && bullets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Summary & Actions */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="text-md font-bold text-green-900 dark:text-green-100">
                    {totalCount} Professional Bullets Generated
                  </h4>
                </div>
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                  {selectedCount} selected
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Deselect All
                </button>
                <button
                  onClick={() => setFilterByMetrics(!filterByMetrics)}
                  className={`text-xs px-3 py-1.5 border rounded-md transition-colors flex items-center gap-1 ${
                    filterByMetrics
                      ? 'bg-green-600 dark:bg-green-700 border-green-600 dark:border-green-700 text-white'
                      : 'bg-white dark:bg-gray-800 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  {filterByMetrics ? 'Showing Metrics Only' : 'Show Metrics Only'}
                </button>
                <button
                  onClick={() => setShowJobTailor(!showJobTailor)}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Tailor to Job
                </button>
              </div>
            </div>

            {/* Job Tailor Input */}
            {showJobTailor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
              >
                <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here. We'll select bullets that best match the role..."
                  className="w-full px-3 py-2 text-sm border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleTailor}
                    disabled={!jobDescription.trim()}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Tailor Selection
                  </button>
                  <button
                    onClick={() => setShowJobTailor(false)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Categorized Bullets */}
            <div className="space-y-6">
              {Array.from(groupedBullets.entries()).map(([category, categoryBullets]) => {
                const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Award;
                const categoryName = CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || 'Other';

                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 theme-text-primary" />
                      <h5 className="text-md font-bold text-gray-900 dark:text-white">
                        {categoryName} ({categoryBullets.length})
                      </h5>
                    </div>

                    <div className="space-y-2">
                      {categoryBullets.map((bullet) => (
                        <motion.div
                          key={bullet.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            bullet.selected
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                          }`}
                          onClick={() => toggleBullet(bullet.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              bullet.selected
                                ? 'bg-blue-500 border-blue-500'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            }`}>
                              {bullet.selected && <Check className="h-3 w-3 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                • {bullet.formatted}
                              </p>

                              {bullet.metrics && bullet.metrics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {bullet.metrics.map((metric, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium"
                                    >
                                      {metric}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Original: {bullet.original}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Export Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCopy}
                disabled={selectedCount === 0}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Selected ({selectedCount})
                  </>
                )}
              </button>
              <button
                onClick={handleExport}
                disabled={selectedCount === 0}
                className="flex-1 py-2 px-4 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to File
              </button>
            </div>

            {/* Re-generate */}
            <button
              onClick={handleGenerate}
              className="w-full py-2 px-4 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Re-generate with Latest Experiences
            </button>
          </motion.div>
        )}

        {hasGenerated && bullets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No accomplishments found. Start documenting your achievements to generate resume bullets.
            </p>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Prompt */}
      {showPremiumPrompt && (
        <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
          <div className="flex items-start gap-3">
            <PremiumBadge size="md" />
            <div>
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                Premium Feature
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mb-3">
                Unlock the Resume Generator to transform your experiences into professional, ATS-optimized resume bullets. Save hours of resume writing!
              </p>
              <button
                onClick={() => setShowPremiumPrompt(false)}
                className="text-xs text-amber-700 dark:text-amber-300 font-semibold hover:underline"
              >
                Enable dev mode in Settings → Diagnostic to test this feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
