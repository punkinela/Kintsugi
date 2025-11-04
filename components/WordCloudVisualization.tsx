'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, RefreshCw, Download } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';
import { extractWords, WordFrequency } from '@/utils/advancedAnalytics';

export default function WordCloudVisualization() {
  const [words, setWords] = useState<WordFrequency[]>([]);
  const [minCount, setMinCount] = useState(2);

  useEffect(() => {
    loadWords();
  }, [minCount]);

  const loadWords = () => {
    const engagement = getEngagementData();
    const extracted = extractWords(engagement.journalEntries);
    setWords(extracted.filter(w => w.count >= minCount));
  };

  const maxCount = words.length > 0 ? Math.max(...words.map(w => w.count)) : 1;

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300';
      case 'negative':
        return 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300';
      default:
        return 'text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-300';
    }
  };

  const getSentimentBg = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20';
    }
  };

  const getFontSize = (count: number) => {
    const normalized = count / maxCount;
    const minSize = 0.75;
    const maxSize = 3;
    return minSize + (normalized * (maxSize - minSize));
  };

  const exportWordList = () => {
    const csv = [
      ['Word', 'Count', 'Sentiment'].join(','),
      ...words.map(w => [w.word, w.count, w.sentiment || 'neutral'].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `word-frequency-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
            <Cloud className="h-6 w-6 text-kintsugi-gold-600" />
            Word Cloud
          </h2>
          <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-1">
            Most frequently used words in your journal
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadWords}
            className="p-2 bg-white dark:bg-kintsugi-dark-800 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700 rounded-lg hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-dark-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5 text-kintsugi-gold-600" />
          </button>
          <button
            onClick={exportWordList}
            className="p-2 bg-white dark:bg-kintsugi-dark-800 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700 rounded-lg hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-dark-700 transition-colors"
            title="Export as CSV"
          >
            <Download className="h-5 w-5 text-kintsugi-gold-600" />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <label className="block text-sm font-medium text-kintsugi-dark-700 dark:text-kintsugi-gold-300 mb-2">
          Minimum word frequency: {minCount}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={minCount}
          onChange={(e) => setMinCount(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Word Cloud */}
      {words.length > 0 ? (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-8 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700 min-h-[400px] flex flex-wrap items-center justify-center gap-3 content-center">
          {words.map((word, index) => (
            <motion.div
              key={word.word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`inline-flex items-center px-3 py-1 rounded-lg ${getSentimentBg(word.sentiment)} cursor-default transition-all hover:scale-110`}
              title={`${word.word}: ${word.count} times (${word.sentiment})`}
              style={{
                fontSize: `${getFontSize(word.count)}rem`
              }}
            >
              <span className={`font-bold ${getSentimentColor(word.sentiment)}`}>
                {word.word}
              </span>
              <span className="ml-2 text-xs opacity-75">
                {word.count}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-12 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700 text-center">
          <Cloud className="h-12 w-12 mx-auto text-kintsugi-gold-400 mb-3" />
          <p className="text-kintsugi-dark-600 dark:text-kintsugi-gold-400">
            Not enough data to generate word cloud. Keep journaling!
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <h3 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-3">
          Sentiment Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 rounded"></div>
            <span className="text-sm text-kintsugi-gold-600 dark:text-kintsugi-gold-400 font-medium">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 rounded"></div>
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">Negative</span>
          </div>
        </div>
        <p className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-3">
          Word size indicates frequency. Hover over words to see details.
        </p>
      </div>

      {/* Top Words Table */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <h3 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-3">
          Top 10 Words
        </h3>
        <div className="space-y-2">
          {words.slice(0, 10).map((word, index) => (
            <div key={word.word} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-kintsugi-dark-500 dark:text-kintsugi-gold-500 w-6">
                  #{index + 1}
                </span>
                <span className={`font-medium ${getSentimentColor(word.sentiment)}`}>
                  {word.word}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${getSentimentBg(word.sentiment)}`}>
                  {word.sentiment}
                </span>
                <span className="text-sm font-bold text-kintsugi-dark-900 dark:text-white">
                  {word.count}x
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
