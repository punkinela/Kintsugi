'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemePreference = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ThemePreference;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'kintsugi-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ThemePreference>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = useCallback((): ThemePreference => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Apply theme class to document element
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Determine the actual theme to apply
    let themeToApply: ThemePreference;
    if (newTheme === 'system') {
      themeToApply = getSystemTheme();
    } else {
      themeToApply = newTheme;
    }
    
    // Apply the theme class
    root.classList.add(themeToApply);
    root.style.colorScheme = themeToApply;
    
    // Update resolved theme
    setResolvedTheme(themeToApply);
    
    // Update theme color meta tag
    const themeColor = themeToApply === 'dark' ? '#0c0a09' : '#fef9c3';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    
    return themeToApply;
  }, [getSystemTheme]);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme from localStorage or use system preference
    const savedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system';
    
    // Set the theme state
    setThemeState(savedTheme);
    
    // Apply the theme
    applyTheme(savedTheme);
    
    // Mark as mounted
    setMounted(true);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, applyTheme]);

  // Set theme and save to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
    
    // Dispatch event for any components that might be listening
    const event = new CustomEvent('themeChanged', { detail: { theme: newTheme } });
    window.dispatchEvent(event);
  }, [applyTheme]);

  // Toggle between light, dark, and system
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  }, [theme, setTheme]);

  // Don't render anything until we're mounted on the client
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDarkMode: resolvedTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook for components that need to react to theme changes
export function useThemeChangeListener() {
  const [theme, setTheme] = useState<Theme>('system');
  
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: Theme }>;
      setTheme(customEvent.detail.theme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);
  
  return theme;
}
