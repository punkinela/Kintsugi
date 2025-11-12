'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Lock } from 'lucide-react';
import { PotteryStyle, POTTERY_STYLES } from '@/types/pottery';
import { useState } from 'react';
import { playPotterySelectSound, areSoundsEnabled } from '@/utils/potterySounds';

interface PotterySelectionProps {
  currentEntryCount: number;
  onSelect: (style: PotteryStyle) => void;
  onClose: () => void;
}

export default function PotterySelection({
  currentEntryCount,
  onSelect,
  onClose
}: PotterySelectionProps) {
  const [selectedStyle, setSelectedStyle] = useState<PotteryStyle>('bowl');

  // Debug: Log pottery styles on mount
  console.log('🏺 Pottery Selection Modal:', {
    totalStyles: Object.keys(POTTERY_STYLES).length,
    styles: Object.keys(POTTERY_STYLES),
    currentEntryCount
  });

  const handleConfirm = () => {
    if (areSoundsEnabled()) {
      playPotterySelectSound();
    }
    onSelect(selectedStyle);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Choose Your Vessel 🏺
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-3">
              Select the pottery that resonates with your journey. As you document challenges,
              cracks will appear. As you reflect and grow, gold will fill them.
            </p>
            {/* Vessel Count Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <span className="text-amber-800 dark:text-amber-200 text-sm font-semibold">
                4 Unique Vessels Available
              </span>
              <span className="text-amber-600 dark:text-amber-400 text-xs">
                (Unlock more as you journal)
              </span>
            </div>
          </div>

          {/* Pottery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {(Object.keys(POTTERY_STYLES) as PotteryStyle[]).map((styleId, index) => {
              const style = POTTERY_STYLES[styleId];
              const isUnlocked = currentEntryCount >= style.unlockAt;
              const isSelected = selectedStyle === styleId;

              return (
                <motion.button
                  key={styleId}
                  onClick={() => isUnlocked && setSelectedStyle(styleId)}
                  disabled={!isUnlocked}
                  whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all text-left
                    ${isSelected
                      ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg'
                      : isUnlocked
                      ? 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 bg-white dark:bg-kintsugi-dark-700'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-kintsugi-dark-900/50 opacity-60 cursor-not-allowed'
                    }
                  `}
                >
                  {/* Number badge in top-left */}
                  <div className="absolute top-3 left-3 bg-gray-800 dark:bg-gray-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Lock badge for locked styles */}
                  {!isUnlocked && (
                    <div className="absolute top-3 right-3 bg-gray-400 text-white rounded-full p-2">
                      <Lock className="h-4 w-4" />
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 bg-amber-500 text-white rounded-full p-2"
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}

                  {/* Simple pottery preview */}
                  <div className="mb-4 flex justify-center">
                    <svg
                      viewBox={style.viewBox}
                      className="w-24 h-24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d={style.basePath}
                        fill={isUnlocked ? '#8B7355' : '#9CA3AF'}
                        stroke={isUnlocked ? '#5D4E37' : '#6B7280'}
                        strokeWidth="2"
                      />
                      {/* Add a sample gold crack for visual interest */}
                      {isUnlocked && (
                        <path
                          d="M75,80 Q90,100 85,120"
                          stroke="#D4AF37"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.6"
                        />
                      )}
                    </svg>
                  </div>

                  {/* Info */}
                  <h3 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                    {style.name}
                  </h3>
                  <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>
                    {style.description}
                  </p>

                  {/* Unlock requirement */}
                  {!isUnlocked && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>
                        Unlock at {style.unlockAt} entries
                        ({style.unlockAt - currentEntryCount} more needed)
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Confirm Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Begin My Kintsugi Journey with {POTTERY_STYLES[selectedStyle].name}
          </motion.button>

          {/* Philosophy note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 italic">
            "Every crack is where the gold enters. Every vessel tells a unique story."
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
