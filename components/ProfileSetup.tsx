'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/types';
import { User, Sparkles } from 'lucide-react';
import SimpleAvatarPicker from './SimpleAvatarPicker';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
  isEditing?: boolean;
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

export default function ProfileSetup({ onComplete, initialProfile, isEditing = false }: ProfileSetupProps) {
  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...defaultProfile,
    ...initialProfile,
  }));
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProfileSetup: Submitting profile:', profile);
    onComplete(profile);
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-kintsugi-gold-500 to-kintsugi-gold-700 rounded-full mb-4 shadow-lg">
              <User className="w-8 h-8 text-kintsugi-gold-50" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-2">
              {isEditing ? 'Edit Your Profile' : 'Welcome to Kintsugi'}
            </h1>
            <p className="text-kintsugi-gold-800/80 dark:text-kintsugi-gold-200/80 text-lg">
              {isEditing ? 'Update your avatar and profile information' : 'Celebrate your unique journey with golden affirmations'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center mb-6">
              <SimpleAvatarPicker
                currentAvatar={profile.avatar}
                currentAvatarType={profile.avatarType}
                onSelect={(avatar, type) => {
                  console.log('Avatar selected:', avatar, type);
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
                    onClick={() => setProfile({ ...profile, gender: gender as any })}
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
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                placeholder="e.g., Software Engineer, Teacher, Entrepreneur"
                className="w-full px-4 py-3 rounded-xl border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 focus:ring-2 focus:ring-kintsugi-gold-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Privacy Note */}
            <div className="bg-kintsugi-gold-50/50 dark:bg-kintsugi-gold-900/10 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/30 rounded-xl p-4">
              <p className="text-sm text-kintsugi-gold-800/80 dark:text-kintsugi-gold-200/80">
                <strong>Privacy Note:</strong> Your information is stored locally on your device and never sent to external servers. 
                It is used only to personalize your affirmations.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 text-kintsugi-gold-50 font-medium rounded-xl hover:from-kintsugi-gold-700 hover:to-kintsugi-gold-900 focus:outline-none focus:ring-2 focus:ring-kintsugi-gold-400 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-kintsugi-gold-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start My Journey
            </button>

            {/* Skip Button */}
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
          </form>
        </div>
      </motion.div>
    </div>
  );
}
