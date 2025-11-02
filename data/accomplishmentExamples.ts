// Accomplishment examples to help users recognize ALL wins (big and small)
export const accomplishmentExamples = {
  // Micro accomplishments (often dismissed but VALID!)
  micro: [
    { text: 'Spoke up in a meeting', emoji: '🗣️', category: 'Communication' },
    { text: 'Asked a clarifying question', emoji: '❓', category: 'Learning' },
    { text: 'Helped a colleague troubleshoot', emoji: '🤝', category: 'Collaboration' },
    { text: 'Finished a task on time', emoji: '⏰', category: 'Reliability' },
    { text: 'Organized your workspace', emoji: '🗂️', category: 'Organization' },
    { text: 'Responded to all emails today', emoji: '📧', category: 'Communication' },
    { text: 'Took a break when needed', emoji: '☕', category: 'Self-Care' },
    { text: 'Said no to protect your time', emoji: '🛡️', category: 'Boundaries' },
    { text: 'Admitted you didn\'t know something', emoji: '🎓', category: 'Growth' },
    { text: 'Shared an idea, even if small', emoji: '💡', category: 'Innovation' },
    { text: 'Showed up despite feeling unmotivated', emoji: '💪', category: 'Resilience' },
    { text: 'Gave someone positive feedback', emoji: '👏', category: 'Leadership' },
  ],
  
  // Small accomplishments (daily wins)
  small: [
    { text: 'Completed a project milestone', emoji: '🎯', category: 'Achievement' },
    { text: 'Learned a new skill or tool', emoji: '🛠️', category: 'Learning' },
    { text: 'Resolved a conflict constructively', emoji: '🤝', category: 'Collaboration' },
    { text: 'Mentored or helped someone learn', emoji: '👨‍🏫', category: 'Leadership' },
    { text: 'Improved a process or workflow', emoji: '⚙️', category: 'Innovation' },
    { text: 'Met a challenging deadline', emoji: '🏃', category: 'Performance' },
    { text: 'Received positive feedback', emoji: '⭐', category: 'Recognition' },
    { text: 'Fixed a bug or solved a problem', emoji: '🔧', category: 'Problem-Solving' },
    { text: 'Presented to your team', emoji: '📊', category: 'Communication' },
    { text: 'Volunteered for a new task', emoji: '🙋', category: 'Initiative' },
    { text: 'Stayed calm under pressure', emoji: '🧘', category: 'Resilience' },
    { text: 'Documented your work clearly', emoji: '📝', category: 'Communication' },
  ],
  
  // Medium accomplishments (weekly/monthly wins)
  medium: [
    { text: 'Led a successful project', emoji: '🚀', category: 'Leadership' },
    { text: 'Exceeded performance goals', emoji: '📈', category: 'Achievement' },
    { text: 'Built a new relationship or partnership', emoji: '🤝', category: 'Networking' },
    { text: 'Implemented a new system or process', emoji: '⚡', category: 'Innovation' },
    { text: 'Trained or onboarded team members', emoji: '👥', category: 'Leadership' },
    { text: 'Solved a complex problem', emoji: '🧩', category: 'Problem-Solving' },
    { text: 'Delivered a high-impact presentation', emoji: '🎤', category: 'Communication' },
    { text: 'Increased efficiency or productivity', emoji: '⚙️', category: 'Performance' },
    { text: 'Received a promotion or raise', emoji: '📊', category: 'Recognition' },
    { text: 'Published or shared your work publicly', emoji: '📢', category: 'Visibility' },
    { text: 'Navigated a difficult situation successfully', emoji: '🧭', category: 'Resilience' },
    { text: 'Built something from scratch', emoji: '🏗️', category: 'Innovation' },
  ],
  
  // Major accomplishments (quarterly/yearly wins)
  major: [
    { text: 'Launched a major product or initiative', emoji: '🎉', category: 'Achievement' },
    { text: 'Led organizational change', emoji: '🌟', category: 'Leadership' },
    { text: 'Won an award or recognition', emoji: '🏆', category: 'Recognition' },
    { text: 'Grew a team or department', emoji: '📈', category: 'Leadership' },
    { text: 'Secured major funding or partnership', emoji: '💰', category: 'Business' },
    { text: 'Published research or thought leadership', emoji: '📚', category: 'Expertise' },
    { text: 'Transformed a struggling project into success', emoji: '🔄', category: 'Resilience' },
    { text: 'Became a subject matter expert', emoji: '🎓', category: 'Expertise' },
    { text: 'Mentored multiple people to success', emoji: '🌱', category: 'Leadership' },
    { text: 'Created lasting impact on organization', emoji: '💫', category: 'Impact' },
  ],
};

// Encouraging messages for different accomplishment sizes
export const encouragementMessages = {
  micro: [
    { text: 'Every small step counts! 🌟', emoji: '🌟' },
    { text: 'This is how growth happens! 🌱', emoji: '🌱' },
    { text: 'Small wins add up to big success! ✨', emoji: '✨' },
    { text: 'You showed up—that matters! 💪', emoji: '💪' },
    { text: 'Progress over perfection! 🎯', emoji: '🎯' },
    { text: 'This is worth celebrating! 🎊', emoji: '🎊' },
  ],
  small: [
    { text: 'Great work! Keep building momentum! 🚀', emoji: '🚀' },
    { text: 'You\'re making real progress! 📈', emoji: '📈' },
    { text: 'This is a solid accomplishment! ⭐', emoji: '⭐' },
    { text: 'You should be proud of this! 🌟', emoji: '🌟' },
    { text: 'Consistency creates success! 💫', emoji: '💫' },
    { text: 'You\'re building something great! 🏗️', emoji: '🏗️' },
  ],
  medium: [
    { text: 'This is impressive! Well done! 🎉', emoji: '🎉' },
    { text: 'You\'re making significant impact! 💥', emoji: '💥' },
    { text: 'This deserves recognition! 🏅', emoji: '🏅' },
    { text: 'You\'re leveling up! 📊', emoji: '📊' },
    { text: 'This is leadership in action! 👑', emoji: '👑' },
    { text: 'You\'re creating real value! 💎', emoji: '💎' },
  ],
  major: [
    { text: 'This is REMARKABLE! 🏆', emoji: '🏆' },
    { text: 'You\'re making history! 🌟', emoji: '🌟' },
    { text: 'This is career-defining work! 💫', emoji: '💫' },
    { text: 'You\'re an inspiration! ✨', emoji: '✨' },
    { text: 'This is the kind of impact that matters! 🎯', emoji: '🎯' },
    { text: 'You\'ve earned every bit of this success! 👏', emoji: '👏' },
  ],
};

// Messages to combat "too small" bias
export const antiDismissalMessages = [
  {
    trigger: ['small', 'tiny', 'just', 'only', 'minor'],
    response: '🛑 Hold on! There\'s no such thing as "too small" to count. Every accomplishment matters!',
    emoji: '🛑',
  },
  {
    trigger: ['not a big deal', 'nothing special', 'anyone could'],
    response: '✋ Stop right there! If you did it, it counts. Don\'t minimize your effort!',
    emoji: '✋',
  },
  {
    trigger: ['lucky', 'timing', 'happened to'],
    response: '🎯 Luck favors the prepared! Your skills and effort made this possible.',
    emoji: '🎯',
  },
  {
    trigger: ['should have', 'could have done better'],
    response: '💪 Progress over perfection! Celebrate what you DID accomplish.',
    emoji: '💪',
  },
  {
    trigger: ['everyone else', 'others did more'],
    response: '🌟 This isn\'t a competition. Your journey and growth matter!',
    emoji: '🌟',
  },
];

// Size detector to categorize accomplishments
export function detectAccomplishmentSize(text: string): 'micro' | 'small' | 'medium' | 'major' {
  const lowerText = text.toLowerCase();
  
  // Major indicators
  const majorKeywords = ['launched', 'led team', 'promoted', 'award', 'published', 'transformed', 'grew', 'founded', 'won', 'achieved goal'];
  if (majorKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'major';
  }
  
  // Medium indicators
  const mediumKeywords = ['project', 'presented', 'implemented', 'trained', 'solved', 'exceeded', 'built', 'created', 'delivered'];
  if (mediumKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'medium';
  }
  
  // Small indicators
  const smallKeywords = ['completed', 'learned', 'helped', 'improved', 'fixed', 'resolved', 'met deadline'];
  if (smallKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'small';
  }
  
  // Default to micro (and that's OK!)
  return 'micro';
}

// Detect dismissive language
export function detectDismissiveLanguage(text: string): { isDismissive: boolean; message?: string; emoji?: string } {
  const lowerText = text.toLowerCase();
  
  for (const pattern of antiDismissalMessages) {
    if (pattern.trigger.some(trigger => lowerText.includes(trigger))) {
      return {
        isDismissive: true,
        message: pattern.response,
        emoji: pattern.emoji,
      };
    }
  }
  
  return { isDismissive: false };
}

// Get random encouragement for size
export function getEncouragement(size: 'micro' | 'small' | 'medium' | 'major'): { text: string; emoji: string } {
  const messages = encouragementMessages[size];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Get examples for inspiration
export function getExamplesBySize(size: 'micro' | 'small' | 'medium' | 'major', count: number = 3) {
  const examples = accomplishmentExamples[size];
  const shuffled = [...examples].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get all categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  Object.values(accomplishmentExamples).forEach(sizeArray => {
    sizeArray.forEach(item => categories.add(item.category));
  });
  return Array.from(categories).sort();
}
