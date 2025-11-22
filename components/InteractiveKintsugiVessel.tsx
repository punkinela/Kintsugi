'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Sparkles } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';
import { getCurrentTheme, getCurrentColorMode } from '@/utils/themes';

interface Crack {
  id: string;
  path: string;
  fromEntry: string;
  isRepaired: boolean;
}

interface InteractiveKintsugiVesselProps {
  entries: JournalEntry[];
}

export default function InteractiveKintsugiVessel({ entries }: InteractiveKintsugiVesselProps) {
  const [cracks, setCracks] = useState<Crack[]>([]);
  const [rotation, setRotation] = useState(0);
  const [selectedCrack, setSelectedCrack] = useState<Crack | null>(null);
  const [vesselColors, setVesselColors] = useState({ top: '#8B7355', mid: '#6B5D4F', bottom: '#5A4E42' });

  // Debug: Log what entries the vessel receives
  console.log('🏺 Vessel received', entries.length, 'entries');

  // Get theme-aware vessel colors - updates when theme changes
  useEffect(() => {
    const updateVesselColors = () => {
      const theme = getCurrentTheme();
      const colorMode = getCurrentColorMode();
      const isDark = colorMode === 'dark' || (colorMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      console.log('🎨 Updating vase colors for theme:', theme, 'isDark:', isDark);

      // Choose vessel colors that contrast well with gold (#d97706) for each theme
      const vesselColorMap: Record<string, { top: string; mid: string; bottom: string }> = {
        // Gold theme: Rich terracotta/clay to complement gold
        gold: isDark
          ? { top: '#8B7355', mid: '#6B5D4F', bottom: '#5A4E42' } // Warm brown
          : { top: '#9C6644', mid: '#7C5436', bottom: '#6B4423' }, // Terracotta

        // Professional Blue: Slate gray (neutral, professional)
        professional: isDark
          ? { top: '#64748b', mid: '#475569', bottom: '#334155' } // Cool slate
          : { top: '#94a3b8', mid: '#64748b', bottom: '#475569' }, // Light slate

        // Energetic Purple: Warm gray to balance cool purple
        energetic: isDark
          ? { top: '#78716c', mid: '#57534e', bottom: '#44403c' } // Warm stone
          : { top: '#a8a29e', mid: '#78716c', bottom: '#57534e' }, // Light stone

        // Calm Green: Rich earth tones
        calm: isDark
          ? { top: '#92400e', mid: '#78350f', bottom: '#6B5D4F' } // Dark amber/brown
          : { top: '#a16207', mid: '#854d0e', bottom: '#713f12' }, // Warm brown

        // Bold Red: Cool gray for contrast
        bold: isDark
          ? { top: '#6b7280', mid: '#4b5563', bottom: '#374151' } // Cool gray
          : { top: '#9ca3af', mid: '#6b7280', bottom: '#4b5563' }, // Light gray

        // Elegant Rose: Warm taupe
        elegant: isDark
          ? { top: '#78716c', mid: '#57534e', bottom: '#44403c' } // Warm stone
          : { top: '#a8a29e', mid: '#78716c', bottom: '#57534e' }, // Taupe
      };

      const newColors = vesselColorMap[theme] || vesselColorMap.gold;
      console.log('🏺 Setting vase colors:', newColors);
      setVesselColors(newColors);
    };

    // Update colors on mount
    updateVesselColors();

    // Listen for theme changes
    window.addEventListener('theme-changed', updateVesselColors);

    // Also check periodically in case theme changed but event didn't fire
    const interval = setInterval(updateVesselColors, 2000);

    return () => {
      window.removeEventListener('theme-changed', updateVesselColors);
      clearInterval(interval);
    };
  }, []);

  // Generate cracks based on ALL entries (Kintsugi philosophy: every accomplishment required effort)
  const { challenges, repairedEntries } = useMemo(() => {
    // EVERY entry represents effort/challenge - that's why you documented it!
    const challenges = entries;

    // Expanded "golden repair" keywords - signs of completion, learning, and growth
    const repairWords = [
      'learned', 'grew', 'overcame', 'succeeded', 'achieved', 'accomplished',
      'completed', 'finished', 'delivered', 'shipped', 'launched', 'released',
      'solved', 'resolved', 'fixed', 'improved', 'better', 'progress',
      'advance', 'develop', 'built', 'created', 'made', 'designed',
      'implement', 'success', 'win', 'victory', 'breakthrough', 'milestone',
      'proud', 'happy', 'excited', 'grateful', 'thankful', 'appreciat',
      'understand', 'realize', 'discover', 'insight', 'figured out',
      'master', 'skill', 'expert', 'confident', 'strong', 'capable',
      'helped', 'support', 'contribut', 'impact', 'difference', 'valuable',
      // Common accomplishment verbs
      'led', 'managed', 'coordinated', 'presented', 'wrote', 'published',
      'increased', 'reduced', 'optimized', 'streamlined', 'automated',
      'organized', 'facilitated', 'negotiated', 'secured'
    ];

    // Entries are "repaired with gold" if they have:
    // 1. Repair/accomplishment keywords
    // 2. A reflection (showing thoughtfulness)
    // 3. Are substantial (50+ characters, showing detail)
    const repairedEntries = entries.filter(entry => {
      const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
      const hasRepairWords = repairWords.some(word => text.includes(word));
      const hasReflection = entry.reflection && entry.reflection.length > 10;
      const isSubstantial = entry.accomplishment.length >= 50;

      return hasRepairWords || hasReflection || isSubstantial;
    });

    console.log('🏺 Vessel analysis (NEW LOGIC):');
    console.log('   - Total entries (cracks):', challenges.length);
    console.log('   - Repaired entries (gold):', repairedEntries.length);
    console.log('   - Repair rate:', challenges.length > 0 ? `${Math.round(repairedEntries.length / challenges.length * 100)}%` : '0%');

    if (entries.length > 0) {
      console.log('   - Sample entry:', entries[0].accomplishment.substring(0, 60));
      const sampleText = `${entries[0].accomplishment} ${entries[0].reflection || ''}`.toLowerCase();
      const isRepaired = repairWords.some(word => sampleText.includes(word)) ||
                        (entries[0].reflection && entries[0].reflection.length > 10) ||
                        entries[0].accomplishment.length >= 50;
      console.log('   - Sample is repaired:', isRepaired);
    }

    return { challenges, repairedEntries };
  }, [entries]);

  // Create crack patterns
  useEffect(() => {
    try {
      console.log('🔨 Creating cracks from', challenges.length, 'entries');
      console.log('🔨 Repaired entries:', repairedEntries.length);

      const newCracks: Crack[] = challenges.slice(0, 8).map((entry, index) => {
        // Generate varied crack patterns - ALL WITHIN VESSEL BOUNDS (X: 100-200, Y: 50-340)
        const patterns = [
          'M 150,80 Q 155,120 150,160',   // Center vertical crack
          'M 120,150 Q 140,145 160,150',  // Upper horizontal crack
          'M 180,120 Q 165,140 150,160',  // Right diagonal crack
          'M 120,100 Q 125,130 130,160',  // Left upper crack
          'M 170,180 Q 160,210 150,240',  // Right lower crack
          'M 130,220 Q 135,250 140,280',  // Bottom left crack
          'M 110,140 Q 120,170 130,200',  // Left middle crack
          'M 160,200 Q 165,230 170,260',  // Right middle crack
        ];

        // Check if this entry is "repaired with gold"
        const isRepaired = repairedEntries.some(r => r.id === entry.id);

        const entryText = entry.accomplishment || 'No description';
        console.log(`   Crack ${index}: "${entryText.substring(0, 30)}" - Repaired: ${isRepaired}`);

        return {
          id: entry.id,
          path: patterns[index] || patterns[0],
          fromEntry: entry.accomplishment || '',
          isRepaired: isRepaired
        };
      });

      console.log('✅ Setting', newCracks.length, 'cracks, repaired:', newCracks.filter(c => c.isRepaired).length);
      setCracks(newCracks);
      console.log('✅ Cracks state updated successfully');
    } catch (error) {
      console.error('❌ Error in crack creation useEffect:', error);
    }
  }, [challenges, repairedEntries]);

  // Download as image
  const downloadVessel = () => {
    // In a real implementation, this would render the SVG to canvas and download
    alert('Download feature: Export your unique Kintsugi vessel as a PNG image');
  };

  // Repair stats
  const repairedCount = cracks.filter(c => c.isRepaired).length;
  const repairPercentage = cracks.length > 0 ? (repairedCount / cracks.length) * 100 : 0;

  console.log('📊 Vessel RENDER - Cracks in state:', cracks.length);
  console.log('📊 Vessel stats:', {
    cracksLength: cracks.length,
    repairedCount,
    repairPercentage: repairPercentage.toFixed(1) + '%',
    cracksState: cracks
  });

  if (cracks.length === 0 && entries.length > 0) {
    console.warn('⚠️ WARNING: Vessel has entries but no cracks! This is the bug.');
    console.log('⚠️ Entries received:', entries.length);
    console.log('⚠️ Check if useEffect is running');
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-theme-primary-light to-orange-50 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 theme-text-primary dark:theme-text-secondary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Your Kintsugi Vessel
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A visual story of resilience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRotation((rotation - 15) % 360)}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Rotate vessel"
            >
              <RotateCcw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={downloadVessel}
              className="px-3 py-2 bg-gradient-to-r from-theme-primary to-orange-600 hover:from-theme-primary hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Repair Progress */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Golden Seam Progress
          </span>
          <span className="text-sm font-bold theme-text-primary dark:theme-text-secondary">
            {repairedCount} / {cracks.length} entries enhanced
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${repairPercentage}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-theme-primary to-orange-500"
          />
        </div>
      </div>

      {/* SVG Vessel */}
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto"
          style={{ width: '300px', height: '400px' }}
        >
          <svg
            viewBox="0 0 300 400"
            className="w-full h-full drop-shadow-2xl"
          >
            {/* Vessel body */}
            <defs>
              <linearGradient id="vesselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={vesselColors.top} />
                <stop offset="50%" stopColor={vesselColors.mid} />
                <stop offset="100%" stopColor={vesselColors.bottom} />
              </linearGradient>

              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Vessel shape */}
            <path
              d="M 150,50
                 Q 120,80 120,120
                 L 100,280
                 Q 100,320 120,340
                 L 180,340
                 Q 200,320 200,280
                 L 180,120
                 Q 180,80 150,50
                 Z"
              fill="url(#vesselGradient)"
              stroke="#999"
              strokeWidth="2"
              filter="url(#shadow)"
            />

            {/* Cracks */}
            {cracks.map((crack, index) => (
              <g key={crack.id}>
                {/* Crack line */}
                <motion.path
                  d={crack.path}
                  stroke={crack.isRepaired ? '#d97706' : '#000000'}
                  strokeWidth={crack.isRepaired ? '4' : '3'}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  style={{
                    filter: crack.isRepaired ? 'drop-shadow(0 0 6px #d97706)' : 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                  }}
                  onMouseEnter={() => setSelectedCrack(crack)}
                  onMouseLeave={() => setSelectedCrack(null)}
                  className="cursor-pointer"
                />

                {/* Gold repair shimmer */}
                {crack.isRepaired && (
                  <motion.path
                    d={crack.path}
                    stroke="url(#goldShimmer)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                )}
              </g>
            ))}

            {/* Gold shimmer gradient */}
            <defs>
              <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Highlight effect */}
            <ellipse
              cx="160"
              cy="100"
              rx="30"
              ry="50"
              fill="white"
              opacity="0.2"
            />
          </svg>

          {/* Crack Info Tooltip */}
          {selectedCrack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 theme-border-light dark:theme-border-primary"
            >
              <p className="text-xs font-semibold theme-text-primary dark:theme-text-secondary mb-1">
                {selectedCrack.isRepaired ? '✨ Repaired with Gold' : '❌ Unrepaired Crack'}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {selectedCrack.fromEntry.substring(0, 100)}...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{cracks.length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Entries Documented</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold theme-text-primary dark:theme-text-secondary">{repairedCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Golden Seams</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{cracks.length - repairedCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 bg-gradient-to-r from-theme-primary-light to-orange-50  border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">金継ぎ Kintsukuroi:</span> Each crack represents an
          accomplishment you documented - proof of effort and growth. The golden repairs appear
          when you add reflection, detail, or accomplishment keywords. Your vessel grows more
          beautiful with every entry.
        </p>
      </div>
    </div>
  );
}
