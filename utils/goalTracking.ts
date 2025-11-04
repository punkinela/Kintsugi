/**
 * Goal Tracking System for Kintsugi
 *
 * Enables users to set, track, and achieve career goals
 */

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'skill' | 'project' | 'personal' | 'milestone';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  milestones: Milestone[];
  linkedJournalEntries: string[]; // Journal entry IDs
  progress: number; // 0-100
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

const GOALS_STORAGE_KEY = 'kintsugi_goals';

// ============================================
// CRUD OPERATIONS
// ============================================

export function getGoals(): Goal[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
}

export function createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'linkedJournalEntries'>): Goal {
  const goal: Goal = {
    ...goalData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 0,
    linkedJournalEntries: [],
  };

  const goals = getGoals();
  goals.unshift(goal);
  saveGoals(goals);

  return goal;
}

export function updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === goalId);

  if (index === -1) return null;

  goals[index] = {
    ...goals[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Auto-calculate progress based on milestones
  if (goals[index].milestones.length > 0) {
    const completedMilestones = goals[index].milestones.filter(m => m.completed).length;
    goals[index].progress = Math.round((completedMilestones / goals[index].milestones.length) * 100);
  }

  // Auto-complete if all milestones are done
  if (goals[index].progress === 100 && goals[index].status !== 'completed') {
    goals[index].status = 'completed';
    goals[index].completedAt = new Date().toISOString();
  }

  saveGoals(goals);
  return goals[index];
}

export function deleteGoal(goalId: string): boolean {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== goalId);

  if (filtered.length === goals.length) return false;

  saveGoals(filtered);
  return true;
}

// ============================================
// MILESTONE OPERATIONS
// ============================================

export function addMilestone(goalId: string, title: string): Goal | null {
  const milestone: Milestone = {
    id: Date.now().toString(),
    title,
    completed: false,
  };

  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return null;

  goal.milestones.push(milestone);
  return updateGoal(goalId, { milestones: goal.milestones });
}

export function toggleMilestone(goalId: string, milestoneId: string): Goal | null {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return null;

  const milestone = goal.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  milestone.completed = !milestone.completed;
  milestone.completedAt = milestone.completed ? new Date().toISOString() : undefined;

  return updateGoal(goalId, { milestones: goal.milestones });
}

export function deleteMilestone(goalId: string, milestoneId: string): Goal | null {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return null;

  goal.milestones = goal.milestones.filter(m => m.id !== milestoneId);
  return updateGoal(goalId, { milestones: goal.milestones });
}

// ============================================
// LINKING OPERATIONS
// ============================================

export function linkJournalEntry(goalId: string, entryId: string): Goal | null {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return null;

  if (!goal.linkedJournalEntries.includes(entryId)) {
    goal.linkedJournalEntries.push(entryId);
    return updateGoal(goalId, { linkedJournalEntries: goal.linkedJournalEntries });
  }

  return goal;
}

export function unlinkJournalEntry(goalId: string, entryId: string): Goal | null {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return null;

  goal.linkedJournalEntries = goal.linkedJournalEntries.filter(id => id !== entryId);
  return updateGoal(goalId, { linkedJournalEntries: goal.linkedJournalEntries });
}

// ============================================
// ANALYTICS
// ============================================

export interface GoalStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  onHold: number;
  averageProgress: number;
  completionRate: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  upcomingDeadlines: Goal[];
  overdueGoals: Goal[];
}

export function getGoalStats(): GoalStats {
  const goals = getGoals();
  const now = new Date();

  const stats: GoalStats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    notStarted: goals.filter(g => g.status === 'not-started').length,
    onHold: goals.filter(g => g.status === 'on-hold').length,
    averageProgress: 0,
    completionRate: 0,
    byCategory: {},
    byPriority: {},
    upcomingDeadlines: [],
    overdueGoals: [],
  };

  if (goals.length > 0) {
    stats.averageProgress = Math.round(
      goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
    );

    stats.completionRate = Math.round((stats.completed / goals.length) * 100);

    // By category
    goals.forEach(g => {
      stats.byCategory[g.category] = (stats.byCategory[g.category] || 0) + 1;
    });

    // By priority
    goals.forEach(g => {
      stats.byPriority[g.priority] = (stats.byPriority[g.priority] || 0) + 1;
    });

    // Upcoming deadlines (next 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    stats.upcomingDeadlines = goals
      .filter(g => g.targetDate && g.status !== 'completed')
      .filter(g => {
        const targetDate = new Date(g.targetDate!);
        return targetDate >= now && targetDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime())
      .slice(0, 5);

    // Overdue goals
    stats.overdueGoals = goals
      .filter(g => g.targetDate && g.status !== 'completed')
      .filter(g => new Date(g.targetDate!) < now)
      .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime());
  }

  return stats;
}

// ============================================
// SMART GOALS
// ============================================

export interface SMARTAnalysis {
  specific: boolean;
  measurable: boolean;
  achievable: boolean;
  relevant: boolean;
  timeBound: boolean;
  score: number;
  suggestions: string[];
}

export function analyzeSMARTGoal(goal: Goal): SMARTAnalysis {
  const analysis: SMARTAnalysis = {
    specific: false,
    measurable: false,
    achievable: false,
    relevant: false,
    timeBound: false,
    score: 0,
    suggestions: [],
  };

  // Specific: Has clear description and title
  if (goal.title.length > 10 && goal.description && goal.description.length > 20) {
    analysis.specific = true;
    analysis.score += 20;
  } else {
    analysis.suggestions.push('Be more specific: Add detailed description of what you want to achieve');
  }

  // Measurable: Has milestones or progress tracking
  if (goal.milestones.length > 0) {
    analysis.measurable = true;
    analysis.score += 20;
  } else {
    analysis.suggestions.push('Make it measurable: Add milestones to track progress');
  }

  // Achievable: Has realistic milestones (3-10) or is marked in-progress
  if ((goal.milestones.length >= 1 && goal.milestones.length <= 10) || goal.status === 'in-progress') {
    analysis.achievable = true;
    analysis.score += 20;
  } else if (goal.milestones.length > 10) {
    analysis.suggestions.push('Keep it achievable: Break down into smaller, manageable milestones');
  }

  // Relevant: Has category and priority set
  if (goal.category && goal.priority && goal.priority !== 'low') {
    analysis.relevant = true;
    analysis.score += 20;
  } else {
    analysis.suggestions.push('Ensure relevance: Set priority to align with your career goals');
  }

  // Time-bound: Has target date
  if (goal.targetDate) {
    analysis.timeBound = true;
    analysis.score += 20;
  } else {
    analysis.suggestions.push('Set a deadline: Add a target completion date');
  }

  return analysis;
}

// ============================================
// TEMPLATES
// ============================================

export const goalTemplates = {
  promotion: {
    title: 'Get Promoted to [Position]',
    description: 'Work towards promotion by demonstrating leadership, impact, and growth',
    category: 'career' as const,
    priority: 'high' as const,
    milestones: [
      { title: 'Document 20+ major accomplishments', completed: false },
      { title: 'Lead 3+ cross-functional projects', completed: false },
      { title: 'Mentor 2+ junior team members', completed: false },
      { title: 'Present to senior leadership', completed: false },
      { title: 'Get positive performance review', completed: false },
    ],
  },
  skill: {
    title: 'Master [Skill Name]',
    description: 'Develop expertise in a new skill to advance my career',
    category: 'skill' as const,
    priority: 'medium' as const,
    milestones: [
      { title: 'Complete online course/certification', completed: false },
      { title: 'Apply skill in 3+ real projects', completed: false },
      { title: 'Teach others or write about it', completed: false },
      { title: 'Get recognized as go-to person', completed: false },
    ],
  },
  project: {
    title: 'Complete [Project Name]',
    description: 'Successfully deliver a high-impact project',
    category: 'project' as const,
    priority: 'high' as const,
    milestones: [
      { title: 'Define scope and requirements', completed: false },
      { title: 'Create project plan', completed: false },
      { title: 'Complete development/implementation', completed: false },
      { title: 'Test and validate results', completed: false },
      { title: 'Launch and document impact', completed: false },
    ],
  },
  network: {
    title: 'Expand Professional Network',
    description: 'Build relationships with industry leaders and peers',
    category: 'personal' as const,
    priority: 'medium' as const,
    milestones: [
      { title: 'Attend 5+ industry events', completed: false },
      { title: 'Connect with 20+ professionals', completed: false },
      { title: 'Have 10+ coffee chats', completed: false },
      { title: 'Join professional organization', completed: false },
    ],
  },
  visibility: {
    title: 'Increase Professional Visibility',
    description: 'Become known for my expertise and contributions',
    category: 'career' as const,
    priority: 'high' as const,
    milestones: [
      { title: 'Speak at 2+ conferences/meetups', completed: false },
      { title: 'Publish 5+ articles/blog posts', completed: false },
      { title: 'Present at company all-hands', completed: false },
      { title: 'Build personal brand online', completed: false },
    ],
  },
};
