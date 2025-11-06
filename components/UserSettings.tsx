'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Monitor, User, Mail, Smile } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { UserProfile } from '@/types';

interface UserSettingsProps {
  user: UserProfile | null;
  onUserUpdate?: (user: UserProfile) => void;
}

export default function UserSettings({ user, onUserUpdate }: UserSettingsProps) {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.preferences?.notifications ?? true);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(theme);

  // Update theme when it changes
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);

    // Update user profile
    if (user) {
      const updatedUser = {
        ...user,
        theme: newTheme,
        preferences: {
          ...user.preferences,
          theme: newTheme,
        },
      };
      localStorage.setItem('kintsugiUser', JSON.stringify(updatedUser));
      onUserUpdate?.(updatedUser);
    }
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);

    // Update user profile
    if (user) {
      const updatedUser = {
        ...user,
        notifications: newValue,
        preferences: {
          ...user.preferences,
          notifications: newValue,
        },
      };
      localStorage.setItem('kintsugiUser', JSON.stringify(updatedUser));
      onUserUpdate?.(updatedUser);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-gradient-to-br from-kintsugi-gold-50 to-white dark:from-kintsugi-dark-800 dark:to-kintsugi-dark-900 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-kintsugi-gold-600 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white">
              Profile
            </h3>
            <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-300">
              Your account information
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-kintsugi-dark-900/50 rounded-lg">
            <div className="text-3xl">{user?.avatar || '👤'}</div>
            <div className="flex-1">
              <p className="font-medium text-kintsugi-dark-900 dark:text-white">{user?.name || 'Guest'}</p>
              <p className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400">{user?.email || 'No email set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-4 uppercase tracking-wide">
          Appearance
        </h4>

        <div className="space-y-3">
          <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-300 mb-3">
            Choose your preferred theme
          </p>

          <div className="grid grid-cols-3 gap-3">
            {/* Light Theme */}
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedTheme === 'light'
                  ? 'border-kintsugi-gold-500 bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/20'
                  : 'border-kintsugi-gold-200 dark:border-kintsugi-dark-700 hover:border-kintsugi-gold-300 dark:hover:border-kintsugi-gold-800'
              }`}
            >
              <div className={`p-3 rounded-lg ${selectedTheme === 'light' ? 'bg-kintsugi-gold-500' : 'bg-kintsugi-gold-100 dark:bg-kintsugi-dark-700'}`}>
                <Sun className={`h-6 w-6 ${selectedTheme === 'light' ? 'text-white' : 'text-kintsugi-gold-600 dark:text-kintsugi-gold-400'}`} />
              </div>
              <span className={`text-sm font-medium ${selectedTheme === 'light' ? 'text-kintsugi-gold-700 dark:text-kintsugi-gold-300' : 'text-kintsugi-dark-600 dark:text-kintsugi-gold-400'}`}>
                Light
              </span>
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedTheme === 'dark'
                  ? 'border-kintsugi-gold-500 bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/20'
                  : 'border-kintsugi-gold-200 dark:border-kintsugi-dark-700 hover:border-kintsugi-gold-300 dark:hover:border-kintsugi-gold-800'
              }`}
            >
              <div className={`p-3 rounded-lg ${selectedTheme === 'dark' ? 'bg-kintsugi-gold-500' : 'bg-kintsugi-gold-100 dark:bg-kintsugi-dark-700'}`}>
                <Moon className={`h-6 w-6 ${selectedTheme === 'dark' ? 'text-white' : 'text-kintsugi-gold-600 dark:text-kintsugi-gold-400'}`} />
              </div>
              <span className={`text-sm font-medium ${selectedTheme === 'dark' ? 'text-kintsugi-gold-700 dark:text-kintsugi-gold-300' : 'text-kintsugi-dark-600 dark:text-kintsugi-gold-400'}`}>
                Dark
              </span>
            </button>

            {/* System Theme */}
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedTheme === 'system'
                  ? 'border-kintsugi-gold-500 bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/20'
                  : 'border-kintsugi-gold-200 dark:border-kintsugi-dark-700 hover:border-kintsugi-gold-300 dark:hover:border-kintsugi-gold-800'
              }`}
            >
              <div className={`p-3 rounded-lg ${selectedTheme === 'system' ? 'bg-kintsugi-gold-500' : 'bg-kintsugi-gold-100 dark:bg-kintsugi-dark-700'}`}>
                <Monitor className={`h-6 w-6 ${selectedTheme === 'system' ? 'text-white' : 'text-kintsugi-gold-600 dark:text-kintsugi-gold-400'}`} />
              </div>
              <span className={`text-sm font-medium ${selectedTheme === 'system' ? 'text-kintsugi-gold-700 dark:text-kintsugi-gold-300' : 'text-kintsugi-dark-600 dark:text-kintsugi-gold-400'}`}>
                System
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 border border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
        <h4 className="text-sm font-semibold text-kintsugi-dark-900 dark:text-white mb-4 uppercase tracking-wide">
          Notifications
        </h4>

        <button
          onClick={handleNotificationsToggle}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 dark:bg-purple-600 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-kintsugi-dark-900 dark:text-white">
                Push Notifications
              </div>
              <div className="text-xs text-kintsugi-dark-600 dark:text-kintsugi-gold-400">
                {notificationsEnabled ? 'Receive updates and reminders' : 'Notifications are disabled'}
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className={`relative w-14 h-7 rounded-full transition-colors ${
            notificationsEnabled ? 'bg-kintsugi-gold-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}>
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
              animate={{
                x: notificationsEnabled ? 28 : 0,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
        </button>

        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Note: Browser notifications require permission. You may need to enable them in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}
