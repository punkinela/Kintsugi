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
      <body style={{ 
        margin: 0, 
        padding: '1rem',
        backgroundColor: '#fffbeb',
        minHeight: '100vh',
        color: '#1e1e2e'
      }}>
        <ThemeProvider>
          <div>
            <h1 style={{
              color: '#b45309',
              textAlign: 'center',
              margin: '2rem 0',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>Kintsugi</h1>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
