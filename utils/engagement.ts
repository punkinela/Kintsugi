import { EngagementData, StreakInfo, Achievement } from '@/types/engagement';

const STORAGE_KEY = 'iamremarkable_engagement';

// Default engagement data
const defaultEngagementData: EngagementData = {
  lastVisit: new Date().toISOString(),
  visitCount: 0,
  currentStreak: 0,
  longestStreak: 0,
  affirmationsViewed: 0,
  insightsViewed: 0,
  viewedInsightIds: [],
  achievements: [],
  journalEntries: [],
  reminderEnabled: false,
};

// Get engagement data from localStorage
export function getEngagementData(): EngagementData {
  if (typeof window === 'undefined') return defaultEngagementData;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultEngagementData;
  
  try {
    return JSON.parse(stored);
  } catch {
    return defaultEngagementData;
  }
}

// Save engagement data to localStorage
export function saveEngagementData(data: EngagementData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Calculate streak information
export function calculateStreak(lastVisit: string): StreakInfo {
  const now = new Date();
  const last = new Date(lastVisit);
  
  // Reset time to midnight for accurate day comparison
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  const data = getEngagementData();
  let currentStreak = data.currentStreak;
  
  if (daysDiff === 0) {
    // Same day - streak continues
    return {
      current: currentStreak,
      longest: data.longestStreak,
      lastVisit: last,
      isActiveToday: true,
    };
  } else if (daysDiff === 1) {
    // Next day - increment streak
    currentStreak += 1;
  } else if (daysDiff > 1) {
    // Missed days - reset streak
    currentStreak = 1;
  }
  
  const longestStreak = Math.max(currentStreak, data.longestStreak);
  
  return {
    current: currentStreak,
    longest: longestStreak,
    lastVisit: last,
    isActiveToday: daysDiff === 0,
  };
}

// Update visit and streak
export function recordVisit(): StreakInfo {
  const data = getEngagementData();
  const streakInfo = calculateStreak(data.lastVisit);
  
  const updatedData: EngagementData = {
    ...data,
    lastVisit: new Date().toISOString(),
    visitCount: data.visitCount + 1,
    currentStreak: streakInfo.current,
    longestStreak: streakInfo.longest,
  };
  
  saveEngagementData(updatedData);
  checkAndUnlockAchievements(updatedData);
  
  return streakInfo;
}

// Record affirmation view
export function recordAffirmationView(): void {
  const data = getEngagementData();
  const updatedData: EngagementData = {
    ...data,
    affirmationsViewed: data.affirmationsViewed + 1,
  };
  saveEngagementData(updatedData);
  checkAndUnlockAchievements(updatedData);
}

// Record insight view
export function recordInsightView(insightId?: string): void {
  const data = getEngagementData();
  const viewedIds = data.viewedInsightIds || [];
  
  // Add insight ID if provided and not already viewed
  const updatedViewedIds = insightId && !viewedIds.includes(insightId)
    ? [...viewedIds, insightId]
    : viewedIds;
  
  const updatedData: EngagementData = {
    ...data,
    insightsViewed: data.insightsViewed + 1,
    viewedInsightIds: updatedViewedIds,
  };
  saveEngagementData(updatedData);
  checkAndUnlockAchievements(updatedData);
}

// Achievement definitions
const achievementDefinitions: Achievement[] = [
  {
    id: 'first-visit',
    title: 'Welcome!',
    description: 'Started your remarkable journey',
    icon: '🌟',
  },
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Visited 3 days in a row',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '💪',
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Incredible 30-day streak!',
    icon: '👑',
  },
  {
    id: 'affirmations-10',
    title: 'Affirmation Explorer',
    description: 'Viewed 10 affirmations',
    icon: '✨',
  },
  {
    id: 'affirmations-50',
    title: 'Affirmation Enthusiast',
    description: 'Viewed 50 affirmations',
    icon: '🎯',
  },
  {
    id: 'insights-5',
    title: 'Bias Aware',
    description: 'Explored 5 bias insights',
    icon: '🧠',
  },
  {
    id: 'journal-5',
    title: 'Reflection Starter',
    description: 'Recorded 5 accomplishments',
    icon: '📝',
  },
  {
    id: 'journal-20',
    title: 'Achievement Chronicler',
    description: 'Documented 20 accomplishments',
    icon: '📚',
  },
];

// Check and unlock achievements
export function checkAndUnlockAchievements(data: EngagementData): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const unlockedIds = new Set(data.achievements.map(a => a.id));
  
  achievementDefinitions.forEach(achievement => {
    if (unlockedIds.has(achievement.id)) return;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first-visit':
        shouldUnlock = data.visitCount >= 1;
        break;
      case 'streak-3':
        shouldUnlock = data.currentStreak >= 3;
        break;
      case 'streak-7':
        shouldUnlock = data.currentStreak >= 7;
        break;
      case 'streak-30':
        shouldUnlock = data.currentStreak >= 30;
        break;
      case 'affirmations-10':
        shouldUnlock = data.affirmationsViewed >= 10;
        break;
      case 'affirmations-50':
        shouldUnlock = data.affirmationsViewed >= 50;
        break;
      case 'insights-5':
        shouldUnlock = data.insightsViewed >= 5;
        break;
      case 'journal-5':
        shouldUnlock = data.journalEntries.length >= 5;
        break;
      case 'journal-20':
        shouldUnlock = data.journalEntries.length >= 20;
        break;
    }
    
    if (shouldUnlock) {
      const unlockedAchievement = {
        ...achievement,
        unlockedAt: new Date().toISOString(),
      };
      data.achievements.push(unlockedAchievement);
      newlyUnlocked.push(unlockedAchievement);
    }
  });
  
  if (newlyUnlocked.length > 0) {
    saveEngagementData(data);
  }
  
  return newlyUnlocked;
}

// Get achievement progress
export function getAchievementProgress(): Achievement[] {
  const data = getEngagementData();
  const unlockedIds = new Set(data.achievements.map(a => a.id));
  
  return achievementDefinitions.map(achievement => {
    const unlocked = data.achievements.find(a => a.id === achievement.id);
    if (unlocked) return unlocked;
    
    // Calculate progress for locked achievements
    let progress = 0;
    let target = 1;
    
    switch (achievement.id) {
      case 'streak-3':
        progress = data.currentStreak;
        target = 3;
        break;
      case 'streak-7':
        progress = data.currentStreak;
        target = 7;
        break;
      case 'streak-30':
        progress = data.currentStreak;
        target = 30;
        break;
      case 'affirmations-10':
        progress = data.affirmationsViewed;
        target = 10;
        break;
      case 'affirmations-50':
        progress = data.affirmationsViewed;
        target = 50;
        break;
      case 'insights-5':
        progress = data.insightsViewed;
        target = 5;
        break;
      case 'journal-5':
        progress = data.journalEntries.length;
        target = 5;
        break;
      case 'journal-20':
        progress = data.journalEntries.length;
        target = 20;
        break;
    }
    
    return {
      ...achievement,
      progress: Math.min(progress, target),
      target,
    };
  });
}
