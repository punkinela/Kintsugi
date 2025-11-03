// Enhanced analytics utilities for admin dashboard

import { UserFeedback, AnalyticsData } from '@/types/analytics';
import { getEngagementData } from './engagement';

// ============================================
// SENTIMENT ANALYSIS
// ============================================

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentAnalysis {
  sentiment: Sentiment;
  score: number; // -1 (negative) to 1 (positive)
  confidence: number; // 0 to 1
}

const positiveWords = [
  'love', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful',
  'helpful', 'perfect', 'best', 'beautiful', 'happy', 'good', 'nice', 'easy',
  'clear', 'useful', 'powerful', 'effective', 'brilliant', 'outstanding',
  'impressive', 'enjoy', 'appreciate', 'thank', 'inspiring', 'motivating'
];

const negativeWords = [
  'bad', 'terrible', 'awful', 'poor', 'hate', 'worst', 'useless', 'broken',
  'difficult', 'hard', 'confusing', 'frustrating', 'annoying', 'slow', 'bug',
  'error', 'problem', 'issue', 'disappointing', 'complicated', 'unclear',
  'missing', 'lacking', 'needs improvement', 'fail', 'crash'
];

export function analyzeSentiment(text: string): SentimentAnalysis {
  if (!text || text.trim().length === 0) {
    return { sentiment: 'neutral', score: 0, confidence: 0 };
  }

  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });

  const totalSentimentWords = positiveCount + negativeCount;
  const score = totalSentimentWords > 0
    ? (positiveCount - negativeCount) / totalSentimentWords
    : 0;

  const confidence = Math.min(totalSentimentWords / 5, 1); // Max confidence at 5+ sentiment words

  let sentiment: Sentiment = 'neutral';
  if (score > 0.2) sentiment = 'positive';
  else if (score < -0.2) sentiment = 'negative';

  return { sentiment, score, confidence };
}

export function analyzeFeedbackSentiments(feedback: UserFeedback[]): {
  positive: number;
  negative: number;
  neutral: number;
} {
  const sentiments = { positive: 0, negative: 0, neutral: 0 };

  feedback.forEach(item => {
    if (item.comment) {
      const analysis = analyzeSentiment(item.comment);
      sentiments[analysis.sentiment]++;
    } else {
      // Use rating as sentiment indicator if no comment
      if (item.rating >= 4) sentiments.positive++;
      else if (item.rating <= 2) sentiments.negative++;
      else sentiments.neutral++;
    }
  });

  return sentiments;
}

// ============================================
// KEYWORD EXTRACTION
// ============================================

const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his',
  'her', 'its', 'our', 'their', 'me', 'him', 'them', 'what', 'which',
  'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'am', 'im', 'ive'
]);

export interface KeywordData {
  word: string;
  count: number;
  sentiment?: Sentiment;
}

export function extractKeywords(feedback: UserFeedback[], minCount = 2): KeywordData[] {
  const wordCounts = new Map<string, number>();

  feedback.forEach(item => {
    if (!item.comment) return;

    const words = item.comment
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
  });

  const keywords: KeywordData[] = Array.from(wordCounts.entries())
    .filter(([_, count]) => count >= minCount)
    .map(([word, count]) => {
      // Determine sentiment of keyword
      let sentiment: Sentiment = 'neutral';
      if (positiveWords.includes(word)) sentiment = 'positive';
      else if (negativeWords.includes(word)) sentiment = 'negative';

      return { word, count, sentiment };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20 keywords

  return keywords;
}

// ============================================
// DEMOGRAPHICS ANALYTICS
// ============================================

export interface DemographicsData {
  byGender: Record<string, number>;
  byProfession: Record<string, number>;
  byEthnicity: Record<string, number>;
  totalUsers: number;
}

export function analyzeDemographics(feedback: UserFeedback[]): DemographicsData {
  const byGender: Record<string, number> = {};
  const byProfession: Record<string, number> = {};
  const byEthnicity: Record<string, number> = {};

  feedback.forEach(item => {
    if (item.userProfile?.gender) {
      byGender[item.userProfile.gender] = (byGender[item.userProfile.gender] || 0) + 1;
    }
    if (item.userProfile?.profession) {
      byProfession[item.userProfile.profession] = (byProfession[item.userProfile.profession] || 0) + 1;
    }
  });

  // Get ethnicity and other data from localStorage for current user
  const userProfile = localStorage.getItem('kintsugiUser');
  if (userProfile) {
    try {
      const profile = JSON.parse(userProfile);

      // Add current user to demographics if not already counted
      if (profile.gender && !Object.keys(byGender).length) {
        byGender[profile.gender] = 1;
      }
      if (profile.profession && !Object.keys(byProfession).length) {
        byProfession[profile.profession] = 1;
      }
      if (profile.ethnicity) {
        byEthnicity[profile.ethnicity] = 1;
      }
    } catch (e) {
      console.error('Error parsing user profile:', e);
    }
  }

  return {
    byGender,
    byProfession,
    byEthnicity,
    totalUsers: feedback.length
  };
}

// ============================================
// TIME-BASED ANALYTICS
// ============================================

export interface TimeSeriesData {
  date: string;
  value: number;
}

export function getEngagementOverTime(days = 30): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const engagementData = getEngagementData();
  const today = new Date();

  // Generate mock data based on current engagement
  // In production, this would come from actual historical data
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate engagement pattern
    const baseValue = engagementData.visitCount / days;
    const variance = Math.random() * baseValue * 0.5;
    const value = Math.max(0, Math.floor(baseValue + variance));

    data.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }

  return data;
}

export function getRatingsTrend(feedback: UserFeedback[]): TimeSeriesData[] {
  const ratingsByDate = new Map<string, number[]>();

  feedback.forEach(item => {
    const date = new Date(item.timestamp).toISOString().split('T')[0];
    if (!ratingsByDate.has(date)) {
      ratingsByDate.set(date, []);
    }
    ratingsByDate.get(date)!.push(item.rating);
  });

  return Array.from(ratingsByDate.entries())
    .map(([date, ratings]) => ({
      date,
      value: ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================
// COMPARATIVE ANALYTICS
// ============================================

export interface ComparativeMetrics {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export function compareWeekOverWeek(currentWeek: number, previousWeek: number): ComparativeMetrics {
  const change = currentWeek - previousWeek;
  const changePercent = previousWeek > 0 ? (change / previousWeek) * 100 : 0;

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (changePercent > 5) trend = 'up';
  else if (changePercent < -5) trend = 'down';

  return {
    current: currentWeek,
    previous: previousWeek,
    change,
    changePercent,
    trend
  };
}

// ============================================
// COHORT ANALYSIS
// ============================================

export interface CohortData {
  cohort: string; // e.g., "2024-W44"
  users: number;
  retention: {
    week0: number; // 100%
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
}

export function analyzeCohorts(): CohortData[] {
  const engagementData = getEngagementData();
  const cohorts: CohortData[] = [];

  // Get user's cohort (week they joined)
  const firstVisit = engagementData.lastVisit; // Using lastVisit as proxy
  const cohortDate = new Date(firstVisit);
  const cohortWeek = getWeekNumber(cohortDate);

  // Calculate retention (mock data based on current engagement)
  const currentStreak = engagementData.currentStreak;
  const cohort: CohortData = {
    cohort: `2024-W${cohortWeek}`,
    users: 1,
    retention: {
      week0: 100,
      week1: currentStreak >= 7 ? 100 : 0,
      week2: currentStreak >= 14 ? 100 : 0,
      week3: currentStreak >= 21 ? 100 : 0,
      week4: currentStreak >= 28 ? 100 : 0
    }
  };

  cohorts.push(cohort);
  return cohorts;
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// ============================================
// FUNNEL ANALYSIS
// ============================================

export interface FunnelStage {
  stage: string;
  users: number;
  percentage: number;
  dropoff?: number;
}

export function analyzeFunnel(): FunnelStage[] {
  const engagementData = getEngagementData();

  // Check if user exists
  const userExists = typeof window !== 'undefined' && !!localStorage.getItem('kintsugiUser');
  const visitCount = engagementData.visitCount > 0 ? engagementData.visitCount : (userExists ? 1 : 0);

  const stages = [
    { stage: 'Visited App', users: visitCount, percentage: 100 },
    { stage: 'Completed Profile', users: userExists ? 1 : 0, percentage: 100 },
    { stage: 'Viewed Affirmations', users: engagementData.affirmationsViewed, percentage: 0 },
    { stage: 'Created Journal Entry', users: engagementData.journalEntries.length, percentage: 0 },
    { stage: 'Unlocked Achievement', users: engagementData.achievements.length, percentage: 0 }
  ];

  // Calculate percentages and dropoff
  const totalUsers = stages[0].users || 1;

  return stages.map((stage, index) => {
    const percentage = (stage.users / totalUsers) * 100;
    const dropoff = index > 0
      ? stages[index - 1].percentage - percentage
      : 0;

    return {
      ...stage,
      percentage: Math.round(percentage),
      dropoff: Math.round(dropoff)
    };
  });
}

// ============================================
// USER JOURNEY TRACKING
// ============================================

export interface JourneyStep {
  step: string;
  timestamp: string;
  completed: boolean;
}

export function getUserJourney(): JourneyStep[] {
  const engagementData = getEngagementData();
  const journey: JourneyStep[] = [];

  // Build journey based on engagement data
  journey.push({
    step: 'First Visit',
    timestamp: engagementData.lastVisit,
    completed: true
  });

  if (engagementData.affirmationsViewed > 0) {
    journey.push({
      step: 'Viewed First Affirmation',
      timestamp: engagementData.lastVisit,
      completed: true
    });
  }

  if (engagementData.journalEntries.length > 0) {
    journey.push({
      step: 'Created First Journal Entry',
      timestamp: engagementData.journalEntries[0]?.date || engagementData.lastVisit,
      completed: true
    });
  }

  if (engagementData.currentStreak >= 3) {
    journey.push({
      step: 'Achieved 3-Day Streak',
      timestamp: engagementData.lastVisit,
      completed: true
    });
  }

  if (engagementData.achievements.length > 0) {
    journey.push({
      step: 'Unlocked First Achievement',
      timestamp: engagementData.lastVisit,
      completed: true
    });
  }

  return journey;
}

// ============================================
// ACTIVITY HEATMAP DATA
// ============================================

export interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

export function getActivityHeatmap(): HeatmapData[] {
  const heatmap: HeatmapData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Generate mock heatmap data
  // In production, this would track actual user activity
  days.forEach(day => {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate activity patterns (higher during work hours and evenings)
      let value = 0;
      if (hour >= 9 && hour <= 17) value = Math.floor(Math.random() * 10) + 5;
      else if (hour >= 18 && hour <= 22) value = Math.floor(Math.random() * 15) + 10;
      else value = Math.floor(Math.random() * 3);

      heatmap.push({ day, hour, value });
    }
  });

  return heatmap;
}
