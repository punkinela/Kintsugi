/**
 * Export Utilities for Kintsugi
 *
 * Provides professional export functionality for:
 * - PDF documents
 * - Word documents (.docx)
 * - CSV spreadsheets
 * - Markdown files
 */

import { JournalEntry } from '@/types/engagement';

// ============================================
// CSV EXPORT
// ============================================

export function exportToCSV(entries: JournalEntry[], filename?: string): void {
  // CSV Headers
  const headers = ['Date', 'Category', 'Mood', 'Accomplishment', 'Reflection', 'Tags'];

  // Build CSV content
  const rows = entries.map(entry => [
    new Date(entry.date).toLocaleDateString(),
    entry.category || '',
    entry.mood || '',
    `"${(entry.accomplishment || '').replace(/"/g, '""')}"`, // Escape quotes
    `"${(entry.reflection || '').replace(/"/g, '""')}"`,
    (entry.tags || []).join('; ')
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Download
  downloadFile(
    csvContent,
    filename || `kintsugi-journal-${new Date().toISOString().split('T')[0]}.csv`,
    'text/csv'
  );
}

// ============================================
// MARKDOWN EXPORT
// ============================================

export function exportToMarkdown(entries: JournalEntry[], options?: {
  includeMetadata?: boolean;
  includeStats?: boolean;
}): void {
  const { includeMetadata = true, includeStats = true } = options || {};

  let markdown = '# My Accomplishments Journal\n\n';

  // Metadata
  if (includeMetadata) {
    markdown += `**Generated:** ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}\n\n`;
    markdown += `**Total Entries:** ${entries.length}\n\n`;
  }

  // Stats
  if (includeStats && entries.length > 0) {
    const categories = new Set(entries.map(e => e.category).filter(Boolean));
    const moods = entries.map(e => e.mood).filter(Boolean);
    const greatMoods = moods.filter(m => m === 'great' || m === 'good').length;
    const moodPercentage = moods.length > 0 ? Math.round((greatMoods / moods.length) * 100) : 0;

    markdown += '## Summary\n\n';
    markdown += `- **Categories:** ${categories.size}\n`;
    markdown += `- **Positive Mood:** ${moodPercentage}% of logged entries\n`;
    markdown += `- **Date Range:** ${new Date(entries[entries.length - 1].date).toLocaleDateString()} to ${new Date(entries[0].date).toLocaleDateString()}\n\n`;
    markdown += '---\n\n';
  }

  // Entries
  markdown += '## Entries\n\n';

  entries.forEach((entry, index) => {
    markdown += `### ${index + 1}. ${entry.category || 'General'}\n\n`;
    markdown += `**Date:** ${new Date(entry.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}\n\n`;

    if (entry.mood) {
      const moodEmoji = {
        'great': '😄',
        'good': '🙂',
        'neutral': '😐',
        'challenging': '😟',
        'difficult': '😔'
      }[entry.mood] || '😐';
      markdown += `**Mood:** ${moodEmoji} ${entry.mood}\n\n`;
    }

    markdown += `**Accomplishment:**\n\n${entry.accomplishment}\n\n`;

    if (entry.reflection) {
      markdown += `**Reflection:**\n\n${entry.reflection}\n\n`;
    }

    if (entry.tags && entry.tags.length > 0) {
      markdown += `**Tags:** ${entry.tags.map(t => `#${t}`).join(' ')}\n\n`;
    }

    markdown += '---\n\n';
  });

  downloadFile(
    markdown,
    `kintsugi-journal-${new Date().toISOString().split('T')[0]}.md`,
    'text/markdown'
  );
}

// ============================================
// PDF EXPORT (Browser-based HTML to PDF)
// ============================================

export function exportToPDF(entries: JournalEntry[], title?: string): void {
  // Create a printable HTML document
  const htmlContent = generatePrintableHTML(entries, title);

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export as PDF');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print dialog
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

function generatePrintableHTML(entries: JournalEntry[], title?: string): string {
  const documentTitle = title || 'My Accomplishments Journal';
  const totalEntries = entries.length;
  const dateRange = entries.length > 0
    ? `${new Date(entries[entries.length - 1].date).toLocaleDateString()} - ${new Date(entries[0].date).toLocaleDateString()}`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${documentTitle}</title>
  <style>
    @page {
      margin: 2cm;
      size: letter;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      margin: 0;
      padding: 20px;
    }

    .header {
      text-align: center;
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #d97706;
      margin: 0 0 10px 0;
      font-size: 28pt;
    }

    .header .subtitle {
      color: #666;
      font-size: 12pt;
    }

    .stats {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-around;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 24pt;
      font-weight: bold;
      color: #d97706;
    }

    .stat-label {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
    }

    .entry {
      page-break-inside: avoid;
      margin-bottom: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      background: white;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f59e0b;
    }

    .entry-number {
      font-size: 14pt;
      font-weight: bold;
      color: #d97706;
    }

    .entry-date {
      font-size: 10pt;
      color: #666;
    }

    .category-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 9pt;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .mood-badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 9pt;
      margin-left: 8px;
    }

    .accomplishment {
      font-size: 11pt;
      margin-bottom: 12px;
      line-height: 1.7;
    }

    .reflection {
      font-size: 10pt;
      font-style: italic;
      color: #555;
      background: #f9fafb;
      padding: 12px;
      border-left: 3px solid #d97706;
      margin-top: 12px;
      border-radius: 4px;
    }

    .tags {
      margin-top: 12px;
      font-size: 9pt;
    }

    .tag {
      display: inline-block;
      background: #f3f4f6;
      color: #374151;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 6px;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 9pt;
      color: #999;
    }

    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${documentTitle}</h1>
    <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</div>
  </div>

  <div class="stats">
    <div class="stat-item">
      <div class="stat-value">${totalEntries}</div>
      <div class="stat-label">Total Entries</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${new Set(entries.map(e => e.category).filter(Boolean)).size}</div>
      <div class="stat-label">Categories</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${dateRange ? dateRange.split(' - ').length : 0}</div>
      <div class="stat-label">Time Span</div>
    </div>
  </div>

  ${entries.map((entry, index) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-number">#${index + 1}</span>
          ${entry.category ? `<span class="category-badge">${entry.category}</span>` : ''}
          ${entry.mood ? `<span class="mood-badge">${getMoodEmoji(entry.mood)} ${entry.mood}</span>` : ''}
        </div>
        <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
      </div>

      <div class="accomplishment">
        <strong>Accomplishment:</strong><br>
        ${entry.accomplishment}
      </div>

      ${entry.reflection ? `
        <div class="reflection">
          <strong>Reflection:</strong><br>
          ${entry.reflection}
        </div>
      ` : ''}

      ${entry.tags && entry.tags.length > 0 ? `
        <div class="tags">
          ${entry.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div class="footer">
    Created with Kintsugi - Own Your Impact<br>
    ${dateRange ? `Period: ${dateRange}` : ''}
  </div>
</body>
</html>
  `;
}

function getMoodEmoji(mood: string): string {
  const moodEmojis: Record<string, string> = {
    'great': '😄',
    'good': '🙂',
    'neutral': '😐',
    'challenging': '😟',
    'difficult': '😔'
  };
  return moodEmojis[mood] || '😐';
}

// ============================================
// WORD DOCUMENT EXPORT (RTF format for compatibility)
// ============================================

export function exportToWord(entries: JournalEntry[], title?: string): void {
  const documentTitle = title || 'My Accomplishments Journal';

  // Create RTF content (compatible with Word, Google Docs, etc.)
  let rtfContent = `{\\rtf1\\ansi\\deff0\n`;
  rtfContent += `{\\fonttbl{\\f0 Calibri;}{\\f1 Arial;}}\n`;
  rtfContent += `{\\colortbl;\\red217\\green119\\blue6;\\red102\\green64\\blue14;\\red107\\green114\\blue128;}\n`;

  // Title
  rtfContent += `\\pard\\qc\\f0\\fs36\\b ${documentTitle}\\b0\\fs24\\par\n`;
  rtfContent += `\\pard\\qc\\fs20 Generated on ${new Date().toLocaleDateString()}\\fs24\\par\\par\n`;

  // Stats
  rtfContent += `\\pard\\sb200\\sa200\\par\n`;
  rtfContent += `Total Entries: ${entries.length}\\par\n`;
  rtfContent += `Categories: ${new Set(entries.map(e => e.category).filter(Boolean)).size}\\par\n`;
  rtfContent += `\\par\\par\n`;

  // Entries
  entries.forEach((entry, index) => {
    rtfContent += `\\pard\\sb200\\sa100\\par\n`;
    rtfContent += `\\fs28\\b\\cf1 ${index + 1}. ${entry.category || 'General'}\\b0\\fs24\\cf0\\par\n`;
    rtfContent += `\\fs20\\cf3 ${new Date(entry.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}\\cf0\\fs24\\par\n`;

    if (entry.mood) {
      rtfContent += `\\fs20 Mood: ${entry.mood}\\fs24\\par\n`;
    }

    rtfContent += `\\par\n`;
    rtfContent += `\\b Accomplishment:\\b0\\par\n`;
    rtfContent += `${escapeRTF(entry.accomplishment)}\\par\n`;

    if (entry.reflection) {
      rtfContent += `\\par\n`;
      rtfContent += `\\b Reflection:\\b0\\par\n`;
      rtfContent += `\\i ${escapeRTF(entry.reflection)}\\i0\\par\n`;
    }

    if (entry.tags && entry.tags.length > 0) {
      rtfContent += `\\par\n`;
      rtfContent += `\\fs20 Tags: ${entry.tags.map(t => `#${t}`).join(' ')}\\fs24\\par\n`;
    }

    rtfContent += `\\par\\par\n`;
  });

  rtfContent += `}\n`;

  downloadFile(
    rtfContent,
    `kintsugi-journal-${new Date().toISOString().split('T')[0]}.rtf`,
    'application/rtf'
  );
}

function escapeRTF(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\n/g, '\\par\n');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// BATCH EXPORT
// ============================================

export function exportAll(entries: JournalEntry[], formats: ('csv' | 'markdown' | 'pdf' | 'word')[]): void {
  formats.forEach(format => {
    switch (format) {
      case 'csv':
        exportToCSV(entries);
        break;
      case 'markdown':
        exportToMarkdown(entries);
        break;
      case 'pdf':
        exportToPDF(entries);
        break;
      case 'word':
        exportToWord(entries);
        break;
    }
  });
}
