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
  'aforementioned', 'heretofore', 'nevertheless', 'furthermore', 'therefore',
  'accordingly', 'subsequently', 'notwithstanding', 'pursuant', 'henceforth',
]);

// Words that indicate casual/conversational tone
const CASUAL_INDICATORS = new Set([
  'gonna', 'wanna', 'yeah', 'nope', 'yep', 'hey', 'cool', 'awesome',
  'stuff', 'things', 'guys', 'folks', 'basically', 'literally', 'actually',
  'pretty', 'really', 'super', 'totally', 'kinda', 'sorta', 'okay', 'ok',
]);

// Contractions indicate more casual writing
const CONTRACTIONS = new Set([
  "don't", "won't", "can't", "shouldn't", "wouldn't", "couldn't", "haven't",
  "hasn't", "hadn't", "isn't", "aren't", "wasn't", "weren't", "i'm", "i've",
  "i'll", "i'd", "you're", "you've", "you'll", "you'd", "we're", "we've",
  "we'll", "we'd", "they're", "they've", "they'll", "they'd", "it's", "that's",
]);

// Pronouns to track for personal voice analysis
const PERSONAL_PRONOUNS = {
  I: ['i', "i'm", "i've", "i'll", "i'd"],
  we: ['we', "we're", "we've", "we'll", "we'd"],
  my: ['my', 'mine'],
  our: ['our', 'ours'],
};

/**
 * Detect tone (formal vs casual) with enhanced analysis
 */
function detectTone(words: string[], sentences: string[]): {
  toneScore: number; // 1-10, where 1 is very casual, 10 is very formal
  toneDescription: string;
} {
  let toneScore = 5; // Start neutral

  // Check for formal indicators
  const formalCount = words.filter(w => FORMAL_INDICATORS.has(w)).length;
  toneScore += Math.min(formalCount * 0.3, 3);

  // Check for casual indicators
  const casualCount = words.filter(w => CASUAL_INDICATORS.has(w)).length;
  toneScore -= Math.min(casualCount * 0.3, 3);

  // Check for contractions (casual)
  const contractionCount = words.filter(w => CONTRACTIONS.has(w)).length;
  toneScore -= Math.min(contractionCount * 0.2, 2);

  // Check sentence structure complexity
  const avgSentenceLength = words.length / Math.max(sentences.length, 1);
  if (avgSentenceLength > 25) toneScore += 1; // Long sentences = more formal
  if (avgSentenceLength < 10) toneScore -= 1; // Short sentences = more casual

  // Check for questions (casual) vs statements (formal)
  const questionCount = sentences.filter(s => s.trim().endsWith('?')).length;
  const questionRatio = questionCount / Math.max(sentences.length, 1);
  if (questionRatio > 0.3) toneScore -= 1;

  // Check for exclamations (enthusiastic/casual)
  const exclamationCount = sentences.filter(s => s.trim().endsWith('!')).length;
  if (exclamationCount > 0) toneScore -= 0.5;

  // Clamp score between 1-10
  toneScore = Math.max(1, Math.min(10, toneScore));

  let toneDescription: string;
  if (toneScore >= 8) toneDescription = 'Very Formal';
  else if (toneScore >= 6) toneDescription = 'Formal';
  else if (toneScore >= 4) toneDescription = 'Balanced';
  else if (toneScore >= 2) toneDescription = 'Casual';
  else toneDescription = 'Very Casual';

  return { toneScore: Math.round(toneScore * 10) / 10, toneDescription };
}

/**
 * Analyze sentence structure patterns
 */
function analyzeSentenceStructure(sentences: string[], words: string[]): {
  questionFrequency: number;
  exclamationFrequency: number;
  avgWordsPerSentence: number;
  sentenceVariety: number; // 0-100, measures variety in sentence length
} {
  const sentenceCount = Math.max(sentences.length, 1);
  const questionCount = sentences.filter(s => s.trim().endsWith('?')).length;
  const exclamationCount = sentences.filter(s => s.trim().endsWith('!')).length;

  const questionFrequency = (questionCount / sentenceCount) * 100;
  const exclamationFrequency = (exclamationCount / sentenceCount) * 100;
  const avgWordsPerSentence = words.length / sentenceCount;

  // Calculate sentence length variety (standard deviation)
  const sentenceLengths = sentences.map(s =>
    (s.match(/\b\w+(?:'\w+)?\b/g) || []).length
  );
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceCount;
  const variance = sentenceLengths.reduce((sum, len) =>
    sum + Math.pow(len - avgLength, 2), 0
  ) / sentenceCount;
  const stdDev = Math.sqrt(variance);

  // Normalize variety score (higher stdDev = more variety)
  const sentenceVariety = Math.min(100, (stdDev / avgLength) * 100);

  return {
    questionFrequency: Math.round(questionFrequency),
    exclamationFrequency: Math.round(exclamationFrequency),
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    sentenceVariety: Math.round(sentenceVariety),
  };
}

/**
 * Calculate vocabulary richness metrics
 */
function analyzeVocabularyRichness(words: string[]): {
  lexicalDiversity: number; // Type-Token Ratio: unique words / total words
  vocabularyLevel: string;
  uniqueWordCount: number;
} {
  const totalWords = words.length;
  const uniqueWords = new Set(words);
  const uniqueWordCount = uniqueWords.size;

  // Calculate lexical diversity (Type-Token Ratio)
  const lexicalDiversity = totalWords > 0 ? (uniqueWordCount / totalWords) * 100 : 0;

  let vocabularyLevel: string;
  if (lexicalDiversity >= 70) vocabularyLevel = 'Very Rich';
  else if (lexicalDiversity >= 50) vocabularyLevel = 'Rich';
  else if (lexicalDiversity >= 35) vocabularyLevel = 'Moderate';
  else if (lexicalDiversity >= 20) vocabularyLevel = 'Basic';
  else vocabularyLevel = 'Simple';

  return {
    lexicalDiversity: Math.round(lexicalDiversity * 10) / 10,
    vocabularyLevel,
    uniqueWordCount,
  };
}

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

  // Advanced NLP Analysis
  const toneAnalysis = detectTone(words, sentences);
  const structureAnalysis = analyzeSentenceStructure(sentences, words);
  const vocabularyAnalysis = analyzeVocabularyRichness(words);

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

    // Enhanced metrics
    toneScore: toneAnalysis.toneScore,
    toneDescription: toneAnalysis.toneDescription,
    questionFrequency: structureAnalysis.questionFrequency,
    exclamationFrequency: structureAnalysis.exclamationFrequency,
    sentenceVariety: structureAnalysis.sentenceVariety,
    lexicalDiversity: vocabularyAnalysis.lexicalDiversity,
    vocabularyLevel: vocabularyAnalysis.vocabularyLevel,
    uniqueWordCount: vocabularyAnalysis.uniqueWordCount,
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
 * Calculate confidence score using advanced metrics
 * Confidence = quality and quantity of data we have
 */
function calculateConfidenceScore(
  sampleCount: number,
  writingSamples: WritingSample[],
  latestMetrics: VoiceMetrics
): number {
  let confidence = 0;

  // Base confidence from number of samples (0-40 points)
  confidence += Math.min(40, sampleCount * 4);

  // Quality bonus for substantial samples (0-20 points)
  const totalWords = writingSamples.reduce((sum, s) => sum + s.wordCount, 0);
  const avgWordsPerSample = totalWords / sampleCount;
  if (avgWordsPerSample > 100) confidence += 10;
  if (avgWordsPerSample > 200) confidence += 10;

  // Diversity bonus for varied samples (0-15 points)
  if (latestMetrics.lexicalDiversity && latestMetrics.lexicalDiversity > 40) {
    confidence += 10;
  }
  if (latestMetrics.sentenceVariety && latestMetrics.sentenceVariety > 30) {
    confidence += 5;
  }

  // Consistency bonus - if we have enough samples to detect patterns (0-15 points)
  if (sampleCount >= 5) confidence += 10;
  if (sampleCount >= 10) confidence += 5;

  // Recency bonus - recent samples are more valuable (0-10 points)
  const recentSamples = writingSamples.filter(s => {
    const sampleDate = new Date(s.createdAt);
    const daysSince = (Date.now() - sampleDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 30; // Within last 30 days
  });
  if (recentSamples.length >= 3) confidence += 5;
  if (recentSamples.length >= 5) confidence += 5;

  // Clamp between 0-100
  return Math.min(100, Math.max(0, Math.round(confidence)));
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

  // Enhanced confidence scoring algorithm
  const confidenceScore = calculateConfidenceScore(sampleCount, writingSamples, metrics);

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

  // Get latest sample metrics for advanced features
  const latestSample = profile.writingSamples[profile.writingSamples.length - 1];
  const toneGuidance = latestSample?.toneDescription
    ? `- Tone: ${latestSample.toneDescription} (score: ${latestSample.toneScore}/10)`
    : '';
  const questionGuidance = latestSample?.questionFrequency
    ? `- Use questions ${latestSample.questionFrequency}% of the time (user's natural frequency)`
    : '';
  const vocabularyGuidance = latestSample?.vocabularyLevel
    ? `- Vocabulary richness: ${latestSample.vocabularyLevel}`
    : '';

  return `
CRITICAL: Match this user's authentic writing style exactly. Do not use generic AI language.

WRITING STYLE:
- Formality level: ${profile.formalityScore}/10 (${profile.formalityScore > 7 ? 'formal' : profile.formalityScore > 4 ? 'balanced' : 'casual'})
${toneGuidance}
- Average sentence length: ${Math.round(profile.avgSentenceLength)} words
- Active voice: ${profile.activeVoicePercentage}% of the time
${pronounGuidance ? `- ${pronounGuidance}` : ''}
${questionGuidance}

VOCABULARY:
- Words this user commonly uses: ${topWords}
- NEVER use these words: ${avoidWords}
${profile.preferredPhrases.length > 0 ? `- Preferred phrases: ${profile.preferredPhrases.join(', ')}` : ''}
${vocabularyGuidance}

TONE & DETAIL:
- Emotional tone: ${profile.emotionalTone}
- Detail level: ${profile.detailLevel}

CRITICAL REMINDERS:
- This is a REAL PERSON with a unique voice, NOT a generic AI
- Match their exact vocabulary, sentence patterns, and tone
- If they use casual language, use casual language
- If they use technical terms, use technical terms
- If unsure, choose simpler, more direct language

Write as if you ARE this person. Your goal is to be indistinguishable from their authentic writing.
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
