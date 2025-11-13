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
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Cracked Vessel', // Acknowledging imperfection
  2: 'Gold Seeker', // Looking for transformation
  3: 'Seam Filler', // Beginning repair
  4: 'Pattern Recognizer', // Seeing your growth patterns
  5: 'Transformation Artist', // Actively creating change
  10: 'Golden Thread Weaver', // Connecting the pieces
  15: 'Imperfection Embracer', // Accepting flaws as beauty
  20: 'Kintsugi Craftsperson', // Skilled at transformation
  25: 'Master Restorer', // Expert at turning breaks into beauty
  30: 'Wisdom Keeper', // Sharing knowledge with others
  35: 'Golden Vessel', // Embodying the philosophy
  40: 'Living Kintsugi', // You ARE the transformation
  45: 'Radiant Phoenix', // Rising from every setback
  50: 'Golden Masterwork' // The ultimate transformation
};

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
