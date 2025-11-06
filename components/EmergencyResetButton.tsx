'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * Emergency Reset Button
 *
 * Always visible button to reset appearance settings if user gets stuck.
 * Positioned in bottom-right corner, works even in high-contrast mode.
 */
export default function EmergencyResetButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    // Only reset appearance settings, NOT user data
    localStorage.removeItem('kintsugi_accessibility');
    localStorage.removeItem('kintsugi_theme');
    localStorage.removeItem('kintsugi_color_mode');

    // Reload to apply changes
    window.location.reload();
  };

  if (showConfirm) {
    return (
      <div
        className="fixed bottom-4 right-4 z-[99999] flex flex-col gap-2"
        style={{
          // Inline styles to ensure visibility even if CSS breaks
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 99999,
        }}
      >
        <div
          className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-2xl border-4 border-white max-w-xs"
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '4px solid #ffffff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <p className="font-bold mb-2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Reset Appearance?
          </p>
          <p className="text-sm mb-3" style={{ fontSize: '14px', marginBottom: '12px' }}>
            This will reset theme and accessibility settings. Your data will NOT be deleted.
          </p>
          <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleReset}
              className="flex-1 bg-white text-red-600 px-3 py-2 rounded font-bold"
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                color: '#dc2626',
                padding: '8px 12px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-red-700 text-white px-3 py-2 rounded font-bold"
              style={{
                flex: 1,
                backgroundColor: '#b91c1c',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="fixed bottom-4 right-4 z-[99999] bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-2xl border-4 border-white transition-transform hover:scale-110"
      style={{
        // Inline styles to ensure visibility even if CSS breaks
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 99999,
        backgroundColor: '#dc2626',
        color: '#ffffff',
        padding: '12px',
        borderRadius: '9999px',
        border: '4px solid #ffffff',
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}
      title="Emergency Reset - Click if screen is unreadable"
      aria-label="Emergency reset appearance settings"
    >
      <RotateCcw className="h-6 w-6" style={{ width: '24px', height: '24px' }} />
    </button>
  );
}
