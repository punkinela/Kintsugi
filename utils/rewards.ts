// Reward unlock system

import { Reward } from '@/types/gamification';
import { getGamificationData } from './gamification';

// Available rewards - aligned with Kintsugi philosophy
export const REWARDS: Reward[] = [
  // Avatar Collection rewards (Kintsugi-themed)
  { id: 'avatar-vessels', name: 'The Vessels', description: 'Humble beginnings - 5 sacred vessel avatars', icon: '🏺', type: 'avatar', unlockLevel: 1, rarity: 'common' },
  { id: 'avatar-nature', name: 'Nature Spirits', description: 'Japanese symbols of growth - 5 nature avatars', icon: '🌸', type: 'avatar', unlockLevel: 5, rarity: 'common' },
  { id: 'avatar-golden', name: 'Golden Repair', description: 'The heart of Kintsugi - 5 golden avatars', icon: '✨', type: 'avatar', unlockLevel: 10, rarity: 'rare' },
  { id: 'avatar-transformers', name: 'The Transformers', description: 'Growth mindset embodied - 5 transformation avatars', icon: '🦋', type: 'avatar', unlockLevel: 20, rarity: 'epic' },
  { id: 'avatar-masters', name: 'The Masters', description: 'Wisdom achieved - 5 master avatars', icon: '👑', type: 'avatar', unlockLevel: 30, rarity: 'legendary' },

  // Theme rewards (Kintsugi-inspired)
  { id: 'theme-ocean', name: 'Ocean Wave Theme', description: 'Flow with the tide - calm blues', icon: '🌊', type: 'theme', unlockLevel: 3, rarity: 'common' },
  { id: 'theme-sakura', name: 'Sakura Theme', description: 'Cherry blossom pink - embrace transience', icon: '🌸', type: 'theme', unlockLevel: 8, rarity: 'common' },
  { id: 'theme-bamboo', name: 'Bamboo Forest Theme', description: 'Flexible strength - natural greens', icon: '🎋', type: 'theme', unlockLevel: 12, rarity: 'rare' },
  { id: 'theme-galaxy', name: 'Cosmic Theme', description: 'Connected to the universe', icon: '🌠', type: 'theme', unlockLevel: 20, rarity: 'epic' },
  { id: 'theme-gold', name: 'Pure Gold Theme', description: 'The ultimate Kintsugi expression', icon: '✨', type: 'theme', unlockLevel: 40, rarity: 'legendary' },

  // Badge rewards (Kintsugi journey)
  { id: 'badge-cracked', name: 'First Crack', description: 'You\'ve acknowledged imperfection', icon: '🏺', type: 'badge', unlockLevel: 1, rarity: 'common' },
  { id: 'badge-golden-thread', name: 'Golden Thread', description: 'You\'re weaving gold into your story', icon: '✨', type: 'badge', unlockLevel: 10, rarity: 'rare' },
  { id: 'badge-restored', name: 'Beautifully Restored', description: 'Stronger in the broken places', icon: '🌟', type: 'badge', unlockLevel: 25, rarity: 'epic' },
  { id: 'badge-masterpiece', name: 'Living Masterpiece', description: 'A work of golden art', icon: '👑', type: 'badge', unlockLevel: 50, rarity: 'legendary' },

  // Feature rewards
  { id: 'feature-analytics', name: 'Journey Analytics', description: 'See your transformation in data', icon: '📊', type: 'feature', unlockLevel: 7, rarity: 'rare' },
  { id: 'feature-export', name: 'Story Export', description: 'Save your Kintsugi journey', icon: '💾', type: 'feature', unlockLevel: 10, rarity: 'rare' },
  { id: 'feature-custom-goals', name: 'Personal Intentions', description: 'Set your own growth path', icon: '🎯', type: 'feature', unlockLevel: 15, rarity: 'epic' },
  { id: 'feature-ai-insights', name: 'Wisdom Insights', description: 'AI-powered growth guidance', icon: '🧠', type: 'feature', unlockLevel: 35, rarity: 'legendary' },

  // Title rewards (Kintsugi journey stages)
  { id: 'title-vessel', name: 'The Vessel', description: 'Beginning the journey', icon: '🏺', type: 'title', unlockLevel: 1, rarity: 'common' },
  { id: 'title-seeker', name: 'Gold Seeker', description: 'Looking for light in cracks', icon: '🔍', type: 'title', unlockLevel: 5, rarity: 'common' },
  { id: 'title-artisan', name: 'Kintsugi Artisan', description: 'Learning the craft of repair', icon: '🎨', type: 'title', unlockLevel: 10, rarity: 'rare' },
  { id: 'title-craftsman', name: 'Golden Craftsman', description: 'Skilled in transformation', icon: '⭐', type: 'title', unlockLevel: 20, rarity: 'epic' },
  { id: 'title-master', name: 'Kintsugi Master', description: 'Wisdom through golden scars', icon: '💫', type: 'title', unlockLevel: 30, rarity: 'epic' },
  { id: 'title-masterpiece', name: 'Living Masterpiece', description: 'The gold runs through you', icon: '👑', type: 'title', unlockLevel: 50, rarity: 'legendary' }
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
