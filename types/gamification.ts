// Gamification system types

export interface GamificationData {
  points: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXpEarned: number;
  achievements: EnhancedAchievement[];
  dailyChallenges: DailyChallenge[];
  unlockedRewards: string[];
  stats: PlayerStats;
}

export interface EnhancedAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xpReward: number;
  pointsReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: 'engagement' | 'streak' | 'accomplishments' | 'features' | 'social' | 'special' | 'ai-voice' | 'ai-tools' | 'growth';
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  pointsReward: number;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
  expiresAt: string;
  type: 'daily' | 'weekly';
}

export interface PlayerStats {
  totalAccomplishments: number;
  totalAffirmationsViewed: number;
  totalInsightsViewed: number;
  totalJournalEntries: number;
  longestStreak: number;
  currentStreak: number;
  totalVisits: number;
  daysActive: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'avatar' | 'theme' | 'badge' | 'feature' | 'title';
  unlockLevel: number;
  unlockXP?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
  rewards: string[];
  color: string;
  icon: string;
}

export interface XPAction {
  action: string;
  xp: number;
  points: number;
  description: string;
}

// XP values for different actions
export const XP_VALUES: Record<string, XPAction> = {
  'visit': { action: 'visit', xp: 10, points: 5, description: 'Daily visit' },
  'accomplishment': { action: 'accomplishment', xp: 50, points: 25, description: 'Log accomplishment' },
  'affirmation': { action: 'affirmation', xp: 5, points: 2, description: 'View affirmation' },
  'insight': { action: 'insight', xp: 15, points: 8, description: 'View insight' },
  'journal': { action: 'journal', xp: 30, points: 15, description: 'Journal entry' },
  'streak-3': { action: 'streak-3', xp: 100, points: 50, description: '3-day streak' },
  'streak-7': { action: 'streak-7', xp: 250, points: 125, description: '7-day streak' },
  'streak-30': { action: 'streak-30', xp: 1000, points: 500, description: '30-day streak' },
  'achievement': { action: 'achievement', xp: 100, points: 50, description: 'Unlock achievement' },
  'challenge': { action: 'challenge', xp: 75, points: 40, description: 'Complete challenge' },
  'feedback': { action: 'feedback', xp: 50, points: 25, description: 'Give feedback' },
  'profile-complete': { action: 'profile-complete', xp: 100, points: 50, description: 'Complete profile' }
};

// Level titles and requirements
// Journey from Fixed Mindset → Growth Mindset → Kintsugi Mastery
export const LEVEL_TITLES: Record<number, string> = {
  // Phase 1: Awakening (Fixed → Aware)
  1: 'Curious Explorer', // Starting with openness
  2: 'Possibility Seeker', // Recognizing growth is possible
  3: 'Challenge Accepter', // Beginning to embrace difficulty
  4: 'Pattern Noticer', // Observing how growth works
  5: 'Growth Explorer', // Actively seeking development

  // Phase 2: Practice (Building Growth Habits)
  6: 'Effort Embracer', // Seeing effort as path to mastery
  7: 'Feedback Learner', // Learning from criticism
  8: 'Persistence Builder', // Not giving up on setbacks
  9: 'Mistake Transformer', // Turning failures into lessons
  10: 'Golden Thread Weaver', // Connecting growth patterns (Kintsugi begins)

  // Phase 3: Integration (Growth Mindset Active)
  11: 'Challenge Champion', // Actively seeking challenges
  12: 'Resilience Crafter', // Building strength through adversity
  13: 'Progress Celebrator', // Recognizing small wins
  14: 'Breakthrough Maker', // Pushing past plateaus
  15: 'Imperfection Appreciator', // Seeing beauty in flaws
  16: 'Growth Catalyst', // Inspiring growth in yourself
  17: 'Wisdom Seeker', // Always learning
  18: 'Strength Sculptor', // Actively shaping yourself
  19: 'Journey Embracer', // Loving the process
  20: 'Kintsugi Apprentice', // Learning the art of transformation

  // Phase 4: Mastery (Embodying Growth)
  21: 'Transformation Guide', // Starting to help others
  22: 'Mindset Master', // Growth is second nature
  23: 'Adversity Alchemist', // Turning setbacks to gold
  24: 'Limitation Breaker', // Moving past perceived limits
  25: 'Beauty Creator', // Finding beauty in imperfection
  26: 'Potential Unleashed', // Fully expressing capability
  27: 'Growth Ambassador', // Spreading growth mindset
  28: 'Resilience Exemplar', // Model of perseverance
  29: 'Wisdom Weaver', // Connecting insights
  30: 'Change Champion', // Leading transformation

  // Phase 5: Wisdom (Kintsugi Mastery)
  35: 'Golden Vessel', // Embodying the philosophy
  40: 'Living Kintsugi', // You ARE the transformation
  45: 'Radiant Phoenix', // Rising stronger from every setback
  50: 'Masterwork in Progress' // Always growing, never "done"
};

// Growth Mindset Phase Descriptions
export const GROWTH_PHASES = {
  awakening: {
    name: 'Awakening',
    levels: [1, 2, 3, 4, 5],
    description: 'Moving from fixed to growth mindset. Recognizing that abilities can be developed through effort and learning.',
    color: 'from-blue-400 to-cyan-500'
  },
  practice: {
    name: 'Practice',
    levels: [6, 7, 8, 9, 10],
    description: 'Building growth habits. Learning to embrace effort, feedback, and mistakes as opportunities.',
    color: 'from-green-400 to-emerald-500'
  },
  integration: {
    name: 'Integration',
    levels: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    description: 'Growth mindset becomes natural. Actively seeking challenges and celebrating progress.',
    color: 'from-yellow-400 to-orange-500'
  },
  mastery: {
    name: 'Mastery',
    levels: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    description: 'Embodying growth mindset. Turning adversity into strength and helping others grow.',
    color: 'from-purple-400 to-pink-500'
  },
  wisdom: {
    name: 'Wisdom',
    levels: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    description: 'Kintsugi mastery. Living the philosophy of finding beauty in imperfection and transformation.',
    color: 'from-amber-400 to-yellow-600'
  }
};

// Get phase for a given level
export function getPhaseForLevel(level: number): keyof typeof GROWTH_PHASES {
  if (level <= 5) return 'awakening';
  if (level <= 10) return 'practice';
  if (level <= 20) return 'integration';
  if (level <= 30) return 'mastery';
  return 'wisdom';
}

// Calculate XP needed for level
export function calculateXPForLevel(level: number): number {
  // Progressive XP curve: level^2 * 100
  return Math.floor(Math.pow(level, 2) * 100);
}

// Get level from total XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  
  while (xpNeeded <= totalXP && level < 50) {
    level++;
    xpNeeded += calculateXPForLevel(level);
  }
  
  return Math.max(1, level - 1);
}

// Achievement tier colors
export const TIER_COLORS = {
  'bronze': 'bg-orange-700',
  'silver': 'bg-gray-400',
  'gold': 'bg-yellow-500',
  'platinum': 'bg-cyan-400',
  'diamond': 'bg-purple-500'
};

// Achievement tier XP rewards
export const TIER_XP_REWARDS = {
  'bronze': 50,
  'silver': 100,
  'gold': 200,
  'platinum': 400,
  'diamond': 1000
};
