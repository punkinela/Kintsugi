// Reward unlock system

import { Reward } from '@/types/gamification';
import { getGamificationData } from './gamification';

// Available rewards
export const REWARDS: Reward[] = [
  // Avatar rewards
  { id: 'avatar-pack-1', name: 'Mystical Avatars', description: 'Unlock 5 mystical character avatars', icon: '🔮', type: 'avatar', unlockLevel: 5, rarity: 'common' },
  { id: 'avatar-pack-2', name: 'Legendary Heroes', description: 'Unlock 5 legendary hero avatars', icon: '⚔️', type: 'avatar', unlockLevel: 15, rarity: 'rare' },
  { id: 'avatar-pack-3', name: 'Cosmic Beings', description: 'Unlock 5 cosmic avatars', icon: '🌌', type: 'avatar', unlockLevel: 30, rarity: 'epic' },
  { id: 'avatar-custom', name: 'Custom Avatar Creator', description: 'Create your own custom avatar', icon: '🎨', type: 'avatar', unlockLevel: 50, rarity: 'legendary' },
  
  // Theme rewards
  { id: 'theme-ocean', name: 'Ocean Theme', description: 'Beautiful ocean-inspired color scheme', icon: '🌊', type: 'theme', unlockLevel: 3, rarity: 'common' },
  { id: 'theme-sunset', name: 'Sunset Theme', description: 'Warm sunset colors', icon: '🌅', type: 'theme', unlockLevel: 8, rarity: 'common' },
  { id: 'theme-forest', name: 'Forest Theme', description: 'Nature-inspired greens', icon: '🌲', type: 'theme', unlockLevel: 12, rarity: 'rare' },
  { id: 'theme-galaxy', name: 'Galaxy Theme', description: 'Cosmic purple and blue', icon: '🌠', type: 'theme', unlockLevel: 20, rarity: 'epic' },
  { id: 'theme-gold', name: 'Golden Theme', description: 'Luxurious gold accents', icon: '✨', type: 'theme', unlockLevel: 40, rarity: 'legendary' },
  
  // Badge rewards
  { id: 'badge-starter', name: 'Starter Badge', description: 'You\'ve begun your journey', icon: '🌱', type: 'badge', unlockLevel: 1, rarity: 'common' },
  { id: 'badge-achiever', name: 'Achiever Badge', description: 'Consistent progress', icon: '🎯', type: 'badge', unlockLevel: 10, rarity: 'rare' },
  { id: 'badge-champion', name: 'Champion Badge', description: 'True dedication', icon: '🏆', type: 'badge', unlockLevel: 25, rarity: 'epic' },
  { id: 'badge-legend', name: 'Legend Badge', description: 'Remarkable achievement', icon: '👑', type: 'badge', unlockLevel: 50, rarity: 'legendary' },
  
  // Feature rewards
  { id: 'feature-analytics', name: 'Advanced Analytics', description: 'Detailed progress analytics', icon: '📊', type: 'feature', unlockLevel: 7, rarity: 'rare' },
  { id: 'feature-export', name: 'Data Export', description: 'Export your data anytime', icon: '💾', type: 'feature', unlockLevel: 10, rarity: 'rare' },
  { id: 'feature-custom-goals', name: 'Custom Goals', description: 'Set personalized goals', icon: '🎯', type: 'feature', unlockLevel: 15, rarity: 'epic' },
  { id: 'feature-ai-insights', name: 'AI Insights', description: 'Personalized AI recommendations', icon: '🤖', type: 'feature', unlockLevel: 35, rarity: 'legendary' },
  
  // Title rewards
  { id: 'title-newcomer', name: 'Newcomer', description: 'Just getting started', icon: '🌱', type: 'title', unlockLevel: 1, rarity: 'common' },
  { id: 'title-explorer', name: 'Explorer', description: 'Discovering your potential', icon: '🔍', type: 'title', unlockLevel: 5, rarity: 'common' },
  { id: 'title-achiever', name: 'Achiever', description: 'Making real progress', icon: '⭐', type: 'title', unlockLevel: 10, rarity: 'rare' },
  { id: 'title-champion', name: 'Champion', description: 'Leading by example', icon: '🏆', type: 'title', unlockLevel: 20, rarity: 'epic' },
  { id: 'title-legend', name: 'Legend', description: 'Truly remarkable', icon: '💫', type: 'title', unlockLevel: 30, rarity: 'epic' },
  { id: 'title-remarkable', name: 'The Remarkable One', description: 'Ultimate achievement', icon: '👑', type: 'title', unlockLevel: 50, rarity: 'legendary' }
];

// Check and unlock rewards based on level
export function checkRewardUnlocks(): Reward[] {
  const data = getGamificationData();
  const newlyUnlocked: Reward[] = [];
  
  REWARDS.forEach(reward => {
    // Check if reward should be unlocked
    if (data.level >= reward.unlockLevel && !data.unlockedRewards.includes(reward.id)) {
      data.unlockedRewards.push(reward.id);
      newlyUnlocked.push(reward);
    }
  });
  
  if (newlyUnlocked.length > 0) {
    localStorage.setItem('gamificationData', JSON.stringify(data));
  }
  
  return newlyUnlocked;
}

// Get all unlocked rewards
export function getUnlockedRewards(): Reward[] {
  const data = getGamificationData();
  return REWARDS.filter(r => data.unlockedRewards.includes(r.id));
}

// Get locked rewards
export function getLockedRewards(): Reward[] {
  const data = getGamificationData();
  return REWARDS.filter(r => !data.unlockedRewards.includes(r.id));
}

// Get next reward to unlock
export function getNextReward(): Reward | null {
  const data = getGamificationData();
  const locked = getLockedRewards();
  
  if (locked.length === 0) return null;
  
  // Sort by unlock level
  locked.sort((a, b) => a.unlockLevel - b.unlockLevel);
  
  return locked[0];
}

// Get rewards by type
export function getRewardsByType(type: Reward['type']): Reward[] {
  return REWARDS.filter(r => r.type === type);
}

// Get rewards by rarity
export function getRewardsByRarity(rarity: Reward['rarity']): Reward[] {
  return REWARDS.filter(r => r.rarity === rarity);
}

// Get reward stats
export function getRewardStats(): {
  total: number;
  unlocked: number;
  percentage: number;
  byType: Record<string, { total: number; unlocked: number }>;
  byRarity: Record<string, { total: number; unlocked: number }>;
} {
  const data = getGamificationData();
  const unlocked = getUnlockedRewards();
  
  const byType: Record<string, { total: number; unlocked: number }> = {
    avatar: { total: 0, unlocked: 0 },
    theme: { total: 0, unlocked: 0 },
    badge: { total: 0, unlocked: 0 },
    feature: { total: 0, unlocked: 0 },
    title: { total: 0, unlocked: 0 }
  };
  
  const byRarity: Record<string, { total: number; unlocked: number }> = {
    common: { total: 0, unlocked: 0 },
    rare: { total: 0, unlocked: 0 },
    epic: { total: 0, unlocked: 0 },
    legendary: { total: 0, unlocked: 0 }
  };
  
  REWARDS.forEach(r => {
    byType[r.type].total++;
    byRarity[r.rarity].total++;
    
    if (data.unlockedRewards.includes(r.id)) {
      byType[r.type].unlocked++;
      byRarity[r.rarity].unlocked++;
    }
  });
  
  return {
    total: REWARDS.length,
    unlocked: unlocked.length,
    percentage: (unlocked.length / REWARDS.length) * 100,
    byType,
    byRarity
  };
}
