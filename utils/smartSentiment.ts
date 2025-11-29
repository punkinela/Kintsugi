/**
 * Smart Sentiment Analysis
 * Multi-layer sentiment analysis with cultural awareness
 * Part of the Kintsugi AI Upgrade
 */

import Sentiment from 'sentiment';
import natural from 'natural';

// Types
export interface CulturalContext {
  ethnicity?: string;
  isFirstGen?: boolean;
  collectivistOrientation?: boolean;
  profession?: string;
}

export interface EmotionBreakdown {
  joy: number;
  pride: number;
  hope: number;
  gratitude: number;
  frustration: number;
  anxiety: number;
  sadness: number;
  determination: number;
}

export interface ResilienceIndicators {
  detected: boolean;
  score: number;
  indicators: string[];
}

export interface SmartSentimentResult {
  // Basic sentiment
  score: number; // -1 to 1
  comparative: number;
  label: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative' | 'mixed';
  confidence: number;

  // Detailed breakdown
  emotions: EmotionBreakdown;
  resilience: ResilienceIndicators;

  // Words that influenced the analysis
  positiveWords: string[];
  negativeWords: string[];

  // Cultural interpretation
  culturalNotes?: string;

  // For debugging/transparency
  analysisMethod: 'local' | 'hybrid' | 'llm';
}

// Initialize sentiment analyzer
const sentimentAnalyzer = new Sentiment();

// Emotion word lists
const EMOTION_WORDS = {
  joy: ['happy', 'excited', 'thrilled', 'delighted', 'wonderful', 'amazing', 'fantastic', 'great', 'excellent', 'awesome'],
  pride: ['proud', 'accomplished', 'achieved', 'succeeded', 'nailed', 'crushed it', 'killed it', 'owned', 'mastered', 'impressed'],
  hope: ['hope', 'optimistic', 'looking forward', 'excited about', 'can\'t wait', 'opportunity', 'potential', 'possible', 'future'],
  gratitude: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate', 'lucky', 'thanks to'],
  frustration: ['frustrated', 'annoyed', 'irritated', 'stuck', 'blocked', 'difficult', 'hard', 'struggle', 'challenging'],
  anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'uncertain', 'scared', 'afraid', 'concerned'],
  sadness: ['sad', 'disappointed', 'down', 'upset', 'hurt', 'failed', 'lost', 'miss', 'regret'],
  determination: ['determined', 'committed', 'focused', 'dedicated', 'persevere', 'keep going', 'won\'t give up', 'push through']
};

// Resilience language patterns
const RESILIENCE_PATTERNS = [
  /learned? (from|that|how)/i,
  /grew? (from|through)/i,
  /overcame?/i,
  /despite (the|this|that)/i,
  /even though/i,
  /challenge(d|s)? (me|us) to/i,
  /turned? .* into/i,
  /silver lining/i,
  /blessing in disguise/i,
  /made me stronger/i,
  /growth opportunity/i,
  /lesson learned/i,
  /next time/i,
  /I('ll| will) (try|do) (better|differently)/i,
  /won't make that mistake/i
];

// Growth mindset indicators
const GROWTH_INDICATORS = [
  'yet', 'learning', 'improving', 'developing', 'growing', 'progress',
  'practice', 'effort', 'feedback', 'challenge', 'opportunity'
];

/**
 * Analyze text sentiment locally (no API call)
 */
export function analyzeLocalSentiment(text: string): SmartSentimentResult {
  // Basic sentiment analysis
  const result = sentimentAnalyzer.analyze(text);

  // Normalize score to -1 to 1 range
  const normalizedScore = Math.max(-1, Math.min(1, result.comparative));

  // Determine label
  let label: SmartSentimentResult['label'];
  if (normalizedScore >= 0.5) label = 'very_positive';
  else if (normalizedScore >= 0.1) label = 'positive';
  else if (normalizedScore <= -0.5) label = 'very_negative';
  else if (normalizedScore <= -0.1) label = 'negative';
  else label = 'neutral';

  // Check for mixed sentiment
  if (result.positive.length > 0 && result.negative.length > 0) {
    const ratio = Math.min(result.positive.length, result.negative.length) /
                  Math.max(result.positive.length, result.negative.length);
    if (ratio > 0.5) label = 'mixed';
  }

  // Analyze emotions
  const emotions = analyzeEmotions(text);

  // Detect resilience
  const resilience = detectResilience(text);

  // Calculate confidence based on text length and word matches
  const confidence = calculateConfidence(text, result);

  return {
    score: normalizedScore,
    comparative: result.comparative,
    label,
    confidence,
    emotions,
    resilience,
    positiveWords: result.positive,
    negativeWords: result.negative,
    analysisMethod: 'local'
  };
}

/**
 * Analyze emotions in text
 */
function analyzeEmotions(text: string): EmotionBreakdown {
  const lowerText = text.toLowerCase();
  const emotions: EmotionBreakdown = {
    joy: 0,
    pride: 0,
    hope: 0,
    gratitude: 0,
    frustration: 0,
    anxiety: 0,
    sadness: 0,
    determination: 0
  };

  // Count emotion word matches
  for (const [emotion, words] of Object.entries(EMOTION_WORDS)) {
    const matches = words.filter(word => lowerText.includes(word)).length;
    emotions[emotion as keyof EmotionBreakdown] = Math.min(1, matches / 3);
  }

  return emotions;
}

/**
 * Detect resilience language
 */
function detectResilience(text: string): ResilienceIndicators {
  const indicators: string[] = [];

  // Check for resilience patterns
  for (const pattern of RESILIENCE_PATTERNS) {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match) indicators.push(match[0]);
    }
  }

  // Check for growth mindset indicators
  const lowerText = text.toLowerCase();
  for (const indicator of GROWTH_INDICATORS) {
    if (lowerText.includes(indicator) && !indicators.includes(indicator)) {
      indicators.push(indicator);
    }
  }

  const score = Math.min(1, indicators.length / 5);

  return {
    detected: indicators.length > 0,
    score,
    indicators
  };
}

/**
 * Calculate confidence score
 */
function calculateConfidence(text: string, result: Sentiment.AnalysisResult): number {
  const wordCount = text.split(/\s+/).length;
  const sentimentWordCount = result.positive.length + result.negative.length;

  // More sentiment words = higher confidence
  const sentimentRatio = Math.min(1, sentimentWordCount / Math.max(5, wordCount * 0.1));

  // Longer text = higher confidence (up to a point)
  const lengthFactor = Math.min(1, wordCount / 50);

  return (sentimentRatio * 0.6 + lengthFactor * 0.4);
}

/**
 * Analyze sentiment with cultural context
 */
export function analyzeWithCulturalContext(
  text: string,
  culturalContext: CulturalContext
): SmartSentimentResult {
  const baseResult = analyzeLocalSentiment(text);

  // Apply cultural interpretation
  const culturalNotes: string[] = [];

  // Collectivist orientation: "we" language is positive, not deflection
  if (culturalContext.collectivistOrientation) {
    const weCount = (text.match(/\bwe\b/gi) || []).length;
    const iCount = (text.match(/\bI\b/g) || []).length;

    if (weCount > iCount) {
      culturalNotes.push('Team-oriented language reflects collectivist values - this is a strength, not deflection.');
      // Boost positive interpretation slightly
      if (baseResult.score > 0) {
        baseResult.score = Math.min(1, baseResult.score * 1.1);
      }
    }
  }

  // First-gen professional context
  if (culturalContext.isFirstGen) {
    // Recognize imposter syndrome may be present
    if (text.toLowerCase().includes('lucky') || text.toLowerCase().includes('just')) {
      culturalNotes.push('As a first-generation professional, your achievements are even more remarkable. "Luck" often minimizes real effort.');
    }
  }

  // Add cultural notes to result
  if (culturalNotes.length > 0) {
    baseResult.culturalNotes = culturalNotes.join(' ');
    baseResult.analysisMethod = 'hybrid';
  }

  return baseResult;
}

/**
 * Get sentiment summary for display
 */
export function getSentimentSummary(result: SmartSentimentResult): string {
  const labelMap = {
    very_positive: 'Very Positive',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Challenging',
    very_negative: 'Difficult',
    mixed: 'Mixed Emotions'
  };

  let summary = labelMap[result.label];

  if (result.resilience.detected) {
    summary += ' with resilience';
  }

  // Add dominant emotion if clear
  const dominantEmotion = Object.entries(result.emotions)
    .filter(([_, value]) => value > 0.5)
    .sort(([_, a], [__, b]) => b - a)[0];

  if (dominantEmotion) {
    summary += ` (${dominantEmotion[0]})`;
  }

  return summary;
}

/**
 * Format sentiment for Kintsugi philosophy connection
 */
export function getKintsugiInsight(result: SmartSentimentResult): string {
  if (result.resilience.detected) {
    return "Your reflection shows the golden repair of Kintsugi - you're transforming challenges into growth.";
  }

  if (result.label === 'very_positive' || result.label === 'positive') {
    return "This is a golden moment in your journey. Document it well - these wins are your proof of impact.";
  }

  if (result.label === 'negative' || result.label === 'very_negative') {
    return "In Kintsugi, cracks are not failures - they're where the gold goes. This challenge is preparing you for a beautiful repair.";
  }

  if (result.label === 'mixed') {
    return "Mixed emotions are natural. Like a Kintsugi vessel, your journey includes both cracks and gold - both are valuable.";
  }

  return "Every reflection adds to your story. Keep documenting your journey.";
}
