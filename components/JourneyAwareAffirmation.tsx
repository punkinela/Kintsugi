'use client';

import { useState, useEffect } from 'react';
import { Affirmation } from '@/types';
import AffirmationCard from './AffirmationCard';
import { affirmations } from '@/data/affirmations';
import { journeyAffirmations } from '@/data/journeyAffirmations';
import { getOptimalAffirmation, recordAffirmationView } from '@/utils/spacedRepetition';
import { calculateJourneyStage } from '@/utils/journeyStages';
import { getEngagementData } from '@/utils/engagement';
import { recordAffirmationView as recordEngagementView } from '@/utils/engagement';

/**
 * Journey-Aware Affirmation Component
 *
 * Features:
 * - Auto-rotates on each app open (spaced repetition)
 * - Filters by journey stage (skeptic/engaged/advocate)
 * - Filters by demographics (gender, ethnicity)
 * - Shows research citations for credibility
 * - Maintains Kintsugi philosophy (wins + resilience)
 *
 * Research-Backed:
 * - Ebbinghaus (1885): Spaced repetition
 * - Skinner (1956): Variable rewards
 * - Bunzeck & Düzel (2006): Novelty triggers dopamine
 */

interface JourneyAwareAffirmationProps {
  profile?: {
    gender?: string;
    ethnicity?: string;
    createdAt?: string;
  };
}

export default function JourneyAwareAffirmation({ profile }: JourneyAwareAffirmationProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load affirmation on mount
  useEffect(() => {
    loadOptimalAffirmation();
  }, []);

  const loadOptimalAffirmation = () => {
    setIsLoading(true);

    // Get user's engagement data and journey stage
    const engagement = getEngagementData();
    const journeyInfo = calculateJourneyStage(engagement, profile?.createdAt);

    // Combine both affirmation libraries
    const allAffirmations = [...affirmations, ...journeyAffirmations];

    // Get optimal affirmation based on:
    // - Journey stage
    // - Demographics
    // - Spaced repetition timing
    // - Novelty preference (prioritize new content)
    const optimal = getOptimalAffirmation(
      allAffirmations,
      {
        gender: profile?.gender,
        ethnicity: profile?.ethnicity
      },
      journeyInfo.stage,
      true // Prioritize novelty
    );

    if (optimal) {
      setCurrentAffirmation(optimal);

      // Record view for spaced repetition tracking
      recordAffirmationView(optimal.id, journeyInfo.stage);

      // Record view for engagement system
      recordEngagementView();
    } else {
      // Fallback: pick a random affirmation
      const fallback = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
      setCurrentAffirmation(fallback);
    }

    setIsLoading(false);
  };

  const handleRefresh = () => {
    loadOptimalAffirmation();
  };

  if (isLoading || !currentAffirmation) {
    return (
      <div className="flex items-center justify-center p-12 bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-3xl border border-kintsugi-gold-100/30 dark:border-kintsugi-gold-900/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 theme-border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
            Loading your personalized affirmation...
          </p>
        </div>
      </div>
    );
  }

  return <AffirmationCard affirmation={currentAffirmation} onRefresh={handleRefresh} />;
}
