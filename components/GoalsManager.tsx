'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Check,
  X,
  Edit2,
  Trash2,
  Calendar,
  Flag,
  TrendingUp,
  Pause,
  Play,
  CheckCircle,
} from 'lucide-react';
import { Goal, Milestone } from '@/types/goals';
import {
  getGoalsData,
  createGoal,
  updateGoal,
  deleteGoal,
  addMilestone,
  toggleMilestone,
} from '@/utils/goalsAndHabits';

export default function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const data = getGoalsData();
    setGoals(data.goals);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const handleCreateGoal = (goalData: any): Goal => {
    const newGoal = createGoal(goalData);
    loadGoals();
    setShowNewGoal(false);
    return newGoal;
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    toggleMilestone(goalId, milestoneId);
    loadGoals();
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
      loadGoals();
    }
  };

  const handleToggleStatus = (goal: Goal) => {
    const newStatus = goal.status === 'active' ? 'paused' : goal.status === 'paused' ? 'active' : 'active';
    updateGoal(goal.id, { status: newStatus });
    loadGoals();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 theme-text-primary" />
          <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">Goals</h2>
        </div>

        <button
          onClick={() => setShowNewGoal(true)}
          className="flex items-center gap-2 px-4 py-2 theme-bg-primary hover:bg-kintsugi-gold-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? 'theme-bg-primary text-white'
                : 'bg-white dark:bg-kintsugi-dark-800 text-kintsugi-dark-600 dark:theme-text-secondary hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={handleToggleMilestone}
              onDelete={handleDeleteGoal}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </AnimatePresence>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-kintsugi-dark-800 rounded-xl border theme-border-light dark:border-kintsugi-dark-700">
            <Target className="h-12 w-12 mx-auto theme-text-secondary mb-3" />
            <p className="text-kintsugi-dark-600 dark:theme-text-secondary">
              {filter === 'active' ? 'No active goals. Create one to get started!' : 'No goals found.'}
            </p>
          </div>
        )}
      </div>

      {/* New Goal Modal */}
      {showNewGoal && (
        <NewGoalModal onClose={() => setShowNewGoal(false)} onCreate={handleCreateGoal} />
      )}
    </div>
  );
}

function GoalCard({
  goal,
  onToggleMilestone,
  onDelete,
  onToggleStatus,
}: {
  goal: Goal;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (goalId: string) => void;
  onToggleStatus: (goal: Goal) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors = {
    personal: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    professional: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    health: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    learning: 'theme-bg-primary-light dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
    relationships: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
    other: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'theme-text-primary',
    high: 'text-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-4 border theme-border-light dark:border-kintsugi-dark-700"
    >
      {/* Goal Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColors[goal.category]}`}>
              {goal.category}
            </span>
            <Flag className={`h-4 w-4 ${priorityColors[goal.priority]}`} />
            {goal.status === 'completed' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-1">
            {goal.title}
          </h3>
          <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
            {goal.description}
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-kintsugi-dark-600 dark:theme-text-secondary mb-1">
              <span>Progress</span>
              <span className="font-semibold">{goal.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-kintsugi-dark-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                className="h-full bg-gradient-to-r from-kintsugi-gold-500 to-kintsugi-gold-600 rounded-full"
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="flex items-center gap-4 mt-3 text-xs text-kintsugi-dark-600 dark:theme-text-secondary">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>
                {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={() => onToggleStatus(goal)}
            className="p-2 hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 rounded-lg transition-colors"
            title={goal.status === 'active' ? 'Pause' : 'Resume'}
          >
            {goal.status === 'active' ? (
              <Pause className="h-4 w-4 text-kintsugi-dark-600 dark:theme-text-secondary" />
            ) : (
              <Play className="h-4 w-4 text-kintsugi-dark-600 dark:theme-text-secondary" />
            )}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 rounded-lg transition-colors"
          >
            <TrendingUp className="h-4 w-4 text-kintsugi-dark-600 dark:theme-text-secondary" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Milestones (Expanded) */}
      <AnimatePresence>
        {expanded && goal.milestones.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t theme-border-light dark:border-kintsugi-dark-700"
          >
            <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-2">
              Milestones
            </h4>
            <div className="space-y-2">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 transition-colors cursor-pointer"
                  onClick={() => onToggleMilestone(goal.id, milestone.id)}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      milestone.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-kintsugi-dark-600'
                    }`}
                  >
                    {milestone.completed && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span
                    className={`text-sm ${
                      milestone.completed
                        ? 'line-through text-kintsugi-dark-500 dark:theme-text-primary'
                        : 'text-kintsugi-dark-700 dark:theme-text-secondary'
                    }`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NewGoalModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: any) => Goal;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Goal['category']>('personal');
  const [priority, setPriority] = useState<Goal['priority']>('medium');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData = {
      title,
      description,
      category,
      priority,
      targetDate,
    };

    const newGoal = onCreate(goalData);

    // Add milestones
    milestones.filter(m => m.trim()).forEach(milestone => {
      addMilestone(newGoal.id, { title: milestone });
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-kintsugi-dark-900 dark:text-white">Create New Goal</h3>
          <button
            onClick={onClose}
            className="p-2 hover:theme-bg-primary-light dark:hover:bg-kintsugi-dark-700 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Goal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
              placeholder="e.g., Learn Spanish"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
              placeholder="What do you want to achieve?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Goal['category'])}
                className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
              >
                <option value="personal">Personal</option>
                <option value="professional">Professional</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="relationships">Relationships</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Goal['priority'])}
                className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              className="w-full px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-kintsugi-dark-700 dark:theme-text-secondary mb-1">
              Milestones (Optional)
            </label>
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={milestone}
                  onChange={(e) => {
                    const newMilestones = [...milestones];
                    newMilestones[index] = e.target.value;
                    setMilestones(newMilestones);
                  }}
                  className="flex-1 px-3 py-2 border theme-border-accent dark:border-kintsugi-dark-600 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white"
                  placeholder={`Milestone ${index + 1}`}
                />
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setMilestones(milestones.filter((_, i) => i !== index))}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMilestones([...milestones, ''])}
              className="text-sm theme-text-primary hover:text-kintsugi-gold-700 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Milestone
            </button>
          </div>

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
              className="flex-1 px-4 py-2 theme-bg-primary hover:bg-kintsugi-gold-700 text-white rounded-lg transition-colors font-medium"
            >
              Create Goal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
