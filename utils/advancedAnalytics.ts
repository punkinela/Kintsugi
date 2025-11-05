// Advanced Analytics for Personal Insights

import { JournalEntry } from '@/types/engagement';
import { getEngagementData } from './engagement';

export interface MoodDataPoint {
  date: string;
  mood: string;
  score: number; // 1-5 scale
}

export interface WordFrequency {
  word: string;
  count: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface JournalingPattern {
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  averageLength: number;
  mostProductiveDay: string;
  journalingFrequency: number; // entries per week
  consistencyScore: number; // 0-100
}

export interface PersonalStats {
  totalEntries: number;
  totalWords: number;
  averageWordsPerEntry: number;
  longestEntry: number;
  shortestEntry: number;
  mostProductiveMonth: string;
  currentStreak: number;
  longestStreak: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  favoriteCategories: { category: string; count: number }[];
  topTags: { tag: string; count: number }[];
  moodDistribution: { mood: string; count: number; percentage: number }[];
}

// ============================================
// MOOD TRACKING
// ============================================

const MOOD_SCORES = {
  'great': 5,
  'good': 4,
  'neutral': 3,
  'challenging': 2,
  'difficult': 1
};

export function getMoodData(entries: JournalEntry[], days: number = 30): MoodDataPoint[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return entries
    .filter(entry => new Date(entry.date) >= cutoffDate && entry.mood)
    .map(entry => ({
      date: entry.date,
      mood: entry.mood!,
      score: MOOD_SCORES[entry.mood as keyof typeof MOOD_SCORES] || 3
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getMoodTrend(entries: JournalEntry[]): 'improving' | 'declining' | 'stable' {
  const moodData = getMoodData(entries, 14);

  if (moodData.length < 2) return 'stable';

  const firstHalf = moodData.slice(0, Math.floor(moodData.length / 2));
  const secondHalf = moodData.slice(Math.floor(moodData.length / 2));

  const firstAvg = firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length;

  const diff = secondAvg - firstAvg;

  if (diff > 0.3) return 'improving';
  if (diff < -0.3) return 'declining';
  return 'stable';
}

export function getAverageMood(entries: JournalEntry[], days?: number): number {
  const moodData = days ? getMoodData(entries, days) : getMoodData(entries, 365);

  if (moodData.length === 0) return 3;

  const sum = moodData.reduce((acc, d) => acc + d.score, 0);
  return sum / moodData.length;
}

export function getMoodCalendar(entries: JournalEntry[], year?: number, month?: number): Map<string, number> {
  const calendar = new Map<string, number>();

  entries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      if (year && entryDate.getFullYear() !== year) return false;
      if (month !== undefined && entryDate.getMonth() !== month) return false;
      return entry.mood !== undefined;
    })
    .forEach(entry => {
      calendar.set(entry.date, MOOD_SCORES[entry.mood as keyof typeof MOOD_SCORES] || 3);
    });

  return calendar;
}

// ============================================
// WORD FREQUENCY & CLOUD
// ============================================

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
  'its', 'our', 'their', 'me', 'him', 'her', 'us', 'them', 'what', 'which',
  'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very'
]);

const POSITIVE_WORDS = new Set([
  'great', 'good', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
  'happy', 'joy', 'love', 'success', 'achieve', 'proud', 'grateful', 'thankful',
  'blessed', 'excited', 'accomplished', 'progress', 'growth', 'improve', 'better',
  'win', 'victory', 'triumph', 'celebrate', 'breakthrough', 'milestone'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'poor', 'terrible', 'awful', 'horrible', 'sad', 'difficult', 'hard',
  'struggle', 'fail', 'failure', 'disappointed', 'frustrated', 'angry', 'upset',
  'worried', 'stress', 'anxiety', 'problem', 'issue', 'challenge', 'obstacle'
]);

export function extractWords(entries: JournalEntry[]): WordFrequency[] {
  const wordCount = new Map<string, number>();

  entries.forEach(entry => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
    const words = text.match(/\b[a-z]{3,}\b/g) || [];

    words.forEach(word => {
      if (!STOP_WORDS.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });
  });

  return Array.from(wordCount.entries())
    .map(([word, count]): WordFrequency => ({
      word,
      count,
      sentiment: POSITIVE_WORDS.has(word) ? 'positive' :
                 NEGATIVE_WORDS.has(word) ? 'negative' : 'neutral'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50); // Top 50 words
}

// ============================================
// JOURNALING PATTERNS
// ============================================

export function analyzeJournalingPatterns(entries: JournalEntry[]): JournalingPattern {
  if (entries.length === 0) {
    return {
      preferredTime: 'evening',
      averageLength: 0,
      mostProductiveDay: 'Monday',
      journalingFrequency: 0,
      consistencyScore: 0
    };
  }

  // Analyze time of day
  const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  entries.forEach(entry => {
    const hour = new Date(entry.date).getHours();
    if (hour >= 5 && hour < 12) timeSlots.morning++;
    else if (hour >= 12 && hour < 17) timeSlots.afternoon++;
    else if (hour >= 17 && hour < 22) timeSlots.evening++;
    else timeSlots.night++;
  });

  const preferredTime = (Object.keys(timeSlots) as Array<keyof typeof timeSlots>)
    .reduce((a, b) => timeSlots[a] > timeSlots[b] ? a : b);

  // Calculate average length
  const totalWords = entries.reduce((sum, entry) => {
    const words = `${entry.accomplishment} ${entry.reflection || ''}`.split(/\s+/).length;
    return sum + words;
  }, 0);
  const averageLength = Math.round(totalWords / entries.length);

  // Find most productive day
  const dayCount = new Map<string, number>();
  entries.forEach(entry => {
    const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
    dayCount.set(day, (dayCount.get(day) || 0) + 1);
  });

  const mostProductiveDay = Array.from(dayCount.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Monday';

  // Calculate frequency (entries per week)
  const daySpan = entries.length > 1
    ? (new Date(entries[entries.length - 1].date).getTime() - new Date(entries[0].date).getTime()) / (1000 * 60 * 60 * 24)
    : 7;
  const journalingFrequency = (entries.length / daySpan) * 7;

  // Consistency score (based on gaps between entries)
  let consistencyScore = 100;
  if (entries.length > 1) {
    const gaps: number[] = [];
    for (let i = 1; i < entries.length; i++) {
      const gap = (new Date(entries[i].date).getTime() - new Date(entries[i - 1].date).getTime()) / (1000 * 60 * 60 * 24);
      gaps.push(gap);
    }
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    consistencyScore = Math.max(0, 100 - (avgGap * 10)); // Lower gap = higher score
  }

  return {
    preferredTime,
    averageLength,
    mostProductiveDay,
    journalingFrequency: Math.round(journalingFrequency * 10) / 10,
    consistencyScore: Math.round(consistencyScore)
  };
}

// ============================================
// PERSONAL STATISTICS
// ============================================

export function calculatePersonalStats(entries: JournalEntry[]): PersonalStats {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      totalWords: 0,
      averageWordsPerEntry: 0,
      longestEntry: 0,
      shortestEntry: 0,
      mostProductiveMonth: 'N/A',
      currentStreak: 0,
      longestStreak: 0,
      entriesThisWeek: 0,
      entriesThisMonth: 0,
      favoriteCategories: [],
      topTags: [],
      moodDistribution: []
    };
  }

  const engagement = getEngagementData();

  // Word counts
  const wordCounts = entries.map(entry => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`;
    return text.split(/\s+/).length;
  });

  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const longestEntry = Math.max(...wordCounts);
  const shortestEntry = Math.min(...wordCounts);

  // Most productive month
  const monthCounts = new Map<string, number>();
  entries.forEach(entry => {
    const month = new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
  });
  const mostProductiveMonth = Array.from(monthCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Recent entries
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const entriesThisWeek = entries.filter(e => new Date(e.date) >= weekAgo).length;
  const entriesThisMonth = entries.filter(e => new Date(e.date) >= monthAgo).length;

  // Categories
  const categoryCount = new Map<string, number>();
  entries.forEach(entry => {
    if (entry.category) {
      categoryCount.set(entry.category, (categoryCount.get(entry.category) || 0) + 1);
    }
  });
  const favoriteCategories = Array.from(categoryCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Tags
  const tagCount = new Map<string, number>();
  entries.forEach(entry => {
    entry.tags?.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });
  const topTags = Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Mood distribution
  const moodCount = new Map<string, number>();
  entries.forEach(entry => {
    if (entry.mood) {
      moodCount.set(entry.mood, (moodCount.get(entry.mood) || 0) + 1);
    }
  });
  const totalMoods = Array.from(moodCount.values()).reduce((a, b) => a + b, 0);
  const moodDistribution = Array.from(moodCount.entries())
    .map(([mood, count]) => ({
      mood,
      count,
      percentage: totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalEntries: entries.length,
    totalWords,
    averageWordsPerEntry: Math.round(totalWords / entries.length),
    longestEntry,
    shortestEntry,
    mostProductiveMonth,
    currentStreak: engagement.currentStreak,
    longestStreak: engagement.longestStreak,
    entriesThisWeek,
    entriesThisMonth,
    favoriteCategories,
    topTags,
    moodDistribution
  };
}

// ============================================
// TIME SERIES DATA
// ============================================

export function getEntriesTimeSeries(entries: JournalEntry[], groupBy: 'day' | 'week' | 'month' = 'day') {
  const grouped = new Map<string, number>();

  entries.forEach(entry => {
    const date = new Date(entry.date);
    let key: string;

    if (groupBy === 'day') {
      // Use local date instead of UTC to match user's timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      key = `${year}-${month}-${day}`;
    } else if (groupBy === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const year = weekStart.getFullYear();
      const month = String(weekStart.getMonth() + 1).padStart(2, '0');
      const day = String(weekStart.getDate()).padStart(2, '0');
      key = `${year}-${month}-${day}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    grouped.set(key, (grouped.get(key) || 0) + 1);
  });

  return Array.from(grouped.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
