'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, PenTool, Zap } from 'lucide-react';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onQuickCapture: () => void;
  onNewEntry: () => void;
}

export default function FloatingActionButton({ onQuickCapture, onNewEntry }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: -5 }}
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
        className="w-16 h-16 bg-gradient-to-r from-kintsugi-gold-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-shadow flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>

      {/* Ripple effect on click */}
      {isOpen && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-kintsugi-gold-400 rounded-full"
        />
      )}
    </div>
  );
}
