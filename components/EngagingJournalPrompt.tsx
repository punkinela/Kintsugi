'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Clock, TrendingUp, Target, Lightbulb,
  ChevronRight, PenTool, Calendar, Flame, Award
} from 'lucide-react';

interface EngagingJournalPromptProps {
  onOpenJournal: () => void;
}

export default function EngagingJournalPrompt({ onOpenJournal }: EngagingJournalPromptProps) {
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayWritten, setTodayWritten] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState('');

  const prompts = [
    "What's one thing you accomplished today that you're proud of?",
    "Describe a moment when you felt confident and capable today.",
    "What skill did you use or improve today?",
    "What challenge did you overcome? How did you do it?",
    "What positive impact did you have on someone today?",
    "What did you learn about yourself today?",
    "What's one win you can celebrate right now?",
    "How did you show up for yourself or others today?",
    "What are you grateful for accomplishing this week?",
    "What strength did you demonstrate today?",
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadData = () => {
      const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
      const entries = engagement.journalEntries || [];

      // Get last 3 entries
      setRecentEntries(entries.slice(-3).reverse());

      // Check if written today
      const today = new Date().toDateString();
      const writtenToday = entries.some((e: any) => new Date(e.date).toDateString() === today);
      setTodayWritten(writtenToday);

      // Get streak
      setStreak(engagement.currentStreak || 0);

      // Random prompt (only set if not already set)
      if (!randomPrompt) {
        setRandomPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
      }
    };

    // Load data initially
    loadData();

    // Listen for storage changes from other tabs/components
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('kintsugi-data-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kintsugi-data-updated', handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Call-to-Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-2xl shadow-2xl ${
          todayWritten
            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600'
        }`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative p-8">
          {todayWritten ? (
            // Already written today
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">You're on fire! 🔥</h3>
                  <p className="text-white/90">You've journaled today - keep the momentum going!</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <Flame className="h-6 w-6 text-white mb-2" />
                  <p className="text-white/80 text-sm">Current Streak</p>
                  <p className="text-white text-3xl font-bold">{streak} days</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <Award className="h-6 w-6 text-white mb-2" />
                  <p className="text-white/80 text-sm">Entries Today</p>
                  <p className="text-white text-3xl font-bold">
                    {recentEntries.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenJournal}
                className="mt-6 w-full bg-white text-purple-700 font-bold py-4 px-6 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
              >
                Add Another Entry
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            // Haven't written today
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-white/20 rounded-full">
                  <PenTool className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {streak > 0 ? `Don't break your ${streak}-day streak!` : 'Start your journey today'}
                  </h3>
                  <p className="text-white/90 text-lg">
                    Take 2 minutes to capture your wins and build confidence
                  </p>
                </div>
              </div>

              {/* Writing Prompt */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 mb-6 border-2 border-white/30">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Today's Prompt:</p>
                    <p className="text-white text-lg font-medium">{randomPrompt}</p>
                  </div>
                </div>
              </div>

              {/* Big CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenJournal}
                className="w-full bg-white text-purple-700 font-bold py-5 px-6 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 group shadow-2xl text-lg"
              >
                <PenTool className="h-6 w-6" />
                Start Writing Now
                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              {streak > 0 && (
                <p className="text-center text-white/80 text-sm mt-4">
                  ⏰ You have {24 - new Date().getHours()} hours left to maintain your streak
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Entries Preview */}
      {recentEntries.length > 0 && (
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 theme-text-primary" />
              Recent Entries
            </h4>
            <button
              onClick={onOpenJournal}
              className="text-sm theme-text-primary hover:text-theme-primary font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow cursor-pointer"
                onClick={onOpenJournal}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  {entry.mood && (
                    <span className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                      {entry.mood}
                    </span>
                  )}
                </div>
                <p className="text-gray-900 dark:text-white font-medium line-clamp-2">
                  {entry.accomplishment}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 text-center">
          <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentEntries.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
        </div>
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-5 border-2 border-orange-200 dark:border-orange-800 text-center">
          <Flame className="h-8 w-8 mx-auto theme-text-primary mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-5 border-2 border-green-200 dark:border-green-800 text-center">
          <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {recentEntries.filter(e => {
              const entryDate = new Date(e.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return entryDate >= weekAgo;
            }).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
        </div>
        <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800 text-center">
          <Target className="h-8 w-8 mx-auto text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round((recentEntries.length / 30) * 100)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</p>
        </div>
      </div>

      {/* Why Journal Today */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          Why journal today?
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 mt-1">✓</span>
            <span>Build confidence by recognizing your accomplishments</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 mt-1">✓</span>
            <span>Prepare evidence for performance reviews and promotions</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 mt-1">✓</span>
            <span>Track patterns and identify your strengths</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-600 mt-1">✓</span>
            <span>Combat imposter syndrome with concrete proof of your impact</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
