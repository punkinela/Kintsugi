// Writing Prompts System for Journal Entries

export interface WritingPrompt {
  id: string;
  text: string;
  category: 'reflection' | 'gratitude' | 'growth' | 'achievement' | 'challenge' | 'future' | 'relationships';
  difficulty: 'easy' | 'medium' | 'deep';
  tags: string[];
}

const PROMPTS: WritingPrompt[] = [
  // Reflection
  { id: '1', text: 'What did I learn about myself today?', category: 'reflection', difficulty: 'easy', tags: ['self-awareness', 'learning'] },
  { id: '2', text: 'What moment today made me feel most alive?', category: 'reflection', difficulty: 'medium', tags: ['joy', 'presence'] },
  { id: '3', text: 'If I could redo one thing from today, what would it be and why?', category: 'reflection', difficulty: 'deep', tags: ['regret', 'growth'] },
  { id: '4', text: 'What patterns am I noticing in my thoughts and behaviors lately?', category: 'reflection', difficulty: 'deep', tags: ['patterns', 'awareness'] },

  // Gratitude
  { id: '5', text: 'What three things am I grateful for today?', category: 'gratitude', difficulty: 'easy', tags: ['appreciation', 'positivity'] },
  { id: '6', text: 'Who made a positive impact on my day and how?', category: 'gratitude', difficulty: 'easy', tags: ['relationships', 'appreciation'] },
  { id: '7', text: 'What skill or ability of mine am I most thankful for?', category: 'gratitude', difficulty: 'medium', tags: ['self-appreciation', 'strengths'] },
  { id: '8', text: 'What challenge am I grateful for because it helped me grow?', category: 'gratitude', difficulty: 'deep', tags: ['growth', 'adversity'] },

  // Growth
  { id: '9', text: 'What is one way I stepped outside my comfort zone recently?', category: 'growth', difficulty: 'easy', tags: ['courage', 'change'] },
  { id: '10', text: 'What limiting belief can I challenge today?', category: 'growth', difficulty: 'medium', tags: ['mindset', 'beliefs'] },
  { id: '11', text: 'How have I changed in the past year? What contributed to this growth?', category: 'growth', difficulty: 'deep', tags: ['transformation', 'evolution'] },
  { id: '12', text: 'What skill do I want to develop and why does it matter to me?', category: 'growth', difficulty: 'medium', tags: ['learning', 'goals'] },

  // Achievement
  { id: '13', text: 'What is something I accomplished today, no matter how small?', category: 'achievement', difficulty: 'easy', tags: ['wins', 'progress'] },
  { id: '14', text: 'What obstacle did I overcome recently and how did I do it?', category: 'achievement', difficulty: 'medium', tags: ['resilience', 'problem-solving'] },
  { id: '15', text: 'What am I most proud of about myself right now?', category: 'achievement', difficulty: 'medium', tags: ['pride', 'self-worth'] },
  { id: '16', text: 'When did I demonstrate a quality I admire in others?', category: 'achievement', difficulty: 'deep', tags: ['values', 'character'] },

  // Challenge
  { id: '17', text: 'What is currently challenging me and how can I approach it differently?', category: 'challenge', difficulty: 'medium', tags: ['problem-solving', 'perspective'] },
  { id: '18', text: 'What am I avoiding and what would happen if I faced it?', category: 'challenge', difficulty: 'deep', tags: ['courage', 'fear'] },
  { id: '19', text: 'What can I learn from a recent setback?', category: 'challenge', difficulty: 'medium', tags: ['resilience', 'learning'] },
  { id: '20', text: 'How can I turn a current struggle into an opportunity?', category: 'challenge', difficulty: 'deep', tags: ['mindset', 'opportunity'] },

  // Future
  { id: '21', text: 'What does my ideal day look like one year from now?', category: 'future', difficulty: 'easy', tags: ['vision', 'goals'] },
  { id: '22', text: 'What small step can I take tomorrow towards my bigger goals?', category: 'future', difficulty: 'easy', tags: ['action', 'planning'] },
  { id: '23', text: 'If I had no fear of failure, what would I pursue?', category: 'future', difficulty: 'deep', tags: ['dreams', 'courage'] },
  { id: '24', text: 'What legacy do I want to leave behind?', category: 'future', difficulty: 'deep', tags: ['purpose', 'impact'] },

  // Relationships
  { id: '25', text: 'Who do I need to thank or appreciate today?', category: 'relationships', difficulty: 'easy', tags: ['gratitude', 'connection'] },
  { id: '26', text: 'How did I show up for someone I care about recently?', category: 'relationships', difficulty: 'medium', tags: ['support', 'love'] },
  { id: '27', text: 'What boundary do I need to set or reinforce?', category: 'relationships', difficulty: 'deep', tags: ['self-care', 'boundaries'] },
  { id: '28', text: 'How can I be more present with the people who matter most?', category: 'relationships', difficulty: 'medium', tags: ['presence', 'quality-time'] },
];

// Get prompt of the day (deterministic based on date)
export function getPromptOfTheDay(): WritingPrompt {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % PROMPTS.length;
  return PROMPTS[index];
}

// Get random prompt
export function getRandomPrompt(): WritingPrompt {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

// Get prompts by category
export function getPromptsByCategory(category: WritingPrompt['category']): WritingPrompt[] {
  return PROMPTS.filter(p => p.category === category);
}

// Get prompts by difficulty
export function getPromptsByDifficulty(difficulty: WritingPrompt['difficulty']): WritingPrompt[] {
  return PROMPTS.filter(p => p.difficulty === difficulty);
}

// Get all prompts
export function getAllPrompts(): WritingPrompt[] {
  return PROMPTS;
}

// Get random prompt by category
export function getRandomPromptByCategory(category: WritingPrompt['category']): WritingPrompt {
  const prompts = getPromptsByCategory(category);
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Track used prompts
export function markPromptAsUsed(promptId: string): void {
  const used = getUsedPrompts();
  const today = new Date().toISOString().split('T')[0];

  if (!used[today]) {
    used[today] = [];
  }

  if (!used[today].includes(promptId)) {
    used[today].push(promptId);
    localStorage.setItem('usedPrompts', JSON.stringify(used));
  }
}

// Get used prompts
export function getUsedPrompts(): Record<string, string[]> {
  const stored = localStorage.getItem('usedPrompts');
  return stored ? JSON.parse(stored) : {};
}

// Check if prompt was used today
export function wasPromptUsedToday(promptId: string): boolean {
  const used = getUsedPrompts();
  const today = new Date().toISOString().split('T')[0];
  return used[today]?.includes(promptId) || false;
}

// Get unused prompts for today
export function getUnusedPromptsForToday(): WritingPrompt[] {
  const used = getUsedPrompts();
  const today = new Date().toISOString().split('T')[0];
  const usedToday = used[today] || [];

  return PROMPTS.filter(p => !usedToday.includes(p.id));
}

// Get random unused prompt
export function getRandomUnusedPrompt(): WritingPrompt {
  const unused = getUnusedPromptsForToday();

  if (unused.length === 0) {
    // All prompts used, return random prompt
    return getRandomPrompt();
  }

  return unused[Math.floor(Math.random() * unused.length)];
}
