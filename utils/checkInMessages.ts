// Check-in messages based on how long user has been away

export interface CheckInMessage {
  message: string;
  emoji: string;
  tone: 'welcoming' | 'caring' | 'encouraging' | 'celebrating';
  actionPrompt?: string;
}

export function getCheckInMessage(daysSinceLastVisit: number, userName?: string): CheckInMessage | null {
  const name = userName || 'friend';
  
  // Same day - no special message
  if (daysSinceLastVisit === 0) {
    return null;
  }
  
  // 1 day - gentle welcome back
  if (daysSinceLastVisit === 1) {
    return {
      message: `Welcome back, ${name}! 💜`,
      emoji: '👋',
      tone: 'welcoming',
      actionPrompt: 'Ready to celebrate today\'s wins?'
    };
  }
  
  // 2-3 days - friendly check-in
  if (daysSinceLastVisit <= 3) {
    return {
      message: `Good to see you again, ${name}! We missed you! 🌟`,
      emoji: '🤗',
      tone: 'welcoming',
      actionPrompt: 'What have you accomplished since we last connected?'
    };
  }
  
  // 4-7 days - caring check-in
  if (daysSinceLastVisit <= 7) {
    return {
      message: `Hey ${name}, we haven't seen you in a few days. Hope you're doing okay! 💙`,
      emoji: '💙',
      tone: 'caring',
      actionPrompt: 'Sometimes life gets busy - that\'s okay! Want to share what\'s been happening?'
    };
  }
  
  // 8-14 days - concerned but supportive
  if (daysSinceLastVisit <= 14) {
    return {
      message: `${name}, we've missed you! It's been over a week. Are you okay? 🫂`,
      emoji: '🫂',
      tone: 'caring',
      actionPrompt: 'Remember: even small steps count. You don\'t have to be perfect to be valued.'
    };
  }
  
  // 15-30 days - gentle encouragement
  if (daysSinceLastVisit <= 30) {
    return {
      message: `Welcome back, ${name}! It's been a while, and that's completely okay. 🌈`,
      emoji: '🌈',
      tone: 'encouraging',
      actionPrompt: 'Life happens. You\'re here now, and that\'s what matters. Ready to reconnect with your wins?'
    };
  }
  
  // 31-60 days - warm re-welcome
  if (daysSinceLastVisit <= 60) {
    return {
      message: `${name}! So glad you're back! We've been thinking about you. 💫`,
      emoji: '💫',
      tone: 'encouraging',
      actionPrompt: 'No judgment, just support. Want to start fresh and celebrate where you are today?'
    };
  }
  
  // 61-90 days - celebration of return
  if (daysSinceLastVisit <= 90) {
    return {
      message: `Look who's back! ${name}, we're so happy to see you again! 🎉`,
      emoji: '🎉',
      tone: 'celebrating',
      actionPrompt: 'It takes courage to come back. That itself is an accomplishment worth celebrating!'
    };
  }
  
  // 90+ days - fresh start
  return {
    message: `${name}! Welcome back like it's the first time! So glad you're here. ✨`,
    emoji: '✨',
    tone: 'celebrating',
    actionPrompt: 'Every day is a chance to start fresh. Let\'s celebrate your journey - starting now!'
  };
}

export function getDaysSinceLastVisit(lastVisitDate: string): number {
  const last = new Date(lastVisitDate);
  const now = new Date();
  
  // Reset time to midnight for accurate day calculation
  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Motivational messages for different scenarios
export const motivationalMessages = {
  comeback: [
    "The fact that you came back shows your commitment to growth. That's powerful! 💪",
    "Welcome back! Your journey doesn't have to be perfect, just persistent. 🌱",
    "You're here. That's the first step, and it counts! 🌟",
    "Life gets busy, but you made time for yourself today. That's self-care! 💜"
  ],
  
  consistency: [
    "You're building a powerful habit of self-recognition! 🔥",
    "Your consistency is inspiring! Keep showing up for yourself. ⭐",
    "Day by day, you're strengthening your self-advocacy muscle! 💪",
    "This regular practice is changing your relationship with your accomplishments! 🌈"
  ],
  
  longAbsence: [
    "No matter how long you've been away, you're always welcome back. 🤗",
    "There's no 'right' way to use this tool. You're here now, and that's perfect. ✨",
    "Your worth isn't measured by how often you visit. You're valued, period. 💎",
    "Sometimes we need breaks. Welcome back when you're ready - we're here! 🌸"
  ]
};

// Get appropriate motivational message based on visit pattern
export function getMotivationalMessage(daysSinceLastVisit: number, totalVisits: number): string {
  if (daysSinceLastVisit === 0 && totalVisits > 7) {
    // Consistent user
    return motivationalMessages.consistency[Math.floor(Math.random() * motivationalMessages.consistency.length)];
  } else if (daysSinceLastVisit > 14) {
    // Long absence
    return motivationalMessages.longAbsence[Math.floor(Math.random() * motivationalMessages.longAbsence.length)];
  } else if (daysSinceLastVisit > 0) {
    // Comeback
    return motivationalMessages.comeback[Math.floor(Math.random() * motivationalMessages.comeback.length)];
  }
  
  return '';
}
