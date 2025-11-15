// Backup and Restore Utility for Kintsugi User Data

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    engagementData?: any;
    gamificationData?: any;
    userProfile?: any;
    ai_feature_usage?: any;
    kintsugi_user_questions?: any;
    theme?: any;
    themeColor?: any;
    onboardingComplete?: any;
    lastBackupDate?: string;
    [key: string]: any; // Allow additional keys
  };
}

/**
 * Export all Kintsugi data from localStorage
 */
export function exportAllData(): BackupData {
  const data: BackupData['data'] = {};

  // List of all Kintsugi localStorage keys
  const kintsugiKeys = [
    'engagementData',
    'gamificationData',
    'userProfile',
    'ai_feature_usage',
    'kintsugi_user_questions',
    'theme',
    'themeColor',
    'onboardingComplete',
    'lastBackupDate'
  ];

  // Export each key
  kintsugiKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        // Try to parse as JSON
        data[key] = JSON.parse(value);
      } catch {
        // If not JSON, store as string
        data[key] = value;
      }
    }
  });

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    data
  };
}

/**
 * Import and restore Kintsugi data to localStorage
 */
export function importAllData(backupData: BackupData): {
  success: boolean;
  message: string;
  restoredKeys: string[];
} {
  const restoredKeys: string[] = [];

  try {
    // Validate backup data
    if (!backupData || !backupData.data) {
      return {
        success: false,
        message: 'Invalid backup file format',
        restoredKeys: []
      };
    }

    // Restore each key
    Object.entries(backupData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        restoredKeys.push(key);
      }
    });

    // Update last restore date
    localStorage.setItem('lastRestoreDate', new Date().toISOString());

    return {
      success: true,
      message: `Successfully restored ${restoredKeys.length} data items`,
      restoredKeys
    };
  } catch (error) {
    return {
      success: false,
      message: `Error restoring data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      restoredKeys
    };
  }
}

/**
 * Download backup data as JSON file (default format)
 */
export function downloadBackup(): void {
  downloadBackupAsJSON();
}

/**
 * Download backup as JSON (complete data preservation)
 */
export function downloadBackupAsJSON(): void {
  const backupData = exportAllData();
  const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.json`;

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json'
  });

  downloadFile(blob, filename);

  // Update last backup date
  localStorage.setItem('lastBackupDate', new Date().toISOString());
}

/**
 * Download backup as CSV (journal entries only, for spreadsheet analysis)
 */
export function downloadBackupAsCSV(): void {
  const backupData = exportAllData();
  const engagementData = backupData.data.engagementData;

  if (!engagementData || !engagementData.journalEntries || engagementData.journalEntries.length === 0) {
    alert('No journal entries to export. Your backup is empty.');
    return;
  }

  const entries = engagementData.journalEntries;

  // CSV Headers
  const headers = ['Date', 'Category', 'Mood', 'Accomplishment', 'Reflection', 'Tags', 'Impact Score'];

  // Build CSV content
  const rows = entries.map((entry: any) => [
    new Date(entry.date).toLocaleDateString(),
    entry.category || '',
    entry.mood || '',
    `"${(entry.accomplishment || '').replace(/"/g, '""')}"`, // Escape quotes
    `"${(entry.reflection || '').replace(/"/g, '""')}"`,
    (entry.tags || []).join('; '),
    entry.impactScore || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row: string[]) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.csv`;

  downloadFile(blob, filename);

  // Update last backup date
  localStorage.setItem('lastBackupDate', new Date().toISOString());
}

/**
 * Download backup as Markdown (human-readable format)
 */
export function downloadBackupAsMarkdown(): void {
  const backupData = exportAllData();
  const engagementData = backupData.data.engagementData;

  let markdown = '# Kintsugi Data Backup\n\n';

  // Metadata
  markdown += `**Backup Date:** ${new Date(backupData.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n\n`;
  markdown += `**Version:** ${backupData.version}\n\n`;
  markdown += '---\n\n';

  // User Profile
  if (backupData.data.userProfile) {
    const profile = backupData.data.userProfile;
    markdown += '## User Profile\n\n';
    if (profile.name) markdown += `**Name:** ${profile.name}\n`;
    if (profile.profession) markdown += `**Profession:** ${profile.profession}\n`;
    if (profile.yearsOfExperience) markdown += `**Years of Experience:** ${profile.yearsOfExperience}\n`;
    markdown += '\n---\n\n';
  }

  // Gamification Stats
  if (backupData.data.gamificationData) {
    const gamification = backupData.data.gamificationData;
    markdown += '## Progress & Achievements\n\n';
    if (gamification.totalXP) markdown += `**Total XP:** ${gamification.totalXP}\n`;
    if (gamification.level) markdown += `**Level:** ${gamification.level}\n`;
    if (gamification.currentStreak) markdown += `**Current Streak:** ${gamification.currentStreak} days 🔥\n`;
    markdown += '\n---\n\n';
  }

  // Journal Entries
  if (engagementData && engagementData.journalEntries && engagementData.journalEntries.length > 0) {
    const entries = engagementData.journalEntries;
    markdown += `## Journal Entries (${entries.length} total)\n\n`;

    entries.forEach((entry: any, index: number) => {
      markdown += `### ${index + 1}. ${entry.category || 'General'}\n\n`;
      markdown += `**Date:** ${new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}\n\n`;

      if (entry.mood) {
        const moodEmojis: Record<string, string> = {
          'great': '😄',
          'good': '🙂',
          'neutral': '😐',
          'challenging': '😟',
          'difficult': '😔'
        };
        const moodEmoji = moodEmojis[entry.mood] || '😐';
        markdown += `**Mood:** ${moodEmoji} ${entry.mood}\n\n`;
      }

      markdown += `**Accomplishment:**\n\n${entry.accomplishment}\n\n`;

      if (entry.reflection) {
        markdown += `**Reflection:**\n\n${entry.reflection}\n\n`;
      }

      if (entry.tags && entry.tags.length > 0) {
        markdown += `**Tags:** ${entry.tags.map((t: string) => `#${t}`).join(' ')}\n\n`;
      }

      if (entry.impactScore) {
        markdown += `**Impact Score:** ${entry.impactScore}/100\n\n`;
      }

      markdown += '---\n\n';
    });
  }

  // Settings
  if (backupData.data.theme || backupData.data.themeColor) {
    markdown += '## Settings\n\n';
    if (backupData.data.theme) markdown += `**Theme:** ${backupData.data.theme}\n`;
    if (backupData.data.themeColor) markdown += `**Theme Color:** ${backupData.data.themeColor}\n`;
    markdown += '\n---\n\n';
  }

  markdown += '\n*Generated by Kintsugi - Own Your Impact*\n';

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.md`;

  downloadFile(blob, filename);

  // Update last backup date
  localStorage.setItem('lastBackupDate', new Date().toISOString());
}

/**
 * Helper function to download a file
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Get last backup date
 */
export function getLastBackupDate(): Date | null {
  const lastBackup = localStorage.getItem('lastBackupDate');
  return lastBackup ? new Date(lastBackup) : null;
}

/**
 * Get days since last backup
 */
export function getDaysSinceLastBackup(): number | null {
  const lastBackup = getLastBackupDate();
  if (!lastBackup) return null;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastBackup.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if backup is recommended (7+ days since last backup)
 */
export function shouldRecommendBackup(): boolean {
  const daysSince = getDaysSinceLastBackup();

  // Recommend backup if:
  // 1. Never backed up before
  // 2. 7+ days since last backup
  return daysSince === null || daysSince >= 7;
}

/**
 * Get backup summary statistics
 */
export function getBackupSummary(): {
  lastBackup: Date | null;
  daysSinceBackup: number | null;
  totalDataItems: number;
  estimatedSize: string;
} {
  const data = exportAllData();
  const dataSize = new Blob([JSON.stringify(data)]).size;

  return {
    lastBackup: getLastBackupDate(),
    daysSinceBackup: getDaysSinceLastBackup(),
    totalDataItems: Object.keys(data.data).length,
    estimatedSize: formatBytes(dataSize)
  };
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Restore from uploaded file
 */
export function restoreFromFile(file: File): Promise<{
  success: boolean;
  message: string;
  restoredKeys: string[];
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content) as BackupData;
        const result = importAllData(backupData);
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          message: `Error reading backup file: ${error instanceof Error ? error.message : 'Invalid file format'}`,
          restoredKeys: []
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Error reading file',
        restoredKeys: []
      });
    };

    reader.readAsText(file);
  });
}
