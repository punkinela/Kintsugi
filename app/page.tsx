'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Zap, Check, X, Menu, Bell, User, ChevronDown, ChevronUp, ChevronRight, Settings, Keyboard, Target, BookOpen, Award, Brain, Plus, Calendar, HelpCircle, TrendingUp, MessageSquare, Shield, FileText, Volume2, Download, Filter, TrendingDown, Minus, Activity, Map, Layers, Heart, Star, Users, BarChart3, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

// Phase 6: Advanced Features
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
import JourneyProgressWidget from '@/components/JourneyProgressWidget';

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

// Phase 14: Advanced Enhancements
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

// Journey App Components
import KintsugiJournalInsights from '@/components/KintsugiJournalInsights';
import KintsugiUserJourney from '@/components/KintsugiUserJourney';
import KintsugiInsightsDashboard from '@/components/KintsugiInsightsDashboard';
import PotteryStyleChanger from '@/components/PotteryStyleChanger';
import DashboardCard from '@/components/DashboardCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import AIBadge from '@/components/AIBadge';
import GrowthMindsetTracker from '@/components/GrowthMindsetTracker';

// Premium Features
import { PremiumProvider } from '@/contexts/PremiumContext';
import PremiumBadge from '@/components/PremiumBadge';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import DevModeToggle from '@/components/DevModeToggle';
import StrengthDiscovery from '@/components/StrengthDiscovery';
import ResumeGenerator from '@/components/ResumeGenerator';
import ResilienceMap from '@/components/ResilienceMap';
import BiasResearchShowcase from '@/components/BiasResearchShowcase';

import type { BiasInsight, UserProfile } from '@/types';
import { JournalEntry, Achievement } from '@/types/engagement';
import { EnhancedAchievement } from '@/types/gamification';
import { shouldPromptFeedback, getAnalyticsData, getAllFeedback, exportAnalyticsData, exportFeedbackAsCSV, exportAnalyticsSummaryAsCSV, exportCompleteDataAsCSV, downloadFile } from '@/utils/analytics';
import { analyzeSentiment, analyzeFeedbackSentiments, extractKeywords, analyzeDemographics, getEngagementOverTime, getRatingsTrend, compareWeekOverWeek, analyzeCohorts, analyzeFunnel, getUserJourney } from '@/utils/enhancedAnalytics';
import { AnalyticsData, UserFeedback } from '@/types/analytics';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { initializeTheme, getCurrentThemeColors } from '@/utils/themes';
import { checkAndUnlockAchievements, getAchievementProgress, getEngagementData, updateStreakFromEntries } from '@/utils/engagement';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// Color palette for charts
const COLORS = {
  primary: '#D4AF37',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899'
};

const SENTIMENT_COLORS = {
  positive: COLORS.success,
  negative: COLORS.danger,
  neutral: '#6B7280'
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  color?: string;
};

const StatCard = ({ title, value, icon, trend, trendType = 'neutral', color = 'theme-gradient-to-r' }: StatCardProps) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4" />,
    down: <TrendingDown className="h-4 w-4" />,
    neutral: <Minus className="h-4 w-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-kintsugi-dark-800 overflow-hidden shadow-lg rounded-xl border theme-border-light dark:theme-border-primary/50"
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-r ${color}`}>
            <div className="text-white">{icon}</div>
          </div>
          <div className="flex-1 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
              </dd>
              {trend && (
                <dd className={`flex items-center text-sm ${trendColors[trendType]} mt-1`}>
                  {trendIcons[trendType]}
                  <span className="ml-1">{trend}</span>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'journal' | 'insights' | 'your-edge' | 'your-journey'>('home');

  // Your Journey Tab State
  const [activeJourneyTab, setActiveJourneyTab] = useState<'overview' | 'journal' | 'demographics' | 'journey' | 'insights' | 'growth' | 'settings'>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [demographicsRefresh, setDemographicsRefresh] = useState(0);
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
  const [newAchievement, setNewAchievement] = useState<EnhancedAchievement | null>(null);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [selectedEntryForInterview, setSelectedEntryForInterview] = useState<string>('');
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [showYourEdgeDropdown, setShowYourEdgeDropdown] = useState(false);
  const [showInsightsDropdown, setShowInsightsDropdown] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState<string>('');

  // Weekly Digest ref for navigation
  const weeklyDigestRef = useRef<HTMLDivElement>(null);

  // Your Edge section refs for dropdown navigation
  const performanceReviewRef = useRef<HTMLDivElement>(null);
  const portfolioGeneratorRef = useRef<HTMLDivElement>(null);
  const skillsRoadmapRef = useRef<HTMLDivElement>(null);
  const strengthDiscoveryRef = useRef<HTMLDivElement>(null);
  const resumeGeneratorRef = useRef<HTMLDivElement>(null);
  const resilienceMapRef = useRef<HTMLDivElement>(null);
  const interviewPrepRef = useRef<HTMLDivElement>(null);
  const confidenceTrackerRef = useRef<HTMLDivElement>(null);
  const strengthVizRef = useRef<HTMLDivElement>(null);

  // Navigation helper to scroll to specific sections
  const navigateToSection = (tab: 'home' | 'journal' | 'insights' | 'your-edge', ref: React.RefObject<HTMLDivElement>) => {
    setActiveTab(tab);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // Small delay to ensure tab content is rendered
  };

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

        // Debug: Check what's in kintsugi_engagement
        console.log('🔍 Quick Entry data (kintsugi_engagement):', entries.length, 'entries');
        if (entries.length > 0) {
          console.log('   First entry:', entries[0]);
        }

        // Also load Growth Mindset reflections and convert them to journal entries for the vessel
        const growthReflections = JSON.parse(localStorage.getItem('imperfectionReflections') || '[]');
        console.log('🔍 Growth Mindset data (imperfectionReflections):', growthReflections.length, 'entries');
        if (growthReflections.length > 0) {
          console.log('   First reflection:', growthReflections[0]);
        }

        const growthEntries = growthReflections.map((reflection: any) => ({
          id: reflection.id,
          date: reflection.date,
          accomplishment: `${reflection.imperfection} → ${reflection.transformation}`,
          reflection: reflection.lesson,
          category: 'Growth Mindset',
          tags: [reflection.category, 'growth'],
        }));

        // Combine both data sources so the vessel can see ALL your work
        const allEntries = [...entries, ...growthEntries];
        console.log('🏺 TOTAL entries being passed to vessel:', allEntries.length);
        console.log('   - Quick Entries:', entries.length);
        console.log('   - Growth Entries:', growthEntries.length);

        setJournalEntries(allEntries);
        setFilteredJournalEntries(allEntries);

        // Update streak based on impact entries (original entries only)
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
        // @ts-ignore - Temporary: old Achievement type, will migrate to EnhancedAchievement
        setNewAchievement(newAchievements[0] as any);
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

  // Load analytics data for Your Journey tab
  useEffect(() => {
    if (!isClient || activeTab !== 'your-journey') return;

    const loadAnalyticsData = async () => {
      try {
        setIsLoadingAnalytics(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const analyticsData = getAnalyticsData();
        const feedbackData = getAllFeedback();

        setAnalytics(analyticsData);
        setFeedback(feedbackData);
        setAnalyticsError(null);
      } catch (err) {
        setAnalyticsError('Failed to load analytics data');
        console.error('Analytics loading error:', err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    loadAnalyticsData();
  }, [isClient, activeTab, dateRange, demographicsRefresh]);

  // Reload demographics when activeJourneyTab changes
  useEffect(() => {
    if (activeJourneyTab === 'demographics') {
      setDemographicsRefresh(prev => prev + 1);
    }
  }, [activeJourneyTab]);

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

  // Analytics calculations for Your Journey tab
  const sentimentData = useMemo(() => {
    if (!feedback.length) return { positive: 0, neutral: 0, negative: 0 };
    return analyzeFeedbackSentiments(feedback);
  }, [feedback]);

  const keywords = useMemo(() => {
    if (!feedback.length) return [];
    return extractKeywords(feedback);
  }, [feedback]);

  const demographics = useMemo(() => {
    if (!feedback.length || activeJourneyTab !== 'demographics') return null;
    return analyzeDemographics(feedback);
  }, [feedback, activeJourneyTab, demographicsRefresh]);

  const engagementTrend = useMemo(() => {
    if (!analytics) return [];
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : undefined;
    return getEngagementOverTime(days);
  }, [analytics, dateRange]);

  const weeklyComparison = useMemo(() => {
    if (!analytics || !analytics.totalAccomplishments) return null;
    // Calculate weekly comparison based on analytics data
    const currentWeek = analytics.totalAccomplishments;
    const previousWeek = Math.max(0, currentWeek - 5); // Simplified comparison
    return compareWeekOverWeek(currentWeek, previousWeek);
  }, [analytics]);

  // Handle profile save
  const handleProfileSave = (profileData: UserProfile) => {
    // Preserve existing user data if editing
    const existingUser = user || {} as Partial<UserProfile>;

    // Check if this is a new profile or editing existing
    const isNewProfile = !existingUser.name || existingUser.name === 'Guest' || !existingUser.id;

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

    // Award XP for first-time profile completion
    if (isNewProfile) {
      const profileCompletionXP = 50;

      // Update engagement data with XP
      if (typeof window !== 'undefined') {
        const engagement = JSON.parse(localStorage.getItem('kintsugi_engagement') || '{}');
        const currentXP = engagement.xp || 0;
        engagement.xp = currentXP + profileCompletionXP;
        localStorage.setItem('kintsugi_engagement', JSON.stringify(engagement));
      }

      // Show celebratory toast for new profile
      addToast({
        type: 'success',
        title: '🎉 Welcome to Kintsugi!',
        message: `Profile completed! You earned ${profileCompletionXP} XP. Start documenting your impact!`,
        duration: 5000
      });
    } else {
      // Show regular update toast for profile edits
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been saved successfully!',
        duration: 3000
      });
    }

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

  // Analytics Export Handlers
  const handleExportJSON = () => {
    const data = exportAnalyticsData();
    downloadFile(JSON.stringify(data, null, 2), 'kintsugi-analytics.json', 'application/json');
    addToast({ type: 'success', title: 'Export Successful', message: 'Analytics data exported as JSON' });
  };

  const handleExportFeedbackCSV = () => {
    const csv = exportFeedbackAsCSV();
    downloadFile(csv, 'kintsugi-feedback.csv', 'text/csv');
    addToast({ type: 'success', title: 'Export Successful', message: 'Feedback exported as CSV' });
  };

  const handleExportCompleteCSV = () => {
    const csv = exportCompleteDataAsCSV();
    downloadFile(csv, 'kintsugi-complete-data.csv', 'text/csv');
    addToast({ type: 'success', title: 'Export Successful', message: 'Complete data exported as CSV' });
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
      description: 'Go to Impact Log tab',
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

  // Generate bias insight with more variety
  const generateBiasInsight = async () => {
    setBiasInsightLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Expanded insight variations
      const insights = [
        // Productivity patterns
        {
          description: "Based on your recent reflections, I notice you tend to be hard on yourself about productivity.",
          reflection: "You might be overlooking how much you actually accomplish. Consider tracking small wins too.",
          research: { citation: 'Baumeister & Tierney (2011). Willpower', year: 2011, finding: 'People who celebrate small wins maintain higher motivation and achieve more over time.' }
        },
        {
          description: "I see a pattern where you focus more on tasks left undone rather than what you've completed.",
          reflection: "This is a common productivity bias. Try ending each day by reviewing what you DID accomplish.",
          research: { citation: 'Amabile & Kramer (2011). The Progress Principle', year: 2011, finding: 'Small wins and tracking progress are the most powerful motivators in professional work.' }
        },
        {
          description: "Your entries suggest you measure productivity in hours rather than outcomes.",
          reflection: "Time spent isn't always the best measure. Some of your most valuable work might take less time.",
          research: { citation: 'Newport, C. (2016). Deep Work', year: 2016, finding: 'Quality of focused work matters far more than quantity of hours spent working.' }
        },

        // Meeting expectations
        {
          description: "I notice you tend to be hard on yourself about meeting expectations.",
          reflection: "Whose expectations are these? Sometimes we hold ourselves to standards others don't even expect.",
          research: { citation: 'Brown, B. (2012). Daring Greatly', year: 2012, finding: 'Perfectionism is not the same as striving for excellence. It is correlated with depression and anxiety.' }
        },
        {
          description: "Your reflections show a pattern of comparing yourself to an idealized standard.",
          reflection: "Consider: Are these expectations realistic, or are you using them to feel inadequate?",
          research: { citation: 'Gilbert, P. (2009). The Compassionate Mind', year: 2009, finding: 'Self-compassion leads to greater resilience and achievement than self-criticism.' }
        },
        {
          description: "I see you often worry about disappointing others, even when there's no evidence they're disappointed.",
          reflection: "This might be more about your internal critic than external reality. What would others actually say?",
          research: { citation: 'Neff, K. (2011). Self-Compassion', year: 2011, finding: 'People who practice self-compassion have lower anxiety and higher motivation than those who are self-critical.' }
        },

        // Perfectionism
        {
          description: "Based on your recent reflections, I notice perfectionist thinking patterns.",
          reflection: "Perfectionism often masks a fear of judgment. What would 'good enough' look like?",
          research: { citation: 'Dweck, C. (2006). Mindset', year: 2006, finding: 'Growth mindset (learning-focused) leads to greater achievement than fixed mindset (perfection-focused).' }
        },
        {
          description: "Your entries suggest you delay starting or finishing tasks until conditions are 'perfect'.",
          reflection: "Progress beats perfection. What's one imperfect step you could take today?",
          research: { citation: 'Brach, T. (2003). Radical Acceptance', year: 2003, finding: 'Accepting imperfection paradoxically leads to better performance and wellbeing.' }
        },
        {
          description: "I notice you focus on flaws rather than celebrating what went well.",
          reflection: "Your brain's negativity bias is at work. Try: What went well? What did I learn? What's one thing to improve?",
          research: { citation: 'Hanson, R. (2013). Hardwiring Happiness', year: 2013, finding: 'Deliberately savoring positive experiences rewires the brain for resilience and confidence.' }
        },

        // Growth and learning
        {
          description: "Your reflections show you're learning and growing, even when you don't acknowledge it.",
          reflection: "Growth isn't always linear or dramatic. Sometimes it's quiet and cumulative.",
          research: { citation: 'Tough, P. (2012). How Children Succeed', year: 2012, finding: 'Character strengths like grit and resilience matter more than talent for long-term success.' }
        },
        {
          description: "I see evidence of you developing new skills, even if you're not giving yourself credit.",
          reflection: "Compare yourself to your past self, not to others. Where have you grown?",
          research: { citation: 'Clear, J. (2018). Atomic Habits', year: 2018, finding: 'Small, consistent improvements compound into remarkable results over time.' }
        },

        // Resilience patterns
        {
          description: "Your entries show you bounce back from setbacks, even when you don't recognize it.",
          reflection: "Resilience isn't about not falling - it's about getting back up. You're doing that.",
          research: { citation: 'Southwick & Charney (2012). Resilience', year: 2012, finding: 'Resilient people reframe challenges as opportunities for growth rather than threats.' }
        },
        {
          description: "I notice you've handled difficult situations this week that might have derailed you before.",
          reflection: "Your capacity to handle challenges is growing. Are you acknowledging this progress?",
          research: { citation: 'Masten, A. (2014). Ordinary Magic', year: 2014, finding: 'Resilience is built through successfully navigating small challenges, not just big ones.' }
        }
      ];

      // Pick random insight
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];

      setBiasInsight({
        ...biasInsight,
        description: randomInsight.description,
        reflection: randomInsight.reflection,
        actionStep: 'Reflect on this insight in your Impact Log',
        research: [randomInsight.research]
      });
      setShowBiasInsight(true);
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setBiasInsightLoading(false);
    }
  };

  // Option C: Show insight first, then open Quick Entry
  const handleDocumentImpact = async () => {
    // Step 1: Generate and show insight
    await generateBiasInsight();

    // Step 2: After showing insight, automatically open Quick Entry after user sees it
    // The insight modal will show for a moment, then we open the entry modal
    setTimeout(() => {
      setShowAccomplishments(true);
    }, 3000); // Give user 3 seconds to read the insight
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
    <PremiumProvider>
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
                <Sparkles className="h-8 w-8 theme-text-primary" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Kintsugi</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 hidden md:inline">Turn setbacks into your career's golden seams</span>
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance('keen tsoo gee');
                    utterance.lang = 'en-US';
                    utterance.rate = 0.7;
                    utterance.pitch = 1.0;
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="ml-3 px-3 py-1.5 text-xs bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-lg hidden lg:flex items-center gap-2 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all group"
                  title="Click to hear pronunciation"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    金継ぎ
                    <span className="mx-1">kin</span>
                    <span className="mx-1">•</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">TSU</span>
                    <span className="mx-1">•</span>
                    <span className="mx-1">gi</span>
                  </span>
                  <Volume2 className="h-3 w-3 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                </button>
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
                  Golden Seams
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
                          <button
                            onClick={() => {
                              setActiveTab('your-journey');
                              setActiveJourneyTab('growth');
                              setShowInsightsDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <Target className="h-4 w-4 theme-text-primary" />
                            <span>Growth Mindset Tracker</span>
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
                              navigateToSection('your-edge', performanceReviewRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 theme-text-primary" />
                              <span>Performance Reviews</span>
                            </div>
                            <PremiumBadge size="sm" />
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', portfolioGeneratorRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 theme-text-primary" />
                              <span>Portfolio Generator</span>
                            </div>
                            <PremiumBadge size="sm" />
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', skillsRoadmapRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 theme-text-primary" />
                              <span>Skills Growth Roadmap</span>
                            </div>
                            <PremiumBadge size="sm" />
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', strengthDiscoveryRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 theme-text-primary" />
                              <span>Find Your Gold</span>
                            </div>
                            <PremiumBadge size="sm" />
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', resumeGeneratorRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 theme-text-primary" />
                              <span>Golden Story Builder</span>
                            </div>
                            <PremiumBadge size="sm" />
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', resilienceMapRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 theme-text-primary" />
                              <span>Your Kintsugi Vessel</span>
                            </div>
                            <PremiumBadge size="sm" />
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', interviewPrepRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4 theme-text-primary" />
                            <span>Interview Prep</span>
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', confidenceTrackerRef);
                              setShowYourEdgeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-kintsugi-dark-700 flex items-center gap-2"
                          >
                            <TrendingUp className="h-4 w-4 theme-text-primary" />
                            <span>Confidence Tracker</span>
                          </button>
                          <button
                            onClick={() => {
                              navigateToSection('your-edge', strengthVizRef);
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

                {/* Your Journey Tab */}
                <button
                  onClick={() => setActiveTab('your-journey')}
                  data-active={activeTab === 'your-journey'}
                  className="nav-tab inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  title="Explore your transformation journey with powerful analytics and insights"
                >
                  Your Journey
                </button>
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
                <button
                  onClick={() => {
                    setActiveTab('your-journey');
                    setShowMobileMenu(false);
                  }}
                  data-active={activeTab === 'your-journey'}
                  className="nav-tab-mobile block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
                  title="Explore your transformation journey with powerful analytics and insights"
                >
                  Your Journey
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
                onGetInsight={handleDocumentImpact}
                isLoading={biasInsightLoading}
                journalEntries={journalEntries}
              />

              {/* Journey Progress Widget - Growth Mindset Tracker */}
              <JourneyProgressWidget />

              {/* Fresh Start Welcome - Research-Backed Return Messaging */}
              {user && <FreshStartWelcome userName={user.name} />}

              {/* Weekly Digest - Automated Progress Summary */}
              <div ref={weeklyDigestRef}>
                <InAppWeeklyDigest
                  onLogAchievement={() => setActiveTab('journal')}
                />
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

              {/* Interactive Kintsugi Vessel - Your Golden Jar */}
              {journalEntries.length > 0 && (
                <InteractiveKintsugiVessel entries={journalEntries} />
              )}

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
              {/* Intelligent Search - Tagging & Semantic Search */}
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
                    message: 'Building your Impact Log habit, one entry at a time.',
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
                        Discover patterns, analyze growth, and get automated insights
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
                      <p className="text-white/80 text-sm font-medium">Automated Analyses</p>
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

              {/* Confidence Score Tracker - Track Writing Confidence Over Time */}
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

              {/* Phase 6: Advanced Features */}
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

              {/* Bias Research Showcase - The Science Behind Kintsugi */}
              <BiasResearchShowcase />
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
                      message: 'Your profile has been enhanced with automated suggestions!',
                      duration: 3000
                    });
                    window.dispatchEvent(new Event('kintsugi-data-updated'));
                  }}
                />
              )}

              {/* Skills Growth Roadmap - Identify Missing Skills & Experiences */}
              <div ref={skillsRoadmapRef}>
                {user && (
                  <AICareerGapAnalyzer
                    user={user}
                    targetRole={user.profession || 'Senior Professional'}
                  />
                )}
              </div>

              {/* Find Your Gold - Skills Revealed Through Struggles */}
              <div ref={strengthDiscoveryRef}>
                <StrengthDiscovery entries={journalEntries} />
              </div>

              {/* Golden Story Builder - Transform Your Journey */}
              <div ref={resumeGeneratorRef}>
                <ResumeGenerator entries={journalEntries} />
              </div>

              {/* Resilience Map - Pattern Recognition & Golden Seams */}
              <div ref={resilienceMapRef}>
                <ResilienceMap entries={journalEntries} />
              </div>

              {/* Journey Richness Score - Profile Quality Overview */}
              <JourneyRichnessScore entries={journalEntries} />

              {/* Professional Export Tools Section */}
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                    <Award className="h-6 w-6 theme-text-primary" />
                    Professional Export Tools
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transform your documented journey into professional assets for your career
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Performance Review Generator */}
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
              </div>

              {/* Growth & Strength Visualizations */}
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                    <TrendingUp className="h-6 w-6 theme-text-primary" />
                    Growth Visualizations
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See your patterns, strengths, and transformation over time
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Personal Stats Dashboard */}
                  <PersonalStatsDashboard />

                  {/* Strength Archaeology */}
                  <div ref={strengthVizRef} className="border-t border-gray-200 dark:border-gray-700 pt-6">
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
          {/* YOUR JOURNEY TAB */}
          {activeTab === 'your-journey' && (
            <div className="space-y-6">
              {/* Journey Header with Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="theme-gradient-to-br rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(to bottom right, var(--theme-primary), var(--theme-secondary), var(--theme-accent))'
                }}
              >
                <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                  <div className="relative flex flex-col gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Map className="h-8 w-8" />
                        Your Journey
                      </h2>
                      <p className="text-white/90 text-lg">
                        Your Transformation Journey, Visualized
                      </p>
                    </div>
                  </div>
                </div>

                {/* Journey Sub-Tabs */}
                <div className="flex gap-2 flex-wrap px-6 pb-6">
                  {[
                    { id: 'overview', label: 'Golden Gallery', icon: Sparkles },
                    { id: 'journal', label: 'Your Golden Seams', icon: BookOpen },
                    { id: 'demographics', label: 'Your Profile', icon: User },
                    { id: 'journey', label: 'Transformation Path', icon: Map },
                    { id: 'insights', label: 'Patterns of Repair', icon: Brain },
                    { id: 'growth', label: 'Growth Mindset', icon: TrendingUp },
                    { id: 'settings', label: 'Workshop Tools', icon: Settings }
                  ].map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setActiveJourneyTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                        activeJourneyTab === tab.id
                          ? 'bg-white text-kintsugi-gold-700 shadow-lg scale-105'
                          : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Date Range Filter & Export */}
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-4 py-2 bg-white dark:bg-kintsugi-dark-800 border theme-border-light dark:theme-border-primary/50 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-kintsugi-gold-500"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </button>
                  <button
                    onClick={handleExportFeedbackCSV}
                    className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Feedback CSV
                  </button>
                  <button
                    onClick={handleExportCompleteCSV}
                    className="inline-flex items-center px-3 py-2 theme-bg-primary hover:bg-kintsugi-gold-700 text-white rounded-md shadow-sm transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Complete Data
                  </button>
                </div>
              </div>

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="flex-shrink-0 bg-blue-500 rounded-lg p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    🪞 Your Personal Reflection Mirror
                  </h3>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    This is your personal reflection mirror. 🪞
                  </p>
                </div>
              </motion.div>

              {/* Loading State */}
              {isLoadingAnalytics && (
                <LoadingSkeleton />
              )}

              {/* Error State */}
              {analyticsError && (
                <EmptyState
                  icon={Shield}
                  title="Error Loading Analytics"
                  description={analyticsError}
                  iconColor="text-red-500"
                />
              )}

              {/* Tab Contents */}
              {!isLoadingAnalytics && !analyticsError && analytics && (
                <>
                  {/* GOLDEN GALLERY TAB - Overview/Stats */}
                  {activeJourneyTab === 'overview' && (
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-6"
                      >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          Your Golden Gallery 🏺
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                          Welcome to your personal transformation archive. Every number here represents
                          a moment you chose to honor your cracks and fill them with gold.
                        </p>
                      </motion.div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                          title="Your Journey"
                          value={analytics.activeUsers === 1 ? "Active" : analytics.activeUsers}
                          icon={<Sparkles className="h-6 w-6" />}
                          trend={weeklyComparison ? `${Math.abs(weeklyComparison.changePercent).toFixed(1)}% this week` : undefined}
                          trendType={weeklyComparison?.trend}
                          color="from-amber-500 to-orange-500"
                        />
                        <StatCard
                          title="Golden Moments"
                          value={analytics.totalAccomplishments.toLocaleString()}
                          icon={<Award className="h-6 w-6" />}
                          trend={`${analytics.averageStreak} day healing streak`}
                          trendType="up"
                          color="from-purple-500 to-pink-500"
                        />
                        <StatCard
                          title="Healing Resonance"
                          value={analytics.averageRating ? `${analytics.averageRating.toFixed(1)} ❤️` : 'N/A'}
                          icon={<Heart className="h-6 w-6" />}
                          trend={analytics.feedbackCount > 0 ? `${analytics.feedbackCount} reflections` : 'No feedback yet'}
                          trendType={analytics.averageRating >= 4 ? 'up' : 'neutral'}
                          color="from-pink-500 to-rose-500"
                        />
                        <StatCard
                          title="Transformation Energy"
                          value={`${sentimentData.positive}/${feedback.length || 1}`}
                          icon={<Sparkles className="h-6 w-6" />}
                          trend="Glowing with hope"
                          trendType="up"
                          color="from-green-500 to-teal-500"
                        />
                      </div>

                      {/* Engagement Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-kintsugi-dark-800 p-6 rounded-lg shadow-lg border theme-border-light dark:theme-border-primary/50"
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 theme-text-primary" />
                          The Golden Wave
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          Watch how healing spreads through time ✨
                        </p>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={engagementTrend}>
                            <defs>
                              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                              dataKey="date"
                              stroke="#6B7280"
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #D4AF37',
                                borderRadius: '8px',
                                color: '#fff'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={COLORS.primary}
                              fillOpacity={1}
                              fill="url(#colorEngagement)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                    </div>
                  )}

                  {/* YOUR GOLDEN SEAMS TAB - Journal Insights */}
                  {activeJourneyTab === 'journal' && (
                    <div className="space-y-6">
                      <KintsugiJournalInsights entries={journalEntries} />
                      <JourneyRichnessScore entries={journalEntries} />
                      <TransformationHeatmap entries={journalEntries} monthsToShow={6} />
                      <GoldenSeamTimeline entries={journalEntries} />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StreakCalendar entries={journalEntries} />
                        <JournalProgressDashboard entries={journalEntries} />
                      </div>
                      <MilestoneTracker
                        entryCount={journalEntries.length}
                        currentStreak={currentStreak}
                      />
                    </div>
                  )}

                  {/* YOUR PROFILE TAB - Demographics */}
                  {activeJourneyTab === 'demographics' && demographics && (
                    <div className="space-y-6">
                      {(() => {
                        const userProfileStr = typeof window !== 'undefined' ? localStorage.getItem('kintsugiUser') : null;
                        if (userProfileStr) {
                          try {
                            const profile = JSON.parse(userProfileStr);
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r theme-bg-primary-light border-2 theme-border-accent dark:theme-border-primary/50 rounded-lg p-6"
                              >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                  <User className="h-5 w-5 theme-text-primary" />
                                  Your Profile
                                </h3>
                                <div className="space-y-2">
                                  <p className="text-sm"><span className="font-medium">Name:</span> {profile.name}</p>
                                  {profile.email && <p className="text-sm"><span className="font-medium">Email:</span> {profile.email}</p>}
                                  {profile.role && <p className="text-sm"><span className="font-medium">Role:</span> {profile.role}</p>}
                                  {profile.company && <p className="text-sm"><span className="font-medium">Company:</span> {profile.company}</p>}
                                  {profile.yearsOfExperience && <p className="text-sm"><span className="font-medium">Experience:</span> {profile.yearsOfExperience} years</p>}
                                </div>
                              </motion.div>
                            );
                          } catch (e) {
                            return null;
                          }
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  {/* TRANSFORMATION PATH TAB - User Journey */}
                  {activeJourneyTab === 'journey' && (
                    <KintsugiUserJourney entries={journalEntries} user={user} />
                  )}

                  {/* PATTERNS OF REPAIR TAB - Pattern Insights */}
                  {activeJourneyTab === 'insights' && (
                    <div className="space-y-6">
                      <InAppWeeklyDigest />
                      <KintsugiInsightsDashboard feedback={feedback} />
                      <AIInsightsDashboard />
                      {user && journalEntries.length > 0 && (
                        <AutoProfileBuilder
                          entries={journalEntries.map(entry => ({
                            id: entry.id,
                            text: `${entry.accomplishment} ${entry.reflection || ''}`,
                            date: new Date(entry.date)
                          }))}
                          currentProfile={user}
                          onUpdateProfile={(updates) => {
                            console.log('Profile updates (journey view):', updates);
                          }}
                        />
                      )}
                      <StrengthArchaeology entries={journalEntries} />
                      <InteractiveKintsugiVessel entries={journalEntries} />

                      {/* Professional Export Tools */}
                      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          Professional Export Tools
                        </h3>
                        <div className="mb-6">
                          <AIPerformanceReviewGenerator />
                        </div>
                        <ExportManager />
                      </div>
                    </div>
                  )}

                  {/* GROWTH MINDSET TAB */}
                  {activeJourneyTab === 'growth' && (
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <GrowthMindsetTracker />
                      </motion.div>
                    </div>
                  )}

                  {/* WORKSHOP TOOLS TAB - Settings */}
                  {activeJourneyTab === 'settings' && (
                    <div className="space-y-6">
                      <PotteryStyleChanger />
                      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          Appearance Settings
                        </h2>
                        <ThemeSelector />
                      </div>
                      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          Voice Profile Settings
                        </h2>
                        <VoiceProfileManager userId={user?.id || '1'} />
                      </div>
                    </div>
                  )}
                </>
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
          onTakeAction={() => {
            setActiveTab('journal');
            setShowBiasInsight(false);
          }}
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
                  <VoiceProfileManager
                    userId={user.id}
                    onClose={() => setShowSettings(false)}
                  />
                )}

                {settingsTab === 'diagnostic' && (
                  <div className="space-y-6">
                    <DevModeToggle />
                    <DataDiagnostic />
                  </div>
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

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showPremiumUpgrade}
        onClose={() => setShowPremiumUpgrade(false)}
        featureName={premiumFeatureName}
      />
    </div>
    </PremiumProvider>
  );
}
