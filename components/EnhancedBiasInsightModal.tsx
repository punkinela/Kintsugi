'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, MessageCircle, Target, BookOpen, ArrowRight, BarChart3, ExternalLink, CheckCircle2 } from 'lucide-react';
import { BiasInsight } from '@/types';
import { getResearchForInsight } from '@/data/researchData';

interface EnhancedBiasInsightModalProps {
  insight: BiasInsight | null;
  onClose: () => void;
  onTakeAction?: () => void;
}

export default function EnhancedBiasInsightModal({ insight, onClose, onTakeAction }: EnhancedBiasInsightModalProps) {
  const [showResearch, setShowResearch] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);

  const handleTakeAction = () => {
    if (onTakeAction) {
      onTakeAction();
    }
    onClose();
  };

  const research = insight ? getResearchForInsight(insight.id) : null;

  return (
    <AnimatePresence>
      {insight && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {insight.title}
              </h2>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {insight.description}
              </p>
            </div>

            {/* Research Section - Collapsible */}
            {research && (
              <div className="mb-6">
                <button
                  onClick={() => setShowResearch(!showResearch)}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-200">
                      View Research & Statistics
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showResearch ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 transform rotate-90" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showResearch && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        {/* Statistics */}
                        {research.statistics && research.statistics.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Key Statistics
                            </h4>
                            <div className="space-y-2">
                              {research.statistics.map((stat: any, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                                      {stat.text}
                                    </p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                      Source: {stat.source}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Citations */}
                        {research.citations && research.citations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                              Research Citations
                            </h4>
                            <div className="space-y-3">
                              {research.citations.map((citation: any, index: number) => (
                                <div key={index} className="text-sm">
                                  <p className="text-blue-800 dark:text-blue-300">
                                    <span className="font-medium">{citation.author}</span> ({citation.year}).{' '}
                                    <span className="italic">{citation.title}</span>
                                    {citation.journal && <span>. {citation.journal}</span>}
                                    {citation.publisher && <span>. {citation.publisher}</span>}
                                  </p>
                                  {citation.link && (
                                    <a
                                      href={citation.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      View Research
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Reflection */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    Reflection Question
                  </h3>
                  <p className="text-purple-800 dark:text-purple-300">
                    {insight.reflection}
                  </p>
                  
                  {/* Interactive Reflection Checkbox */}
                  <div className="mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interactionComplete}
                        onChange={(e) => setInteractionComplete(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-purple-700 dark:text-purple-300">
                        I've reflected on this question
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Step */}
            <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500 rounded-r-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    Action Step
                  </h3>
                  <p className="text-teal-800 dark:text-teal-300">
                    {insight.actionStep}
                  </p>
                </div>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                💡 Why This Matters
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Understanding and addressing this bias helps you recognize your true worth, advance your career, and create more equitable environments for yourself and others.
              </p>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-3">
              {insight.actionType === 'journal' && onTakeAction && (
                <button
                  onClick={handleTakeAction}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-4 rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  Document This
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className={`${insight.actionType === 'journal' && onTakeAction ? 'flex-1' : 'w-full'} bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg`}
              >
                Got it!
              </button>
            </div>
            
            {/* Progress Indicator */}
            {interactionComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Great! You've engaged with this insight.
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
