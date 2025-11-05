'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, BookOpen, Target, Award } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { useMemo } from 'react';

interface GoldenRepairsPanelProps {
  entries: JournalEntry[];
}

export default function GoldenRepairsPanel({ entries }: GoldenRepairsPanelProps) {
  // Analyze entries for growth keywords (challenges overcome, lessons learned)
  const goldenMoments = useMemo(() => {
    const growthKeywords = ['learn', 'grow', 'overcome', 'achieve', 'progress', 'improve', 'succeed', 'realize', 'understand'];
    const challengeKeywords = ['challenge', 'difficult', 'hard', 'struggle', 'problem', 'obstacle', 'setback'];

    const moments = entries.filter(entry => {
      const text = `${entry.accomplishment || ''} ${entry.reflection || ''}`.toLowerCase();
      const hasGrowth = growthKeywords.some(keyword => text.includes(keyword));
      const hasChallenge = challengeKeywords.some(keyword => text.includes(keyword));
      return hasGrowth || hasChallenge;
    });

    return moments.slice(0, 6); // Show latest 6 golden moments
  }, [entries]);

  if (goldenMoments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-kintsugi-gold-50 to-amber-50 dark:from-kintsugi-gold-900/20 dark:to-amber-900/20 rounded-2xl shadow-lg border-2 border-kintsugi-gold-300 dark:border-kintsugi-gold-700/50 p-8 text-center"
      >
        <Sparkles className="h-16 w-16 text-kintsugi-gold-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Golden Repairs Await
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Like Kintsugi pottery, your challenges become golden seams of beauty and strength.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Start journaling about your experiences—both struggles and triumphs—to track your transformation.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-kintsugi-gold-500 to-amber-500 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Golden Repairs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Moments where you turned cracks into gold ✨
            </p>
          </div>
        </div>
        <div className="hidden sm:block px-4 py-2 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 rounded-full">
          <p className="text-kintsugi-gold-700 dark:text-kintsugi-gold-300 font-semibold text-sm">
            {goldenMoments.length} transformations
          </p>
        </div>
      </div>

      {/* Kintsugi Philosophy Quote */}
      <div className="bg-gradient-to-r from-kintsugi-gold-50 to-amber-50 dark:from-kintsugi-gold-900/20 dark:to-amber-900/20 rounded-xl p-4 mb-6 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50">
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
          "Kintsugi teaches us that breakage and repair are part of the history of an object, not something to disguise."
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Below are your moments of growth—where challenges became opportunities for transformation.
        </p>
      </div>

      {/* Golden Moments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goldenMoments.map((moment, index) => {
          const icons = [Heart, TrendingUp, Target, Award, BookOpen, Sparkles];
          const IconComponent = icons[index % icons.length];
          const colors = [
            'from-rose-500 to-pink-500',
            'from-blue-500 to-indigo-500',
            'from-amber-500 to-orange-500',
            'from-purple-500 to-violet-500',
            'from-green-500 to-emerald-500',
            'from-kintsugi-gold-500 to-yellow-500'
          ];
          const bgColors = [
            'bg-rose-50 dark:bg-rose-900/20',
            'bg-blue-50 dark:bg-blue-900/20',
            'bg-amber-50 dark:bg-amber-900/20',
            'bg-purple-50 dark:bg-purple-900/20',
            'bg-green-50 dark:bg-green-900/20',
            'bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/20'
          ];

          return (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${bgColors[index % bgColors.length]} rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-kintsugi-gold-300 dark:hover:border-kintsugi-gold-700 transition-all cursor-pointer`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 bg-gradient-to-br ${colors[index % colors.length]} rounded-lg`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(moment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {moment.accomplishment || moment.reflection || 'Moment of growth'}
              </p>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-kintsugi-gold-700 dark:text-kintsugi-gold-400 font-medium">
                  ✨ Golden Repair #{index + 1}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom message */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Every challenge you face and overcome adds another golden seam to your masterpiece. Keep journaling to track your transformation.
        </p>
      </div>
    </motion.div>
  );
}
