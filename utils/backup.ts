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
 * Download backup data as JSON file
 */
export function downloadBackup(): void {
  const backupData = exportAllData();
  const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.json`;

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);

  // Update last backup date
  localStorage.setItem('lastBackupDate', new Date().toISOString());
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
