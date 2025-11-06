'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Download } from 'lucide-react';
import { getBackupStats, downloadBackup, startAutoBackup } from '@/utils/autoBackup';

/**
 * Backup Status Indicator
 *
 * Shows backup status and allows manual backup download
 */
export default function BackupStatusIndicator() {
  const [stats, setStats] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Start auto-backup system
    startAutoBackup();

    // Update stats
    updateStats();

    // Update stats every minute
    const interval = setInterval(updateStats, 60000);

    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    setStats(getBackupStats());
  };

  const handleDownload = () => {
    downloadBackup();
    setTimeout(updateStats, 100);
  };

  if (!stats) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[9998]">
      {/* Status Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all"
        style={{
          backgroundColor: '#16a34a',
          color: '#ffffff',
          padding: '8px',
          borderRadius: '9999px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          border: 'none',
        }}
        title={`Last backup: ${stats.lastBackup}`}
      >
        {stats.totalBackups > 0 ? (
          <Cloud className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
        ) : (
          <CloudOff className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
        )}
      </button>

      {/* Details Panel */}
      {showDetails && (
        <div
          className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-64 border-2 border-green-500"
          style={{
            position: 'absolute',
            bottom: '100%',
            right: '0',
            marginBottom: '8px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
            width: '256px',
            border: '2px solid #16a34a',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <h3
            className="font-bold text-green-600 mb-3 flex items-center gap-2"
            style={{ fontWeight: 'bold', marginBottom: '12px', color: '#16a34a' }}
          >
            <Cloud className="h-5 w-5" />
            Backup Status
          </h3>

          <div className="space-y-2 text-sm" style={{ fontSize: '14px' }}>
            <div>
              <span className="text-gray-600" style={{ color: '#4b5563' }}>Total Backups:</span>
              <span className="float-right font-semibold" style={{ float: 'right', fontWeight: '600' }}>
                {stats.totalBackups}
              </span>
            </div>
            <div>
              <span className="text-gray-600" style={{ color: '#4b5563' }}>Last Backup:</span>
              <span className="float-right font-semibold text-xs" style={{ float: 'right', fontWeight: '600', fontSize: '12px' }}>
                {stats.lastBackup}
              </span>
            </div>
            <div>
              <span className="text-gray-600" style={{ color: '#4b5563' }}>Last Download:</span>
              <span className="float-right font-semibold text-xs" style={{ float: 'right', fontWeight: '600', fontSize: '12px' }}>
                {stats.lastDownload}
              </span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold"
            style={{
              width: '100%',
              marginTop: '16px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Download className="h-4 w-4" />
            Download Backup
          </button>

          <p
            className="text-xs text-gray-500 mt-2 text-center"
            style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}
          >
            Auto-saves every 5 minutes
          </p>
        </div>
      )}
    </div>
  );
}
