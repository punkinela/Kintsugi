'use client';

import { AlertCircle, CheckCircle, User, ArrowRight } from 'lucide-react';
import { UserProfile } from '@/types';
import { motion } from 'framer-motion';

interface ProfileCompletionReminderProps {
  user: UserProfile;
  onCompleteProfile: () => void;
}

export default function ProfileCompletionReminder({ user, onCompleteProfile }: ProfileCompletionReminderProps) {
  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = {
      name: user.name && user.name !== 'Guest',
      avatar: user.avatar && user.avatar !== '👤',
      gender: !!user.gender,
      profession: !!user.profession,
      ethnicity: !!user.ethnicity,
    };

    const completed = Object.values(fields).filter(Boolean).length;
    const total = Object.keys(fields).length;
    const percentage = Math.round((completed / total) * 100);

    return {
      percentage,
      completed,
      total,
      fields,
      isComplete: percentage === 100,
      isPartial: completed > 0 && completed < total,
    };
  };

  const completion = calculateCompletion();

  // Don't show if profile is complete
  if (completion.isComplete) {
    return null;
  }

  // Don't show if user explicitly skipped (name is 'Guest')
  if (user.skipped) {
    return null;
  }

  const missingFields = [];
  if (!completion.fields.name) missingFields.push('Name');
  if (!completion.fields.avatar) missingFields.push('Avatar');
  if (!completion.fields.gender) missingFields.push('Gender Identity');
  if (!completion.fields.profession) missingFields.push('Profession');
  if (!completion.fields.ethnicity) missingFields.push('Ethnicity');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800/50 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Complete Your Profile for Personalized Affirmations
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            You're {completion.percentage}% done! Add your {missingFields.slice(0, 2).join(' and ')}{missingFields.length > 2 ? ', and more' : ''} to get affirmations tailored specifically for you.
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Profile Completion</span>
              <span className="font-semibold">{completion.completed} of {completion.total} fields</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion.percentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>

          {/* Missing Fields */}
          {missingFields.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Missing fields:</p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onCompleteProfile}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <User className="h-4 w-4 mr-2" />
            Complete Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.currentTarget.closest('.profile-reminder')?.remove();
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
