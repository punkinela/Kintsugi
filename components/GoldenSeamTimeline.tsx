'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface Connection {
  id: string;
  challengeEntry: JournalEntry;
  growthEntry: JournalEntry;
  connectionNote: string;
}

interface GoldenSeamTimelineProps {
  entries: JournalEntry[];
}

export default function GoldenSeamTimeline({ entries }: GoldenSeamTimelineProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [isLinkingMode, setIsLinkingMode] = useState(false);
  const [linkingFrom, setLinkingFrom] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = () => {
    try {
      const saved = localStorage.getItem('kintsugi_golden_seams');
      if (saved) {
        setConnections(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const saveConnections = (newConnections: Connection[]) => {
    try {
      localStorage.setItem('kintsugi_golden_seams', JSON.stringify(newConnections));
      setConnections(newConnections);
    } catch (error) {
      console.error('Error saving connections:', error);
    }
  };

  const createConnection = (from: JournalEntry, to: JournalEntry, note: string) => {
    const newConnection: Connection = {
      id: `${from.id}-${to.id}-${Date.now()}`,
      challengeEntry: from,
      growthEntry: to,
      connectionNote: note
    };

    saveConnections([...connections, newConnection]);
    setIsLinkingMode(false);
    setLinkingFrom(null);
  };

  const startLinking = (entry: JournalEntry) => {
    setLinkingFrom(entry);
    setIsLinkingMode(true);
  };

  const completeLink = (toEntry: JournalEntry) => {
    if (!linkingFrom) return;

    const note = prompt(
      `Describe how "${linkingFrom.accomplishment.substring(0, 50)}..." led to "${toEntry.accomplishment.substring(0, 50)}..."`
    );

    if (note) {
      createConnection(linkingFrom, toEntry, note);
    }

    setIsLinkingMode(false);
    setLinkingFrom(null);
  };

  // Sort entries chronologically
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Identify entries that are part of connections
  const getEntryConnections = (entryId: string) => {
    return connections.filter(
      c => c.challengeEntry.id === entryId || c.growthEntry.id === entryId
    );
  };

  const isChallenge = (entry: JournalEntry) => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
    const challengeWords = ['difficult', 'struggle', 'challenge', 'hard', 'failed', 'problem'];
    return challengeWords.some(word => text.includes(word));
  };

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 theme-gradient-to-br">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2 className="h-6 w-6 theme-text-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Golden Seam Timeline
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect challenges to resulting growth
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold theme-text-primary">
              {connections.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              golden seams
            </div>
          </div>
        </div>
      </div>

      {/* Linking Mode Banner */}
      <AnimatePresence>
        {isLinkingMode && linkingFrom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-3 theme-bg-primary-light border-b theme-border-primary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Linking from: {linkingFrom.accomplishment.substring(0, 60)}...
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Click another entry to create a golden seam connection
                </p>
              </div>
              <button
                onClick={() => {
                  setIsLinkingMode(false);
                  setLinkingFrom(null);
                }}
                className="px-3 py-1 theme-btn-primary text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="p-6 relative max-h-[600px] overflow-y-auto">
        {/* Vertical Timeline Line */}
        <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />

        <div className="space-y-6 relative">
          {sortedEntries.map((entry, index) => {
            const entryConnections = getEntryConnections(entry.id);
            const hasConnections = entryConnections.length > 0;
            const entryIsChallenge = isChallenge(entry);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-16"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-9 top-2 w-6 h-6 rounded-full border-4 ${
                  hasConnections
                    ? 'theme-bg-primary theme-border-primary shadow-lg'
                    : entryIsChallenge
                    ? 'bg-red-400 border-red-200 dark:border-red-700'
                    : 'bg-green-400 border-green-200 dark:border-green-700'
                }`} />

                {/* Entry Card */}
                <div
                  className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 cursor-pointer transition-all ${
                    hasConnections
                      ? 'theme-border-primary hover:shadow-xl'
                      : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
                  } ${isLinkingMode && linkingFrom?.id !== entry.id ? 'hover:theme-border-accent' : ''}`}
                  onClick={() => {
                    if (isLinkingMode && linkingFrom?.id !== entry.id) {
                      completeLink(entry);
                    } else {
                      setSelectedEntry(selectedEntry === entry.id ? null : entry.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>

                    {!isLinkingMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startLinking(entry);
                        }}
                        className="px-2 py-1 theme-bg-primary-light hover:theme-bg-primary theme-text-primary hover:text-white text-xs rounded transition-colors flex items-center gap-1"
                      >
                        <Link2 className="h-3 w-3" />
                        Link
                      </button>
                    )}
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {entry.accomplishment}
                  </p>

                  {entry.reflection && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {entry.reflection}
                    </p>
                  )}

                  {/* Show Connections */}
                  {entryConnections.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {entryConnections.map(conn => {
                        const isFrom = conn.challengeEntry.id === entry.id;
                        const linkedEntry = isFrom ? conn.growthEntry : conn.challengeEntry;

                        return (
                          <div
                            key={conn.id}
                            className="flex items-start gap-2 p-2 theme-bg-primary-light rounded border theme-border-primary"
                          >
                            <Sparkles className="h-4 w-4 theme-text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold theme-text-primary">
                                {isFrom ? 'Led to →' : '← Grew from'}
                              </p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                                "{conn.connectionNote}"
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {linkedEntry.accomplishment.substring(0, 60)}...
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Connection Lines */}
                {entryConnections.map(conn => {
                  if (conn.challengeEntry.id === entry.id) {
                    return (
                      <motion.div
                        key={conn.id}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute left-12 top-8 w-1 h-20 theme-gradient opacity-50"
                      />
                    );
                  }
                  return null;
                })}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 theme-gradient-to-br border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">金継ぎ Kintsukuroi:</span> Create golden connections
          between your challenges and the strengths they revealed. These connections tell your
          complete story of resilience and growth.
        </p>
      </div>
    </div>
  );
}
