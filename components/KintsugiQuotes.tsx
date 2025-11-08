'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

const KINTSUGI_QUOTES = [
  {
    quote: "The wound is the place where the light enters you.",
    author: "Rumi",
    context: "Embracing your scars"
  },
  {
    quote: "There is a crack in everything. That's how the light gets in.",
    author: "Leonard Cohen",
    context: "Finding beauty in imperfection"
  },
  {
    quote: "金継ぎ reminds us that our scars make us more beautiful, not less.",
    author: "Japanese Proverb",
    context: "The art of Kintsugi"
  },
  {
    quote: "Breakage and repair are part of your history, not something to disguise.",
    author: "Kintsugi Philosophy",
    context: "Honoring your journey"
  },
  {
    quote: "What was broken becomes more valuable through the act of repair.",
    author: "Kintsugi Wisdom",
    context: "Transformation through healing"
  },
  {
    quote: "Your imperfections are the golden threads that make you unique.",
    author: "Modern Kintsugi",
    context: "Celebrating uniqueness"
  },
  {
    quote: "Resilience is not about avoiding the break—it's about the golden repair.",
    author: "Growth Mindset",
    context: "Building resilience"
  },
  {
    quote: "Every crack tells a story. Every repair is a triumph.",
    author: "Healing Journey",
    context: "Your personal narrative"
  }
];

export default function KintsugiQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Rotate quotes every 30 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % KINTSUGI_QUOTES.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % KINTSUGI_QUOTES.length);
  };

  if (!isClient) {
    return null;
  }

  const currentQuote = KINTSUGI_QUOTES[currentQuoteIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br theme-gradient-to-br  rounded-2xl shadow-lg border-2 theme-border-accent dark:theme-border-primary/50"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
          color: '#D4AF37'
        }}></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 theme-bg-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kintsugi Wisdom</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{currentQuote.context}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={handleNext}
            className="p-2 bg-white dark:bg-kintsugi-dark-700 rounded-lg hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-600 transition-colors"
            aria-label="Next quote"
          >
            <RefreshCw className="h-4 w-4 theme-text-primary dark:theme-text-secondary" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="mb-4">
              <p className="text-lg font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed">
                "{currentQuote.quote}"
              </p>
            </blockquote>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium theme-text-primary dark:theme-text-secondary">
                — {currentQuote.author}
              </p>

              <div className="flex gap-1">
                {KINTSUGI_QUOTES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuoteIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuoteIndex
                        ? 'theme-bg-primary dark:theme-bg-secondary w-6'
                        : 'theme-bg-secondary dark:theme-bg-primary hover:theme-bg-secondary dark:hover:theme-bg-primary'
                    }`}
                    aria-label={`View quote ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
