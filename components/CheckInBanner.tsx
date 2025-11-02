'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { useState } from 'react';
import { CheckInMessage } from '@/utils/checkInMessages';

interface CheckInBannerProps {
  checkInMessage: CheckInMessage;
  onDismiss: () => void;
}

export default function CheckInBanner({ checkInMessage, onDismiss }: CheckInBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const toneColors = {
    welcoming: 'from-blue-500 to-cyan-500',
    caring: 'from-purple-500 to-pink-500',
    encouraging: 'from-green-500 to-emerald-500',
    celebrating: 'from-yellow-500 to-orange-500'
  };

  const toneBgColors = {
    welcoming: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    caring: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    encouraging: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    celebrating: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className={`relative ${toneBgColors[checkInMessage.tone]} border-2 rounded-2xl p-6 shadow-lg`}>
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4 pr-8">
              {/* Emoji */}
              <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${toneColors[checkInMessage.tone]} flex items-center justify-center shadow-lg`}>
                <span className="text-3xl">{checkInMessage.emoji}</span>
              </div>

              {/* Message */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {checkInMessage.message}
                </h3>
                
                {checkInMessage.actionPrompt && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {checkInMessage.actionPrompt}
                  </p>
                )}

                {/* Encouraging Note */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>We're here to support you, always.</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute bottom-0 right-0 opacity-10">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="90" cy="90" r="60" fill="currentColor" />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
