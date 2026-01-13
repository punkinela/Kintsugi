'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface FirstWinCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  entryText?: string;
}

export default function FirstWinCelebration({
  isOpen,
  onClose,
  entryText
}: FirstWinCelebrationProps) {
  useEffect(() => {
    if (isOpen) {
      // Golden confetti burst
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const colors = ['#FFD700', '#FFA500', '#FFE4B5', '#DAA520', '#F5DEB3'];

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 35,
          spread: 100,
          origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.2 },
          colors,
          ticks: 70
        });
        confetti({
          particleCount,
          startVelocity: 35,
          spread: 100,
          origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.2 },
          colors,
          ticks: 70
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/95 dark:via-orange-900/95 dark:to-yellow-900/95 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-amber-400 dark:border-amber-600"
            >
              {/* Animated golden particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '-100%', opacity: [0, 1, 0] }}
                    transition={{
                      duration: 3,
                      delay: i * 0.15,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                    className="absolute text-amber-400"
                    style={{
                      left: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 14 + 10}px`
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>

              <div className="relative p-8">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-4xl">🏺</span>
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-1 -left-1"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-2"
                >
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-300 uppercase tracking-wider">
                    Your First Golden Seam
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-2xl font-bold text-center text-amber-900 dark:text-amber-100 mb-4"
                >
                  You've Begun Your Journey! 🎉
                </motion.h2>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-200 dark:border-amber-700"
                >
                  <p className="text-center text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                    You just documented your first impact. This is the first crack filled with gold—
                    the beginning of your story of transformation.
                  </p>
                </motion.div>

                {/* XP Earned */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center gap-4 mb-4"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full shadow-lg">
                    <span className="text-white font-bold">+50 XP Earned!</span>
                  </div>
                </motion.div>

                {/* Philosophy Quote */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl p-4 mb-6"
                >
                  <p className="text-center text-amber-800 dark:text-amber-200 text-sm italic">
                    "Every journey begins with acknowledging where we are.
                    Your willingness to show up imperfectly is your greatest strength."
                  </p>
                  <p className="text-center text-amber-600 dark:text-amber-400 text-xs mt-2 font-medium">
                    — Embrace Imperfection
                  </p>
                </motion.div>

                {/* What's Next */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="text-center mb-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Next unlock:</strong> Growth Mindset Tracker at Level 2
                  </p>
                </motion.div>

                {/* Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Continue My Journey
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
