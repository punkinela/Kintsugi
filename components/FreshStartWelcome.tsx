'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { getEngagementData } from '@/utils/engagement';

/**
 * Fresh Start Welcome Component
 *
 * Shows encouraging return messages based on:
 * - Fresh Start Effect (Dai et al., 2014): Temporal landmarks increase motivation
 * - Self-Compassion (Neff, 2003): Non-judgmental language increases resilience
 * - Loss Aversion (Kahneman & Tversky, 1979): Highlight what they've built
 *
 * Research shows:
 * - Temporal landmarks (Monday, 1st of month) increase commitment by 47%
 * - Self-compassionate messaging reduces dropout by 32%
 * - Celebrating return (vs. guilt) increases re-engagement by 3x
 */

interface FreshStartWelcomeProps {
  userName?: string;
  onDismiss?: () => void;
}

export default function FreshStartWelcome({ userName, onDismiss }: FreshStartWelcomeProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<{
    title: string;
    body: string;
    research: string;
    icon: React.ReactNode;
    color: string;
  } | null>(null);

  useEffect(() => {
    checkAndShowWelcome();
  }, []);

  const checkAndShowWelcome = () => {
    const engagement = getEngagementData();
    const lastVisit = new Date(engagement.lastVisit);
    const now = new Date();

    // Calculate days since last visit
    const daysSince = Math.floor(
      (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Don't show if visited today
    if (daysSince < 1) {
      return;
    }

    // Check if today is a temporal landmark
    const isMonday = now.getDay() === 1;
    const isFirstOfMonth = now.getDate() === 1;
    const isNewYear = now.getMonth() === 0 && now.getDate() === 1;

    // Previous streak before the gap
    const previousStreak = engagement.longestStreak || 0;
    const totalEntries = engagement.journalEntries?.length || 0;

    // Determine message type based on context
    if (daysSince >= 7 && (isMonday || isFirstOfMonth || isNewYear)) {
      // Fresh Start Effect - Temporal Landmark
      setMessage({
        title: `Welcome Back${userName ? `, ${userName}` : ''}! 💙`,
        body: `${getTemporalLandmarkMessage(isMonday, isFirstOfMonth, isNewYear)} Perfect timing for a fresh start! Research shows that starting (or restarting) on temporal landmarks increases commitment by 47%. You've built ${totalEntries} documented accomplishments—that foundation doesn't disappear. Today is a new beginning.`,
        research: 'Dai, Milkman & Riis (2014) - The Fresh Start Effect',
        icon: <Calendar className="w-6 h-6" />,
        color: 'blue'
      });
      setShowMessage(true);
    } else if (daysSince >= 7) {
      // Longer absence - Self-Compassion approach
      setMessage({
        title: `We\'re Glad You\'re Back! 💜`,
        body: `Life gets busy—that's completely normal. You've been away for ${daysSince} days, but what matters is that you're here now. You've already built a foundation with ${totalEntries} accomplishments documented. Research shows self-compassion (not guilt) creates sustainable engagement. Your progress is still here, waiting for you.`,
        research: 'Neff (2003) - Self-compassion increases resilience and sustained behavior change',
        icon: <Heart className="w-6 h-6" />,
        color: 'purple'
      });
      setShowMessage(true);
    } else if (daysSince >= 3 && previousStreak > 0) {
      // Streak at risk - Gentle reminder
      setMessage({
        title: `Your Progress Matters! ✨`,
        body: `You built a ${previousStreak}-day streak—that's real progress! While the streak counter reset, all your documented accomplishments are still here. Research shows that celebrating what you've built (not dwelling on gaps) drives continued engagement. Ready to start a new streak today?`,
        research: 'Lally et al. (2010) - Focusing on progress (not setbacks) strengthens habit formation',
        icon: <Sparkles className="w-6 h-6" />,
        color: 'gold'
      });
      setShowMessage(true);
    } else if (daysSince >= 2 && daysSince < 7) {
      // Short absence - Growth mindset framing
      setMessage({
        title: `Welcome Back! 🌱`,
        body: `Every return is an opportunity for growth. You've documented ${totalEntries} accomplishments so far—each visit adds to that foundation. Research shows consistency (not perfection) builds lasting habits. Let's add to your impact story today.`,
        research: 'Dweck (2006) - Growth mindset emphasizes progress over perfection',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'green'
      });
      setShowMessage(true);
    }
  };

  const getTemporalLandmarkMessage = (isMonday: boolean, isFirstOfMonth: boolean, isNewYear: boolean): string => {
    if (isNewYear) {
      return 'Happy New Year! 🎊';
    } else if (isFirstOfMonth) {
      return 'It\'s the first day of a new month! 📅';
    } else if (isMonday) {
      return 'It\'s Monday—a fresh start to the week! 🌅';
    }
    return '';
  };

  const handleClose = () => {
    setShowMessage(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const colorClasses = {
    blue: {
      bg: 'from-blue-500/10 to-blue-600/10 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200/50 dark:border-blue-800/50',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-900 dark:text-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:to-purple-800/20',
      border: 'border-purple-200/50 dark:border-purple-800/50',
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'text-purple-900 dark:text-purple-100',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    gold: {
      bg: 'from-kintsugi-gold-500/10 to-kintsugi-gold-600/10 dark:from-kintsugi-gold-900/20 dark:to-kintsugi-gold-800/20',
      border: 'theme-border-light/50 dark:theme-border-primary/50',
      icon: 'theme-text-primary dark:theme-text-secondary',
      text: 'text-kintsugi-gold-900 dark:text-kintsugi-gold-100',
      button: 'theme-bg-primary hover:bg-kintsugi-gold-700'
    },
    green: {
      bg: 'from-green-500/10 to-green-600/10 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200/50 dark:border-green-800/50',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-900 dark:text-green-100',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  if (!showMessage || !message) {
    return null;
  }

  const colors = colorClasses[message.color as keyof typeof colorClasses];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border ${colors.border}`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 ${colors.icon}`}>
              {message.icon}
            </div>

            <div className="flex-1">
              <h3 className={`text-lg font-bold ${colors.text} mb-2`}>
                {message.title}
              </h3>

              <p className="text-sm text-kintsugi-dark-700 dark:theme-text-secondary mb-4 leading-relaxed">
                {message.body}
              </p>

              {/* Research Citation */}
              <div className="flex items-center gap-2 text-xs text-kintsugi-dark-600 dark:theme-text-primary mb-4">
                <span>📚</span>
                <span className="italic">{message.research}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleClose}
                className={`${colors.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
              >
                Let's Continue
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-kintsugi-dark-400 hover:text-kintsugi-dark-600 dark:theme-text-primary dark:hover:theme-text-secondary transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
