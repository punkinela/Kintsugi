'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export default function PremiumUpgradeModal({ isOpen, onClose, featureName }: PremiumUpgradeModalProps) {
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 md:p-8">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-white" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        Premium Feature
                      </h2>
                      {featureName && (
                        <p className="text-white/90 text-sm">
                          {featureName}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                Unlock the full power of Kintsugi's AI-powered features to transform your setbacks into career strengths.
              </p>

              {/* Premium Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Premium features include:
                </h3>

                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 theme-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Skills Growth Roadmap</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI-powered career gap analysis tailored to your goals
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Award className="h-5 w-5 theme-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Performance Review Generator</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Transform your wins into compelling review narratives
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Sparkles className="h-5 w-5 theme-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Portfolio Generator</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI-crafted portfolio pieces showcasing your resilience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Zap className="h-5 w-5 theme-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">AI-Powered Insights</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deep analysis of your growth patterns and strengths
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Preview */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Premium features will be available starting at <strong className="text-purple-600 dark:text-purple-400">$8/month</strong> with a free trial to get you started.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your data remains private. We process AI requests and immediately delete them—no storage, no logging of your personal information.
                </p>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
