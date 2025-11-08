// Kintsugi Philosophy-Based Reflection Prompts
// Organized by day of week and philosophical principle

export interface KintsugiPrompt {
  id: string;
  principle: 'mushin' | 'wabi-sabi' | 'kintsukuroi' | 'mottainai' | 'mono-no-aware';
  principleName: string;
  principleKanji: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  prompt: string;
  subPrompts: string[];
  reflectionGuide: string;
}

export const KINTSUGI_PROMPTS: KintsugiPrompt[] = [
  // MONDAY - Mushin (無心) - Acceptance Without Judgment
  {
    id: 'mushin-monday',
    principle: 'mushin',
    principleName: 'Mushin',
    principleKanji: '無心',
    dayOfWeek: 1,
    dayName: 'Mushin Monday',
    prompt: 'Observe a challenge without judgment',
    subPrompts: [
      'What challenge am I facing this week?',
      'Can I describe it without labeling myself as "good" or "bad"?',
      'What would a neutral observer see?',
      'How can I approach this with curiosity instead of criticism?'
    ],
    reflectionGuide: 'Mushin ("no mind") teaches us to observe experiences without attaching harsh judgment. Today, practice describing a challenge as if you were a scientist observing data, not a judge passing sentence.'
  },

  // TUESDAY - Mottainai (もったいない) - Nothing is Wasted
  {
    id: 'mottainai-tuesday',
    principle: 'mottainai',
    principleName: 'Mottainai',
    principleKanji: 'もったいない',
    dayOfWeek: 2,
    dayName: 'Mottainai Tuesday',
    prompt: 'What experience seemed wasted that actually taught you something?',
    subPrompts: [
      'What "failed" project or interaction still bothers me?',
      'What did I learn from that experience?',
      'How has that "wasted" time actually shaped my current strengths?',
      'What value can I extract from past disappointments?'
    ],
    reflectionGuide: 'Mottainai expresses regret over waste - but also reminds us that nothing is truly wasted if we learn from it. Every experience, positive or negative, adds to your complete story.'
  },

  // WEDNESDAY - Wabi-Sabi (侘寂) - Beauty in Imperfection
  {
    id: 'wabisabi-wednesday',
    principle: 'wabi-sabi',
    principleName: 'Wabi-Sabi',
    principleKanji: '侘寂',
    dayOfWeek: 3,
    dayName: 'Wabi-Sabi Wednesday',
    prompt: 'What imperfection are you learning to appreciate?',
    subPrompts: [
      'What rough edge or unfinished aspect of my work/life bothers me?',
      'How might this imperfection actually add character or value?',
      'What would I lose if everything was "perfect"?',
      'How can I embrace the beauty of works-in-progress?'
    ],
    reflectionGuide: 'Wabi-sabi celebrates imperfection, impermanence, and incompleteness. Your professional journey will have rough edges - that\'s what makes it authentic and uniquely yours.'
  },

  // THURSDAY - Mono no Aware (物の哀れ) - Awareness of Impermanence
  {
    id: 'mononoaware-thursday',
    principle: 'mono-no-aware',
    principleName: 'Mono no Aware',
    principleKanji: '物の哀れ',
    dayOfWeek: 4,
    dayName: 'Reflection Thursday',
    prompt: 'What temporary moment do you want to fully appreciate?',
    subPrompts: [
      'What current win or challenge won\'t last forever?',
      'How can I fully experience this moment knowing it will change?',
      'What will I miss about this phase when it\'s gone?',
      'How does impermanence make this moment more precious?'
    ],
    reflectionGuide: 'Mono no aware is the gentle sadness and appreciation for the transient nature of things. Both struggles and successes are temporary - savor them while they\'re here.'
  },

  // FRIDAY - Kintsukuroi (金継ぎ) - Golden Repair
  {
    id: 'kintsukuroi-friday',
    principle: 'kintsukuroi',
    principleName: 'Kintsukuroi',
    principleKanji: '金継ぎ',
    dayOfWeek: 5,
    dayName: 'Kintsukuroi Friday',
    prompt: 'What past struggle made you stronger?',
    subPrompts: [
      'What difficult experience from my past stands out?',
      'What strength did I develop because of that challenge?',
      'How has that "crack" become a golden part of my story?',
      'How would I be different if I hadn\'t faced that challenge?'
    ],
    reflectionGuide: 'Kintsukuroi is the art of repairing broken pottery with gold, making it more valuable than before. Your challenges, when processed and integrated, become the most precious parts of your story.'
  },

  // SATURDAY - Integration & Gratitude
  {
    id: 'gratitude-saturday',
    principle: 'wabi-sabi',
    principleName: 'Integration',
    principleKanji: '感謝',
    dayOfWeek: 6,
    dayName: 'Gratitude Saturday',
    prompt: 'What are you grateful for about your imperfect journey?',
    subPrompts: [
      'What imperfection am I learning to love?',
      'What "failure" am I grateful for in hindsight?',
      'What makes my journey uniquely beautiful?',
      'How have my cracks and repairs made me who I am?'
    ],
    reflectionGuide: 'Take time to appreciate the complete picture - wins, struggles, growth, and ongoing challenges. Your story is beautiful not despite its imperfections, but because of them.'
  },

  // SUNDAY - Rest & Observation
  {
    id: 'rest-sunday',
    principle: 'mushin',
    principleName: 'Rest & Reflection',
    principleKanji: '休息',
    dayOfWeek: 0,
    dayName: 'Reflection Sunday',
    prompt: 'What patterns do you notice when you step back?',
    subPrompts: [
      'Looking at the past week, what themes emerge?',
      'What am I learning about myself?',
      'What deserves attention this coming week?',
      'What can I let go of with compassion?'
    ],
    reflectionGuide: 'Rest is part of growth. Take time to observe your journey from a distance, without rushing to fix or change anything. What do you notice?'
  },

  // BONUS: Anytime Prompts
  {
    id: 'challenge-anytime',
    principle: 'kintsukuroi',
    principleName: 'Challenge Processing',
    principleKanji: '金継ぎ',
    dayOfWeek: -1, // Anytime
    dayName: 'When Facing Challenges',
    prompt: 'Transform a current challenge into future strength',
    subPrompts: [
      'What challenge am I facing right now?',
      'What is this teaching me?',
      'What strength might I develop from this?',
      'How might this become a golden seam in my story?'
    ],
    reflectionGuide: 'Challenges are not obstacles to your story - they ARE your story. This is where the gold gets added.'
  },

  {
    id: 'win-anytime',
    principle: 'mono-no-aware',
    principleName: 'Savoring Success',
    principleKanji: '物の哀れ',
    dayOfWeek: -1, // Anytime
    dayName: 'Celebrating Wins',
    prompt: 'Fully appreciate a recent accomplishment',
    subPrompts: [
      'What did I accomplish that I\'m proud of?',
      'What effort and growth led to this win?',
      'How can I savor this moment before moving to the next goal?',
      'What makes this accomplishment meaningful to me?'
    ],
    reflectionGuide: 'Success is temporary and precious. Before rushing to the next goal, pause and fully experience this win. What does it feel like? What does it mean?'
  }
];

// Get prompt for today
export function getTodaysPrompt(): KintsugiPrompt {
  const today = new Date().getDay(); // 0-6
  const todaysPrompts = KINTSUGI_PROMPTS.filter(p => p.dayOfWeek === today);
  return todaysPrompts[0] || KINTSUGI_PROMPTS[0];
}

// Get all anytime prompts
export function getAnytimePrompts(): KintsugiPrompt[] {
  return KINTSUGI_PROMPTS.filter(p => p.dayOfWeek === -1);
}

// Get prompt by principle
export function getPromptsByPrinciple(principle: string): KintsugiPrompt[] {
  return KINTSUGI_PROMPTS.filter(p => p.principle === principle);
}

// Get random prompt
export function getRandomPrompt(): KintsugiPrompt {
  const randomIndex = Math.floor(Math.random() * KINTSUGI_PROMPTS.length);
  return KINTSUGI_PROMPTS[randomIndex];
}
