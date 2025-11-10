/**
 * Resume Formatter Utilities
 *
 * Converts journal accomplishments into ATS-optimized resume bullet points
 * Following best practices: Action Verb + Task + Result format
 */

import { JournalEntry } from '@/types/engagement';

// Strong action verbs for different categories
const ACTION_VERBS = {
  leadership: [
    'Led', 'Directed', 'Managed', 'Coordinated', 'Supervised', 'Mentored',
    'Coached', 'Guided', 'Facilitated', 'Spearheaded', 'Championed', 'Orchestrated'
  ],
  achievement: [
    'Achieved', 'Accomplished', 'Delivered', 'Exceeded', 'Improved', 'Increased',
    'Reduced', 'Optimized', 'Enhanced', 'Streamlined', 'Transformed', 'Resolved'
  ],
  creation: [
    'Created', 'Developed', 'Designed', 'Built', 'Established', 'Launched',
    'Implemented', 'Initiated', 'Introduced', 'Founded', 'Pioneered', 'Architected'
  ],
  collaboration: [
    'Collaborated', 'Partnered', 'Coordinated', 'Aligned', 'Integrated', 'Unified',
    'Facilitated', 'Negotiated', 'Influenced', 'Engaged', 'Consulted', 'Advised'
  ],
  analysis: [
    'Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched', 'Identified',
    'Diagnosed', 'Measured', 'Quantified', 'Reviewed', 'Audited', 'Examined'
  ],
  communication: [
    'Presented', 'Communicated', 'Reported', 'Documented', 'Published', 'Wrote',
    'Articulated', 'Conveyed', 'Briefed', 'Advocated', 'Promoted', 'Demonstrated'
  ]
};

export interface ResumeBullet {
  id: string;
  original: string;
  formatted: string;
  category?: string;
  metrics?: string[];
  selected: boolean;
  entryId: string;
  entryDate: string;
}

/**
 * Extract metrics/numbers from text
 */
function extractMetrics(text: string): string[] {
  const metrics: string[] = [];

  // Match percentages
  const percentages = text.match(/\d+%/g);
  if (percentages) metrics.push(...percentages);

  // Match dollar amounts
  const dollars = text.match(/\$[\d,]+[KMB]?/gi);
  if (dollars) metrics.push(...dollars);

  // Match numbers with context (e.g., "30 people", "5 projects")
  const numbersWithContext = text.match(/\d+\s+(?:people|employees|team members|projects|clients|customers|users|hours|days|weeks|months)/gi);
  if (numbersWithContext) metrics.push(...numbersWithContext);

  return metrics;
}

/**
 * Capitalize first letter of string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Determine category based on keywords in text
 */
function categorizeAccomplishment(text: string): keyof typeof ACTION_VERBS {
  const lower = text.toLowerCase();

  if (lower.match(/led|manage|mentor|coach|supervise|direct|team/)) return 'leadership';
  if (lower.match(/create|build|develop|design|launch|implement/)) return 'creation';
  if (lower.match(/collaborate|partner|work with|coordinate|align/)) return 'collaboration';
  if (lower.match(/analyz|evaluat|assess|research|investigat|measure/)) return 'analysis';
  if (lower.match(/present|communicate|write|report|document|publish/)) return 'communication';

  return 'achievement'; // default
}

/**
 * Get a strong action verb for the category
 */
function getActionVerb(text: string, category: keyof typeof ACTION_VERBS): string {
  const verbs = ACTION_VERBS[category];

  // Check if text already starts with a strong verb
  const firstWord = text.trim().split(/\s+/)[0];
  const firstWordLower = firstWord?.toLowerCase() || '';

  for (const verbList of Object.values(ACTION_VERBS)) {
    if (verbList.some(v => v.toLowerCase() === firstWordLower)) {
      return capitalize(firstWord);
    }
  }

  // Return a verb from the category
  return verbs[0];
}

/**
 * Clean and format text for resume
 */
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/^[-•]\s*/, '') // Remove leading bullets
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\.$/, ''); // Remove trailing period (we'll add it back)
}

/**
 * Convert accomplishment to professional resume bullet
 */
export function formatResumeBullet(
  accomplishment: string,
  reflection?: string
): string {
  const text = cleanText(accomplishment);
  const category = categorizeAccomplishment(text);
  const metrics = extractMetrics(text + ' ' + (reflection || ''));

  // Get appropriate action verb
  const actionVerb = getActionVerb(text, category);

  // Remove the action verb from text if it's already there
  let mainText = text;
  const firstWord = text.split(/\s+/)[0];
  if (ACTION_VERBS[category].some(v => v.toLowerCase() === firstWord.toLowerCase())) {
    mainText = text.substring(firstWord.length).trim();
  }

  // Construct the bullet point
  let bullet = `${actionVerb} ${mainText}`;

  // Add metrics if we found any and they're not already in the text
  if (metrics.length > 0) {
    const metricsNotInText = metrics.filter(m => !text.includes(m));
    if (metricsNotInText.length > 0) {
      // Add metrics to make it more impactful
      if (!bullet.includes('resulting in') && !bullet.includes('achieving')) {
        bullet += `, resulting in ${metricsNotInText[0]}`;
        if (metricsNotInText.length > 1) {
          bullet += ` and ${metricsNotInText[1]}`;
        }
      }
    }
  }

  // Ensure it doesn't end with a period (ATS best practice: no periods in bullets)
  bullet = bullet.replace(/\.$/, '');

  // Capitalize first letter
  bullet = capitalize(bullet);

  return bullet;
}

/**
 * Convert journal entries to resume bullets
 */
export function entriesToResumeBullets(entries: JournalEntry[]): ResumeBullet[] {
  return entries
    .filter(entry => entry.accomplishment && entry.accomplishment.trim().length > 0)
    .map(entry => ({
      id: `bullet-${entry.id}`,
      entryId: entry.id,
      entryDate: entry.date,
      original: entry.accomplishment,
      formatted: formatResumeBullet(entry.accomplishment, entry.reflection),
      category: categorizeAccomplishment(entry.accomplishment),
      metrics: extractMetrics(entry.accomplishment + ' ' + (entry.reflection || '')),
      selected: true, // Default to selected
    }));
}

/**
 * Group resume bullets by category
 */
export function groupBulletsByCategory(bullets: ResumeBullet[]): Map<string, ResumeBullet[]> {
  const groups = new Map<string, ResumeBullet[]>();

  bullets.forEach(bullet => {
    const category = bullet.category || 'other';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(bullet);
  });

  return groups;
}

/**
 * Sort bullets by date (most recent first)
 */
export function sortBulletsByDate(bullets: ResumeBullet[]): ResumeBullet[] {
  return [...bullets].sort((a, b) => {
    const dateA = new Date(a.entryDate).getTime();
    const dateB = new Date(b.entryDate).getTime();
    return dateB - dateA; // Most recent first
  });
}

/**
 * Generate resume section text from selected bullets
 */
export function generateResumeSection(
  bullets: ResumeBullet[],
  options: {
    includeMetricsOnly?: boolean;
    maxBullets?: number;
    sortBy?: 'date' | 'category';
  } = {}
): string {
  let filteredBullets = bullets.filter(b => b.selected);

  // Filter for metrics if requested
  if (options.includeMetricsOnly) {
    filteredBullets = filteredBullets.filter(b => b.metrics && b.metrics.length > 0);
  }

  // Sort
  if (options.sortBy === 'date') {
    filteredBullets = sortBulletsByDate(filteredBullets);
  }

  // Limit count
  if (options.maxBullets) {
    filteredBullets = filteredBullets.slice(0, options.maxBullets);
  }

  // Format as bullet list
  return filteredBullets
    .map(b => `• ${b.formatted}`)
    .join('\n');
}

/**
 * Export bullets to plain text format
 */
export function exportToPlainText(bullets: ResumeBullet[]): string {
  const selected = bullets.filter(b => b.selected);
  const grouped = groupBulletsByCategory(selected);

  let output = '';

  // Add header
  output += 'RESUME BULLETS\n';
  output += 'Generated by Kintsugi\n';
  output += '='.repeat(50) + '\n\n';

  // Add bullets by category
  const categoryNames: Record<string, string> = {
    leadership: 'Leadership & Management',
    achievement: 'Key Achievements',
    creation: 'Development & Innovation',
    collaboration: 'Collaboration & Teamwork',
    analysis: 'Analysis & Strategy',
    communication: 'Communication & Presentations',
  };

  grouped.forEach((categoryBullets, category) => {
    output += `${categoryNames[category] || 'Other Accomplishments'}\n`;
    output += '-'.repeat(50) + '\n';
    categoryBullets.forEach(bullet => {
      output += `• ${bullet.formatted}\n`;
    });
    output += '\n';
  });

  return output;
}

/**
 * Tailor bullets to a specific job description
 * Prioritizes bullets that match keywords in the job description
 */
export function tailorToJobDescription(
  bullets: ResumeBullet[],
  jobDescription: string,
  maxBullets: number = 5
): ResumeBullet[] {
  const jobKeywords = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3); // Filter out short words

  // Score each bullet based on keyword matches
  const scoredBullets = bullets.map(bullet => {
    const bulletText = (bullet.formatted + ' ' + bullet.original).toLowerCase();
    const matches = jobKeywords.filter(keyword => bulletText.includes(keyword));

    return {
      bullet,
      score: matches.length,
      hasMetrics: bullet.metrics && bullet.metrics.length > 0,
    };
  });

  // Sort by score (with metrics as tiebreaker)
  scoredBullets.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.hasMetrics !== b.hasMetrics) return a.hasMetrics ? -1 : 1;
    return 0;
  });

  return scoredBullets.slice(0, maxBullets).map(s => s.bullet);
}
