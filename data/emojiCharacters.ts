// Themed emoji character collections for profile avatars
// Inspired by empowerment, growth, and self-recognition themes

export interface EmojiCharacter {
  emoji: string;
  name: string;
  personality: string;
  theme: string;
  description: string;
  recommendedFor: string[];
}

export const emojiCharacters: { [category: string]: EmojiCharacter[] } = {
  // The Achievers - Goal-oriented, ambitious, driven
  achievers: [
    {
      emoji: '🏆',
      name: 'Trophy',
      personality: 'The Champion',
      theme: 'Achievement & Success',
      description: 'Celebrates every win, big or small. Always striving for excellence.',
      recommendedFor: ['competitive', 'goal-oriented', 'high-achiever', 'ambitious']
    },
    {
      emoji: '🚀',
      name: 'Rocket',
      personality: 'The Innovator',
      theme: 'Growth & Progress',
      description: 'Always moving forward, reaching for the stars. Unstoppable momentum.',
      recommendedFor: ['ambitious', 'fast-paced', 'innovative', 'forward-thinking']
    },
    {
      emoji: '👑',
      name: 'Crown',
      personality: 'The Leader',
      theme: 'Leadership & Confidence',
      description: 'Natural leader who owns their power. Confident and inspiring.',
      recommendedFor: ['leadership', 'confident', 'inspiring', 'authoritative']
    },
    {
      emoji: '🎯',
      name: 'Target',
      personality: 'The Focused',
      theme: 'Precision & Clarity',
      description: 'Laser-focused on goals. Strategic and intentional in every action.',
      recommendedFor: ['focused', 'strategic', 'precise', 'goal-driven']
    },
    {
      emoji: '⚡',
      name: 'Lightning',
      personality: 'The Energizer',
      theme: 'Energy & Action',
      description: 'High energy, quick to act. Makes things happen with electric enthusiasm.',
      recommendedFor: ['energetic', 'action-oriented', 'dynamic', 'fast-paced']
    }
  ],

  // The Creatives - Artistic, imaginative, expressive
  creatives: [
    {
      emoji: '🎨',
      name: 'Palette',
      personality: 'The Artist',
      theme: 'Creativity & Expression',
      description: 'Sees the world in color. Creates beauty and meaning in everything.',
      recommendedFor: ['creative', 'artistic', 'expressive', 'imaginative']
    },
    {
      emoji: '✨',
      name: 'Sparkles',
      personality: 'The Magical',
      theme: 'Wonder & Possibility',
      description: 'Brings magic to the ordinary. Believes in infinite possibilities.',
      recommendedFor: ['optimistic', 'imaginative', 'inspiring', 'positive']
    },
    {
      emoji: '🌈',
      name: 'Rainbow',
      personality: 'The Colorful',
      theme: 'Diversity & Joy',
      description: 'Celebrates diversity and brings joy. Brightens every room.',
      recommendedFor: ['joyful', 'inclusive', 'positive', 'uplifting']
    },
    {
      emoji: '🦋',
      name: 'Butterfly',
      personality: 'The Transformer',
      theme: 'Change & Growth',
      description: 'Embraces transformation. Beautiful evolution through change.',
      recommendedFor: ['adaptable', 'evolving', 'graceful', 'transformative']
    },
    {
      emoji: '🎭',
      name: 'Theater',
      personality: 'The Performer',
      theme: 'Expression & Drama',
      description: 'Life is a stage. Expressive, dramatic, and captivating.',
      recommendedFor: ['expressive', 'dramatic', 'entertaining', 'bold']
    }
  ],

  // The Nurturers - Caring, supportive, empathetic
  nurturers: [
    {
      emoji: '💜',
      name: 'Purple Heart',
      personality: 'The Compassionate',
      theme: 'Love & Care',
      description: 'Leads with heart. Compassionate, caring, and deeply empathetic.',
      recommendedFor: ['caring', 'empathetic', 'supportive', 'kind']
    },
    {
      emoji: '🌸',
      name: 'Blossom',
      personality: 'The Gentle',
      theme: 'Grace & Beauty',
      description: 'Gentle strength. Beautiful inside and out, nurturing growth.',
      recommendedFor: ['gentle', 'nurturing', 'graceful', 'patient']
    },
    {
      emoji: '🤗',
      name: 'Hug',
      personality: 'The Warm',
      theme: 'Connection & Support',
      description: 'Warm embrace for all. Makes everyone feel valued and supported.',
      recommendedFor: ['warm', 'welcoming', 'supportive', 'friendly']
    },
    {
      emoji: '🌻',
      name: 'Sunflower',
      personality: 'The Bright',
      theme: 'Positivity & Growth',
      description: 'Always faces the light. Grows tall and spreads sunshine.',
      recommendedFor: ['positive', 'optimistic', 'growing', 'cheerful']
    },
    {
      emoji: '🕊️',
      name: 'Dove',
      personality: 'The Peaceful',
      theme: 'Peace & Harmony',
      description: 'Brings peace and calm. Creates harmony wherever they go.',
      recommendedFor: ['peaceful', 'calm', 'harmonious', 'balanced']
    }
  ],

  // The Warriors - Strong, resilient, courageous
  warriors: [
    {
      emoji: '💪',
      name: 'Muscle',
      personality: 'The Strong',
      theme: 'Strength & Power',
      description: 'Physical and mental strength. Overcomes any obstacle.',
      recommendedFor: ['strong', 'resilient', 'determined', 'powerful']
    },
    {
      emoji: '🔥',
      name: 'Fire',
      personality: 'The Passionate',
      theme: 'Passion & Intensity',
      description: 'Burns bright with passion. Intense, driven, and unstoppable.',
      recommendedFor: ['passionate', 'intense', 'driven', 'fierce']
    },
    {
      emoji: '🦁',
      name: 'Lion',
      personality: 'The Brave',
      theme: 'Courage & Strength',
      description: 'Courageous leader. Faces fear with roaring confidence.',
      recommendedFor: ['brave', 'courageous', 'bold', 'fearless']
    },
    {
      emoji: '🛡️',
      name: 'Shield',
      personality: 'The Protector',
      theme: 'Protection & Defense',
      description: 'Protects boundaries. Strong defender of self and others.',
      recommendedFor: ['protective', 'strong', 'defensive', 'guardian']
    },
    {
      emoji: '⚔️',
      name: 'Sword',
      personality: 'The Fighter',
      theme: 'Battle & Victory',
      description: 'Fights for what\'s right. Warrior spirit, never gives up.',
      recommendedFor: ['fighter', 'persistent', 'determined', 'warrior']
    }
  ],

  // The Thinkers - Intelligent, analytical, wise
  thinkers: [
    {
      emoji: '🧠',
      name: 'Brain',
      personality: 'The Intellectual',
      theme: 'Intelligence & Logic',
      description: 'Sharp mind, deep thoughts. Analyzes and understands complexity.',
      recommendedFor: ['intelligent', 'analytical', 'logical', 'thoughtful']
    },
    {
      emoji: '💡',
      name: 'Lightbulb',
      personality: 'The Innovator',
      theme: 'Ideas & Innovation',
      description: 'Bright ideas constantly flowing. Innovative problem solver.',
      recommendedFor: ['innovative', 'creative-thinker', 'problem-solver', 'inventive']
    },
    {
      emoji: '🔬',
      name: 'Microscope',
      personality: 'The Researcher',
      theme: 'Discovery & Analysis',
      description: 'Curious investigator. Discovers truth through careful analysis.',
      recommendedFor: ['curious', 'analytical', 'detail-oriented', 'scientific']
    },
    {
      emoji: '📚',
      name: 'Books',
      personality: 'The Scholar',
      theme: 'Knowledge & Learning',
      description: 'Lifelong learner. Wisdom through continuous study and growth.',
      recommendedFor: ['studious', 'knowledgeable', 'learning', 'wise']
    },
    {
      emoji: '🦉',
      name: 'Owl',
      personality: 'The Wise',
      theme: 'Wisdom & Insight',
      description: 'Wise beyond years. Sees what others miss with deep insight.',
      recommendedFor: ['wise', 'insightful', 'observant', 'thoughtful']
    }
  ],

  // The Joyful - Happy, playful, fun-loving
  joyful: [
    {
      emoji: '😊',
      name: 'Smile',
      personality: 'The Happy',
      theme: 'Joy & Contentment',
      description: 'Radiates happiness. Finds joy in simple moments.',
      recommendedFor: ['happy', 'content', 'positive', 'cheerful']
    },
    {
      emoji: '🥳',
      name: 'Party',
      personality: 'The Celebrator',
      theme: 'Celebration & Fun',
      description: 'Life is a celebration! Finds reasons to party every day.',
      recommendedFor: ['celebratory', 'fun', 'enthusiastic', 'festive']
    },
    {
      emoji: '🌟',
      name: 'Star',
      personality: 'The Shining',
      theme: 'Brilliance & Light',
      description: 'Shines bright. Natural star who lights up every space.',
      recommendedFor: ['bright', 'outstanding', 'special', 'radiant']
    },
    {
      emoji: '🎈',
      name: 'Balloon',
      personality: 'The Uplifting',
      theme: 'Lightness & Joy',
      description: 'Lifts spirits effortlessly. Brings lightness and joy to all.',
      recommendedFor: ['uplifting', 'light-hearted', 'joyful', 'fun']
    },
    {
      emoji: '🎉',
      name: 'Confetti',
      personality: 'The Festive',
      theme: 'Celebration & Excitement',
      description: 'Every moment is worth celebrating. Spreads excitement everywhere.',
      recommendedFor: ['celebratory', 'exciting', 'enthusiastic', 'lively']
    }
  ],

  // The Mystical - Spiritual, intuitive, magical
  mystical: [
    {
      emoji: '🔮',
      name: 'Crystal Ball',
      personality: 'The Intuitive',
      theme: 'Intuition & Vision',
      description: 'Sees beyond the surface. Strong intuition guides the way.',
      recommendedFor: ['intuitive', 'visionary', 'perceptive', 'spiritual']
    },
    {
      emoji: '🌙',
      name: 'Moon',
      personality: 'The Dreamer',
      theme: 'Dreams & Mystery',
      description: 'Dreams big under moonlight. Mysterious and deeply reflective.',
      recommendedFor: ['dreamy', 'reflective', 'mysterious', 'introspective']
    },
    {
      emoji: '⭐',
      name: 'Starlight',
      personality: 'The Cosmic',
      theme: 'Universe & Wonder',
      description: 'Connected to the cosmos. Sees the bigger picture always.',
      recommendedFor: ['cosmic', 'philosophical', 'wondering', 'expansive']
    },
    {
      emoji: '🦄',
      name: 'Unicorn',
      personality: 'The Rare',
      theme: 'Uniqueness & Magic',
      description: 'One of a kind. Rare, magical, and absolutely unique.',
      recommendedFor: ['unique', 'special', 'magical', 'rare']
    },
    {
      emoji: '🧙',
      name: 'Wizard',
      personality: 'The Magical',
      theme: 'Magic & Power',
      description: 'Wields inner magic. Transforms reality with intention.',
      recommendedFor: ['magical', 'powerful', 'transformative', 'mystical']
    }
  ],

  // The Professionals - Career-focused, ambitious, polished
  professionals: [
    {
      emoji: '💼',
      name: 'Briefcase',
      personality: 'The Professional',
      theme: 'Career & Success',
      description: 'Business-minded and professional. Climbs the ladder with grace.',
      recommendedFor: ['professional', 'career-focused', 'business', 'polished']
    },
    {
      emoji: '💻',
      name: 'Laptop',
      personality: 'The Tech-Savvy',
      theme: 'Technology & Innovation',
      description: 'Digital native. Tech-savvy and always connected.',
      recommendedFor: ['tech', 'digital', 'modern', 'connected']
    },
    {
      emoji: '📊',
      name: 'Chart',
      personality: 'The Analyst',
      theme: 'Data & Strategy',
      description: 'Data-driven decisions. Strategic thinker who measures success.',
      recommendedFor: ['analytical', 'strategic', 'data-driven', 'methodical']
    },
    {
      emoji: '🎓',
      name: 'Graduation',
      personality: 'The Educated',
      theme: 'Education & Achievement',
      description: 'Values education. Continuously learning and growing.',
      recommendedFor: ['educated', 'academic', 'learning', 'scholarly']
    },
    {
      emoji: '💎',
      name: 'Diamond',
      personality: 'The Valuable',
      theme: 'Worth & Excellence',
      description: 'Knows their worth. Rare, valuable, and unbreakable.',
      recommendedFor: ['valuable', 'precious', 'excellent', 'rare']
    }
  ]
};

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

// Get category display info
export function getCategoryInfo(category: string): { name: string; description: string; emoji: string } {
  const categoryInfo: { [key: string]: { name: string; description: string; emoji: string } } = {
    achievers: {
      name: 'The Achievers',
      description: 'Goal-oriented, ambitious, and driven to succeed',
      emoji: '🏆'
    },
    creatives: {
      name: 'The Creatives',
      description: 'Artistic, imaginative, and expressive souls',
      emoji: '🎨'
    },
    nurturers: {
      name: 'The Nurturers',
      description: 'Caring, supportive, and deeply empathetic',
      emoji: '💜'
    },
    warriors: {
      name: 'The Warriors',
      description: 'Strong, resilient, and courageously fierce',
      emoji: '💪'
    },
    thinkers: {
      name: 'The Thinkers',
      description: 'Intelligent, analytical, and wise',
      emoji: '🧠'
    },
    joyful: {
      name: 'The Joyful',
      description: 'Happy, playful, and fun-loving spirits',
      emoji: '😊'
    },
    mystical: {
      name: 'The Mystical',
      description: 'Spiritual, intuitive, and magical beings',
      emoji: '🔮'
    },
    professionals: {
      name: 'The Professionals',
      description: 'Career-focused, ambitious, and polished',
      emoji: '💼'
    }
  };
  
  return categoryInfo[category] || { name: category, description: '', emoji: '✨' };
}
