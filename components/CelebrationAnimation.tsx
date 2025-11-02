'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Trophy, Star, Zap } from 'lucide-react';

interface CelebrationAnimationProps {
  type: 'xp' | 'level-up' | 'achievement' | 'challenge' | 'reward';
  title: string;
  description?: string;
  icon?: string;
  xp?: number;
  points?: number;
  onComplete?: () => void;
}

export default function CelebrationAnimation({
  type,
  title,
  description,
  icon,
  xp,
  points,
  onComplete
}: CelebrationAnimationProps) {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onComplete?.(), 500);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  const getColors = () => {
    switch (type) {
      case 'level-up':
        return 'from-yellow-400 via-orange-500 to-red-500';
      case 'achievement':
        return 'from-purple-400 via-pink-500 to-red-500';
      case 'challenge':
        return 'from-blue-400 via-cyan-500 to-teal-500';
      case 'reward':
        return 'from-green-400 via-emerald-500 to-teal-500';
      default:
        return 'from-purple-400 via-pink-500 to-purple-600';
    }
  };
  
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'level-up':
        return '🎉';
      case 'achievement':
        return '🏆';
      case 'challenge':
        return '✅';
      case 'reward':
        return '🎁';
      default:
        return '⭐';
    }
  };
  
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  scale: 0
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720,
                  scale: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'easeOut',
                  delay: Math.random() * 0.5
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </motion.div>
          
          {/* Main Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className={`bg-gradient-to-br ${getColors()} p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 pointer-events-auto`}>
              {/* Sparkle Effects */}
              <div className="absolute -top-4 -right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
              </div>
              
              <div className="absolute -bottom-4 -left-4">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Star className="w-8 h-8 text-yellow-300" />
                </motion.div>
              </div>
              
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-8xl text-center mb-4"
              >
                {getIcon()}
              </motion.div>
              
              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-white text-center mb-2"
              >
                {title}
              </motion.h2>
              
              {/* Description */}
              {description && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/90 text-center mb-4"
                >
                  {description}
                </motion.p>
              )}
              
              {/* XP and Points */}
              {(xp || points) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center gap-4 mt-4"
                >
                  {xp && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-bold">+{xp} XP</span>
                    </div>
                  )}
                  {points && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-bold">+{points} pts</span>
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Pulse Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-white rounded-3xl -z-10"
              />
            </div>
          </motion.div>
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        </>
      )}
    </AnimatePresence>
  );
}
