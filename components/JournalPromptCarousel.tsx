'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Lightbulb, Heart, Star, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';

interface JournalPromptCarouselProps {
  user: UserProfile | null;
  onSelectPrompt: (prompt: string) => void;
}

interface Prompt {
  text: string;
  category: string;
  icon: any;
  color: string;
}

export default function JournalPromptCarousel({ user, onSelectPrompt }: JournalPromptCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    generatePersonalizedPrompts();
  }, [user]);

  const generatePersonalizedPrompts = () => {
    const basePrompts: Prompt[] = [
      {
        text: "What's one accomplishment from today that you're proud of?",
        category: "Wins",
        icon: Star,
        color: "from-yellow-500 to-orange-500"
      },
      {
        text: "Describe a moment today when you felt confident and capable.",
        category: "Growth",
        icon: Zap,
        color: "from-purple-500 to-pink-500"
      },
      {
        text: "What's one thing you learned about yourself this week?",
        category: "Reflection",
        icon: Lightbulb,
        color: "from-blue-500 to-cyan-500"
      },
      {
        text: "How did you show up as your authentic self today?",
        category: "Identity",
        icon: Heart,
        color: "from-red-500 to-pink-500"
      },
      {
        text: "What's a challenge you overcame recently? How did you do it?",
        category: "Resilience",
        icon: Sparkles,
        color: "from-indigo-500 to-purple-500"
      }
    ];

    // Add personalized prompts based on user profile
    const personalizedPrompts: Prompt[] = [];

    if (user?.profession) {
      personalizedPrompts.push({
        text: `As a ${user.profession}, what's one way you made an impact today?`,
        category: "Professional",
        icon: Sparkles,
        color: "from-kintsugi-gold-500 to-amber-500"
      });
      personalizedPrompts.push({
        text: `What's one skill you used as a ${user.profession} that you want to celebrate?`,
        category: "Skills",
        icon: Star,
        color: "from-green-500 to-emerald-500"
      });
    }

    if (user?.gender) {
      personalizedPrompts.push({
        text: "Did you notice any moments today where your voice was valued or dismissed? How did you respond?",
        category: "Advocacy",
        icon: Heart,
        color: "from-rose-500 to-red-500"
      });
    }

    if (user?.ethnicity) {
      personalizedPrompts.push({
        text: "What's one way your unique perspective added value in a conversation or project today?",
        category: "Perspective",
        icon: Lightbulb,
        color: "from-teal-500 to-cyan-500"
      });
    }

    // Bias-specific prompts (core to the app's mission)
    const biasPrompts: Prompt[] = [
      {
        text: "Did you notice any bias today (your own or others')? What did you learn from it?",
        category: "Awareness",
        icon: Lightbulb,
        color: "from-amber-500 to-orange-500"
      },
      {
        text: "What's one assumption you challenged today?",
        category: "Challenge",
        icon: Zap,
        color: "from-violet-500 to-purple-500"
      },
      {
        text: "How did you advocate for yourself or others today?",
        category: "Advocacy",
        icon: Heart,
        color: "from-pink-500 to-rose-500"
      }
    ];

    // Combine and shuffle
    const allPrompts = [...basePrompts, ...personalizedPrompts, ...biasPrompts];
    const shuffled = allPrompts.sort(() => Math.random() - 0.5);
    setPrompts(shuffled);
  };

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % prompts.length);
  };

  const prevPrompt = () => {
    setCurrentIndex((prev) => (prev - 1 + prompts.length) % prompts.length);
  };

  if (prompts.length === 0) return null;

  const currentPrompt = prompts[currentIndex];
  const Icon = currentPrompt.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 bg-gradient-to-r ${currentPrompt.color} rounded-xl shadow-lg`}>
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Today's Prompt
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalized for your journey
            </p>
          </div>
        </div>

        {/* Category Badge */}
        <div className={`px-3 py-1 bg-gradient-to-r ${currentPrompt.color} text-white text-xs font-semibold rounded-full shadow-md`}>
          {currentPrompt.category}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="min-h-[120px]"
          >
            <div className={`bg-gradient-to-r ${currentPrompt.color} rounded-xl p-6`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-lg font-medium leading-relaxed">
                    {currentPrompt.text}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prevPrompt}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            aria-label="Previous prompt"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {prompts.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-kintsugi-gold-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to prompt ${index + 1}`}
              />
            ))}
            {prompts.length > 5 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                +{prompts.length - 5}
              </span>
            )}
          </div>

          <button
            onClick={nextPrompt}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            aria-label="Next prompt"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Use Prompt Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectPrompt(currentPrompt.text)}
        className={`w-full mt-6 px-6 py-3 bg-gradient-to-r ${currentPrompt.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all`}
      >
        Use This Prompt ✍️
      </motion.button>

      {/* Auto-rotate indicator */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
        Tip: New prompts appear each time you visit
      </p>
    </motion.div>
  );
}
