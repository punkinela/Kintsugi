'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Calendar, Tag } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { getEngagementData, saveEngagementData } from '@/utils/engagement';

interface ProgressJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressJournal({ isOpen, onClose }: ProgressJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    return getEngagementData().journalEntries;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ accomplishment: '', reflection: '', category: '' });

  const handleAddEntry = () => {
    if (!newEntry.accomplishment.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      accomplishment: newEntry.accomplishment,
      reflection: newEntry.reflection || undefined,
      category: newEntry.category || undefined,
    };

    const data = getEngagementData();
    data.journalEntries.unshift(entry);
    saveEngagementData(data);
    
    setEntries(data.journalEntries);
    setNewEntry({ accomplishment: '', reflection: '', category: '' });
    setShowAddForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-3xl bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border theme-border-light/50 dark:theme-border-primary/30"
        >
          {/* Header */}
          <div className="p-6 border-b theme-border-light/50 dark:theme-border-primary/30">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:theme-bg-primary-light/50 dark:hover:bg-theme-primary/30 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-kintsugi-dark-700/80 dark:theme-text-secondary/80" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 theme-text-primary" />
              <h2 className="text-3xl font-bold text-kintsugi-dark-900 dark:text-theme-accent">
                My Accomplishments
              </h2>
            </div>
            <p className="text-kintsugi-dark-700/80 dark:theme-text-secondary/80">
              Document your achievements - they deserve to be remembered
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Entry Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-theme-primary to-theme-primary text-theme-primary-light font-semibold rounded-xl hover:from-theme-primary hover:to-theme-primary transition-all"
              >
                <Plus className="w-5 h-5" />
                Record an Accomplishment
              </button>
            )}

            {/* Add Entry Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-6 theme-bg-primary-light/50 dark:bg-theme-primary/10 rounded-2xl border theme-border-light/70 dark:theme-border-primary/30"
              >
                <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-theme-accent mb-4">
                  New Accomplishment
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What did you accomplish? *
                    </label>
                    <textarea
                      value={newEntry.accomplishment}
                      onChange={(e) => setNewEntry({ ...newEntry, accomplishment: e.target.value })}
                      placeholder="e.g., Led a successful project presentation to 50+ stakeholders"
                      className="w-full px-4 py-3 rounded-xl border theme-border-light/70 dark:theme-border-primary/30 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-theme-accent focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reflection (Optional)
                    </label>
                    <textarea
                      value={newEntry.reflection}
                      onChange={(e) => setNewEntry({ ...newEntry, reflection: e.target.value })}
                      placeholder="How did this make you feel? What did you learn?"
                      className="w-full px-4 py-3 rounded-xl border theme-border-light/70 dark:theme-border-primary/30 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-theme-accent focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category (Optional)
                    </label>
                    <input
                      type="text"
                      value={newEntry.category}
                      onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                      placeholder="e.g., Leadership, Technical, Creative"
                      className="w-full px-4 py-3 rounded-xl border theme-border-light/70 dark:theme-border-primary/30 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-theme-accent focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddEntry}
                      className="flex-1 bg-gradient-to-r from-theme-primary to-theme-primary text-theme-primary-light font-semibold py-3 rounded-xl hover:from-theme-primary hover:to-theme-primary transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewEntry({ accomplishment: '', reflection: '', category: '' });
                      }}
                      className="flex-1 theme-bg-primary-light/50 dark:bg-theme-primary/20 text-kintsugi-dark-800 dark:theme-text-secondary font-semibold py-3 rounded-xl hover:bg-theme-accent/70 dark:hover:bg-theme-primary/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Entries List */}
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 theme-text-secondary dark:text-theme-primary/50 mx-auto mb-4" />
                <p className="text-kintsugi-dark-700/80 dark:theme-text-secondary/80 text-lg">
                  No accomplishments recorded yet
                </p>
                <p className="text-kintsugi-dark-700/60 dark:theme-text-secondary/60 text-sm mt-2">
                  Start documenting your achievements!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 theme-bg-primary-light/30 dark:bg-theme-primary/10 rounded-xl border theme-border-light/50 dark:theme-border-primary/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-kintsugi-dark-700/80 dark:theme-text-secondary/80">
                        <Calendar className="w-4 h-4" />
                        {formatDate(entry.date)}
                      </div>
                      {entry.category && (
                        <div className="flex items-center gap-1 px-3 py-1 theme-bg-primary-light/70 dark:bg-theme-primary/30 text-theme-primary dark:theme-text-secondary rounded-full text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {entry.category}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-kintsugi-dark-900 dark:text-theme-accent font-medium mb-2">
                      {entry.accomplishment}
                    </p>
                    
                    {entry.reflection && (
                      <p className="text-kintsugi-dark-700/90 dark:theme-text-secondary/90 text-sm italic">
                        "{entry.reflection}"
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
