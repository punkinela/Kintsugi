'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  Check,
  TrendingUp,
  Volume2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { VoiceProfile, WritingSample } from '@/types/voiceProfile';
import {
  getVoiceProfile,
  updateVoiceProfile,
  analyzeWritingSample,
  hasConfidentVoiceProfile,
} from '@/utils/voiceAnalyzer';
import AIBadge from '@/components/AIBadge';

interface VoiceProfileManagerProps {
  userId: string;
  onClose?: () => void;
}

export default function VoiceProfileManager({ userId, onClose }: VoiceProfileManagerProps) {
  const [profile, setProfile] = useState<VoiceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pastedText, setPastedText] = useState('');
  const [sampleType, setSampleType] = useState<'email' | 'review' | 'cover_letter' | 'linkedin' | 'other'>('other');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newAvoidWord, setNewAvoidWord] = useState('');
  const [newPreferredPhrase, setNewPreferredPhrase] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'insights' | 'preferences'>('upload');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    setLoading(true);
    const voiceProfile = await getVoiceProfile(userId);
    setProfile(voiceProfile);
    setLoading(false);
  }

  async function handleAddSample() {
    if (!pastedText.trim() || pastedText.split(' ').length < 50) {
      alert('Please paste at least 50 words to analyze your writing style.');
      return;
    }

    setProcessing(true);

    const sample: WritingSample = {
      id: Date.now().toString(),
      text: pastedText,
      source: 'pasted',
      sourceType: sampleType,
      date: new Date().toISOString(),
      wordCount: pastedText.split(' ').length,
      createdAt: new Date().toISOString(),
    };

    try {
      const updated = await updateVoiceProfile({ userId, sample });
      setProfile(updated);
      setPastedText('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add sample:', error);
      alert('Failed to analyze writing sample. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  async function handleAddAvoidedWord() {
    if (!newAvoidWord.trim()) return;

    const updated = await updateVoiceProfile({
      userId,
      avoidedWord: newAvoidWord.toLowerCase(),
    });
    setProfile(updated);
    setNewAvoidWord('');
  }

  async function handleAddPreferredPhrase() {
    if (!newPreferredPhrase.trim()) return;

    const updated = await updateVoiceProfile({
      userId,
      preferredPhrase: newPreferredPhrase,
    });
    setProfile(updated);
    setNewPreferredPhrase('');
  }

  async function handleRemoveAvoidedWord(word: string) {
    if (!profile) return;
    const updated = {
      ...profile,
      avoidedWords: profile.avoidedWords.filter(w => w !== word),
    };
    await updateVoiceProfile({ userId });
    setProfile(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 theme-border-primary"></div>
      </div>
    );
  }

  const confidencePercentage = profile?.confidenceScore || 0;
  const isConfident = hasConfidentVoiceProfile(profile);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
            <Volume2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Voice Profile
              </h2>
              <AIBadge />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Teaching AI to write like you, not like ChatGPT
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Confidence Score Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 p-4 rounded-xl border-2 ${
          isConfident
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp
              className={`h-5 w-5 ${
                isConfident ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              Voice Profile Confidence: {confidencePercentage}%
            </span>
          </div>
          {isConfident && <Check className="h-5 w-5 text-green-600" />}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${
              isConfident
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {profile
            ? `${profile.sampleCount} sample${profile.sampleCount === 1 ? '' : 's'} analyzed`
            : 'No samples yet'}{' '}
          • {isConfident ? 'Ready to use' : 'Add more samples to improve accuracy'}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Add Samples
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'insights'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Voice Insights
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'preferences'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Preferences
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-semibold mb-1">Why add writing samples?</p>
                  <p>
                    We analyze your past writing to learn your unique voice, vocabulary, and style. This
                    prevents AI-generated content from sounding generic or using words you'd never say.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What type of writing is this?
              </label>
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="review">Performance Review</option>
                <option value="email">Professional Email</option>
                <option value="cover_letter">Cover Letter</option>
                <option value="linkedin">LinkedIn Post</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste your writing sample (minimum 50 words)
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste text from past performance reviews, emails, cover letters, etc..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Word count: {pastedText.split(' ').filter(w => w.length > 0).length}
              </p>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddSample}
              disabled={processing || pastedText.split(' ').length < 50}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add to Voice Profile
                </>
              )}
            </button>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-900 dark:text-green-100 font-medium">
                    Sample added! Your voice profile has been updated.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'insights' && profile && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Style Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Writing Style
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Formality</span>
                    <span className="font-medium">{profile.formalityScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Sentence Length</span>
                    <span className="font-medium">{Math.round(profile.avgSentenceLength)} words</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Voice</span>
                    <span className="font-medium">{profile.activeVoicePercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Voice Characteristics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tone</span>
                    <span className="font-medium capitalize">{profile.emotionalTone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Detail Level</span>
                    <span className="font-medium capitalize">{profile.detailLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Words */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Your Most Common Words
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.commonWords.slice(0, 20).map((wf) => (
                  <span
                    key={wf.word}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                  >
                    {wf.word} ({wf.frequency})
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Avoided Words */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Words to Avoid
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                These words will never appear in AI-generated content
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile?.avoidedWords.map((word) => (
                  <span
                    key={word}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    {word}
                    <button
                      onClick={() => handleRemoveAvoidedWord(word)}
                      className="hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAvoidWord}
                  onChange={(e) => setNewAvoidWord(e.target.value)}
                  placeholder="Add a word to avoid..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAvoidedWord()}
                />
                <button
                  onClick={handleAddAvoidedWord}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Preferred Phrases */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Preferred Phrases
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Phrases you commonly use that AI should include
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile?.preferredPhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPreferredPhrase}
                  onChange={(e) => setNewPreferredPhrase(e.target.value)}
                  placeholder="Add a preferred phrase..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPreferredPhrase()}
                />
                <button
                  onClick={handleAddPreferredPhrase}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
