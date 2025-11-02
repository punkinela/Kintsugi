// Emoji mappings for affirmations based on category and tags
export function getAffirmationEmoji(category: string, tags: string[]): string {
  // Category-based emojis
  const categoryEmojis: { [key: string]: string } = {
    'accomplishment': '🏆',
    'strength': '💪',
    'growth': '🌱',
    'impact': '💫',
    'bias-awareness': '🎯',
  };
  
  // Tag-based emojis (more specific)
  const tagEmojis: { [key: string]: string } = {
    // Resilience & Strength
    'resilience': '💪',
    'persistence': '🔥',
    'strength': '💪',
    'courage': '🦁',
    'discipline': '⚡',
    
    // Growth & Learning
    'learning': '📚',
    'development': '🌱',
    'progress': '📈',
    'growth': '🌱',
    'transformation': '🦋',
    'growth-mindset': '🧠',
    
    // Impact & Connection
    'influence': '💫',
    'kindness': '💜',
    'connection': '🤝',
    'empathy': '❤️',
    'mentorship': '👨‍🏫',
    'leadership': '👑',
    
    // Uniqueness & Value
    'uniqueness': '✨',
    'perspective': '👁️',
    'value': '💎',
    'creativity': '🎨',
    'innovation': '💡',
    
    // Achievement & Recognition
    'achievement': '🎯',
    'recognition': '⭐',
    'success': '🏆',
    'excellence': '🌟',
    
    // Advocacy & Voice
    'advocacy': '🗣️',
    'voice': '📢',
    'empowerment': '💪',
    'representation': '👥',
    'barrier-breaking': '🚀',
    
    // Authenticity & Identity
    'authenticity': '✨',
    'identity': '🌈',
    'individuality': '💫',
    
    // Professional
    'expertise': '🎓',
    'problem-solving': '🧩',
    'skill': '🛠️',
    'knowledge': '📖',
    
    // Bias Awareness
    'self-recognition': '🎯',
    'awareness': '👁️',
    'self-advocacy': '🗣️',
    'visibility': '💡',
    'self-validation': '✅',
  };
  
  // Check tags first (more specific)
  for (const tag of tags) {
    if (tagEmojis[tag]) {
      return tagEmojis[tag];
    }
  }
  
  // Fall back to category
  return categoryEmojis[category] || '✨';
}

// Get emoji for accomplishment size
export function getSizeEmoji(size: 'micro' | 'small' | 'medium' | 'major'): string {
  const sizeEmojis = {
    micro: '🌱',
    small: '⭐',
    medium: '🚀',
    major: '🏆',
  };
  return sizeEmojis[size];
}

// Get category display emoji
export function getCategoryDisplayEmoji(category: string): string {
  const displayEmojis: { [key: string]: string } = {
    'accomplishment': '🏆',
    'strength': '💪',
    'growth': '🌱',
    'impact': '💫',
    'bias-awareness': '🎯',
  };
  return displayEmojis[category] || '✨';
}
