'use client';

import { motion } from 'framer-motion';
import { Target, Clock, Zap, Trophy, CheckCircle } from 'lucide-react';
import { getCurrentChallenges, getChallengeStats } from '@/utils/dailyChallenges';
import { useEffect, useState } from 'react';
import { DailyChallenge } from '@/types/gamification';

export default function DailyChallengesPanel() {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [stats, setStats] = useState(getChallengeStats());
  
  useEffect(() => {
    loadChallenges();
    
    const handleUpdate = () => {
      loadChallenges();
    };
    
    window.addEventListener('gamification-update', handleUpdate);
    return () => window.removeEventListener('gamification-update', handleUpdate);
  }, []);
  
  const loadChallenges = () => {
    setChallenges(getCurrentChallenges());
    setStats(getChallengeStats());
  };
  
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  
  const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };
  
  const ChallengeCard = ({ challenge }: { challenge: DailyChallenge }) => {
    const progress = (challenge.progress / challenge.target) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border-2 transition-all ${
          challenge.completed
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`text-3xl ${challenge.completed ? 'grayscale' : ''}`}>
            {challenge.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  {challenge.title}
                  {challenge.completed && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {challenge.description}
                </p>
              </div>
              
              {!challenge.completed && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(challenge.expiresAt)}
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress: {challenge.progress} / {challenge.target}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    challenge.completed
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {/* Rewards */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                {challenge.xpReward} XP
              </div>
              <div className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
                <Trophy className="w-3 h-3" />
                {challenge.pointsReward} pts
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Daily Challenges
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete challenges to earn bonus XP and points
          </p>
        </div>
        
        {/* Stats */}
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalCompleted}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total Completed
          </p>
        </div>
      </div>
      
      {/* Daily Challenges */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          🌅 Today's Challenges
          <span className="text-sm font-normal text-gray-500">
            ({stats.dailyCompleted}/{stats.dailyTotal})
          </span>
        </h4>
        <div className="space-y-3">
          {dailyChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
      
      {/* Weekly Challenges */}
      {weeklyChallenges.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            📅 Weekly Challenges
            <span className="text-sm font-normal text-gray-500">
              ({stats.weeklyCompleted}/{stats.weeklyTotal})
            </span>
          </h4>
          <div className="space-y-3">
            {weeklyChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
