// Gamification system logic

import { 
  GamificationData, 
  XP_VALUES, 
  calculateXPForLevel, 
  getLevelFromXP,
  LEVEL_TITLES 
} from '@/types/gamification';

// Initialize gamification data
export function initializeGamification(): GamificationData {
  const saved = localStorage.getItem('gamificationData');
  
  if (saved) {
    return JSON.parse(saved);
  }
  
  const initial: GamificationData = {
    points: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: calculateXPForLevel(2),
    totalXpEarned: 0,
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
      totalVisits: 0,
      daysActive: 0,
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
