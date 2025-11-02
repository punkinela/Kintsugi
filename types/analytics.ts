// Analytics and feedback types

export interface UserFeedback {
  id: string;
  timestamp: string;
  rating: 1 | 2 | 3 | 4 | 5;
  experience: 'poor' | 'fair' | 'good' | 'great' | 'excellent';
  comment?: string;
  userProfile?: {
    name?: string;
    gender?: string;
    profession?: string;
  };
  sessionData: {
    visitCount: number;
    currentStreak: number;
    accomplishmentsLogged: number;
    daysActive: number;
  };
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalAccomplishments: number;
  averageStreak: number;
  feedbackCount: number;
  averageRating: number;
  userEngagement: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  featureUsage: {
    affirmationsViewed: number;
    insightsViewed: number;
    journalEntries: number;
    achievementsUnlocked: number;
  };
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export interface UserSession {
  userId: string;
  userName?: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  currentStreak: number;
  longestStreak: number;
  accomplishments: number;
  achievements: number;
  feedbackGiven: boolean;
  lastFeedbackDate?: string;
}
