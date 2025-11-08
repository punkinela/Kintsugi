'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { getTodaysPrompt, getAnytimePrompts, getRandomPrompt, type KintsugiPrompt } from '@/data/kintsugiPrompts';

interface KintsugiPromptsCarouselProps {
  onSelectPrompt?: (prompt: KintsugiPrompt) => void;
}

export default function KintsugiPromptsCarousel({ onSelectPrompt }: KintsugiPromptsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToday, setShowToday] = useState(true);

  // Get all available prompts
  const todaysPrompt = getTodaysPrompt();
  const anytimePrompts = getAnytimePrompts();
  const allPrompts = showToday ? [todaysPrompt] : anytimePrompts;
  const currentPrompt = allPrompts[currentIndex];

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % allPrompts.length);
  };

  const prevPrompt = () => {
    setCurrentIndex((prev) => (prev - 1 + allPrompts.length) % allPrompts.length);
  };

  const toggleView = () => {
    setShowToday(!showToday);
    setCurrentIndex(0);
  };

  // Principle colors
  const principleColors = {
    mushin: 'from-blue-500 to-indigo-500',
    'wabi-sabi': 'from-purple-500 to-pink-500',
    kintsukuroi: 'from-theme-primary to-orange-500',
    mottainai: 'from-green-500 to-emerald-500',
    'mono-no-aware': 'from-rose-500 to-red-500'
  };

  const bgColors = {
    mushin: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    'wabi-sabi': 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    kintsukuroi: 'from-theme-primary-light to-orange-50 ',
    mottainai: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    'mono-no-aware': 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20'
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 theme-text-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Kintsugi Reflection Prompts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Philosophy-guided Impact Loging
              </p>
            </div>
          </div>

          <button
            onClick={toggleView}
            className="px-3 py-1.5 bg-gradient-to-r theme-gradient-to-r text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {showToday ? 'Browse All' : 'Today\'s Prompt'}
          </button>
        </div>
      </div>

      {/* Prompt Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${showToday}-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 bg-gradient-to-br ${bgColors[currentPrompt.principle]}`}
          >
            {/* Day Name & Principle */}
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${principleColors[currentPrompt.principle]} text-white rounded-full shadow-lg`}>
                <span className="text-sm font-semibold">
                  {currentPrompt.dayName}
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {currentPrompt.principleKanji}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentPrompt.principleName}
                </div>
              </div>
            </div>

            {/* Main Prompt */}
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {currentPrompt.prompt}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {currentPrompt.reflectionGuide}
              </p>
            </div>

            {/* Sub-Prompts */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reflection questions:
              </p>
              {currentPrompt.subPrompts.map((subPrompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <span>{subPrompt}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            {onSelectPrompt && (
              <button
                onClick={() => onSelectPrompt(currentPrompt)}
                className={`w-full px-6 py-3 bg-gradient-to-r ${principleColors[currentPrompt.principle]} text-white font-semibold rounded-xl hover:shadow-xl transition-all`}
              >
                Start Reflection with This Prompt
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {!showToday && allPrompts.length > 1 && (
          <>
            <button
              onClick={prevPrompt}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
              aria-label="Previous prompt"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={nextPrompt}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
              aria-label="Next prompt"
            >
              <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {!showToday && allPrompts.length > 1 && (
        <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
          {allPrompts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r theme-gradient-to-r'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to prompt ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
