'use client';

import { motion } from 'framer-motion';
import { Sprout, Heart, Sparkles, Trophy, TrendingUp, BookOpen, Award, Target } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { UserProfile } from '@/types';
import { useMemo } from 'react';

interface KintsugiUserJourneyProps {
  entries: JournalEntry[];
  user: UserProfile | null;
}

type JourneyPhase = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  milestone?: string;
  completed: boolean;
  date?: string;
};

export default function KintsugiUserJourney({ entries, user }: KintsugiUserJourneyProps) {
  const journeyPhases = useMemo<JourneyPhase[]>(() => {
    const firstEntry = entries.length > 0 ? entries[entries.length - 1] : null;
    const latestEntry = entries.length > 0 ? entries[0] : null;

    // Calculate growth indicators
    const hasMultipleEntries = entries.length >= 3;
    const hasWeekStreak = entries.length >= 7;
    const hasMonthStreak = entries.length >= 30;
    const hasGrowthMoments = entries.filter(e => {
      const text = `${e.accomplishment || ''} ${e.reflection || ''}`.toLowerCase();
      return text.includes('learn') || text.includes('grow') || text.includes('overcome');
    }).length >= 5;
    const hasMastery = entries.length >= 50 && hasGrowthMoments;

    return [
      {
        id: 'discovery',
        title: '🌱 Discovery',
        description: 'You found Kintsugi and took the first step toward growth and self-reflection.',
        icon: Sprout,
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-300 dark:border-green-700',
        milestone: user?.name ? `${user.name} joined the Kintsugi community` : 'Joined the community',
        completed: true,
        date: firstEntry?.date || new Date().toISOString()
      },
      {
        id: 'vulnerability',
        title: '💔 Vulnerability',
        description: 'You opened up and began sharing your story, acknowledging both struggles and triumphs.',
        icon: Heart,
        color: 'text-rose-700 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        borderColor: 'border-rose-300 dark:border-rose-700',
        milestone: hasMultipleEntries ? `${entries.length} moments of courage documented` : 'Begin documenting your journey',
        completed: hasMultipleEntries,
        date: hasMultipleEntries ? entries[Math.max(0, entries.length - 3)].date : undefined
      },
      {
        id: 'consistency',
        title: '🔥 Building Resilience',
        description: 'Through consistent reflection, you built the habit of self-awareness and growth.',
        icon: TrendingUp,
        color: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-300 dark:border-orange-700',
        milestone: hasWeekStreak ? 'Established a consistent practice' : 'Build your journaling habit',
        completed: hasWeekStreak,
        date: hasWeekStreak ? entries[Math.max(0, entries.length - 7)].date : undefined
      },
      {
        id: 'applying-gold',
        title: '✨ Applying Gold',
        description: 'You began recognizing patterns, learning from challenges, and transforming pain into wisdom.',
        icon: Sparkles,
        color: 'text-theme-primary dark:theme-text-secondary',
        bgColor: 'theme-bg-primary-light dark:bg-theme-primary/20',
        borderColor: 'theme-border-accent dark:theme-border-primary',
        milestone: hasGrowthMoments ? 'Multiple transformations identified' : 'Identify growth opportunities',
        completed: hasGrowthMoments,
        date: hasGrowthMoments ? entries[Math.max(0, entries.length - 15)].date : undefined
      },
      {
        id: 'integration',
        title: '🎯 Integration',
        description: 'Self-reflection became second nature. You actively use insights to guide your decisions.',
        icon: Target,
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-300 dark:border-blue-700',
        milestone: hasMonthStreak ? 'Living with intention daily' : 'Integrate insights into life',
        completed: hasMonthStreak,
        date: hasMonthStreak ? entries[Math.max(0, entries.length - 30)].date : undefined
      },
      {
        id: 'masterpiece',
        title: '🏆 The Masterpiece',
        description: 'You embody the Kintsugi philosophy—your cracks filled with gold, more beautiful for having been broken.',
        icon: Trophy,
        color: 'text-purple-700 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-300 dark:border-purple-700',
        milestone: hasMastery ? 'Your transformation is ongoing and beautiful' : 'Continue your transformation',
        completed: hasMastery,
        date: hasMastery ? latestEntry?.date : undefined
      }
    ];
  }, [entries, user]);

  const completedPhases = journeyPhases.filter(phase => phase.completed).length;
  const progressPercentage = (completedPhases / journeyPhases.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 theme-border-light dark:theme-border-primary/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r theme-gradient-to-r dark:from-theme-primary dark:to-theme-primary px-6 py-8 text-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Owning Your Impact: The Journey</h3>
            <p className="text-white/90 mb-2">
              Your path from documenting wins to embracing your complete story—resilience and all
            </p>
            <p className="text-white/80 text-sm">
              Like Kintsugi pottery, each challenge you've overcome adds golden value to your impact
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/90">Transformation Progress</span>
            <span className="text-sm font-bold">{completedPhases} of {journeyPhases.length} phases</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-theme-secondary via-amber-400 to-theme-accent dark:from-theme-primary dark:via-amber-500 dark:to-theme-primary rounded-full"></div>

          <div className="space-y-8">
            {journeyPhases.map((phase, index) => {
              const Icon = phase.icon;

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      phase.completed
                        ? 'bg-gradient-to-br theme-gradient-to-r shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${phase.completed ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                  </motion.div>

                  {/* Content */}
                  <div className={`${phase.bgColor} ${phase.borderColor} border-2 rounded-xl p-5 ${
                    !phase.completed ? 'opacity-60' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`text-lg font-bold ${phase.color}`}>
                        {phase.title}
                      </h4>
                      {phase.completed && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                        >
                          <Award className="h-5 w-5 theme-text-primary dark:theme-text-secondary" />
                        </motion.div>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      {phase.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        phase.completed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {phase.completed ? '✓ Completed' : 'In Progress'}
                      </span>

                      {phase.date && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(phase.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>

                    {phase.milestone && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Milestone:</span> {phase.milestone}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-8 p-4 bg-gradient-to-r theme-bg-primary-light  rounded-xl border theme-border-light dark:theme-border-primary/50">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center mb-2">
            Own Your Impact = Your Wins + Your Resilience
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 text-center italic">
            "Like Kintsugi pottery (金継ぎ), where you've been broken and how you've repaired yourself with gold—that's part of your impact story. Your journey is your masterpiece."
          </p>
        </div>
      </div>
    </motion.div>
  );
}
