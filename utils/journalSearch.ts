// Search and filter utilities for journal entries

import { JournalEntry } from '@/types/engagement';

export interface SearchFilters {
  searchQuery?: string;
  tags?: string[];
  category?: string;
  mood?: string;
  dateFrom?: string;
  dateTo?: string;
  favoritesOnly?: boolean;
}

export interface SearchOptions {
  sortBy?: 'date-desc' | 'date-asc' | 'mood' | 'category';
  limit?: number;
}

// Search journal entries
export function searchJournalEntries(
  entries: JournalEntry[],
  filters: SearchFilters = {},
  options: SearchOptions = {}
): JournalEntry[] {
  let results = [...entries];

  // Filter by search query (searches accomplishment and reflection)
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    results = results.filter(entry =>
      entry.accomplishment.toLowerCase().includes(query) ||
      (entry.reflection && entry.reflection.toLowerCase().includes(query))
    );
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(entry =>
      entry.tags && entry.tags.some(tag => filters.tags!.includes(tag))
    );
  }

  // Filter by category
  if (filters.category) {
    results = results.filter(entry => entry.category === filters.category);
  }

  // Filter by mood
  if (filters.mood) {
    results = results.filter(entry => entry.mood === filters.mood);
  }

  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    results = results.filter(entry => new Date(entry.date) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // Include the entire end date
    results = results.filter(entry => new Date(entry.date) <= toDate);
  }

  // Filter favorites only
  if (filters.favoritesOnly) {
    results = results.filter(entry => entry.favorite === true);
  }

  // Sort results
  const sortBy = options.sortBy || 'date-desc';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'mood':
        const moodOrder = { great: 1, good: 2, neutral: 3, challenging: 4, difficult: 5 };
        return (moodOrder[a.mood || 'neutral'] || 3) - (moodOrder[b.mood || 'neutral'] || 3);
      case 'category':
        return (a.category || '').localeCompare(b.category || '');
      default:
        return 0;
    }
  });

  // Limit results
  if (options.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  return results;
}

// Get all unique tags from journal entries
export function getAllTags(entries: JournalEntry[]): string[] {
  const tagSet = new Set<string>();

  entries.forEach(entry => {
    if (entry.tags && entry.tags.length > 0) {
      entry.tags.forEach(tag => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
}

// Get all unique categories
export function getAllCategories(entries: JournalEntry[]): string[] {
  const categorySet = new Set<string>();

  entries.forEach(entry => {
    if (entry.category) {
      categorySet.add(entry.category);
    }
  });

  return Array.from(categorySet).sort();
}

// Get suggested tags based on content
export function suggestTags(accomplishment: string, reflection?: string): string[] {
  const text = `${accomplishment} ${reflection || ''}`.toLowerCase();
  const suggestions: string[] = [];

  const tagKeywords: Record<string, string[]> = {
    'work': ['work', 'job', 'career', 'project', 'meeting', 'presentation', 'deadline'],
    'health': ['health', 'exercise', 'workout', 'fitness', 'gym', 'run', 'yoga'],
    'learning': ['learn', 'study', 'course', 'read', 'book', 'skill', 'practice'],
    'personal': ['personal', 'self', 'growth', 'mindfulness', 'meditation', 'therapy'],
    'relationships': ['friend', 'family', 'partner', 'relationship', 'social', 'conversation'],
    'creativity': ['creative', 'art', 'design', 'writing', 'music', 'craft', 'paint'],
    'achievement': ['achieved', 'completed', 'finished', 'accomplished', 'success', 'won'],
    'challenge': ['challenge', 'difficult', 'hard', 'struggle', 'obstacle', 'overcome'],
    'gratitude': ['grateful', 'thankful', 'appreciate', 'blessed', 'lucky', 'fortunate'],
    'milestone': ['milestone', 'first', 'new', 'started', 'began', 'launched'],
  };

  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      suggestions.push(tag);
    }
  });

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

// Get mood statistics
export function getMoodStats(entries: JournalEntry[]) {
  const moodCounts = {
    great: 0,
    good: 0,
    neutral: 0,
    challenging: 0,
    difficult: 0
  };

  entries.forEach(entry => {
    if (entry.mood) {
      moodCounts[entry.mood]++;
    }
  });

  const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);

  return {
    counts: moodCounts,
    total,
    percentages: {
      great: total > 0 ? Math.round((moodCounts.great / total) * 100) : 0,
      good: total > 0 ? Math.round((moodCounts.good / total) * 100) : 0,
      neutral: total > 0 ? Math.round((moodCounts.neutral / total) * 100) : 0,
      challenging: total > 0 ? Math.round((moodCounts.challenging / total) * 100) : 0,
      difficult: total > 0 ? Math.round((moodCounts.difficult / total) * 100) : 0,
    }
  };
}

// Get tag statistics
export function getTagStats(entries: JournalEntry[]): { tag: string; count: number; percentage: number }[] {
  const tagCounts = new Map<string, number>();
  let totalTags = 0;

  entries.forEach(entry => {
    if (entry.tags && entry.tags.length > 0) {
      entry.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        totalTags++;
      });
    }
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: totalTags > 0 ? Math.round((count / totalTags) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}
