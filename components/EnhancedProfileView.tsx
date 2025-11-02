'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Zap, Trophy, Target, Star, TrendingUp, Award, 
  BookOpen, Eye, Calendar, Flame, HelpCircle, X, Edit2, 
  Settings, Bell, Moon, Sun, LogOut, Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentLevelInfo, getGamificationData } from '@/utils/gamification';
import { getEngagementData } from '@/utils/engagement';
import { getChallengeStats } from '@/utils/dailyChallenges';
import { UserProfile } from '@/types';

interface EnhancedProfileViewProps {
  profile: UserProfile;
  onEdit: () => void;
  onClose: () => void;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color = 'gold',
  tooltip 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color?: 'gold' | 'purple' | 'green' | 'blue';
  tooltip?: string;
}) => {
  const colorMap = {
    gold: 'bg-kintsugi-gold-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="relative group h-full">
      <div className="p-4 bg-white/90 dark:bg-kintsugi-dark-700 rounded-xl border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80">
              {label}
            </p>
            <p className="text-2xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
              {value}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${colorMap[color]} text-white`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-kintsugi-dark-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-kintsugi-dark-700"></div>
        </div>
      )}
    </div>
  );
};

export default function EnhancedProfileView({ profile, onEdit, onClose }: EnhancedProfileViewProps) {
  const [showFAQ, setShowFAQ] = useState(true);
  const [levelInfo, setLevelInfo] = useState(getCurrentLevelInfo());
  const [gamificationData, setGamificationData] = useState(getGamificationData());
  const [engagementData, setEngagementData] = useState(getEngagementData());
  const [challengeStats, setChallengeStats] = useState(getChallengeStats());
  
  // Calculate achievement stats
  const achievementStats = {
    earned: gamificationData.achievements.filter((a: { unlocked: boolean }) => a.unlocked).length,
    total: gamificationData.achievements.length,
    percentage: gamificationData.achievements.length > 0 
      ? Math.round((gamificationData.achievements.filter((a: { unlocked: boolean }) => a.unlocked).length / gamificationData.achievements.length) * 100) 
      : 0,
  };

  // Update data on mount
  useEffect(() => {
    setLevelInfo(getCurrentLevelInfo());
    setGamificationData(getGamificationData());
    setEngagementData(getEngagementData());
    setChallengeStats(getChallengeStats());
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-xl border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 pb-4 bg-white/90 dark:bg-kintsugi-dark-800/90 backdrop-blur-sm border-b border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kintsugi-gold-100 to-kintsugi-gold-300/70 dark:from-kintsugi-gold-900/40 dark:to-kintsugi-gold-700/30 flex items-center justify-center overflow-hidden border border-kintsugi-gold-200/70 dark:border-kintsugi-gold-500/30">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-kintsugi-gold-600/90 dark:text-kintsugi-gold-500/90" />
                  )}
                </div>
                <button 
                  onClick={onEdit}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-kintsugi-gold-100 dark:bg-kintsugi-gold-900/80 rounded-full border border-kintsugi-gold-300 dark:border-kintsugi-gold-500/50 hover:bg-kintsugi-gold-200 dark:hover:bg-kintsugi-gold-800 transition-colors"
                  aria-label="Edit profile"
                >
                  <Edit2 className="w-3.5 h-3.5 text-kintsugi-gold-800 dark:text-kintsugi-gold-200" />
                </button>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100">
                  {profile.name || 'Anonymous User'}
                </h2>
                <p className="text-kintsugi-gold-700 dark:text-kintsugi-gold-400 text-sm">
                  Level {levelInfo.level} • {profile.profession || 'Self-Improvement Enthusiast'}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-kintsugi-gold-100/50 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-800 dark:text-kintsugi-gold-200 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30">
                    <Flame className="inline w-3 h-3 mr-1 -mt-0.5" />
                    {gamificationData.stats.currentStreak} day streak
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-kintsugi-gold-100/50 dark:bg-kintsugi-gold-900/20 text-kintsugi-gold-800 dark:text-kintsugi-gold-200 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30">
                    <Award className="inline w-3 h-3 mr-1 -mt-0.5" />
                    {achievementStats.earned} achievements
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-kintsugi-gold-100/50 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80 mb-1">
              <span>Level {levelInfo.level}</span>
              <span>{levelInfo.xp.toLocaleString()}/{levelInfo.xpToNextLevel.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-kintsugi-gold-100/50 dark:bg-kintsugi-gold-900/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-kintsugi-gold-500"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Trophy}
              label="Achievements"
              value={`${achievementStats.earned}/${achievementStats.total}`}
              tooltip={`${achievementStats.percentage}% completed`}
              color="gold"
            />
            <StatCard
              icon={Zap}
              label="Current Streak"
              value={`${gamificationData.stats.currentStreak} days`}
              tooltip={`Longest streak: ${gamificationData.stats.longestStreak} days`}
              color="purple"
            />
            <StatCard
              icon={Target}
              label="Daily Challenges"
              value={`${challengeStats.dailyCompleted || 0}/${challengeStats.dailyTotal || 0}`}
              tooltip={`${Math.round((challengeStats.weeklyCompleted / challengeStats.weeklyTotal) * 100) || 0}% weekly progress`}
              color="blue"
            />
            <StatCard
              icon={TrendingUp}
              label="Total XP"
              value={gamificationData.totalXpEarned?.toLocaleString() || '0'}
              tooltip={`Level ${gamificationData.level} (${gamificationData.xp || 0}/${gamificationData.xpToNextLevel || 0} XP)`}
              color="green"
            />
          </div>
          
          {/* Activity Section */}
          <div className="bg-kintsugi-gold-50/30 dark:bg-kintsugi-gold-900/10 rounded-xl p-5 border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30">
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-kintsugi-gold-500" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {engagementData.journalEntries.length > 0 ? (
                engagementData.journalEntries.slice(0, 3).map((entry: any, index: number) => (
                  <div 
                    key={index}
                    className="p-3 bg-white/50 dark:bg-kintsugi-dark-700/30 rounded-lg border border-kintsugi-gold-200/50 dark:border-kintsugi-gold-500/30"
                  >
                    <p className="text-sm text-kintsugi-dark-800/90 dark:text-kintsugi-gold-200/90">
                      {entry.text || 'No description'}
                    </p>
                    <p className="mt-1 text-xs text-kintsugi-dark-700/70 dark:text-kintsugi-gold-200/70">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80 text-sm">
                  No recent activities yet. Start by adding an accomplishment!
                </p>
              )}
            </div>
          </div>
          
          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-kintsugi-gold-500" />
              Settings
            </h3>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-kintsugi-gold-100/50 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-kintsugi-gold-500" />
                  <div>
                    <p className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">Notifications</p>
                    <p className="text-xs text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80">
                      {engagementData.reminderEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-5 rounded-full bg-kintsugi-gold-200 dark:bg-kintsugi-gold-800/50 p-0.5">
                  <div className={`w-4 h-4 rounded-full bg-kintsugi-gold-500 dark:bg-kintsugi-gold-400 transition-transform ${engagementData.reminderEnabled ? 'translate-x-5' : ''}`}></div>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-kintsugi-gold-100/50 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-kintsugi-gold-500" />
                  <div>
                    <p className="font-medium text-kintsugi-dark-900 dark:text-kintsugi-gold-100">Dark Mode</p>
                    <p className="text-xs text-kintsugi-dark-700/80 dark:text-kintsugi-gold-200/80">
                      {typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'On' : 'Off'}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-5 rounded-full bg-kintsugi-gold-200 dark:bg-kintsugi-gold-800/50 p-0.5">
                  <div className={`w-4 h-4 rounded-full bg-kintsugi-gold-500 dark:bg-kintsugi-gold-400 transition-transform ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'translate-x-5' : ''}`}></div>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-kintsugi-gold-100/50 dark:hover:bg-kintsugi-gold-900/20 transition-colors text-left text-red-500">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
