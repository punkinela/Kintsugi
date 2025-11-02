'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Own Your Impact - Track Your Wins & Advocate for Yourself</title>
        <meta name="description" content="A professional tool to track your accomplishments, recognize bias, and advocate for your career growth." />
      </head>
      <body className="m-0 p-0 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
