/**
 * Lightcast Skills API Integration
 *
 * Provides skill extraction from text using Lightcast Open Skills Library (33,000+ skills)
 * Free tier: 50 requests/month with scope 'lightcast_open_free'
 *
 * Setup:
 * 1. Register at https://lightcast.io/open-skills
 * 2. Add credentials to .env.local:
 *    NEXT_PUBLIC_LIGHTCAST_CLIENT_ID=your_client_id
 *    NEXT_PUBLIC_LIGHTCAST_CLIENT_SECRET=your_client_secret
 */

interface LightcastAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface ExtractedSkill {
  skill: {
    id: string;
    name: string;
  };
  confidence: number;
}

interface LightcastExtractResponse {
  data: ExtractedSkill[];
}

export interface Skill {
  id: string;
  name: string;
  confidence: number;
  category?: string;
}

// Cache for access token (valid for 1 hour)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get OAuth access token for Lightcast API
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.NEXT_PUBLIC_LIGHTCAST_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_LIGHTCAST_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Lightcast credentials not configured. Add NEXT_PUBLIC_LIGHTCAST_CLIENT_ID and NEXT_PUBLIC_LIGHTCAST_CLIENT_SECRET to .env.local');
  }

  const response = await fetch('https://auth.emsicloud.com/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'lightcast_open_free', // Free tier scope
    }),
  });

  if (!response.ok) {
    throw new Error(`Lightcast authentication failed: ${response.status} ${response.statusText}`);
  }

  const data: LightcastAuthResponse = await response.json();

  // Cache token (expires in 1 hour, we'll cache for 55 minutes to be safe)
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (55 * 60 * 1000);

  return data.access_token;
}

/**
 * Extract skills from text using Lightcast API
 *
 * @param text - Text to analyze (max 50KB)
 * @param confidenceThreshold - Minimum confidence score (0-1), default 0.6
 * @returns Array of extracted skills with confidence scores
 */
export async function extractSkills(
  text: string,
  confidenceThreshold: number = 0.6
): Promise<Skill[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Truncate if text exceeds 50KB
  const maxBytes = 50 * 1024;
  const encoder = new TextEncoder();
  let truncatedText = text;

  if (encoder.encode(text).length > maxBytes) {
    // Truncate to approximately 50KB (rough estimate)
    truncatedText = text.substring(0, 45000);
    console.warn('Text truncated to 50KB for Lightcast API');
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch('https://emsiservices.com/skills/versions/latest/extract', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: truncatedText,
        confidenceThreshold,
      }),
    });

    if (!response.ok) {
      throw new Error(`Lightcast extract failed: ${response.status} ${response.statusText}`);
    }

    const result: LightcastExtractResponse = await response.json();

    // Transform to our Skill interface
    return result.data.map(item => ({
      id: item.skill.id,
      name: item.skill.name,
      confidence: item.confidence,
    }));
  } catch (error) {
    console.error('Error extracting skills from Lightcast:', error);
    throw error;
  }
}

/**
 * Extract skills from multiple journal entries
 * Combines all text and extracts skills from the combined content
 *
 * @param entries - Array of text entries to analyze
 * @param confidenceThreshold - Minimum confidence score (0-1)
 * @returns Array of unique skills sorted by confidence
 */
export async function extractSkillsFromEntries(
  entries: string[],
  confidenceThreshold: number = 0.6
): Promise<Skill[]> {
  if (!entries || entries.length === 0) {
    return [];
  }

  // Combine all entries with separators
  const combinedText = entries
    .filter(entry => entry && entry.trim().length > 0)
    .join('\n\n---\n\n');

  const skills = await extractSkills(combinedText, confidenceThreshold);

  // Remove duplicates and sort by confidence
  const uniqueSkills = Array.from(
    new Map(skills.map(skill => [skill.id, skill])).values()
  );

  return uniqueSkills.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Categorize skills by type (soft skills, technical skills, etc.)
 * This is a simple categorization - can be enhanced with Lightcast taxonomy data
 */
export function categorizeSkills(skills: Skill[]): Map<string, Skill[]> {
  const categories = new Map<string, Skill[]>();

  // Common soft skills keywords
  const softSkillsKeywords = [
    'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving',
    'critical thinking', 'creativity', 'adaptability', 'emotional intelligence',
    'conflict resolution', 'decision making', 'time management', 'resilience',
    'empathy', 'negotiation', 'mentoring', 'coaching', 'influence'
  ];

  // Technical skills keywords
  const technicalKeywords = [
    'programming', 'software', 'database', 'cloud', 'aws', 'azure',
    'javascript', 'python', 'java', 'sql', 'api', 'development',
    'engineering', 'architecture', 'security', 'network'
  ];

  skills.forEach(skill => {
    const skillLower = skill.name.toLowerCase();

    if (softSkillsKeywords.some(keyword => skillLower.includes(keyword))) {
      const category = 'Soft Skills';
      if (!categories.has(category)) categories.set(category, []);
      categories.get(category)!.push(skill);
    } else if (technicalKeywords.some(keyword => skillLower.includes(keyword))) {
      const category = 'Technical Skills';
      if (!categories.has(category)) categories.set(category, []);
      categories.get(category)!.push(skill);
    } else {
      const category = 'Professional Skills';
      if (!categories.has(category)) categories.set(category, []);
      categories.get(category)!.push(skill);
    }
  });

  return categories;
}

/**
 * Format skills for display with confidence indicators
 */
export function formatSkillConfidence(confidence: number): {
  label: string;
  color: string;
  percentage: string;
} {
  const percentage = Math.round(confidence * 100);

  if (confidence >= 0.9) {
    return { label: 'Strong Evidence', color: 'green', percentage: `${percentage}%` };
  } else if (confidence >= 0.7) {
    return { label: 'Clear Evidence', color: 'blue', percentage: `${percentage}%` };
  } else if (confidence >= 0.5) {
    return { label: 'Moderate Evidence', color: 'yellow', percentage: `${percentage}%` };
  } else {
    return { label: 'Some Evidence', color: 'gray', percentage: `${percentage}%` };
  }
}
