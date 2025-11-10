/**
 * Voice-Matched AI Service
 *
 * Wrapper around AI generation functions that automatically applies
 * user's voice profile to ensure authentic, personalized content.
 */

import { JournalEntry } from '@/types/engagement';
import { VoiceMatchedRequest } from '@/types/voiceProfile';
import {
  getVoiceProfile,
  generateVoicePrompt,
  hasConfidentVoiceProfile,
  updateVoiceProfile,
} from './voiceAnalyzer';
import {
  generatePerformanceReview,
  type PerformanceReviewSection,
} from './aiHelpers';

/**
 * Generate a performance review with voice matching
 */
export async function generateVoiceMatchedPerformanceReview(
  userId: string,
  entries: JournalEntry[],
  timeframe: string = 'this quarter'
): Promise<{
  summary: string;
  sections: PerformanceReviewSection[];
  voiceApplied: boolean;
}> {
  // Get user's voice profile
  const voiceProfile = await getVoiceProfile(userId);
  const hasConfidentProfile = hasConfidentVoiceProfile(voiceProfile);

  // Generate base review
  const baseReview = generatePerformanceReview(entries, timeframe);

  // If no confident voice profile, return base review
  if (!hasConfidentProfile || !voiceProfile) {
    return {
      ...baseReview,
      voiceApplied: false,
    };
  }

  // Apply voice matching to review content
  const voiceMatchedReview = applyVoiceProfile(baseReview, voiceProfile);

  return {
    ...voiceMatchedReview,
    voiceApplied: true,
  };
}

/**
 * Apply voice profile transformations to generated content
 */
function applyVoiceProfile(
  review: { summary: string; sections: PerformanceReviewSection[] },
  voiceProfile: any
): { summary: string; sections: PerformanceReviewSection[] } {
  // Transform summary
  let summary = review.summary;
  summary = replaceAvoidedWords(summary, voiceProfile.avoidedWords);
  summary = adjustFormalityLevel(summary, voiceProfile.formalityScore);
  summary = adjustSentenceLength(summary, voiceProfile.avgSentenceLength);

  // Transform sections
  const sections = review.sections.map(section => ({
    ...section,
    content: replaceAvoidedWords(section.content, voiceProfile.avoidedWords),
    bullets: section.bullets.map(bullet =>
      replaceAvoidedWords(bullet, voiceProfile.avoidedWords)
    ),
  }));

  return { summary, sections };
}

/**
 * Replace words the user avoids with preferred alternatives
 */
function replaceAvoidedWords(text: string, avoidedWords: string[]): string {
  if (!avoidedWords || avoidedWords.length === 0) return text;

  let result = text;

  // Common replacements for avoided corporate buzzwords
  const replacements: Record<string, string> = {
    leverage: 'use',
    utilize: 'use',
    facilitate: 'help',
    collaborate: 'work with',
    synergy: 'cooperation',
    stakeholder: 'partner',
    deliverable: 'result',
    bandwidth: 'capacity',
    ecosystem: 'environment',
    holistic: 'complete',
    paradigm: 'model',
    optimize: 'improve',
    strategize: 'plan',
    actionable: 'practical',
    scalable: 'flexible',
  };

  avoidedWords.forEach(word => {
    const replacement = replacements[word.toLowerCase()] || '';
    if (replacement) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }
  });

  return result;
}

/**
 * Adjust text formality to match user's level
 */
function adjustFormalityLevel(text: string, targetFormality: number): string {
  // targetFormality is 1-10
  // This is a simplified version - in production, would use NLP

  if (targetFormality < 5) {
    // Make more casual
    text = text.replace(/\bduring\b/gi, 'over');
    text = text.replace(/\butilize\b/gi, 'use');
    text = text.replace(/\bdemonstrated\b/gi, 'showed');
  } else if (targetFormality > 7) {
    // Make more formal (usually not needed as AI tends to be formal)
    // Keep as is
  }

  return text;
}

/**
 * Adjust sentence structure to match user's average length
 */
function adjustSentenceLength(text: string, targetAvgLength: number): string {
  // Simplified - in production would do more sophisticated sentence parsing
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());

  if (targetAvgLength < 12) {
    // User prefers concise sentences - try to shorten
    // This is a placeholder for more sophisticated logic
    return text;
  } else if (targetAvgLength > 20) {
    // User prefers detailed sentences
    // This is a placeholder for more sophisticated logic
    return text;
  }

  return text;
}

/**
 * Generate voice-matched content for any task type
 */
export async function generateVoiceMatchedContent(
  request: VoiceMatchedRequest
): Promise<string> {
  const voiceProfile = await getVoiceProfile(request.userId);
  const hasConfidentProfile = hasConfidentVoiceProfile(voiceProfile);

  if (!hasConfidentProfile || !voiceProfile) {
    // Return instruction to add voice samples
    return `[Voice Profile Not Ready] To get personalized content that matches your writing style, please add writing samples in your Voice Profile settings first.`;
  }

  // Generate voice-aware prompt
  const voiceInstructions = generateVoicePrompt(voiceProfile);

  // In production, this would call an actual AI API
  // For now, return guidance for when real AI is integrated
  const guidance = `
${voiceInstructions}

Task: ${request.task}
Content: ${request.content}
${request.additionalInstructions || ''}

Target Length: ${request.targetLength || 'flexible'}
  `.trim();

  // TODO: Replace with actual AI API call when integrated
  // const aiResponse = await callAIAPI(guidance);

  return guidance; // Placeholder
}

/**
 * Auto-learn from user journal entries
 */
export async function learnFromJournalEntry(
  userId: string,
  entry: JournalEntry
): Promise<void> {
  // Only learn from entries with substantial text
  if (entry.accomplishment.split(' ').length < 30) {
    return;
  }

  // Create writing sample from journal entry
  const sample = {
    id: entry.id,
    text: entry.accomplishment,
    source: 'journal' as const,
    date: entry.date,
    wordCount: entry.accomplishment.split(' ').length,
  };

  // Update voice profile with this sample
  await updateVoiceProfile({ userId, sample });
}

/**
 * Get voice matching status for display
 */
export async function getVoiceMatchingStatus(userId: string): Promise<{
  enabled: boolean;
  confidence: number;
  sampleCount: number;
  message: string;
}> {
  const profile = await getVoiceProfile(userId);

  if (!profile) {
    return {
      enabled: false,
      confidence: 0,
      sampleCount: 0,
      message: 'Voice matching not configured. Add writing samples to get started.',
    };
  }

  const hasConfident = hasConfidentVoiceProfile(profile);

  return {
    enabled: hasConfident,
    confidence: profile.confidenceScore,
    sampleCount: profile.sampleCount,
    message: hasConfident
      ? `Voice matching active with ${profile.confidenceScore}% confidence`
      : `Add ${Math.ceil((30 - profile.confidenceScore) / 5)} more samples to enable voice matching`,
  };
}

/**
 * Preview how voice matching would transform text
 */
export async function previewVoiceMatching(
  userId: string,
  originalText: string
): Promise<{
  original: string;
  voiceMatched: string;
  changes: string[];
}> {
  const profile = await getVoiceProfile(userId);

  if (!profile) {
    return {
      original: originalText,
      voiceMatched: originalText,
      changes: ['Voice profile not available'],
    };
  }

  const voiceMatched = replaceAvoidedWords(originalText, profile.avoidedWords);
  const changes: string[] = [];

  // Detect changes
  profile.avoidedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(originalText)) {
      changes.push(`Removed avoided word: "${word}"`);
    }
  });

  return {
    original: originalText,
    voiceMatched,
    changes,
  };
}
