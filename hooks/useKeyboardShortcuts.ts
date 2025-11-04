// Keyboard shortcuts hook for Own Your Impact
// Provides global keyboard shortcuts for quick actions

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  enabled?: boolean;
}

// Default keyboard shortcuts
export const defaultShortcuts = {
  // Navigation
  HOME: { key: 'h', ctrl: true, description: 'Go to Home tab' },
  JOURNAL: { key: 'j', ctrl: true, description: 'Go to Journal tab' },
  INSIGHTS: { key: 'i', ctrl: true, description: 'Go to Insights tab' },

  // Actions
  NEW_ENTRY: { key: 'n', ctrl: true, description: 'New journal entry' },
  QUICK_CAPTURE: { key: 'k', ctrl: true, description: 'Quick capture' },
  SEARCH: { key: 'f', ctrl: true, description: 'Search journal entries' },

  // Data management
  EXPORT: { key: 's', ctrl: true, shift: true, description: 'Export data' },

  // UI
  THEME_TOGGLE: { key: 't', ctrl: true, description: 'Toggle theme' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInputField) return;

      shortcuts.forEach(shortcut => {
        // Skip disabled shortcuts
        if (shortcut.enabled === false) return;

        // Check if all modifier keys match
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        // Check if key matches (case insensitive)
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

// Format shortcut for display
export function formatShortcut(shortcut: {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}): string {
  const parts: string[] = [];

  // Detect Mac vs Windows/Linux
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? '' : '+');
}

// Get all keyboard shortcuts as a list
export function getAllShortcutsList(shortcuts: KeyboardShortcut[]): Array<{
  shortcut: string;
  description: string;
}> {
  return shortcuts
    .filter(s => s.enabled !== false)
    .map(s => ({
      shortcut: formatShortcut(s),
      description: s.description
    }));
}
