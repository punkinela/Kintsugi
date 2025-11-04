'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw, Check, Copy, Filter } from 'lucide-react';
import {
  getPromptOfTheDay,
  getRandomPrompt,
  getPromptsByCategory,
  getPromptsByDifficulty,
  markPromptAsUsed,
  wasPromptUsedToday,
  getRandomUnusedPrompt,
  type WritingPrompt
} from '@/utils/writingPrompts';

export default function WritingPromptsPanel() {
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt>(getPromptOfTheDay());
  const [wasUsed, setWasUsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    setWasUsed(wasPromptUsedToday(currentPrompt.id));
  }, [currentPrompt]);

  const handleRefresh = () => {
    if (selectedCategory !== 'all') {
      const prompts = getPromptsByCategory(selectedCategory as any);
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    } else if (selectedDifficulty !== 'all') {
      const prompts = getPromptsByDifficulty(selectedDifficulty as any);
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    } else {
      setCurrentPrompt(getRandomUnusedPrompt());
    }
  };

  const handleMarkAsUsed = () => {
    markPromptAsUsed(currentPrompt.id);
    setWasUsed(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['all', 'reflection', 'gratitude', 'growth', 'achievement', 'challenge', 'future', 'relationships'];
  const difficulties = ['all', 'easy', 'medium', 'deep'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'deep':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reflection':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'gratitude':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'growth':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'achievement':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'challenge':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'future':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'relationships':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-kintsugi-gold-600" />
          Writing Prompts
        </h2>
        <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-1">
          Guided questions to inspire deeper reflection
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-kintsugi-gold-600" />
            <span className="text-sm font-medium text-kintsugi-dark-700 dark:text-kintsugi-gold-300">
              Category
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedDifficulty('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-kintsugi-gold-600 text-white'
                    : 'bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-700 dark:text-kintsugi-gold-400 hover:bg-kintsugi-gold-200 dark:hover:bg-kintsugi-gold-900/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-kintsugi-gold-600" />
            <span className="text-sm font-medium text-kintsugi-dark-700 dark:text-kintsugi-gold-300">
              Difficulty
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                  selectedDifficulty === diff
                    ? 'bg-kintsugi-gold-600 text-white'
                    : 'bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-700 dark:text-kintsugi-gold-400 hover:bg-kintsugi-gold-200 dark:hover:bg-kintsugi-gold-900/40'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Prompt */}
      <motion.div
        key={currentPrompt.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(currentPrompt.category)}`}>
              {currentPrompt.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(currentPrompt.difficulty)}`}>
              {currentPrompt.difficulty}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 rounded-lg transition-all text-blue-600"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-4xl mb-4">💭</div>
          <h3 className="text-2xl md:text-3xl font-bold text-kintsugi-dark-900 dark:text-white mb-4 leading-relaxed">
            {currentPrompt.text}
          </h3>

          <div className="flex flex-wrap gap-2">
            {currentPrompt.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-md bg-white/50 dark:bg-black/20 text-kintsugi-dark-600 dark:text-kintsugi-gold-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleMarkAsUsed}
            disabled={wasUsed}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              wasUsed
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-default'
                : 'bg-kintsugi-gold-600 hover:bg-kintsugi-gold-700 text-white'
            }`}
          >
            <Check className="h-5 w-5" />
            {wasUsed ? 'Used Today' : 'Mark as Used'}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-kintsugi-dark-800 hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700 text-kintsugi-dark-700 dark:text-kintsugi-gold-300 rounded-lg font-medium transition-all border border-kintsugi-gold-200 dark:border-kintsugi-dark-700"
          >
            <Copy className="h-5 w-5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </motion.div>

      {/* Tips */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-2">
          💡 Writing Tips
        </h4>
        <ul className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400 space-y-1">
          <li>• Take your time - there's no rush to answer</li>
          <li>• Be honest and authentic in your reflection</li>
          <li>• There are no wrong answers, only your truth</li>
          <li>• Use these prompts as starting points, not limits</li>
        </ul>
      </div>
    </div>
  );
}
