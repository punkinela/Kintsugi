'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote as QuoteIcon, Heart, RefreshCw, Sparkles, Filter } from 'lucide-react';
import {
  getQuoteOfTheDay,
  getRandomQuote,
  getAllQuotes,
  getQuotesByCategory,
  saveFavoriteQuote,
  removeFavoriteQuote,
  isQuoteFavorite,
  getFavoriteQuoteObjects,
  type Quote
} from '@/utils/quotes';

export default function QuoteOfTheDay() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(getQuoteOfTheDay());
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [view, setView] = useState<'daily' | 'favorites' | 'browse'>('daily');

  useEffect(() => {
    setIsFavorite(isQuoteFavorite(currentQuote.id));
  }, [currentQuote]);

  const handleRefresh = () => {
    setCurrentQuote(getRandomQuote());
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteQuote(currentQuote.id);
    } else {
      saveFavoriteQuote(currentQuote.id);
    }
    setIsFavorite(!isFavorite);
  };

  const categories = ['all', 'motivation', 'growth', 'confidence', 'resilience', 'empowerment', 'wisdom'];

  const getFilteredQuotes = () => {
    if (view === 'favorites') {
      return getFavoriteQuoteObjects();
    }

    if (selectedCategory === 'all') {
      return getAllQuotes();
    }

    return getQuotesByCategory(selectedCategory as any);
  };

  const filteredQuotes = getFilteredQuotes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 theme-text-primary" />
            Daily Inspiration
          </h2>
          <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary mt-1">
            Words of wisdom to inspire your journey
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          {(['daily', 'favorites', 'browse'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                view === v
                  ? 'theme-bg-primary text-white'
                  : 'bg-white dark:bg-kintsugi-dark-800 text-kintsugi-dark-600 dark:theme-text-secondary hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Main Quote Display */}
      {view === 'daily' && (
        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-gradient-to-br from-theme-primary-light to-orange-50  rounded-2xl p-8 border theme-border-light dark:theme-border-primary overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <QuoteIcon className="absolute top-4 left-4 h-32 w-32 theme-text-primary" />
            <QuoteIcon className="absolute bottom-4 right-4 h-32 w-32 theme-text-primary rotate-180" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                currentQuote.category === 'motivation' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                currentQuote.category === 'growth' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                currentQuote.category === 'confidence' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                currentQuote.category === 'resilience' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                currentQuote.category === 'empowerment' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' :
                'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
              }`}>
                {currentQuote.category}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 scale-110'
                      : 'bg-white/50 dark:bg-black/20 theme-text-primary hover:bg-white dark:hover:bg-black/40'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleRefresh}
                  className="p-2 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 rounded-lg transition-all theme-text-primary"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            <blockquote className="text-2xl md:text-3xl font-serif italic text-kintsugi-dark-900 dark:text-white mb-4 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>

            <div className="flex items-center justify-between">
              <cite className="text-lg font-medium text-theme-primary dark:theme-text-secondary not-italic">
                — {currentQuote.author}
              </cite>

              <div className="flex gap-2">
                {currentQuote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-white/50 dark:bg-black/20 text-kintsugi-dark-600 dark:theme-text-secondary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Browse Quotes */}
      {(view === 'browse' || view === 'favorites') && (
        <div className="space-y-4">
          {/* Category Filter for Browse */}
          {view === 'browse' && (
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border theme-border-light dark:border-kintsugi-dark-700">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 theme-text-primary" />
                <span className="text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary">
                  Filter by Category
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                      selectedCategory === cat
                        ? 'theme-bg-primary text-white'
                        : 'theme-bg-primary-light dark:bg-theme-primary/20 text-theme-primary dark:theme-text-secondary hover:bg-theme-accent dark:hover:bg-theme-primary/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onSelect={() => setCurrentQuote(quote)}
                  isSelected={currentQuote.id === quote.id}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white dark:bg-kintsugi-dark-800 rounded-xl border theme-border-light dark:border-kintsugi-dark-700">
                <Heart className="h-12 w-12 mx-auto theme-text-secondary mb-3" />
                <p className="text-kintsugi-dark-600 dark:theme-text-secondary">
                  No favorite quotes yet. Start adding some!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuoteCard({
  quote,
  onSelect,
  isSelected
}: {
  quote: Quote;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [isFav, setIsFav] = useState(isQuoteFavorite(quote.id));

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavoriteQuote(quote.id);
    } else {
      saveFavoriteQuote(quote.id);
    }
    setIsFav(!isFav);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border-2 cursor-pointer transition-all ${
        isSelected
          ? 'theme-border-primary shadow-lg'
          : 'theme-border-light dark:border-kintsugi-dark-700 hover:border-theme-secondary'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
          quote.category === 'motivation' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
          quote.category === 'growth' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
          quote.category === 'confidence' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
          quote.category === 'resilience' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
          quote.category === 'empowerment' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' :
          'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
        }`}>
          {quote.category}
        </span>

        <button
          onClick={handleToggleFavorite}
          className={`p-1 rounded transition-all ${
            isFav ? 'text-red-600 dark:text-red-400' : 'text-gray-400 hover:text-red-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      <p className="text-sm md:text-base font-serif italic text-kintsugi-dark-900 dark:text-white mb-2 line-clamp-3">
        "{quote.text}"
      </p>

      <p className="text-xs theme-text-primary dark:theme-text-secondary">
        — {quote.author}
      </p>
    </motion.div>
  );
}
