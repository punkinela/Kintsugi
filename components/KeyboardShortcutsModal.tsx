'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { getAllShortcutsList, formatShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
  shortcuts: Array<{
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
  }>;
}

export default function KeyboardShortcutsModal({ onClose, shortcuts }: KeyboardShortcutsModalProps) {
  const shortcutsList = shortcuts.map(s => ({
    shortcut: formatShortcut(s),
    description: s.description
  }));

  // Group shortcuts by category
  const navigation = shortcutsList.filter(s =>
    s.description.toLowerCase().includes('go to')
  );

  const actions = shortcutsList.filter(s =>
    !s.description.toLowerCase().includes('go to') &&
    !s.description.toLowerCase().includes('toggle') &&
    !s.description.toLowerCase().includes('show')
  );

  const ui = shortcutsList.filter(s =>
    s.description.toLowerCase().includes('toggle') ||
    s.description.toLowerCase().includes('show')
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 rounded-lg">
                  <Keyboard className="h-6 w-6 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-300">
                    Navigate faster with these shortcuts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-dark-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-kintsugi-dark-600 dark:text-kintsugi-gold-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Navigation */}
              {navigation.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-kintsugi-dark-700 dark:text-kintsugi-gold-300 mb-3 uppercase tracking-wide">
                    Navigation
                  </h3>
                  <div className="space-y-2">
                    {navigation.map((item, index) => (
                      <ShortcutRow key={index} {...item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-kintsugi-dark-700 dark:text-kintsugi-gold-300 mb-3 uppercase tracking-wide">
                    Actions
                  </h3>
                  <div className="space-y-2">
                    {actions.map((item, index) => (
                      <ShortcutRow key={index} {...item} />
                    ))}
                  </div>
                </div>
              )}

              {/* UI Controls */}
              {ui.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-kintsugi-dark-700 dark:text-kintsugi-gold-300 mb-3 uppercase tracking-wide">
                    UI Controls
                  </h3>
                  <div className="space-y-2">
                    {ui.map((item, index) => (
                      <ShortcutRow key={index} {...item} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900/50 rounded-b-2xl border-t border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
              <p className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400 text-center">
                Press <kbd className="px-2 py-1 bg-white dark:bg-kintsugi-dark-700 rounded text-kintsugi-dark-900 dark:text-white text-xs font-mono">Shift+?</kbd> anytime to view this menu
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

function ShortcutRow({ shortcut, description }: { shortcut: string; description: string }) {
  const keys = shortcut.split('+');

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-kintsugi-gold-50 dark:hover:bg-kintsugi-dark-700/50 transition-colors">
      <span className="text-sm text-kintsugi-dark-700 dark:text-kintsugi-gold-200">
        {description}
      </span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <span key={index} className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white dark:bg-kintsugi-dark-800 border border-kintsugi-gold-300 dark:border-kintsugi-dark-600 rounded text-kintsugi-dark-900 dark:text-white text-xs font-mono shadow-sm">
              {key}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-kintsugi-dark-400 dark:text-kintsugi-gold-500 text-xs">+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
