'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, BookOpen, Award, Target } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { useMemo } from 'react';
import AnimatedCounter from './AnimatedCounter';

interface KintsugiJournalInsightsProps {
  entries: JournalEntry[];
}

export default function KintsugiJournalInsights({ entries }: KintsugiJournalInsightsProps) {
  const insights = useMemo(() => {
    if (entries.length === 0) {
      return {
        totalWords: 0,
        averageLength: 0,
        growthStories: 0,
        resilienceMentions: 0,
        mostActiveMonth: 'No data',
        healingJourney: 0,
        goldMoments: 0,
        transformationRate: 0
      };
    }

    const totalWords = entries.reduce((sum, entry) => {
      const words = (entry.accomplishment?.length || 0) + (entry.reflection?.length || 0);
      return sum + Math.floor(words / 5);
    }, 0);

    const averageLength = Math.floor(totalWords / entries.length);

    const growthKeywords = ['learn', 'grow', 'better', 'improve', 'progress', 'achieve', 'succeed'];
    const growthStories = entries.filter(entry => {
      const text = String(entry.accomplishment || '') + ' ' + String(entry.reflection || '');
      return growthKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }).length;

    const resilienceKeywords = ['overcome', 'challenge', 'difficult', 'hard', 'persist', 'resilient', 'strong'];
    const resilienceMentions = entries.filter(entry => {
      const text = String(entry.accomplishment || '') + ' ' + String(entry.reflection || '');
      return resilienceKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }).length;

    const monthCounts: Record<string, number> = {};
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });
    
    let monthName = 'No data';
    const sortedMonths = Object.entries(monthCounts).sort((a, b) => b[1] - a[1]);
    if (sortedMonths.length > 0) {
      const [year, month] = sortedMonths[0][0].split('-');
      monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    const positiveKeywords = ['happy', 'proud', 'grateful', 'excited', 'joy', 'success', 'accomplish', 'achieve', 'win'];
    const positiveEntries = entries.filter(entry => {
      const text = String(entry.accomplishment || '') + ' ' + String(entry.reflection || '');
      return positiveKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }).length;
    const healingJourney = Math.round((positiveEntries / entries.length) * 100);

    const goldMoments = entries.filter(entry => {
      const words = Math.floor(((entry.accomplishment?.length || 0) + (entry.reflection?.length || 0)) / 5);
      const text = String(entry.accomplishment || '') + ' ' + String(entry.reflection || '');
      const isLong = words > averageLength * 1.5;
      const isPositive = positiveKeywords.some(keyword => text.toLowerCase().includes(keyword));
      return isLong && isPositive;
    }).length;

    const transformationKeywords = ['changed', 'different', 'new', 'transform', 'realize', 'understand', 'perspective'];
    const transformationEntries = entries.filter(entry => {
      const text = String(entry.accomplishment || '') + ' ' + String(entry.reflection || '');
      return transformationKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }).length;
    const transformationRate = Math.round((transformationEntries / entries.length) * 100);

    return {
      totalWords,
      averageLength,
      growthStories,
      resilienceMentions,
      mostActiveMonth: monthName,
      healingJourney,
      goldMoments,
      transformationRate
    };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br theme-bg-primary-light  rounded-2xl shadow-lg border-2 theme-border-accent dark:theme-border-primary/50 p-8 text-center"
      >
        <Sparkles className="h-16 w-16 theme-text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Begin Your Kintsugi Journey
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Like the Japanese art of Kintsugi, your Impact Log will transform challenges into golden wisdom.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Start Impact Loging to see your healing story unfold here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r theme-gradient-to-r  rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Sparkles className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Your Kintsugi Story</h2>
              <p className="text-white/90 text-lg mt-1">
                Transforming breaks into beauty, one entry at a time
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm">Total Entries</p>
              <p className="text-4xl font-bold mt-1">
                <AnimatedCounter value={entries.length} />
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm">Words of Wisdom</p>
              <p className="text-4xl font-bold mt-1">
                <AnimatedCounter value={insights.totalWords} />
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm">Healing Score</p>
              <p className="text-4xl font-bold mt-1">
                <AnimatedCounter value={insights.healingJourney} suffix="%" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <TrendingUp className="h-8 w-8 mb-3 relative" />
          <p className="text-white/90 text-sm mb-1">Growth Stories</p>
          <p className="text-4xl font-bold">
            <AnimatedCounter value={insights.growthStories} />
          </p>
          <p className="text-white/80 text-xs mt-2">
            Entries about learning & progress
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <Target className="h-8 w-8 mb-3 relative" />
          <p className="text-white/90 text-sm mb-1">Resilience Moments</p>
          <p className="text-4xl font-bold">
            <AnimatedCounter value={insights.resilienceMentions} />
          </p>
          <p className="text-white/80 text-xs mt-2">
            Times you overcame challenges
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-gradient-to-br from-theme-primary to-theme-primary rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <Award className="h-8 w-8 mb-3 relative" />
          <p className="text-white/90 text-sm mb-1">Gold Moments ✨</p>
          <p className="text-4xl font-bold">
            <AnimatedCounter value={insights.goldMoments} />
          </p>
          <p className="text-white/80 text-xs mt-2">
            Exceptional, detailed entries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <Sparkles className="h-8 w-8 mb-3 relative" />
          <p className="text-white/90 text-sm mb-1">Transformation</p>
          <p className="text-4xl font-bold">
            <AnimatedCounter value={insights.transformationRate} suffix="%" />
          </p>
          <p className="text-white/80 text-xs mt-2">
            Entries showing change & growth
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Your Healing Journey
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Positive Sentiment</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter value={insights.healingJourney} suffix="%" />
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.healingJourney}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {insights.healingJourney >= 70 && "🌟 Your journey radiates positivity and growth"}
                {insights.healingJourney >= 50 && insights.healingJourney < 70 && "💪 You're building resilience with each entry"}
                {insights.healingJourney < 50 && "🌱 Every entry is a step toward healing"}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="theme-text-primary">Most Active Period:</strong>
                <br />
                {insights.mostActiveMonth}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This was your golden month of reflection
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br theme-bg-primary-light  rounded-xl shadow-lg border-2 theme-border-accent dark:theme-border-primary/50 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 theme-text-primary" />
            The Kintsugi Philosophy
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-theme-primary dark:theme-text-secondary">Kintsugi (金継ぎ)</strong> is the Japanese art of repairing broken pottery with gold, treating the breakage and repair as part of the object's history rather than something to disguise.
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                "Your Impact Log is your Kintsugi. Each entry fills the cracks of difficult days with golden wisdom. Your challenges become the most beautiful parts of your story."
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="text-center">
                <div className="text-2xl mb-1">💔</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Challenges</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✨</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Reflection</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Growth</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          Your Writing Habits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Entry Length</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              <AnimatedCounter value={insights.averageLength} /> words
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {insights.averageLength < 50 && "Quick captures - every word counts"}
              {insights.averageLength >= 50 && insights.averageLength < 150 && "Balanced reflections"}
              {insights.averageLength >= 150 && "Deep, thoughtful entries"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Words Written</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              <AnimatedCounter value={insights.totalWords} />
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              That's {Math.floor(insights.totalWords / 250)} pages of your story
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consistency</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              <AnimatedCounter value={(() => {
                const oldestDate = new Date(entries[entries.length - 1].date).getTime();
                const now = new Date().getTime();
                const monthsActive = Math.max(1, Math.ceil((now - oldestDate) / (1000 * 60 * 60 * 24 * 30)));
                return Math.round(entries.length / monthsActive);
              })()} />
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Entries per month
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
