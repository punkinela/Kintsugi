import { EngagementData, StreakInfo, Achievement } from '@/types/engagement';

const STORAGE_KEY = 'kintsugi_engagement';

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

  // Check new key first
  let stored = localStorage.getItem(STORAGE_KEY);

  // If new key is empty or has no entries, try the old key 'engagementData'
  if (!stored || (stored && JSON.parse(stored).journalEntries?.length === 0)) {
    const oldStored = localStorage.getItem('engagementData');
    if (oldStored) {
      try {
        const oldData = JSON.parse(oldStored);
        if (oldData.journalEntries && oldData.journalEntries.length > 0) {
          console.log('📦 getEngagementData: Found data in OLD key (engagementData), using that');
          return oldData;
        }
      } catch {
        // Ignore parse error, will fall through to default
      }
    }
  }

  if (!stored) return defaultEngagementData;

  try {
    const parsed = JSON.parse(stored);
    // Merge with defaults to ensure all fields exist
    return {
      ...defaultEngagementData,
      ...parsed,
      journalEntries: parsed.journalEntries || [],
      achievements: parsed.achievements || [],
      viewedInsightIds: parsed.viewedInsightIds || [],
    };
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

// Calculate streak from journal entries
export function calculateStreakFromEntries(entries: any[]): { currentStreak: number; longestStreak: number } {
  if (!entries || entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique days (in YYYY-MM-DD format)
  const uniqueDays = new Set<string>();
  sortedEntries.forEach(entry => {
    const date = new Date(entry.date);
    const dayStr = date.toISOString().split('T')[0];
    uniqueDays.add(dayStr);
  });

  const sortedDays = Array.from(uniqueDays).sort().reverse(); // Newest first

  if (sortedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Calculate current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;

  // Check if there's an entry today or yesterday
  if (sortedDays[0] === todayStr || sortedDays[0] === yesterdayStr) {
    currentStreak = 1;
    let checkDate = new Date(sortedDays[0]);

    // Count consecutive days going backwards
    for (let i = 1; i < sortedDays.length; i++) {
      const expectedPrevDay = new Date(checkDate);
      expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);
      const expectedStr = expectedPrevDay.toISOString().split('T')[0];

      if (sortedDays[i] === expectedStr) {
        currentStreak++;
        checkDate = new Date(sortedDays[i]);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < sortedDays.length - 1; i++) {
    const currentDate = new Date(sortedDays[i]);
    const nextDate = new Date(sortedDays[i + 1]);
    const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak)
  };
}

// Update streak based on journal entries
export function updateStreakFromEntries(): void {
  const data = getEngagementData();
  const { currentStreak, longestStreak } = calculateStreakFromEntries(data.journalEntries);

  data.currentStreak = currentStreak;
  data.longestStreak = longestStreak;

  saveEngagementData(data);
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

// Achievement definitions organized by category
const achievementDefinitions: Achievement[] = [
  // 🎯 Getting Started
  {
    id: 'first-visit',
    title: 'Welcome!',
    description: 'Started your journey of growth',
    icon: '🌟',
    category: 'getting-started',
  },
  {
    id: 'profile-complete',
    title: 'Profile Complete',
    description: 'Completed your profile setup',
    icon: '👤',
    category: 'getting-started',
  },
  {
    id: 'first-journal',
    title: 'First Entry',
    description: 'Created your first journal entry',
    icon: '✍️',
    category: 'getting-started',
  },

  // 🔥 Streaks
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Visited 3 days in a row',
    icon: '🔥',
    category: 'streaks',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '💪',
    category: 'streaks',
  },
  {
    id: 'streak-14',
    title: 'Two Week Champion',
    description: 'Amazing 14-day streak!',
    icon: '🏆',
    category: 'streaks',
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Incredible 30-day streak!',
    icon: '👑',
    category: 'streaks',
  },
  {
    id: 'streak-60',
    title: 'Consistency King/Queen',
    description: 'Outstanding 60-day streak!',
    icon: '💎',
    category: 'streaks',
  },
  {
    id: 'streak-100',
    title: 'Century Club',
    description: 'Legendary 100-day streak!',
    icon: '🎊',
    category: 'streaks',
  },

  // 📝 Journal Entries
  {
    id: 'journal-5',
    title: 'Reflection Starter',
    description: 'Recorded 5 accomplishments',
    icon: '📝',
    category: 'journaling',
  },
  {
    id: 'journal-10',
    title: 'Getting Consistent',
    description: 'Documented 10 accomplishments',
    icon: '📖',
    category: 'journaling',
  },
  {
    id: 'journal-20',
    title: 'Achievement Chronicler',
    description: 'Documented 20 accomplishments',
    icon: '📚',
    category: 'journaling',
  },
  {
    id: 'journal-50',
    title: 'Prolific Writer',
    description: 'Incredible! 50 entries logged',
    icon: '🖊️',
    category: 'journaling',
  },
  {
    id: 'journal-100',
    title: 'Master Journaler',
    description: 'Amazing! 100 accomplishments tracked',
    icon: '📜',
    category: 'journaling',
  },

  // ✨ Affirmations
  {
    id: 'affirmations-10',
    title: 'Affirmation Explorer',
    description: 'Viewed 10 affirmations',
    icon: '✨',
    category: 'affirmations',
  },
  {
    id: 'affirmations-50',
    title: 'Affirmation Enthusiast',
    description: 'Viewed 50 affirmations',
    icon: '🎯',
    category: 'affirmations',
  },
  {
    id: 'affirmations-100',
    title: 'Positivity Champion',
    description: 'Viewed 100 affirmations!',
    icon: '🌈',
    category: 'affirmations',
  },
  {
    id: 'custom-affirmation',
    title: 'Personal Touch',
    description: 'Created your first custom affirmation',
    icon: '💫',
    category: 'affirmations',
  },

  // 🧠 Insights
  {
    id: 'insights-1',
    title: 'First Insight',
    description: 'Explored your first bias insight',
    icon: '💡',
    category: 'insights',
  },
  {
    id: 'insights-5',
    title: 'Bias Aware',
    description: 'Explored 5 bias insights',
    icon: '🧠',
    category: 'insights',
  },
  {
    id: 'insights-10',
    title: 'Pattern Seeker',
    description: 'Reviewed 10 insights about yourself',
    icon: '🔍',
    category: 'insights',
  },

  // 📊 Analytics
  {
    id: 'mood-tracker',
    title: 'Mood Tracker',
    description: 'Logged moods for 5 entries',
    icon: '😊',
    category: 'analytics',
  },
  {
    id: 'tag-master',
    title: 'Tag Master',
    description: 'Used tags in 10 entries',
    icon: '🏷️',
    category: 'analytics',
  },
  {
    id: 'categories-5',
    title: 'Category Explorer',
    description: 'Used 5 different categories',
    icon: '📂',
    category: 'analytics',
  },

  // 💪 Milestones
  {
    id: 'week-complete',
    title: 'Week Complete',
    description: 'Logged entries for 7 different days',
    icon: '📅',
    category: 'milestones',
  },
  {
    id: 'month-anniversary',
    title: 'One Month In',
    description: 'Using the app for 30 days',
    icon: '🎂',
    category: 'milestones',
  },
  {
    id: 'wordsmith',
    title: 'Wordsmith',
    description: 'Written over 1,000 words total',
    icon: '📝',
    category: 'milestones',
  },
  {
    id: 'wordsmith-5k',
    title: 'Prolific Author',
    description: 'Written over 5,000 words total!',
    icon: '✍️',
    category: 'milestones',
  },

  // 🎨 Personalization
  {
    id: 'theme-switcher',
    title: 'Theme Explorer',
    description: 'Changed your theme preference',
    icon: '🎨',
    category: 'personalization',
  },
  {
    id: 'avatar-updated',
    title: 'Personal Brand',
    description: 'Updated your avatar',
    icon: '🖼️',
    category: 'personalization',
  },

  // 🌟 Special
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Logged entries on both Saturday and Sunday',
    icon: '🌅',
    category: 'special',
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Created an entry before 8 AM',
    icon: '🌄',
    category: 'special',
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Created an entry after 10 PM',
    icon: '🦉',
    category: 'special',
  },
  {
    id: 'feedback-giver',
    title: 'Feedback Provider',
    description: 'Shared feedback to help improve the app',
    icon: '💬',
    category: 'special',
  },
];

// Check and unlock achievements
export function checkAndUnlockAchievements(data: EngagementData): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  // Ensure required arrays exist
  if (!data.achievements) {
    data.achievements = [];
  }
  if (!data.journalEntries) {
    data.journalEntries = [];
  }
  const unlockedIds = new Set(data.achievements.map(a => a.id));

  // Helper functions
  const getTotalWords = () => {
    return data.journalEntries.reduce((sum, entry) => {
      const text = `${entry.accomplishment || ''} ${entry.reflection || ''}`;
      return sum + text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
  };

  const getUniqueDates = () => {
    const dates = new Set<string>();
    data.journalEntries.forEach(entry => {
      const date = new Date(entry.date).toDateString();
      dates.add(date);
    });
    return dates.size;
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    data.journalEntries.forEach(entry => {
      if (entry.category) categories.add(entry.category);
    });
    return categories.size;
  };

  const getMoodEntries = () => {
    return data.journalEntries.filter(entry => entry.mood).length;
  };

  const getTaggedEntries = () => {
    return data.journalEntries.filter(entry => entry.tags && entry.tags.length > 0).length;
  };

  const hasWeekendEntries = () => {
    const saturday = data.journalEntries.some(entry => new Date(entry.date).getDay() === 6);
    const sunday = data.journalEntries.some(entry => new Date(entry.date).getDay() === 0);
    return saturday && sunday;
  };

  const hasEarlyEntry = () => {
    return data.journalEntries.some(entry => {
      const hour = new Date(entry.date).getHours();
      return hour < 8;
    });
  };

  const hasLateEntry = () => {
    return data.journalEntries.some(entry => {
      const hour = new Date(entry.date).getHours();
      return hour >= 22;
    });
  };

  const getDaysSinceCreation = () => {
    if (!data.journalEntries.length) return 0;
    const firstEntry = data.journalEntries[data.journalEntries.length - 1];
    const now = new Date();
    const first = new Date(firstEntry.date);
    return Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  };

  achievementDefinitions.forEach(achievement => {
    if (unlockedIds.has(achievement.id)) return;

    let shouldUnlock = false;

    switch (achievement.id) {
      // Getting Started
      case 'first-visit':
        shouldUnlock = data.visitCount >= 1;
        break;
      case 'profile-complete':
        if (typeof window !== 'undefined') {
          const profile = localStorage.getItem('kintsugiUser');
          if (profile) {
            const parsed = JSON.parse(profile);
            shouldUnlock = !!parsed.name;
          }
        }
        break;
      case 'first-journal':
        shouldUnlock = data.journalEntries.length >= 1;
        break;

      // Streaks
      case 'streak-3':
        shouldUnlock = data.currentStreak >= 3;
        break;
      case 'streak-7':
        shouldUnlock = data.currentStreak >= 7;
        break;
      case 'streak-14':
        shouldUnlock = data.currentStreak >= 14;
        break;
      case 'streak-30':
        shouldUnlock = data.currentStreak >= 30;
        break;
      case 'streak-60':
        shouldUnlock = data.currentStreak >= 60;
        break;
      case 'streak-100':
        shouldUnlock = data.currentStreak >= 100;
        break;

      // Journal Entries
      case 'journal-5':
        shouldUnlock = data.journalEntries.length >= 5;
        break;
      case 'journal-10':
        shouldUnlock = data.journalEntries.length >= 10;
        break;
      case 'journal-20':
        shouldUnlock = data.journalEntries.length >= 20;
        break;
      case 'journal-50':
        shouldUnlock = data.journalEntries.length >= 50;
        break;
      case 'journal-100':
        shouldUnlock = data.journalEntries.length >= 100;
        break;

      // Affirmations
      case 'affirmations-10':
        shouldUnlock = data.affirmationsViewed >= 10;
        break;
      case 'affirmations-50':
        shouldUnlock = data.affirmationsViewed >= 50;
        break;
      case 'affirmations-100':
        shouldUnlock = data.affirmationsViewed >= 100;
        break;
      case 'custom-affirmation':
        if (typeof window !== 'undefined') {
          const customAffirmations = localStorage.getItem('kintsugi_custom_affirmations');
          shouldUnlock = !!customAffirmations && JSON.parse(customAffirmations).length > 0;
        }
        break;

      // Insights
      case 'insights-1':
        shouldUnlock = data.insightsViewed >= 1;
        break;
      case 'insights-5':
        shouldUnlock = data.insightsViewed >= 5;
        break;
      case 'insights-10':
        shouldUnlock = data.insightsViewed >= 10;
        break;

      // Analytics
      case 'mood-tracker':
        shouldUnlock = getMoodEntries() >= 5;
        break;
      case 'tag-master':
        shouldUnlock = getTaggedEntries() >= 10;
        break;
      case 'categories-5':
        shouldUnlock = getUniqueCategories() >= 5;
        break;

      // Milestones
      case 'week-complete':
        shouldUnlock = getUniqueDates() >= 7;
        break;
      case 'month-anniversary':
        shouldUnlock = getDaysSinceCreation() >= 30;
        break;
      case 'wordsmith':
        shouldUnlock = getTotalWords() >= 1000;
        break;
      case 'wordsmith-5k':
        shouldUnlock = getTotalWords() >= 5000;
        break;

      // Personalization
      case 'theme-switcher':
        if (typeof window !== 'undefined') {
          const themeChanges = localStorage.getItem('kintsugi_theme_changes');
          shouldUnlock = !!themeChanges && parseInt(themeChanges) > 0;
        }
        break;
      case 'avatar-updated':
        if (typeof window !== 'undefined') {
          const profile = localStorage.getItem('kintsugiUser');
          if (profile) {
            const parsed = JSON.parse(profile);
            shouldUnlock = parsed.avatar !== '👤';
          }
        }
        break;

      // Special
      case 'weekend-warrior':
        shouldUnlock = hasWeekendEntries();
        break;
      case 'early-bird':
        shouldUnlock = hasEarlyEntry();
        break;
      case 'night-owl':
        shouldUnlock = hasLateEntry();
        break;
      case 'feedback-giver':
        if (typeof window !== 'undefined') {
          const feedback = localStorage.getItem('kintsugi_user_feedback');
          shouldUnlock = !!feedback && JSON.parse(feedback).length > 0;
        }
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

  // Helper to calculate total words
  const getTotalWords = () => {
    return data.journalEntries.reduce((sum, entry) => {
      const text = `${entry.accomplishment || ''} ${entry.reflection || ''}`;
      return sum + text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
  };

  const getUniqueDates = () => {
    const dates = new Set<string>();
    data.journalEntries.forEach(entry => {
      const date = new Date(entry.date).toDateString();
      dates.add(date);
    });
    return dates.size;
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    data.journalEntries.forEach(entry => {
      if (entry.category) categories.add(entry.category);
    });
    return categories.size;
  };

  const getMoodEntries = () => {
    return data.journalEntries.filter(entry => entry.mood).length;
  };

  const getTaggedEntries = () => {
    return data.journalEntries.filter(entry => entry.tags && entry.tags.length > 0).length;
  };

  const getDaysSinceCreation = () => {
    if (!data.journalEntries.length) return 0;
    const firstEntry = data.journalEntries[data.journalEntries.length - 1];
    const now = new Date();
    const first = new Date(firstEntry.date);
    return Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  };

  return achievementDefinitions.map(achievement => {
    const unlocked = data.achievements.find(a => a.id === achievement.id);
    if (unlocked) return unlocked;

    // Calculate progress for locked achievements
    let progress = 0;
    let target = 1;

    switch (achievement.id) {
      // Streaks
      case 'streak-3':
        progress = data.currentStreak;
        target = 3;
        break;
      case 'streak-7':
        progress = data.currentStreak;
        target = 7;
        break;
      case 'streak-14':
        progress = data.currentStreak;
        target = 14;
        break;
      case 'streak-30':
        progress = data.currentStreak;
        target = 30;
        break;
      case 'streak-60':
        progress = data.currentStreak;
        target = 60;
        break;
      case 'streak-100':
        progress = data.currentStreak;
        target = 100;
        break;

      // Journal Entries
      case 'journal-5':
        progress = data.journalEntries.length;
        target = 5;
        break;
      case 'journal-10':
        progress = data.journalEntries.length;
        target = 10;
        break;
      case 'journal-20':
        progress = data.journalEntries.length;
        target = 20;
        break;
      case 'journal-50':
        progress = data.journalEntries.length;
        target = 50;
        break;
      case 'journal-100':
        progress = data.journalEntries.length;
        target = 100;
        break;

      // Affirmations
      case 'affirmations-10':
        progress = data.affirmationsViewed;
        target = 10;
        break;
      case 'affirmations-50':
        progress = data.affirmationsViewed;
        target = 50;
        break;
      case 'affirmations-100':
        progress = data.affirmationsViewed;
        target = 100;
        break;

      // Insights
      case 'insights-1':
        progress = data.insightsViewed;
        target = 1;
        break;
      case 'insights-5':
        progress = data.insightsViewed;
        target = 5;
        break;
      case 'insights-10':
        progress = data.insightsViewed;
        target = 10;
        break;

      // Analytics
      case 'mood-tracker':
        progress = getMoodEntries();
        target = 5;
        break;
      case 'tag-master':
        progress = getTaggedEntries();
        target = 10;
        break;
      case 'categories-5':
        progress = getUniqueCategories();
        target = 5;
        break;

      // Milestones
      case 'week-complete':
        progress = getUniqueDates();
        target = 7;
        break;
      case 'month-anniversary':
        progress = getDaysSinceCreation();
        target = 30;
        break;
      case 'wordsmith':
        progress = getTotalWords();
        target = 1000;
        break;
      case 'wordsmith-5k':
        progress = getTotalWords();
        target = 5000;
        break;
    }

    return {
      ...achievement,
      progress: Math.min(progress, target),
      target,
    };
  });
}
