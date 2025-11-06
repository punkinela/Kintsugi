'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, BookOpen, TrendingUp, Award, Zap } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Own Your Impact! 👋',
    description: 'Track your accomplishments AND your resilience. This research-backed tool helps you document your complete impact story—wins + growth through challenges. Inspired by Kintsugi (金継ぎ), the Japanese art of repairing broken pottery with gold, we believe challenges make you MORE valuable.',
    icon: <Sparkles className="h-12 w-12" />,
  },
  {
    title: 'Document Your Full Impact',
    description: 'Use the Journal tab to capture accomplishments AND moments of growth through challenges. Both build your professional story. Your resilience navigating obstacles is PART of your impact, not something to hide.',
    icon: <BookOpen className="h-12 w-12" />,
  },
  {
    title: 'Get Insights',
    description: 'The Insights tab shows your patterns, mood trends, and personalized bias insights. See both your wins and how you\'ve grown through challenges—your complete impact picture.',
    icon: <TrendingUp className="h-12 w-12" />,
  },
  {
    title: 'Celebrate Wins + Resilience',
    description: 'Build streaks, complete milestones, and unlock achievements for consistently documenting your journey. We celebrate BOTH accomplishments and the challenges you\'ve overcome—they\'re all golden moments.',
    icon: <Award className="h-12 w-12" />,
  },
  {
    title: 'Quick Tips',
    description: '• Press Ctrl+K for quick capture\n• Press Shift+? for keyboard shortcuts\n• Your data stays private on your device\n• Export your full impact story for performance reviews\n• Remember: Impact = Wins + Resilience',
    icon: <Zap className="h-12 w-12" />,
  },
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('kintsugi_onboarding_completed');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('kintsugi_onboarding_completed', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('kintsugi_onboarding_completed', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-4">
                  <motion.div
                    key={currentStep}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
                  >
                    {step.icon}
                  </motion.div>

                  <div className="flex-1">
                    <motion.h2
                      key={`title-${currentStep}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-2xl font-bold mb-1"
                    >
                      {step.title}
                    </motion.h2>
                    <div className="flex gap-2">
                      {onboardingSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 rounded-full transition-all ${
                            index === currentStep
                              ? 'w-8 bg-white'
                              : index < currentStep
                              ? 'w-4 bg-white/60'
                              : 'w-4 bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="min-h-[200px]"
                >
                  <p className="text-lg text-kintsugi-dark-700 dark:text-kintsugi-gold-200 whitespace-pre-line leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900/50 border-t border-kintsugi-gold-200 dark:border-kintsugi-dark-700 flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-kintsugi-dark-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-dark-900 dark:hover:text-kintsugi-gold-200 font-medium transition-colors"
                >
                  Skip tour
                </button>

                <div className="flex items-center gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-kintsugi-dark-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-dark-900 dark:hover:text-kintsugi-gold-200 font-medium transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      <>
                        Get Started
                        <Sparkles className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
