'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, Lock } from 'lucide-react';

interface InsightsProgressProps {
  viewedInsights: string[];
  totalInsights: number;
}

export default function InsightsProgress({ viewedInsights, totalInsights }: InsightsProgressProps) {
  const progress = (viewedInsights.length / totalInsights) * 100;
  const [showDetails, setShowDetails] = useState(false);

  const categories = [
    { id: 'self-recognition', name: 'Self-Recognition', count: 6, icon: '🎯' },
    { id: 'growth-mindset', name: 'Growth Mindset', count: 4, icon: '🌱' },
    { id: 'inclusion', name: 'Inclusion & Diversity', count: 6, icon: '🤝' },
    { id: 'language', name: 'Language & Communication', count: 3, icon: '💬' },
    { id: 'systemic', name: 'Systemic Bias', count: 2, icon: '⚖️' },
    { id: 'disruption', name: 'Bias Disruption', count: 3, icon: '🔄' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100">
              Learning Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {viewedInsights.length} of {totalInsights} insights explored
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-right">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Category Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          {categories.map((category) => {
            const categoryViewed = viewedInsights.filter(id => 
              id.startsWith(category.id) || 
              (category.id === 'self-recognition' && id.startsWith('insight-'))
            ).length;
            const categoryProgress = (categoryViewed / category.count) * 100;

            return (
              <div key={category.id} className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {categoryViewed}/{category.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      style={{ width: `${categoryProgress}%` }}
                      className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
                {categoryViewed === category.count && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Encouragement Message */}
      {progress < 100 && (
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-indigo-800 dark:text-indigo-300">
            {progress < 25 && '🌟 Great start! Keep exploring to deepen your understanding.'}
            {progress >= 25 && progress < 50 && '💪 You\'re making progress! Each insight builds your awareness.'}
            {progress >= 50 && progress < 75 && '🔥 Halfway there! You\'re developing strong bias awareness.'}
            {progress >= 75 && progress < 100 && '⭐ Almost complete! You\'re becoming a bias disruption expert.'}
          </p>
        </div>
      )}

      {/* Completion Badge */}
      {progress === 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-500 dark:border-green-400"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <p className="font-bold text-green-800 dark:text-green-300">
                Bias Awareness Expert!
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                You've explored all {totalInsights} insights. Keep practicing bias disruption!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
