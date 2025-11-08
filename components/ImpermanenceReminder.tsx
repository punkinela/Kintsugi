'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface PastChallenge {
  entry: JournalEntry;
  daysAgo: number;
  status: 'resolved' | 'ongoing' | 'unknown';
}

interface ImpermanenceReminderProps {
  entries: JournalEntry[];
  currentChallenge?: string;
}

export default function ImpermanenceReminder({ entries, currentChallenge }: ImpermanenceReminderProps) {
  const [pastChallenges, setPastChallenges] = useState<PastChallenge[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    analyzePastChallenges();
  }, [entries, selectedTimeframe]);

  const analyzePastChallenges = () => {
    const now = new Date();
    const challenges: PastChallenge[] = [];

    // Keywords that suggest challenges/struggles
    const challengeKeywords = [
      'difficult', 'struggle', 'challenge', 'hard', 'tough', 'stressful',
      'worried', 'anxious', 'frustrated', 'overwhelmed', 'failed', 'mistake',
      'problem', 'issue', 'conflict', 'disagreement'
    ];

    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const daysAgo = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      // Filter by timeframe
      let include = false;
      if (selectedTimeframe === 'week' && daysAgo >= 7 && daysAgo <= 30) include = true;
      if (selectedTimeframe === 'month' && daysAgo >= 30 && daysAgo <= 90) include = true;
      if (selectedTimeframe === 'year' && daysAgo >= 365 && daysAgo <= 730) include = true;

      if (!include) return;

      const entryText = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
      const isChallenge = challengeKeywords.some(keyword => entryText.includes(keyword));

      if (isChallenge) {
        challenges.push({
          entry,
          daysAgo,
          status: entry.reflection ? 'resolved' : 'unknown'
        });
      }
    });

    // Sort by most recent
    challenges.sort((a, b) => a.daysAgo - b.daysAgo);

    setPastChallenges(challenges.slice(0, 5)); // Limit to 5 most relevant
  };

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case 'week': return '1 Week Ago';
      case 'month': return '1 Month Ago';
      case 'year': return '1 Year Ago';
    }
  };

  const getRelativeTime = (daysAgo: number) => {
    if (daysAgo < 30) return `${daysAgo} days ago`;
    if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;
    return `${Math.floor(daysAgo / 365)} year${Math.floor(daysAgo / 365) > 1 ? 's' : ''} ago`;
  };

  if (pastChallenges.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Impermanence Reminder
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Challenges you've already overcome
              </p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {timeframe === 'week' ? '1 Week' : timeframe === 'month' ? '1 Month' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Challenge Context */}
      {currentChallenge && (
        <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Current challenge:</span> {currentChallenge}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Remember: This too shall pass. Here are challenges you've already overcome...
          </p>
        </div>
      )}

      {/* Past Challenges */}
      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {pastChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {challenge.status === 'resolved' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                      {getRelativeTime(challenge.daysAgo)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {challenge.entry.accomplishment}
                  </p>

                  {challenge.entry.reflection && (
                    <div className="mt-2 pl-3 border-l-2 border-green-500">
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        Resolution: {challenge.entry.reflection}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      />
                    </div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      Overcome
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">物の哀れ Mono no Aware:</span> "Awareness of
          impermanence" - Both struggles and successes are temporary. The challenges that felt
          overwhelming {getTimeframeLabel().toLowerCase()} have already passed. This too shall pass.
        </p>
      </div>
    </div>
  );
}
