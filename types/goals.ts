// Goal setting and tracking types

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'learning' | 'relationships' | 'other';
  targetDate: string;
  createdAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress: number; // 0-100
  milestones: Milestone[];
  reflection?: string;
  icon?: string;
  color?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number[]; // For weekly: [0,1,2,3,4,5,6] (Sun-Sat)
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionHistory: HabitCompletion[];
  reminderTime?: string;
  active: boolean;
}

export interface HabitCompletion {
  date: string;
  completed: boolean;
  note?: string;
}

export interface GoalsData {
  goals: Goal[];
  habits: Habit[];
  stats: {
    totalGoalsCreated: number;
    goalsCompleted: number;
    goalsActive: number;
    totalHabits: number;
    habitsActive: number;
    longestHabitStreak: number;
  };
}
