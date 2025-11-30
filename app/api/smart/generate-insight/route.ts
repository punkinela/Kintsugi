/**
 * Smart Insight Generation API
 * POST /api/smart/generate-insight
 *
 * Generates personalized insights based on user's journey
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  complete,
  anonymizeText,
  isSmartEnabled,
  KINTSUGI_PROMPTS,
} from '@/utils/llmClient';
import {
  analyzeLocalSentiment,
  getKintsugiInsight,
} from '@/utils/smartSentiment';

export interface InsightRequest {
  // Accept either 'entries' or 'recentEntries' for flexibility
  entries?: Array<{
    accomplishment: string;
    reflection?: string;
    date: string;
    mood?: string;
  }>;
  recentEntries?: Array<{
    accomplishment: string;
    reflection?: string;
    date: string;
    mood?: string;
  }>;
  userProfile?: {
    name?: string;
    profession?: string;
    ethnicity?: string;
    isFirstGen?: boolean;
  };
  insightType?: 'weekly' | 'pattern' | 'strength' | 'growth';
}

export interface InsightResponse {
  success: boolean;
  insight?: string;
  kintsugiConnection?: string;
  patterns?: string[];
  error?: string;
  source: 'local' | 'smart';
}

export async function POST(request: NextRequest): Promise<NextResponse<InsightResponse>> {
  try {
    const body: InsightRequest = await request.json();
    // Accept either 'entries' or 'recentEntries'
    const recentEntries = body.entries || body.recentEntries;
    const { userProfile, insightType = 'pattern' } = body;

    if (!recentEntries || recentEntries.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one entry is required',
        source: 'local',
      }, { status: 400 });
    }

    // If Smart features aren't enabled, use local analysis
    if (!isSmartEnabled()) {
      return generateLocalInsight(recentEntries);
    }

    // Prepare context for LLM
    const anonymizedEntries = recentEntries.map(entry => ({
      accomplishment: anonymizeText(entry.accomplishment),
      reflection: entry.reflection ? anonymizeText(entry.reflection) : undefined,
      date: entry.date,
      mood: entry.mood,
    }));

    const profileContext = userProfile
      ? `User is ${userProfile.profession || 'a professional'}${userProfile.isFirstGen ? ', first-generation professional' : ''}.`
      : '';

    const entriesSummary = anonymizedEntries.map((e, i) =>
      `Entry ${i + 1} (${e.date}):\n- Accomplishment: ${e.accomplishment}${e.reflection ? `\n- Reflection: ${e.reflection}` : ''}${e.mood ? `\n- Mood: ${e.mood}` : ''}`
    ).join('\n\n');

    const prompt = `${profileContext}

Generate a ${insightType} insight based on these recent reflections:

${entriesSummary}

Provide:
1. A personalized insight (2-3 sentences)
2. How this connects to Kintsugi philosophy
3. Any patterns you notice (as a list)`;

    try {
      const llmResponse = await complete([
        { role: 'system', content: KINTSUGI_PROMPTS.insightGeneration },
        { role: 'user', content: prompt },
      ]);

      // Parse response
      const content = llmResponse.content;

      // Extract insight, connection, and patterns
      const insight = extractSection(content, 'insight') || content.split('\n')[0];
      const kintsugiConnection = extractSection(content, 'kintsugi') || extractSection(content, 'connect');
      const patterns = extractPatterns(content);

      return NextResponse.json({
        success: true,
        insight,
        kintsugiConnection,
        patterns,
        source: 'smart',
      });
    } catch (llmError) {
      console.error('LLM insight generation failed:', llmError);
      // Fallback to local insight
      return generateLocalInsight(recentEntries);
    }
  } catch (error) {
    console.error('Insight generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'local',
    }, { status: 500 });
  }
}

// Define entry type for reuse
type JournalEntryInput = {
  accomplishment: string;
  reflection?: string;
  date: string;
  mood?: string;
};

/**
 * Generate insight using local analysis only
 */
function generateLocalInsight(entries: JournalEntryInput[]): NextResponse<InsightResponse> {
  // Analyze sentiment of all entries
  const sentiments = entries.map(entry => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`;
    return analyzeLocalSentiment(text);
  });

  // Calculate overall trend
  const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
  const hasResilience = sentiments.some(s => s.resilience.detected);

  // Generate local insight
  let insight: string;
  let kintsugiConnection: string;

  if (avgScore >= 0.3 && hasResilience) {
    insight = "Your recent reflections show a beautiful balance of celebrating wins and learning from challenges. You're actively practicing growth mindset.";
    kintsugiConnection = "Like a Kintsugi master, you're turning every experience - positive or challenging - into gold.";
  } else if (avgScore >= 0.3) {
    insight = "You've been documenting some great wins! Don't forget to also capture the challenges - they're where the gold goes.";
    kintsugiConnection = "In Kintsugi, the vessel isn't complete with just gold - it needs the cracks too. Your challenges make your story richer.";
  } else if (hasResilience) {
    insight = "You're showing remarkable resilience in your reflections. The way you're processing challenges shows real growth.";
    kintsugiConnection = "The Kintsugi philosophy teaches that repair makes things more valuable. Your resilience is your gold.";
  } else {
    insight = "Keep documenting your journey - every entry adds to your story. Consider reflecting on what you're learning from current challenges.";
    kintsugiConnection = getKintsugiInsight(sentiments[0]);
  }

  return NextResponse.json({
    success: true,
    insight,
    kintsugiConnection,
    patterns: extractLocalPatterns(entries),
    source: 'local',
  });
}

/**
 * Extract a section from LLM response
 */
function extractSection(content: string, keyword: string): string | undefined {
  const lines = content.split('\n');
  const sectionIndex = lines.findIndex(line =>
    line.toLowerCase().includes(keyword)
  );

  if (sectionIndex === -1) return undefined;

  // Get the content after the section header
  const nextSectionIndex = lines.findIndex((line, i) =>
    i > sectionIndex && (line.match(/^\d+\./) || line.match(/^-\s/))
  );

  const endIndex = nextSectionIndex === -1 ? lines.length : nextSectionIndex;
  return lines.slice(sectionIndex, endIndex).join(' ').trim();
}

/**
 * Extract patterns from LLM response
 */
function extractPatterns(content: string): string[] {
  const patterns: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Look for bullet points or numbered lists
    const match = line.match(/^[-•*]\s*(.+)$/) || line.match(/^\d+\.\s*(.+)$/);
    if (match && match[1].length > 10) {
      patterns.push(match[1].trim());
    }
  }

  return patterns.slice(0, 5); // Max 5 patterns
}

/**
 * Extract patterns using local analysis
 */
function extractLocalPatterns(entries: JournalEntryInput[]): string[] {
  const patterns: string[] = [];

  // Check for consistency
  if (entries.length >= 3) {
    patterns.push(`You've documented ${entries.length} reflections recently - great consistency!`);
  }

  // Check for mood trends
  const moods = entries.filter(e => e.mood).map(e => e.mood);
  if (moods.length >= 2) {
    const positiveCount = moods.filter(m => ['great', 'good'].includes(m || '')).length;
    if (positiveCount > moods.length / 2) {
      patterns.push('Your mood trend is generally positive');
    }
  }

  // Check for reflection depth
  const withReflections = entries.filter(e => e.reflection && e.reflection.length > 50);
  if (withReflections.length > entries.length / 2) {
    patterns.push('You write thoughtful, detailed reflections');
  }

  return patterns;
}
