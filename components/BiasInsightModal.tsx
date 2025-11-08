'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, MessageCircle, Target, BookOpen, ArrowRight } from 'lucide-react';
import { BiasInsight } from '@/types';

interface BiasInsightModalProps {
  insight: BiasInsight | null;
  onClose: () => void;
  onTakeAction?: () => void; // NEW: Callback for taking action
}

export default function BiasInsightModal({ insight, onClose, onTakeAction }: BiasInsightModalProps) {
  const handleTakeAction = () => {
    if (onTakeAction) {
      onTakeAction();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {insight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto border theme-border-light/50 dark:theme-border-primary/30"
          >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:theme-bg-primary-light/50 dark:hover:bg-theme-primary/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-kintsugi-dark-700/80 dark:theme-text-secondary/80" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-theme-primary to-theme-primary rounded-full mb-4">
              <Lightbulb className="w-6 h-6 text-theme-primary-light" />
            </div>
            <h2 className="text-3xl font-bold text-kintsugi-dark-900 dark:text-theme-accent mb-2">
              {insight.title}
            </h2>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-lg text-kintsugi-dark-800/90 dark:theme-text-secondary/90 leading-relaxed">
              {insight.description}
            </p>
          </div>

          {/* Reflection */}
          <div className="theme-bg-primary-light/50 dark:bg-theme-primary/10 border-l-4 border-theme-secondary rounded-r-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 theme-text-primary dark:theme-text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-theme-primary dark:theme-text-secondary mb-2">
                  Reflection Question
                </h3>
                <p className="text-theme-primary/90 dark:theme-text-secondary/90">
                  {insight.reflection}
                </p>
              </div>
            </div>
          </div>

          {/* Action Step */}
          <div className="theme-bg-primary-light/30 dark:bg-theme-primary/20 border-l-4 theme-border-primary rounded-r-xl p-6">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 theme-text-primary dark:theme-text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-theme-primary dark:theme-text-secondary mb-2">
                  Action Step
                </h3>
                <p className="text-theme-primary/90 dark:theme-text-secondary/90">
                  {insight.actionStep}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {insight.actionType === 'journal' && onTakeAction && (
              <button
                onClick={handleTakeAction}
                className="flex-1 border theme-border-light dark:theme-border-primary/50 text-kintsugi-dark-800 dark:theme-text-secondary font-medium py-4 rounded-xl hover:theme-bg-primary-light/50 dark:hover:bg-theme-primary/20 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Document This
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`${insight.actionType === 'journal' && onTakeAction ? 'flex-1' : 'w-full'} bg-gradient-to-r from-theme-primary to-theme-primary text-theme-primary-light font-semibold py-4 rounded-xl hover:from-theme-primary hover:to-theme-primary transition-all`}
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
