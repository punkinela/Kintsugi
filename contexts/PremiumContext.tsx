'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  isDevMode: boolean;
  toggleDevMode: () => void;
  hasAPIKey: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [hasAPIKey, setHasAPIKey] = useState(false);

  useEffect(() => {
    // Load dev mode from localStorage
    const savedDevMode = localStorage.getItem('kintsugi_dev_mode');
    setIsDevMode(savedDevMode === 'true');

    // Check if API key exists in environment
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    setHasAPIKey(!!apiKey && apiKey.length > 0);
  }, []);

  const toggleDevMode = () => {
    const newDevMode = !isDevMode;
    setIsDevMode(newDevMode);
    localStorage.setItem('kintsugi_dev_mode', String(newDevMode));
  };

  // For now, premium = dev mode OR has API key
  // Later: premium = hasValidSubscription || isDevMode
  const isPremium = isDevMode || hasAPIKey;

  return (
    <PremiumContext.Provider value={{ isPremium, isDevMode, toggleDevMode, hasAPIKey }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
