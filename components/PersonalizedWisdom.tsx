'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Heart, RefreshCw, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWisdomOfTheDay, getPersonalizedWisdom, type CulturalQuote } from '@/data/culturalWisdom';
import type { UserProfile } from '@/types';

interface PersonalizedWisdomProps {
  user?: UserProfile | null;
}

export default function PersonalizedWisdom({ user }: PersonalizedWisdomProps) {
  const [currentQuote, setCurrentQuote] = useState<CulturalQuote | null>(null);
  const [allQuotes, setAllQuotes] = useState<CulturalQuote[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (user) {
      // Get personalized quotes
      const personalized = getPersonalizedWisdom({
        ethnicity: user.ethnicity,
        gender: user.gender,
        profession: user.profession,
      });
      setAllQuotes(personalized);

      // Set initial quote as wisdom of the day
      const wisdomOfDay = getWisdomOfTheDay({
        ethnicity: user.ethnicity,
        gender: user.gender,
        profession: user.profession,
      });
      setCurrentQuote(wisdomOfDay);
    }
  }, [user]);

  const handleNextQuote = () => {
    if (allQuotes.length === 0) return;

    const currentIndex = allQuotes.findIndex(q => q.id === currentQuote?.id);
    const nextIndex = (currentIndex + 1) % allQuotes.length;
    setCurrentQuote(allQuotes[nextIndex]);
  };

  if (!isClient || !currentQuote) {
    return null;
  }

  // Map wisdom themes to different gradient styles - all use theme colors for variety
  const themeGradients = {
    resilience: 'theme-gradient-to-r',      // Primary → Secondary (growth, renewal)
    strength: 'theme-gradient-to-br',       // Primary → Secondary → Accent (power, intensity)
    wisdom: 'bg-gradient-to-r from-[var(--theme-secondary)] to-[var(--theme-accent)]',  // Secondary → Accent (knowledge)
    transformation: 'bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-primary)]', // Accent → Primary (change)
    advocacy: 'bg-gradient-to-r from-[var(--theme-primary-dark)] to-[var(--theme-secondary)]', // Dark Primary → Secondary (voice)
    community: 'theme-gradient-to-r',       // Primary → Secondary (together)
  };

  const themeIcons = {
    resilience: '🌱',
    strength: '💪',
    wisdom: '🦉',
    transformation: '🦋',
    advocacy: '📣',
    community: '🤝',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700"
    >
      {/* Gradient Header */}
      <div className={`${themeGradients[currentQuote.theme]} p-6 text-white`}
        style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{themeIcons[currentQuote.theme]}</div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Wisdom From Your Heritage
              </h3>
              <p className="text-sm text-white/90 mt-1">
                {currentQuote.origin} • {currentQuote.theme.charAt(0).toUpperCase() + currentQuote.theme.slice(1)}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={handleNextQuote}
            className="p-2 bg-white/30 rounded-lg hover:bg-white/40 transition-colors"
            aria-label="Next wisdom"
          >
            <RefreshCw className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Quote Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Quote */}
            <blockquote className="mb-4">
              <p className="text-2xl font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
                "{currentQuote.text}"
              </p>
              {currentQuote.translation && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Original: {currentQuote.translation}
                </p>
              )}
            </blockquote>

            {/* Author */}
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              — {currentQuote.author}
            </p>

            {/* Kintsugi Connection */}
            <div className="bg-gradient-to-br theme-bg-primary-light  rounded-xl p-4 border-l-4 theme-border-primary">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 theme-text-primary dark:theme-text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold theme-text-primary dark:theme-text-secondary mb-1">
                    Kintsugi Connection
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {currentQuote.kintsugiConnection}
                  </p>
                </div>
              </div>
            </div>

            {/* Personalization Note */}
            {(user?.ethnicity || user?.gender || user?.profession) && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Heart className="h-3 w-3 text-pink-500" />
                <span>
                  Personalized for you based on{' '}
                  {[
                    user?.ethnicity && 'heritage',
                    user?.gender && 'identity',
                    user?.profession && 'profession'
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="px-6 pb-6">
        <div className="flex justify-center gap-1">
          {allQuotes.slice(0, 5).map((quote, index) => (
            <button
              key={quote.id}
              onClick={() => setCurrentQuote(quote)}
              className={`h-2 rounded-full transition-all ${
                quote.id === currentQuote.id
                  ? 'theme-bg-primary dark:theme-bg-secondary w-6'
                  : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`View wisdom ${index + 1}`}
            />
          ))}
          {allQuotes.length > 5 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              +{allQuotes.length - 5} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
