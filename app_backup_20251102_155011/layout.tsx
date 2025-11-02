'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
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
