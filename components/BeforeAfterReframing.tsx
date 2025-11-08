'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface ReframePair {
  id: string;
  beforeEntry: JournalEntry;
  afterEntry: JournalEntry;
  transformationNote: string;
}

interface BeforeAfterReframingProps {
  entries: JournalEntry[];
}

export default function BeforeAfterReframing({ entries }: BeforeAfterReframingProps) {
  const [reframePairs, setReframePairs] = useState<ReframePair[]>([]);
  const [selectedBefore, setSelectedBefore] = useState<JournalEntry | null>(null);
  const [isCreatingPair, setIsCreatingPair] = useState(false);

  // Identify potential "before" entries (challenges/raw reactions)
  const potentialBeforeEntries = entries.filter(entry => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
    const hasChallenge = ['difficult', 'struggle', 'challenge', 'failed', 'worried', 'stressful'].some(
      word => text.includes(word)
    );
    return hasChallenge && entry.tags?.includes('raw-reaction');
  });

  // Create a new reframe pair
  const createReframePair = (before: JournalEntry, after: JournalEntry, note: string) => {
    const newPair: ReframePair = {
      id: `${before.id}-${after.id}-${Date.now()}`,
      beforeEntry: before,
      afterEntry: after,
      transformationNote: note
    };

    setReframePairs([...reframePairs, newPair]);
    setIsCreatingPair(false);
    setSelectedBefore(null);
  };

  if (entries.length < 2) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Before/After Reframing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                From raw reaction to processed reflection
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingPair(!isCreatingPair)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            {isCreatingPair ? 'Cancel' : 'Create Pair'}
          </button>
        </div>
      </div>

      {/* Reframe Pairs Display */}
      <div className="p-6 space-y-6 max-h-[700px] overflow-y-auto">
        {reframePairs.length === 0 && !isCreatingPair ? (
          <div className="text-center py-12">
            <ArrowRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              No reframe pairs yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Create pairs to show your transformation journey
            </p>
          </div>
        ) : (
          reframePairs.map((pair, index) => (
            <motion.div
              key={pair.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-purple-200 dark:border-purple-800 rounded-xl overflow-hidden"
            >
              {/* Transformation Note Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm font-semibold">{pair.transformationNote}</p>
                </div>
              </div>

              {/* Split View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Before (Raw Reaction) */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-r border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                      BEFORE
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(pair.beforeEntry.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {pair.beforeEntry.accomplishment}
                    </p>
                    {pair.beforeEntry.reflection && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                        {pair.beforeEntry.reflection}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Emotional state:</span> Raw, unprocessed
                    </p>
                  </div>
                </div>

                {/* After (Processed Reflection) */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                      AFTER
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(pair.afterEntry.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {pair.afterEntry.accomplishment}
                    </p>
                    {pair.afterEntry.reflection && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                        {pair.afterEntry.reflection}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Emotional state:</span> Processed, integrated
                    </p>
                  </div>
                </div>
              </div>

              {/* Golden Bridge Animation */}
              <div className="relative h-2 bg-gradient-to-r from-red-300 via-yellow-400 to-green-300">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: index * 0.1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">金継ぎ Kintsukuroi:</span> The journey from raw
          reaction to processed wisdom is where the gold appears. Your ability to reframe
          challenges shows psychological resilience.
        </p>
      </div>
    </div>
  );
}
