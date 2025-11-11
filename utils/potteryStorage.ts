/**
 * Pottery Data Storage & Management
 *
 * Handles localStorage persistence and business logic for pottery visual feature
 */

import { PotteryData, Crack, PotteryStyle, CrackTrigger, generateCrackPath, calculateGoldFill } from '@/types/pottery';
import { JournalEntry } from '@/types/engagement';

const STORAGE_KEY = 'kintsugi_pottery_data';

/**
 * Get user's pottery data from localStorage
 */
export function getPotteryData(): PotteryData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    // Convert date strings back to Date objects
    data.createdAt = new Date(data.createdAt);
    data.lastUpdated = new Date(data.lastUpdated);
    data.cracks = data.cracks.map((crack: any) => ({
      ...crack,
      createdAt: new Date(crack.createdAt)
    }));
    return data;
  } catch (error) {
    console.error('Error parsing pottery data:', error);
    return null;
  }
}

/**
 * Save pottery data to localStorage
 */
export function savePotteryData(data: PotteryData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving pottery data:', error);
  }
}

/**
 * Initialize pottery data for first-time user
 */
export function initializePotteryData(selectedStyle: PotteryStyle): PotteryData {
  const data: PotteryData = {
    selectedStyle,
    cracks: [],
    unlockedStyles: ['bowl'], // Bowl always unlocked
    createdAt: new Date(),
    lastUpdated: new Date(),
    totalGoldenSeams: 0
  };

  savePotteryData(data);
  return data;
}

/**
 * Add a crack based on a challenging journal entry
 */
export function addCrack(
  potteryData: PotteryData,
  trigger: CrackTrigger,
  severity: 'minor' | 'moderate' | 'major',
  entryId?: string
): PotteryData {
  // Generate random position for crack start
  const position = {
    x: 30 + Math.random() * 40, // Center area: 30-70%
    y: 30 + Math.random() * 40
  };

  // Generate crack path based on pottery style
  const path = generateCrackPath(potteryData.selectedStyle, position, severity);

  const newCrack: Crack = {
    id: `crack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    position,
    path,
    createdAt: new Date(),
    trigger,
    isFilled: false,
    fillPercentage: 0,
    associatedEntryId: entryId,
    severity
  };

  const updatedData = {
    ...potteryData,
    cracks: [...potteryData.cracks, newCrack],
    lastUpdated: new Date()
  };

  savePotteryData(updatedData);
  return updatedData;
}

/**
 * Update gold fill for a crack
 */
export function updateCrackGoldFill(
  potteryData: PotteryData,
  crackId: string,
  reflectionCount: number
): PotteryData {
  const crack = potteryData.cracks.find(c => c.id === crackId);
  if (!crack) return potteryData;

  const daysSince = Math.floor(
    (new Date().getTime() - crack.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const newFillPercentage = calculateGoldFill(crack, reflectionCount, daysSince);

  const updatedCracks = potteryData.cracks.map(c =>
    c.id === crackId
      ? { ...c, fillPercentage: newFillPercentage, isFilled: newFillPercentage === 100 }
      : c
  );

  const totalGoldenSeams = updatedCracks.filter(c => c.isFilled).length;

  const updatedData = {
    ...potteryData,
    cracks: updatedCracks,
    totalGoldenSeams,
    lastUpdated: new Date()
  };

  savePotteryData(updatedData);
  return updatedData;
}

/**
 * Update all cracks' gold fill based on time and reflections
 */
export function updateAllCracksGoldFill(
  potteryData: PotteryData,
  journalEntries: JournalEntry[]
): PotteryData {
  let updated = { ...potteryData };

  potteryData.cracks.forEach(crack => {
    // Count reflections related to this crack
    const relatedEntry = journalEntries.find(e => e.id === crack.associatedEntryId);
    const reflectionCount = relatedEntry?.reflection ? 1 : 0;

    updated = updateCrackGoldFill(updated, crack.id, reflectionCount);
  });

  return updated;
}

/**
 * Check for unlocked pottery styles based on entry count
 */
export function updateUnlockedStyles(
  potteryData: PotteryData,
  entryCount: number
): PotteryData {
  const unlockedStyles: PotteryStyle[] = ['bowl']; // Bowl always unlocked

  if (entryCount >= 10) unlockedStyles.push('vase');
  if (entryCount >= 25) unlockedStyles.push('plate');
  if (entryCount >= 50) unlockedStyles.push('jar');

  const updatedData = {
    ...potteryData,
    unlockedStyles,
    lastUpdated: new Date()
  };

  savePotteryData(updatedData);
  return updatedData;
}

/**
 * Change pottery style (if unlocked)
 */
export function changePotteryStyle(
  potteryData: PotteryData,
  newStyle: PotteryStyle
): PotteryData | null {
  if (!potteryData.unlockedStyles.includes(newStyle)) {
    console.warn(`Style ${newStyle} is not unlocked yet`);
    return null;
  }

  const updatedData = {
    ...potteryData,
    selectedStyle: newStyle,
    lastUpdated: new Date()
  };

  savePotteryData(updatedData);
  return updatedData;
}

/**
 * Auto-create cracks based on journal entry mood/category
 */
export function autoCreateCrackFromEntry(
  potteryData: PotteryData,
  entry: JournalEntry
): PotteryData {
  // Determine if entry should create a crack
  const shouldCreateCrack =
    entry.mood === 'challenging' ||
    entry.mood === 'difficult' ||
    entry.category === 'setback';

  if (!shouldCreateCrack) return potteryData;

  // Determine severity based on entry
  let severity: 'minor' | 'moderate' | 'major' = 'moderate';
  if (entry.mood === 'difficult') severity = 'major';
  if (entry.mood === 'challenging') severity = 'moderate';

  return addCrack(potteryData, 'challenge', severity, entry.id);
}

/**
 * Get pottery stats for display
 */
export function getPotteryStats(potteryData: PotteryData) {
  const totalCracks = potteryData.cracks.length;
  const goldenSeams = potteryData.totalGoldenSeams;
  const avgFill = totalCracks > 0
    ? potteryData.cracks.reduce((sum, c) => sum + c.fillPercentage, 0) / totalCracks
    : 0;
  const healingProgress = Math.round(avgFill);

  return {
    totalCracks,
    goldenSeams,
    healingProgress,
    daysSinceStart: Math.floor(
      (new Date().getTime() - potteryData.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )
  };
}
