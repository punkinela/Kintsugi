'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Calendar, Tag, Sparkles, TrendingUp, Award, Download, BarChart3 } from 'lucide-react';
import { JournalEntry } from '@/types/engagement';
import { getEngagementData, saveEngagementData, updateStreakFromEntries } from '@/utils/engagement';
import { analyzeAccomplishment, generateSummary, generateInsights, AnalysisResult } from '@/utils/accomplishmentAnalyzer';
import { awardXP, incrementStat } from '@/utils/gamification';
import AccomplishmentHelper from './AccomplishmentHelper';
import MushinReflectionMode from './MushinReflectionMode';
import SmartAnalysisPanel from './SmartAnalysisPanel';

interface EnhancedProgressJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedProgressJournal({ isOpen, onClose }: EnhancedProgressJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    return getEngagementData().journalEntries || [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    accomplishment: '',
    reflection: '',
    category: '',
    mood: '' as 'great' | 'good' | 'neutral' | 'challenging' | 'difficult' | '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const data = getEngagementData();
      setEntries(data.journalEntries || []);
    }
  }, [isOpen]);

  const handleAnalyze = () => {
    if (newEntry.accomplishment.trim()) {
      const result = analyzeAccomplishment(newEntry.accomplishment);
      setAnalysis(result);
      setShowAnalysis(true);
      
      // Auto-fill category if not set
      if (!newEntry.category && result.categories.length > 0) {
        setNewEntry({
          ...newEntry,
          category: result.categories[0].charAt(0).toUpperCase() + result.categories[0].slice(1)
        });
      }
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.accomplishment.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      accomplishment: newEntry.accomplishment,
      reflection: newEntry.reflection || undefined,
      category: newEntry.category || (analysis?.categories[0] ?
        analysis.categories[0].charAt(0).toUpperCase() + analysis.categories[0].slice(1) :
        'General'),
      mood: newEntry.mood || undefined,
      tags: newEntry.tags.length > 0 ? newEntry.tags : undefined,
    };

    const data = getEngagementData();
    data.journalEntries.unshift(entry);
    saveEngagementData(data);

    // Update streak based on all impact entries
    updateStreakFromEntries();

    // Award XP for impact entry
    const xpResult = awardXP('journal');

    // Update gamification stats
    incrementStat('totalJournalEntries', 1);

    // Trigger data update events for other components
    window.dispatchEvent(new Event('kintsugi-data-updated'));
    window.dispatchEvent(new Event('gamification-update'));

    setEntries(data.journalEntries);
    setNewEntry({ accomplishment: '', reflection: '', category: '', mood: '', tags: [] });
    setTagInput('');
    setShowAddForm(false);
    setShowAnalysis(false);
    setAnalysis(null);

    // Show XP notification if leveled up
    if (xpResult.leveledUp) {
      console.log(`🎉 Level Up! You're now level ${xpResult.newLevel}!`);
    }
  };

  const handleExport = () => {
    const summary = generateSummary(entries.map(e => e.accomplishment));
    const insights = generateInsights(entries.map(e => e.accomplishment));
    
    let exportText = '# My Accomplishments\n\n';
    exportText += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    exportText += '## Summary\n';
    exportText += `- Total Accomplishments: ${summary.totalCount}\n`;
    exportText += `- Top Categories: ${summary.topCategories.map(c => c.category).join(', ')}\n`;
    exportText += `- Key Skills: ${summary.topSkills.slice(0, 5).map(s => s.skill).join(', ')}\n\n`;
    
    exportText += '## Insights\n';
    insights.forEach(insight => {
      exportText += `- ${insight}\n`;
    });
    exportText += '\n';
    
    exportText += '## Detailed Accomplishments\n\n';
    entries.forEach((entry, index) => {
      exportText += `### ${index + 1}. ${entry.category || 'General'}\n`;
      exportText += `**Date:** ${new Date(entry.date).toLocaleDateString()}\n\n`;
      exportText += `${entry.accomplishment}\n\n`;
      if (entry.reflection) {
        exportText += `*Reflection:* ${entry.reflection}\n\n`;
      }
      exportText += '---\n\n';
    });
    
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accomplishments-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'exceptional': return 'text-purple-600 dark:text-purple-400';
      case 'high': return 'text-blue-600 dark:text-blue-400';
      case 'medium': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const summary = entries.length > 0 ? generateSummary(entries.map(e => e.accomplishment)) : null;
  const insights = entries.length > 0 ? generateInsights(entries.map(e => e.accomplishment)) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">
                My Accomplishments
              </h2>
            </div>
            <p className="text-white/90">
              Automated analysis helps you understand and articulate your achievements
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {entries.length > 0 && (
                <>
                  <button
                    onClick={() => setShowInsights(!showInsights)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-medium">View Insights</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Insights Panel */}
            {showInsights && insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Your Insights
                </h3>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">
                      {insight}
                    </p>
                  ))}
                </div>
                
                {summary && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">{summary.totalCount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Accomplishments</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-2xl font-bold text-pink-600">{summary.topSkills.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Skills Demonstrated</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{summary.topCategories.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Strength Areas</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Add Entry Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Record an Accomplishment
              </button>
            )}

            {/* Add Entry Form with Smart Analysis */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  New Accomplishment with Automated Analysis
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What did you accomplish? *
                    </label>
                    <textarea
                      value={newEntry.accomplishment}
                      onChange={(e) => setNewEntry({ ...newEntry, accomplishment: e.target.value })}
                      placeholder="e.g., Spoke up in a meeting, completed a project, helped a colleague..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                    />
                    
                    {/* Accomplishment Helper with Emoticons */}
                    <AccomplishmentHelper
                      text={newEntry.accomplishment}
                      onTextChange={(text) => setNewEntry({ ...newEntry, accomplishment: text })}
                      showHelper={true}
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleAnalyze}
                        disabled={!newEntry.accomplishment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        <Sparkles className="w-4 h-4" />
                        Analyze Impact
                      </button>
                    </div>

                    {/* Smart Analysis with Claude */}
                    <SmartAnalysisPanel
                      text={`${newEntry.accomplishment} ${newEntry.reflection}`}
                      showBiasDetection={true}
                    />
                  </div>

                  {/* Automated Analysis Results */}
                  {showAnalysis && analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-300 dark:border-purple-700"
                    >
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Smart Analysis Results
                      </h4>
                      
                      <div className="space-y-3">
                        {/* Categories */}
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Categories Detected:</p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.categories.map((cat, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Skills */}
                        {analysis.skills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Skills Identified:</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Impact Level */}
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Impact Level:</p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getImpactColor(analysis.impactLevel)}`}>
                            <Award className="w-4 h-4" />
                            {analysis.impactLevel.charAt(0).toUpperCase() + analysis.impactLevel.slice(1)}
                          </span>
                        </div>

                        {/* Strength Areas */}
                        {analysis.strengthAreas.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Strength Areas:</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.strengthAreas.map((area, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        {analysis.suggestions.length > 0 && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">💡 Suggestions to Strengthen:</p>
                            <ul className="space-y-1">
                              {analysis.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                  <span className="text-purple-600 mt-0.5">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reflection (Optional)
                    </label>
                    <textarea
                      value={newEntry.reflection}
                      onChange={(e) => setNewEntry({ ...newEntry, reflection: e.target.value })}
                      placeholder="How did this make you feel? What did you learn?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      rows={2}
                    />

                    {/* Mushin Reflection Mode - Non-judgmental observation */}
                    <MushinReflectionMode
                      text={`${newEntry.accomplishment} ${newEntry.reflection}`}
                      onTextChange={(newText) => {
                        // Update reflection with suggested text
                        setNewEntry({ ...newEntry, reflection: newText.replace(newEntry.accomplishment, '').trim() });
                      }}
                      isActive={true}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category {analysis && '(Auto-detected)'}
                    </label>
                    <input
                      type="text"
                      value={newEntry.category}
                      onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                      placeholder="e.g., Leadership, Technical, Creative"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      How are you feeling? (Optional)
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['great', 'good', 'neutral', 'challenging', 'difficult'] as const).map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setNewEntry({ ...newEntry, mood })}
                          className={`px-3 py-2 rounded-xl border-2 transition-all ${
                            newEntry.mood === mood
                              ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {mood === 'great' && '😄'}
                            {mood === 'good' && '🙂'}
                            {mood === 'neutral' && '😐'}
                            {mood === 'challenging' && '😟'}
                            {mood === 'difficult' && '😞'}
                          </div>
                          <div className="text-xs capitalize">{mood}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (Optional)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            e.preventDefault();
                            if (!newEntry.tags.includes(tagInput.trim())) {
                              setNewEntry({ ...newEntry, tags: [...newEntry.tags, tagInput.trim()] });
                            }
                            setTagInput('');
                          }
                        }}
                        placeholder="Add a tag and press Enter"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tagInput.trim() && !newEntry.tags.includes(tagInput.trim())) {
                            setNewEntry({ ...newEntry, tags: [...newEntry.tags, tagInput.trim()] });
                            setTagInput('');
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {newEntry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newEntry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => setNewEntry({
                                ...newEntry,
                                tags: newEntry.tags.filter((_, i) => i !== index)
                              })}
                              className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddEntry}
                      className="flex-1 bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Save Accomplishment
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setShowAnalysis(false);
                        setAnalysis(null);
                        setNewEntry({ accomplishment: '', reflection: '', category: '', mood: '', tags: [] });
                        setTagInput('');
                      }}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Entries List */}
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No accomplishments recorded yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Start documenting your achievements with Smart-powered insights!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(entry.date)}
                      </div>
                      {entry.category && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {entry.category}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-100 font-medium mb-2">
                      {entry.accomplishment}
                    </p>
                    
                    {entry.reflection && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                        "{entry.reflection}"
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
