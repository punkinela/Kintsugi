'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Lock } from 'lucide-react';
import { getPotteryData, changePotteryStyle, updateUnlockedStyles } from '@/utils/potteryStorage';
import { PotteryData, PotteryStyle, POTTERY_STYLES } from '@/types/pottery';
import PotterySelection from './PotterySelection';

export default function PotteryStyleChanger() {
  const [potteryData, setPotteryData] = useState<PotteryData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    // Load pottery data
    const data = getPotteryData();
    if (data) {
      setPotteryData(data);
    }

    // Get total entries for unlock logic
    const stored = localStorage.getItem('kintsugi_engagement');
    if (stored) {
      try {
        const engagement = JSON.parse(stored);
        setTotalEntries(engagement.journalEntries?.length || 0);
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    }
  }, []);

  const handleStyleChange = (newStyle: PotteryStyle) => {
    if (!potteryData) return;

    const updated = changePotteryStyle(potteryData, newStyle);
    if (updated) {
      setPotteryData(updated);
      setShowModal(false);
    }
  };

  if (!potteryData) {
    return (
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Your Pottery Vessel
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No pottery data found. Complete your profile setup to select your vessel.
        </p>
      </div>
    );
  }

  const currentStyle = POTTERY_STYLES[potteryData.selectedStyle];
  const unlockedCount = potteryData.unlockedStyles.length;

  return (
    <>
      {/* Pottery Selection Modal */}
      {showModal && (
        <PotterySelection
          currentEntryCount={totalEntries}
          onSelect={handleStyleChange}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Your Pottery Vessel
        </h3>

        <div className="flex items-start gap-6 mb-6">
          {/* Current Pottery Preview */}
          <div className="flex-shrink-0">
            <svg
              viewBox={currentStyle.viewBox}
              className="w-32 h-32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={currentStyle.basePath}
                fill="#8B7355"
                stroke="#5D4E37"
                strokeWidth="2"
              />
              {/* Sample gold crack */}
              <path
                d="M75,80 Q90,100 85,120"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="mb-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {currentStyle.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStyle.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Unlocked Styles
                </div>
                <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                  {unlockedCount}/4
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  Cracks Repaired
                </div>
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {potteryData.totalGoldenSeams}
                </div>
              </div>
            </div>

            {/* Change Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Change Pottery Style
            </motion.button>
          </div>
        </div>

        {/* Unlock Progress */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Unlock Progress
          </h4>
          <div className="space-y-2">
            {(Object.keys(POTTERY_STYLES) as PotteryStyle[]).map((styleId) => {
              const style = POTTERY_STYLES[styleId];
              const isUnlocked = potteryData.unlockedStyles.includes(styleId);
              const isCurrent = potteryData.selectedStyle === styleId;

              return (
                <div
                  key={styleId}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    isCurrent
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : isUnlocked
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : 'bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCurrent && <Check className="h-4 w-4 text-amber-600" />}
                    {!isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                    <span className={`text-sm ${
                      isCurrent ? 'font-bold text-amber-800 dark:text-amber-200' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {style.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isUnlocked ? (
                      isCurrent ? '(Current)' : 'Unlocked ✨'
                    ) : (
                      `Unlock at ${style.unlockAt} entries`
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4 text-center">
          Your pottery evolves as you journal. Unlock new styles by documenting your journey.
        </p>
      </div>
    </>
  );
}
