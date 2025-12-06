'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { getLevelUpMessage } from '@/utils/gamification';

interface LevelUpCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
}

export default function LevelUpCelebration({
  isOpen,
  onClose,
  newLevel
}: LevelUpCelebrationProps) {
  const levelData = getLevelUpMessage(newLevel);

  useEffect(() => {
    if (isOpen) {
      // Gold confetti burst for Kintsugi theme
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const colors = ['#FFD700', '#FFA500', '#FFE4B5', '#DAA520', '#B8860B'];

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 60 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 40,
          spread: 120,
          origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.2 },
          colors,
          ticks: 80
        });
        confetti({
          particleCount,
          startVelocity: 40,
          spread: 120,
          origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.2 },
          colors,
          ticks: 80
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
              className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/90 dark:via-orange-900/90 dark:to-yellow-900/90 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-amber-400 dark:border-amber-600"
            >
              {/* Animated golden particles background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '-100%', opacity: [0, 1, 0] }}
                    transition={{
                      duration: 3,
                      delay: i * 0.12,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 16 + 12}px`
                    }}
                  >
                    {['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]}
                  </motion.div>
                ))}
              </div>

              <div className="relative p-8">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Level Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-amber-800">
                      <span className="text-white font-bold text-4xl">{newLevel}</span>
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-2 -left-2"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Star className="w-6 h-6 text-amber-500" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Level Up Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-2"
                >
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-300 uppercase tracking-wider">
                    Level Up!
                  </span>
                </motion.div>

                {/* Level Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-2xl font-bold text-center text-amber-900 dark:text-amber-100 mb-1"
                >
                  {levelData.title}
                </motion.h2>

                {/* Phase Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center mb-4"
                >
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full shadow">
                    {levelData.phase} Phase
                  </span>
                </motion.div>

                {/* Philosophy Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-200 dark:border-amber-700"
                >
                  <p className="text-center text-gray-700 dark:text-gray-200 italic leading-relaxed">
                    "{levelData.message}"
                  </p>
                </motion.div>

                {/* Kintsugi Principle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={`bg-gradient-to-r ${levelData.principle.color} rounded-xl p-4 mb-6 shadow-lg`}
                >
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl">{levelData.principle.icon}</span>
                    <h3 className="text-white font-bold text-lg">
                      {levelData.principle.title}
                    </h3>
                  </div>
                  <p className="text-white/90 text-center text-sm">
                    {levelData.principle.description}
                  </p>
                </motion.div>

                {/* Continue Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Continue My Journey ✨
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
