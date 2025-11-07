'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Monitor, Eye, Zap, Type, Check, RotateCcw } from 'lucide-react';
import {
  getCurrentTheme,
  setCurrentTheme,
  getCurrentColorMode,
  setCurrentColorMode,
  getCurrentAccessibilityMode,
  setCurrentAccessibilityMode,
  getThemeList,
  type ThemeId,
  type ColorMode,
  type AccessibilityMode,
} from '@/utils/themes';

export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(getCurrentTheme());
  const [colorMode, setColorModeState] = useState<ColorMode>(getCurrentColorMode());
  const [accessibilityMode, setAccessibilityModeState] = useState<AccessibilityMode>(getCurrentAccessibilityMode());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleThemeChange = (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    setCurrentTheme(themeId);
  };

  const handleColorModeChange = (mode: ColorMode) => {
    setColorModeState(mode);
    setCurrentColorMode(mode);
  };

  const handleAccessibilityModeChange = (mode: AccessibilityMode) => {
    setAccessibilityModeState(mode);
    setCurrentAccessibilityMode(mode);
  };

  const handleResetAll = () => {
    // Reset to Kintsugi Gold theme
    handleThemeChange('gold');
    // Reset to system color mode
    handleColorModeChange('system');
    // Reset to default accessibility
    handleAccessibilityModeChange('default');
  };

  const themes = getThemeList();

  const colorModes: { mode: ColorMode; name: string; icon: React.ReactNode }[] = [
    { mode: 'light', name: 'Light', icon: <Sun className="h-5 w-5" /> },
    { mode: 'dark', name: 'Dark', icon: <Moon className="h-5 w-5" /> },
    { mode: 'system', name: 'System', icon: <Monitor className="h-5 w-5" /> },
  ];

  const accessibilityModes: { mode: AccessibilityMode; name: string; description: string; icon: React.ReactNode }[] = [
    {
      mode: 'default',
      name: 'Default',
      description: 'Standard experience',
      icon: <Eye className="h-5 w-5" />,
    },
    {
      mode: 'high-contrast',
      name: 'High Contrast',
      description: 'Slightly bolder text (subtle change)',
      icon: <Eye className="h-5 w-5" />,
    },
    {
      mode: 'reduced-motion',
      name: 'Reduced Motion',
      description: 'Minimize animations',
      icon: <Zap className="h-5 w-5" />,
    },
    {
      mode: 'large-text',
      name: 'Large Text',
      description: 'Bigger fonts for easier reading',
      icon: <Type className="h-5 w-5" />,
    },
  ];

  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kintsugi-gold-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading appearance settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Reset Button */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white flex items-center gap-2">
              <Palette className="h-6 w-6 theme-text-primary" />
              Appearance & Accessibility
            </h2>
            <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-400 mt-1">
              Personalize with themes, color modes, and accessibility options
            </p>
          </div>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2.5 theme-btn-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </motion.button>
        </div>
      </div>

      {/* Color Themes */}
      <div>
        <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4">
          Color Theme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                selectedTheme === theme.id
                  ? 'theme-border-primary theme-bg-primary-light'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-kintsugi-dark-800 hover:theme-border-accent'
              }`}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-4 right-4 w-6 h-6 theme-bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{theme.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {theme.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {theme.description}
                  </p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="flex gap-2 mt-4">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  style={{ backgroundColor: theme.colors.light.primary }}
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  style={{ backgroundColor: theme.colors.light.secondary }}
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  style={{ backgroundColor: theme.colors.light.accent }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Mode */}
      <div>
        <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4">
          Color Mode
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {colorModes.map((mode) => (
            <button
              key={mode.mode}
              onClick={() => handleColorModeChange(mode.mode)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                colorMode === mode.mode
                  ? 'theme-border-primary theme-bg-primary-light'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-kintsugi-dark-800 hover:theme-border-accent'
              }`}
            >
              {mode.icon}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {mode.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Options */}
      <div>
        <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-white mb-4">
          Accessibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accessibilityModes.map((mode) => (
            <motion.button
              key={mode.mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAccessibilityModeChange(mode.mode)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                accessibilityMode === mode.mode
                  ? 'theme-border-primary theme-bg-primary-light'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-kintsugi-dark-800 hover:theme-border-accent'
              }`}
            >
              {accessibilityMode === mode.mode && (
                <div className="absolute top-4 right-4 w-6 h-6 theme-bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              <div className="mt-1">{mode.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {mode.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {mode.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          💡 Personalization Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Choose a color theme that resonates with you</li>
          <li>• Light mode: Best for daytime use and bright environments</li>
          <li>• Dark mode: Easy on the eyes in low-light conditions</li>
          <li>• System mode: Automatically matches your device preferences</li>
          <li>• Accessibility modes improve usability for specific needs</li>
          <li>• All settings are saved locally and persist across sessions</li>
        </ul>
      </div>
    </div>
  );
}
