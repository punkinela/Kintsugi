/**
 * Voice Analyzer Utility
 *
 * Analyzes user's writing samples to extract voice characteristics
 * and build a personalized voice profile for AI generation.
 */

import {
  VoiceProfile,
  VoiceMetrics,
  WritingSample,
  WordFrequency,
  PronounUsage,
  VoiceAnalysisConfig,
  VoiceProfileUpdate,
} from '@/types/voiceProfile';

const DEFAULT_CONFIG: VoiceAnalysisConfig = {
  minSampleLength: 50,
  maxSamples: 50,
  confidenceThreshold: 30,
  commonWordThreshold: 3,
};

// Common English stop words to exclude from analysis
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had',
  'what', 'when', 'where', 'who', 'which', 'why', 'how', 'all', 'each',
  'she', 'or', 'if', 'because', 'than', 'such', 'so', 'can', 'no', 'not',
]);

// Words that indicate formal/corporate language (often overused by AI)
const FORMAL_INDICATORS = new Set([
  'leverage', 'utilize', 'facilitate', 'collaborate', 'synergy',
  'stakeholder', 'deliverable', 'bandwidth', 'ecosystem', 'holistic',
  'paradigm', 'optimize', 'strategize', 'actionable', 'scalable',
]);

// Pronouns to track for personal voice analysis
const PERSONAL_PRONOUNS = {
  I: ['i', "i'm", "i've", "i'll", "i'd"],
  we: ['we', "we're", "we've", "we'll", "we'd"],
  my: ['my', 'mine'],
  our: ['our', 'ours'],
};

/**
 * Analyze a text sample and extract voice metrics
 */
export function analyzeWritingSample(text: string): VoiceMetrics {
  // Clean and normalize text
  const cleanText = text.trim();
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.toLowerCase().match(/\b\w+(?:'\w+)?\b/g) || [];

  const sentenceCount = sentences.length;
  const wordCount = words.length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // Extract vocabulary (unique words, excluding stop words)
  const vocabulary = [...new Set(words.filter(w => !STOP_WORDS.has(w)))];

  // Count word frequencies
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    if (!STOP_WORDS.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  // Get most common words
  const commonWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);

  // Calculate formality score based on formal indicators
  let formalityScore = 5; // Base score
  const formalWordCount = words.filter(w => FORMAL_INDICATORS.has(w)).length;
  formalityScore += Math.min(formalWordCount * 0.5, 5); // Max +5 for formal words

  // Estimate active voice percentage (heuristic: look for passive indicators)
  const passiveIndicators = words.filter(w =>
    ['was', 'were', 'been', 'being', 'am', 'is', 'are'].includes(w)
  ).length;
  const activeVoicePercentage = Math.max(
    0,
    100 - (passiveIndicators / sentenceCount) * 10
  );

  // Count pronoun usage
  const pronounUsage: PronounUsage = {
    I: countPronouns(words, PERSONAL_PRONOUNS.I),
    we: countPronouns(words, PERSONAL_PRONOUNS.we),
    my: countPronouns(words, PERSONAL_PRONOUNS.my),
    our: countPronouns(words, PERSONAL_PRONOUNS.our),
  };

  // Detect emotional words (simplified approach)
  const emotionalWords = words.filter(w =>
    ['love', 'hate', 'excited', 'frustrated', 'proud', 'worried', 'happy', 'sad'].includes(w)
  );

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength,
    vocabulary,
    commonWords,
    formalityScore: Math.min(10, Math.max(1, formalityScore)),
    activeVoicePercentage: Math.round(activeVoicePercentage),
    pronounUsage,
    emotionalWords,
  };
}

/**
 * Count occurrences of pronoun variations
 */
function countPronouns(words: string[], pronounVariations: string[]): number {
  return words.filter(w => pronounVariations.includes(w)).length;
}

/**
 * Create an initial voice profile from a user's first sample
 */
export function createVoiceProfile(
  userId: string,
  sample: WritingSample,
  metrics: VoiceMetrics
): VoiceProfile {
  // Build initial word frequencies
  const commonWords: WordFrequency[] = metrics.commonWords.map(word => ({
    word,
    frequency: 1,
    contexts: [sample.text.substring(0, 100)], // First 100 chars as context
  }));

  // Determine emotional tone
  let emotionalTone: 'reserved' | 'enthusiastic' | 'balanced' = 'balanced';
  if (metrics.emotionalWords.length > metrics.wordCount * 0.02) {
    emotionalTone = 'enthusiastic';
  } else if (metrics.emotionalWords.length < metrics.wordCount * 0.005) {
    emotionalTone = 'reserved';
  }

  // Determine detail level
  let detailLevel: 'concise' | 'detailed' | 'comprehensive' = 'detailed';
  if (metrics.avgSentenceLength < 12) {
    detailLevel = 'concise';
  } else if (metrics.avgSentenceLength > 20) {
    detailLevel = 'comprehensive';
  }

  return {
    userId,
    commonWords,
    avoidedWords: [],
    preferredPhrases: [],
    industryTerms: [],
    avgSentenceLength: metrics.avgSentenceLength,
    formalityScore: metrics.formalityScore,
    activeVoicePercentage: metrics.activeVoicePercentage,
    personalPronounUsage: metrics.pronounUsage,
    emotionalTone,
    detailLevel,
    writingSamples: [sample],
    rejectedWords: [],
    preferredReplacements: [],
    lastUpdated: new Date().toISOString(),
    confidenceScore: 20, // Low confidence with just one sample
    sampleCount: 1,
  };
}

/**
 * Update an existing voice profile with a new sample
 */
export function updateVoiceProfileWithSample(
  profile: VoiceProfile,
  sample: WritingSample,
  metrics: VoiceMetrics
): VoiceProfile {
  const sampleCount = profile.sampleCount + 1;

  // Update word frequencies
  const wordFreqMap = new Map(
    profile.commonWords.map(wf => [wf.word, wf])
  );

  metrics.commonWords.forEach(word => {
    const existing = wordFreqMap.get(word);
    if (existing) {
      existing.frequency += 1;
      existing.contexts.push(sample.text.substring(0, 100));
      // Keep only last 5 contexts
      if (existing.contexts.length > 5) {
        existing.contexts = existing.contexts.slice(-5);
      }
    } else {
      wordFreqMap.set(word, {
        word,
        frequency: 1,
        contexts: [sample.text.substring(0, 100)],
      });
    }
  });

  // Sort by frequency and keep top 100 words
  const updatedCommonWords = Array.from(wordFreqMap.values())
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 100);

  // Update style metrics (weighted average)
  const weight = Math.min(sampleCount, 10); // Cap influence of old samples
  const newWeight = 1;
  const totalWeight = weight + newWeight;

  const avgSentenceLength =
    (profile.avgSentenceLength * weight + metrics.avgSentenceLength * newWeight) / totalWeight;
  const formalityScore =
    (profile.formalityScore * weight + metrics.formalityScore * newWeight) / totalWeight;
  const activeVoicePercentage =
    (profile.activeVoicePercentage * weight + metrics.activeVoicePercentage * newWeight) / totalWeight;

  // Update pronoun usage
  const personalPronounUsage: PronounUsage = {
    I: Math.round((profile.personalPronounUsage.I * weight + metrics.pronounUsage.I * newWeight) / totalWeight),
    we: Math.round((profile.personalPronounUsage.we * weight + metrics.pronounUsage.we * newWeight) / totalWeight),
    my: Math.round((profile.personalPronounUsage.my * weight + metrics.pronounUsage.my * newWeight) / totalWeight),
    our: Math.round((profile.personalPronounUsage.our * weight + metrics.pronounUsage.our * newWeight) / totalWeight),
  };

  // Add sample to history (keep last N samples)
  const writingSamples = [...profile.writingSamples, sample].slice(-DEFAULT_CONFIG.maxSamples);

  // Calculate confidence score (0-100)
  const confidenceScore = Math.min(100, sampleCount * 5 + (sample.wordCount > 200 ? 10 : 0));

  return {
    ...profile,
    commonWords: updatedCommonWords,
    avgSentenceLength,
    formalityScore,
    activeVoicePercentage,
    personalPronounUsage,
    writingSamples,
    lastUpdated: new Date().toISOString(),
    confidenceScore,
    sampleCount,
  };
}

/**
 * Generate AI prompt instructions based on voice profile
 */
export function generateVoicePrompt(profile: VoiceProfile): string {
  if (profile.confidenceScore < DEFAULT_CONFIG.confidenceThreshold) {
    return 'Write in a clear, professional, and authentic voice.';
  }

  const topWords = profile.commonWords
    .slice(0, 15)
    .map(w => w.word)
    .join(', ');

  const avoidWords = profile.avoidedWords.length > 0
    ? profile.avoidedWords.join(', ')
    : 'leverage, utilize, synergize, facilitate';

  let pronounGuidance = '';
  const iFreq = profile.personalPronounUsage.I;
  const weFreq = profile.personalPronounUsage.we;
  if (iFreq > weFreq * 2) {
    pronounGuidance = 'Use "I" frequently (this user works independently). Rarely use "we".';
  } else if (weFreq > iFreq) {
    pronounGuidance = 'Prefer "we" over "I" (this user emphasizes collaboration).';
  }

  return `
CRITICAL: Match this user's authentic writing style exactly. Do not use generic AI language.

WRITING STYLE:
- Formality level: ${profile.formalityScore}/10 (${profile.formalityScore > 7 ? 'formal' : profile.formalityScore > 4 ? 'balanced' : 'casual'})
- Average sentence length: ${Math.round(profile.avgSentenceLength)} words
- Active voice: ${profile.activeVoicePercentage}% of the time
${pronounGuidance ? `- ${pronounGuidance}` : ''}

VOCABULARY:
- Words this user commonly uses: ${topWords}
- NEVER use these words: ${avoidWords}
${profile.preferredPhrases.length > 0 ? `- Preferred phrases: ${profile.preferredPhrases.join(', ')}` : ''}

TONE:
- Emotional tone: ${profile.emotionalTone}
- Detail level: ${profile.detailLevel}

Write as if you ARE this person. Match their natural voice, vocabulary, and style. If unsure, choose simpler, more direct language.
`.trim();
}

/**
 * Get or initialize voice profile for a user
 */
export async function getVoiceProfile(userId: string): Promise<VoiceProfile | null> {
  if (typeof window === 'undefined') return null;

  const key = `voiceProfile_${userId}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      return JSON.parse(stored) as VoiceProfile;
    } catch (error) {
      console.error('Failed to parse voice profile:', error);
      return null;
    }
  }

  return null;
}

/**
 * Save voice profile to storage
 */
export async function saveVoiceProfile(profile: VoiceProfile): Promise<void> {
  if (typeof window === 'undefined') return;

  const key = `voiceProfile_${profile.userId}`;
  localStorage.setItem(key, JSON.stringify(profile));
}

/**
 * Update voice profile with various operations
 */
export async function updateVoiceProfile(
  update: VoiceProfileUpdate
): Promise<VoiceProfile | null> {
  const profile = await getVoiceProfile(update.userId);

  if (!profile) {
    // Create new profile if adding a sample
    if (update.sample) {
      const metrics = analyzeWritingSample(update.sample.text);
      const newProfile = createVoiceProfile(update.userId, update.sample, metrics);
      await saveVoiceProfile(newProfile);
      return newProfile;
    }
    return null;
  }

  let updatedProfile = { ...profile };

  // Handle different update types
  if (update.sample) {
    const metrics = analyzeWritingSample(update.sample.text);
    updatedProfile = updateVoiceProfileWithSample(updatedProfile, update.sample, metrics);
  }

  if (update.rejectedWord) {
    const existing = updatedProfile.rejectedWords.find(
      rw => rw.word === update.rejectedWord!.word
    );
    if (existing) {
      existing.rejectedCount += 1;
      existing.lastRejectedDate = update.rejectedWord.lastRejectedDate;
    } else {
      updatedProfile.rejectedWords.push(update.rejectedWord);
    }

    // Auto-add to avoided words if rejected multiple times
    if (update.rejectedWord.rejectedCount >= 3 &&
        !updatedProfile.avoidedWords.includes(update.rejectedWord.word)) {
      updatedProfile.avoidedWords.push(update.rejectedWord.word);
    }
  }

  if (update.preferredReplacement) {
    const existing = updatedProfile.preferredReplacements.find(
      pr => pr.original === update.preferredReplacement!.original
    );
    if (existing) {
      existing.frequency += 1;
      existing.preferred = update.preferredReplacement.preferred;
    } else {
      updatedProfile.preferredReplacements.push(update.preferredReplacement);
    }
  }

  if (update.avoidedWord && !updatedProfile.avoidedWords.includes(update.avoidedWord)) {
    updatedProfile.avoidedWords.push(update.avoidedWord);
  }

  if (update.preferredPhrase && !updatedProfile.preferredPhrases.includes(update.preferredPhrase)) {
    updatedProfile.preferredPhrases.push(update.preferredPhrase);
  }

  updatedProfile.lastUpdated = new Date().toISOString();

  await saveVoiceProfile(updatedProfile);
  return updatedProfile;
}

/**
 * Filter text to remove words the user avoids
 */
export function filterAvoidedWords(text: string, avoidedWords: string[]): string {
  if (avoidedWords.length === 0) return text;

  let filtered = text;
  avoidedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    // For now, just highlight them (in real implementation, could suggest replacements)
    // filtered = filtered.replace(regex, `[${word}]`);
  });

  return filtered;
}

/**
 * Record when a user rejects an AI-suggested word
 */
export async function recordRejectedWord(
  userId: string,
  word: string,
  context: string
): Promise<void> {
  await updateVoiceProfile({
    userId,
    rejectedWord: {
      word: word.toLowerCase(),
      context,
      rejectedCount: 1,
      lastRejectedDate: new Date().toISOString(),
    },
  });
}

/**
 * Check if voice profile has sufficient confidence for use
 */
export function hasConfidentVoiceProfile(profile: VoiceProfile | null): boolean {
  return profile !== null && profile.confidenceScore >= DEFAULT_CONFIG.confidenceThreshold;
}
