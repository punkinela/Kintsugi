'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle, Star, TrendingUp, Heart, Sparkles,
  Users, BarChart3, Target, Award, CheckCircle,
  AlertCircle, MinusCircle
} from 'lucide-react';
import { UserFeedback } from '@/types/analytics';
import { useMemo } from 'react';
import { analyzeSentiment } from '@/utils/enhancedAnalytics';

interface KintsugiInsightsDashboardProps {
  feedback: UserFeedback[];
}

export default function KintsugiInsightsDashboard({ feedback }: KintsugiInsightsDashboardProps) {
  const analytics = useMemo(() => {
    if (feedback.length === 0) {
      return {
        totalResponses: 0,
        averageRating: 0,
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
        ratingDistribution: [0, 0, 0, 0, 0],
        topKeywords: [],
        transformationStories: [],
        engagementRate: 0,
        averageStreak: 0,
        featuredFeedback: []
      };
    }

    // Calculate sentiment breakdown
    const sentiments = feedback.map(f => {
      if (!f.comment) return 'neutral';
      const sentiment = analyzeSentiment(f.comment);
      return sentiment.sentiment;
    });

    const sentimentBreakdown = {
      positive: sentiments.filter(s => s === 'positive').length,
      neutral: sentiments.filter(s => s === 'neutral').length,
      negative: sentiments.filter(s => s === 'negative').length
    };

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    feedback.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) {
        ratingDistribution[f.rating - 1]++;
      }
    });

    // Extract keywords from comments
    const allWords = feedback
      .filter(f => f.comment)
      .flatMap(f => f.comment!.toLowerCase().split(/\s+/))
      .filter(word => word.length > 4);

    const wordCounts: Record<string, number> = {};
    allWords.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    // Find transformation stories (high ratings + positive sentiment + long comments)
    const transformationStories = feedback
      .filter(f => f.rating >= 4 && f.comment && f.comment.length > 50)
      .map(f => ({
        ...f,
        sentiment: f.comment ? analyzeSentiment(f.comment) : null
      }))
      .filter(f => f.sentiment?.sentiment === 'positive')
      .slice(0, 3);

    // Calculate averages
    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
    const averageStreak = feedback.reduce((sum, f) => sum + (f.sessionData?.currentStreak || 0), 0) / feedback.length;

    // Engagement rate (users who left feedback with comments vs just ratings)
    const engagementRate = (feedback.filter(f => f.comment && f.comment.length > 10).length / feedback.length) * 100;

    // Featured feedback (4-5 stars with comments)
    const featuredFeedback = feedback
      .filter(f => f.rating >= 4 && f.comment)
      .slice(0, 6);

    return {
      totalResponses: feedback.length,
      averageRating: Number(averageRating.toFixed(1)),
      sentimentBreakdown,
      ratingDistribution,
      topKeywords,
      transformationStories,
      engagementRate: Number(engagementRate.toFixed(1)),
      averageStreak: Number(averageStreak.toFixed(1)),
      featuredFeedback
    };
  }, [feedback]);

  if (feedback.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br theme-bg-primary-light  rounded-2xl shadow-lg border-2 theme-border-accent dark:theme-border-primary/50 p-12 text-center"
      >
        <MessageCircle className="h-16 w-16 theme-text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Awaiting Community Voices
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          User feedback will illuminate insights about your Kintsugi community's journey.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Once users share their experiences, you'll see sentiment analysis, transformation stories, and actionable insights here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Kintsugi Philosophy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r theme-gradient-to-r dark:from-theme-primary dark:to-theme-primary rounded-2xl shadow-2xl p-8 text-white"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20  rounded-xl">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">Community Insights: Owning Impact Together</h2>
            <p className="text-white/90 text-lg mb-1">
              See how your community is learning to own both wins and resilience
            </p>
            <p className="text-white/80 text-sm">
              Every voice reflects the journey: celebrating accomplishments while honoring the challenges that made them stronger
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Responses</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalResponses}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Community voices heard</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br theme-gradient-to-r rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.averageRating}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(analytics.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill={i < Math.round(analytics.averageRating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Out of 5.0 stars</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Engagement Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.engagementRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Detailed feedback given</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg User Streak</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.averageStreak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Days of consistency</p>
        </motion.div>
      </div>

      {/* Sentiment Analysis & Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 theme-text-primary" />
            Sentiment Analysis
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Positive</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.sentimentBreakdown.positive} ({((analytics.sentimentBreakdown.positive / analytics.totalResponses) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(analytics.sentimentBreakdown.positive / analytics.totalResponses) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MinusCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Neutral</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.sentimentBreakdown.neutral} ({((analytics.sentimentBreakdown.neutral / analytics.totalResponses) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(analytics.sentimentBreakdown.neutral / analytics.totalResponses) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-gray-400 to-gray-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Negative</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analytics.sentimentBreakdown.negative} ({((analytics.sentimentBreakdown.negative / analytics.totalResponses) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(analytics.sentimentBreakdown.negative / analytics.totalResponses) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 theme-text-primary" />
            Rating Distribution
          </h3>

          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating, index) => {
              const count = analytics.ratingDistribution[rating - 1];
              const percentage = (count / analytics.totalResponses) * 100;

              return (
                <div key={rating}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                        {rating} ★
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.1 * index }}
                      className={`h-full ${
                        rating >= 4
                          ? 'bg-gradient-to-r theme-gradient-to-r'
                          : rating === 3
                          ? 'bg-gradient-to-r theme-gradient-to-r'
                          : 'bg-gradient-to-r from-orange-400 to-red-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Featured Feedback - Top Stories */}
      {analytics.featuredFeedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 theme-text-primary" />
            Featured Community Voices
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.featuredFeedback.map((item, index) => {
              const colors = [
                'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800/50',
                'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/50',
                'theme-bg-primary-light  theme-border-light dark:theme-border-primary/50',
                'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800/50',
                'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800/50',
                'from-orange-50 to-theme-primary-light dark:from-orange-900/20 dark:to-theme-primary/20 border-orange-200 dark:border-orange-800/50'
              ];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-gradient-to-br ${colors[index % colors.length]} rounded-xl p-5 border-2`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill={i < item.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-3 line-clamp-3">
                    "{item.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                      {item.userProfile?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-theme-primary dark:theme-text-secondary font-medium">
                      {item.sessionData?.currentStreak || 0} day streak
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Bottom Philosophy Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r theme-bg-primary-light  rounded-xl p-6 border theme-border-light dark:theme-border-primary/50 text-center"
      >
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Your Community Is Learning to Own Their Impact
        </p>
        <p className="text-xs text-gray-700 dark:text-gray-300 italic">
          Every voice represents a journey of documenting wins and honoring resilience. Like Kintsugi pottery,
          both positive feedback and constructive challenges help create golden seams—improving your offering
          while teaching your community that their complete story (accomplishments + growth) matters.
        </p>
      </motion.div>
    </div>
  );
}
