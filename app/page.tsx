'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, Check, X, Menu, Bell, User, ChevronDown, ChevronUp, ChevronRight, Settings, Keyboard, Target, BookOpen, Award } from 'lucide-react';

// Import components
import XPBar from '@/components/XPBar';
import ProfileSetup from '@/components/ProfileSetup';
import ThemeToggle from '@/components/ThemeToggle';
import BiasInsightModal from '@/components/BiasInsightModal';
import WeeklySummary from '@/components/WeeklySummary';
import EnhancedProgressJournal from '@/components/EnhancedProgressJournal';
import QuickCapture from '@/components/QuickCapture';
import FeedbackWidget from '@/components/FeedbackWidget';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import DataManagement from '@/components/DataManagement';

// Phase 3: Analytics & Insights
import MoodTracker from '@/components/MoodTracker';
import WordCloudVisualization from '@/components/WordCloudVisualization';
import PersonalStatsDashboard from '@/components/PersonalStatsDashboard';

// Phase 4: Content Features
import QuoteOfTheDay from '@/components/QuoteOfTheDay';
import WritingPromptsPanel from '@/components/WritingPromptsPanel';
import CustomAffirmationsManager from '@/components/CustomAffirmationsManager';
import OnboardingTour from '@/components/OnboardingTour';

import type { BiasInsight, UserProfile } from '@/types';
import { shouldPromptFeedback } from '@/utils/analytics';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

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
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [showAccomplishments, setShowAccomplishments] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  // Check if feedback should be prompted
  useEffect(() => {
    if (isClient && !showSetup) {
      // Wait 10 seconds before showing feedback
      const timer = setTimeout(() => {
        if (shouldPromptFeedback()) {
          setShowFeedback(true);
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isClient, showSetup]);

  // Handle profile save
  const handleProfileSave = (profileData: UserProfile) => {
    // Save the complete profile including demographics
    const newUser: UserProfile = {
      ...profileData,
      id: profileData.id || '1',
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

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('kintsugiUser');
    setUser(null);
    setShowSetup(true);
    setShowUserDropdown(false);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setShowSetup(true);
    setShowUserDropdown(false);
  };

  // Keyboard shortcuts configuration
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Go to Home tab',
      action: () => setActiveTab('home'),
    },
    {
      key: 'j',
      ctrl: true,
      description: 'Go to Journal tab',
      action: () => setActiveTab('journal'),
    },
    {
      key: 'i',
      ctrl: true,
      description: 'Go to Insights tab',
      action: () => setActiveTab('insights'),
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Quick capture',
      action: () => setShowQuickCapture(true),
    },
    {
      key: 's',
      ctrl: true,
      shift: true,
      description: 'Open settings',
      action: () => setShowSettings(true),
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowKeyboardShortcuts(true),
    },
  ];

  // Initialize keyboard shortcuts
  useKeyboardShortcuts(shortcuts);

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
              <div className="ml-4 flex items-center relative user-dropdown-container">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 text-kintsugi-gold-700 dark:text-kintsugi-gold-300 text-sm font-medium">
                    {user?.avatar || '👤'}
                  </span>
                </div>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="ml-2 text-kintsugi-dark-700 dark:text-kintsugi-gold-200 text-sm font-medium hover:text-kintsugi-gold-600 dark:hover:text-kintsugi-gold-100 transition-colors"
                >
                  {user?.name || 'User'}
                  <ChevronDown className={`inline-block ml-1 h-4 w-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-kintsugi-dark-800 ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1" role="menu">
                        <button
                          onClick={handleEditProfile}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings & Data
                        </button>
                        <button
                          onClick={() => {
                            setShowKeyboardShortcuts(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center"
                        >
                          <Keyboard className="h-4 w-4 mr-2" />
                          Keyboard Shortcuts
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {/* Enhanced Welcome Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-br from-kintsugi-gold-500 via-amber-500 to-yellow-600 dark:from-kintsugi-gold-700 dark:via-amber-700 dark:to-yellow-800 rounded-2xl shadow-2xl"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl"></div>

                <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                      >
                        <Sparkles className="h-10 w-10 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Welcome back, {user?.name || 'Friend'}! 👋
                        </h2>
                        <p className="text-white/90 text-lg">
                          Your journey to growth and self-advocacy continues today
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateBiasInsight}
                      disabled={biasInsightLoading}
                      className="flex-shrink-0 inline-flex items-center px-6 py-3 bg-white text-kintsugi-gold-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lightbulb className="h-5 w-5 mr-2" />
                      {biasInsightLoading ? 'Generating...' : 'Get Insight'}
                    </motion.button>
                  </div>

                  {/* Quick Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">Current Streak</p>
                          <p className="text-white text-2xl font-bold mt-1">
                            {(() => {
                              const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"currentStreak":0}');
                              return engagement.currentStreak || 0;
                            })()} days 🔥
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">Journal Entries</p>
                          <p className="text-white text-2xl font-bold mt-1">
                            {(() => {
                              const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
                              return engagement.journalEntries?.length || 0;
                            })()} ✍️
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">Achievements</p>
                          <p className="text-white text-2xl font-bold mt-1">
                            {(() => {
                              const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"achievements":[]}');
                              return engagement.achievements?.length || 0;
                            })()} 🏆
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Phase 4: Daily Quote */}
              <QuoteOfTheDay />

              {/* Phase 4: Writing Prompts */}
              <WritingPromptsPanel />

              {/* Phase 4: Custom Affirmations */}
              <CustomAffirmationsManager />

              {/* Quick Actions */}
              <QuickCapture
                isOpen={showQuickCapture}
                onClose={() => setShowQuickCapture(false)}
                onSaved={() => setShowQuickCapture(false)}
              />

              {/* Weekly Summary */}
              <WeeklySummary isOpen={false} onClose={() => {}} />
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-6">
              {/* Enhanced Journal Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-56 h-56 bg-pink-300/10 rounded-full blur-3xl"></div>

                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <BookOpen className="h-8 w-8" />
                        My Accomplishment Journal
                      </h2>
                      <p className="text-white/90 text-lg">
                        Track your wins, recognize patterns, and celebrate growth
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAccomplishments(true)}
                      className="flex-shrink-0 inline-flex items-center px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Open Journal
                    </motion.button>
                  </div>

                  {/* Journal Stats */}
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {(() => {
                      const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
                      const entries = engagement.journalEntries || [];
                      const today = new Date().toDateString();
                      const todayEntries = entries.filter((e: any) => new Date(e.date).toDateString() === today);
                      const thisWeek = entries.filter((e: any) => {
                        const entryDate = new Date(e.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate >= weekAgo;
                      });
                      const totalWords = entries.reduce((sum: number, e: any) => sum + (`${e.accomplishment} ${e.reflection || ''}`.split(' ').length || 0), 0);

                      return (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                          >
                            <p className="text-white/80 text-sm font-medium">Total Entries</p>
                            <p className="text-white text-2xl font-bold mt-1">{entries.length}</p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                          >
                            <p className="text-white/80 text-sm font-medium">Today</p>
                            <p className="text-white text-2xl font-bold mt-1">{todayEntries.length}</p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                          >
                            <p className="text-white/80 text-sm font-medium">This Week</p>
                            <p className="text-white text-2xl font-bold mt-1">{thisWeek.length}</p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                          >
                            <p className="text-white/80 text-sm font-medium">Total Words</p>
                            <p className="text-white text-2xl font-bold mt-1">{totalWords.toLocaleString()}</p>
                          </motion.div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>

              {/* Recent Entries Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-200 dark:border-kintsugi-dark-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-kintsugi-gold-600" />
                    Recent Entries
                  </h3>
                </div>
                <div className="p-6">
                  {(() => {
                    const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
                    const entries = engagement.journalEntries || [];
                    const recentEntries = entries.slice(0, 3);

                    if (recentEntries.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <BookOpen className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No entries yet
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start your journey by creating your first journal entry
                          </p>
                          <button
                            onClick={() => setShowAccomplishments(true)}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                          >
                            <Sparkles className="h-5 w-5 mr-2" />
                            Create First Entry
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {recentEntries.map((entry: any, idx: number) => (
                          <motion.div
                            key={entry.id || idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setShowAccomplishments(true)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {entry.category || 'Accomplishment'}
                              </h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {entry.accomplishment}
                            </p>
                            {entry.mood && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Mood: {entry.mood === 'great' && '😄 Great'}
                                {entry.mood === 'good' && '🙂 Good'}
                                {entry.mood === 'neutral' && '😐 Neutral'}
                                {entry.mood === 'challenging' && '😟 Challenging'}
                                {entry.mood === 'difficult' && '😞 Difficult'}
                              </div>
                            )}
                            {entry.tags && entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {entry.tags.slice(0, 3).map((tag: string, tagIdx: number) => (
                                  <span
                                    key={tagIdx}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                        <div className="pt-4 text-center">
                          <button
                            onClick={() => setShowAccomplishments(true)}
                            className="text-purple-600 dark:text-purple-400 font-medium hover:underline flex items-center gap-2 mx-auto"
                          >
                            View all entries
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}

          {/* Accomplishments Modal */}
          <EnhancedProgressJournal
            isOpen={showAccomplishments}
            onClose={() => setShowAccomplishments(false)}
          />

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* AI Insights Card */}
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
                          {biasInsight.title || 'Weekly Reflection'}
                        </h3>
                        <div className="mt-2 text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300">
                          <p>{biasInsight.description || "You've been consistent with your reflections this week! Your focus on growth and learning is helping you build resilience."}</p>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setShowBiasInsight(true)}
                            className="inline-flex items-center text-sm font-medium text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-600 dark:hover:text-kintsugi-gold-200"
                          >
                            View details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={generateBiasInsight}
                            disabled={biasInsightLoading}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-kintsugi-gold-600 hover:bg-kintsugi-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {biasInsightLoading ? 'Generating...' : 'Generate New Insight'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3: Advanced Analytics */}
              <MoodTracker />
              <WordCloudVisualization />
              <PersonalStatsDashboard />
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

      {/* Feedback Widget */}
      {showFeedback && (
        <FeedbackWidget onClose={() => setShowFeedback(false)} />
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <KeyboardShortcutsModal
          onClose={() => setShowKeyboardShortcuts(false)}
          shortcuts={shortcuts}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-kintsugi-gold-200 dark:border-kintsugi-dark-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/30 rounded-lg">
                    <Settings className="h-6 w-6 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-white">
                      Settings & Data Management
                    </h2>
                    <p className="text-sm text-kintsugi-dark-600 dark:text-kintsugi-gold-300">
                      Manage your data, backups, and preferences
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-dark-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-kintsugi-dark-600 dark:text-kintsugi-gold-300" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <DataManagement
                  onDataImported={() => {
                    setShowSettings(false);
                  }}
                  onDataCleared={() => {
                    setShowSettings(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Onboarding Tour */}
      {!showSetup && <OnboardingTour />}
    </div>
  );
}
