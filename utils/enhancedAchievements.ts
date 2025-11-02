// Enhanced achievements with tiers

import { EnhancedAchievement } from '@/types/gamification';
import { getGamificationData } from './gamification';

// Achievement definitions with tiers
export const ENHANCED_ACHIEVEMENTS: Omit<EnhancedAchievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Engagement achievements
  {
    id: 'first-visit',
    title: 'Welcome Aboard',
    description: 'Complete your first visit',
    icon: '👋',
    tier: 'bronze',
    xpReward: 50,
    pointsReward: 25,
    target: 1,
    category: 'engagement'
  },
  {
    id: 'visits-10',
    title: 'Regular Visitor',
    description: 'Visit the app 10 times',
    icon: '🚪',
    tier: 'silver',
    xpReward: 100,
    pointsReward: 50,
    target: 10,
    category: 'engagement'
  },
  {
    id: 'visits-50',
    title: 'Dedicated User',
    description: 'Visit the app 50 times',
    icon: '🎯',
    tier: 'gold',
    xpReward: 200,
    pointsReward: 100,
    target: 50,
    category: 'engagement'
  },
  {
    id: 'visits-100',
    title: 'Century Club',
    description: 'Visit the app 100 times',
    icon: '💯',
    tier: 'platinum',
    xpReward: 400,
    pointsReward: 200,
    target: 100,
    category: 'engagement'
  },
  
  // Streak achievements
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    tier: 'bronze',
    xpReward: 100,
    pointsReward: 50,
    target: 3,
    category: 'streak'
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    tier: 'silver',
    xpReward: 250,
    pointsReward: 125,
    target: 7,
    category: 'streak'
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    tier: 'gold',
    xpReward: 1000,
    pointsReward: 500,
    target: 30,
    category: 'streak'
  },
  {
    id: 'streak-100',
    title: 'Unstoppable Force',
    description: 'Maintain a 100-day streak',
    icon: '💫',
    tier: 'diamond',
    xpReward: 5000,
    pointsReward: 2500,
    target: 100,
    category: 'streak'
  },
  
  // Accomplishment achievements
  {
    id: 'accomplishment-1',
    title: 'First Step',
    description: 'Log your first accomplishment',
    icon: '🌱',
    tier: 'bronze',
    xpReward: 50,
    pointsReward: 25,
    target: 1,
    category: 'accomplishments'
  },
  {
    id: 'accomplishment-10',
    title: 'Rising Star',
    description: 'Log 10 accomplishments',
    icon: '⭐',
    tier: 'silver',
    xpReward: 150,
    pointsReward: 75,
    target: 10,
    category: 'accomplishments'
  },
  {
    id: 'accomplishment-50',
    title: 'Achievement Hunter',
    description: 'Log 50 accomplishments',
    icon: '🏅',
    tier: 'gold',
    xpReward: 500,
    pointsReward: 250,
    target: 50,
    category: 'accomplishments'
  },
  {
    id: 'accomplishment-100',
    title: 'Accomplishment Legend',
    description: 'Log 100 accomplishments',
    icon: '👑',
    tier: 'platinum',
    xpReward: 1000,
    pointsReward: 500,
    target: 100,
    category: 'accomplishments'
  },
  {
    id: 'accomplishment-500',
    title: 'Diamond Achiever',
    description: 'Log 500 accomplishments',
    icon: '💎',
    tier: 'diamond',
    xpReward: 5000,
    pointsReward: 2500,
    target: 500,
    category: 'accomplishments'
  },
  
  // Feature usage achievements
  {
    id: 'affirmations-10',
    title: 'Affirmation Seeker',
    description: 'View 10 affirmations',
    icon: '💜',
    tier: 'bronze',
    xpReward: 50,
    pointsReward: 25,
    target: 10,
    category: 'features'
  },
  {
    id: 'insights-10',
    title: 'Knowledge Seeker',
    description: 'Read 10 bias insights',
    icon: '🧠',
    tier: 'silver',
    xpReward: 150,
    pointsReward: 75,
    target: 10,
    category: 'features'
  },
  {
    id: 'journal-10',
    title: 'Reflective Mind',
    description: 'Make 10 journal entries',
    icon: '📝',
    tier: 'gold',
    xpReward: 300,
    pointsReward: 150,
    target: 10,
    category: 'features'
  },
  {
    id: 'all-features',
    title: 'Feature Master',
    description: 'Use all app features',
    icon: '🎨',
    tier: 'platinum',
    xpReward: 500,
    pointsReward: 250,
    target: 5,
    category: 'features'
  },
  
  // Special achievements
  {
    id: 'profile-complete',
    title: 'Identity Established',
    description: 'Complete your profile',
    icon: '👤',
    tier: 'bronze',
    xpReward: 100,
    pointsReward: 50,
    target: 1,
    category: 'special'
  },
  {
    id: 'feedback-given',
    title: 'Voice Heard',
    description: 'Give feedback on the app',
    icon: '💬',
    tier: 'silver',
    xpReward: 100,
    pointsReward: 50,
    target: 1,
    category: 'special'
  },
  {
    id: 'level-10',
    title: 'Rising Champion',
    description: 'Reach level 10',
    icon: '🚀',
    tier: 'gold',
    xpReward: 500,
    pointsReward: 250,
    target: 10,
    category: 'special'
  },
  {
    id: 'level-25',
    title: 'Master of Self',
    description: 'Reach level 25',
    icon: '🎖️',
    tier: 'platinum',
    xpReward: 1000,
    pointsReward: 500,
    target: 25,
    category: 'special'
  },
  {
    id: 'level-50',
    title: 'The Exceptional One',
    description: 'Reach maximum level 50',
    icon: '🏆',
    tier: 'diamond',
    xpReward: 10000,
    pointsReward: 5000,
    target: 50,
    category: 'special'
  }
];

// Initialize achievements
export function initializeAchievements(): EnhancedAchievement[] {
  return ENHANCED_ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: false,
    progress: 0
  }));
}

// Get all achievements with current progress
export function getEnhancedAchievements(): EnhancedAchievement[] {
  const data = getGamificationData();
  
  if (data.achievements.length === 0) {
    data.achievements = initializeAchievements();
    localStorage.setItem('gamificationData', JSON.stringify(data));
  }
  
  return data.achievements;
}

// Check and unlock achievements
export function checkAchievements(): EnhancedAchievement[] {
  const data = getGamificationData();
  const newlyUnlocked: EnhancedAchievement[] = [];
  
  if (data.achievements.length === 0) {
    data.achievements = initializeAchievements();
  }
  
  data.achievements.forEach(achievement => {
    if (achievement.unlocked) return;
    
    let currentProgress = 0;
    
    // Calculate progress based on achievement type
    switch (achievement.id) {
      case 'first-visit':
      case 'visits-10':
      case 'visits-50':
      case 'visits-100':
        currentProgress = data.stats.totalVisits;
        break;
      
      case 'streak-3':
      case 'streak-7':
      case 'streak-30':
      case 'streak-100':
        currentProgress = data.stats.longestStreak;
        break;
      
      case 'accomplishment-1':
      case 'accomplishment-10':
      case 'accomplishment-50':
      case 'accomplishment-100':
      case 'accomplishment-500':
        currentProgress = data.stats.totalAccomplishments;
        break;
      
      case 'affirmations-10':
        currentProgress = data.stats.totalAffirmationsViewed;
        break;
      
      case 'insights-10':
        currentProgress = data.stats.totalInsightsViewed;
        break;
      
      case 'journal-10':
        currentProgress = data.stats.totalJournalEntries;
        break;
      
      case 'all-features':
        const featuresUsed = 
          (data.stats.totalAffirmationsViewed > 0 ? 1 : 0) +
          (data.stats.totalInsightsViewed > 0 ? 1 : 0) +
          (data.stats.totalJournalEntries > 0 ? 1 : 0) +
          (data.stats.totalAccomplishments > 0 ? 1 : 0) +
          (data.stats.totalVisits > 0 ? 1 : 0);
        currentProgress = featuresUsed;
        break;
      
      case 'profile-complete':
        const profile = localStorage.getItem('userProfile');
        currentProgress = profile ? 1 : 0;
        break;
      
      case 'feedback-given':
        const feedback = localStorage.getItem('lastFeedbackDate');
        currentProgress = feedback ? 1 : 0;
        break;
      
      case 'level-10':
      case 'level-25':
      case 'level-50':
        currentProgress = data.level;
        break;
    }
    
    achievement.progress = currentProgress;
    
    // Check if unlocked
    if (currentProgress >= achievement.target) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      
      // Award XP and points
      data.xp += achievement.xpReward;
      data.totalXpEarned += achievement.xpReward;
      data.points += achievement.pointsReward;
      data.stats.achievementsUnlocked++;
      
      newlyUnlocked.push(achievement);
    }
  });
  
  // Check for level up
  const { calculateXPForLevel } = require('@/types/gamification');
  while (data.xp >= data.xpToNextLevel && data.level < 50) {
    data.xp -= data.xpToNextLevel;
    data.level++;
    data.xpToNextLevel = calculateXPForLevel(data.level + 1);
  }
  
  localStorage.setItem('gamificationData', JSON.stringify(data));
  
  return newlyUnlocked;
}

// Get achievements by category
export function getAchievementsByCategory(category: EnhancedAchievement['category']): EnhancedAchievement[] {
  return getEnhancedAchievements().filter(a => a.category === category);
}

// Get achievements by tier
export function getAchievementsByTier(tier: EnhancedAchievement['tier']): EnhancedAchievement[] {
  return getEnhancedAchievements().filter(a => a.tier === tier);
}

// Get achievement stats
export function getAchievementStats(): {
  total: number;
  unlocked: number;
  percentage: number;
  byTier: Record<string, { total: number; unlocked: number }>;
} {
  const achievements = getEnhancedAchievements();
  const unlocked = achievements.filter(a => a.unlocked);
  
  const byTier: Record<string, { total: number; unlocked: number }> = {
    bronze: { total: 0, unlocked: 0 },
    silver: { total: 0, unlocked: 0 },
    gold: { total: 0, unlocked: 0 },
    platinum: { total: 0, unlocked: 0 },
    diamond: { total: 0, unlocked: 0 }
  };
  
  achievements.forEach(a => {
    byTier[a.tier].total++;
    if (a.unlocked) byTier[a.tier].unlocked++;
  });
  
  return {
    total: achievements.length,
    unlocked: unlocked.length,
    percentage: (unlocked.length / achievements.length) * 100,
    byTier
  };
}
