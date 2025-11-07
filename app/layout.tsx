'use client';

import { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import EmergencyResetButton from '@/components/EmergencyResetButton';
import BackupStatusIndicator from '@/components/BackupStatusIndicator';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <title>Own Your Impact - Track Your Wins & Advocate for Yourself</title>
        <meta name="description" content="A professional tool to track your accomplishments, recognize bias, and advocate for your career growth." />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Own Your Impact" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Own Your Impact" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#d97706" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="m-0 p-0 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <ThemeProvider>
          {children}
          <PWAInstallPrompt />
          <BackupStatusIndicator />
          <EmergencyResetButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
