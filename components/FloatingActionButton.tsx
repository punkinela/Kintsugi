'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, PenTool, Zap, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onQuickCapture: () => void;
  onNewEntry: () => void;
}

export default function FloatingActionButton({ onQuickCapture, onNewEntry }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);

  const actions = [
    {
      icon: Zap,
      label: 'Quick Capture',
      onClick: () => {
        onQuickCapture();
        setIsOpen(false);
      },
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: PenTool,
      label: 'Full Entry',
      onClick: () => {
        onNewEntry();
        setIsOpen(false);
      },
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Volume2,
      label: '金継ぎ (kin-TSU-gi)',
      onClick: () => {
        setShowPronunciation(true);
        setTimeout(() => setShowPronunciation(false), 3000);
        setIsOpen(false);
      },
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Pronunciation Tooltip */}
      <AnimatePresence>
        {showPronunciation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-5 rounded-2xl shadow-2xl max-w-sm"
          >
            <div className="text-center space-y-3">
              <p className="text-xl font-bold mb-2">金継ぎ Kintsugi</p>

              {/* Phonetic Pronunciation with Emphasis */}
              <div className="flex items-center justify-center gap-1 text-lg">
                <span className="font-light">kin</span>
                <span className="mx-1 text-white/60">•</span>
                <span className="font-black text-2xl text-amber-100 drop-shadow-lg">TSU</span>
                <span className="mx-1 text-white/60">•</span>
                <span className="font-light">gi</span>
              </div>

              {/* Audio Playback Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const utterance = new SpeechSynthesisUtterance('kintsugi');
                  utterance.lang = 'ja-JP';
                  utterance.rate = 0.8;
                  window.speechSynthesis.speak(utterance);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
              >
                <Volume2 className="h-4 w-4" />
                <span>Listen</span>
              </button>

              <p className="text-xs opacity-90 mt-2 border-t border-white/20 pt-2">
                The art of repairing broken pottery with gold
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-shadow group`}
              >
                <span className="font-medium text-sm whitespace-nowrap">
                  {action.label}
                </span>
                <div className="p-2 bg-white/20 rounded-full">
                  <action.icon className="h-4 w-4" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: isOpen ? 45 : 0 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r theme-gradient-to-r text-white rounded-full shadow-2xl hover:shadow-3xl transition-shadow flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>

      {/* Ripple effect on click */}
      {isOpen && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 theme-bg-secondary rounded-full"
        />
      )}
    </div>
  );
}
