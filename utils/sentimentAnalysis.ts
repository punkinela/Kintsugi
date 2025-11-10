/**
 * Sentiment Analysis & Pattern Recognition
 *
 * Local sentiment analysis using keyword-based scoring
 * No external APIs needed - fast and private
 */

import { JournalEntry } from '@/types/engagement';

export interface SentimentScore {
  score: number; // -1 to 1 scale
  label: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  confidence: number; // 0 to 1
}

export interface EntryWithSentiment extends JournalEntry {
  sentiment: SentimentScore;
}

export interface Pattern {
  id: string;
  type: 'theme' | 'growth' | 'resilience';
  name: string;
  description: string;
  entries: string[]; // Entry IDs
  frequency: number;
  firstSeen: string;
  lastSeen: string;
  keywords: string[];
}

export interface GoldenSeam {
  id: string;
  challenge: EntryWithSentiment;
  growth: EntryWithSentiment[];
  win: EntryWithSentiment;
  timespan: number; // days from challenge to win
  strengthGained: string;
}

// Sentiment keywords with weights
const SENTIMENT_KEYWORDS = {
  veryPositive: {
    keywords: [
      'amazing', 'excellent', 'outstanding', 'brilliant', 'fantastic', 'wonderful',
      'exceptional', 'incredible', 'triumph', 'victory', 'succeeded', 'accomplished',
      'achieved', 'breakthrough', 'thrilled', 'proud', 'excited', 'grateful'
    ],
    weight: 1.0
  },
  positive: {
    keywords: [
      'good', 'great', 'better', 'improved', 'progress', 'successful', 'win',
      'growth', 'learned', 'developed', 'enhanced', 'positive', 'productive',
      'effective', 'confident', 'comfortable', 'happy', 'glad', 'pleased'
    ],
    weight: 0.5
  },
  negative: {
    keywords: [
      'difficult', 'hard', 'challenging', 'struggle', 'problem', 'issue', 'concern',
      'worried', 'stress', 'frustrated', 'disappointed', 'uncertain', 'confused',
      'setback', 'mistake', 'failed', 'wrong', 'bad', 'poor', 'uncomfortable'
    ],
    weight: -0.5
  },
  veryNegative: {
    keywords: [
      'terrible', 'awful', 'horrible', 'disaster', 'catastrophe', 'devastated',
      'overwhelmed', 'hopeless', 'crushed', 'defeated', 'failure', 'crisis',
      'nightmare', 'terrified', 'miserable', 'depressed', 'anxious', 'panic'
    ],
    weight: -1.0
  }
};

// Resilience keywords (positive even in negative context)
const RESILIENCE_KEYWORDS = [
  'overcame', 'persevered', 'resilient', 'adapted', 'recovered', 'bounced back',
  'pushed through', 'survived', 'endured', 'handled', 'managed', 'dealt with',
  'worked through', 'got through', 'learned from', 'grew from'
];

// Growth keywords
const GROWTH_KEYWORDS = [
  'learned', 'discovered', 'realized', 'understood', 'grew', 'developed',
  'improved', 'enhanced', 'strengthened', 'gained', 'acquired', 'mastered',
  'evolved', 'transformed', 'changed', 'adapted', 'expanded'
];

/**
 * Analyze sentiment of text
 */
export function analyzeSentiment(text: string): SentimentScore {
  if (!text || text.trim().length === 0) {
    return { score: 0, label: 'neutral', confidence: 0 };
  }

  const lowerText = text.toLowerCase();
  let score = 0;
  let matchCount = 0;

  // Check for resilience keywords (boost positive even if negative words present)
  const resilienceBoost = RESILIENCE_KEYWORDS.some(kw => lowerText.includes(kw)) ? 0.3 : 0;

  // Check for growth keywords
  const growthBoost = GROWTH_KEYWORDS.some(kw => lowerText.includes(kw)) ? 0.2 : 0;

  // Score based on keywords
  Object.values(SENTIMENT_KEYWORDS).forEach(({ keywords, weight }) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += weight * matches.length;
        matchCount += matches.length;
      }
    });
  });

  // Apply boosts
  score += resilienceBoost + growthBoost;

  // Normalize score to -1 to 1 range
  const normalizedScore = Math.max(-1, Math.min(1, score / Math.max(1, matchCount * 0.5)));

  // Calculate confidence based on match count
  const confidence = Math.min(1, matchCount / 5);

  // Determine label
  let label: SentimentScore['label'];
  if (normalizedScore >= 0.6) label = 'very-positive';
  else if (normalizedScore >= 0.2) label = 'positive';
  else if (normalizedScore >= -0.2) label = 'neutral';
  else if (normalizedScore >= -0.6) label = 'negative';
  else label = 'very-negative';

  return {
    score: normalizedScore,
    label,
    confidence
  };
}

/**
 * Analyze sentiment for all entries
 */
export function analyzeEntriesSentiment(entries: JournalEntry[]): EntryWithSentiment[] {
  return entries.map(entry => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`;
    const sentiment = analyzeSentiment(text);

    return {
      ...entry,
      sentiment
    };
  });
}

/**
 * Detect recurring themes in entries
 */
export function detectPatterns(entries: EntryWithSentiment[]): Pattern[] {
  const patterns: Pattern[] = [];

  // Theme keywords to look for
  const themes = {
    'Leadership': ['led', 'lead', 'manage', 'mentor', 'coach', 'team', 'direct', 'supervise'],
    'Communication': ['present', 'communicate', 'write', 'spoke', 'discussed', 'explained', 'clarif'],
    'Problem Solving': ['solv', 'fix', 'resolv', 'address', 'troubleshoot', 'debug', 'identify'],
    'Collaboration': ['collaborat', 'partner', 'work with', 'team', 'together', 'coordinate'],
    'Innovation': ['creat', 'innovat', 'design', 'develop', 'new', 'improv', 'enhance'],
    'Resilience': ['overcame', 'recover', 'adapt', 'persever', 'bounce', 'endur', 'survive'],
    'Learning': ['learn', 'discover', 'realize', 'understand', 'master', 'study', 'train'],
    'Achievement': ['achiev', 'accomplish', 'succeed', 'deliver', 'complet', 'finish', 'win']
  };

  Object.entries(themes).forEach(([themeName, keywords]) => {
    const matchingEntries = entries.filter(entry => {
      const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });

    if (matchingEntries.length >= 2) {
      patterns.push({
        id: `theme-${themeName.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'theme',
        name: themeName,
        description: `You consistently demonstrate ${themeName.toLowerCase()} across your experiences`,
        entries: matchingEntries.map(e => e.id),
        frequency: matchingEntries.length,
        firstSeen: matchingEntries[matchingEntries.length - 1].date,
        lastSeen: matchingEntries[0].date,
        keywords
      });
    }
  });

  // Sort by frequency
  return patterns.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Identify growth trajectories (challenge → recovery → win)
 */
export function identifyGoldenSeams(entries: EntryWithSentiment[]): GoldenSeam[] {
  const seams: GoldenSeam[] = [];

  // Sort entries by date (oldest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < sortedEntries.length - 2; i++) {
    const entry = sortedEntries[i];

    // Look for challenges (negative sentiment)
    if (entry.sentiment.score < -0.2) {
      // Find subsequent entries
      const growthEntries: EntryWithSentiment[] = [];
      let winEntry: EntryWithSentiment | null = null;

      // Look ahead for growth and wins
      for (let j = i + 1; j < Math.min(i + 10, sortedEntries.length); j++) {
        const futureEntry = sortedEntries[j];

        // Growth entry (neutral or slightly positive)
        if (futureEntry.sentiment.score >= -0.1 && futureEntry.sentiment.score < 0.5) {
          growthEntries.push(futureEntry);
        }

        // Win entry (positive)
        if (futureEntry.sentiment.score >= 0.5 && !winEntry) {
          winEntry = futureEntry;
          break;
        }
      }

      // If we found a trajectory, add it
      if (winEntry && growthEntries.length > 0) {
        const challengeDate = new Date(entry.date);
        const winDate = new Date(winEntry.date);
        const timespan = Math.floor((winDate.getTime() - challengeDate.getTime()) / (1000 * 60 * 60 * 24));

        // Extract strength gained (look for growth keywords)
        let strengthGained = 'resilience and growth';
        const winText = `${winEntry.accomplishment} ${winEntry.reflection || ''}`.toLowerCase();

        if (winText.includes('lead') || winText.includes('manag')) strengthGained = 'leadership';
        else if (winText.includes('learn') || winText.includes('master')) strengthGained = 'new skills';
        else if (winText.includes('adapt') || winText.includes('chang')) strengthGained = 'adaptability';
        else if (winText.includes('collaborat') || winText.includes('team')) strengthGained = 'collaboration';
        else if (winText.includes('confiden')) strengthGained = 'confidence';

        seams.push({
          id: `seam-${entry.id}-${winEntry.id}`,
          challenge: entry,
          growth: growthEntries,
          win: winEntry,
          timespan,
          strengthGained
        });
      }
    }
  }

  return seams;
}

/**
 * Get sentiment trend over time
 */
export function getSentimentTrend(entries: EntryWithSentiment[]): {
  date: string;
  score: number;
  label: string;
}[] {
  return entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      score: entry.sentiment.score,
      label: entry.sentiment.label
    }));
}

/**
 * Get overall resilience score (how often user bounces back)
 */
export function getResilienceScore(seams: GoldenSeam[]): {
  score: number; // 0-100
  level: 'developing' | 'moderate' | 'strong' | 'exceptional';
  description: string;
} {
  if (seams.length === 0) {
    return {
      score: 0,
      level: 'developing',
      description: 'Keep documenting your experiences to reveal your resilience patterns'
    };
  }

  // Calculate average recovery time
  const avgRecoveryTime = seams.reduce((sum, seam) => sum + seam.timespan, 0) / seams.length;

  // Score based on:
  // - Number of golden seams (more = better)
  // - Recovery speed (faster = better)
  // - Growth steps (more intermediate growth = better processing)

  const seamScore = Math.min(50, seams.length * 5); // Up to 50 points for having seams
  const speedScore = Math.max(0, 30 - (avgRecoveryTime / 7)); // Up to 30 points for speed
  const growthScore = Math.min(20, seams.reduce((sum, s) => sum + s.growth.length, 0) * 2); // Up to 20 points for growth steps

  const totalScore = Math.round(seamScore + speedScore + growthScore);

  let level: 'developing' | 'moderate' | 'strong' | 'exceptional';
  let description: string;

  if (totalScore >= 80) {
    level = 'exceptional';
    description = `You demonstrate exceptional resilience - ${seams.length} documented recoveries with consistent growth patterns`;
  } else if (totalScore >= 60) {
    level = 'strong';
    description = `You show strong resilience with ${seams.length} documented recovery trajectories`;
  } else if (totalScore >= 40) {
    level = 'moderate';
    description = `You're building resilience - ${seams.length} instances of bouncing back from challenges`;
  } else {
    level = 'developing';
    description = `Your resilience patterns are emerging - ${seams.length} recovery paths identified`;
  }

  return {
    score: totalScore,
    level,
    description
  };
}
