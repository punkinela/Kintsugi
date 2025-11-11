'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PotteryData, Crack, POTTERY_STYLES } from '@/types/pottery';

interface PotteryVisualProps {
  potteryData: PotteryData;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onCrackClick?: (crack: Crack) => void;
}

export default function PotteryVisual({
  potteryData,
  size = 'medium',
  interactive = false,
  onCrackClick
}: PotteryVisualProps) {
  const style = POTTERY_STYLES[potteryData.selectedStyle];

  // Size mappings
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  // Calculate stats
  const totalCracks = potteryData.cracks.length;
  const filledCracks = potteryData.cracks.filter(c => c.fillPercentage === 100).length;
  const avgFill = totalCracks > 0
    ? potteryData.cracks.reduce((sum, c) => sum + c.fillPercentage, 0) / totalCracks
    : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Pottery */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative ${sizeClasses[size]}`}
      >
        <svg
          viewBox={style.viewBox}
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vessel Base */}
          <motion.path
            d={style.basePath}
            fill="#8B7355"
            stroke="#5D4E37"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* Cracks */}
          {potteryData.cracks.map((crack, index) => (
            <motion.g
              key={crack.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {/* Crack line (dark) */}
              <motion.path
                d={crack.path}
                stroke="#1A202C"
                strokeWidth={crack.severity === 'major' ? '3' : crack.severity === 'moderate' ? '2' : '1'}
                fill="none"
                className={interactive ? 'cursor-pointer hover:stroke-amber-600 transition-colors' : ''}
                onClick={() => interactive && onCrackClick && onCrackClick(crack)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />

              {/* Gold fill (overlay) */}
              {crack.fillPercentage > 0 && (
                <motion.path
                  d={crack.path}
                  stroke="#D4AF37"
                  strokeWidth={crack.severity === 'major' ? '4' : crack.severity === 'moderate' ? '3' : '2'}
                  fill="none"
                  filter="url(#goldGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: crack.fillPercentage / 100 }}
                  transition={{ duration: 2, delay: 1 + index * 0.1 }}
                />
              )}
            </motion.g>
          ))}

          {/* Glow filter for gold */}
          <defs>
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Gold sparkles for completed seams */}
        {filledCracks > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {potteryData.cracks
              .filter(c => c.fillPercentage === 100)
              .slice(0, 3)
              .map((crack, i) => (
                <Sparkles
                  key={crack.id}
                  className="absolute text-amber-400"
                  style={{
                    left: `${crack.position.x}%`,
                    top: `${crack.position.y}%`,
                    width: '16px',
                    height: '16px'
                  }}
                />
              ))}
          </motion.div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 text-sm"
      >
        <div className="text-center">
          <div className="font-bold text-gray-800 dark:text-gray-200">{totalCracks}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">cracks</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-amber-600 dark:text-amber-400">{filledCracks}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">golden seams</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-800 dark:text-gray-200">{Math.round(avgFill)}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">healed</div>
        </div>
      </motion.div>

      {/* Pottery name */}
      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
        {style.name}
      </p>
    </div>
  );
}
