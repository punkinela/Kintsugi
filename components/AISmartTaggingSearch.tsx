'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, Sparkles, X, TrendingUp, Filter, ChevronDown, Hash, Clock, Star } from 'lucide-react';

interface AISmartTaggingSearchProps {
  entries?: SearchableEntry[];
  onEntryClick?: (entry: SearchableEntry) => void;
  compact?: boolean;
}

interface SearchableEntry {
  id: string;
  text: string;
  date: Date;
  manualTags?: string[];
}

interface TaggedEntry extends SearchableEntry {
  autoTags: Tag[];
  category: EntryCategory;
  skills: string[];
  relevanceScore?: number;
}

interface Tag {
  name: string;
  type: 'skill' | 'competency' | 'theme' | 'achievement';
  confidence: number; // 0-1
}

type EntryCategory = 'leadership' | 'technical' | 'collaboration' | 'innovation' | 'problem-solving' | 'impact';

interface SearchFilters {
  categories: EntryCategory[];
  tagTypes: Tag['type'][];
  dateRange: 'all' | 'week' | 'month' | 'year';
}

export default function AISmartTaggingSearch({ entries = [], onEntryClick, compact = false }: AISmartTaggingSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    tagTypes: [],
    dateRange: 'all'
  });

  // Tag and categorize all entries
  const taggedEntries = useMemo(() => {
    return entries.map(entry => tagEntry(entry));
  }, [entries]);

  // Extract all unique tags with frequency
  const allTags = useMemo(() => {
    const tagMap = new Map<string, { count: number; type: Tag['type'] }>();

    taggedEntries.forEach(entry => {
      entry.autoTags.forEach(tag => {
        const existing = tagMap.get(tag.name);
        if (existing) {
          existing.count++;
        } else {
          tagMap.set(tag.name, { count: 1, type: tag.type });
        }
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [taggedEntries]);

  // Search and filter entries
  const filteredEntries = useMemo(() => {
    let results = taggedEntries;

    // Apply search query
    if (searchQuery.trim()) {
      results = semanticSearch(results, searchQuery);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      results = results.filter(entry =>
        selectedTags.some(selectedTag =>
          entry.autoTags.some(tag => tag.name.toLowerCase() === selectedTag.toLowerCase()) ||
          entry.manualTags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
        )
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      results = results.filter(entry => filters.categories.includes(entry.category));
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      if (filters.dateRange === 'week') cutoffDate.setDate(now.getDate() - 7);
      else if (filters.dateRange === 'month') cutoffDate.setMonth(now.getMonth() - 1);
      else if (filters.dateRange === 'year') cutoffDate.setFullYear(now.getFullYear() - 1);

      results = results.filter(entry => entry.date >= cutoffDate);
    }

    return results;
  }, [taggedEntries, searchQuery, selectedTags, filters]);

  // Get popular tags
  const popularTags = allTags.slice(0, 15);

  // Get tag suggestions based on search query
  const suggestedTags = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return allTags
      .filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, allTags]);

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
    setFilters({
      categories: [],
      tagTypes: [],
      dateRange: 'all'
    });
  };

  const getTagTypeColor = (type: Tag['type']) => {
    switch (type) {
      case 'skill': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'competency': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'theme': return 'theme-bg-primary-light theme-text-primary border theme-border-light';
      case 'achievement': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
    }
  };

  const getCategoryColor = (category: EntryCategory) => {
    switch (category) {
      case 'leadership': return 'text-purple-600 dark:text-purple-400';
      case 'technical': return 'text-blue-600 dark:text-blue-400';
      case 'collaboration': return 'text-green-600 dark:text-green-400';
      case 'innovation': return 'text-orange-600 dark:text-orange-400';
      case 'problem-solving': return 'text-red-600 dark:text-red-400';
      case 'impact': return 'theme-text-primary';
    }
  };

  if (compact) {
    return (
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your achievements..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-kintsugi-dark-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 theme-focus-ring"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 theme-gradient-to-r rounded-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Smart Search</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Find entries by skills, themes, or semantic meaning
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements, skills, or outcomes..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-kintsugi-dark-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 theme-focus-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {suggestedTags.length > 0 && searchQuery && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => {
                    toggleTag(tag.name);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagTypeColor(tag.type)} hover:opacity-80 transition-opacity`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Active filters:</p>
              <button
                onClick={clearFilters}
                className="text-xs theme-text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => {
                const tagData = allTags.find(t => t.name === tag);
                return (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagTypeColor(tagData?.type || 'theme')} flex items-center gap-1`}
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm theme-text-primary hover:underline"
        >
          <Filter className="h-4 w-4" />
          <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg">
                {/* Category Filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Categories
                  </label>
                  <div className="space-y-1">
                    {(['leadership', 'technical', 'collaboration', 'innovation', 'problem-solving', 'impact'] as EntryCategory[]).map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, categories: [...prev.categories, category] }));
                            } else {
                              setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
                            }
                          }}
                          className="rounded theme-focus-ring"
                        />
                        <span className={`text-sm capitalize ${getCategoryColor(category)}`}>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Time Period
                  </label>
                  <div className="space-y-1">
                    {(['all', 'week', 'month', 'year'] as const).map(range => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dateRange"
                          checked={filters.dateRange === range}
                          onChange={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                          className="theme-focus-ring"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {range === 'all' ? 'All Time' : `Past ${range}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Tags Cloud */}
      {!searchQuery && selectedTags.length === 0 && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-4 w-4 theme-text-primary" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Popular Tags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button
                key={tag.name}
                onClick={() => toggleTag(tag.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTagTypeColor(tag.type)} hover:opacity-80 transition-all flex items-center gap-2`}
              >
                <span>{tag.name}</span>
                <span className="text-xs opacity-75">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'Result' : 'Results'}
          </h4>
          {searchQuery && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Semantic search results for "{searchQuery}"
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No entries match your search</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm theme-text-primary hover:underline"
                >
                  Clear filters and try again
                </button>
              </motion.div>
            ) : (
              filteredEntries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onEntryClick?.(entry)}
                  className="bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                >
                  {/* Entry Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded capitalize ${getCategoryColor(entry.category)}`}>
                        {entry.category}
                      </span>
                      {entry.relevanceScore !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Star className="h-3 w-3" />
                          <span>{Math.round(entry.relevanceScore * 100)}% match</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                  </div>

                  {/* Entry Text */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                    {highlightSearchTerms(entry.text, searchQuery)}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {entry.autoTags.slice(0, 6).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className={`px-2 py-0.5 text-xs rounded-full border ${getTagTypeColor(tag.type)}`}
                      >
                        {tag.name}
                      </span>
                    ))}
                    {entry.autoTags.length > 6 && (
                      <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                        +{entry.autoTags.length - 6} more
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// AI Tagging Logic
function tagEntry(entry: SearchableEntry): TaggedEntry {
  const text = entry.text.toLowerCase();
  const autoTags: Tag[] = [];

  // Skill detection
  const skillPatterns = [
    { pattern: /\b(javascript|python|java|react|typescript|sql|aws|docker)\b/gi, skill: 'programming' },
    { pattern: /\b(design|figma|photoshop|ux|ui)\b/gi, skill: 'design' },
    { pattern: /\b(data|analytics|metrics|reporting)\b/gi, skill: 'data-analysis' },
    { pattern: /\b(project management|agile|scrum)\b/gi, skill: 'project-management' },
    { pattern: /\b(presentation|public speaking|communication)\b/gi, skill: 'communication' },
  ];

  skillPatterns.forEach(({ pattern, skill }) => {
    if (pattern.test(text)) {
      autoTags.push({ name: skill, type: 'skill', confidence: 0.9 });
    }
  });

  // Competency detection
  if (/\b(led|leadership|managed team|mentored)\b/i.test(text)) {
    autoTags.push({ name: 'leadership', type: 'competency', confidence: 0.85 });
  }
  if (/\b(collaborated|teamwork|cross-functional|partnered)\b/i.test(text)) {
    autoTags.push({ name: 'collaboration', type: 'competency', confidence: 0.85 });
  }
  if (/\b(problem|solved|troubleshoot|debug)\b/i.test(text)) {
    autoTags.push({ name: 'problem-solving', type: 'competency', confidence: 0.8 });
  }
  if (/\b(innovate|creative|new approach|novel)\b/i.test(text)) {
    autoTags.push({ name: 'innovation', type: 'competency', confidence: 0.8 });
  }

  // Achievement detection
  if (/\d+%/.test(text)) {
    autoTags.push({ name: 'quantified-results', type: 'achievement', confidence: 0.95 });
  }
  if (/\b(award|recognition|promoted|exceeded)\b/i.test(text)) {
    autoTags.push({ name: 'recognition', type: 'achievement', confidence: 0.9 });
  }
  if (/\b(saved|reduced|decreased) .*(cost|time|budget)/i.test(text)) {
    autoTags.push({ name: 'cost-reduction', type: 'achievement', confidence: 0.9 });
  }
  if (/\b(improved|increased|grew|boosted)/i.test(text)) {
    autoTags.push({ name: 'performance-improvement', type: 'achievement', confidence: 0.85 });
  }

  // Theme detection
  if (/\b(customer|client|user)\b/i.test(text)) {
    autoTags.push({ name: 'customer-focused', type: 'theme', confidence: 0.8 });
  }
  if (/\b(efficiency|optimization|streamlin)\b/i.test(text)) {
    autoTags.push({ name: 'efficiency', type: 'theme', confidence: 0.8 });
  }
  if (/\b(quality|excellence|best practice)\b/i.test(text)) {
    autoTags.push({ name: 'quality', type: 'theme', confidence: 0.75 });
  }

  // Category determination
  let category: EntryCategory = 'impact';
  if (/\b(led|leadership|managed|directed)\b/i.test(text)) category = 'leadership';
  else if (/\b(code|technical|engineering|development)\b/i.test(text)) category = 'technical';
  else if (/\b(team|collaborated|partnered)\b/i.test(text)) category = 'collaboration';
  else if (/\b(innovate|creative|new)\b/i.test(text)) category = 'innovation';
  else if (/\b(problem|solved|fix)\b/i.test(text)) category = 'problem-solving';

  // Extract skills mentioned
  const skills: string[] = [];
  const commonSkills = ['javascript', 'python', 'react', 'leadership', 'communication', 'design', 'data analysis'];
  commonSkills.forEach(skill => {
    if (text.includes(skill)) skills.push(skill);
  });

  return {
    ...entry,
    autoTags,
    category,
    skills
  };
}

// Semantic search (simple implementation - could be enhanced with embeddings)
function semanticSearch(entries: TaggedEntry[], query: string): TaggedEntry[] {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 2);

  return entries
    .map(entry => {
      let score = 0;

      // Direct text match
      const textLower = entry.text.toLowerCase();
      queryTerms.forEach(term => {
        if (textLower.includes(term)) score += 10;
      });

      // Tag match
      entry.autoTags.forEach(tag => {
        queryTerms.forEach(term => {
          if (tag.name.toLowerCase().includes(term)) score += 15 * tag.confidence;
        });
      });

      // Skill match
      entry.skills.forEach(skill => {
        queryTerms.forEach(term => {
          if (skill.toLowerCase().includes(term)) score += 12;
        });
      });

      // Category match
      queryTerms.forEach(term => {
        if (entry.category.toLowerCase().includes(term)) score += 8;
      });

      return { ...entry, relevanceScore: Math.min(1, score / 50) };
    })
    .filter(entry => entry.relevanceScore! > 0)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

function highlightSearchTerms(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  let highlightedText: React.ReactNode = text;

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    highlightedText = parts.map((part, idx) =>
      regex.test(part) ? (
        <mark key={idx} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  });

  return highlightedText;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return date.toLocaleDateString();
}
