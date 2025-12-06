// Kintsugi-themed emoji character collections for profile avatars
// Aligned with Kintsugi philosophy: embracing imperfection, finding beauty in repair, growth mindset

export interface EmojiCharacter {
  emoji: string;
  name: string;
  personality: string;
  theme: string;
  description: string;
  recommendedFor: string[];
}

export interface CategoryUnlock {
  unlockLevel: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Category unlock requirements
export const CATEGORY_UNLOCKS: { [category: string]: CategoryUnlock } = {
  vessels: { unlockLevel: 1, rarity: 'common' },
  nature: { unlockLevel: 5, rarity: 'common' },
  golden: { unlockLevel: 10, rarity: 'rare' },
  transformers: { unlockLevel: 20, rarity: 'epic' },
  masters: { unlockLevel: 30, rarity: 'legendary' }
};

export const emojiCharacters: { [category: string]: EmojiCharacter[] } = {
  // The Vessels - Starting point, embracing the journey (Level 1+)
  vessels: [
    {
      emoji: '🏺',
      name: 'Sacred Vessel',
      personality: 'The Beginner',
      theme: 'Starting the Journey',
      description: 'Every masterpiece starts as a humble vessel. Your journey of transformation begins here.',
      recommendedFor: ['new', 'beginning', 'humble', 'open']
    },
    {
      emoji: '🫖',
      name: 'Tea Ceremony',
      personality: 'The Mindful',
      theme: 'Present Moment',
      description: 'Like the tea ceremony, you find meaning in mindful presence and intentional action.',
      recommendedFor: ['mindful', 'calm', 'present', 'intentional']
    },
    {
      emoji: '🍵',
      name: 'Matcha Bowl',
      personality: 'The Practitioner',
      theme: 'Daily Practice',
      description: 'Strength comes from daily practice. Each cup, each day, builds your resilience.',
      recommendedFor: ['consistent', 'disciplined', 'patient', 'dedicated']
    },
    {
      emoji: '🥣',
      name: 'Humble Bowl',
      personality: 'The Simple',
      theme: 'Wabi-Sabi Beauty',
      description: 'Finding beauty in simplicity and imperfection. The cracks tell your story.',
      recommendedFor: ['simple', 'authentic', 'grounded', 'honest']
    },
    {
      emoji: '⚱️',
      name: 'Ancient Urn',
      personality: 'The Wise',
      theme: 'Timeless Wisdom',
      description: 'Carrying wisdom from those who came before. Your history makes you stronger.',
      recommendedFor: ['wise', 'experienced', 'reflective', 'deep']
    }
  ],

  // The Nature Spirits - Japanese growth symbols (Level 5+)
  nature: [
    {
      emoji: '🌸',
      name: 'Cherry Blossom',
      personality: 'The Transient',
      theme: 'Mono no Aware',
      description: 'Like sakura, you understand that beauty is precious because it is fleeting. Embrace each moment.',
      recommendedFor: ['appreciative', 'present', 'graceful', 'accepting']
    },
    {
      emoji: '🎋',
      name: 'Bamboo',
      personality: 'The Flexible',
      theme: 'Bend Don\'t Break',
      description: 'Bamboo bends in the storm but never breaks. Your flexibility is your greatest strength.',
      recommendedFor: ['flexible', 'resilient', 'adaptable', 'strong']
    },
    {
      emoji: '🪷',
      name: 'Lotus',
      personality: 'The Rising',
      theme: 'Beauty from Mud',
      description: 'The lotus rises from muddy waters to bloom beautifully. Your struggles nurture your growth.',
      recommendedFor: ['rising', 'overcoming', 'beautiful', 'hopeful']
    },
    {
      emoji: '🌊',
      name: 'Great Wave',
      personality: 'The Flowing',
      theme: 'Embrace Change',
      description: 'Like the wave, you flow with life\'s changes rather than fighting against them.',
      recommendedFor: ['flowing', 'accepting', 'powerful', 'natural']
    },
    {
      emoji: '🗻',
      name: 'Mount Fuji',
      personality: 'The Steadfast',
      theme: 'Unwavering Purpose',
      description: 'Standing tall through all seasons. Your purpose remains clear despite life\'s storms.',
      recommendedFor: ['steady', 'purposeful', 'enduring', 'majestic']
    }
  ],

  // The Golden Repair - Core Kintsugi theme (Level 10+)
  golden: [
    {
      emoji: '✨',
      name: 'Golden Light',
      personality: 'The Illuminated',
      theme: 'Finding Your Gold',
      description: 'You\'ve found the gold within your cracks. Your wounds have become your wisdom.',
      recommendedFor: ['enlightened', 'healing', 'radiant', 'transformed']
    },
    {
      emoji: '💫',
      name: 'Stardust',
      personality: 'The Cosmic',
      theme: 'Scattered but Whole',
      description: 'Like stardust, you are scattered pieces of something magnificent coming together.',
      recommendedFor: ['cosmic', 'connected', 'magical', 'whole']
    },
    {
      emoji: '🌟',
      name: 'North Star',
      personality: 'The Guide',
      theme: 'Guiding Light',
      description: 'Your healing journey makes you a beacon for others finding their way.',
      recommendedFor: ['guiding', 'inspiring', 'leading', 'bright']
    },
    {
      emoji: '💛',
      name: 'Golden Heart',
      personality: 'The Compassionate',
      theme: 'Self-Love',
      description: 'Your heart, mended with gold, loves deeper. Self-compassion flows through every crack.',
      recommendedFor: ['loving', 'compassionate', 'kind', 'gentle']
    },
    {
      emoji: '🔆',
      name: 'Radiance',
      personality: 'The Glowing',
      theme: 'Inner Light',
      description: 'The gold doesn\'t hide your breaks—it illuminates them. You glow from within.',
      recommendedFor: ['radiant', 'confident', 'shining', 'proud']
    }
  ],

  // The Transformers - Growth mindset embodied (Level 20+)
  transformers: [
    {
      emoji: '🦋',
      name: 'Butterfly',
      personality: 'The Transformed',
      theme: 'Complete Metamorphosis',
      description: 'You\'ve emerged from the chrysalis. The struggle gave you wings to fly.',
      recommendedFor: ['transformed', 'free', 'beautiful', 'evolved']
    },
    {
      emoji: '🌱',
      name: 'Seedling',
      personality: 'The Growing',
      theme: 'Continuous Growth',
      description: 'Growth never stops. Even the mightiest oak was once a seedling pushing through soil.',
      recommendedFor: ['growing', 'learning', 'developing', 'emerging']
    },
    {
      emoji: '🔥',
      name: 'Phoenix Flame',
      personality: 'The Reborn',
      theme: 'Rising from Ashes',
      description: 'Like the phoenix, you rise from every setback stronger and more brilliant than before.',
      recommendedFor: ['reborn', 'resilient', 'powerful', 'unstoppable']
    },
    {
      emoji: '🌈',
      name: 'After the Storm',
      personality: 'The Hopeful',
      theme: 'Promise of Tomorrow',
      description: 'Every storm passes. You are the rainbow that appears after the rain.',
      recommendedFor: ['hopeful', 'optimistic', 'colorful', 'promising']
    },
    {
      emoji: '🌅',
      name: 'New Dawn',
      personality: 'The Renewed',
      theme: 'Fresh Beginnings',
      description: 'Each day brings a new dawn, a fresh chance. Yesterday\'s cracks become today\'s gold.',
      recommendedFor: ['renewed', 'fresh', 'beginning', 'bright']
    }
  ],

  // The Masters - Wisdom and mastery achieved (Level 30+)
  masters: [
    {
      emoji: '🧘',
      name: 'Zen Master',
      personality: 'The Peaceful',
      theme: 'Inner Harmony',
      description: 'You\'ve found peace with all your pieces. Serenity flows through every golden seam.',
      recommendedFor: ['peaceful', 'centered', 'balanced', 'serene']
    },
    {
      emoji: '🪬',
      name: 'Guardian Spirit',
      personality: 'The Protector',
      theme: 'Wisdom Keeper',
      description: 'Your journey makes you a guardian of wisdom, protecting and guiding others on their path.',
      recommendedFor: ['protective', 'wise', 'guardian', 'spiritual']
    },
    {
      emoji: '🐉',
      name: 'Dragon',
      personality: 'The Powerful',
      theme: 'Wisdom & Strength',
      description: 'The dragon represents mastery of both power and wisdom. You embody both.',
      recommendedFor: ['powerful', 'wise', 'ancient', 'respected']
    },
    {
      emoji: '👑',
      name: 'Kintsugi Crown',
      personality: 'The Sovereign',
      theme: 'Mastery Achieved',
      description: 'You wear your golden scars as a crown. Your imperfections are your greatest treasure.',
      recommendedFor: ['sovereign', 'accomplished', 'regal', 'complete']
    },
    {
      emoji: '🏆',
      name: 'Golden Trophy',
      personality: 'The Exceptional',
      theme: 'The Exceptional One',
      description: 'You\'ve reached the pinnacle. A masterwork of gold-filled beauty and strength.',
      recommendedFor: ['exceptional', 'achieved', 'masterful', 'legendary']
    }
  ]
};

// Get characters available for a given level
export function getUnlockedCategories(level: number): string[] {
  return Object.entries(CATEGORY_UNLOCKS)
    .filter(([_, unlock]) => level >= unlock.unlockLevel)
    .map(([category, _]) => category);
}

// Check if a category is unlocked
export function isCategoryUnlocked(category: string, level: number): boolean {
  const unlock = CATEGORY_UNLOCKS[category];
  return unlock ? level >= unlock.unlockLevel : false;
}

// Get character by personality type
export function getCharactersByPersonality(traits: string[]): EmojiCharacter[] {
  const matches: EmojiCharacter[] = [];

  Object.values(emojiCharacters).forEach(category => {
    category.forEach(character => {
      const matchScore = character.recommendedFor.filter(rec =>
        traits.some(trait => trait.toLowerCase().includes(rec.toLowerCase()))
      ).length;

      if (matchScore > 0) {
        matches.push(character);
      }
    });
  });

  // Sort by match score and return top matches
  return matches.slice(0, 5);
}

// Get all categories
export function getAllCharacterCategories(): string[] {
  return Object.keys(emojiCharacters);
}

// Get category display info - updated for Kintsugi theme
export function getCategoryInfo(category: string): { name: string; description: string; emoji: string } {
  const categoryInfo: { [key: string]: { name: string; description: string; emoji: string } } = {
    vessels: {
      name: 'The Vessels',
      description: 'Where every Kintsugi journey begins - humble, open, ready for transformation',
      emoji: '🏺'
    },
    nature: {
      name: 'Nature Spirits',
      description: 'Japanese symbols of resilience, growth, and natural wisdom',
      emoji: '🌸'
    },
    golden: {
      name: 'Golden Repair',
      description: 'The heart of Kintsugi - finding gold in your cracks, light in your wounds',
      emoji: '✨'
    },
    transformers: {
      name: 'The Transformers',
      description: 'Growth mindset embodied - rising, evolving, becoming',
      emoji: '🦋'
    },
    masters: {
      name: 'The Masters',
      description: 'Wisdom achieved through the journey - peace, power, and purpose',
      emoji: '👑'
    }
  };

  return categoryInfo[category] || { name: category, description: '', emoji: '✨' };
}
