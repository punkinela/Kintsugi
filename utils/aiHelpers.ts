/**
 * AI Helper Utilities for Kintsugi
 *
 * This module provides AI-powered features for:
 * - Accomplishment enhancement
 * - Bias detection
 * - Performance review generation
 * - Smart affirmations
 * - Pattern recognition
 *
 * Currently uses rule-based AI with plans to integrate Claude API
 */

import { JournalEntry } from '@/types/engagement';

// ============================================
// BIAS DETECTION
// ============================================

export interface BiasPattern {
  type: 'minimizing' | 'hedging' | 'luck-attribution' | 'imposter-syndrome' | 'passive-voice';
  severity: 'low' | 'medium' | 'high';
  text: string;
  suggestion: string;
  position: { start: number; end: number };
}

const minimizingWords = ['just', 'only', 'simply', 'merely', 'basically', 'kind of', 'sort of', 'a bit', 'a little'];
const hedgingPhrases = ['i think', 'i guess', 'maybe', 'perhaps', 'possibly', 'might have', 'kind of', 'sort of'];
const luckAttributions = ['lucky', 'fortunate', 'happened to', 'by chance', 'accidentally', 'stumbled upon'];
const imposterPhrases = ['not sure if', "wasn't really", 'probably not', "don't deserve", 'fake it', 'fraud'];

export function detectBiasPatterns(text: string): BiasPattern[] {
  const patterns: BiasPattern[] = [];
  const lowerText = text.toLowerCase();

  // Detect minimizing language
  minimizingWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      patterns.push({
        type: 'minimizing',
        severity: 'medium',
        text: match[0],
        suggestion: `Remove "${match[0]}" to strengthen your statement`,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
  });

  // Detect hedging language
  hedgingPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      patterns.push({
        type: 'hedging',
        severity: 'medium',
        text: match[0],
        suggestion: `Replace "${match[0]}" with a more confident statement`,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
  });

  // Detect luck attributions
  luckAttributions.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      patterns.push({
        type: 'luck-attribution',
        severity: 'high',
        text: match[0],
        suggestion: `Replace luck with skill: focus on what YOU did to achieve this`,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
  });

  // Detect imposter syndrome language
  imposterPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      patterns.push({
        type: 'imposter-syndrome',
        severity: 'high',
        text: match[0],
        suggestion: `This may indicate imposter syndrome. Reframe to acknowledge your capability`,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
  });

  // Detect passive voice (simplified detection)
  const passivePatterns = [/was (\w+ed)/gi, /were (\w+ed)/gi, /been (\w+ed)/gi];
  passivePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      patterns.push({
        type: 'passive-voice',
        severity: 'low',
        text: match[0],
        suggestion: `Use active voice to emphasize your role: "I ${match[1]}"`,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
  });

  return patterns.sort((a, b) => a.position.start - b.position.start);
}

export function getBiasScore(patterns: BiasPattern[]): number {
  if (patterns.length === 0) return 100;

  const severityScores = { low: 5, medium: 10, high: 15 };
  const totalDeduction = patterns.reduce((sum, p) => sum + severityScores[p.severity], 0);

  return Math.max(0, 100 - totalDeduction);
}

// ============================================
// ACCOMPLISHMENT ENHANCEMENT
// ============================================

export interface EnhancementSuggestion {
  type: 'quantify' | 'action-verb' | 'impact' | 'specificity';
  original: string;
  enhanced: string;
  explanation: string;
}

const weakVerbs = ['did', 'made', 'worked on', 'helped with', 'was involved in', 'participated in'];
const strongVerbs = ['led', 'created', 'implemented', 'designed', 'developed', 'delivered', 'achieved', 'optimized', 'transformed', 'spearheaded'];

export function enhanceAccomplishment(text: string): EnhancementSuggestion[] {
  const suggestions: EnhancementSuggestion[] = [];

  // Suggest quantification if no numbers present
  const hasNumbers = /\d+/.test(text);
  if (!hasNumbers) {
    suggestions.push({
      type: 'quantify',
      original: text,
      enhanced: text + ' [Add metrics: How many? By what percentage? How much time saved?]',
      explanation: 'Adding specific numbers makes accomplishments more tangible and impressive'
    });
  }

  // Suggest stronger action verbs
  weakVerbs.forEach(weak => {
    const regex = new RegExp(`\\b${weak}\\b`, 'i');
    if (regex.test(text)) {
      const replacement = strongVerbs[Math.floor(Math.random() * strongVerbs.length)];
      suggestions.push({
        type: 'action-verb',
        original: text,
        enhanced: text.replace(regex, replacement),
        explanation: `Replace "${weak}" with "${replacement}" for more impact`
      });
    }
  });

  // Suggest adding impact statement
  const hasImpact = /impact|result|outcome|benefit|improve/i.test(text);
  if (!hasImpact) {
    suggestions.push({
      type: 'impact',
      original: text,
      enhanced: text + ' [Add impact: What was the result? Who benefited?]',
      explanation: 'Describe the outcome to show the value of your work'
    });
  }

  // Suggest more specificity
  const hasVagueWords = /something|things|stuff|various|multiple|several/i.test(text);
  if (hasVagueWords) {
    suggestions.push({
      type: 'specificity',
      original: text,
      enhanced: text + ' [Be specific: Replace vague terms with exact details]',
      explanation: 'Specific details make your accomplishment more credible and memorable'
    });
  }

  return suggestions;
}

// ============================================
// PERFORMANCE REVIEW GENERATION
// ============================================

export interface PerformanceReviewSection {
  title: string;
  content: string;
  bullets: string[];
}

export function generatePerformanceReview(entries: JournalEntry[], timeframe: string = 'this quarter'): {
  summary: string;
  sections: PerformanceReviewSection[];
} {
  // Group by category
  const byCategory: Record<string, JournalEntry[]> = {};
  entries.forEach(entry => {
    const cat = entry.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(entry);
  });

  // Generate summary
  const totalAccomplishments = entries.length;
  const categories = Object.keys(byCategory);
  const summary = `During ${timeframe}, I successfully completed ${totalAccomplishments} notable accomplishments across ${categories.length} key areas: ${categories.join(', ')}. My contributions demonstrated consistent delivery, technical excellence, and positive impact on team goals.`;

  // Generate sections
  const sections: PerformanceReviewSection[] = categories.map(category => {
    const categoryEntries = byCategory[category];
    const bullets = categoryEntries.slice(0, 5).map(entry => {
      // Clean up the accomplishment text
      let text = entry.accomplishment;

      // Remove minimizing words
      minimizingWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b\\s*`, 'gi');
        text = text.replace(regex, '');
      });

      // Ensure it starts with a strong verb
      if (!/^[A-Z][a-z]+(ed|d)\b/.test(text)) {
        text = 'Successfully ' + text.charAt(0).toLowerCase() + text.slice(1);
      }

      return text;
    });

    return {
      title: category,
      content: `In ${category.toLowerCase()}, I made significant contributions that advanced our objectives.`,
      bullets
    };
  });

  return { summary, sections };
}

// ============================================
// SMART AFFIRMATIONS
// ============================================

export interface AffirmationRecommendation {
  affirmation: string;
  reason: string;
  category: string;
}

export function recommendAffirmations(entries: JournalEntry[]): AffirmationRecommendation[] {
  const recommendations: AffirmationRecommendation[] = [];

  // Analyze mood patterns
  const moods = entries.map(e => e.mood).filter(Boolean);
  const negativeCount = moods.filter(m => m === 'challenging' || m === 'difficult').length;
  const positiveCount = moods.filter(m => m === 'great' || m === 'good').length;

  if (negativeCount > positiveCount) {
    recommendations.push({
      affirmation: "I have overcome challenges that others might have given up on. My persistence is a testament to my strength.",
      reason: "Your recent entries show you're facing challenges. This affirmation reminds you of your resilience.",
      category: "Resilience"
    });
  }

  // Analyze text for bias patterns
  const allText = entries.map(e => e.accomplishment).join(' ');
  const patterns = detectBiasPatterns(allText);

  if (patterns.some(p => p.type === 'luck-attribution')) {
    recommendations.push({
      affirmation: "My accomplishments are the result of my hard work and talent, not luck or being in the right place.",
      reason: "You tend to attribute success to luck. This helps you recognize your skill.",
      category: "Self-Recognition"
    });
  }

  if (patterns.some(p => p.type === 'imposter-syndrome')) {
    recommendations.push({
      affirmation: "I have developed expertise that took years of dedication. My knowledge is valuable.",
      reason: "Signs of imposter syndrome detected. Own your expertise!",
      category: "Confidence"
    });
  }

  // Default positive affirmations
  if (recommendations.length === 0) {
    recommendations.push({
      affirmation: "Every skill I possess today was once something I knew nothing about. My growth is extraordinary.",
      reason: "You're consistently tracking accomplishments. Celebrate your growth!",
      category: "Growth"
    });
  }

  return recommendations;
}

// ============================================
// PATTERN RECOGNITION
// ============================================

export interface Pattern {
  type: 'strength' | 'growth-area' | 'trend' | 'insight';
  title: string;
  description: string;
  data: any;
  confidence: number; // 0-100
}

export function analyzePatterns(entries: JournalEntry[]): Pattern[] {
  const patterns: Pattern[] = [];

  if (entries.length < 3) {
    return [{
      type: 'insight',
      title: 'Keep Building Your Record',
      description: 'Log more entries to unlock personalized insights and pattern analysis.',
      data: { entriesNeeded: 3 - entries.length },
      confidence: 100
    }];
  }

  // Analyze categories
  const categoryCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const cat = entry.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    patterns.push({
      type: 'strength',
      title: `${topCategory[0]} is Your Strength`,
      description: `You've logged ${topCategory[1]} accomplishments in ${topCategory[0]}. This is clearly an area where you excel and should highlight in performance discussions.`,
      data: categoryCounts,
      confidence: 85
    });
  }

  // Analyze mood trends
  const recentMoods = entries.slice(0, 10).map(e => e.mood).filter(Boolean);
  const challengingRecent = recentMoods.filter(m => m === 'challenging' || m === 'difficult').length;

  if (challengingRecent > recentMoods.length / 2) {
    patterns.push({
      type: 'growth-area',
      title: 'Increased Challenges Detected',
      description: 'Recent entries show more challenging experiences. This is normal during growth periods. Consider: What are you learning? How are you adapting?',
      data: { challengingCount: challengingRecent, totalCount: recentMoods.length },
      confidence: 75
    });
  }

  // Analyze time patterns
  const entriesByDay: Record<number, number> = {};
  entries.forEach(entry => {
    const day = new Date(entry.date).getDay();
    entriesByDay[day] = (entriesByDay[day] || 0) + 1;
  });

  const maxDay = Object.entries(entriesByDay).sort((a, b) => b[1] - a[1])[0];
  if (maxDay) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    patterns.push({
      type: 'trend',
      title: `${dayNames[parseInt(maxDay[0])]} Productivity`,
      description: `You tend to log more accomplishments on ${dayNames[parseInt(maxDay[0])]}s. This could indicate your most productive day or best reflection time.`,
      data: entriesByDay,
      confidence: 70
    });
  }

  // Analyze growth over time
  const firstHalf = entries.slice(Math.floor(entries.length / 2));
  const secondHalf = entries.slice(0, Math.floor(entries.length / 2));

  const firstHalfWords = firstHalf.reduce((sum, e) => sum + e.accomplishment.split(' ').length, 0) / firstHalf.length;
  const secondHalfWords = secondHalf.reduce((sum, e) => sum + e.accomplishment.split(' ').length, 0) / secondHalf.length;

  if (secondHalfWords > firstHalfWords * 1.2) {
    patterns.push({
      type: 'growth-area',
      title: 'Increasing Detail in Documentation',
      description: 'Your recent entries are more detailed, showing growth in self-awareness and articulation. This skill is valuable for performance reviews.',
      data: { oldAvg: firstHalfWords.toFixed(1), newAvg: secondHalfWords.toFixed(1) },
      confidence: 80
    });
  }

  return patterns;
}

// ============================================
// EXPORT UTILITIES
// ============================================

export function formatForExport(text: string, patterns: BiasPattern[]): string {
  let enhanced = text;

  // Remove minimizing words
  minimizingWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b\\s*`, 'gi');
    enhanced = enhanced.replace(regex, '');
  });

  // Clean up double spaces
  enhanced = enhanced.replace(/\s+/g, ' ').trim();

  return enhanced;
}
