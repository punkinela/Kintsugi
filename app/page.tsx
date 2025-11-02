'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, Check, X, Menu, Bell, User, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

// Import components
import XPBar from '@/components/XPBar';
import ProfileSetup from '@/components/ProfileSetup';
import ThemeToggle from '@/components/ThemeToggle';
import BiasInsightModal from '@/components/BiasInsightModal';
import WeeklySummary from '@/components/WeeklySummary';
import EnhancedProgressJournal from '@/components/EnhancedProgressJournal';
import QuickCapture from '@/components/QuickCapture';
import type { BiasInsight, UserProfile } from '@/types';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBiasInsight, setShowBiasInsight] = useState(false);
  const [biasInsight, setBiasInsight] = useState<BiasInsight>({ 
    id: '1',
    title: 'Weekly Reflection',
    description: 'Your personalized insight will appear here',
    reflection: '',
    actionStep: 'Reflect on this insight in your journal',
    actionType: 'journal',
    research: []
  });
  const [biasInsightLoading, setBiasInsightLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('kintsugiUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setShowSetup(false);
        } else {
          setShowSetup(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setShowSetup(true);
      } finally {
        setLoading(false);
        setIsClient(true);
      }
    };

    loadUser();
  }, []);

  // Handle profile save
  const handleProfileSave = (profileData: { name: string; email?: string; emoji?: string; theme?: 'light' | 'dark' | 'system' }) => {
    const newUser: UserProfile = {
      id: '1',
      name: profileData.name,
      email: profileData.email || '',
      avatar: profileData.emoji || '👤',
      avatarType: 'emoji',
      preferences: {
        theme: profileData.theme || 'system',
        notifications: true,
      },
      theme: profileData.theme || 'system',
      notifications: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('kintsugiUser', JSON.stringify(newUser));
    setUser(newUser);
    setShowSetup(false);
  };

  // Handle skip profile setup
  const handleSkipSetup = () => {
    const defaultUser: UserProfile = {
      id: '1',
      name: 'Guest',
      email: '',
      avatar: '👤',
      avatarType: 'emoji',
      preferences: {
        theme: 'system',
        notifications: true,
      },
      theme: 'system',
      notifications: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('kintsugiUser', JSON.stringify(defaultUser));
    setUser(defaultUser);
    setShowSetup(false);
  };

  // Generate bias insight
  const generateBiasInsight = async () => {
    setBiasInsightLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockDescription = `Based on your recent reflections, I notice you tend to be hard on yourself about ${['productivity', 'meeting expectations', 'perfectionism'][Math.floor(Math.random() * 3)]}.`;
      
      setBiasInsight({
        ...biasInsight,
        description: mockDescription,
        reflection: 'Consider how this pattern shows up in your daily life.',
        actionStep: 'Reflect on this insight in your journal',
        research: [{
          citation: 'Dweck, C. (2006). Mindset: The New Psychology of Success',
          year: 2006,
          finding: 'Adopting a growth mindset can lead to greater resilience and achievement.'
        }]
      });
      setShowBiasInsight(true);
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setBiasInsightLoading(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kintsugi-gold-500"></div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900 p-4">
        <ProfileSetup 
          onComplete={handleProfileSave} 
          initialProfile={user || undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-kintsugi-dark-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Own Your Impact</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 hidden md:inline">Track wins • Recognize bias • Advocate for yourself</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`${activeTab === 'home' ? 'border-kintsugi-gold-500 text-kintsugi-gold-700 dark:text-kintsugi-gold-300' : 'border-transparent text-kintsugi-dark-500 dark:text-kintsugi-gold-400 hover:border-kintsugi-gold-300 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('journal')}
                  className={`${activeTab === 'journal' ? 'border-kintsugi-gold-500 text-kintsugi-gold-700 dark:text-kintsugi-gold-300' : 'border-transparent text-kintsugi-dark-500 dark:text-kintsugi-gold-400 hover:border-kintsugi-gold-300 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Journal
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`${activeTab === 'insights' ? 'border-kintsugi-gold-500 text-kintsugi-gold-700 dark:text-kintsugi-gold-300' : 'border-transparent text-kintsugi-dark-500 dark:text-kintsugi-gold-400 hover:border-kintsugi-gold-300 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Insights
                </button>
              </nav>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <ThemeToggle />
              <button className="ml-4 p-1 rounded-full text-kintsugi-dark-400 hover:text-kintsugi-gold-600 dark:text-kintsugi-gold-400 dark:hover:text-kintsugi-gold-200">
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 text-kintsugi-gold-700 dark:text-kintsugi-gold-300 text-sm font-medium">
                    {user?.avatar || '👤'}
                  </span>
                </div>
                <button className="ml-2 text-kintsugi-dark-700 dark:text-kintsugi-gold-200 text-sm font-medium">
                  {user?.name || 'User'}
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-kintsugi-dark-500 hover:text-kintsugi-gold-500 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 focus:outline-none"
              >
                <Menu className="block h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setShowMobileMenu(false);
                  }}
                  className={`${activeTab === 'home' ? 'bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/30 border-kintsugi-gold-500 text-kintsugi-gold-700 dark:text-kintsugi-gold-200' : 'border-transparent text-kintsugi-dark-500 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-50 dark:hover:bg-kintsugi-gold-900/20 hover:border-kintsugi-gold-300 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('journal');
                    setShowMobileMenu(false);
                  }}
                  className={`${activeTab === 'journal' ? 'bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/30 border-kintsugi-gold-500 text-kintsugi-gold-700 dark:text-kintsugi-gold-200' : 'border-transparent text-kintsugi-dark-500 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-50 dark:hover:bg-kintsugi-gold-900/20 hover:border-kintsugi-gold-300 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  Journal
                </button>
                <button
                  onClick={() => {
                    setActiveTab('insights');
                    setShowMobileMenu(false);
                  }}
                  className={`${activeTab === 'insights' ? 'bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/30 border-kintsugi-gold-500 text-kintsugi-gold-700 dark:text-kintsugi-gold-200' : 'border-transparent text-kintsugi-dark-500 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-50 dark:hover:bg-kintsugi-gold-900/20 hover:border-kintsugi-gold-300 hover:text-kintsugi-gold-700 dark:hover:text-kintsugi-gold-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  Insights
                </button>
                <div className="pt-4 pb-3 border-t border-kintsugi-gold-200 dark:border-kintsugi-gold-800">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 text-kintsugi-gold-700 dark:text-kintsugi-gold-300 text-lg">
                        {user?.avatar || '👤'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-kintsugi-dark-700 dark:text-kintsugi-gold-200">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-sm font-medium text-kintsugi-dark-500 dark:text-kintsugi-gold-400">
                        {user?.email || 'View profile'}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* XP Bar */}
        <XPBar />

        {/* Main Content */}
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 rounded-md p-3">
                      <Zap className="h-6 w-6 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg leading-6 font-medium text-kintsugi-dark-900 dark:text-white">
                        Welcome back, {user?.name || 'Friend'}!
                      </h3>
                      <p className="mt-1 text-sm text-kintsugi-dark-500 dark:text-kintsugi-gold-300">
                        Ready to reflect on your day and grow stronger?
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={generateBiasInsight}
                        disabled={biasInsightLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-kintsugi-gold-600 hover:bg-kintsugi-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kintsugi-gold-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {biasInsightLoading ? 'Thinking...' : 'Get Insight'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <QuickCapture isOpen={true} onClose={() => {}} onSaved={() => {}} />

              {/* Weekly Summary */}
              <WeeklySummary isOpen={false} onClose={() => {}} />
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-kintsugi-dark-900 dark:text-white mb-6">My Journal</h2>
                <EnhancedProgressJournal isOpen={true} onClose={() => {}} />
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-kintsugi-dark-900 dark:text-white mb-6">Your Insights</h2>
                  
                  <div className="bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/10 rounded-lg p-4 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-kintsugi-gold-800 dark:text-kintsugi-gold-200">
                          Weekly Reflection
                        </h3>
                        <div className="mt-2 text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300">
                          <p>You've been consistent with your reflections this week! Your focus on growth and learning is helping you build resilience.</p>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-600 dark:hover:text-kintsugi-gold-200"
                          >
                            View details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bias Insight Modal */}
      {showBiasInsight && (
        <BiasInsightModal 
          onClose={() => setShowBiasInsight(false)}
          insight={biasInsight}
        />
      )}
    </div>
  );
}
