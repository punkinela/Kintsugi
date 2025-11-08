'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface DayData {
  date: string;
  hasChallenge: boolean;
  hasGrowth: boolean;
  hasTransformation: boolean; // Both challenge & growth on same day
  entries: JournalEntry[];
}

interface TransformationHeatmapProps {
  entries: JournalEntry[];
  monthsToShow?: number;
}

export default function TransformationHeatmap({ entries, monthsToShow = 6 }: TransformationHeatmapProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const data: Map<string, DayData> = new Map();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - monthsToShow);

    // Initialize all days
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      data.set(dateKey, {
        date: dateKey,
        hasChallenge: false,
        hasGrowth: false,
        hasTransformation: false,
        entries: []
      });
    }

    // Classify entries
    entries.forEach(entry => {
      const dateKey = entry.date.split('T')[0];
      const dayData = data.get(dateKey);

      if (dayData) {
        dayData.entries.push(entry);

        const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
        const challengeWords = ['difficult', 'struggle', 'challenge', 'hard', 'failed', 'problem', 'stressful'];
        const growthWords = ['learned', 'grew', 'overcame', 'succeeded', 'achieved', 'realized', 'understood'];

        const isChallenge = challengeWords.some(word => text.includes(word));
        const isGrowth = growthWords.some(word => text.includes(word)) || entry.reflection;

        if (isChallenge) dayData.hasChallenge = true;
        if (isGrowth) dayData.hasGrowth = true;
        if (isChallenge && isGrowth) dayData.hasTransformation = true;
      }
    });

    return Array.from(data.values());
  }, [entries, monthsToShow]);

  // Group by weeks
  const weekGroups = useMemo(() => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    heatmapData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();

      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(day);

      // Push last week
      if (index === heatmapData.length - 1) {
        weeks.push(currentWeek);
      }
    });

    return weeks;
  }, [heatmapData]);

  // Get color for day
  const getDayColor = (day: DayData) => {
    if (day.hasTransformation) {
      return 'theme-gradient-to-br shadow-lg'; // Golden repair!
    }
    if (day.hasGrowth) {
      return 'bg-green-400 dark:bg-green-600';
    }
    if (day.hasChallenge) {
      return 'bg-red-300 dark:bg-red-700';
    }
    if (day.entries.length > 0) {
      return 'bg-gray-300 dark:bg-gray-600';
    }
    return 'bg-gray-100 dark:bg-gray-800';
  };

  // Stats
  const stats = useMemo(() => {
    const total = heatmapData.length;
    const withEntries = heatmapData.filter(d => d.entries.length > 0).length;
    const challenges = heatmapData.filter(d => d.hasChallenge).length;
    const growth = heatmapData.filter(d => d.hasGrowth).length;
    const transformations = heatmapData.filter(d => d.hasTransformation).length;

    return { total, withEntries, challenges, growth, transformations };
  }, [heatmapData]);

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 theme-gradient-to-br">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 theme-text-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Transformation Heatmap
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your golden repair moments
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold theme-text-primary">
              {stats.transformations}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              repair days
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.withEntries}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Active Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.challenges}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Challenges</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.growth}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Growth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold theme-text-primary">{stats.transformations}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Repairs</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Day Labels */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="w-8 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="space-y-1">
              {weekGroups.map((week, weekIndex) => (
                <div key={weekIndex} className="flex items-center">
                  {/* Month Label */}
                  <div className="w-12 text-xs text-gray-600 dark:text-gray-400">
                    {weekIndex % 4 === 0 && new Date(week[0].date).toLocaleDateString('en', { month: 'short' })}
                  </div>

                  {/* Days */}
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const day = week[dayIndex];

                      if (!day) {
                        return <div key={dayIndex} className="w-8 h-8" />;
                      }

                      return (
                        <motion.button
                          key={day.date}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedDay(day.entries.length > 0 ? day : null)}
                          className={`w-8 h-8 rounded ${getDayColor(day)} transition-all cursor-pointer relative group`}
                          title={`${new Date(day.date).toLocaleDateString()}: ${day.entries.length} entries`}
                        >
                          {day.hasTransformation && (
                            <Sparkles className="absolute inset-0 m-auto h-4 w-4 text-white" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
            <span className="text-gray-600 dark:text-gray-400">No entries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-300 dark:bg-red-700"></div>
            <span className="text-gray-600 dark:text-gray-400">Challenge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded theme-gradient-to-br"></div>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Golden Repair (Both!)</span>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 theme-bg-primary-light rounded-xl border-2 theme-border-primary"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 theme-text-primary" />
              <h4 className="font-bold text-gray-900 dark:text-white">
                {new Date(selectedDay.date).toLocaleDateString('en', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h4>
            </div>

            <div className="space-y-2">
              {selectedDay.entries.map(entry => (
                <div key={entry.id} className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{entry.accomplishment}</p>
                  {entry.reflection && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                      {entry.reflection}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 theme-gradient-to-br border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">金継ぎ Kintsukuroi:</span> Golden days represent moments
          when you both faced a challenge AND grew from it. These are your most valuable days of transformation.
        </p>
      </div>
    </div>
  );
}
