'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, X, Trash2, TrendingUp, Calendar, Flame } from 'lucide-react';
import { Habit } from '@/types/goals';
import {
  getGoalsData,
  createHabit,
  completeHabit,
  deleteHabit,
  isHabitCompletedToday,
  getHabitStats,
  getHabitsDueToday,
} from '@/utils/goalsAndHabits';

const HABIT_ICONS = ['💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎯', '🌟'];
const HABIT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'theme-bg-secondary',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500',
];

export default function HabitsTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showNewHabit, setShowNewHabit] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    const data = getGoalsData();
    setHabits(data.habits.filter(h => h.active));
  };

  const handleToggleHabit = (habitId: string) => {
    completeHabit(habitId);
    loadHabits();
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Delete this habit?')) {
      deleteHabit(habitId);
      loadHabits();
    }
  };

  const handleCreateHabit = (habitData: any) => {
    createHabit(habitData);
    loadHabits();
    setShowNewHabit(false);
  };

  const todayHabits = getHabitsDueToday();
  const completedToday = todayHabits.filter(h => isHabitCompletedToday(h.id)).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-6 w-6 theme-text-primary" />
            <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">Daily Habits</h2>
          </div>
          <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
            {completedToday} of {todayHabits.length} completed today
          </p>
        </div>

        <button
          onClick={() => setShowNewHabit(true)}
          className="flex items-center gap-2 px-4 py-2 theme-bg-primary hover:bg-theme-primary text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          New Habit
        </button>
      </div>

      {/* Today's Progress */}
      {todayHabits.length > 0 && (
        <div className="bg-gradient-to-br from-theme-primary-light to-orange-50  rounded-xl p-4 border theme-border-light dark:theme-border-primary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary">
              Today's Progress
            </span>
            <span className="text-sm font-bold theme-text-primary">
              {Math.round((completedToday / todayHabits.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedToday / todayHabits.length) * 100}%` }}
              className="h-full theme-bg-primary rounded-full"
            />
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
          />
        ))}

        {habits.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-kintsugi-dark-800 rounded-xl border theme-border-light dark:border-kintsugi-dark-700">
            <CheckCircle2 className="h-12 w-12 mx-auto theme-text-secondary mb-3" />
            <p className="text-kintsugi-dark-600 dark:theme-text-secondary">
              No habits yet. Create one to start building consistency!
            </p>
          </div>
        )}
      </div>

      {/* New Habit Modal */}
      {showNewHabit && (
        <NewHabitModal onClose={() => setShowNewHabit(false)} onCreate={handleCreateHabit} />
      )}
    </div>
  );
}

function HabitCard({
  habit,
  onToggle,
  onDelete,
}: {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const stats = getHabitStats(habit.id);
  const completed = stats?.completedToday || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border-2 transition-all ${
        completed
          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
          : 'theme-border-light dark:border-kintsugi-dark-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(habit.id)}
          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            completed
              ? 'bg-green-500 border-green-500 scale-110'
              : `${habit.color} border-transparent hover:scale-110`
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-6 w-6 text-white" />
          ) : (
            <Circle className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Habit Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{habit.icon}</span>
            <h3 className={`font-semibold ${completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-kintsugi-dark-900 dark:text-white'}`}>
              {habit.title}
            </h3>
          </div>

          {stats && (
            <div className="flex items-center gap-4 text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3 theme-text-secondary" />
                <span>{stats.currentStreak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.completionRate}% rate</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>{stats.totalCompletions} total</span>
              </div>
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </motion.div>
  );
}

function NewHabitModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      icon,
      color,
      frequency,
      targetDays: frequency === 'weekly' ? targetDays : undefined,
    });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-kintsugi-dark-900 dark:text-white">New Habit</h3>
          <button onClick={onClose} className="p-2 hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
              placeholder="e.g., Morning exercise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {HABIT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    icon === i ? 'theme-border-primary scale-110' : 'border-transparent'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-theme-primary ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
            >
              <option value="daily">Every Day</option>
              <option value="weekly">Specific Days</option>
            </select>
          </div>

          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-2">
                Days
              </label>
              <div className="flex gap-2">
                {days.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      if (targetDays.includes(index)) {
                        setTargetDays(targetDays.filter((d) => d !== index));
                      } else {
                        setTargetDays([...targetDays, index]);
                      }
                    }}
                    className={`flex-1 px-2 py-1 text-xs rounded-lg border-2 transition-all ${
                      targetDays.includes(index)
                        ? 'theme-bg-primary text-white theme-border-primary'
                        : 'theme-border-accent dark:border-kintsugi-dark-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 theme-bg-primary hover:bg-theme-primary text-white rounded-lg transition-colors font-medium"
            >
              Create Habit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
