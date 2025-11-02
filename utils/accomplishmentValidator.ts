// Validates that accomplishments are actionable achievements, not physical attributes or privileges

export interface ValidationResult {
  isValid: boolean;
  category?: 'action' | 'privilege' | 'attribute' | 'opinion';
  message?: string;
  emoji?: string;
  suggestion?: string;
}

// Physical attributes that are not accomplishments
const physicalAttributes = [
  'hair', 'eyes', 'tall', 'short', 'thin', 'attractive', 'beautiful', 'handsome', 
  'pretty', 'cute', 'young', 'skin', 'face', 'body', 'looks', 'appearance'
];

// Privilege indicators (not accomplishments)
const privilegeIndicators = [
  'born', 'family money', 'inheritance', 'trust fund', 'wealthy parents',
  'private school', 'connections', 'network from birth', 'legacy admission'
];

// Opinion/subjective statements (not accomplishments)
const subjectiveOpinions = [
  'i am smart', 'i am talented', 'i am good', 'i am the best',
  'i am better than', 'i am superior', 'i am perfect'
];

// Action verbs that indicate real accomplishments
const actionVerbs = [
  'completed', 'achieved', 'led', 'created', 'built', 'developed', 'improved',
  'learned', 'taught', 'mentored', 'solved', 'fixed', 'implemented', 'delivered',
  'presented', 'wrote', 'published', 'launched', 'organized', 'managed', 'coordinated',
  'designed', 'analyzed', 'researched', 'trained', 'helped', 'supported', 'collaborated',
  'negotiated', 'resolved', 'increased', 'decreased', 'reduced', 'grew', 'expanded',
  'spoke up', 'asked', 'volunteered', 'contributed', 'participated', 'finished',
  'met', 'exceeded', 'won', 'earned', 'received', 'accomplished'
];

export function validateAccomplishment(text: string): ValidationResult {
  const lowerText = text.toLowerCase().trim();
  
  // Check if empty
  if (!lowerText || lowerText.length < 3) {
    return {
      isValid: false,
      category: 'opinion',
      message: 'Please describe what you did or achieved.',
      emoji: '✍️'
    };
  }
  
  // Check for physical attributes
  for (const attr of physicalAttributes) {
    if (lowerText.includes(attr) && !hasActionVerb(lowerText)) {
      return {
        isValid: false,
        category: 'attribute',
        message: '💡 Physical attributes aren\'t accomplishments. Focus on what you DID or ACHIEVED!',
        emoji: '💡',
        suggestion: 'Try: "Maintained a healthy routine" or "Took care of my well-being"'
      };
    }
  }
  
  // Check for privilege statements
  for (const priv of privilegeIndicators) {
    if (lowerText.includes(priv)) {
      return {
        isValid: false,
        category: 'privilege',
        message: '🎯 That\'s a privilege, not an accomplishment. What did YOU do with your opportunities?',
        emoji: '🎯',
        suggestion: 'Try: "Used my resources to help others" or "Leveraged my network to create opportunities"'
      };
    }
  }
  
  // Check for subjective opinions without action
  for (const opinion of subjectiveOpinions) {
    if (lowerText.includes(opinion) && !hasActionVerb(lowerText)) {
      return {
        isValid: false,
        category: 'opinion',
        message: '🎯 Show, don\'t tell! What did you DO that demonstrates this?',
        emoji: '🎯',
        suggestion: 'Try: "Solved a complex problem" or "Learned a new skill"'
      };
    }
  }
  
  // Check if it has an action verb
  if (!hasActionVerb(lowerText)) {
    return {
      isValid: false,
      category: 'opinion',
      message: '💪 Great! Now what did you DO? Add an action verb to make it an accomplishment!',
      emoji: '💪',
      suggestion: 'Examples: "I completed...", "I helped...", "I learned...", "I created..."'
    };
  }
  
  // Valid accomplishment!
  return {
    isValid: true,
    category: 'action',
    message: '✅ This is an actionable accomplishment!',
    emoji: '✅'
  };
}

function hasActionVerb(text: string): boolean {
  const lowerText = text.toLowerCase();
  return actionVerbs.some(verb => lowerText.includes(verb));
}

// Get category emoji
export function getCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    'Communication': '🗣️',
    'Learning': '🎓',
    'Collaboration': '🤝',
    'Reliability': '⏰',
    'Organization': '🗂️',
    'Self-Care': '💚',
    'Boundaries': '🛡️',
    'Growth': '🌱',
    'Innovation': '💡',
    'Resilience': '💪',
    'Leadership': '👑',
    'Achievement': '🎯',
    'Performance': '📊',
    'Recognition': '⭐',
    'Problem-Solving': '🔧',
    'Networking': '🤝',
    'Impact': '💫',
    'Expertise': '🎓',
    'Business': '💼',
    'Visibility': '📢',
    'General': '✨'
  };
  
  return emojiMap[category] || '✨';
}

// Suggest actionable reframes
export function suggestActionableReframe(text: string): string[] {
  const lowerText = text.toLowerCase();
  const suggestions: string[] = [];
  
  if (lowerText.includes('smart') || lowerText.includes('intelligent')) {
    suggestions.push('Solved a complex problem that others struggled with');
    suggestions.push('Learned a new skill quickly');
    suggestions.push('Made a strategic decision that paid off');
  }
  
  if (lowerText.includes('talented') || lowerText.includes('good at')) {
    suggestions.push('Received positive feedback on my work');
    suggestions.push('Exceeded performance expectations');
    suggestions.push('Developed expertise in my field');
  }
  
  if (lowerText.includes('lucky') || lowerText.includes('fortunate')) {
    suggestions.push('Prepared myself to seize opportunities');
    suggestions.push('Built relationships that opened doors');
    suggestions.push('Positioned myself for success through hard work');
  }
  
  if (physicalAttributes.some(attr => lowerText.includes(attr))) {
    suggestions.push('Maintained a healthy self-care routine');
    suggestions.push('Took care of my physical and mental well-being');
    suggestions.push('Prioritized my health and wellness');
  }
  
  return suggestions;
}
