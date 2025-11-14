'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Brain, Target, CheckCircle2, Plus, X, Lightbulb, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { getEnhancedAchievements } from '@/utils/enhancedAchievements';

interface ImperfectionReflection {
  id: string;
  date: string;
  imperfection: string; // What was the challenge/failure/flaw?
  transformation: string; // How did it become a strength?
  lesson: string; // What did you learn?
  category: 'challenge' | 'mistake' | 'feedback' | 'setback';
}

export default function GrowthMindsetTracker() {
  const [reflections, setReflections] = useState<ImperfectionReflection[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  // Form state
  const [imperfection, setImperfection] = useState('');
  const [transformation, setTransformation] = useState('');
  const [lesson, setLesson] = useState('');
  const [category, setCategory] = useState<'challenge' | 'mistake' | 'feedback' | 'setback'>('challenge');

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('imperfectionReflections');
    if (stored) {
      setReflections(JSON.parse(stored));
    }
  }, []);

  const saveReflection = () => {
    if (!imperfection || !transformation || !lesson) return;

    const newReflection: ImperfectionReflection = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      imperfection,
      transformation,
      lesson,
      category
    };

    const updated = [newReflection, ...reflections];
    setReflections(updated);
    localStorage.setItem('imperfectionReflections', JSON.stringify(updated));

    // Store count for achievement tracking
    localStorage.setItem('imperfectionGratitudeCount', updated.length.toString());

    // Reset form
    setImperfection('');
    setTransformation('');
    setLesson('');
    setCategory('challenge');
    setShowAddForm(false);
  };

  const deleteReflection = (id: string) => {
    const updated = reflections.filter(r => r.id !== id);
    setReflections(updated);
    localStorage.setItem('imperfectionReflections', JSON.stringify(updated));
  };

  if (!isClient) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-purple-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Growth Mindset Tracker
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              For setbacks, challenges, and things that went WRONG (but you learned from)
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
              Transform your "cracks" into golden seams of wisdom
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {reflections.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Reflections</div>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {reflections.filter(r => r.category === 'mistake').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Mistakes → Lessons</div>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {reflections.filter(r => r.category === 'setback').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Setbacks → Strength</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Achievement Progress</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{reflections.length}/30</span>
          </div>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-sm ${reflections.length >= 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
              <CheckCircle2 className="h-4 w-4" />
              <span>Embracing Flaws (1 reflection)</span>
              {reflections.length >= 1 && <Award className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center gap-2 text-sm ${reflections.length >= 10 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
              <CheckCircle2 className="h-4 w-4" />
              <span>Flaw Transformer (10 reflections)</span>
              {reflections.length >= 10 && <Award className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center gap-2 text-sm ${reflections.length >= 30 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
              <CheckCircle2 className="h-4 w-4" />
              <span>Kintsugi Philosopher (30 reflections)</span>
              {reflections.length >= 30 && <Award className="h-4 w-4 ml-auto" />}
            </div>
          </div>
        </div>

        {/* When to Use This */}
        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-gray-700">
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
              💎 Use Growth Mindset Tracker for:
            </p>
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 ml-4">
              <li>• "Got rejected from 3 interviews but learned..."</li>
              <li>• "Missed deadline but built in buffer time now"</li>
              <li>• "Public call-out for vague emails, created checklist"</li>
              <li>• "Project failed but discovered better approach"</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/30">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                ✅ Got a win or accomplishment?
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use <strong>Quick Entry</strong> (in Home tab) to build momentum fast
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Add Reflection</span>
          </button>
          <button
            onClick={() => setShowEducation(!showEducation)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-gray-700 transition-all"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Fixed vs Growth Mindset</span>
            {showEducation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Educational Content */}
      <AnimatePresence>
        {showEducation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding Growth Mindset
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fixed Mindset */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <h4 className="font-bold text-red-700 dark:text-red-400">Fixed Mindset</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Believes abilities are static and unchangeable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Avoids challenges to prevent failure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Gives up easily when facing obstacles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Sees effort as fruitless or negative</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Ignores useful feedback and criticism</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Feels threatened by others' success</span>
                  </li>
                </ul>
              </div>

              {/* Growth Mindset */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <h4 className="font-bold text-green-700 dark:text-green-400">Growth Mindset</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Believes abilities can be developed through dedication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Embraces challenges as opportunities to grow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Persists through setbacks and obstacles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Sees effort as the path to mastery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Learns from criticism and feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Finds inspiration in others' success</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                <strong className="text-purple-600 dark:text-purple-400">Kintsugi Connection:</strong> Just like broken pottery becomes more beautiful when repaired with gold, our challenges and imperfections can become our greatest strengths when we embrace them with a growth mindset.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Reflection Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Imperfection Gratitude Reflection
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type of Challenge
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['challenge', 'mistake', 'feedback', 'setback'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        category === cat
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Imperfection/Challenge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  💔 The Crack: What was the challenge, flaw, or setback?
                </label>
                <textarea
                  value={imperfection}
                  onChange={(e) => setImperfection(e.target.value)}
                  placeholder="Example: Got called out twice for vague email responses. Customer said 'we need timelines' and another colleague found the answer themselves. Manager told me to think before responding vaguely."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Transformation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  ✨ The Golden Seam: How did this become a strength?
                </label>
                <textarea
                  value={transformation}
                  onChange={(e) => setTransformation(e.target.value)}
                  placeholder="Example: Created a 5-point email checklist: (1) Does this answer the question? (2) Did I give SPECIFIC timeline? (3) If I don't know, did I say what I'll review and when? (4) Does it sound senior? (5) Would I be satisfied getting this email?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Lesson Learned */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  💡 The Wisdom: What did you learn?
                </label>
                <textarea
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  placeholder="Example: When shaken, catch the spiral early. One bad email day doesn't make me incompetent. Writing it down stops the rumination loop. Tools can help but can't replace judgment."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveReflection}
                disabled={!imperfection || !transformation || !lesson}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Save Reflection</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflections List */}
      {reflections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Your Growth Journey ({reflections.length})
          </h3>
          {reflections.map((reflection) => (
            <motion.div
              key={reflection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reflection.category === 'challenge' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                    reflection.category === 'mistake' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                    reflection.category === 'feedback' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {reflection.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(reflection.date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => deleteReflection(reflection.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">The Crack</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reflection.imperfection}</p>
                </div>
                <div>
                  <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    The Golden Seam
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reflection.transformation}</p>
                </div>
                <div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    The Wisdom
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reflection.lesson}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {reflections.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start Your Growth Journey
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Reflect on how your challenges became strengths. Track your transformation from fixed to growth mindset.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Reflection</span>
          </button>
        </div>
      )}
    </div>
  );
}
