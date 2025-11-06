/**
 * Automatic Backup System
 *
 * Automatically backs up user data to prevent data loss.
 * Features:
 * - Auto-save every 5 minutes
 * - Keeps 10 backup versions
 * - Periodic auto-download
 * - Backup status monitoring
 */

export interface BackupData {
  timestamp: string;
  version: number;
  data: {
    kintsugiUser: string | null;
    kintsugi_engagement: string | null;
    userProfile: string | null;
    customAffirmations: string | null;
    kintsugi_theme: string | null;
    kintsugi_color_mode: string | null;
    kintsugi_accessibility: string | null;
  };
}

const BACKUP_KEY_PREFIX = 'kintsugi_backup_';
const MAX_BACKUPS = 10;
const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes
const AUTO_DOWNLOAD_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

let autoSaveTimer: NodeJS.Timeout | null = null;
let autoDownloadTimer: NodeJS.Timeout | null = null;

/**
 * Get all current user data from localStorage
 */
export function getCurrentData(): BackupData['data'] {
  return {
    kintsugiUser: localStorage.getItem('kintsugiUser'),
    kintsugi_engagement: localStorage.getItem('kintsugi_engagement'),
    userProfile: localStorage.getItem('userProfile'),
    customAffirmations: localStorage.getItem('customAffirmations'),
    kintsugi_theme: localStorage.getItem('kintsugi_theme'),
    kintsugi_color_mode: localStorage.getItem('kintsugi_color_mode'),
    kintsugi_accessibility: localStorage.getItem('kintsugi_accessibility'),
  };
}

/**
 * Check if there's any actual user data (not just settings)
 */
export function hasUserData(data: BackupData['data']): boolean {
  return !!(data.kintsugiUser || data.kintsugi_engagement || data.userProfile || data.customAffirmations);
}

/**
 * Create a backup of current data
 */
export function createBackup(): BackupData | null {
  if (typeof window === 'undefined') return null;

  const data = getCurrentData();

  // Only create backup if there's actual user data
  if (!hasUserData(data)) {
    return null;
  }

  const backup: BackupData = {
    timestamp: new Date().toISOString(),
    version: Date.now(),
    data,
  };

  // Get existing backups
  const backups = getAllBackups();

  // Add new backup
  backups.push(backup);

  // Keep only last MAX_BACKUPS
  const trimmedBackups = backups.slice(-MAX_BACKUPS);

  // Save all backups
  trimmedBackups.forEach((b, index) => {
    localStorage.setItem(`${BACKUP_KEY_PREFIX}${index}`, JSON.stringify(b));
  });

  // Remove old backups
  for (let i = trimmedBackups.length; i < MAX_BACKUPS; i++) {
    localStorage.removeItem(`${BACKUP_KEY_PREFIX}${i}`);
  }

  // Update last backup time
  localStorage.setItem('kintsugi_last_backup', new Date().toISOString());

  return backup;
}

/**
 * Get all available backups
 */
export function getAllBackups(): BackupData[] {
  if (typeof window === 'undefined') return [];

  const backups: BackupData[] = [];

  for (let i = 0; i < MAX_BACKUPS; i++) {
    const stored = localStorage.getItem(`${BACKUP_KEY_PREFIX}${i}`);
    if (stored) {
      try {
        backups.push(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse backup:', e);
      }
    }
  }

  return backups.sort((a, b) => b.version - a.version);
}

/**
 * Restore data from a backup
 */
export function restoreFromBackup(backup: BackupData): void {
  if (typeof window === 'undefined') return;

  Object.entries(backup.data).forEach(([key, value]) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  });

  console.log('Data restored from backup:', new Date(backup.timestamp).toLocaleString());
}

/**
 * Download backup as JSON file
 */
export function downloadBackup(backup?: BackupData): void {
  const backupToDownload = backup || {
    timestamp: new Date().toISOString(),
    version: Date.now(),
    data: getCurrentData(),
  };

  const dataStr = JSON.stringify(backupToDownload, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Update last download time
  localStorage.setItem('kintsugi_last_download', new Date().toISOString());
}

/**
 * Import backup from uploaded file
 */
export function importBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string) as BackupData;
        restoreFromBackup(backup);

        // Create a backup of the imported data
        createBackup();

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Get last backup time
 */
export function getLastBackupTime(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kintsugi_last_backup');
}

/**
 * Start automatic backup system
 */
export function startAutoBackup(): void {
  if (typeof window === 'undefined') return;

  // Clear existing timers
  stopAutoBackup();

  // Auto-save every 5 minutes
  autoSaveTimer = setInterval(() => {
    createBackup();
  }, AUTO_SAVE_INTERVAL);

  // Auto-download every 24 hours
  autoDownloadTimer = setInterval(() => {
    const lastDownload = localStorage.getItem('kintsugi_last_download');
    const now = Date.now();

    // Only auto-download if more than 24 hours since last download
    if (!lastDownload || now - new Date(lastDownload).getTime() > AUTO_DOWNLOAD_INTERVAL) {
      const data = getCurrentData();
      if (hasUserData(data)) {
        downloadBackup();
      }
    }
  }, AUTO_DOWNLOAD_INTERVAL);

  // Create initial backup
  createBackup();
}

/**
 * Stop automatic backup system
 */
export function stopAutoBackup(): void {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
  if (autoDownloadTimer) {
    clearInterval(autoDownloadTimer);
    autoDownloadTimer = null;
  }
}

/**
 * Get backup statistics
 */
export function getBackupStats() {
  const backups = getAllBackups();
  const lastBackup = getLastBackupTime();
  const lastDownload = localStorage.getItem('kintsugi_last_download');

  return {
    totalBackups: backups.length,
    lastBackup: lastBackup ? new Date(lastBackup).toLocaleString() : 'Never',
    lastDownload: lastDownload ? new Date(lastDownload).toLocaleString() : 'Never',
    oldestBackup: backups.length > 0 ? new Date(backups[backups.length - 1].timestamp).toLocaleString() : 'N/A',
  };
}
