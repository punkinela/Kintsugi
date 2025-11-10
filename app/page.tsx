'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, Check, X, Menu, Bell, User, ChevronDown, ChevronUp, ChevronRight, Settings, Keyboard, Target, BookOpen, Award, Brain, Plus, Calendar, HelpCircle, TrendingUp, MessageSquare, Shield } from 'lucide-react';

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
import PersonalizedWisdom from '@/components/PersonalizedWisdom';
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
import AboutPhilosophyModal from '@/components/AboutPhilosophyModal';

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

// Phase 13: Kintsugi Philosophy Features (10 Remarkable Features)
import MushinReflectionMode from '@/components/MushinReflectionMode';
import KintsugiPromptsCarousel from '@/components/KintsugiPromptsCarousel';
import StrengthArchaeology from '@/components/StrengthArchaeology';
import ImpermanenceReminder from '@/components/ImpermanenceReminder';
import GoldenSeamTimeline from '@/components/GoldenSeamTimeline';
import BeforeAfterReframing from '@/components/BeforeAfterReframing';
import TransformationHeatmap from '@/components/TransformationHeatmap';
import InteractiveKintsugiVessel from '@/components/InteractiveKintsugiVessel';
import KintsugiPortfolioGenerator from '@/components/KintsugiPortfolioGenerator';
import JourneyRichnessScore from '@/components/JourneyRichnessScore';

// Phase 14: AI-Powered Enhancements
import InAppWeeklyDigest from '@/components/InAppWeeklyDigest';
import AICareerGapAnalyzer from '@/components/AICareerGapAnalyzer';
import AIConfidenceScoreTracker from '@/components/AIConfidenceScoreTracker';
import AISmartTaggingSearch from '@/components/AISmartTaggingSearch';
import AIInterviewPrepGenerator from '@/components/AIInterviewPrepGenerator';
import AutoProfileBuilder from '@/components/AutoProfileBuilder';

// Backup & Data Protection
import AutoBackupReminder from '@/components/AutoBackupReminder';
import BackupRestorePanel from '@/components/BackupRestorePanel';

// Voice Learning System
import VoiceProfileManager from '@/components/VoiceProfileManager';

import type { BiasInsight, UserProfile } from '@/types';
import { JournalEntry, Achievement } from '@/types/engagement';
import { shouldPromptFeedback } from '@/utils/analytics';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { initializeTheme, getCurrentThemeColors } from '@/utils/themes';
import { checkAndUnlockAchievements, getAchievementProgress, getEngagementData, updateStreakFromEntries } from '@/utils/engagement';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'journal' | 'insights' | 'your-edge'>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBiasInsight, setShowBiasInsight] = useState(false);
  const [themeVersion, setThemeVersion] = useState(0); // Used for data-theme-version attribute
  const [biasInsight, setBiasInsight] = useState<BiasInsight>({
    id: '1',
    title: 'Weekly Reflection',
    description: 'Your personalized insight will appear here',
    reflection: '',
    actionStep: 'Reflect on this insight in your Impact Log',
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
  const [showAboutPhilosophy, setShowAboutPhilosophy] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'data' | 'appearance' | 'voice' | 'diagnostic'>('profile');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [filteredJournalEntries, setFilteredJournalEntries] = useState<JournalEntry[]>([]);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [selectedEntryForInterview, setSelectedEntryForInterview] = useState<string>('');
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [showYourEdgeDropdown, setShowYourEdgeDropdown] = useState(false);
  const [showInsightsDropdown, setShowInsightsDropdown] = useState(false);

  // Edge tab collapsible sections
  const [expandedExportTools, setExpandedExportTools] = useState(true);
  const [expandedGrowthViz, setExpandedGrowthViz] = useState(true);

  // Weekly Digest ref for navigation
  const weeklyDigestRef = useRef<HTMLDivElement>(null);
  const performanceReviewRef = useRef<HTMLDivElement>(null);
  const portfolioGeneratorRef = useRef<HTMLDivElement>(null);

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

  // Listen for theme changes and update data-theme-version attribute
  // This forces browsers to recalculate CSS variables in stylesheets
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleThemeChange = () => {
      // Increment data-theme-version to trigger browser style recalculation
      setThemeVersion(prev => prev + 1);
    };

    // Listen for our custom 'theme-changed' event (dispatched from utils/themes.ts)
    window.addEventListener('theme-changed', handleThemeChange);

    // Also listen for storage events (when theme changes in another tab)
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
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

  // Load impact entries and achievements
  useEffect(() => {
    if (!isClient) return;

    const loadData = () => {
      try {
        const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{"journalEntries":[]}');
        const entries = engagement.journalEntries || [];
        setJournalEntries(entries);
        setFilteredJournalEntries(entries);

        // Update streak based on impact entries
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

  // Check for new achievements whenever impact entries change
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

  // Navigate to Weekly Digest
  const navigateToWeeklyDigest = () => {
    setActiveTab('home');
    setShowNotifications(false);
    setTimeout(() => {
      weeklyDigestRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
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
        actionStep: 'Reflect on this insight in your Impact Log',
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 theme-border-primary"></div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-bg-primary-light dark:bg-kintsugi-dark-900 p-4">
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
    <div
      className="min-h-screen theme-bg-primary-light dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-white transition-colors duration-200"
      data-theme-version={themeVersion}
    >
      {/* Header - data-theme-version forces browser style recalculation */}
      <header className="bg-white dark:bg-kintsugi-dark-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Zap className="h-8 w-8 theme-text-primary" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Own Your Impact</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 hidden md:inline">Track wins • Recognize bias • Advocate for yourself</span>
                <span className="ml-3 px-2 py-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-kintsugi-dark-700 rounded hidden lg:inline" title="How to pronounce Kintsugi">
                  金継ぎ Kintsugi (kin-TSU-gi)
                </span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('home')}
                  data-active={activeTab === 'home'}
                  className="nav-tab inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('journal')}
                  data-active={activeTab === 'journal'}
                  className="nav-tab inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Impact Log
                </button>
                {/* Insights Tab with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setActiveTab('insights');
                      setShowInsightsDropdown(!showInsightsDropdown);
                    }}
                    onMouseEnter={() => setShowInsightsDropdown(true)}
                    onMouseLeave={() => setShowInsightsDropdown(false)}
                    data-active={activeTab === 'insights'}
                    className="nav-tab inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium gap-1"
                  >
                    Insights
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* Insights Dropdown */}
                  <AnimatePresence>
                    {showInsightsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setShowInsightsDropdown(true)}
                        onMouseLeave={() => setShowInsightsDropdown(false)}
                        className="absolute left-0 top-full mt-2 w-64 rounded-xl shadow-lg bg-white dark:bg-kintsugi-dark-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setActiveTab('insights');
                              setShowInsightsDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <TrendingUp className="h-4 w-4 theme-text-primary" />
                            <span>Personal Stats Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('insights');
                              setShowInsightsDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Brain className="h-4 w-4 theme-text-primary" />
                            <span>Strength Archaeology</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('insights');
                              setShowInsightsDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4 theme-text-primary" />
                            <span>Transformation Heatmap</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('insights');
                              setShowInsightsDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Sparkles className="h-4 w-4 theme-text-primary" />
                            <span>Golden Seam Timeline</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Your Edge Tab with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setActiveTab('your-edge');
                      setShowYourEdgeDropdown(!showYourEdgeDropdown);
                    }}
                    onMouseEnter={() => setShowYourEdgeDropdown(true)}
                    onMouseLeave={() => setShowYourEdgeDropdown(false)}
                    data-active={activeTab === 'your-edge'}
                    className="nav-tab inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium gap-1"
                    title="Document setbacks today. Sell them as strengths tomorrow."
                  >
                    Your Edge
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* Your Edge Dropdown */}
                  <AnimatePresence>
                    {showYourEdgeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setShowYourEdgeDropdown(true)}
                        onMouseLeave={() => setShowYourEdgeDropdown(false)}
                        className="absolute left-0 top-full mt-2 w-64 rounded-xl shadow-lg bg-white dark:bg-kintsugi-dark-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setActiveTab('your-edge');
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Award className="h-4 w-4 theme-text-primary" />
                            <span>Performance Reviews</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('your-edge');
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <BookOpen className="h-4 w-4 theme-text-primary" />
                            <span>Portfolio Generator</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('your-edge');
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Target className="h-4 w-4 theme-text-primary" />
                            <span>Skills Growth Roadmap</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('your-edge');
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4 theme-text-primary" />
                            <span>Interview Prep</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('your-edge');
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <TrendingUp className="h-4 w-4 theme-text-primary" />
                            <span>Confidence Tracker</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('your-edge');
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Brain className="h-4 w-4 theme-text-primary" />
                            <span>Strength Visualizations</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <ThemeToggle />

              {/* Notifications Bell */}
              <div className="ml-4 relative notifications-container">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full text-kintsugi-dark-400 hover:theme-text-primary dark:theme-text-secondary dark:hover:theme-text-accent transition-colors"
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
                        {/* Quick Access to Weekly Digest */}
                        <button
                          onClick={navigateToWeeklyDigest}
                          className="w-full px-4 py-3 bg-gradient-to-r theme-bg-primary-light hover:opacity-90 transition-all border-b border-gray-200 dark:border-gray-700 text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full theme-gradient-to-r flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold theme-text-primary flex items-center gap-1">
                                View Your Weekly Digest
                                <ChevronRight className="h-3 w-3" />
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                See your week in review, achievements, and insights
                              </p>
                            </div>
                          </div>
                        </button>

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
                                  You've documented impact for {currentStreak} days straight. Keep up the momentum!
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
                                  You've created {totalEntries} impact entries. Your impact story is growing!
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
                                  Create your first impact entry to begin owning your impact!
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
                              Keep documenting to unlock more achievements
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About Philosophy Button */}
              <div className="ml-4">
                <button
                  onClick={() => setShowAboutPhilosophy(true)}
                  className="p-1 rounded-full text-kintsugi-dark-400 hover:theme-text-primary dark:theme-text-secondary dark:hover:theme-text-secondary transition-colors"
                  aria-label="About Kintsugi Philosophy"
                  title="About Kintsugi Philosophy"
                >
                  <Sparkles className="h-6 w-6" />
                </button>
              </div>

              {/* FAQ Help Button */}
              <div className="ml-4">
                <button
                  onClick={() => setShowFAQ(true)}
                  className="p-1 rounded-full text-kintsugi-dark-400 hover:theme-text-primary dark:theme-text-secondary dark:hover:theme-text-secondary transition-colors"
                  aria-label="Help & FAQ"
                  title="Help & FAQ"
                >
                  <HelpCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="ml-4 flex items-center relative user-dropdown-container">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full theme-bg-primary-light dark:theme-bg-primary theme-text-primary dark:theme-text-secondary text-sm font-medium">
                    {user?.avatar || '👤'}
                  </span>
                </div>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="ml-2 text-kintsugi-dark-700 dark:theme-text-secondary text-sm font-medium hover:theme-text-primary dark:hover:text-white transition-colors"
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
                className="inline-flex items-center justify-center p-2 rounded-md text-kintsugi-dark-500 hover:theme-text-primary hover:theme-bg-primary-light dark:hover:theme-bg-primary focus:outline-none"
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
                  data-active={activeTab === 'home'}
                  className="nav-tab-mobile block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('journal');
                    setShowMobileMenu(false);
                  }}
                  data-active={activeTab === 'journal'}
                  className="nav-tab-mobile block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                >
                  Impact Log
                </button>
                <button
                  onClick={() => {
                    setActiveTab('insights');
                    setShowMobileMenu(false);
                  }}
                  data-active={activeTab === 'insights'}
                  className="nav-tab-mobile block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                >
                  Insights
                </button>
                <button
                  onClick={() => {
                    setActiveTab('your-edge');
                    setShowMobileMenu(false);
                  }}
                  data-active={activeTab === 'your-edge'}
                  className="nav-tab-mobile block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  title="Document setbacks today. Sell them as strengths tomorrow."
                >
                  Your Edge
                </button>
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full text-lg theme-bg-primary-light theme-text-primary">
                        {user?.avatar || '👤'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-kintsugi-dark-700 dark:theme-text-secondary">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-sm font-medium text-kintsugi-dark-500 dark:theme-text-secondary">
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

              {/* Weekly Digest - AI-Powered Progress Summary */}
              <div ref={weeklyDigestRef}>
                <InAppWeeklyDigest />
              </div>

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

              {/* Personalized Cultural Wisdom - NEW FEATURE */}
              <PersonalizedWisdom user={user} />

              {/* Phase 13: Journey Richness Score - Gamified Authenticity */}
              <JourneyRichnessScore entries={journalEntries} />

              {/* Phase 13: Impermanence Reminder - Past Challenges Overcome */}
              <ImpermanenceReminder entries={journalEntries} />

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
              {/* AI Smart Search - Tagging & Semantic Search */}
              {journalEntries.length > 0 && (
                <AISmartTaggingSearch
                  entries={journalEntries.map(entry => ({
                    id: entry.id,
                    text: `${entry.accomplishment} ${entry.reflection || ''}`,
                    date: new Date(entry.date),
                    manualTags: entry.tags
                  }))}
                  onEntryClick={(entry) => {
                    setShowAccomplishments(true);
                  }}
                />
              )}

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
                    message: 'Building your Impact Loging habit, one entry at a time.',
                    duration: 3000
                  });
                }}
              />

              {/* Phase 13: Kintsugi Philosophy Prompts - Daily Wisdom */}
              <KintsugiPromptsCarousel
                onSelectPrompt={(prompt) => {
                  setShowAccomplishments(true);
                }}
              />

              {/* Phase 13: Transformation Heatmap - Golden Repair Days */}
              <TransformationHeatmap entries={journalEntries} monthsToShow={6} />

              {/* Phase 13: Golden Seam Timeline - Connect Challenges to Growth */}
              <GoldenSeamTimeline entries={journalEntries} />

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
                      Your Impact Log ({journalEntries.length})
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
                        className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow"
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
                        {/* Entry Actions */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-purple-200 dark:border-purple-700">
                          <button
                            onClick={() => {
                              setSelectedEntryForInterview(`${entry.accomplishment} ${entry.reflection || ''}`);
                              setShowInterviewPrep(true);
                            }}
                            className="flex-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Interview Prep
                          </button>
                          <button
                            onClick={() => setShowAccomplishments(true)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
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
                    Start your journey by documenting your first impact!
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

              {/* AI Confidence Score Tracker - Track Writing Confidence Over Time */}
              {journalEntries.length > 0 && (
                <AIConfidenceScoreTracker
                  entries={journalEntries.map(entry => ({
                    id: entry.id,
                    text: `${entry.accomplishment} ${entry.reflection || ''}`,
                    date: new Date(entry.date)
                  }))}
                />
              )}

              {/* Phase 3: Advanced Analytics */}
              <MoodTracker />
              <WordCloudVisualization />
              <PersonalStatsDashboard />

              {/* Phase 13: Strength Archaeology - Hidden Strengths from Adversity */}
              <StrengthArchaeology entries={journalEntries} />

              {/* Phase 13: Before/After Reframing - Transformation Stories */}
              <BeforeAfterReframing entries={journalEntries} />

              {/* Phase 13: Interactive Kintsugi Vessel - 3D Visualization */}
              <InteractiveKintsugiVessel entries={journalEntries} />

              {/* Phase 6: AI-Powered Features */}
              <AIInsightsDashboard />
              <AIPerformanceReviewGenerator />

              {/* Phase 13: Kintsugi Portfolio Generator - Professional Export */}
              <KintsugiPortfolioGenerator
                entries={journalEntries}
                userName={user?.name}
                userProfession={user?.profession}
              />

              {/* Phase 7: Professional Tools */}
              <ExportManager />
            </div>
          )}

          {activeTab === 'your-edge' && (
            <div className="space-y-6">
              {/* Your Edge Header */}
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

                  <div className="relative flex flex-col gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="h-8 w-8" />
                        Your Edge
                      </h2>
                      <p className="text-white/90 text-lg">
                        Transform your documented journey into powerful career assets
                      </p>
                    </div>

                    {/* Your Edge Philosophy */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <p className="text-white/90 text-sm leading-relaxed">
                        <span className="font-semibold">金継ぎ Kintsugi:</span> Your cracks—your challenges,
                        setbacks, and struggles—aren't weaknesses to hide. When filled with gold, they become
                        your <span className="font-bold">edge</span>. This is where others see obstacles, you
                        demonstrate resilience. Where others show perfection, you prove authenticity. Your complete
                        story, with all its texture, is what makes you remarkable.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <p className="text-white/70 text-xs font-medium">Impact Entries</p>
                        <p className="text-white text-2xl font-bold mt-1">
                          <AnimatedCounter value={totalEntries} className="inline" />
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <p className="text-white/70 text-xs font-medium">Current Streak</p>
                        <p className="text-white text-2xl font-bold mt-1">
                          <AnimatedCounter value={currentStreak} className="inline" />
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <p className="text-white/70 text-xs font-medium">Achievements</p>
                        <p className="text-white text-2xl font-bold mt-1">
                          <AnimatedCounter value={totalAchievements} className="inline" />
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <p className="text-white/70 text-xs font-medium">Journey Level</p>
                        <p className="text-white text-2xl font-bold mt-1">
                          <AnimatedCounter
                            value={(() => {
                              const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
                              return engagement.level || 1;
                            })()}
                            className="inline"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Auto-Profile Builder & Growth Mindset Tracker */}
              {user && journalEntries.length > 0 && (
                <AutoProfileBuilder
                  entries={journalEntries.map(entry => ({
                    id: entry.id,
                    text: `${entry.accomplishment} ${entry.reflection || ''}`,
                    date: new Date(entry.date)
                  }))}
                  currentProfile={user}
                  onUpdateProfile={(updates) => {
                    const updatedUser = { ...user, ...updates };
                    localStorage.setItem('kintsugiUser', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                    addToast({
                      type: 'success',
                      title: 'Profile Updated',
                      message: 'Your profile has been enhanced with AI suggestions!',
                      duration: 3000
                    });
                    window.dispatchEvent(new Event('kintsugi-data-updated'));
                  }}
                />
              )}

              {/* Skills Growth Roadmap - Identify Missing Skills & Experiences */}
              {user && (
                <AICareerGapAnalyzer
                  user={user}
                  targetRole={user.profession || 'Senior Professional'}
                />
              )}

              {/* Journey Richness Score - Profile Quality Overview */}
              <JourneyRichnessScore entries={journalEntries} />

              {/* Professional Export Tools Section */}
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  onClick={() => setExpandedExportTools(!expandedExportTools)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                        <Award className="h-6 w-6 theme-text-primary" />
                        Professional Export Tools
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Transform your documented journey into professional assets for your career
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedExportTools ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedExportTools && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        {/* AI Performance Review Generator */}
                        <div ref={performanceReviewRef} className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <AIPerformanceReviewGenerator />
                        </div>

                        {/* Kintsugi Portfolio Generator */}
                        <div ref={portfolioGeneratorRef} className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <KintsugiPortfolioGenerator
                            entries={journalEntries}
                            userName={user?.name}
                            userProfession={user?.profession}
                          />
                        </div>

                        {/* Export Manager */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <ExportManager />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Growth & Strength Visualizations */}
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  onClick={() => setExpandedGrowthViz(!expandedGrowthViz)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                        <TrendingUp className="h-6 w-6 theme-text-primary" />
                        Growth Visualizations
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        See your patterns, strengths, and transformation over time
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedGrowthViz ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedGrowthViz && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        {/* Personal Stats Dashboard */}
                        <PersonalStatsDashboard />

                        {/* Strength Archaeology */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <StrengthArchaeology entries={journalEntries} />
                        </div>

                        {/* Transformation Heatmap */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <TransformationHeatmap entries={journalEntries} monthsToShow={6} />
                        </div>

                        {/* Golden Seam Timeline */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <GoldenSeamTimeline entries={journalEntries} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Empty State for New Users */}
              {journalEntries.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 theme-border-light p-12 text-center"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 theme-bg-primary-light rounded-full flex items-center justify-center">
                      <Target className="h-10 w-10 theme-text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Start Building Your Edge
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Your Edge is built from your documented journey. Start by adding impact entries
                      to unlock powerful career tools, insights, and professional exports.
                    </p>
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="theme-btn-primary px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Your First Entry
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Engagement Tip */}
              {journalEntries.length > 0 && journalEntries.length < 10 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        Keep Building Your Edge
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                        You're off to a great start! The more you document, the more powerful your
                        professional exports become. Aim for at least 10-20 entries to unlock the full
                        potential of performance reviews and portfolio generation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                    <p className="text-sm text-kintsugi-dark-600 dark:theme-text-secondary">
                      Manage your data, backups, and preferences
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:theme-bg-primary-light rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-kintsugi-dark-600 dark:theme-text-secondary" />
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
                    Appearance
                  </button>
                  <button
                    onClick={() => setSettingsTab('voice')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      settingsTab === 'voice'
                        ? 'theme-border-primary theme-text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Voice Profile
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
                  <div className="space-y-6">
                    {/* Backup & Restore Button */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500 rounded-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Protect Your Data
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Never lose your journal entries, achievements, or progress. Create backups and restore from previous saves.
                          </p>
                          <button
                            onClick={() => {
                              setShowBackupPanel(true);
                              setShowSettings(false);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                          >
                            <Shield className="h-4 w-4" />
                            Open Backup & Restore
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Existing Data Management */}
                    <DataManagement
                      onDataImported={() => {
                        setShowSettings(false);
                      }}
                      onDataCleared={() => {
                        setShowSettings(false);
                      }}
                    />
                  </div>
                )}

                {settingsTab === 'appearance' && (
                  <ThemeSelector />
                )}

                {settingsTab === 'voice' && user && (
                  <VoiceProfileManager userId={user.id} />
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

      {/* About Philosophy Modal */}
      <AboutPhilosophyModal isOpen={showAboutPhilosophy} onClose={() => setShowAboutPhilosophy(false)} />

      {/* AI Interview Prep Generator Modal */}
      {showInterviewPrep && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowInterviewPrep(false);
            }
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-kintsugi-dark-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowInterviewPrep(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <AIInterviewPrepGenerator achievementText={selectedEntryForInterview} />
          </div>
        </div>
      )}

      {/* Auto Backup Reminder */}
      <AutoBackupReminder />

      {/* Backup & Restore Panel */}
      {showBackupPanel && (
        <BackupRestorePanel onClose={() => setShowBackupPanel(false)} />
      )}
    </div>
  );
}
