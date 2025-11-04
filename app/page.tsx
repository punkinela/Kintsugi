'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, Check, X, Menu, Bell, User, ChevronDown, ChevronUp, ChevronRight, Settings, Keyboard, Target, BookOpen, Award, Brain } from 'lucide-react';

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
import AchievementNotification from '@/components/AchievementNotification';
import AchievementsPanel from '@/components/AchievementsPanel';

// Phase 3: Analytics & Insights
import MoodTracker from '@/components/MoodTracker';
import WordCloudVisualization from '@/components/WordCloudVisualization';
import PersonalStatsDashboard from '@/components/PersonalStatsDashboard';

// Phase 4: Content Features
import QuoteOfTheDay from '@/components/QuoteOfTheDay';
import WritingPromptsPanel from '@/components/WritingPromptsPanel';
import CustomAffirmationsManager from '@/components/CustomAffirmationsManager';
import OnboardingTour from '@/components/OnboardingTour';
import ReturnMotivation from '@/components/ReturnMotivation';
import EngagingJournalPrompt from '@/components/EngagingJournalPrompt';

// Phase 6: AI-Powered Features
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import AIPerformanceReviewGenerator from '@/components/AIPerformanceReviewGenerator';

// Phase 7: Professional Tools
import ExportManager from '@/components/ExportManager';

// Phase 8: Enhanced UX
import ThemeSelector from '@/components/ThemeSelector';
import AdvancedSearch from '@/components/AdvancedSearch';
import DataDiagnostic from '@/components/DataDiagnostic';

import type { BiasInsight, UserProfile } from '@/types';
import { JournalEntry, Achievement } from '@/types/engagement';
import { shouldPromptFeedback } from '@/utils/analytics';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { initializeTheme } from '@/utils/themes';
import { checkAndUnlockAchievements, getAchievementProgress, getEngagementData } from '@/utils/engagement';

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
  const [settingsTab, setSettingsTab] = useState<'data' | 'appearance' | 'diagnostic'>('data');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [filteredJournalEntries, setFilteredJournalEntries] = useState<JournalEntry[]>([]);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

  // Initialize theme system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTheme();
    }
  }, []);

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

  // Load journal entries and achievements
  useEffect(() => {
    if (isClient) {
      try {
        const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
        const entries = engagement.journalEntries || [];
        setJournalEntries(entries);
        setFilteredJournalEntries(entries);

        // Load all achievements (locked and unlocked)
        const achievements = getAchievementProgress();
        setAllAchievements(achievements);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, [isClient]);

  // Check for new achievements whenever journal entries change
  useEffect(() => {
    if (isClient && journalEntries.length > 0) {
      const engagementData = getEngagementData();
      const newAchievements = checkAndUnlockAchievements(engagementData);
      if (newAchievements.length > 0) {
        // Show notification for the first new achievement
        setNewAchievement(newAchievements[0]);
        setTimeout(() => setNewAchievement(null), 5000);

        // Reload all achievements to show updated state
        setAllAchievements(getAchievementProgress());
      }
    }
  }, [isClient, journalEntries.length]);

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
      key: 'a',
      ctrl: true,
      description: 'View achievements',
      action: () => setShowAchievementsPanel(true),
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAchievementsPanel(true)}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 cursor-pointer hover:bg-white/30 transition-all"
                      title="Click to view all achievements (Ctrl+A)"
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

              {/* Return Motivation - Next Goals */}
              <ReturnMotivation />

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
              {/* Engaging Journal Prompt Component */}
              <EngagingJournalPrompt onOpenJournal={() => setShowAccomplishments(true)} />

              {/* Phase 8: Advanced Search */}
              <AdvancedSearch
                entries={journalEntries}
                onResultsChange={setFilteredJournalEntries}
              />
            </div>
          )}

          {/* Accomplishments Modal */}
          <EnhancedProgressJournal
            isOpen={showAccomplishments}
            onClose={() => setShowAccomplishments(false)}
          />

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Enhanced Insights Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-900 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-56 h-56 bg-purple-300/10 rounded-full blur-3xl"></div>

                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Brain className="h-8 w-8" />
                        Your Insights & Analytics
                      </h2>
                      <p className="text-white/90 text-lg">
                        Discover patterns, analyze growth, and get AI-powered insights
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateBiasInsight}
                      disabled={biasInsightLoading}
                      className="flex-shrink-0 inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      {biasInsightLoading ? 'Generating...' : 'Generate Insight'}
                    </motion.button>
                  </div>

                  {/* Insights Stats */}
                  <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                    >
                      <p className="text-white/80 text-sm font-medium">AI Analyses</p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {(() => {
                          const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                          return engagement.aiAnalysesRun || 0;
                        })()}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                    >
                      <p className="text-white/80 text-sm font-medium">Patterns Found</p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {(() => {
                          const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                          return engagement.patternsDetected || 0;
                        })()}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                    >
                      <p className="text-white/80 text-sm font-medium">Exports Created</p>
                      <p className="text-white text-2xl font-bold mt-1">
                        {(() => {
                          const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                          return engagement.exportsCreated || 0;
                        })()}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Phase 3: Advanced Analytics */}
              <MoodTracker />
              <WordCloudVisualization />
              <PersonalStatsDashboard />

              {/* Phase 6: AI-Powered Features */}
              <AIInsightsDashboard />
              <AIPerformanceReviewGenerator />

              {/* Phase 7: Professional Tools */}
              <ExportManager />
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

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setSettingsTab('data')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'data'
                        ? 'border-kintsugi-gold-500 text-kintsugi-gold-600 dark:text-kintsugi-gold-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Data Management
                  </button>
                  <button
                    onClick={() => setSettingsTab('appearance')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'appearance'
                        ? 'border-kintsugi-gold-500 text-kintsugi-gold-600 dark:text-kintsugi-gold-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Appearance & Accessibility
                  </button>
                  <button
                    onClick={() => setSettingsTab('diagnostic')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'diagnostic'
                        ? 'border-kintsugi-gold-500 text-kintsugi-gold-600 dark:text-kintsugi-gold-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Diagnostic
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                {settingsTab === 'data' && (
                  <DataManagement
                    onDataImported={() => {
                      setShowSettings(false);
                    }}
                    onDataCleared={() => {
                      setShowSettings(false);
                    }}
                  />
                )}

                {settingsTab === 'appearance' && (
                  <ThemeSelector />
                )}

                {settingsTab === 'diagnostic' && (
                  <DataDiagnostic />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Achievement Notification Toast */}
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {/* Achievements Panel Modal */}
      <AchievementsPanel
        isOpen={showAchievementsPanel}
        onClose={() => setShowAchievementsPanel(false)}
        achievements={allAchievements}
      />

      {/* Onboarding Tour */}
      {!showSetup && <OnboardingTour />}
    </div>
  );
}
