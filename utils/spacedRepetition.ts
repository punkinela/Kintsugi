/**
 * Spaced Repetition System for Affirmations
 * Based on Ebbinghaus Forgetting Curve (1885) and Variable Rewards (Skinner, 1956)
 *
 * Research shows:
 * - Spaced repetition increases retention by 200% (Ebbinghaus, 1885)
 * - Variable rewards are more engaging than fixed schedules (Skinner, 1956)
 * - Novelty triggers dopamine release (Bunzeck & Düzel, 2006)
 */

import { Affirmation } from '@/types';
import { JourneyStage } from './journeyStages';

const STORAGE_KEY = 'kintsugi_affirmation_history';

export interface AffirmationHistory {
  affirmationId: string;
  viewedAt: string;
  journeyStage: JourneyStage;
}

/**
 * Get affirmation viewing history
 */
export function getAffirmationHistory(): AffirmationHistory[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Record an affirmation view
 */
export function recordAffirmationView(
  affirmationId: string,
  journeyStage: JourneyStage
): void {
  if (typeof window === 'undefined') return;

  const history = getAffirmationHistory();

  history.push({
    affirmationId,
    viewedAt: new Date().toISOString(),
    journeyStage
  });

  // Keep only last 100 views to prevent storage bloat
  const recentHistory = history.slice(-100);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentHistory));
}

/**
 * Calculate when an affirmation should be shown again
 * based on spaced repetition intervals
 *
 * Intervals: 1 day -> 3 days -> 7 days -> 14 days -> 30 days
 */
export function getNextReviewDate(affirmationId: string): Date | null {
  const history = getAffirmationHistory();
  const views = history.filter(h => h.affirmationId === affirmationId);

  if (views.length === 0) {
    return null; // Never seen before
  }

  const lastView = new Date(views[views.length - 1].viewedAt);
  const viewCount = views.length;

  // Spaced repetition intervals (in days)
  const intervals = [1, 3, 7, 14, 30];
  const intervalIndex = Math.min(viewCount - 1, intervals.length - 1);
  const daysUntilNext = intervals[intervalIndex];

  const nextReview = new Date(lastView);
  nextReview.setDate(nextReview.getDate() + daysUntilNext);

  return nextReview;
}

/**
 * Check if an affirmation is ready to be shown again
 */
export function isReadyForReview(affirmationId: string): boolean {
  const nextReview = getNextReviewDate(affirmationId);

  if (!nextReview) {
    return true; // Never seen, ready to show
  }

  return new Date() >= nextReview;
}

/**
 * Get recently viewed affirmation IDs (to avoid immediate repeats)
 */
export function getRecentlyViewedIds(count: number = 10): string[] {
  const history = getAffirmationHistory();
  const recent = history.slice(-count);
  return recent.map(h => h.affirmationId);
}

/**
 * Filter affirmations based on spaced repetition readiness
 * Prioritizes:
 * 1. Never seen before (highest priority)
 * 2. Ready for review (due for spaced repetition)
 * 3. Not recently viewed (avoid short-term repeats)
 */
export function filterBySpacedRepetition(
  affirmations: Affirmation[],
  prioritizeNovelty: boolean = true
): Affirmation[] {
  const recentIds = getRecentlyViewedIds(10);
  const history = getAffirmationHistory();
  const seenIds = new Set(history.map(h => h.affirmationId));

  // Categorize affirmations
  const neverSeen: Affirmation[] = [];
  const readyForReview: Affirmation[] = [];
  const notRecent: Affirmation[] = [];

  affirmations.forEach(aff => {
    if (!seenIds.has(aff.id)) {
      neverSeen.push(aff);
    } else if (isReadyForReview(aff.id) && !recentIds.includes(aff.id)) {
      readyForReview.push(aff);
    } else if (!recentIds.includes(aff.id)) {
      notRecent.push(aff);
    }
  });

  // Return prioritized list
  if (prioritizeNovelty) {
    // Favor new content (research: novelty triggers dopamine)
    return [...neverSeen, ...readyForReview, ...notRecent];
  } else {
    // Favor spaced repetition (research: repetition aids retention)
    return [...readyForReview, ...neverSeen, ...notRecent];
  }
}

/**
 * Get optimal affirmation based on:
 * - Journey stage matching
 * - Demographics matching
 * - Spaced repetition timing
 * - Novelty preference
 */
export function getOptimalAffirmation(
  affirmations: Affirmation[],
  profile: { gender?: string; ethnicity?: string },
  journeyStage: JourneyStage,
  prioritizeNovelty: boolean = true
): Affirmation | null {
  // Filter by demographics and journey stage
  const stageSuitableAffirmations = affirmations.filter(aff => {
    // Check journey stage match
    const stageMatch = aff.journeyStage
      ? aff.journeyStage.includes(journeyStage)
      : true; // No stage specified = suitable for all

    // Check demographics match
    const demoMatch = !aff.demographics ||
      ((!aff.demographics.gender || aff.demographics.gender.includes(profile.gender || '')) &&
       (!aff.demographics.ethnicity || aff.demographics.ethnicity.includes(profile.ethnicity || '')));

    return stageMatch && demoMatch;
  });

  if (stageSuitableAffirmations.length === 0) {
    // Fallback: no journey stage filter
    const fallbackAffirmations = affirmations.filter(aff => {
      const demoMatch = !aff.demographics ||
        ((!aff.demographics.gender || aff.demographics.gender.includes(profile.gender || '')) &&
         (!aff.demographics.ethnicity || aff.demographics.ethnicity.includes(profile.ethnicity || '')));
      return demoMatch;
    });

    if (fallbackAffirmations.length === 0) return null;

    const filtered = filterBySpacedRepetition(fallbackAffirmations, prioritizeNovelty);
    return filtered[0] || null;
  }

  // Apply spaced repetition filtering
  const filtered = filterBySpacedRepetition(stageSuitableAffirmations, prioritizeNovelty);

  if (filtered.length === 0) return null;

  // Variable rewards: add randomness (Skinner, 1956)
  // 70% chance of first item, 20% second, 10% third
  const rand = Math.random();
  if (rand < 0.7 && filtered[0]) {
    return filtered[0];
  } else if (rand < 0.9 && filtered[1]) {
    return filtered[1];
  } else if (filtered[2]) {
    return filtered[2];
  }

  return filtered[0] || null;
}

/**
 * Get affirmation statistics for analytics
 */
export function getAffirmationStats(): {
  totalViewed: number;
  uniqueAffirmations: number;
  averageViewsPerAffirmation: number;
  lastViewedAt: string | null;
} {
  const history = getAffirmationHistory();
  const uniqueIds = new Set(history.map(h => h.affirmationId));

  return {
    totalViewed: history.length,
    uniqueAffirmations: uniqueIds.size,
    averageViewsPerAffirmation: uniqueIds.size > 0 ? history.length / uniqueIds.size : 0,
    lastViewedAt: history.length > 0 ? history[history.length - 1].viewedAt : null
  };
}

/**
 * Clear affirmation history (for testing or reset)
 */
export function clearAffirmationHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
