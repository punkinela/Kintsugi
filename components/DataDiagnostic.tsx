'use client';

import { useState, useEffect } from 'react';
import { Search, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function DataDiagnostic() {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const runDiagnostic = () => {
    setIsScanning(true);

    setTimeout(() => {
      if (typeof window === 'undefined') return;

      const results: any = {
        timestamp: new Date().toISOString(),
        keys: [],
        data: {},
        issues: [],
        suggestions: [],
      };

      // Scan all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          results.keys.push(key);

          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);
              results.data[key] = {
                type: typeof parsed,
                isArray: Array.isArray(parsed),
                size: value.length,
                preview: parsed,
              };

              // Check for journal entries
              if (key.includes('engagement') || key.includes('journal')) {
                if (parsed.journalEntries) {
                  results.journalEntriesFound = parsed.journalEntries.length;
                  results.journalEntriesLocation = key;
                }
              }
            }
          } catch (e) {
            results.data[key] = {
              type: 'string',
              size: localStorage.getItem(key)?.length || 0,
              parseError: true,
            };
          }
        }
      }

      // Check for common issues
      const engagement = results.data['kintsugi_engagement'];
      if (!engagement) {
        results.issues.push('kintsugi_engagement key not found - this explains missing stats');
        results.suggestions.push('Initialize engagement data by creating a journal entry');
      } else {
        if (!engagement.preview.journalEntries || engagement.preview.journalEntries.length === 0) {
          results.issues.push('No journal entries found in kintsugi_engagement');
          results.suggestions.push('Journal entries may be stored under a different key');
        }
        if (!engagement.preview.currentStreak || engagement.preview.currentStreak === 0) {
          results.issues.push('Streak is 0 - may need to be recalculated');
        }
        if (!engagement.preview.achievements || engagement.preview.achievements.length === 0) {
          results.issues.push('No achievements unlocked yet');
          results.suggestions.push('Achievements will unlock as you use the app');
        }
      }

      // Check for orphaned data
      const journalKeys = results.keys.filter((k: string) => k.includes('journal'));
      if (journalKeys.length > 1) {
        results.issues.push(`Multiple journal-related keys found: ${journalKeys.join(', ')}`);
        results.suggestions.push('Data may be fragmented across multiple keys');
      }

      setDiagnosticResults(results);
      setIsScanning(false);
    }, 500);
  };

  const fixEngagementData = () => {
    if (typeof window === 'undefined') return;

    const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');

    // Initialize missing fields
    const fixed = {
      lastVisit: engagement.lastVisit || new Date().toISOString(),
      visitCount: engagement.visitCount || 1,
      currentStreak: engagement.currentStreak || 0,
      longestStreak: engagement.longestStreak || 0,
      affirmationsViewed: engagement.affirmationsViewed || 0,
      insightsViewed: engagement.insightsViewed || 0,
      viewedInsightIds: engagement.viewedInsightIds || [],
      achievements: engagement.achievements || [],
      journalEntries: engagement.journalEntries || [],
      reminderEnabled: engagement.reminderEnabled || false,
      level: engagement.level || 1,
      xp: engagement.xp || 0,
      aiAnalysesRun: engagement.aiAnalysesRun || 0,
      patternsDetected: engagement.patternsDetected || 0,
      exportsCreated: engagement.exportsCreated || 0,
    };

    localStorage.setItem('kintsugi_engagement', JSON.stringify(fixed));
    alert('Engagement data initialized! Please refresh the page.');
    runDiagnostic();
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  if (!diagnosticResults) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 theme-border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-5 w-5 theme-text-primary" />
            Data Diagnostic
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Scan localStorage to identify data issues
          </p>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={isScanning}
          className="inline-flex items-center px-4 py-2 theme-bg-primary-light dark:bg-theme-primary/30 text-theme-primary dark:theme-text-secondary rounded-lg hover:bg-theme-accent dark:hover:bg-theme-primary/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Again'}
        </button>
      </div>

      {/* Issues */}
      {diagnosticResults.issues.length > 0 && (
        <div className="theme-bg-primary-light dark:bg-yellow-900/20 border border-yellow-200 dark:theme-border-primary rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" />
            Issues Found ({diagnosticResults.issues.length})
          </h4>
          <ul className="space-y-1">
            {diagnosticResults.issues.map((issue: string, i: number) => (
              <li key={i} className="text-sm text-yellow-800 dark:text-yellow-300">• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {diagnosticResults.suggestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4" />
            Suggestions
          </h4>
          <ul className="space-y-1">
            {diagnosticResults.suggestions.map((suggestion: string, i: number) => (
              <li key={i} className="text-sm text-blue-800 dark:text-blue-300">• {suggestion}</li>
            ))}
          </ul>
          <button
            onClick={fixEngagementData}
            className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Initialize Engagement Data
          </button>
        </div>
      )}

      {/* Data Summary */}
      <div className="bg-white dark:bg-kintsugi-dark-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Data Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Keys:</span>
            <span className="font-medium text-gray-900 dark:text-white">{diagnosticResults.keys.length}</span>
          </div>
          {diagnosticResults.journalEntriesFound !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Journal Entries:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {diagnosticResults.journalEntriesFound} (in {diagnosticResults.journalEntriesLocation})
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Scan Time:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(diagnosticResults.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Raw Data Details */}
      <details className="bg-gray-50 dark:bg-kintsugi-dark-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
          View Raw Data (Advanced)
        </summary>
        <div className="mt-3 space-y-3">
          {Object.entries(diagnosticResults.data).map(([key, value]: [string, any]) => (
            <div key={key} className="bg-white dark:bg-kintsugi-dark-800 rounded p-3 border border-gray-200 dark:border-gray-600">
              <div className="font-mono text-xs theme-text-primary dark:theme-text-secondary mb-2">
                {key}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Type: {value.type} {value.isArray && '(Array)'} | Size: {value.size} bytes
              </div>
              {value.parseError && (
                <div className="text-xs text-red-600 dark:text-red-400">Failed to parse as JSON</div>
              )}
              {value.preview && (
                <pre className="text-xs bg-gray-100 dark:bg-kintsugi-dark-900 p-2 rounded overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(value.preview, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </details>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-kintsugi-dark-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const data = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
              console.log('Engagement Data:', data);
              alert('Engagement data logged to console (F12)');
            }}
            className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-kintsugi-dark-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-kintsugi-dark-500"
          >
            Log to Console
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(diagnosticResults, null, 2);
              navigator.clipboard.writeText(data);
              alert('Diagnostic results copied to clipboard');
            }}
            className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-kintsugi-dark-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-kintsugi-dark-500"
          >
            Copy Report
          </button>
        </div>
      </div>
    </div>
  );
}
