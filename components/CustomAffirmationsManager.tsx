'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Eye, Edit2, Trash2, Download, Upload, Sparkles } from 'lucide-react';
import {
  getCustomAffirmations,
  createCustomAffirmation,
  updateCustomAffirmation,
  deleteCustomAffirmation,
  toggleAffirmationFavorite,
  incrementAffirmationViews,
  getCustomAffirmationStats,
  getFavoriteCustomAffirmations,
  exportCustomAffirmationsAsText,
  importAffirmationsFromText,
  suggestTagsForAffirmation,
  type CustomAffirmation
} from '@/utils/customAffirmations';

export default function CustomAffirmationsManager() {
  const [affirmations, setAffirmations] = useState<CustomAffirmation[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadAffirmations();
  }, [filter]);

  const loadAffirmations = () => {
    const all = filter === 'favorites' ? getFavoriteCustomAffirmations() : getCustomAffirmations();
    setAffirmations(all);
    setStats(getCustomAffirmationStats());
  };

  const handleCreate = (text: string, category: CustomAffirmation['category'], tags: string[]) => {
    createCustomAffirmation(text, category, tags);
    loadAffirmations();
    setShowNewForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this affirmation?')) {
      deleteCustomAffirmation(id);
      loadAffirmations();
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleAffirmationFavorite(id);
    loadAffirmations();
  };

  const handleExport = () => {
    const text = exportCustomAffirmationsAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-affirmations-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const count = importAffirmationsFromText(text);
        alert(`Imported ${count} affirmations!`);
        loadAffirmations();
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 theme-text-primary" />
              My Affirmations
            </h2>
            <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary mt-1">
              Create and manage your personal affirmations
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="p-2 bg-white dark:bg-kintsugi-dark-800 border theme-border-light dark:border-kintsugi-dark-700 rounded-lg hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 transition-colors"
              title="Export"
            >
              <Download className="h-5 w-5 theme-text-primary" />
            </button>
            <button
              onClick={handleImport}
              className="p-2 bg-white dark:bg-kintsugi-dark-800 border theme-border-light dark:border-kintsugi-dark-700 rounded-lg hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 transition-colors"
              title="Import"
            >
              <Upload className="h-5 w-5 theme-text-primary" />
            </button>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-4 py-2 theme-bg-primary hover:bg-theme-primary text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Total</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.favorites}</div>
              <div className="text-xs text-red-700 dark:text-red-300">Favorites</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalViews}</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">Views</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {new Date(affirmations[0]?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">Newest</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'favorites'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'theme-bg-primary text-white'
                : 'bg-white dark:bg-kintsugi-dark-800 text-kintsugi-dark-600 dark:theme-text-secondary hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Affirmations List */}
      <div className="space-y-3">
        <AnimatePresence>
          {affirmations.map((affirmation) => (
            <AffirmationCard
              key={affirmation.id}
              affirmation={affirmation}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>

        {affirmations.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-kintsugi-dark-800 rounded-xl border theme-border-light dark:border-kintsugi-dark-700">
            <Sparkles className="h-12 w-12 mx-auto theme-text-secondary mb-3" />
            <p className="text-kintsugi-dark-600 dark:theme-text-secondary mb-4">
              {filter === 'favorites' ? 'No favorite affirmations yet.' : 'No custom affirmations yet.'}
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="theme-text-primary hover:text-theme-primary font-medium"
            >
              Create your first affirmation
            </button>
          </div>
        )}
      </div>

      {/* New Affirmation Form */}
      {showNewForm && (
        <NewAffirmationForm
          onClose={() => setShowNewForm(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function AffirmationCard({
  affirmation,
  onToggleFavorite,
  onDelete
}: {
  affirmation: CustomAffirmation;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const categoryColors = {
    accomplishment: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    strength: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    growth: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    impact: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    custom: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border theme-border-light dark:border-kintsugi-dark-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${categoryColors[affirmation.category]}`}>
              {affirmation.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-kintsugi-dark-500 dark:theme-text-primary">
              <Eye className="h-3 w-3" />
              {affirmation.timesViewed}
            </div>
          </div>

          <p className="text-base font-medium text-kintsugi-dark-900 dark:text-white mb-2">
            {affirmation.text}
          </p>

          {affirmation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {affirmation.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded theme-bg-primary-light dark:bg-theme-primary/20 text-theme-primary dark:theme-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onToggleFavorite(affirmation.id)}
            className={`p-2 rounded-lg transition-all ${
              affirmation.isFavorite
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 text-kintsugi-dark-400'
            }`}
          >
            <Heart className={`h-4 w-4 ${affirmation.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onDelete(affirmation.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-kintsugi-dark-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NewAffirmationForm({
  onClose,
  onCreate
}: {
  onClose: () => void;
  onCreate: (text: string, category: CustomAffirmation['category'], tags: string[]) => void;
}) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CustomAffirmation['category']>('custom');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.length > 10) {
      const suggested = suggestTagsForAffirmation(value);
      setTags(suggested);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 10) {
      onCreate(text.trim(), category, tags);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl p-6 max-w-lg w-full"
      >
        <h3 className="text-xl font-bold text-kintsugi-dark-900 dark:text-white mb-4">
          Create New Affirmation
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Affirmation Text
            </label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={3}
              required
              minLength={10}
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
              placeholder="I am capable of achieving my goals..."
            />
            <p className="text-xs text-kintsugi-dark-500 dark:theme-text-primary mt-1">
              {text.length}/10 characters minimum
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CustomAffirmation['category'])}
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
            >
              <option value="accomplishment">Accomplishment</option>
              <option value="strength">Strength</option>
              <option value="growth">Growth</option>
              <option value="impact">Impact</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Tags {tags.length > 0 && <span className="text-xs">(suggested)</span>}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 theme-bg-primary-light dark:bg-theme-primary/20 text-theme-primary dark:theme-text-secondary rounded-lg hover:bg-theme-accent dark:hover:bg-theme-primary/40"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="px-2 py-1 text-xs rounded theme-bg-primary text-white cursor-pointer hover:bg-theme-primary"
                  >
                    #{tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={text.trim().length < 10}
              className="flex-1 px-4 py-2 theme-bg-primary hover:bg-theme-primary text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
