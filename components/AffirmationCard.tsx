'use client';

import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Affirmation } from '@/types';
import { getAffirmationEmoji, getCategoryDisplayEmoji } from '@/utils/affirmationEmojis';

interface AffirmationCardProps {
  affirmation: Affirmation;
  onRefresh: () => void;
}

export default function AffirmationCard({ affirmation, onRefresh }: AffirmationCardProps) {
  const categoryColors = {
    accomplishment: 'from-kintsugi-gold-500 to-kintsugi-gold-700',
    strength: 'from-kintsugi-gold-400 to-kintsugi-gold-600',
    growth: 'from-kintsugi-gold-300 to-kintsugi-gold-500',
    impact: 'from-kintsugi-gold-600 to-kintsugi-gold-800',
    'bias-awareness': 'from-kintsugi-gold-200 to-kintsugi-gold-400',
  };

  const categoryIcons = {
    accomplishment: '🏆',
    strength: '💪',
    growth: '🌱',
    impact: '✨',
    'bias-awareness': '🧠',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[affirmation.category]} opacity-10 rounded-3xl blur-xl`}></div>
      
      <div className="relative bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-kintsugi-gold-100/30 dark:border-kintsugi-gold-900/30">
        {/* Category Badge */}
        <div className="flex items-center justify-between text-sm text-kintsugi-gold-800/70 dark:text-kintsugi-gold-300/70">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kintsugi-gold-50/50 dark:bg-kintsugi-gold-900/20">
            <span className="text-lg">{categoryIcons[affirmation.category]}</span>
            {affirmation.category.replace('-', ' ').toUpperCase()}
          </span>
          
          <button
            onClick={onRefresh}
            className="w-5 h-5 text-kintsugi-gold-700/70 dark:text-kintsugi-gold-400/70 group-hover:text-kintsugi-gold-600 dark:group-hover:text-kintsugi-gold-300 transition-colors"
            aria-label="Get new affirmation"
          >
            <RefreshCw className="w-5 h-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-300 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Affirmation Text with Emoji */}
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-6xl flex-shrink-0">
              {getCategoryDisplayEmoji(affirmation.category)}
            </div>
            <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-kintsugi-gold-400 opacity-50" />
          </div>
          <p className="text-2xl md:text-3xl font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-6 leading-relaxed">
            {affirmation.text}
          </p>
          <Sparkles className="absolute -bottom-4 -right-4 w-8 h-8 text-kintsugi-gold-400 opacity-50" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8">
          {affirmation.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-kintsugi-gold-100/50 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-800 dark:text-kintsugi-gold-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Research Citation */}
        {affirmation.research && (
          <div className="mt-6 pt-6 border-t border-kintsugi-gold-100/30 dark:border-kintsugi-gold-900/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📚</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-kintsugi-gold-700 dark:text-kintsugi-gold-400 mb-1">
                  Research-Backed
                </p>
                <p className="text-sm text-kintsugi-dark-700 dark:text-kintsugi-gold-300 mb-2">
                  {affirmation.research.finding}
                </p>
                <p className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-500">
                  <span className="font-medium">{affirmation.research.citation} ({affirmation.research.year})</span>
                  {affirmation.research.link && (
                    <>
                      {' · '}
                      <a
                        href={affirmation.research.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-kintsugi-gold-600 dark:hover:text-kintsugi-gold-300 transition-colors"
                      >
                        View Study
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
