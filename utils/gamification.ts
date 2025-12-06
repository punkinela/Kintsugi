// Gamification system logic

import {
  GamificationData,
  XP_VALUES,
  calculateXPForLevel,
  getLevelFromXP,
  LEVEL_TITLES,
  LEVEL_UP_MESSAGES,
  KINTSUGI_PRINCIPLES,
  GROWTH_PHASES,
  getPhaseForLevel
} from '@/types/gamification';

// Initialize gamification data
export function initializeGamification(): GamificationData {
  const saved = localStorage.getItem('gamificationData');

  if (saved) {
    const data = JSON.parse(saved);
    // Recalculate xpToNextLevel with new formula for existing users
    data.xpToNextLevel = calculateXPForLevel(data.level + 1);
    return data;
  }

  // Welcome bonus for new users - start with 50 XP toward level 2
  const welcomeBonus = XP_VALUES['welcome']?.xp || 50;

  const initial: GamificationData = {
    points: 25,
    level: 1,
    xp: welcomeBonus, // Start with welcome bonus XP
    xpToNextLevel: calculateXPForLevel(2),
    totalXpEarned: welcomeBonus,
    achievements: [],
    dailyChallenges: [],
    unlockedRewards: [],
    stats: {
      totalAccomplishments: 0,
      totalAffirmationsViewed: 0,
      totalInsightsViewed: 0,
      totalJournalEntries: 0,
      longestStreak: 0,
      currentStreak: 0,
      totalVisits: 1, // First visit counted
      daysActive: 1,
      achievementsUnlocked: 0,
      challengesCompleted: 0
    }
  };

  localStorage.setItem('gamificationData', JSON.stringify(initial));
  return initial;
}

// Get current gamification data
export function getGamificationData(): GamificationData {
  return initializeGamification();
}

// Award XP and points for an action
export function awardXP(actionKey: keyof typeof XP_VALUES): {
  xpGained: number;
  pointsGained: number;
  leveledUp: boolean;
  newLevel?: number;
  oldLevel: number;
} {
  const data = getGamificationData();
  const action = XP_VALUES[actionKey];
  
  if (!action) {
    return { xpGained: 0, pointsGained: 0, leveledUp: false, oldLevel: data.level };
  }
  
  const oldLevel = data.level;
  
  // Add XP and points
  data.xp += action.xp;
  data.totalXpEarned += action.xp;
  data.points += action.points;
  
  // Check for level up
  let leveledUp = false;
  let newLevel = oldLevel;
  
  while (data.xp >= data.xpToNextLevel && data.level < 50) {
    data.xp -= data.xpToNextLevel;
    data.level++;
    newLevel = data.level;
    leveledUp = true;
    data.xpToNextLevel = calculateXPForLevel(data.level + 1);
  }
  
  // Save updated data
  localStorage.setItem('gamificationData', JSON.stringify(data));
  
  return {
    xpGained: action.xp,
    pointsGained: action.points,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    oldLevel
  };
}

// Update player stats
export function updateStats(stat: keyof GamificationData['stats'], value: number): void {
  const data = getGamificationData();
  data.stats[stat] = value;
  localStorage.setItem('gamificationData', JSON.stringify(data));
}

// Increment player stat
export function incrementStat(stat: keyof GamificationData['stats'], amount: number = 1): void {
  const data = getGamificationData();
  data.stats[stat] += amount;
  localStorage.setItem('gamificationData', JSON.stringify(data));
}

// Get current level info
export function getCurrentLevelInfo(): {
  level: number;
  title: string;
  xp: number;
  xpToNextLevel: number;
  progress: number;
  totalXP: number;
} {
  const data = getGamificationData();
  const progress = (data.xp / data.xpToNextLevel) * 100;
  
  // Find level title
  let title = 'Newcomer';
  const levelKeys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  for (const level of levelKeys) {
    if (data.level >= level) {
      title = LEVEL_TITLES[level];
      break;
    }
  }
  
  return {
    level: data.level,
    title,
    xp: data.xp,
    xpToNextLevel: data.xpToNextLevel,
    progress,
    totalXP: data.totalXpEarned
  };
}

// Get XP breakdown
export function getXPBreakdown(): {
  action: string;
  xp: number;
  points: number;
  description: string;
}[] {
  return Object.values(XP_VALUES);
}

// Calculate total possible XP from current engagement
export function calculatePotentialXP(): {
  current: number;
  potential: number;
  suggestions: string[];
} {
  const data = getGamificationData();
  const suggestions: string[] = [];
  let potential = data.totalXpEarned;
  
  // Check what actions haven't been done today
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('lastXPVisit');
  
  if (lastVisit !== today) {
    potential += XP_VALUES.visit.xp;
    suggestions.push('Visit daily for +10 XP');
  }
  
  if (data.stats.totalAccomplishments === 0) {
    potential += XP_VALUES.accomplishment.xp;
    suggestions.push('Log your first accomplishment for +50 XP');
  }
  
  if (data.stats.totalAffirmationsViewed === 0) {
    potential += XP_VALUES.affirmation.xp;
    suggestions.push('View an affirmation for +5 XP');
  }
  
  if (data.stats.totalInsightsViewed === 0) {
    potential += XP_VALUES.insight.xp;
    suggestions.push('Read an insight for +15 XP');
  }
  
  return {
    current: data.totalXpEarned,
    potential,
    suggestions
  };
}

// Get leaderboard position (for future multi-user support)
export function getLeaderboardPosition(): {
  rank: number;
  totalPlayers: number;
  percentile: number;
} {
  // For single-user, always rank 1
  return {
    rank: 1,
    totalPlayers: 1,
    percentile: 100
  };
}

// Reset daily progress (call at midnight)
export function resetDailyProgress(): void {
  const data = getGamificationData();
  
  // Reset daily challenges
  data.dailyChallenges = data.dailyChallenges.filter(c => c.type === 'weekly');
  
  localStorage.setItem('gamificationData', JSON.stringify(data));
}

// Get next milestone
export function getNextMilestone(): {
  type: 'level' | 'achievement' | 'reward';
  description: string;
  progress: number;
  target: number;
} | null {
  const data = getGamificationData();

  // Next level is always a milestone
  return {
    type: 'level',
    description: `Reach Level ${data.level + 1}`,
    progress: data.xp,
    target: data.xpToNextLevel
  };
}

// Migration function to retroactively award XP for existing journal entries
export function migrateExistingXP(): {
  migrated: boolean;
  entriesFound: number;
  xpAwarded: number;
  newLevel: number;
  oldLevel: number;
} {
  const MIGRATION_KEY = 'gamification_xp_migrated_v3';

  console.log('🔄 XP Migration: Starting check...');

  // Check if migration already done
  if (localStorage.getItem(MIGRATION_KEY)) {
    const data = getGamificationData();
    console.log('🔄 XP Migration: Already completed, skipping. Current level:', data.level);
    return { migrated: false, entriesFound: 0, xpAwarded: 0, newLevel: data.level, oldLevel: data.level };
  }

  // Get existing journal entries from engagement data
  let journalEntries: unknown[] = [];

  // Check both storage keys for journal entries
  const newKey = localStorage.getItem('kintsugi_engagement');
  const oldKey = localStorage.getItem('engagementData');

  console.log('🔄 XP Migration: Checking storage keys...');
  console.log('   - kintsugi_engagement exists:', !!newKey);
  console.log('   - engagementData exists:', !!oldKey);

  if (newKey) {
    try {
      const parsed = JSON.parse(newKey);
      console.log('   - kintsugi_engagement journalEntries:', parsed.journalEntries?.length || 0);
      if (parsed.journalEntries?.length > 0) {
        journalEntries = parsed.journalEntries;
      }
    } catch (e) {
      console.log('   - Error parsing kintsugi_engagement:', e);
    }
  }

  if (journalEntries.length === 0 && oldKey) {
    try {
      const parsed = JSON.parse(oldKey);
      console.log('   - engagementData journalEntries:', parsed.journalEntries?.length || 0);
      if (parsed.journalEntries?.length > 0) {
        journalEntries = parsed.journalEntries;
      }
    } catch (e) {
      console.log('   - Error parsing engagementData:', e);
    }
  }

  console.log('🔄 XP Migration: Found', journalEntries.length, 'total entries');

  if (journalEntries.length === 0) {
    // No entries to migrate, but mark as done
    localStorage.setItem(MIGRATION_KEY, 'true');
    const data = getGamificationData();
    console.log('🔄 XP Migration: No entries found, marking complete');
    return { migrated: true, entriesFound: 0, xpAwarded: 0, newLevel: data.level, oldLevel: data.level };
  }

  // Calculate XP to award (50 XP per journal entry with new values)
  const xpPerEntry = XP_VALUES['journal']?.xp || 50;
  const pointsPerEntry = XP_VALUES['journal']?.points || 25;
  const totalXP = journalEntries.length * xpPerEntry;
  const totalPoints = journalEntries.length * pointsPerEntry;

  // Get current data and update
  const data = getGamificationData();
  const oldLevel = data.level;

  console.log('🔄 XP Migration: Current state - Level:', oldLevel, 'XP:', data.xp, 'xpToNextLevel:', data.xpToNextLevel);

  // Add the retroactive XP
  data.xp += totalXP;
  data.totalXpEarned += totalXP;
  data.points += totalPoints;
  data.stats.totalJournalEntries = journalEntries.length;

  // Process level ups
  while (data.xp >= data.xpToNextLevel && data.level < 50) {
    data.xp -= data.xpToNextLevel;
    data.level++;
    data.xpToNextLevel = calculateXPForLevel(data.level + 1);
    console.log('🔄 XP Migration: Leveled up to', data.level);
  }

  // Save updated data
  localStorage.setItem('gamificationData', JSON.stringify(data));

  // Mark migration as complete
  localStorage.setItem(MIGRATION_KEY, 'true');

  console.log(`🎉 XP Migration Complete! Found ${journalEntries.length} entries, awarded ${totalXP} XP. Level ${oldLevel} → ${data.level}`);

  return {
    migrated: true,
    entriesFound: journalEntries.length,
    xpAwarded: totalXP,
    newLevel: data.level,
    oldLevel
  };
}

// Get level-up message with philosophy
export function getLevelUpMessage(level: number): {
  title: string;
  message: string;
  principle: {
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  phase: string;
  phaseMessage: string;
} {
  // Get the phase for this level
  const phaseName = getPhaseForLevel(level);
  const phase = GROWTH_PHASES[phaseName];

  // Get specific level message or fallback to phase message
  const levelMessage = LEVEL_UP_MESSAGES[level];
  const principleKey = levelMessage?.principle || phase.principle;
  const principle = KINTSUGI_PRINCIPLES[principleKey as keyof typeof KINTSUGI_PRINCIPLES];

  // Get level title
  let title = LEVEL_TITLES[level];
  if (!title) {
    // Find the closest lower level title
    const levelKeys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
    for (const lvl of levelKeys) {
      if (level >= lvl) {
        title = LEVEL_TITLES[lvl];
        break;
      }
    }
  }

  return {
    title: title || 'Growth Seeker',
    message: levelMessage?.message || phase.philosophyMessage,
    principle: {
      title: principle.title,
      description: principle.description,
      icon: principle.icon,
      color: principle.color
    },
    phase: phase.name,
    phaseMessage: phase.philosophyMessage
  };
}
