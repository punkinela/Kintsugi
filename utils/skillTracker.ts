/**
 * Skill Tracker for Kintsugi
 *
 * Track skills demonstrated in journal entries and goals
 */

import { JournalEntry } from '@/types/engagement';

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'leadership' | 'domain' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  timesUsed: number;
  firstUsed: string;
  lastUsed: string;
  linkedEntries: string[]; // Journal entry IDs
  linkedGoals: string[]; // Goal IDs
  notes?: string;
  endorsed?: boolean; // User-confirmed proficiency
}

const SKILLS_STORAGE_KEY = 'kintsugi_skills';

// Common skills library for suggestions
export const skillLibrary = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git', 'CI/CD',
    'Machine Learning', 'Data Analysis', 'System Design', 'API Development'
  ],
  soft: [
    'Communication', 'Public Speaking', 'Writing', 'Presentation',
    'Negotiation', 'Conflict Resolution', 'Active Listening', 'Empathy',
    'Adaptability', 'Time Management', 'Problem Solving', 'Critical Thinking',
    'Creativity', 'Collaboration', 'Emotional Intelligence'
  ],
  leadership: [
    'Team Leadership', 'Mentoring', 'Coaching', 'Strategic Planning',
    'Decision Making', 'Delegation', 'Performance Management', 'Change Management',
    'Stakeholder Management', 'Vision Setting', 'Motivation', 'Conflict Mediation'
  ],
  domain: [
    'Product Management', 'Project Management', 'UX Design', 'Marketing',
    'Sales', 'Customer Success', 'Business Analysis', 'Financial Analysis',
    'Operations', 'Quality Assurance', 'Security', 'Compliance'
  ]
};

// ============================================
// CRUD OPERATIONS
// ============================================

export function getSkills(): Skill[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveSkills(skills: Skill[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
}

export function addSkill(skillData: Omit<Skill, 'id' | 'timesUsed' | 'firstUsed' | 'lastUsed' | 'linkedEntries' | 'linkedGoals'>): Skill {
  const skill: Skill = {
    ...skillData,
    id: Date.now().toString(),
    timesUsed: 0,
    firstUsed: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    linkedEntries: [],
    linkedGoals: [],
  };

  const skills = getSkills();
  skills.push(skill);
  saveSkills(skills);

  return skill;
}

export function updateSkill(skillId: string, updates: Partial<Skill>): Skill | null {
  const skills = getSkills();
  const index = skills.findIndex(s => s.id === skillId);

  if (index === -1) return null;

  skills[index] = {
    ...skills[index],
    ...updates,
    lastUsed: new Date().toISOString(),
  };

  saveSkills(skills);
  return skills[index];
}

export function deleteSkill(skillId: string): boolean {
  const skills = getSkills();
  const filtered = skills.filter(s => s.id !== skillId);

  if (filtered.length === skills.length) return false;

  saveSkills(filtered);
  return true;
}

// ============================================
// AUTO-DETECTION FROM JOURNAL ENTRIES
// ============================================

export function extractSkillsFromText(text: string): string[] {
  const detectedSkills: string[] = [];
  const lowerText = text.toLowerCase();

  // Check all skill categories
  Object.values(skillLibrary).forEach(skillList => {
    skillList.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        detectedSkills.push(skill);
      }
    });
  });

  return [...new Set(detectedSkills)]; // Remove duplicates
}

export function autoDetectSkills(entries: JournalEntry[]): Skill[] {
  const skillMap = new Map<string, Skill>();

  entries.forEach(entry => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`;
    const detectedSkills = extractSkillsFromText(text);

    detectedSkills.forEach(skillName => {
      if (skillMap.has(skillName)) {
        const existing = skillMap.get(skillName)!;
        existing.timesUsed++;
        existing.lastUsed = entry.date;
        if (!existing.linkedEntries.includes(entry.id)) {
          existing.linkedEntries.push(entry.id);
        }
      } else {
        // Determine category
        let category: Skill['category'] = 'other';
        for (const [cat, skills] of Object.entries(skillLibrary)) {
          if (skills.includes(skillName)) {
            category = cat as Skill['category'];
            break;
          }
        }

        skillMap.set(skillName, {
          id: `auto-${Date.now()}-${skillName}`,
          name: skillName,
          category,
          proficiency: 'intermediate', // Default
          timesUsed: 1,
          firstUsed: entry.date,
          lastUsed: entry.date,
          linkedEntries: [entry.id],
          linkedGoals: [],
        });
      }
    });
  });

  return Array.from(skillMap.values());
}

// ============================================
// SKILL ANALYTICS
// ============================================

export interface SkillStats {
  totalSkills: number;
  byCategory: Record<string, number>;
  byProficiency: Record<string, number>;
  topSkills: Skill[];
  recentlyUsed: Skill[];
  needsAttention: Skill[]; // Skills not used recently
  growthTrajectory: {
    newSkills: number; // Last 30 days
    advancedSkills: number; // Expert/Advanced
  };
}

export function getSkillStats(): SkillStats {
  const skills = getSkills();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats: SkillStats = {
    totalSkills: skills.length,
    byCategory: {},
    byProficiency: {},
    topSkills: [],
    recentlyUsed: [],
    needsAttention: [],
    growthTrajectory: {
      newSkills: 0,
      advancedSkills: 0,
    },
  };

  if (skills.length === 0) return stats;

  // By category
  skills.forEach(s => {
    stats.byCategory[s.category] = (stats.byCategory[s.category] || 0) + 1;
  });

  // By proficiency
  skills.forEach(s => {
    stats.byProficiency[s.proficiency] = (stats.byProficiency[s.proficiency] || 0) + 1;
  });

  // Top skills (by usage)
  stats.topSkills = [...skills]
    .sort((a, b) => b.timesUsed - a.timesUsed)
    .slice(0, 10);

  // Recently used (last 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  stats.recentlyUsed = skills
    .filter(s => new Date(s.lastUsed) >= sevenDaysAgo)
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 5);

  // Needs attention (not used in 60+ days)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  stats.needsAttention = skills
    .filter(s => new Date(s.lastUsed) < sixtyDaysAgo && s.proficiency !== 'expert')
    .sort((a, b) => new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime())
    .slice(0, 5);

  // Growth trajectory
  stats.growthTrajectory.newSkills = skills.filter(
    s => new Date(s.firstUsed) >= thirtyDaysAgo
  ).length;

  stats.growthTrajectory.advancedSkills = skills.filter(
    s => s.proficiency === 'advanced' || s.proficiency === 'expert'
  ).length;

  return stats;
}

// ============================================
// SKILL RECOMMENDATIONS
// ============================================

export function recommendSkills(existingSkills: Skill[], category?: string): string[] {
  const existingNames = new Set(existingSkills.map(s => s.name.toLowerCase()));
  const recommendations: string[] = [];

  const libraryToSearch = category
    ? { [category]: skillLibrary[category as keyof typeof skillLibrary] }
    : skillLibrary;

  Object.values(libraryToSearch).forEach(skillList => {
    skillList.forEach(skill => {
      if (!existingNames.has(skill.toLowerCase())) {
        recommendations.push(skill);
      }
    });
  });

  // Return random sample
  return recommendations
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
}

// ============================================
// PROFICIENCY SUGGESTIONS
// ============================================

export function suggestProficiencyLevel(skill: Skill): { suggested: Skill['proficiency']; reason: string } {
  const { timesUsed, linkedEntries, endorsed } = skill;

  // If user has endorsed, keep their choice
  if (endorsed) {
    return {
      suggested: skill.proficiency,
      reason: 'You have confirmed this proficiency level'
    };
  }

  // Suggest based on usage
  if (timesUsed >= 20 && linkedEntries.length >= 15) {
    return {
      suggested: 'expert',
      reason: 'Used extensively across many accomplishments'
    };
  }

  if (timesUsed >= 10 && linkedEntries.length >= 8) {
    return {
      suggested: 'advanced',
      reason: 'Demonstrated consistently in multiple contexts'
    };
  }

  if (timesUsed >= 5 && linkedEntries.length >= 3) {
    return {
      suggested: 'intermediate',
      reason: 'Applied in several accomplishments'
    };
  }

  return {
    suggested: 'beginner',
    reason: 'Still developing this skill'
  };
}

// ============================================
// EXPORT FOR RESUME
// ============================================

export function exportSkillsForResume(): string {
  const skills = getSkills();

  const byCategory: Record<string, Skill[]> = {};
  skills.forEach(skill => {
    if (!byCategory[skill.category]) {
      byCategory[skill.category] = [];
    }
    byCategory[skill.category].push(skill);
  });

  let output = '';

  Object.entries(byCategory).forEach(([category, categorySkills]) => {
    output += `${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;

    const grouped: Record<string, string[]> = {};
    categorySkills.forEach(skill => {
      if (!grouped[skill.proficiency]) {
        grouped[skill.proficiency] = [];
      }
      grouped[skill.proficiency].push(skill.name);
    });

    ['expert', 'advanced', 'intermediate', 'beginner'].forEach(level => {
      if (grouped[level]) {
        output += `  ${level.charAt(0).toUpperCase() + level.slice(1)}: ${grouped[level].join(', ')}\n`;
      }
    });

    output += '\n';
  });

  return output;
}
