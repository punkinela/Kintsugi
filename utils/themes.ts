/**
 * Theme System for Kintsugi
 *
 * Provides multiple color themes and accessibility options
 */

export type ThemeId = 'gold' | 'professional' | 'energetic' | 'calm' | 'bold' | 'elegant';
export type ColorMode = 'light' | 'dark' | 'system';
export type AccessibilityMode = 'default' | 'high-contrast' | 'reduced-motion' | 'large-text';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

// ============================================
// THEME DEFINITIONS
// ============================================

export const themes: Record<ThemeId, Theme> = {
  gold: {
    id: 'gold',
    name: 'Kintsugi Gold',
    description: 'Warm and inspiring, perfect for daily reflection',
    icon: '✨',
    colors: {
      light: {
        primary: '#d97706',
        primaryLight: '#fef3c7',
        primaryDark: '#92400e',
        secondary: '#f59e0b',
        accent: '#fbbf24',
        background: '#ffffff',
        surface: '#fffbeb',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fde68a',
        gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      },
      dark: {
        primary: '#fbbf24',
        primaryLight: '#fef3c7',
        primaryDark: '#78350f',
        secondary: '#f59e0b',
        accent: '#fde68a',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#78350f',
        gradient: 'linear-gradient(135deg, #78350f, #92400e)',
      },
    },
  },

  professional: {
    id: 'professional',
    name: 'Professional Blue',
    description: 'Clean and focused, ideal for serious work',
    icon: '💼',
    colors: {
      light: {
        primary: '#2563eb',
        primaryLight: '#dbeafe',
        primaryDark: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#f0f9ff',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#bfdbfe',
        gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
      },
      dark: {
        primary: '#60a5fa',
        primaryLight: '#dbeafe',
        primaryDark: '#1e3a8a',
        secondary: '#3b82f6',
        accent: '#93c5fd',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#1e40af',
        gradient: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
      },
    },
  },

  energetic: {
    id: 'energetic',
    name: 'Energetic Purple',
    description: 'Vibrant and creative, for innovative thinking',
    icon: '⚡',
    colors: {
      light: {
        primary: '#9333ea',
        primaryLight: '#f3e8ff',
        primaryDark: '#6b21a8',
        secondary: '#a855f7',
        accent: '#c084fc',
        background: '#ffffff',
        surface: '#faf5ff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e9d5ff',
        gradient: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
      },
      dark: {
        primary: '#c084fc',
        primaryLight: '#f3e8ff',
        primaryDark: '#581c87',
        secondary: '#a855f7',
        accent: '#d8b4fe',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#6b21a8',
        gradient: 'linear-gradient(135deg, #581c87, #6b21a8)',
      },
    },
  },

  calm: {
    id: 'calm',
    name: 'Calm Green',
    description: 'Peaceful and balanced, for mindful reflection',
    icon: '🌿',
    colors: {
      light: {
        primary: '#059669',
        primaryLight: '#d1fae5',
        primaryDark: '#065f46',
        secondary: '#10b981',
        accent: '#34d399',
        background: '#ffffff',
        surface: '#f0fdf4',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#a7f3d0',
        gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      },
      dark: {
        primary: '#34d399',
        primaryLight: '#d1fae5',
        primaryDark: '#064e3b',
        secondary: '#10b981',
        accent: '#6ee7b7',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#065f46',
        gradient: 'linear-gradient(135deg, #064e3b, #065f46)',
      },
    },
  },

  bold: {
    id: 'bold',
    name: 'Bold Red',
    description: 'Powerful and confident, for ambitious goals',
    icon: '🔥',
    colors: {
      light: {
        primary: '#dc2626',
        primaryLight: '#fee2e2',
        primaryDark: '#991b1b',
        secondary: '#ef4444',
        accent: '#f87171',
        background: '#ffffff',
        surface: '#fef2f2',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fecaca',
        gradient: 'linear-gradient(135deg, #fee2e2, #fecaca)',
      },
      dark: {
        primary: '#f87171',
        primaryLight: '#fee2e2',
        primaryDark: '#7f1d1d',
        secondary: '#ef4444',
        accent: '#fca5a5',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#991b1b',
        gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
      },
    },
  },

  elegant: {
    id: 'elegant',
    name: 'Elegant Rose',
    description: 'Sophisticated and graceful, for thoughtful moments',
    icon: '🌸',
    colors: {
      light: {
        primary: '#db2777',
        primaryLight: '#fce7f3',
        primaryDark: '#9f1239',
        secondary: '#ec4899',
        accent: '#f472b6',
        background: '#ffffff',
        surface: '#fdf2f8',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#fbcfe8',
        gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
      },
      dark: {
        primary: '#f472b6',
        primaryLight: '#fce7f3',
        primaryDark: '#831843',
        secondary: '#ec4899',
        accent: '#f9a8d4',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#9f1239',
        gradient: 'linear-gradient(135deg, #831843, #9f1239)',
      },
    },
  },
};

// ============================================
// STORAGE
// ============================================

const THEME_STORAGE_KEY = 'kintsugi_theme';
const COLOR_MODE_STORAGE_KEY = 'kintsugi_color_mode';
const ACCESSIBILITY_STORAGE_KEY = 'kintsugi_accessibility';

export function getCurrentTheme(): ThemeId {
  if (typeof window === 'undefined') return 'gold';

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && stored in themes) {
      return stored as ThemeId;
    }
  } catch {
    // Ignore
  }

  return 'gold';
}

export function setCurrentTheme(themeId: ThemeId): void {
  if (typeof window === 'undefined') return;

  console.log('🎨 Setting theme to:', themeId);
  localStorage.setItem(THEME_STORAGE_KEY, themeId);

  // Track theme changes for achievement
  const changes = parseInt(localStorage.getItem('kintsugi_theme_changes') || '0');
  localStorage.setItem('kintsugi_theme_changes', String(changes + 1));

  applyTheme(themeId);

  // CRITICAL FIX: Dispatch custom event to trigger IMMEDIATE React re-renders
  // This eliminates the 500ms polling delay and ensures navigation updates instantly
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { themeId } }));
}

export function getCurrentColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Ignore
  }

  return 'system';
}

export function setCurrentColorMode(mode: ColorMode): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  applyColorMode(mode);

  // CRITICAL FIX: Dispatch custom event to trigger IMMEDIATE React re-renders
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { mode } }));
}

export function getCurrentAccessibilityMode(): AccessibilityMode {
  if (typeof window === 'undefined') return 'default';

  try {
    const stored = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (stored && ['default', 'high-contrast', 'reduced-motion', 'large-text'].includes(stored)) {
      return stored as AccessibilityMode;
    }
  } catch {
    // Ignore
  }

  return 'default';
}

export function setCurrentAccessibilityMode(mode: AccessibilityMode): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, mode);
  applyAccessibilityMode(mode);
}

// ============================================
// APPLICATION
// ============================================

export function applyTheme(themeId: ThemeId): void {
  if (typeof window === 'undefined') return;

  console.log('✨ Applying theme:', themeId);

  const theme = themes[themeId];
  const colorMode = getCurrentColorMode();
  const isDark = colorMode === 'dark' || (colorMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const colors = isDark ? theme.colors.dark : theme.colors.light;

  console.log('🎨 Theme colors:', {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    mode: isDark ? 'dark' : 'light'
  });

  // Apply CSS variables
  document.documentElement.style.setProperty('--theme-primary', colors.primary);
  document.documentElement.style.setProperty('--theme-primary-light', colors.primaryLight);
  document.documentElement.style.setProperty('--theme-primary-dark', colors.primaryDark);
  document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
  document.documentElement.style.setProperty('--theme-accent', colors.accent);
  document.documentElement.style.setProperty('--theme-background', colors.background);
  document.documentElement.style.setProperty('--theme-surface', colors.surface);
  document.documentElement.style.setProperty('--theme-text', colors.text);
  document.documentElement.style.setProperty('--theme-text-secondary', colors.textSecondary);
  document.documentElement.style.setProperty('--theme-border', colors.border);
  document.documentElement.style.setProperty('--theme-gradient', colors.gradient);

  // Add theme class to body
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  document.body.classList.add(`theme-${themeId}`);

  console.log('✅ Theme applied successfully');
}

export function applyColorMode(mode: ColorMode): void {
  if (typeof window === 'undefined') return;

  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Reapply theme colors
  applyTheme(getCurrentTheme());
}

export function applyAccessibilityMode(mode: AccessibilityMode): void {
  if (typeof window === 'undefined') return;

  // Remove all accessibility classes
  document.body.classList.remove('accessibility-high-contrast', 'accessibility-reduced-motion', 'accessibility-large-text');

  switch (mode) {
    case 'high-contrast':
      document.body.classList.add('accessibility-high-contrast');
      break;
    case 'reduced-motion':
      document.body.classList.add('accessibility-reduced-motion');
      break;
    case 'large-text':
      document.body.classList.add('accessibility-large-text');
      break;
  }
}

// ============================================
// INITIALIZATION
// ============================================

export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  const themeId = getCurrentTheme();
  const colorMode = getCurrentColorMode();
  const accessibilityMode = getCurrentAccessibilityMode();

  applyTheme(themeId);
  applyColorMode(colorMode);
  applyAccessibilityMode(accessibilityMode);

  // Listen for system color scheme changes
  if (colorMode === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applyColorMode('system');
    });
  }
}

// ============================================
// UTILITIES
// ============================================

export function getThemeList(): Theme[] {
  return Object.values(themes);
}

export function getTheme(themeId: ThemeId): Theme {
  return themes[themeId];
}

export function getThemeColors(themeId: ThemeId, isDark: boolean): ThemeColors {
  return themes[themeId].colors[isDark ? 'dark' : 'light'];
}
