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
 * Download backup as TXT (plain text format, human-readable)
 */
export function downloadBackupAsTXT(): void {
  const backupData = exportAllData();
  const engagementData = backupData.data.engagementData;

  let textContent = 'KINTSUGI DATA BACKUP\n';
  textContent += '='.repeat(50) + '\n\n';

  // Metadata
  textContent += `Backup Date: ${new Date(backupData.timestamp).toLocaleString()}\n`;
  textContent += `Version: ${backupData.version}\n\n`;
  textContent += '='.repeat(50) + '\n\n';

  // User Profile
  if (backupData.data.userProfile) {
    const profile = backupData.data.userProfile;
    textContent += 'USER PROFILE\n';
    textContent += '-'.repeat(50) + '\n';
    if (profile.name) textContent += `Name: ${profile.name}\n`;
    if (profile.profession) textContent += `Profession: ${profile.profession}\n`;
    if (profile.yearsOfExperience) textContent += `Years of Experience: ${profile.yearsOfExperience}\n`;
    textContent += '\n';
  }

  // Gamification Stats
  if (backupData.data.gamificationData) {
    const gamification = backupData.data.gamificationData;
    textContent += 'PROGRESS & ACHIEVEMENTS\n';
    textContent += '-'.repeat(50) + '\n';
    if (gamification.totalXP) textContent += `Total XP: ${gamification.totalXP}\n`;
    if (gamification.level) textContent += `Level: ${gamification.level}\n`;
    if (gamification.currentStreak) textContent += `Current Streak: ${gamification.currentStreak} days\n`;
    textContent += '\n';
  }

  // Journal Entries
  if (engagementData && engagementData.journalEntries && engagementData.journalEntries.length > 0) {
    const entries = engagementData.journalEntries;
    textContent += `JOURNAL ENTRIES (${entries.length} total)\n`;
    textContent += '='.repeat(50) + '\n\n';

    entries.forEach((entry: any, index: number) => {
      textContent += `Entry ${index + 1}: ${entry.category || 'General'}\n`;
      textContent += '-'.repeat(50) + '\n';
      textContent += `Date: ${new Date(entry.date).toLocaleDateString()}\n`;

      if (entry.mood) {
        textContent += `Mood: ${entry.mood}\n`;
      }

      textContent += `\nAccomplishment:\n${entry.accomplishment}\n`;

      if (entry.reflection) {
        textContent += `\nReflection:\n${entry.reflection}\n`;
      }

      if (entry.tags && entry.tags.length > 0) {
        textContent += `\nTags: ${entry.tags.join(', ')}\n`;
      }

      if (entry.impactScore) {
        textContent += `\nImpact Score: ${entry.impactScore}/100\n`;
      }

      textContent += '\n' + '='.repeat(50) + '\n\n';
    });
  }

  textContent += '\nGenerated by Kintsugi - Own Your Impact\n';

  const blob = new Blob([textContent], { type: 'text/plain' });
  const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.txt`;

  downloadFile(blob, filename);

  // Update last backup date
  localStorage.setItem('lastBackupDate', new Date().toISOString());
}

/**
 * Download backup as PDF (formatted document)
 */
export function downloadBackupAsPDF(): void {
  // Dynamic import to avoid SSR issues
  import('jspdf').then(({ jsPDF }) => {
    const backupData = exportAllData();
    const engagementData = backupData.data.engagementData;

    const doc = new jsPDF();
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;

    // Helper to add new page if needed
    const checkPageBreak = (neededSpace: number = 10) => {
      if (yPosition + neededSpace > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Kintsugi Data Backup', 20, yPosition);
    yPosition += 15;

    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Backup Date: ${new Date(backupData.timestamp).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    // User Profile
    if (backupData.data.userProfile) {
      checkPageBreak(30);
      const profile = backupData.data.userProfile;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('User Profile', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (profile.name) {
        doc.text(`Name: ${profile.name}`, 25, yPosition);
        yPosition += 6;
      }
      if (profile.profession) {
        doc.text(`Profession: ${profile.profession}`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 5;
    }

    // Journal Entries
    if (engagementData && engagementData.journalEntries && engagementData.journalEntries.length > 0) {
      checkPageBreak(20);
      const entries = engagementData.journalEntries;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Journal Entries (${entries.length} total)`, 20, yPosition);
      yPosition += 10;

      entries.forEach((entry: any, index: number) => {
        checkPageBreak(40);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${entry.category || 'General'}`, 20, yPosition);
        yPosition += 7;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(entry.date).toLocaleDateString()}`, 25, yPosition);
        yPosition += 6;

        if (entry.mood) {
          doc.text(`Mood: ${entry.mood}`, 25, yPosition);
          yPosition += 6;
        }

        // Accomplishment (with text wrapping)
        doc.setFont('helvetica', 'bold');
        doc.text('Accomplishment:', 25, yPosition);
        yPosition += 5;
        doc.setFont('helvetica', 'normal');
        const accomplishmentLines = doc.splitTextToSize(entry.accomplishment, 160);
        accomplishmentLines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 3;

        // Reflection
        if (entry.reflection) {
          checkPageBreak(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Reflection:', 25, yPosition);
          yPosition += 5;
          doc.setFont('helvetica', 'normal');
          const reflectionLines = doc.splitTextToSize(entry.reflection, 160);
          reflectionLines.forEach((line: string) => {
            checkPageBreak(5);
            doc.text(line, 25, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        }

        yPosition += 5;
      });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated by Kintsugi - Own Your Impact', 20, pageHeight - 10);
      doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - 40, pageHeight - 10);
    }

    const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

    // Update last backup date
    localStorage.setItem('lastBackupDate', new Date().toISOString());
  });
}

/**
 * Download backup as DOCX-compatible format (RTF that Word can open)
 */
export function downloadBackupAsDOCX(): void {
  const backupData = exportAllData();
  const engagementData = backupData.data.engagementData;

  // Create RTF content (Rich Text Format - opens in Word)
  let rtfContent = '{\\rtf1\\ansi\\deff0\n';
  rtfContent += '{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n';
  rtfContent += '{\\colortbl;\\red0\\green0\\blue0;\\red64\\green64\\blue64;}\n';

  // Title
  rtfContent += '\\f0\\fs32\\b Kintsugi Data Backup\\b0\\fs20\\par\n';
  rtfContent += `\\fs18 Backup Date: ${new Date(backupData.timestamp).toLocaleDateString()}\\par\\par\n`;

  // User Profile
  if (backupData.data.userProfile) {
    const profile = backupData.data.userProfile;
    rtfContent += '\\fs24\\b User Profile\\b0\\fs20\\par\n';
    if (profile.name) rtfContent += `Name: ${profile.name}\\par\n`;
    if (profile.profession) rtfContent += `Profession: ${profile.profession}\\par\n`;
    if (profile.yearsOfExperience) rtfContent += `Years of Experience: ${profile.yearsOfExperience}\\par\n`;
    rtfContent += '\\par\n';
  }

  // Gamification Stats
  if (backupData.data.gamificationData) {
    const gamification = backupData.data.gamificationData;
    rtfContent += '\\fs24\\b Progress & Achievements\\b0\\fs20\\par\n';
    if (gamification.totalXP) rtfContent += `Total XP: ${gamification.totalXP}\\par\n`;
    if (gamification.level) rtfContent += `Level: ${gamification.level}\\par\n`;
    if (gamification.currentStreak) rtfContent += `Current Streak: ${gamification.currentStreak} days\\par\n`;
    rtfContent += '\\par\n';
  }

  // Journal Entries
  if (engagementData && engagementData.journalEntries && engagementData.journalEntries.length > 0) {
    const entries = engagementData.journalEntries;
    rtfContent += `\\fs24\\b Journal Entries (${entries.length} total)\\b0\\fs20\\par\\par\n`;

    entries.forEach((entry: any, index: number) => {
      rtfContent += `\\fs22\\b ${index + 1}. ${entry.category || 'General'}\\b0\\fs20\\par\n`;
      rtfContent += `Date: ${new Date(entry.date).toLocaleDateString()}\\par\n`;

      if (entry.mood) {
        rtfContent += `Mood: ${entry.mood}\\par\n`;
      }

      // Escape special RTF characters
      const escapeRTF = (text: string) => {
        return text
          .replace(/\\/g, '\\\\')
          .replace(/{/g, '\\{')
          .replace(/}/g, '\\}')
          .replace(/\n/g, '\\par\n');
      };

      rtfContent += `\\par\\b Accomplishment:\\b0\\par\n${escapeRTF(entry.accomplishment)}\\par\\par\n`;

      if (entry.reflection) {
        rtfContent += `\\b Reflection:\\b0\\par\n${escapeRTF(entry.reflection)}\\par\\par\n`;
      }

      if (entry.tags && entry.tags.length > 0) {
        rtfContent += `Tags: ${entry.tags.join(', ')}\\par\n`;
      }

      if (entry.impactScore) {
        rtfContent += `Impact Score: ${entry.impactScore}/100\\par\n`;
      }

      rtfContent += '\\par\\par\n';
    });
  }

  rtfContent += '\\par\\fs16\\i Generated by Kintsugi - Own Your Impact\\i0\\par\n';
  rtfContent += '}';

  const blob = new Blob([rtfContent], { type: 'application/rtf' });
  const filename = `kintsugi-backup-${new Date().toISOString().split('T')[0]}.docx`;

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
