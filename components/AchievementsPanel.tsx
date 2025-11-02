'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Lock } from 'lucide-react';
import { Achievement } from '@/types/engagement';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export default function AchievementsPanel({ isOpen, onClose, achievements }: AchievementsPanelProps) {
  if (!isOpen) return null;

  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">
                Achievements
              </h2>
            </div>
            <p className="text-white/90">
              {unlocked.length} of {achievements.length} unlocked
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Unlocked Achievements */}
            {unlocked.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Unlocked 🎉
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unlocked.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl shadow-lg">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {achievement.description}
                          </p>
                          {achievement.unlockedAt && (
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {locked.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Locked 🔒
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locked.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600 opacity-75"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-3xl relative">
                          <span className="opacity-30">{achievement.icon}</span>
                          <Lock className="absolute w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {achievement.description}
                          </p>
                          {achievement.progress !== undefined && achievement.target !== undefined && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress} / {achievement.target}</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
