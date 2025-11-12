/**
 * Voice Profile Types
 *
 * These types support the Voice Learning System that learns and matches
 * each user's unique writing style, preventing ChatGPT-ified language.
 */

export interface VoiceProfile {
  userId: string;

  // Vocabulary Analysis
  commonWords: WordFrequency[];
  avoidedWords: string[]; // Words user NEVER uses
  preferredPhrases: string[]; // Signature expressions
  industryTerms: string[]; // Domain-specific vocabulary

  // Style Metrics
  avgSentenceLength: number;
  formalityScore: number; // 1-10 scale (1=casual, 10=very formal)
  activeVoicePercentage: number; // 0-100
  personalPronounUsage: PronounUsage;

  // Tone Characteristics
  emotionalTone: 'reserved' | 'enthusiastic' | 'balanced';
  detailLevel: 'concise' | 'detailed' | 'comprehensive';

  // Learning Data
  writingSamples: WritingSample[];

  // User Corrections (learning from edits)
  rejectedWords: RejectedWord[];
  preferredReplacements: WordReplacement[];

  // Metadata
  lastUpdated: string;
  confidenceScore: number; // 0-100, how much data we have
  sampleCount: number;
}

export interface WordFrequency {
  word: string;
  frequency: number;
  contexts: string[]; // Example sentences where this word appears
}

export interface PronounUsage {
  I: number; // Frequency of "I"
  we: number; // Frequency of "we"
  my: number; // Frequency of "my"
  our: number; // Frequency of "our"
}

export interface WritingSample {
  id: string;
  text: string;
  source: 'journal' | 'uploaded' | 'edited' | 'pasted';
  sourceType?: 'email' | 'review' | 'cover_letter' | 'linkedin' | 'other';
  date: string;
  wordCount: number;
  createdAt: string; // ISO timestamp for recency tracking

  // Advanced NLP Metrics (Phase 4 Enhancements)
  toneScore?: number;
  toneDescription?: string;
  questionFrequency?: number;
  exclamationFrequency?: number;
  sentenceVariety?: number;
  lexicalDiversity?: number;
  vocabularyLevel?: string;
  uniqueWordCount?: number;
}

export interface RejectedWord {
  word: string;
  context: string; // Sentence where it was rejected
  rejectedCount: number;
  lastRejectedDate: string;
}

export interface WordReplacement {
  original: string; // Word AI suggested
  preferred: string; // Word user replaced it with
  frequency: number; // How often this replacement happens
}

/**
 * Voice metrics extracted from a single text sample
 */
export interface VoiceMetrics {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  vocabulary: string[]; // Unique words
  commonWords: string[]; // Most frequent words (excluding stop words)
  formalityScore: number;
  activeVoicePercentage: number;
  pronounUsage: PronounUsage;
  emotionalWords: string[]; // Words indicating tone

  // Advanced NLP Metrics (Phase 4 Enhancements)
  toneScore?: number; // 1-10 scale (1=very casual, 10=very formal)
  toneDescription?: string; // Human-readable tone
  questionFrequency?: number; // % of sentences that are questions
  exclamationFrequency?: number; // % of sentences with exclamations
  sentenceVariety?: number; // 0-100, measures variety in sentence length
  lexicalDiversity?: number; // Type-Token Ratio: unique words / total words
  vocabularyLevel?: string; // Simple, Basic, Moderate, Rich, Very Rich
  uniqueWordCount?: number; // Count of unique words
}

/**
 * Request for voice-matched AI generation
 */
export interface VoiceMatchedRequest {
  userId: string;
  task: 'resume' | 'performance_review' | 'cover_letter' | 'linkedin_post' | 'journal_suggestion' | 'other';
  content: string; // User's raw content to enhance
  additionalInstructions?: string;
  targetLength?: number; // Optional word count target
}

/**
 * Configuration for voice analysis
 */
export interface VoiceAnalysisConfig {
  minSampleLength: number; // Minimum words to analyze (default: 50)
  maxSamples: number; // Max samples to store per user (default: 50)
  confidenceThreshold: number; // Min confidence to use voice matching (default: 30)
  commonWordThreshold: number; // Min frequency to consider "common" (default: 3)
}

/**
 * Voice profile update operation
 */
export interface VoiceProfileUpdate {
  userId: string;
  sample?: WritingSample;
  rejectedWord?: RejectedWord;
  preferredReplacement?: WordReplacement;
  avoidedWord?: string;
  preferredPhrase?: string;
}
