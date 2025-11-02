// Daily challenges system

import { DailyChallenge } from '@/types/gamification';
import { getGamificationData, awardXP } from './gamification';

// Challenge templates
const DAILY_CHALLENGE_TEMPLATES = [
  {
    id: 'log-3-accomplishments',
    title: 'Triple Win',
    description: 'Log 3 accomplishments today',
    icon: '🎯',
    xpReward: 100,
    pointsReward: 50,
    target: 3,
    type: 'daily' as const
  },
  {
    id: 'view-5-affirmations',
    title: 'Affirmation Seeker',
    description: 'View 5 affirmations',
    icon: '💜',
    xpReward: 50,
    pointsReward: 25,
    target: 5,
    type: 'daily' as const
  },
  {
    id: 'read-3-insights',
    title: 'Knowledge Hunter',
    description: 'Read 3 bias insights',
    icon: '🧠',
    xpReward: 75,
    pointsReward: 35,
    target: 3,
    type: 'daily' as const
  },
  {
    id: 'journal-entry',
    title: 'Reflection Time',
    description: 'Make a journal entry',
    icon: '📝',
    xpReward: 60,
    pointsReward: 30,
    target: 1,
    type: 'daily' as const
  },
  {
    id: 'maintain-streak',
    title: 'Consistency King',
    description: 'Maintain your daily streak',
    icon: '🔥',
    xpReward: 40,
    pointsReward: 20,
    target: 1,
    type: 'daily' as const
  }
];

const WEEKLY_CHALLENGE_TEMPLATES = [
  {
    id: 'weekly-10-accomplishments',
    title: 'Weekly Champion',
    description: 'Log 10 accomplishments this week',
    icon: '🏆',
    xpReward: 500,
    pointsReward: 250,
    target: 10,
    type: 'weekly' as const
  },
  {
    id: 'weekly-7-day-streak',
    title: 'Week Warrior',
    description: 'Complete a 7-day streak',
    icon: '⚡',
    xpReward: 400,
    pointsReward: 200,
    target: 7,
    type: 'weekly' as const
  },
  {
    id: 'weekly-all-features',
    title: 'Feature Explorer',
    description: 'Use all app features this week',
    icon: '🌟',
    xpReward: 300,
    pointsReward: 150,
    target: 5,
    type: 'weekly' as const
  }
];

// Generate daily challenges
export function generateDailyChallenges(): DailyChallenge[] {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  // Pick 3 random daily challenges
  const shuffled = [...DAILY_CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  
  return selected.map(template => ({
    ...template,
    progress: 0,
    completed: false,
    expiresAt: today.toISOString()
  }));
}

// Generate weekly challenges
export function generateWeeklyChallenges(): DailyChallenge[] {
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  
  return WEEKLY_CHALLENGE_TEMPLATES.map(template => ({
    ...template,
    progress: 0,
    completed: false,
    expiresAt: endOfWeek.toISOString()
  }));
}

// Get current challenges
export function getCurrentChallenges(): DailyChallenge[] {
  const data = getGamificationData();
  const now = new Date();
  
  // Filter out expired challenges
  let challenges = data.dailyChallenges.filter(c => new Date(c.expiresAt) > now);
  
  // If no daily challenges, generate new ones
  const hasDailyChallenges = challenges.some(c => c.type === 'daily');
  if (!hasDailyChallenges) {
    const newDailyChallenges = generateDailyChallenges();
    challenges = [...challenges, ...newDailyChallenges];
  }
  
  // If no weekly challenges, generate new ones
  const hasWeeklyChallenges = challenges.some(c => c.type === 'weekly');
  if (!hasWeeklyChallenges) {
    const newWeeklyChallenges = generateWeeklyChallenges();
    challenges = [...challenges, ...newWeeklyChallenges];
  }
  
  // Update stored challenges
  data.dailyChallenges = challenges;
  localStorage.setItem('gamificationData', JSON.stringify(data));
  
  return challenges;
}

// Update challenge progress
export function updateChallengeProgress(challengeId: string, progress: number): {
  completed: boolean;
  xpGained: number;
  pointsGained: number;
} {
  const data = getGamificationData();
  const challenge = data.dailyChallenges.find(c => c.id === challengeId);
  
  if (!challenge || challenge.completed) {
    return { completed: false, xpGained: 0, pointsGained: 0 };
  }
  
  challenge.progress = Math.min(progress, challenge.target);
  
  // Check if completed
  if (challenge.progress >= challenge.target && !challenge.completed) {
    challenge.completed = true;
    challenge.completedAt = new Date().toISOString();
    
    // Award XP and points
    data.xp += challenge.xpReward;
    data.totalXpEarned += challenge.xpReward;
    data.points += challenge.pointsReward;
    data.stats.challengesCompleted++;
    
    // Check for level up
    while (data.xp >= data.xpToNextLevel && data.level < 50) {
      data.xp -= data.xpToNextLevel;
      data.level++;
      const { calculateXPForLevel } = require('@/types/gamification');
      data.xpToNextLevel = calculateXPForLevel(data.level + 1);
    }
    
    localStorage.setItem('gamificationData', JSON.stringify(data));
    
    return {
      completed: true,
      xpGained: challenge.xpReward,
      pointsGained: challenge.pointsReward
    };
  }
  
  localStorage.setItem('gamificationData', JSON.stringify(data));
  
  return { completed: false, xpGained: 0, pointsGained: 0 };
}

// Auto-update challenges based on actions
export function checkChallengeProgress(action: string, amount: number = 1): void {
  const challenges = getCurrentChallenges();
  
  switch (action) {
    case 'accomplishment':
      updateChallengeProgress('log-3-accomplishments', amount);
      updateChallengeProgress('weekly-10-accomplishments', amount);
      break;
    
    case 'affirmation':
      updateChallengeProgress('view-5-affirmations', amount);
      break;
    
    case 'insight':
      updateChallengeProgress('read-3-insights', amount);
      break;
    
    case 'journal':
      updateChallengeProgress('journal-entry', amount);
      break;
    
    case 'streak':
      updateChallengeProgress('maintain-streak', 1);
      updateChallengeProgress('weekly-7-day-streak', amount);
      break;
    
    case 'feature-use':
      updateChallengeProgress('weekly-all-features', amount);
      break;
  }
}

// Get challenge completion stats
export function getChallengeStats(): {
  dailyCompleted: number;
  dailyTotal: number;
  weeklyCompleted: number;
  weeklyTotal: number;
  totalCompleted: number;
} {
  const challenges = getCurrentChallenges();
  const daily = challenges.filter(c => c.type === 'daily');
  const weekly = challenges.filter(c => c.type === 'weekly');
  
  const data = getGamificationData();
  
  return {
    dailyCompleted: daily.filter(c => c.completed).length,
    dailyTotal: daily.length,
    weeklyCompleted: weekly.filter(c => c.completed).length,
    weeklyTotal: weekly.length,
    totalCompleted: data.stats.challengesCompleted
  };
}
