'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Award, Target, Sparkles, Calendar, BarChart3, Share2 } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';
import { generateSummary, generateInsights } from '@/utils/accomplishmentAnalyzer';

interface WeeklySummaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklySummary({ isOpen, onClose }: WeeklySummaryProps) {
  const [summary, setSummary] = useState<any>(null);
  const [weeklyGoal, setWeeklyGoal] = useState(3); // Default: 3 affirmations per week

  useEffect(() => {
    if (isOpen) {
      const data = getEngagementData();
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Filter entries from last 7 days
      const recentEntries = data.journalEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekAgo;
      });
      
      // Calculate weekly stats
      const weeklyStats = {
        affirmationsViewed: data.affirmationsViewed,
        insightsViewed: data.insightsViewed,
        currentStreak: data.currentStreak,
        journalEntries: recentEntries.length,
        totalJournalEntries: data.journalEntries.length,
        achievements: data.achievements.length,
        visitCount: data.visitCount,
      };
      
      // Generate accomplishment insights if there are entries
      let accomplishmentInsights = null;
      if (data.journalEntries.length > 0) {
        accomplishmentInsights = {
          summary: generateSummary(data.journalEntries.map(e => e.accomplishment)),
          insights: generateInsights(data.journalEntries.map(e => e.accomplishment))
        };
      }
      
      setSummary({
        weekly: weeklyStats,
        accomplishments: accomplishmentInsights,
        recommendations: generateRecommendations(weeklyStats, data)
      });
    }
  }, [isOpen]);

  const generateRecommendations = (stats: any, data: any) => {
    const recommendations = [];
    
    if (stats.currentStreak < 3) {
      recommendations.push({
        icon: '🔥',
        title: 'Build Your Streak',
        description: 'Visit daily to build consistency. You\'re at ' + stats.currentStreak + ' days!',
        action: 'Set a daily reminder',
        priority: 'high'
      });
    }
    
    if (stats.journalEntries === 0) {
      recommendations.push({
        icon: '📝',
        title: 'Start Journaling',
        description: 'Document your accomplishments to track your growth.',
        action: 'Add your first entry',
        priority: 'high'
      });
    }
    
    if (stats.insightsViewed < 3) {
      recommendations.push({
        icon: '🧠',
        title: 'Explore Bias Insights',
        description: 'Learn about cognitive biases that prevent self-recognition.',
        action: 'View bias insights',
        priority: 'medium'
      });
    }
    
    if (stats.achievements < 3) {
      recommendations.push({
        icon: '🏆',
        title: 'Unlock Achievements',
        description: 'Keep engaging to unlock more achievements!',
        action: 'View achievements',
        priority: 'medium'
      });
    }
    
    if (stats.currentStreak >= 7) {
      recommendations.push({
        icon: '⭐',
        title: 'You\'re on Fire!',
        description: 'Amazing 7-day streak! Share your progress with others.',
        action: 'Share your success',
        priority: 'low'
      });
    }
    
    return recommendations;
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleShare = () => {
    if (!summary) return;
    
    const shareText = `🌟 My Weekly Progress on I Am Remarkable:\n\n` +
      `🔥 ${summary.weekly.currentStreak}-day streak\n` +
      `📝 ${summary.weekly.journalEntries} accomplishments documented\n` +
      `🏆 ${summary.weekly.achievements} achievements unlocked\n\n` +
      `Recognizing my worth, one day at a time! #IAmRemarkable`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Weekly Progress',
        text: shareText,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Progress copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  };

  if (!isOpen || !summary) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">
                Your Weekly Summary
              </h2>
            </div>
            <p className="text-white/90">
              Track your progress and get personalized recommendations
            </p>
            
            <button
              onClick={handleShare}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share Progress</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {summary.weekly.currentStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Day Streak 🔥</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {summary.weekly.journalEntries}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">This Week 📝</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.weekly.achievements}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Achievements 🏆</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {summary.weekly.insightsViewed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Insights 🧠</div>
              </div>
            </div>

            {/* Weekly Goal Progress */}
            <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  Weekly Goal
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {summary.weekly.journalEntries} / {weeklyGoal} entries
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage(summary.weekly.journalEntries, weeklyGoal)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {summary.weekly.journalEntries >= weeklyGoal 
                  ? '🎉 Goal achieved! You\'re building great habits!'
                  : `${weeklyGoal - summary.weekly.journalEntries} more to reach your goal!`}
              </p>
            </div>

            {/* Accomplishment Insights */}
            {summary.accomplishments && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Your Accomplishment Profile
                </h3>
                
                <div className="space-y-3 mb-4">
                  {summary.accomplishments.insights.slice(0, 3).map((insight: string, index: number) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">
                      {insight}
                    </p>
                  ))}
                </div>
                
                {summary.accomplishments.summary.topSkills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Top Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {summary.accomplishments.summary.topSkills.slice(0, 6).map((skill: any, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Personalized Recommendations */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Personalized Recommendations
              </h3>
              
              <div className="space-y-3">
                {summary.recommendations.map((rec: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{rec.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                          {rec.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {rec.description}
                        </p>
                        <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                          {rec.action} →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white text-center">
              <p className="text-lg font-medium italic mb-2">
                "Your accomplishments don't speak for themselves - you must give them voice."
              </p>
              <p className="text-sm opacity-90">
                Keep documenting your remarkable journey! 🌟
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
