// Analytics and feedback utilities

import { UserFeedback, AnalyticsData, UserSession } from '@/types/analytics';
import { getEngagementData } from './engagement';

// Generate unique user ID (stored in localStorage)
export function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Save user feedback
export function saveFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp'>): void {
  const allFeedback = getAllFeedback();
  const newFeedback: UserFeedback = {
    id: `feedback_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...feedback
  };
  
  allFeedback.push(newFeedback);
  localStorage.setItem('userFeedback', JSON.stringify(allFeedback));
  
  // Mark that user has given feedback
  localStorage.setItem('lastFeedbackDate', new Date().toISOString());
}

// Get all feedback
export function getAllFeedback(): UserFeedback[] {
  const feedback = localStorage.getItem('userFeedback');
  return feedback ? JSON.parse(feedback) : [];
}

// Check if user should be prompted for feedback
export function shouldPromptFeedback(): boolean {
  const lastFeedback = localStorage.getItem('lastFeedbackDate');
  const engagementData = getEngagementData();
  
  // Don't prompt if given feedback in last 7 days
  if (lastFeedback) {
    const daysSince = Math.floor((Date.now() - new Date(lastFeedback).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 7) return false;
  }
  
  // Prompt after 3 visits or 3 day streak
  return engagementData.visitCount >= 3 || engagementData.currentStreak >= 3;
}

// Get current user session data
export function getUserSession(): UserSession {
  const userId = getUserId();
  const engagementData = getEngagementData();
  const profile = localStorage.getItem('userProfile');
  const lastFeedback = localStorage.getItem('lastFeedbackDate');
  
  const userName = profile ? JSON.parse(profile).name : undefined;
  
  return {
    userId,
    userName,
    firstVisit: engagementData.lastVisit || new Date().toISOString(), // Use lastVisit as proxy for first
    lastVisit: engagementData.lastVisit || new Date().toISOString(),
    totalVisits: engagementData.visitCount,
    currentStreak: engagementData.currentStreak,
    longestStreak: engagementData.longestStreak,
    accomplishments: engagementData.journalEntries.length, // Journal entries are accomplishments
    achievements: engagementData.achievements.length,
    feedbackGiven: !!lastFeedback,
    lastFeedbackDate: lastFeedback || undefined
  };
}

// Get analytics data (for admin dashboard)
export function getAnalyticsData(): AnalyticsData {
  const allFeedback = getAllFeedback();
  const session = getUserSession();
  const engagementData = getEngagementData();
  
  // Calculate average rating
  const totalRating = allFeedback.reduce((sum, f) => sum + f.rating, 0);
  const averageRating = allFeedback.length > 0 ? totalRating / allFeedback.length : 0;
  
  return {
    totalUsers: 1, // In single-user mode, always 1
    activeUsers: session.totalVisits > 0 ? 1 : 0,
    totalAccomplishments: engagementData.journalEntries.length,
    averageStreak: engagementData.currentStreak,
    feedbackCount: allFeedback.length,
    averageRating,
    userEngagement: {
      daily: session.totalVisits,
      weekly: session.currentStreak,
      monthly: session.totalVisits
    },
    featureUsage: {
      affirmationsViewed: engagementData.affirmationsViewed,
      insightsViewed: engagementData.insightsViewed,
      journalEntries: engagementData.journalEntries.length,
      achievementsUnlocked: engagementData.achievements.length
    },
    userRetention: {
      day1: session.totalVisits >= 2 ? 100 : 0,
      day7: session.currentStreak >= 7 ? 100 : 0,
      day30: session.totalVisits >= 30 ? 100 : 0
    }
  };
}

// Export data for admin (as JSON)
export function exportAnalyticsData(): string {
  const analytics = getAnalyticsData();
  const feedback = getAllFeedback();
  const session = getUserSession();
  
  return JSON.stringify({
    analytics,
    feedback,
    session,
    exportDate: new Date().toISOString()
  }, null, 2);
}

// Export feedback as CSV
export function exportFeedbackAsCSV(): string {
  const feedback = getAllFeedback();
  
  // CSV Headers
  const headers = [
    'Date',
    'Rating',
    'Experience',
    'User Name',
    'Gender',
    'Profession',
    'Comment',
    'Visit Count',
    'Current Streak',
    'Accomplishments',
    'Days Active'
  ];
  
  // CSV Rows
  const rows = feedback.map(item => [
    new Date(item.timestamp).toLocaleDateString(),
    item.rating.toString(),
    item.experience,
    item.userProfile?.name || 'Anonymous',
    item.userProfile?.gender || 'N/A',
    item.userProfile?.profession || 'N/A',
    `"${(item.comment || '').replace(/"/g, '""')}"`, // Escape quotes
    item.sessionData.visitCount.toString(),
    item.sessionData.currentStreak.toString(),
    item.sessionData.accomplishmentsLogged.toString(),
    item.sessionData.daysActive.toString()
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

// Export analytics summary as CSV
export function exportAnalyticsSummaryAsCSV(): string {
  const analytics = getAnalyticsData();
  const session = getUserSession();
  
  const rows = [
    ['Metric', 'Value'],
    ['Export Date', new Date().toISOString()],
    [''],
    ['=== USER METRICS ===', ''],
    ['Total Users', analytics.totalUsers.toString()],
    ['Active Users', analytics.activeUsers.toString()],
    [''],
    ['=== ENGAGEMENT ===', ''],
    ['Total Accomplishments', analytics.totalAccomplishments.toString()],
    ['Average Streak', analytics.averageStreak.toString()],
    ['Current Streak', session.currentStreak.toString()],
    ['Longest Streak', session.longestStreak.toString()],
    ['Total Visits', session.totalVisits.toString()],
    [''],
    ['=== FEEDBACK ===', ''],
    ['Feedback Count', analytics.feedbackCount.toString()],
    ['Average Rating', analytics.averageRating.toFixed(2)],
    [''],
    ['=== FEATURE USAGE ===', ''],
    ['Affirmations Viewed', analytics.featureUsage.affirmationsViewed.toString()],
    ['Insights Viewed', analytics.featureUsage.insightsViewed.toString()],
    ['Journal Entries', analytics.featureUsage.journalEntries.toString()],
    ['Achievements Unlocked', analytics.featureUsage.achievementsUnlocked.toString()],
    [''],
    ['=== RETENTION ===', ''],
    ['Day 1 Retention', `${analytics.userRetention.day1}%`],
    ['Day 7 Retention', `${analytics.userRetention.day7}%`],
    ['Day 30 Retention', `${analytics.userRetention.day30}%`]
  ];
  
  return rows.map(row => row.join(',').trim()).join('\n');
}

// Export complete data as Excel-compatible CSV (with multiple sheets simulation)
export function exportCompleteDataAsCSV(): string {
  const analyticsSummary = exportAnalyticsSummaryAsCSV();
  const feedbackData = exportFeedbackAsCSV();
  
  return `=== ANALYTICS SUMMARY ===\n\n${analyticsSummary}\n\n\n=== USER FEEDBACK ===\n\n${feedbackData}`;
}

// Helper function to download file
export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Get experience label from rating
export function getExperienceLabel(rating: 1 | 2 | 3 | 4 | 5): 'poor' | 'fair' | 'good' | 'great' | 'excellent' {
  const labels: Record<number, 'poor' | 'fair' | 'good' | 'great' | 'excellent'> = {
    1: 'poor',
    2: 'fair',
    3: 'good',
    4: 'great',
    5: 'excellent'
  };
  return labels[rating];
}
