'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Star } from 'lucide-react';
import { getCurrentLevelInfo } from '@/utils/gamification';
import { useEffect, useState } from 'react';
import { useTooltipPosition, getArrowClass } from '@/hooks/useTooltipPosition';

interface XPBarProps {
  compact?: boolean;
}

export default function XPBar({ compact = false }: XPBarProps) {
  const [levelInfo, setLevelInfo] = useState(getCurrentLevelInfo());
  
  useEffect(() => {
    // Update level info when component mounts
    setLevelInfo(getCurrentLevelInfo());
    
    // Listen for XP updates
    const handleStorageChange = () => {
      setLevelInfo(getCurrentLevelInfo());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gamification-update', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gamification-update', handleStorageChange);
    };
  }, []);
  
  if (compact) {
    const { 
      position, 
      styles, 
      tooltipRef, 
      triggerRef, 
      updatePosition 
    } = useTooltipPosition();

    return (
      <div className="flex items-center gap-2">
        {/* Level Badge with Tooltip */}
        <div
          ref={triggerRef}
          className="relative group"
          onMouseEnter={updatePosition}
          onFocus={updatePosition}
        >
          <div className="w-10 h-10 rounded-full theme-gradient-to-r flex items-center justify-center shadow-lg cursor-help">
            <span className="text-white font-bold text-sm">{levelInfo.level}</span>
          </div>
          {/* Enhanced Tooltip */}
          <AnimatePresence>
            <motion.div
              ref={tooltipRef}
              className="fixed z-[9999] opacity-0 group-hover:opacity-100 pointer-events-none w-64"
              style={{
                ...styles,
                transform: 'translate(-50%, -100%)',
                top: 'auto',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                right: 'auto',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gray-900 text-white text-sm rounded-xl p-4 shadow-2xl border border-gray-700">
                {/* Level Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Current Level</div>
                    <div className="font-bold text-lg text-white">
                      {levelInfo.level} - {levelInfo.title}
                      <span className="ml-2 text-yellow-400">★</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Next Level</div>
                    <div className="font-bold text-purple-300">Level {levelInfo.level + 1}</div>
                  </div>
                </div>
                
                {/* XP Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>{levelInfo.xp.toLocaleString()} XP</span>
                    <span>{(levelInfo.xpToNextLevel - levelInfo.xp).toLocaleString()} to go</span>
                    <span>{levelInfo.xpToNextLevel.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r theme-gradient-to-r h-full rounded-full" 
                      style={{ width: `${Math.min(100, (levelInfo.xp / levelInfo.xpToNextLevel) * 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Level Progress */}
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-400">Progress</div>
                    <div className="font-medium text-yellow-400">
                      {((levelInfo.xp / levelInfo.xpToNextLevel) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {levelInfo.xpToNextLevel - levelInfo.xp} XP until level {levelInfo.level + 1}
                  </div>
                </div>
                
                {/* Milestone Info */}
                {levelInfo.level % 5 === 0 && levelInfo.level < 50 && (
                  <div className="mt-3 pt-3 border-t border-gray-700 text-xs">
                    <div className="flex items-center text-yellow-400 mb-1">
                      <Star className="w-3 h-3 mr-1" />
                      <span className="font-medium">Milestone Achieved!</span>
                    </div>
                    <div className="text-gray-300">
                      You've reached a milestone at level {levelInfo.level}!
                    </div>
                  </div>
                )}
                
                {levelInfo.level % 5 !== 0 && levelInfo.level < 50 && (
                  <div className="mt-3 pt-3 border-t border-gray-700 text-xs">
                    <div className="flex items-center text-purple-300 mb-1">
                      <Trophy className="w-3 h-3 mr-1" />
                      <span className="font-medium">Next Milestone</span>
                    </div>
                    <div className="text-gray-300">
                      Reach level {Math.ceil(levelInfo.level / 5) * 5} for a special reward!
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dynamic Tooltip Arrow */}
              {React.createElement('div', { className: getArrowClass(position) })}
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="absolute inset-0 rounded-full theme-bg-primary"
            style={{ opacity: 0.5 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
        
        {/* XP Bar */}
        <div className="flex-1 min-w-[100px]">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full theme-gradient-to-r"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {/* Level Badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full theme-gradient-to-r flex flex-col items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">{levelInfo.level}</span>
            <span className="text-white/80 text-[10px]">LEVEL</span>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full theme-bg-primary"
            style={{ opacity: 0.5 }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
        
        {/* Level Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">
                {levelInfo.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Level {levelInfo.level}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold theme-text-primary">
                {levelInfo.xp} / {levelInfo.xpToNextLevel} XP
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(levelInfo.progress)}%
              </p>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 theme-gradient-to-r"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Zap className="w-3 h-3 theme-text-primary" />
              <span>{levelInfo.totalXP.toLocaleString()} Total XP</span>
            </div>
            {levelInfo.level < 50 && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Star className="w-3 h-3 theme-text-primary" />
                <span>{levelInfo.xpToNextLevel - levelInfo.xp} to next level</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
