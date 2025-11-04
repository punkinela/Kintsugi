// Goals and Habits Management

import { Goal, Habit, GoalsData, Milestone, HabitCompletion } from '@/types/goals';

const STORAGE_KEY = 'kintsugi_goals_habits';

// Initialize goals and habits data
function initializeGoalsData(): GoalsData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to default
    }
  }

  const defaultData: GoalsData = {
    goals: [],
    habits: [],
    stats: {
      totalGoalsCreated: 0,
      goalsCompleted: 0,
      goalsActive: 0,
      totalHabits: 0,
      habitsActive: 0,
      longestHabitStreak: 0,
    },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
}

// Get goals and habits data
export function getGoalsData(): GoalsData {
  return initializeGoalsData();
}

// Save goals and habits data
function saveGoalsData(data: GoalsData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ============================================
// GOALS MANAGEMENT
// ============================================

// Create a new goal
export function createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'status' | 'progress' | 'milestones'>): Goal {
  const data = getGoalsData();

  const newGoal: Goal = {
    ...goalData,
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'active',
    progress: 0,
    milestones: [],
  };

  data.goals.push(newGoal);
  data.stats.totalGoalsCreated++;
  data.stats.goalsActive++;

  saveGoalsData(data);
  return newGoal;
}

// Update a goal
export function updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
  const data = getGoalsData();
  const goalIndex = data.goals.findIndex(g => g.id === goalId);

  if (goalIndex === -1) return null;

  const oldStatus = data.goals[goalIndex].status;
  data.goals[goalIndex] = { ...data.goals[goalIndex], ...updates };

  // Update stats if status changed
  if (updates.status && updates.status !== oldStatus) {
    if (oldStatus === 'active') data.stats.goalsActive--;
    if (updates.status === 'active') data.stats.goalsActive++;
    if (updates.status === 'completed') {
      data.stats.goalsCompleted++;
      data.goals[goalIndex].completedAt = new Date().toISOString();
    }
  }

  saveGoalsData(data);
  return data.goals[goalIndex];
}

// Delete a goal
export function deleteGoal(goalId: string): boolean {
  const data = getGoalsData();
  const goalIndex = data.goals.findIndex(g => g.id === goalId);

  if (goalIndex === -1) return false;

  const goal = data.goals[goalIndex];
  if (goal.status === 'active') data.stats.goalsActive--;

  data.goals.splice(goalIndex, 1);
  saveGoalsData(data);
  return true;
}

// Add milestone to goal
export function addMilestone(goalId: string, milestoneData: Omit<Milestone, 'id' | 'completed'>): Milestone | null {
  const data = getGoalsData();
  const goal = data.goals.find(g => g.id === goalId);

  if (!goal) return null;

  const newMilestone: Milestone = {
    ...milestoneData,
    id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    completed: false,
  };

  goal.milestones.push(newMilestone);
  updateGoalProgress(goalId);

  saveGoalsData(data);
  return newMilestone;
}

// Toggle milestone completion
export function toggleMilestone(goalId: string, milestoneId: string): boolean {
  const data = getGoalsData();
  const goal = data.goals.find(g => g.id === goalId);

  if (!goal) return false;

  const milestone = goal.milestones.find(m => m.id === milestoneId);
  if (!milestone) return false;

  milestone.completed = !milestone.completed;
  milestone.completedAt = milestone.completed ? new Date().toISOString() : undefined;

  updateGoalProgress(goalId);
  saveGoalsData(data);
  return true;
}

// Update goal progress based on milestones
function updateGoalProgress(goalId: string): void {
  const data = getGoalsData();
  const goal = data.goals.find(g => g.id === goalId);

  if (!goal || goal.milestones.length === 0) return;

  const completed = goal.milestones.filter(m => m.completed).length;
  goal.progress = Math.round((completed / goal.milestones.length) * 100);

  // Auto-complete goal if all milestones done
  if (goal.progress === 100 && goal.status === 'active') {
    goal.status = 'completed';
    goal.completedAt = new Date().toISOString();
    data.stats.goalsCompleted++;
    data.stats.goalsActive--;
  }
}

// Get goals by category
export function getGoalsByCategory(category: Goal['category']): Goal[] {
  const data = getGoalsData();
  return data.goals.filter(g => g.category === category);
}

// Get goals by status
export function getGoalsByStatus(status: Goal['status']): Goal[] {
  const data = getGoalsData();
  return data.goals.filter(g => g.status === status);
}

// ============================================
// HABITS MANAGEMENT
// ============================================

// Create a new habit
export function createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'totalCompletions' | 'completionHistory' | 'active'>): Habit {
  const data = getGoalsData();

  const newHabit: Habit = {
    ...habitData,
    id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    completionHistory: [],
    active: true,
  };

  data.habits.push(newHabit);
  data.stats.totalHabits++;
  data.stats.habitsActive++;

  saveGoalsData(data);
  return newHabit;
}

// Mark habit as complete for a date
export function completeHabit(habitId: string, date?: string, note?: string): boolean {
  const data = getGoalsData();
  const habit = data.habits.find(h => h.id === habitId);

  if (!habit) return false;

  const completionDate = date || new Date().toISOString().split('T')[0];

  // Check if already completed for this date
  const existingIndex = habit.completionHistory.findIndex(c => c.date === completionDate);

  if (existingIndex >= 0) {
    // Already completed, mark as incomplete
    habit.completionHistory.splice(existingIndex, 1);
    habit.totalCompletions--;
  } else {
    // Mark as complete
    habit.completionHistory.push({
      date: completionDate,
      completed: true,
      note,
    });
    habit.totalCompletions++;
  }

  // Recalculate streaks
  recalculateHabitStreaks(habit);

  saveGoalsData(data);
  return true;
}

// Recalculate habit streaks
function recalculateHabitStreaks(habit: Habit): void {
  const sortedDates = habit.completionHistory
    .filter(c => c.completed)
    .map(c => new Date(c.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDates.length === 0) {
    habit.currentStreak = 0;
    return;
  }

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const completed = sortedDates.some(d => {
      d.setHours(0, 0, 0, 0);
      return d.getTime() === checkDate.getTime();
    });

    if (completed) {
      currentStreak++;
    } else if (i > 0) {
      // Allow today to not be completed yet
      break;
    }
  }

  habit.currentStreak = currentStreak;

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;

  const allDates = sortedDates.map(d => d.getTime()).sort((a, b) => a - b);

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor((allDates[i] - allDates[i - 1]) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  habit.longestStreak = Math.max(longestStreak, tempStreak);

  // Update global longest streak
  const data = getGoalsData();
  data.stats.longestHabitStreak = Math.max(
    data.stats.longestHabitStreak,
    habit.longestStreak
  );
}

// Check if habit is completed today
export function isHabitCompletedToday(habitId: string): boolean {
  const data = getGoalsData();
  const habit = data.habits.find(h => h.id === habitId);

  if (!habit) return false;

  const today = new Date().toISOString().split('T')[0];
  return habit.completionHistory.some(c => c.date === today && c.completed);
}

// Get habit completion rate (last 30 days)
export function getHabitCompletionRate(habitId: string, days: number = 30): number {
  const data = getGoalsData();
  const habit = data.habits.find(h => h.id === habitId);

  if (!habit) return 0;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const completions = habit.completionHistory.filter(c => {
    const date = new Date(c.date);
    return date >= startDate && c.completed;
  });

  return Math.round((completions.length / days) * 100);
}

// Update habit
export function updateHabit(habitId: string, updates: Partial<Habit>): Habit | null {
  const data = getGoalsData();
  const habitIndex = data.habits.findIndex(h => h.id === habitId);

  if (habitIndex === -1) return null;

  const oldActive = data.habits[habitIndex].active;
  data.habits[habitIndex] = { ...data.habits[habitIndex], ...updates };

  // Update stats if active status changed
  if (updates.active !== undefined && updates.active !== oldActive) {
    if (updates.active) {
      data.stats.habitsActive++;
    } else {
      data.stats.habitsActive--;
    }
  }

  saveGoalsData(data);
  return data.habits[habitIndex];
}

// Delete habit
export function deleteHabit(habitId: string): boolean {
  const data = getGoalsData();
  const habitIndex = data.habits.findIndex(h => h.id === habitId);

  if (habitIndex === -1) return false;

  const habit = data.habits[habitIndex];
  if (habit.active) data.stats.habitsActive--;

  data.habits.splice(habitIndex, 1);
  data.stats.totalHabits--;

  saveGoalsData(data);
  return true;
}

// Get habits due today
export function getHabitsDueToday(): Habit[] {
  const data = getGoalsData();
  const today = new Date().getDay(); // 0-6 (Sun-Sat)

  return data.habits.filter(habit => {
    if (!habit.active) return false;

    if (habit.frequency === 'daily') return true;

    if (habit.frequency === 'weekly' && habit.targetDays) {
      return habit.targetDays.includes(today);
    }

    return false;
  });
}

// Get habit statistics
export function getHabitStats(habitId: string) {
  const data = getGoalsData();
  const habit = data.habits.find(h => h.id === habitId);

  if (!habit) return null;

  const completionRate = getHabitCompletionRate(habitId);
  const completedToday = isHabitCompletedToday(habitId);

  return {
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    totalCompletions: habit.totalCompletions,
    completionRate,
    completedToday,
    createdDaysAgo: Math.floor(
      (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ),
  };
}
