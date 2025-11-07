'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, Check, X, Menu, Bell, User, ChevronDown, ChevronUp, ChevronRight, Settings, Keyboard, Target, BookOpen, Award, Brain, Plus, Calendar, HelpCircle } from 'lucide-react';

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
import SocialProofTestimonials from '@/components/SocialProofTestimonials';

// Phase 6: AI-Powered Features
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import AIPerformanceReviewGenerator from '@/components/AIPerformanceReviewGenerator';

// Phase 7: Professional Tools
import ExportManager from '@/components/ExportManager';

// Phase 8: Enhanced UX
import ThemeSelector from '@/components/ThemeSelector';
import AdvancedSearch from '@/components/AdvancedSearch';
import DataDiagnostic from '@/components/DataDiagnostic';
import ProfileCard from '@/components/ProfileCard';
import ProfileCompletionReminder from '@/components/ProfileCompletionReminder';
import FAQSidebar from '@/components/FAQSidebar';

// Phase 9: Interactivity & Polish
import ToastNotification, { useToast } from '@/components/ToastNotification';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProgressRing from '@/components/ProgressRing';
import FloatingActionButton from '@/components/FloatingActionButton';
import CelebrationModal from '@/components/CelebrationModal';

// Phase 10: Journal Engagement & Retention (Research-Backed)
import StreakCalendar from '@/components/StreakCalendar';
import JournalPromptCarousel from '@/components/JournalPromptCarousel';
import QuickEntryCard from '@/components/QuickEntryCard';
import CommunityStats from '@/components/CommunityStats';
import MilestoneTracker from '@/components/MilestoneTracker';
import JournalProgressDashboard from '@/components/JournalProgressDashboard';

// Phase 11: Kintsugi Philosophy Integration
import KintsugiWelcomeBanner from '@/components/KintsugiWelcomeBanner';
import GoldenRepairsPanel from '@/components/GoldenRepairsPanel';
import KintsugiQuotes from '@/components/KintsugiQuotes';
import UnifiedPhilosophyCard from '@/components/UnifiedPhilosophyCard';

// Phase 12: Research-Backed Enhancements (Journey Stages, Spaced Repetition, Fresh Start Effect)
import JourneyAwareAffirmation from '@/components/JourneyAwareAffirmation';
import FreshStartWelcome from '@/components/FreshStartWelcome';

import type { BiasInsight, UserProfile } from '@/types';
import { JournalEntry, Achievement } from '@/types/engagement';
import { shouldPromptFeedback } from '@/utils/analytics';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { initializeTheme } from '@/utils/themes';
import { checkAndUnlockAchievements, getAchievementProgress, getEngagementData, updateStreakFromEntries } from '@/utils/engagement';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBiasInsight, setShowBiasInsight] = useState(false);
  const [themeVersion, setThemeVersion] = useState(0); // Force re-render when theme changes
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [showAccomplishments, setShowAccomplishments] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'data' | 'appearance' | 'diagnostic'>('profile');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [filteredJournalEntries, setFilteredJournalEntries] = useState<JournalEntry[]>([]);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Phase 9: Interactive components
  const { toasts, addToast, removeToast } = useToast();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ title: '', message: '', type: 'achievement' as const });

  // Homepage stats (reactive)
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

  // Initialize theme system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTheme();
    }
  }, []);

  // Listen for theme changes and force re-render
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastThemeChange = localStorage.getItem('kintsugi_theme_changes') || '0';

    const handleThemeChange = () => {
      // Increment to force re-render of navigation
      setThemeVersion(prev => prev + 1);
    };

    // Listen for storage events (when theme changes in another tab or from Settings)
    window.addEventListener('storage', handleThemeChange);

    // Also check periodically for theme changes (in case storage event doesn't fire)
    const interval = setInterval(() => {
      const currentThemeChange = localStorage.getItem('kintsugi_theme_changes') || '0';
      if (currentThemeChange !== lastThemeChange) {
        lastThemeChange = currentThemeChange;
        handleThemeChange();
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
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
    if (!isClient) return;

    const loadData = () => {
      try {
        const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
        const entries = engagement.journalEntries || [];
        setJournalEntries(entries);
        setFilteredJournalEntries(entries);

        // Update streak based on journal entries
        if (entries.length > 0) {
          updateStreakFromEntries();
        }

        // Load all achievements (locked and unlocked)
        const achievements = getAchievementProgress();
        setAllAchievements(achievements);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    // Load data initially
    loadData();

    // Listen for data changes
    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleDataChange);
    window.addEventListener('kintsugi-data-updated', handleDataChange);

    return () => {
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('kintsugi-data-updated', handleDataChange);
    };
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

        // Show celebration modal
        setCelebrationData({
          title: `Achievement Unlocked!`,
          message: newAchievements[0].description,
          type: 'achievement'
        });
        setShowCelebration(true);

        // Show toast notification
        addToast({
          type: 'success',
          title: 'Achievement Unlocked!',
          message: newAchievements[0].title,
          duration: 5000
        });

        // Reload all achievements to show updated state
        setAllAchievements(getAchievementProgress());
      }
    }
  }, [isClient, journalEntries.length, addToast]);

  // Load and refresh homepage stats
  useEffect(() => {
    if (!isClient) return;

    const loadStats = () => {
      const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"currentStreak":0,"journalEntries":[],"achievements":[]}');
      setCurrentStreak(engagement.currentStreak || 0);
      setTotalEntries(engagement.journalEntries?.length || 0);
      setTotalAchievements(engagement.achievements?.length || 0);
    };

    // Load stats initially
    loadStats();

    // Listen for storage changes
    const handleDataChange = () => {
      loadStats();
    };

    window.addEventListener('storage', handleDataChange);
    window.addEventListener('kintsugi-data-updated', handleDataChange);

    return () => {
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('kintsugi-data-updated', handleDataChange);
    };
  }, [isClient, statsRefreshKey]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
      if (showNotifications && !target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown, showNotifications]);

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
    // Preserve existing user data if editing
    const existingUser = user || {} as Partial<UserProfile>;

    // Save the complete profile including demographics
    const newUser: UserProfile = {
      ...existingUser, // Preserve any existing fields
      ...profileData,
      id: profileData.id || existingUser.id || '1',
      createdAt: existingUser.createdAt || profileData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // NEVER set name to 'Guest' if user has a real name
    if (newUser.name === 'Guest' && existingUser.name && existingUser.name !== 'Guest') {
      newUser.name = existingUser.name;
    }

    localStorage.setItem('kintsugiUser', JSON.stringify(newUser));
    setUser(newUser);
    setShowSetup(false);
    setIsEditingProfile(false);

    // Show success toast
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been saved successfully!',
      duration: 3000
    });

    // Trigger data refresh
    window.dispatchEvent(new Event('kintsugi-data-updated'));
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
    setIsEditingProfile(true);
    setShowUserDropdown(false);
  };

  // Handle cancel profile edit
  const handleCancelProfileEdit = () => {
    setShowSetup(false);
    setIsEditingProfile(false);
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
          isEditing={isEditingProfile}
          onCancel={handleCancelProfileEdit}
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
                <Zap className="h-8 w-8" style={{ color: 'var(--theme-primary)', ['--theme-version' as any]: themeVersion }} />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Own Your Impact</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 hidden md:inline">Track wins • Recognize bias • Advocate for yourself</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('home')}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: activeTab === 'home' ? 'var(--theme-primary)' : 'transparent',
                    color: activeTab === 'home' ? 'var(--theme-primary)' : '#6b7280',
                    ['--theme-version' as any]: themeVersion
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('journal')}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: activeTab === 'journal' ? 'var(--theme-primary)' : 'transparent',
                    color: activeTab === 'journal' ? 'var(--theme-primary)' : '#6b7280',
                    ['--theme-version' as any]: themeVersion
                  }}
                >
                  Journal
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: activeTab === 'insights' ? 'var(--theme-primary)' : 'transparent',
                    color: activeTab === 'insights' ? 'var(--theme-primary)' : '#6b7280',
                    ['--theme-version' as any]: themeVersion
                  }}
                >
                  Insights
                </button>
              </nav>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <ThemeToggle />

              {/* Notifications Bell */}
              <div className="ml-4 relative notifications-container">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full text-kintsugi-dark-400 hover:theme-text-primary dark:text-kintsugi-gold-400 dark:hover:theme-text-accent transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 mt-2 w-80 rounded-xl shadow-lg bg-white dark:bg-kintsugi-dark-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 theme-gradient-to-r">
                        <h3 className="text-sm font-semibold text-white dark:text-white flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notifications
                        </h3>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {currentStreak >= 7 && (
                          <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700 transition-colors border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full theme-bg-primary-light flex items-center justify-center">
                                <Zap className="h-4 w-4 theme-text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Amazing streak! 🔥
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  You've journaled for {currentStreak} days straight. Keep up the momentum!
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {totalEntries >= 10 && totalEntries % 10 === 0 && (
                          <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700 transition-colors border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Milestone reached!
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  You've created {totalEntries} journal entries. Your impact story is growing!
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {journalEntries.length === 0 && (
                          <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700 transition-colors border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Start your journey
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  Create your first journal entry to begin owning your impact!
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStreak < 7 && totalEntries < 10 && journalEntries.length > 0 && (
                          <div className="px-4 py-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                              <Check className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              You're all caught up!
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Keep journaling to unlock more achievements
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FAQ Help Button */}
              <div className="ml-4">
                <button
                  onClick={() => setShowFAQ(true)}
                  className="p-1 rounded-full text-kintsugi-dark-400 hover:text-kintsugi-gold-600 dark:text-kintsugi-gold-400 dark:hover:text-kintsugi-gold-200 transition-colors"
                  aria-label="Help & FAQ"
                  title="Help & FAQ"
                >
                  <HelpCircle className="h-6 w-6" />
                </button>
              </div>

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
                      className="absolute right-0 top-12 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-kintsugi-dark-800 ring-1 ring-black ring-opacity-5 z-50"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kintsugi-gold-400 to-kintsugi-gold-600 flex items-center justify-center text-lg shadow">
                            {user?.avatar || '👤'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user?.name || 'User'}
                            </p>
                            {user?.profession && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.profession}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

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
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === 'home' ? 'var(--theme-primary-light)' : 'transparent',
                    borderColor: activeTab === 'home' ? 'var(--theme-primary)' : 'transparent',
                    color: activeTab === 'home' ? 'var(--theme-primary)' : '#6b7280',
                    ['--theme-version' as any]: themeVersion
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('journal');
                    setShowMobileMenu(false);
                  }}
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === 'journal' ? 'var(--theme-primary-light)' : 'transparent',
                    borderColor: activeTab === 'journal' ? 'var(--theme-primary)' : 'transparent',
                    color: activeTab === 'journal' ? 'var(--theme-primary)' : '#6b7280',
                    ['--theme-version' as any]: themeVersion
                  }}
                >
                  Journal
                </button>
                <button
                  onClick={() => {
                    setActiveTab('insights');
                    setShowMobileMenu(false);
                  }}
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === 'insights' ? 'var(--theme-primary-light)' : 'transparent',
                    borderColor: activeTab === 'insights' ? 'var(--theme-primary)' : 'transparent',
                    color: activeTab === 'insights' ? 'var(--theme-primary)' : '#6b7280',
                    ['--theme-version' as any]: themeVersion
                  }}
                >
                  Insights
                </button>
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full text-lg"
                        style={{
                          backgroundColor: 'var(--theme-primary-light)',
                          color: 'var(--theme-primary)',
                          ['--theme-version' as any]: themeVersion
                        }}
                      >
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
              {/* Kintsugi Welcome Banner */}
              <KintsugiWelcomeBanner
                user={user}
                currentStreak={currentStreak}
                totalEntries={totalEntries}
                onGetInsight={generateBiasInsight}
                isLoading={biasInsightLoading}
              />

              {/* Fresh Start Welcome - Research-Backed Return Messaging */}
              {user && <FreshStartWelcome userName={user.name} />}

              {/* Profile Completion Reminder */}
              {user && (
                <div className="profile-reminder">
                  <ProfileCompletionReminder
                    user={user}
                    onCompleteProfile={handleEditProfile}
                  />
                </div>
              )}

              {/* Kintsugi Quotes Widget */}
              <KintsugiQuotes />

              {/* Golden Repairs Panel */}
              <GoldenRepairsPanel entries={journalEntries} />

              {/* Unified Philosophy Explanation */}
              <UnifiedPhilosophyCard />

              {/* Return Motivation - Next Goals */}
              <ReturnMotivation />

              {/* Social Proof & Testimonials */}
              <SocialProofTestimonials />

              {/* Phase 4: Daily Quote */}
              <QuoteOfTheDay />

              {/* Phase 4: Writing Prompts */}
              <WritingPromptsPanel />

              {/* Journey-Aware Affirmations - Research-Backed with Spaced Repetition */}
              {user && <JourneyAwareAffirmation profile={user} />}

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
              {/* Phase 10: Research-Backed Engagement Components */}

              {/* Quick Entry Card - Friction Reduction (BJ Fogg) */}
              <QuickEntryCard
                onSave={(text) => {
                  // Create quick entry
                  const quickEntry: JournalEntry = {
                    id: `quick-${Date.now()}`,
                    date: new Date().toISOString(),
                    accomplishment: text,
                    reflection: '',
                    category: 'Quick Entry',
                    tags: ['quick'],
                  };

                  // Save to engagement data
                  const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
                  engagement.journalEntries = engagement.journalEntries || [];
                  engagement.journalEntries.push(quickEntry);
                  localStorage.setItem('kintsugi_engagement', JSON.stringify(engagement));

                  // Trigger data refresh
                  window.dispatchEvent(new Event('kintsugi-data-updated'));

                  // Show success toast
                  addToast({
                    type: 'success',
                    title: 'Quick Entry Saved!',
                    message: 'Building your journaling habit, one entry at a time.',
                    duration: 3000
                  });
                }}
              />

              {/* Personalized Prompt Carousel */}
              <JournalPromptCarousel
                user={user}
                onSelectPrompt={(prompt) => {
                  // Pre-fill the full journal with the prompt
                  setShowAccomplishments(true);
                  // The prompt will be used in the EnhancedProgressJournal component
                }}
              />

              {/* Two-Column Layout for Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Streak Calendar - Loss Aversion */}
                <StreakCalendar entries={journalEntries} />

                {/* Community Stats - Social Proof */}
                <CommunityStats userEntryCount={journalEntries.length} />
              </div>

              {/* Progress Dashboard - Visual Progress */}
              <JournalProgressDashboard entries={journalEntries} />

              {/* Milestone Tracker - Gamification */}
              <MilestoneTracker
                entryCount={journalEntries.length}
                currentStreak={currentStreak}
              />

              {/* Original Journal Entries List */}
              {journalEntries.length > 0 && (
                <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="h-6 w-6 theme-text-primary" />
                      Your Journal Entries ({journalEntries.length})
                    </h3>
                    <button
                      onClick={() => setShowAccomplishments(true)}
                      className="theme-btn-primary px-4 py-2 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Entry
                    </button>
                  </div>

                  <div className="space-y-4">
                    {journalEntries.slice(0, 10).map((entry: JournalEntry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setShowAccomplishments(true)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {entry.category && (
                            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                              {entry.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                          {entry.accomplishment}
                        </p>
                        {entry.reflection && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                            {entry.reflection}
                          </p>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {entry.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 text-xs rounded-full border border-purple-200 dark:border-purple-700">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {journalEntries.length > 10 && (
                    <button
                      onClick={() => setShowAccomplishments(true)}
                      className="mt-6 w-full py-3 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
                    >
                      View All {journalEntries.length} Entries
                    </button>
                  )}
                </div>
              )}

              {journalEntries.length === 0 && (
                <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No Entries Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start your journey by adding your first journal entry!
                  </p>
                  <button
                    onClick={() => setShowAccomplishments(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Entry
                  </button>
                </div>
              )}

              {/* Phase 8: Advanced Search */}
              {journalEntries.length > 0 && (
                <AdvancedSearch
                  entries={journalEntries}
                  onResultsChange={setFilteredJournalEntries}
                />
              )}
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
                className="theme-gradient-to-br rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(to bottom right, var(--theme-primary), var(--theme-secondary), var(--theme-accent))'
                }}
              >
                <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

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
                      className="flex-shrink-0 inline-flex items-center px-6 py-3 bg-white theme-text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <AnimatedCounter
                          value={(() => {
                            const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                            return engagement.aiAnalysesRun || 0;
                          })()}
                          className="inline"
                        />
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
                        <AnimatedCounter
                          value={(() => {
                            const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                            return engagement.patternsDetected || 0;
                          })()}
                          className="inline"
                        />
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
                        <AnimatedCounter
                          value={(() => {
                            const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                            return engagement.exportsCreated || 0;
                          })()}
                          className="inline"
                        />
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSettings(false);
            }
          }}
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b theme-border-light">
                <div className="flex items-center gap-3">
                  <div className="p-2 theme-bg-primary-light rounded-lg">
                    <Settings className="h-6 w-6 theme-text-primary" />
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
                  className="p-2 hover:theme-bg-primary-light rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-kintsugi-dark-600 dark:text-kintsugi-gold-300" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setSettingsTab('profile')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'profile'
                        ? 'theme-border-primary theme-text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setSettingsTab('data')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'data'
                        ? 'theme-border-primary theme-text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Data Management
                  </button>
                  <button
                    onClick={() => setSettingsTab('appearance')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'appearance'
                        ? 'theme-border-primary theme-text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Appearance & Accessibility
                  </button>
                  <button
                    onClick={() => setSettingsTab('diagnostic')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'diagnostic'
                        ? 'theme-border-primary theme-text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Diagnostic
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {settingsTab === 'profile' && user && (
                  <ProfileCard
                    user={user}
                    onEdit={() => {
                      setIsEditingProfile(true);
                      setShowSettings(false);
                    }}
                  />
                )}

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

      {/* Floating Action Button */}
      {!showSetup && (
        <FloatingActionButton
          onQuickCapture={() => setShowQuickCapture(true)}
          onNewEntry={() => setShowAccomplishments(true)}
        />
      )}

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={celebrationData.title}
        message={celebrationData.message}
        type={celebrationData.type}
      />

      {/* Onboarding Tour */}
      {!showSetup && <OnboardingTour />}

      {/* FAQ Sidebar */}
      <FAQSidebar isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    </div>
  );
}
