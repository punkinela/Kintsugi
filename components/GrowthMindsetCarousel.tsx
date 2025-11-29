'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, Calendar, Lightbulb } from 'lucide-react';
import { getTodaysGrowthPrompt, getAnytimeGrowthPrompts, type GrowthMindsetPrompt } from '@/data/growthMindsetPrompts';

interface GrowthMindsetCarouselProps {
  onSelectPrompt?: (prompt: GrowthMindsetPrompt) => void;
}

export default function GrowthMindsetCarousel({ onSelectPrompt }: GrowthMindsetCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToday, setShowToday] = useState(true);

  // Get all available prompts
  const todaysPrompt = getTodaysGrowthPrompt();
  const anytimePrompts = getAnytimeGrowthPrompts();
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

  // Category colors for visual variety
  const categoryColors = {
    effort: 'from-blue-500 to-cyan-500',
    learning: 'from-green-500 to-emerald-500',
    challenges: 'from-orange-500 to-amber-500',
    persistence: 'from-red-500 to-rose-500',
    feedback: 'from-purple-500 to-violet-500',
    success: 'from-theme-primary to-yellow-500',
    potential: 'from-indigo-500 to-blue-500'
  };

  const bgColors = {
    effort: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    learning: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    challenges: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
    persistence: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    feedback: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
    success: 'from-theme-primary-light to-yellow-50',
    potential: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20'
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 theme-text-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Growth Mindset Affirmations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily reminders that you can grow and improve
              </p>
            </div>
          </div>

          <button
            onClick={toggleView}
            className="px-3 py-1.5 bg-gradient-to-r theme-gradient-to-r text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {showToday ? 'Browse All' : 'Today\'s Affirmation'}
          </button>
        </div>
      </div>

      {/* Prompt Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${showToday}-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 bg-gradient-to-br ${bgColors[currentPrompt.category]}`}
          >
            {/* Icon and Day Name */}
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${categoryColors[currentPrompt.category]} text-white rounded-full shadow-lg`}>
                <span className="text-xl">{currentPrompt.icon}</span>
                <span className="text-sm font-semibold">
                  {currentPrompt.dayName}
                </span>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {currentPrompt.categoryName}
                </div>
              </div>
            </div>

            {/* Main Affirmation */}
            <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl ">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 theme-text-primary flex-shrink-0 mt-1" />
                <p className="text-xl font-bold text-gray-900 dark:text-white italic">
                  "{currentPrompt.affirmation}"
                </p>
              </div>
            </div>

            {/* Reflection Prompt */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {currentPrompt.prompt}
              </h4>

              {/* Sub-Prompts */}
              <div className="space-y-2">
                {currentPrompt.subPrompts.map((subPrompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r theme-gradient-to-r flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{subPrompt}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Step */}
            <div className="p-4 bg-gradient-to-r theme-gradient-to-r text-white rounded-xl mb-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="font-semibold text-sm mb-1">Action Step:</p>
                  <p className="text-sm">{currentPrompt.actionStep}</p>
                </div>
              </div>
            </div>

            {/* Optional: Select Prompt Button */}
            {onSelectPrompt && (
              <button
                onClick={() => onSelectPrompt(currentPrompt)}
                className={`w-full px-6 py-3 bg-gradient-to-r ${categoryColors[currentPrompt.category]} text-white font-semibold rounded-xl hover:shadow-xl transition-all`}
              >
                Reflect on This Now
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {!showToday && allPrompts.length > 1 && (
          <>
            <button
              onClick={prevPrompt}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
              aria-label="Previous affirmation"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={nextPrompt}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
              aria-label="Next affirmation"
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
              aria-label={`Go to affirmation ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
