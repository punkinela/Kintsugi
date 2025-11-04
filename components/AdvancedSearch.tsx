'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, Tag, Smile, Bookmark, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';

interface SearchFilters {
  query: string;
  dateRange: 'all' | '7days' | '30days' | '90days' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  categories: string[];
  moods: string[];
  tags: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
}

interface AdvancedSearchProps {
  entries: JournalEntry[];
  onResultsChange: (results: JournalEntry[]) => void;
}

export default function AdvancedSearch({ entries, onResultsChange }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: 'all',
    categories: [],
    moods: [],
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load saved searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('kintsugi_saved_searches');
        if (stored) {
          setSavedSearches(JSON.parse(stored));
        }
      } catch {
        // Ignore errors
      }
    }
  }, []);

  // Get all unique categories, moods, and tags from entries
  const availableFilters = useMemo(() => {
    const categories = new Set<string>();
    const moods = new Set<string>();
    const tags = new Set<string>();

    entries.forEach(entry => {
      if (entry.category) categories.add(entry.category);
      if (entry.mood) moods.add(entry.mood);
      if (entry.tags) entry.tags.forEach(tag => tags.add(tag));
    });

    return {
      categories: Array.from(categories).sort(),
      moods: Array.from(moods).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [entries]);

  // Filter entries based on search criteria
  const filteredResults = useMemo(() => {
    let results = [...entries];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      results = results.filter(entry => {
        const accomplishment = (entry.accomplishment || '').toLowerCase();
        const reflection = (entry.reflection || '').toLowerCase();
        const category = (entry.category || '').toLowerCase();
        return accomplishment.includes(query) || reflection.includes(query) || category.includes(query);
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      if (filters.dateRange === 'custom' && filters.customStartDate) {
        startDate = new Date(filters.customStartDate);
        const endDate = filters.customEndDate ? new Date(filters.customEndDate) : now;
        results = results.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });
      } else {
        switch (filters.dateRange) {
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        results = results.filter(entry => new Date(entry.date) >= startDate);
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(entry =>
        entry.category && filters.categories.includes(entry.category)
      );
    }

    // Mood filter
    if (filters.moods.length > 0) {
      results = results.filter(entry =>
        entry.mood && filters.moods.includes(entry.mood)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      results = results.filter(entry =>
        entry.tags && entry.tags.some(tag => filters.tags.includes(tag))
      );
    }

    return results;
  }, [entries, filters]);

  // Update parent component with results
  useEffect(() => {
    onResultsChange(filteredResults);
  }, [filteredResults, onResultsChange]);

  const handleClearFilters = () => {
    setFilters({
      query: '',
      dateRange: 'all',
      categories: [],
      moods: [],
      tags: [],
    });
  };

  const handleSaveSearch = () => {
    if (!searchName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('kintsugi_saved_searches', JSON.stringify(updated));
    }

    setSearchName('');
    setShowSaveDialog(false);
  };

  const handleLoadSearch = (search: SavedSearch) => {
    setFilters(search.filters);
  };

  const handleDeleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('kintsugi_saved_searches', JSON.stringify(updated));
    }
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleMood = (mood: string) => {
    setFilters(prev => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter(m => m !== mood)
        : [...prev.moods, mood],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const activeFilterCount =
    (filters.query ? 1 : 0) +
    (filters.dateRange !== 'all' ? 1 : 0) +
    filters.categories.length +
    filters.moods.length +
    filters.tags.length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            placeholder="Search accomplishments and reflections..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-kintsugi-dark-800 text-gray-900 dark:text-white focus:border-kintsugi-gold-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
            showFilters || activeFilterCount > 0
              ? 'bg-kintsugi-gold-500 text-white'
              : 'bg-gray-100 dark:bg-kintsugi-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-700'
          }`}
        >
          <Filter className="h-5 w-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-kintsugi-gold-600 rounded-full px-2 py-0.5 text-sm font-bold">
              {activeFilterCount}
            </span>
          )}
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-kintsugi-gold-600 dark:text-kintsugi-gold-400">
            {filteredResults.length}
          </span>{' '}
          {filteredResults.length === 1 ? 'result' : 'results'} found
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="ml-3 text-kintsugi-gold-600 hover:text-kintsugi-gold-700 dark:text-kintsugi-gold-400 dark:hover:text-kintsugi-gold-300 font-medium"
            >
              Clear all filters
            </button>
          )}
        </p>

        {activeFilterCount > 0 && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-1 text-kintsugi-gold-600 hover:text-kintsugi-gold-700 dark:text-kintsugi-gold-400 dark:hover:text-kintsugi-gold-300 font-medium"
          >
            <Bookmark className="h-4 w-4" />
            Save Search
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 space-y-6">
              {/* Date Range */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Calendar className="h-4 w-4 text-kintsugi-gold-600" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: '7days', label: 'Last 7 Days' },
                    { value: '30days', label: 'Last 30 Days' },
                    { value: '90days', label: 'Last 90 Days' },
                    { value: 'custom', label: 'Custom' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value as any }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.dateRange === option.value
                          ? 'bg-kintsugi-gold-500 text-white'
                          : 'bg-gray-100 dark:bg-kintsugi-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {filters.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Start Date</label>
                      <input
                        type="date"
                        value={filters.customStartDate || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-kintsugi-dark-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">End Date</label>
                      <input
                        type="date"
                        value={filters.customEndDate || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-kintsugi-dark-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Categories */}
              {availableFilters.categories.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Tag className="h-4 w-4 text-kintsugi-gold-600" />
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.categories.map(category => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          filters.categories.includes(category)
                            ? 'bg-kintsugi-gold-500 text-white'
                            : 'bg-gray-100 dark:bg-kintsugi-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Moods */}
              {availableFilters.moods.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Smile className="h-4 w-4 text-kintsugi-gold-600" />
                    Moods
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.moods.map(mood => (
                      <button
                        key={mood}
                        onClick={() => toggleMood(mood)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          filters.moods.includes(mood)
                            ? 'bg-kintsugi-gold-500 text-white'
                            : 'bg-gray-100 dark:bg-kintsugi-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-600'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {availableFilters.tags.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Tag className="h-4 w-4 text-kintsugi-gold-600" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          filters.tags.includes(tag)
                            ? 'bg-kintsugi-gold-500 text-white'
                            : 'bg-gray-100 dark:bg-kintsugi-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-600'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Searches
          </h4>
          <div className="space-y-2">
            {savedSearches.map(search => (
              <div
                key={search.id}
                className="flex items-center justify-between bg-white dark:bg-blue-900/40 rounded-lg p-2"
              >
                <button
                  onClick={() => handleLoadSearch(search)}
                  className="flex-1 text-left text-sm font-medium text-blue-900 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-100"
                >
                  {search.name}
                </button>
                <button
                  onClick={() => handleDeleteSearch(search.id)}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Search Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Save Search
              </h3>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter search name..."
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-kintsugi-dark-700 text-gray-900 dark:text-white focus:border-kintsugi-gold-500 focus:outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                  className="flex-1 bg-kintsugi-gold-500 hover:bg-kintsugi-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 bg-gray-100 dark:bg-kintsugi-dark-700 hover:bg-gray-200 dark:hover:bg-kintsugi-dark-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
