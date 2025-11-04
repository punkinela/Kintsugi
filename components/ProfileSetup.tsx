'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/types';
import { User, Sparkles, Zap } from 'lucide-react';
import SimpleAvatarPicker from './SimpleAvatarPicker';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
  isEditing?: boolean;
  onCancel?: () => void;
}

const defaultProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '👤',
  avatarType: 'emoji',
  preferences: {
    theme: 'system',
    notifications: true,
  },
  theme: 'system',
  notifications: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ProfileSetup({ onComplete, initialProfile, isEditing = false, onCancel }: ProfileSetupProps) {
  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...defaultProfile,
    ...initialProfile,
  }));
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-kintsugi-gold-50 via-kintsugi-gold-100/50 to-kintsugi-gold-50/50 dark:from-kintsugi-dark-900 dark:via-kintsugi-dark-800 dark:to-kintsugi-dark-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-kintsugi-gold-100/30 dark:border-kintsugi-gold-900/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isEditing ? 'Edit Your Profile' : 'Welcome to Own Your Impact'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {isEditing ? 'Update your avatar and profile information' : 'A research-backed tool to track your wins, recognize bias, and advocate for your career growth'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center mb-6">
              <SimpleAvatarPicker
                currentAvatar={profile.avatar}
                currentAvatarType={profile.avatarType}
                onSelect={(avatar, type) => {
                  setProfile({ ...profile, avatar, avatarType: type });
                }}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What is your name? (Optional)
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 focus:ring-2 focus:ring-kintsugi-gold-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender Identity (Optional - helps personalize affirmations)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['woman', 'man', 'non-binary', 'prefer-not-to-say'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, gender: gender as any });
                    }}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      profile.gender === gender
                        ? 'border-kintsugi-gold-600 bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-800 dark:text-kintsugi-gold-200'
                        : 'border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 hover:border-kintsugi-gold-300 dark:hover:border-kintsugi-gold-700'
                    }`}
                  >
                    {gender.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What do you do? (Optional)
              </label>
              <input
                type="text"
                value={profile.profession || ''}
                onChange={(e) => {
                  setProfile({ ...profile, profession: e.target.value });
                }}
                placeholder="e.g., Software Engineer, Teacher, Entrepreneur"
                className="w-full px-4 py-3 rounded-xl border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 focus:ring-2 focus:ring-kintsugi-gold-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Ethnicity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ethnicity/Cultural Background (Optional - helps personalize affirmations)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['asian', 'black', 'hispanic', 'indigenous', 'white', 'multiracial', 'prefer-not-to-say'].map((ethnicity) => (
                  <button
                    key={ethnicity}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, ethnicity: ethnicity as any });
                    }}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                      profile.ethnicity === ethnicity
                        ? 'border-kintsugi-gold-600 bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-800 dark:text-kintsugi-gold-200'
                        : 'border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 hover:border-kintsugi-gold-300 dark:hover:border-kintsugi-gold-700'
                    }`}
                  >
                    {ethnicity.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Privacy First:</strong> Your information stays on your device and is never sent to external servers.
                We use it only to personalize insights and help you articulate your unique value proposition.
              </p>
            </div>

            {/* Submit/Save Button */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {isEditing ? 'Save Changes' : 'Start Tracking My Impact'}
            </button>

            {/* Cancel Button (when editing) or Skip Button (when first setup) */}
            {isEditing && onCancel ? (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-3 transition-colors border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onComplete({
                  ...defaultProfile,
                  name: 'Guest',
                  email: `guest-${Math.random().toString(36).substring(2, 10)}@kintsugi.app`,
                  preferences: {
                    ...defaultProfile.preferences,
                    theme: 'system',
                    notifications: false,
                  },
                  theme: 'system',
                  notifications: false,
                  skipped: true,
                })}
                className="w-full text-kintsugi-gold-700/70 dark:text-kintsugi-gold-400/70 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-200 font-medium py-2 transition-colors"
              >
                Skip for now
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
