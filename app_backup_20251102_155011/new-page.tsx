'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  Settings, 
  Info, 
  Award, 
  BookOpen, 
  Bell, 
  BarChart3, 
  Zap, 
  Target, 
  HelpCircle, 
  Sun,
  Moon,
  X,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Menu,
  User,
  RefreshCw,
  Flame,
  Activity,
  Calendar,
  MessageCircle,
  Twitter,
  Instagram,
  Github,
  MessageSquare
} from 'lucide-react';

// Import components
import ThemeToggle from '@/components/ThemeToggle';
import XPBar from '@/components/XPBar';
import ProfileSetup from '@/components/ProfileSetup';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarType: 'emoji' | 'image';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface Affirmation {
  id: string;
  text: string;
  category: 'accomplishment' | 'strength' | 'growth' | 'impact' | 'bias-awareness';
  createdAt: string;
}

export default function Home() {
  // State
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'User',
    email: 'user@example.com',
    avatar: '👤',
    avatarType: 'emoji',
    preferences: { theme: 'system', notifications: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [showSetup, setShowSetup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation>({
    id: '1',
    text: 'You are capable of amazing things.',
    category: 'accomplishment',
    createdAt: new Date().toISOString()
  });
  
  const [streakInfo, setStreakInfo] = useState({ current: 0, longest: 0 });
  
  // Modal states
  const [showBiasModal, setShowBiasModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  
  // Data states
  const [achievements, setAchievements] = useState<any[]>([]);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  
  // Message states
  const [checkInMessage, setCheckInMessage] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);
  
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Celebration state
  const [celebration, setCelebration] = useState<{
    type: 'xp' | 'level-up' | 'achievement' | 'challenge' | 'reward';
    title: string;
    description: string;
    icon: string;
    xp: number;
    points: number;
  }>({
    type: 'xp',
    title: '',
    description: '',
    icon: '🎉',
    xp: 0,
    points: 0
  });

  // Handlers
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleProfileComplete = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setShowSetup(false);
    // Save to localStorage or API
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const fetchAffirmation = useCallback(async () => {
    try {
      // Simulate API call
      const newAffirmation: Affirmation = {
        id: Date.now().toString(),
        text: 'You are making great progress!',
        category: 'accomplishment',
        createdAt: new Date().toISOString()
      };
      setCurrentAffirmation(newAffirmation);
    } catch (error) {
      console.error('Error fetching affirmation:', error);
    }
  }, []);

  // Effects
  useEffect(() => {
    // Load profile from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setShowSetup(true);
    }
    
    // Initial data fetch
    fetchAffirmation();
    
    // Set loading to false after initial load
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [fetchAffirmation]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-12 h-12 text-kintsugi-gold-500" />
        </motion.div>
      </div>
    );
  }

  // Profile setup
  if (showSetup) {
    return (
      <div className="min-h-screen bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900 p-4 flex items-center justify-center">
        <ProfileSetup 
          onComplete={handleProfileComplete} 
          initialProfile={profile}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kintsugi-gold-50 dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-kintsugi-gold-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 bg-clip-text text-transparent">
              Kintsugi
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a href="#" className="text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">
                Home
              </a>
              <a href="#" className="text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">
                Journal
              </a>
              <a href="#" className="text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">
                Achievements
              </a>
              <a href="#" className="text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">
                Challenges
              </a>
            </nav>
            
            <div className="h-6 w-px bg-kintsugi-gold-200 dark:bg-kintsugi-gold-800/50"></div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="p-2 rounded-full hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors">
                <Bell className="w-5 h-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
              ) : (
                <Menu className="w-6 h-6 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-3 space-y-4 bg-white dark:bg-kintsugi-dark-800 border-t border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
                <nav className="flex flex-col space-y-3">
                  <a href="#" className="px-3 py-2 rounded-lg text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors">
                    Home
                  </a>
                  <a href="#" className="px-3 py-2 rounded-lg text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors">
                    Journal
                  </a>
                  <a href="#" className="px-3 py-2 rounded-lg text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors">
                    Achievements
                  </a>
                  <a href="#" className="px-3 py-2 rounded-lg text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors">
                    Challenges
                  </a>
                </nav>
                <div className="pt-4 border-t border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-kintsugi-gold-700 dark:text-kintsugi-gold-300">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <XPBar compact />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Card */}
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 shadow-sm border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                    Welcome back{profile?.name ? `, ${profile.name}` : ''}!
                  </h2>
                  <p className="text-kintsugi-gold-600 dark:text-kintsugi-gold-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowQuickCapture(true)}
                    className="px-4 py-2 bg-kintsugi-gold-500 hover:bg-kintsugi-gold-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Quick Capture</span>
                  </button>
                  <button
                    onClick={() => setShowProfileView(true)}
                    className="w-12 h-12 rounded-full bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 flex items-center justify-center hover:bg-kintsugi-gold-200 dark:hover:bg-kintsugi-gold-800/30 transition-colors"
                    aria-label="View Profile"
                  >
                    {profile?.avatarType === 'emoji' ? (
                      <span className="text-2xl">{profile.avatar}</span>
                    ) : (
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Daily Affirmation */}
              <div className="bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/10 rounded-lg p-4 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30 mb-6">
                <div className="flex items-start">
                  <div className="p-2 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 rounded-lg mr-4">
                    <Sparkles className="w-5 h-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-1">
                      Today's Affirmation
                    </h3>
                    <p className="text-kintsugi-dark-700 dark:text-kintsugi-gold-300">
                      {currentAffirmation?.text || 'You are doing great!'}
                    </p>
                    <button 
                      onClick={fetchAffirmation}
                      className="mt-2 text-sm text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 flex items-center"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      New Affirmation
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress and Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-kintsugi-dark-800 p-4 rounded-lg border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
                  <h3 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-2">
                    Weekly Progress
                  </h3>
                  <div className="h-2 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-kintsugi-gold-400 to-kintsugi-gold-600 rounded-full"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mt-2">
                    5 of 7 days completed
                  </p>
                </div>
                
                <div className="bg-white dark:bg-kintsugi-dark-800 p-4 rounded-lg border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
                  <h3 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-2">
                    Current Streak
                  </h3>
                  <div className="flex items-center">
                    <Flame className="w-5 h-5 text-kintsugi-gold-500 mr-2" />
                    <span className="text-2xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                      {streakInfo.current} days
                    </span>
                  </div>
                  <p className="text-sm text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mt-1">
                    Best: {streakInfo.longest} days
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-kintsugi-dark-800 rounded-lg border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30 overflow-hidden">
                <div className="px-6 py-4 border-b border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
                  <h3 className="text-lg font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                    Recent Activity
                  </h3>
                </div>
                <div className="divide-y divide-kintsugi-gold-200/50 dark:divide-kintsugi-gold-800/30">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 hover:bg-kintsugi-gold-50/50 dark:hover:bg-kintsugi-gold-900/5 transition-colors">
                      <div className="flex items-start">
                        <div className="p-2 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 rounded-lg mr-3">
                          <Activity className="w-4 h-4 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                            Completed daily reflection
                          </p>
                          <p className="text-xs text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mt-1">
                            {i} hour{i !== 1 ? 's' : ''} ago
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-700 dark:text-kintsugi-gold-300 rounded-full">
                          +10 XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 border-t border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30 text-center">
                  <button className="text-sm font-medium text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-5 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
              <h3 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowJournal(true)}
                  className="w-full flex items-center px-4 py-3 rounded-lg bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/10 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-left"
                >
                  <BookOpen className="w-5 h-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mr-3" />
                  <span>New Journal Entry</span>
                </button>
                
                <button 
                  onClick={() => setShowChallenges(true)}
                  className="w-full flex items-center px-4 py-3 rounded-lg bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/10 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-left"
                >
                  <Target className="w-5 h-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mr-3" />
                  <span>View Challenges</span>
                </button>
                
                <button 
                  onClick={() => setShowAchievements(true)}
                  className="w-full flex items-center px-4 py-3 rounded-lg bg-kintsugi-gold-50 dark:bg-kintsugi-gold-900/10 hover:bg-kintsugi-gold-100 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-left"
                >
                  <Award className="w-5 h-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mr-3" />
                  <span>My Achievements</span>
                </button>
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-kintsugi-gold-500 to-kintsugi-gold-700 rounded-xl p-5 text-white">
              <h3 className="font-medium mb-2">Daily Challenge</h3>
              <p className="text-sm text-kintsugi-gold-100 mb-4">
                Share your accomplishment with a friend or colleague
              </p>
              <button 
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setShowChallenges(true)}
              >
                Mark as Complete
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-5 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
              <h3 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-3">
                Upcoming
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 rounded-lg p-2 mr-3">
                    <Calendar className="w-4 h-4 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                      Weekly Reflection
                    </p>
                    <p className="text-xs text-kintsugi-gold-600 dark:text-kintsugi-gold-400">
                      Tomorrow • 6:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 rounded-lg p-2 mr-3">
                    <Calendar className="w-4 h-4 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                      Monthly Review
                    </p>
                    <p className="text-xs text-kintsugi-gold-600 dark:text-kintsugi-gold-400">
                      In 5 days • 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-kintsugi-gold-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 bg-clip-text text-transparent">
                  Kintsugi
                </span>
              </div>
              <p className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300">
                Embrace your journey and celebrate your growth with Kintsugi - finding beauty in every step.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Home</a></li>
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Journal</a></li>
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Achievements</a></li>
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Challenges</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">About Kintsugi</a></li>
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-kintsugi-gold-700 dark:text-kintsugi-gold-300 hover:text-kintsugi-gold-900 dark:hover:text-kintsugi-gold-100 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <Github className="w-5 h-5" />
                </a>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => setShowFeedback(true)}
                  className="text-sm font-medium text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 transition-colors flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-kintsugi-gold-200/50 dark:border-kintsugi-gold-800/30 text-center">
            <p className="text-xs text-kintsugi-gold-600 dark:text-kintsugi-gold-400">
              &copy; {new Date().getFullYear()} Kintsugi. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* Profile View Modal */}
        {showProfileView && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowProfileView(false)}
                className="absolute top-4 right-4 text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/20 flex items-center justify-center text-3xl mb-4">
                  {profile.avatarType === 'emoji' ? (
                    profile.avatar
                  ) : (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-1">
                  {profile.name}
                </h3>
                <p className="text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mb-6">
                  {profile.email}
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setShowProfileView(false);
                      setShowSetup(true);
                    }}
                    className="w-full bg-kintsugi-gold-500 hover:bg-kintsugi-gold-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                  
                  <button 
                    onClick={() => setShowProfileView(false)}
                    className="w-full text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 py-2 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowFeedback(false)}
                className="absolute top-4 right-4 text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-2">
                Send Feedback
              </h3>
              <p className="text-kintsugi-gold-600 dark:text-kintsugi-gold-400 mb-6">
                We'd love to hear your thoughts!
              </p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-kintsugi-dark-700 dark:text-kintsugi-gold-300 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    rows={4}
                    className="w-full px-3 py-2 border border-kintsugi-gold-200 dark:border-kintsugi-gold-800/50 rounded-lg bg-white dark:bg-kintsugi-dark-900 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 focus:ring-2 focus:ring-kintsugi-gold-500 focus:border-transparent"
                    placeholder="Share your thoughts..."
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 text-kintsugi-gold-600 dark:text-kintsugi-gold-400 hover:text-kintsugi-gold-800 dark:hover:text-kintsugi-gold-200 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="flex-1 bg-kintsugi-gold-500 hover:bg-kintsugi-gold-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
