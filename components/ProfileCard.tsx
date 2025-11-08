'use client';

import { User, Briefcase, Users, MapPin, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/types';
import ProgressRing from './ProgressRing';

interface ProfileCardProps {
  user: UserProfile;
  onEdit: () => void;
}

export default function ProfileCard({ user, onEdit }: ProfileCardProps) {
  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const total = 5; // name, avatar, gender, profession, ethnicity

    if (user.name && user.name !== 'Guest') completed++;
    if (user.avatar && user.avatar !== '👤') completed++;
    if (user.gender) completed++;
    if (user.profession) completed++;
    if (user.ethnicity) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();
  const isComplete = completionPercentage === 100;

  const formatLabel = (value: string) => {
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border theme-border-light dark:theme-border-primary/50 overflow-hidden">
      {/* Header with completion status */}
      <div className={`p-6 ${isComplete ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'theme-gradient-to-r'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 theme-text-primary" />
            Your Profile
          </h3>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-2 bg-white dark:bg-kintsugi-dark-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-kintsugi-dark-600 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Completion indicator */}
        <div className="flex items-center gap-6">
          <ProgressRing
            progress={completionPercentage}
            size={100}
            strokeWidth={8}
            color={isComplete ? '#10B981' : '#D4AF37'}
            backgroundColor={isComplete ? '#D1FAE5' : '#FEF3C7'}
            showPercentage={true}
          />
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                Profile Completion
              </h4>
              {!isComplete && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  Complete your profile for personalized affirmations
                </p>
              )}
              {isComplete && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4" />
                  Your profile is complete!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="p-6 space-y-6">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-theme-secondary to-theme-primary flex items-center justify-center text-4xl shadow-lg">
            {user.avatar || '👤'}
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.name || 'Guest User'}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profession */}
          <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 theme-text-primary" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Profession
              </span>
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">
              {user.profession || 'Not specified'}
            </p>
          </div>

          {/* Gender Identity */}
          <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 theme-text-primary" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Gender Identity
              </span>
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">
              {user.gender ? formatLabel(user.gender) : 'Not specified'}
            </p>
          </div>

          {/* Ethnicity */}
          <div className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-4 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 theme-text-primary" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ethnicity/Cultural Background
              </span>
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">
              {user.ethnicity ? formatLabel(user.ethnicity) : 'Not specified'}
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-blue-900 dark:text-blue-200">🔒 Privacy First:</strong> All your information is stored locally on your device and never sent to external servers. We use it only to personalize your experience.
          </p>
        </div>
      </div>
    </div>
  );
}
