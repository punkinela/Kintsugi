// Hook for progressive disclosure feature unlocking
import { useState, useEffect } from 'react';
import { getCurrentLevelInfo } from '@/utils/gamification';

// Feature unlock levels based on approved mapping
export const FEATURE_UNLOCK_LEVELS = {
  // Always available (Level 1+)
  quickCapture: 1,
  xpBar: 1,
  avatarBasic: 1,
  dailyAffirmation: 1,
  streakCounter: 1,
  faqHelp: 1,
  profileSettings: 1,
  themeToggle: 1,

  // Awakening Phase (Levels 1-5)
  growthMindsetTracker: 2,
  viewPastEntries: 3,
  moodTrackingBasic: 4,
  insightsTab: 5,
  basicAnalytics: 5,
  kintsugiQuotes: 5,
  natureAvatars: 5,

  // Practice Phase (Levels 6-10)
  weekInReview: 6,
  entryCategories: 7,
  moodAnalytics: 8,
  journalPrompts: 9,
  yourEdgeTab: 10,
  goldenAvatars: 10,
  advancedSearch: 10,
  exportMarkdown: 10,
  culturalWisdom: 10,
  dailyChallenges: 10,

  // Integration Phase (Levels 11-20)
  aiInsights: 11,
  strengthArchaeology: 12,
  biasAwareness: 13,
  confidenceScore: 14,
  transformationHeatmap: 15,
  goalSetting: 16,
  beforeAfterReframing: 17,
  linkedInGenerator: 18,
  starStoryFormatter: 19,
  transformerAvatars: 20,

  // Mastery Phase (Levels 21-30)
  interviewPrep: 21,
  skillsEvidenceTracker: 22,
  portfolioGenerator: 23,
  advancedExport: 24,
  careerGapAnalyzer: 25,
  accomplishmentEnhancer: 26,
  customAffirmations: 27,
  careerMilestoneLinking: 28,
  advancedVoiceProfile: 29,
  masterAvatars: 30,

  // Wisdom Phase (Levels 31-50)
  journeyAnalytics: 31,
  interactiveVessel3D: 35,
  resilienceMap: 40,
  legacyFeatures: 45,
  masterworkComplete: 50,
} as const;

export type FeatureKey = keyof typeof FEATURE_UNLOCK_LEVELS;

// Check if user is grandfathered (existing user before progressive disclosure)
const GRANDFATHERED_KEY = 'kintsugi_user_grandfathered';
const PROGRESSIVE_DISCLOSURE_VERSION = 'v1';

export function checkIfGrandfathered(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if user has the grandfathered flag
  const grandfathered = localStorage.getItem(GRANDFATHERED_KEY);
  if (grandfathered === PROGRESSIVE_DISCLOSURE_VERSION) {
    return true;
  }

  // Check if user has existing data (they were using the app before this update)
  const hasExistingEntries = (() => {
    const engagement = localStorage.getItem('kintsugi_engagement');
    if (engagement) {
      const data = JSON.parse(engagement);
      return data.journalEntries && data.journalEntries.length > 0;
    }
    const oldEngagement = localStorage.getItem('engagementData');
    if (oldEngagement) {
      const data = JSON.parse(oldEngagement);
      return data.journalEntries && data.journalEntries.length > 0;
    }
    return false;
  })();

  const hasGamificationData = (() => {
    const gamification = localStorage.getItem('gamificationData');
    if (gamification) {
      const data = JSON.parse(gamification);
      return data.totalXpEarned > 0 || data.level > 1;
    }
    return false;
  })();

  // If they have existing data, mark them as grandfathered
  if (hasExistingEntries || hasGamificationData) {
    localStorage.setItem(GRANDFATHERED_KEY, PROGRESSIVE_DISCLOSURE_VERSION);
    return true;
  }

  return false;
}

export function isFeatureUnlocked(feature: FeatureKey, level: number, isGrandfathered: boolean): boolean {
  // Grandfathered users have access to everything
  if (isGrandfathered) return true;

  const requiredLevel = FEATURE_UNLOCK_LEVELS[feature];
  return level >= requiredLevel;
}

export function getNextUnlock(level: number): { feature: string; level: number; message: string } | null {
  const unlockMessages: Record<number, { feature: string; message: string }> = {
    2: { feature: 'Growth Mindset Tracker', message: 'Track how setbacks become strengths' },
    3: { feature: 'Past Entries View', message: 'See your journey unfold' },
    4: { feature: 'Mood Tracking', message: 'Understand your patterns' },
    5: { feature: 'Insights Tab', message: 'Discover your growth patterns' },
    6: { feature: 'Week in Review', message: 'See your weekly golden moments' },
    7: { feature: 'Entry Categories', message: 'Organize your impact' },
    8: { feature: 'Mood Analytics', message: 'Your emotional patterns revealed' },
    9: { feature: 'Journal Prompts', message: 'Guided reflection unlocked' },
    10: { feature: 'Your Edge Tab', message: 'Professional tools await!' },
    11: { feature: 'AI Insights', message: 'AI-powered patterns' },
    15: { feature: 'Transformation Heatmap', message: 'Visualize your growth' },
    20: { feature: 'LinkedIn & STAR Tools', message: 'Share your wins professionally' },
    30: { feature: 'Master Tools', message: 'Full career toolkit unlocked' },
  };

  // Find the next unlock level
  const nextLevels = Object.keys(unlockMessages)
    .map(Number)
    .filter(l => l > level)
    .sort((a, b) => a - b);

  if (nextLevels.length === 0) return null;

  const nextLevel = nextLevels[0];
  return {
    feature: unlockMessages[nextLevel].feature,
    level: nextLevel,
    message: unlockMessages[nextLevel].message,
  };
}

export function useFeatureUnlock() {
  const [level, setLevel] = useState(1);
  const [isGrandfathered, setIsGrandfathered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check grandfathered status
    const grandfathered = checkIfGrandfathered();
    setIsGrandfathered(grandfathered);

    // Get current level
    const levelInfo = getCurrentLevelInfo();
    setLevel(levelInfo.level);
    setIsLoading(false);

    // Listen for level updates
    const handleUpdate = () => {
      const newLevelInfo = getCurrentLevelInfo();
      setLevel(newLevelInfo.level);
    };

    window.addEventListener('gamification-update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('gamification-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isUnlocked = (feature: FeatureKey): boolean => {
    return isFeatureUnlocked(feature, level, isGrandfathered);
  };

  const getUnlockLevel = (feature: FeatureKey): number => {
    return FEATURE_UNLOCK_LEVELS[feature];
  };

  const nextUnlock = getNextUnlock(level);

  return {
    level,
    isGrandfathered,
    isLoading,
    isUnlocked,
    getUnlockLevel,
    nextUnlock,
    // Convenience checks for tabs
    canAccessInsights: isFeatureUnlocked('insightsTab', level, isGrandfathered),
    canAccessYourEdge: isFeatureUnlocked('yourEdgeTab', level, isGrandfathered),
    canAccessGrowthMindset: isFeatureUnlocked('growthMindsetTracker', level, isGrandfathered),
  };
}

export default useFeatureUnlock;
