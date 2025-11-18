// Growth Mindset Affirmations and Prompts
// Based on Carol Dweck's research and growth mindset principles

export interface GrowthMindsetPrompt {
  id: string;
  category: 'effort' | 'learning' | 'challenges' | 'persistence' | 'feedback' | 'success' | 'potential';
  categoryName: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  affirmation: string;
  prompt: string;
  subPrompts: string[];
  actionStep: string;
  icon: string; // emoji for visual appeal
}

export const GROWTH_MINDSET_PROMPTS: GrowthMindsetPrompt[] = [
  // MONDAY - Effort & Action
  {
    id: 'effort-monday',
    category: 'effort',
    categoryName: 'Effort Creates Mastery',
    dayOfWeek: 1,
    dayName: 'Momentum Monday',
    affirmation: 'My effort and dedication are building my future success.',
    prompt: 'What effort can I celebrate from last week?',
    subPrompts: [
      'What did I work hard on, even when it was difficult?',
      'How did my effort lead to progress, even if small?',
      'What would have happened if I hadn\'t put in that effort?',
      'What effort am I committed to this week?'
    ],
    actionStep: 'Identify one challenging task this week where your effort will make a difference.',
    icon: '💪'
  },

  // TUESDAY - Learning & Growth
  {
    id: 'learning-tuesday',
    category: 'learning',
    categoryName: 'Every Day I\'m Learning',
    dayOfWeek: 2,
    dayName: 'Learning Tuesday',
    affirmation: 'I am constantly learning and growing. Mistakes are proof I\'m trying.',
    prompt: 'What did I learn recently that stretched me?',
    subPrompts: [
      'What new skill or knowledge did I gain this week?',
      'What mistake taught me something valuable?',
      'How am I smarter today than I was last week?',
      'What do I want to learn next?'
    ],
    actionStep: 'Write down one thing you learned from a recent mistake or challenge.',
    icon: '🌱'
  },

  // WEDNESDAY - Challenges Are Opportunities
  {
    id: 'challenges-wednesday',
    category: 'challenges',
    categoryName: 'Challenges Build Strength',
    dayOfWeek: 3,
    dayName: 'Challenge Wednesday',
    affirmation: 'Challenges are opportunities to grow stronger and more capable.',
    prompt: 'What challenge am I ready to face?',
    subPrompts: [
      'What difficult task have I been avoiding?',
      'What would it mean to embrace this challenge instead of fearing it?',
      'What strength will I build by facing this?',
      'Who can I ask for help or support?'
    ],
    actionStep: 'Take one small step toward a challenge you\'ve been avoiding.',
    icon: '🎯'
  },

  // THURSDAY - Persistence & Resilience
  {
    id: 'persistence-thursday',
    category: 'persistence',
    categoryName: 'I Don\'t Give Up',
    dayOfWeek: 4,
    dayName: 'Persistence Thursday',
    affirmation: 'I am resilient. Setbacks don\'t stop me; they teach me how to try differently.',
    prompt: 'When have I persisted when things got hard?',
    subPrompts: [
      'What obstacle did I overcome by not giving up?',
      'What strategies did I try when my first approach didn\'t work?',
      'How did persistence pay off in the past?',
      'What current challenge requires my persistence?'
    ],
    actionStep: 'If something isn\'t working, try a different approach instead of giving up.',
    icon: '🔥'
  },

  // FRIDAY - Feedback & Improvement
  {
    id: 'feedback-friday',
    category: 'feedback',
    categoryName: 'Feedback Fuels Growth',
    dayOfWeek: 5,
    dayName: 'Feedback Friday',
    affirmation: 'Feedback is a gift. Criticism helps me improve and reach my goals.',
    prompt: 'What feedback can I use to improve?',
    subPrompts: [
      'What constructive feedback have I received recently?',
      'How can I use that feedback to get better?',
      'What feedback have I been resisting that might actually help?',
      'Who can I ask for honest feedback this week?'
    ],
    actionStep: 'Ask someone you trust for specific feedback on something you\'re working on.',
    icon: '💬'
  },

  // SATURDAY - Celebrating Success
  {
    id: 'success-saturday',
    category: 'success',
    categoryName: 'Success Is Built Daily',
    dayOfWeek: 6,
    dayName: 'Success Saturday',
    affirmation: 'My success is the result of consistent effort, learning, and growth.',
    prompt: 'What success can I celebrate this week?',
    subPrompts: [
      'What did I accomplish that I\'m proud of?',
      'What effort led to this success?',
      'What did I learn along the way?',
      'How can I build on this success?'
    ],
    actionStep: 'Share your win with someone who supported you or celebrate it privately.',
    icon: '🎉'
  },

  // SUNDAY - Unlimited Potential
  {
    id: 'potential-sunday',
    category: 'potential',
    categoryName: 'My Potential Is Unlimited',
    dayOfWeek: 0,
    dayName: 'Potential Sunday',
    affirmation: 'I am not limited by my current abilities. I can develop any skill with time and effort.',
    prompt: 'What potential am I ready to unlock?',
    subPrompts: [
      'What ability do I wish I had?',
      'What would it take to develop that ability?',
      'What small step can I take this week toward that goal?',
      'Who has developed this skill that I can learn from?'
    ],
    actionStep: 'Research one person who mastered a skill you want to learn. How did they do it?',
    icon: '✨'
  },

  // BONUS: Anytime Affirmations
  {
    id: 'struggling-anytime',
    category: 'persistence',
    categoryName: 'When Struggling',
    dayOfWeek: -1,
    dayName: 'When Things Feel Hard',
    affirmation: 'Struggle is part of learning. My brain is forming new connections right now.',
    prompt: 'What is this struggle teaching me?',
    subPrompts: [
      'What specifically is hard about this?',
      'What am I learning by working through this difficulty?',
      'What would make this easier?',
      'How can I ask for help while still challenging myself?'
    ],
    actionStep: 'Break down the hard thing into smaller, manageable steps. Start with just one.',
    icon: '🧗'
  },

  {
    id: 'comparison-anytime',
    category: 'learning',
    categoryName: 'When Comparing to Others',
    dayOfWeek: -1,
    dayName: 'When Comparing Myself',
    affirmation: 'I am on my own unique path. My only competition is who I was yesterday.',
    prompt: 'How have I grown compared to my past self?',
    subPrompts: [
      'What can I do now that I couldn\'t do a month ago?',
      'What have I learned recently?',
      'How am I stronger or wiser than before?',
      'What makes my journey unique and valuable?'
    ],
    actionStep: 'Write down 3 ways you\'ve grown in the past month, no matter how small.',
    icon: '🌟'
  },

  {
    id: 'impostor-anytime',
    category: 'potential',
    categoryName: 'When Feeling Like an Impostor',
    dayOfWeek: -1,
    dayName: 'When Doubting Myself',
    affirmation: 'I belong here. I earned my place through effort and growth, and I\'m still learning.',
    prompt: 'What evidence shows I\'m capable?',
    subPrompts: [
      'What challenges have I already overcome?',
      'What skills have I developed?',
      'What do others see in me that I might be overlooking?',
      'What would I tell a friend feeling this way?'
    ],
    actionStep: 'List 5 accomplishments or skills you have that prove you belong.',
    icon: '👑'
  },

  {
    id: 'fear-anytime',
    category: 'challenges',
    categoryName: 'When Feeling Afraid',
    dayOfWeek: -1,
    dayName: 'When Fear Shows Up',
    affirmation: 'Fear means I\'m growing. I can be scared and brave at the same time.',
    prompt: 'What is fear protecting me from... and what is it preventing?',
    subPrompts: [
      'What am I afraid of?',
      'What\'s the worst that could happen? The best?',
      'What am I missing out on by letting fear decide?',
      'What small step can I take despite the fear?'
    ],
    actionStep: 'Do one small thing that scares you. Prove to yourself you can handle it.',
    icon: '🦁'
  },

  {
    id: 'tired-anytime',
    category: 'effort',
    categoryName: 'When Feeling Tired',
    dayOfWeek: -1,
    dayName: 'When Energy Is Low',
    affirmation: 'Rest is productive. Taking care of myself fuels my long-term growth.',
    prompt: 'What does my mind and body need right now?',
    subPrompts: [
      'Am I physically tired or mentally exhausted?',
      'What would genuine rest look like today?',
      'What boundaries do I need to set?',
      'How can I recharge so I can show up fully tomorrow?'
    ],
    actionStep: 'Give yourself permission to rest. Growth requires recovery.',
    icon: '🛌'
  },

  {
    id: 'stuck-anytime',
    category: 'learning',
    categoryName: 'When Feeling Stuck',
    dayOfWeek: -1,
    dayName: 'When Progress Feels Slow',
    affirmation: 'Plateaus are part of growth. My brain is consolidating what I\'ve learned.',
    prompt: 'What if I\'m not stuck, just integrating?',
    subPrompts: [
      'What have I learned recently that needs time to sink in?',
      'What new approach could I try?',
      'Who could offer a fresh perspective?',
      'What would "good enough for now" look like?'
    ],
    actionStep: 'Try something different - a new method, a new resource, or a new perspective.',
    icon: '🔄'
  }
];

// Get prompt for today
export function getTodaysGrowthPrompt(): GrowthMindsetPrompt {
  const today = new Date().getDay(); // 0-6
  const todaysPrompts = GROWTH_MINDSET_PROMPTS.filter(p => p.dayOfWeek === today);
  return todaysPrompts[0] || GROWTH_MINDSET_PROMPTS[0];
}

// Get all anytime prompts
export function getAnytimeGrowthPrompts(): GrowthMindsetPrompt[] {
  return GROWTH_MINDSET_PROMPTS.filter(p => p.dayOfWeek === -1);
}

// Get prompt by category
export function getPromptsByCategory(category: string): GrowthMindsetPrompt[] {
  return GROWTH_MINDSET_PROMPTS.filter(p => p.category === category);
}

// Get random prompt
export function getRandomGrowthPrompt(): GrowthMindsetPrompt {
  const randomIndex = Math.floor(Math.random() * GROWTH_MINDSET_PROMPTS.length);
  return GROWTH_MINDSET_PROMPTS[randomIndex];
}

// Get all daily prompts (excludes anytime prompts)
export function getDailyGrowthPrompts(): GrowthMindsetPrompt[] {
  return GROWTH_MINDSET_PROMPTS.filter(p => p.dayOfWeek >= 0);
}
