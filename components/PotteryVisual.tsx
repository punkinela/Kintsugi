'use client';

import { motion } from 'framer-motion';
import { Sparkles, Download, Info, X } from 'lucide-react';
import { PotteryData, Crack, POTTERY_STYLES } from '@/types/pottery';
import { useRef, useState, useEffect, useMemo } from 'react';
import { getCurrentTheme, getCurrentColorMode } from '@/utils/themes';

interface PotteryVisualProps {
  potteryData: PotteryData;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onCrackClick?: (crack: Crack) => void;
  journalEntries?: any[]; // For dynamic crack generation
}

export default function PotteryVisual({
  potteryData,
  size = 'medium',
  interactive = false,
  onCrackClick,
  journalEntries = []
}: PotteryVisualProps) {
  const style = POTTERY_STYLES[potteryData.selectedStyle];
  const svgRef = useRef<SVGSVGElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [vesselColors, setVesselColors] = useState({ fill: '#E07856', stroke: '#B85635' });

  // Get theme-aware vessel colors - same logic as InteractiveKintsugiVessel
  useEffect(() => {
    const updateVesselColors = () => {
      const theme = getCurrentTheme();
      const colorMode = getCurrentColorMode();
      const isDark = colorMode === 'dark' || (colorMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      console.log('🏺 PotteryVisual: Updating colors for theme:', theme, 'isDark:', isDark);

      // Same color scheme as InteractiveKintsugiVessel
      const vesselColorMap: Record<string, { fill: string; stroke: string }> = {
        gold: isDark
          ? { fill: '#8B7355', stroke: '#6B5D4F' }
          : { fill: '#9C6644', stroke: '#7C5436' },
        professional: isDark
          ? { fill: '#64748b', stroke: '#475569' }
          : { fill: '#94a3b8', stroke: '#64748b' },
        energetic: isDark
          ? { fill: '#78716c', stroke: '#57534e' }
          : { fill: '#a8a29e', stroke: '#78716c' },
        calm: isDark
          ? { fill: '#92400e', stroke: '#78350f' }
          : { fill: '#a16207', stroke: '#854d0e' },
        bold: isDark
          ? { fill: '#6b7280', stroke: '#4b5563' }
          : { fill: '#9ca3af', stroke: '#6b7280' },
        elegant: isDark
          ? { fill: '#78716c', stroke: '#57534e' }
          : { fill: '#a8a29e', stroke: '#78716c' },
      };

      const newColors = vesselColorMap[theme] || vesselColorMap.gold;
      console.log('🏺 PotteryVisual: Setting colors:', newColors);
      setVesselColors(newColors);
    };

    updateVesselColors();
    window.addEventListener('theme-changed', updateVesselColors);
    const interval = setInterval(updateVesselColors, 2000);

    return () => {
      window.removeEventListener('theme-changed', updateVesselColors);
      clearInterval(interval);
    };
  }, []);

  // Generate cracks dynamically from journal entries (like InteractiveKintsugiVessel)
  const dynamicCracks = useMemo(() => {
    if (journalEntries.length === 0) return [];

    // Predefined crack patterns for different pottery styles
    const crackPatterns = [
      'M 150,80 Q 155,120 150,160',   // Center vertical
      'M 120,150 Q 140,145 160,150',  // Upper horizontal
      'M 180,120 Q 165,140 150,160',  // Right diagonal
      'M 120,100 Q 125,130 130,160',  // Left upper
      'M 170,180 Q 160,210 150,240',  // Right lower
      'M 130,220 Q 135,250 140,280',  // Bottom left
      'M 110,140 Q 120,170 130,200',  // Left middle
      'M 160,200 Q 165,230 170,260',  // Right middle
    ];

    return journalEntries.slice(0, 8).map((entry, index) => {
      // Check if entry is "repaired with gold"
      const repairWords = [
        'learned', 'grew', 'overcame', 'succeeded', 'achieved', 'accomplished',
        'completed', 'finished', 'delivered', 'shipped', 'solved', 'resolved',
        'fixed', 'improved', 'better', 'progress', 'built', 'created'
      ];

      const text = `${entry.accomplishment || ''} ${entry.reflection || ''}`.toLowerCase();
      const hasRepairWords = repairWords.some(word => text.includes(word));
      const hasReflection = entry.reflection && entry.reflection.length > 10;
      const isSubstantial = (entry.accomplishment?.length || 0) >= 50;
      const fillPercentage = (hasRepairWords || hasReflection || isSubstantial) ? 100 : 0;

      return {
        id: entry.id || `crack_${index}`,
        position: { x: 50, y: 50 + (index * 30) },
        path: crackPatterns[index] || crackPatterns[0],
        createdAt: new Date(entry.date || Date.now()),
        trigger: 'challenge' as const,
        isFilled: fillPercentage === 100,
        fillPercentage,
        associatedEntryId: entry.id,
        severity: 'moderate' as const
      } as Crack;
    });
  }, [journalEntries]);

  // Size mappings
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  // Calculate stats from journal entries (like InteractiveKintsugiVessel)
  // EVERY entry is a crack - represents a challenge/effort you documented
  const totalCracks = journalEntries.length;

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
    'led', 'managed', 'coordinated', 'presented', 'wrote', 'published',
    'increased', 'reduced', 'optimized', 'streamlined', 'automated',
    'organized', 'facilitated', 'negotiated', 'secured'
  ];

  // Entries are "repaired with gold" if they have repair/accomplishment keywords, reflections, or are substantial
  const filledCracks = journalEntries.filter(entry => {
    const text = `${entry.accomplishment || ''} ${entry.reflection || ''}`.toLowerCase();
    const hasRepairWords = repairWords.some(word => text.includes(word));
    const hasReflection = entry.reflection && entry.reflection.length > 10;
    const isSubstantial = (entry.accomplishment?.length || 0) >= 50;
    return hasRepairWords || hasReflection || isSubstantial;
  }).length;

  const avgFill = totalCracks > 0 ? Math.round((filledCracks / totalCracks) * 100) : 0;

  console.log('🏺 PotteryVisual stats:', { totalCracks, filledCracks, avgFill });

  // Export pottery as image
  const handleExport = () => {
    if (!svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (higher resolution for better quality)
      canvas.width = 1200;
      canvas.height = 1200;

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Fill background with white
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw SVG
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const date = new Date().toISOString().split('T')[0];
          link.download = `kintsugi-pottery-${style.name.toLowerCase().replace(' ', '-')}-${date}.png`;
          link.href = pngUrl;
          link.click();
          URL.revokeObjectURL(pngUrl);
        });
      };

      img.src = url;
    } catch (error) {
      console.error('Error exporting pottery:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Pottery */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative ${sizeClasses[size]}`}
      >
        <svg
          ref={svgRef}
          viewBox={style.viewBox}
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vessel Base - THEME-AWARE COLORS */}
          <motion.path
            d={style.basePath}
            fill={vesselColors.fill}
            stroke={vesselColors.stroke}
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* Cracks - use dynamic cracks from journal entries */}
          {dynamicCracks.map((crack, index) => (
            <motion.g
              key={crack.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {/* Crack line (dark) */}
              <motion.path
                d={crack.path}
                stroke="#1A202C"
                strokeWidth={crack.severity === 'major' ? '3' : crack.severity === 'moderate' ? '2' : '1'}
                fill="none"
                className={interactive ? 'cursor-pointer hover:stroke-amber-600 transition-colors' : ''}
                onClick={() => interactive && onCrackClick && onCrackClick(crack)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />

              {/* Gold fill (overlay) */}
              {crack.fillPercentage > 0 && (
                <motion.path
                  d={crack.path}
                  stroke="#D4AF37"
                  strokeWidth={crack.severity === 'major' ? '4' : crack.severity === 'moderate' ? '3' : '2'}
                  fill="none"
                  filter="url(#goldGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: crack.fillPercentage / 100 }}
                  transition={{ duration: 2, delay: 1 + index * 0.1 }}
                />
              )}
            </motion.g>
          ))}

          {/* Glow filter for gold */}
          <defs>
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Gold sparkles for completed seams */}
        {filledCracks > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {dynamicCracks
              .filter(c => c.fillPercentage === 100)
              .slice(0, 3)
              .map((crack, i) => (
                <Sparkles
                  key={crack.id}
                  className="absolute text-amber-400"
                  style={{
                    left: `${crack.position.x}%`,
                    top: `${crack.position.y}%`,
                    width: '16px',
                    height: '16px'
                  }}
                />
              ))}
          </motion.div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 text-sm"
      >
        <div className="text-center">
          <div className="font-bold text-white dark:text-white">{totalCracks}</div>
          <div className="text-xs text-white/80 dark:text-gray-300">cracks</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-amber-300 dark:text-amber-400">{filledCracks}</div>
          <div className="text-xs text-white/80 dark:text-gray-300">golden seams</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-white dark:text-white">{avgFill}%</div>
          <div className="text-xs text-white/80 dark:text-gray-300">healed</div>
        </div>
      </motion.div>

      {/* Pottery name with info */}
      <div className="relative flex items-center gap-2">
        <p className="text-xs text-white/90 dark:text-gray-300 italic">
          {style.name}
        </p>
        {/* Info icon - white/light for all themes */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-white/80 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors"
          title="About Pottery Unlocking"
        >
          <Info className="h-4 w-4" />
        </button>

        {/* Info Tooltip */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-2xl border-2 border-amber-300 dark:border-amber-700 z-[100]"
          >
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Unlock New Pottery Styles
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-medium">🏺 Tea Bowl</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Now</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">🏺 Tall Vase</span>
                <span className="text-gray-600 dark:text-gray-400">5 entries</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">🍽️ Serving Plate</span>
                <span className="text-gray-600 dark:text-gray-400">12 entries</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">🏺 Storage Jar</span>
                <span className="text-gray-600 dark:text-gray-400">25 entries</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 italic">
              💡 Change pottery in <strong className="text-gray-900 dark:text-white">Personal Insights → Workshop Tools</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Export Button */}
      {size !== 'small' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg shadow-md transition-all"
        >
          <Download className="h-4 w-4" />
          Export as Image
        </motion.button>
      )}
    </div>
  );
}
