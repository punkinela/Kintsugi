'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Star, MessageCircle, Award, BookOpen,
  Eye, Download, Calendar, Target, BarChart3, ChevronDown
} from 'lucide-react';
import ThemeToggle from '@/components/admin/ThemeToggle';
import {
  getAnalyticsData,
  getAllFeedback,
  exportAnalyticsData,
  exportFeedbackAsCSV,
  exportAnalyticsSummaryAsCSV,
  exportCompleteDataAsCSV,
  downloadFile
} from '@/utils/analytics';
import { AnalyticsData, UserFeedback } from '@/types/analytics';
import UserGrowthPanel from '@/components/UserGrowthPanel';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
};

const StatCard = ({ title, value, icon, trend, trendType = 'neutral' }: StatCardProps) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3 text-white">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColors[trendType]}`}>
                    {trend}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data that matches the AnalyticsData type
        setAnalytics({
          totalUsers: 1242,
          activeUsers: 843,
          totalAccomplishments: 3567,
          averageStreak: 12.5,
          feedbackCount: 356,
          averageRating: 4.7,
          userEngagement: {
            daily: 65,
            weekly: 78,
            monthly: 82
          },
          featureUsage: {
            affirmationsViewed: 1242,
            insightsViewed: 843,
            journalEntries: 567,
            achievementsUnlocked: 234
          },
          userRetention: {
            day1: 85,
            day7: 65,
            day30: 45
          }
        });
        
        // Mock feedback data
        setFeedback([
          {
            id: '1',
            timestamp: new Date().toISOString(),
            rating: 5,
            experience: 'excellent',
            comment: 'Love the new Kintsugi theme!',
            userProfile: {
              name: 'User 1',
              gender: 'female',
              profession: 'Developer'
            },
            sessionData: {
              visitCount: 12,
              currentStreak: 5,
              accomplishmentsLogged: 8,
              daysActive: 12
            }
          } as UserFeedback,
          {
            id: '2',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            rating: 4,
            experience: 'great',
            comment: 'Great app, very helpful',
            userProfile: {
              name: 'User 2',
              gender: 'male',
              profession: 'Designer'
            },
            sessionData: {
              visitCount: 8,
              currentStreak: 3,
              accomplishmentsLogged: 5,
              daysActive: 8
            }
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            rating: 5,
            experience: 'excellent',
            comment: 'The rebrand looks amazing!',
            userProfile: {
              name: 'User 3',
              gender: 'non-binary',
              profession: 'Teacher'
            },
            sessionData: {
              visitCount: 15,
              currentStreak: 7,
              accomplishmentsLogged: 12,
              daysActive: 15
            }
          }
        ]);
        
        // Update rebrand check based on current state
        // setRebrandCheck(prev => ({
        //   ...prev,
        //   allChecksPassed: true
        // }));
        
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-amber-600 to-amber-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Kintsugi Admin Dashboard</h1>
            <p className="text-amber-100 text-sm">Celebrating growth through every challenge</p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Users"
            value={analytics.activeUsers}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={analytics?.userEngagement ? `${analytics.userEngagement.daily}%` : '0%'}
            trendType="up"
          />
          <StatCard
            title="Total Feedback"
            value={analytics?.feedbackCount.toLocaleString() || '0'}
            icon={<MessageCircle className="h-6 w-6" />}
            trend={analytics?.feedbackCount ? `+${Math.floor(analytics.feedbackCount * 0.15)}` : '0'}
            trendType="up"
          />
          <StatCard
            title="Avg. Rating"
            value={analytics?.averageRating.toFixed(1) || '0.0'}
            icon={<Star className="h-6 w-6" />}
            trend="+0.2"
            trendType="up"
          />
        </div>

        {/* User Engagement */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Engagement</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Daily</span>
                  <span>{analytics?.userEngagement.daily}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${analytics?.userEngagement.daily}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Weekly</span>
                  <span>{analytics?.userEngagement.weekly}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${analytics?.userEngagement.weekly}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Monthly</span>
                  <span>{analytics?.userEngagement.monthly}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${analytics?.userEngagement.monthly}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Feature Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Affirmations</span>
                  <span>{analytics?.featureUsage.affirmationsViewed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${(analytics?.featureUsage.affirmationsViewed / (analytics?.totalUsers || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Insights</span>
                  <span>{analytics?.featureUsage.insightsViewed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-pink-500 h-2.5 rounded-full" 
                    style={{ width: `${(analytics?.featureUsage.insightsViewed / (analytics?.totalUsers || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Journal Entries</span>
                  <span>{analytics?.featureUsage.journalEntries}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${(analytics?.featureUsage.journalEntries / (analytics?.totalUsers || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* User Retention */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Retention</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Day 1</span>
                  <span>{analytics?.userRetention.day1}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${analytics?.userRetention.day1}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Day 7</span>
                  <span>{analytics?.userRetention.day7}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${analytics?.userRetention.day7}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Day 30</span>
                  <span>{analytics?.userRetention.day30}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-purple-500 h-2.5 rounded-full" 
                    style={{ width: `${analytics?.userRetention.day30}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Feedback</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">
                  All
                </button>
                <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md">
                  Positive
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {feedback.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i < item.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.userProfile?.name || 'Anonymous User'}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {item.userProfile?.profession || 'User'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.comment}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>Experience: </span>
                        <span className="ml-1 font-medium capitalize">{item.experience}</span>
                        <span className="mx-2">•</span>
                        <span>Visits: {item.sessionData.visitCount}</span>
                        <span className="mx-2">•</span>
                        <span>Streak: {item.sessionData.currentStreak} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500">
                View all feedback
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
