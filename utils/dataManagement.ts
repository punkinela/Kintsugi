// Data Export/Import utilities for Own Your Impact
// Handles backup, restore, and data portability

import { UserProfile } from '@/types';
import { EngagementData } from '@/types/engagement';
import { UserFeedback } from '@/types/analytics';

export interface ExportData {
  version: string;
  exportDate: string;
  userProfile: UserProfile | null;
  engagement: EngagementData;
  feedback: UserFeedback[];
  customAffirmations: any[];
  settings: {
    theme: string;
    notifications: boolean;
    reminderTime?: string;
  };
}

// Get all user data from localStorage
export function getAllUserData(): ExportData {
  const userProfile = localStorage.getItem('kintsugiUser');
  const engagement = localStorage.getItem('kintsugi_engagement');
  const feedback = localStorage.getItem('userFeedback');
  const customAffirmations = localStorage.getItem('customAffirmations');

  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    userProfile: userProfile ? JSON.parse(userProfile) : null,
    engagement: engagement ? JSON.parse(engagement) : {
      lastVisit: new Date().toISOString(),
      visitCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      affirmationsViewed: 0,
      insightsViewed: 0,
      viewedInsightIds: [],
      achievements: [],
      journalEntries: [],
      reminderEnabled: false,
    },
    feedback: feedback ? JSON.parse(feedback) : [],
    customAffirmations: customAffirmations ? JSON.parse(customAffirmations) : [],
    settings: {
      theme: userProfile ? JSON.parse(userProfile).theme : 'system',
      notifications: userProfile ? JSON.parse(userProfile).notifications : false,
      reminderTime: engagement ? JSON.parse(engagement).reminderTime : undefined,
    }
  };
}

// Export data as JSON file
export function exportDataAsJSON(): void {
  const data = getAllUserData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `own-your-impact-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export journal entries as CSV
export function exportJournalAsCSV(): void {
  const data = getAllUserData();
  const entries = data.engagement.journalEntries;

  if (entries.length === 0) {
    alert('No journal entries to export');
    return;
  }

  // CSV Headers
  const headers = ['Date', 'Accomplishment', 'Reflection', 'Category', 'Tags', 'Mood', 'Favorite'];

  // CSV Rows
  const rows = entries.map(entry => [
    new Date(entry.date).toLocaleDateString(),
    `"${entry.accomplishment.replace(/"/g, '""')}"`,
    `"${(entry.reflection || '').replace(/"/g, '""')}"`,
    entry.category || '',
    (entry.tags || []).join('; '),
    entry.mood || '',
    entry.favorite ? 'Yes' : 'No'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `journal-entries-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data from JSON file
export function importDataFromJSON(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string) as ExportData;

        // Validate data structure
        if (!importedData.version || !importedData.exportDate) {
          throw new Error('Invalid backup file format');
        }

        // Confirm before overwriting
        const confirmed = window.confirm(
          `This will replace your current data with the backup from ${new Date(importedData.exportDate).toLocaleDateString()}. Continue?`
        );

        if (!confirmed) {
          resolve(false);
          return;
        }

        // Restore data to localStorage
        if (importedData.userProfile) {
          localStorage.setItem('kintsugiUser', JSON.stringify(importedData.userProfile));
        }

        if (importedData.engagement) {
          localStorage.setItem('kintsugi_engagement', JSON.stringify(importedData.engagement));
        }

        if (importedData.feedback && importedData.feedback.length > 0) {
          localStorage.setItem('userFeedback', JSON.stringify(importedData.feedback));
        }

        if (importedData.customAffirmations && importedData.customAffirmations.length > 0) {
          localStorage.setItem('customAffirmations', JSON.stringify(importedData.customAffirmations));
        }

        resolve(true);
      } catch (error) {
        console.error('Import error:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// Clear all user data (with confirmation)
export function clearAllData(): boolean {
  const confirmed = window.confirm(
    'Are you sure you want to delete ALL your data? This cannot be undone.\n\nConsider exporting your data first as a backup.'
  );

  if (!confirmed) return false;

  const doubleConfirm = window.confirm(
    'This is your last chance! All your journal entries, achievements, and profile data will be permanently deleted.'
  );

  if (!doubleConfirm) return false;

  // Clear all related localStorage items
  localStorage.removeItem('kintsugiUser');
  localStorage.removeItem('kintsugi_engagement');
  localStorage.removeItem('userFeedback');
  localStorage.removeItem('customAffirmations');
  localStorage.removeItem('userId');
  localStorage.removeItem('lastFeedbackDate');

  return true;
}

// Get data statistics
export function getDataStats() {
  const data = getAllUserData();

  return {
    journalEntries: data.engagement.journalEntries.length,
    achievements: data.engagement.achievements.length,
    currentStreak: data.engagement.currentStreak,
    longestStreak: data.engagement.longestStreak,
    affirmationsViewed: data.engagement.affirmationsViewed,
    insightsViewed: data.engagement.insightsViewed,
    feedbackSubmitted: data.feedback.length,
    memberSince: data.userProfile?.createdAt
      ? new Date(data.userProfile.createdAt).toLocaleDateString()
      : 'Unknown',
    lastBackup: localStorage.getItem('lastBackupDate')
      ? new Date(localStorage.getItem('lastBackupDate')!).toLocaleDateString()
      : 'Never'
  };
}

// Save backup timestamp
export function markBackupCompleted(): void {
  localStorage.setItem('lastBackupDate', new Date().toISOString());
}
