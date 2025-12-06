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

// XP values for different actions - balanced for engagement
export const XP_VALUES: Record<string, XPAction> = {
  'welcome': { action: 'welcome', xp: 50, points: 25, description: 'Welcome bonus' },
  'visit': { action: 'visit', xp: 25, points: 10, description: 'Daily visit' },
  'accomplishment': { action: 'accomplishment', xp: 75, points: 35, description: 'Log accomplishment' },
  'affirmation': { action: 'affirmation', xp: 15, points: 8, description: 'View affirmation' },
  'insight': { action: 'insight', xp: 25, points: 12, description: 'View insight' },
  'journal': { action: 'journal', xp: 50, points: 25, description: 'Journal entry' },
  'reflection': { action: 'reflection', xp: 40, points: 20, description: 'Complete reflection' },
  'streak-3': { action: 'streak-3', xp: 100, points: 50, description: '3-day streak' },
  'streak-7': { action: 'streak-7', xp: 250, points: 125, description: '7-day streak' },
  'streak-30': { action: 'streak-30', xp: 1000, points: 500, description: '30-day streak' },
  'achievement': { action: 'achievement', xp: 100, points: 50, description: 'Unlock achievement' },
  'challenge': { action: 'challenge', xp: 75, points: 40, description: 'Complete challenge' },
  'feedback': { action: 'feedback', xp: 50, points: 25, description: 'Give feedback' },
  'profile-complete': { action: 'profile-complete', xp: 100, points: 50, description: 'Complete profile' },
  'feature-explore': { action: 'feature-explore', xp: 20, points: 10, description: 'Explore new feature' }
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

// The 5 Core Kintsugi Principles
export const KINTSUGI_PRINCIPLES = {
  embrace: {
    title: 'Embrace Imperfection',
    description: 'Scars are beautiful, not shameful',
    icon: '🏺',
    color: 'from-amber-400 to-orange-500'
  },
  honor: {
    title: 'Honor Your History',
    description: 'Breaks are part of your story',
    icon: '📜',
    color: 'from-blue-400 to-indigo-500'
  },
  transform: {
    title: 'Transform Through Healing',
    description: 'Challenges make you stronger',
    icon: '🦋',
    color: 'from-purple-400 to-pink-500'
  },
  value: {
    title: 'Value in Repair',
    description: 'What was broken becomes MORE valuable',
    icon: '✨',
    color: 'from-yellow-400 to-amber-500'
  },
  wholeness: {
    title: 'Wholeness Over Perfection',
    description: 'Golden seams make you unique',
    icon: '👑',
    color: 'from-amber-500 to-yellow-600'
  }
};

// Growth Mindset Phase Descriptions with Kintsugi Philosophy
export const GROWTH_PHASES = {
  awakening: {
    name: 'Awakening',
    levels: [1, 2, 3, 4, 5],
    description: 'Moving from fixed to growth mindset. Recognizing that abilities can be developed through effort and learning.',
    color: 'from-blue-400 to-cyan-500',
    principle: 'embrace',
    philosophyMessage: 'Like a vessel beginning its journey, you are learning that imperfections are not flaws—they are the starting points of transformation.'
  },
  practice: {
    name: 'Practice',
    levels: [6, 7, 8, 9, 10],
    description: 'Building growth habits. Learning to embrace effort, feedback, and mistakes as opportunities.',
    color: 'from-green-400 to-emerald-500',
    principle: 'honor',
    philosophyMessage: 'Every crack in your story holds meaning. You are learning to honor your full history—the struggles and the triumphs alike.'
  },
  integration: {
    name: 'Integration',
    levels: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    description: 'Growth mindset becomes natural. Actively seeking challenges and celebrating progress.',
    color: 'from-yellow-400 to-orange-500',
    principle: 'transform',
    philosophyMessage: 'You are transforming through healing. Each challenge you face is filling your cracks with gold, making you stronger than before.'
  },
  mastery: {
    name: 'Mastery',
    levels: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    description: 'Embodying growth mindset. Turning adversity into strength and helping others grow.',
    color: 'from-purple-400 to-pink-500',
    principle: 'value',
    philosophyMessage: 'What was once broken has become more valuable. Your repaired places are not weaknesses—they are your greatest treasures.'
  },
  wisdom: {
    name: 'Wisdom',
    levels: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    description: 'Kintsugi mastery. Living the philosophy of finding beauty in imperfection and transformation.',
    color: 'from-amber-400 to-yellow-600',
    principle: 'wholeness',
    philosophyMessage: 'You embody wholeness over perfection. Your golden seams tell a story of resilience, making you uniquely beautiful.'
  }
};

// Level-up messages tied to Kintsugi philosophy
export const LEVEL_UP_MESSAGES: Record<number, { message: string; principle: keyof typeof KINTSUGI_PRINCIPLES }> = {
  // Awakening Phase - Embrace Imperfection
  2: { message: 'You\'ve taken your first step. Remember: every journey begins with acknowledging where we are.', principle: 'embrace' },
  3: { message: 'Growth is happening! Your willingness to show up imperfectly is your greatest strength.', principle: 'embrace' },
  4: { message: 'You\'re discovering that cracks let the light in. Keep going.', principle: 'embrace' },
  5: { message: 'Phase complete! You\'ve learned to embrace imperfection—scars are beautiful, not shameful.', principle: 'embrace' },

  // Practice Phase - Honor Your History
  6: { message: 'Welcome to the Practice phase. Every break in your story has made you who you are today.', principle: 'honor' },
  7: { message: 'Your past struggles aren\'t weaknesses—they\'re the foundation of your strength.', principle: 'honor' },
  8: { message: 'Each entry you write honors your journey. Your history matters.', principle: 'honor' },
  9: { message: 'You\'re weaving gold into your story. Every thread connects.', principle: 'honor' },
  10: { message: 'The Golden Thread is yours! You\'ve learned to honor your full history—breaks are part of your story.', principle: 'honor' },

  // Integration Phase - Transform Through Healing
  11: { message: 'Integration begins. You\'re not just surviving challenges—you\'re growing through them.', principle: 'transform' },
  12: { message: 'Like the lotus rising from mud, your struggles nurture your growth.', principle: 'transform' },
  13: { message: 'Transformation is active within you. Each challenge adds more gold.', principle: 'transform' },
  14: { message: 'You\'re becoming stronger in the broken places. This is Kintsugi in action.', principle: 'transform' },
  15: { message: 'Halfway to mastery! You appreciate imperfection as part of beauty.', principle: 'transform' },
  16: { message: 'Your healing journey inspires growth in yourself and others.', principle: 'transform' },
  17: { message: 'Wisdom flows through your golden seams. Keep seeking, keep growing.', principle: 'transform' },
  18: { message: 'You\'re actively sculpting your strength from life\'s challenges.', principle: 'transform' },
  19: { message: 'The journey itself has become the destination. You embrace the process.', principle: 'transform' },
  20: { message: 'Kintsugi Apprentice achieved! Challenges make you stronger—you embody transformation through healing.', principle: 'transform' },

  // Mastery Phase - Value in Repair
  21: { message: 'Mastery phase unlocked. What was broken in you has become your greatest asset.', principle: 'value' },
  22: { message: 'Your growth mindset is second nature now. You see gold where others see cracks.', principle: 'value' },
  23: { message: 'Adversity Alchemist—you turn setbacks into precious gold.', principle: 'value' },
  24: { message: 'Your perceived limits were illusions. You\'ve moved beyond them.', principle: 'value' },
  25: { message: 'Quarter century of levels! You create beauty from imperfection.', principle: 'value' },
  26: { message: 'Your potential is fully unleashed. Your repairs make you MORE valuable.', principle: 'value' },
  27: { message: 'You spread the growth mindset to others through your example.', principle: 'value' },
  28: { message: 'Resilience exemplified. Your repaired cracks shine brightest.', principle: 'value' },
  29: { message: 'You weave wisdom from every experience, golden thread by golden thread.', principle: 'value' },
  30: { message: 'Change Champion! You\'ve mastered the truth: what was broken becomes MORE valuable.', principle: 'value' },

  // Wisdom Phase - Wholeness Over Perfection
  35: { message: 'Golden Vessel achieved. You embody the Kintsugi philosophy completely.', principle: 'wholeness' },
  40: { message: 'Living Kintsugi. You ARE the transformation—whole, unique, and luminous.', principle: 'wholeness' },
  45: { message: 'Radiant Phoenix. You rise stronger from every setback, your golden seams lighting the way.', principle: 'wholeness' },
  50: { message: 'Masterwork in Progress—the ultimate truth. We are always growing, never "done." Your golden seams make you uniquely beautiful.', principle: 'wholeness' }
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
  // Gentler progression curve for better early experience
  // Levels 2-5: Quick wins to encourage engagement (75-375 XP)
  // Levels 6-10: Moderate challenge (450-750 XP)
  // Levels 11+: Progressive difficulty for long-term engagement
  if (level <= 5) {
    return level * 75; // L2:150, L3:225, L4:300, L5:375
  }
  if (level <= 10) {
    return level * 75 + 75; // L6:525, L7:600, L8:675, L9:750, L10:825
  }
  if (level <= 20) {
    return level * 100 + 100; // L11:1200, L15:1600, L20:2100
  }
  // Higher levels: steeper curve for dedicated users
  return Math.floor(Math.pow(level, 1.6) * 20 + 500);
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
