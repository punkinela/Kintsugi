export interface EngagementData {
  lastVisit: string;
  visitCount: number;
  currentStreak: number;
  longestStreak: number;
  affirmationsViewed: number;
  insightsViewed: number;
  viewedInsightIds: string[]; // NEW: Track which specific insights were viewed
  achievements: Achievement[];
  journalEntries: JournalEntry[];
  reminderEnabled: boolean;
  reminderTime?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  accomplishment: string;
  reflection?: string;
  category?: string;
  tags?: string[];
  mood?: 'great' | 'good' | 'neutral' | 'challenging' | 'difficult';
  favorite?: boolean;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastVisit: Date | null;
  isActiveToday: boolean;
}
