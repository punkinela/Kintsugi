import { Affirmation, BiasInsight } from '@/types';

export const affirmations: Affirmation[] = [
  // Universal Accomplishment Affirmations
  {
    id: 'acc-1',
    text: 'I have overcome challenges that others might have given up on. My persistence is a testament to my strength.',
    category: 'accomplishment',
    tags: ['resilience', 'persistence', 'strength'],
    emoji: '💪',
  },
  {
    id: 'acc-2',
    text: 'Every skill I possess today was once something I knew nothing about. My growth is extraordinary.',
    category: 'growth',
    tags: ['learning', 'development', 'progress'],
    emoji: '🌱',
  },
  {
    id: 'acc-3',
    text: 'I have positively impacted at least one person\'s life. That ripple effect is immeasurable.',
    category: 'impact',
    tags: ['influence', 'kindness', 'connection'],
    emoji: '💫',
  },
  {
    id: 'acc-4',
    text: 'My unique perspective brings value to every conversation and situation I encounter.',
    category: 'strength',
    tags: ['uniqueness', 'perspective', 'value'],
    emoji: '✨',
  },
  {
    id: 'acc-5',
    text: 'I have survived 100% of my worst days. That\'s a perfect track record of resilience.',
    category: 'accomplishment',
    tags: ['survival', 'resilience', 'strength'],
    emoji: '🏆',
  },
  
  // Women-focused affirmations
  {
    id: 'women-1',
    text: 'I navigate spaces where women have historically been underrepresented, and my presence is breaking barriers.',
    category: 'accomplishment',
    tags: ['leadership', 'barrier-breaking', 'representation'],
    demographics: { gender: ['woman'] },
    emoji: '👑',
  },
  {
    id: 'women-2',
    text: 'I advocate for myself and other women without apology. Speaking up is not aggressive—it\'s necessary.',
    category: 'strength',
    tags: ['advocacy', 'voice', 'empowerment'],
    demographics: { gender: ['woman'] },
    emoji: '🗣️',
  },
  {
    id: 'women-3',
    text: 'My accomplishments are the result of my hard work and talent, not luck or being in the right place.',
    category: 'accomplishment',
    tags: ['merit', 'achievement', 'recognition'],
    demographics: { gender: ['woman'] },
  },
  {
    id: 'women-4',
    text: 'I balance multiple roles with grace, and each one showcases different aspects of my exceptional capabilities.',
    category: 'strength',
    tags: ['balance', 'multifaceted', 'capability'],
    demographics: { gender: ['woman'] },
  },
  
  // Men-focused affirmations
  {
    id: 'men-1',
    text: 'I embrace vulnerability as strength, not weakness. My emotional intelligence is powerful.',
    category: 'strength',
    tags: ['vulnerability', 'emotional-intelligence', 'growth'],
    demographics: { gender: ['man'] },
  },
  {
    id: 'men-2',
    text: 'I challenge traditional expectations and define success on my own terms. That courage is inspiring.',
    category: 'growth',
    tags: ['authenticity', 'courage', 'individuality'],
    demographics: { gender: ['man'] },
  },
  {
    id: 'men-3',
    text: 'I support and uplift others without feeling threatened. My confidence in myself is unshakeable.',
    category: 'impact',
    tags: ['support', 'confidence', 'leadership'],
    demographics: { gender: ['man'] },
  },
  
  // Non-binary focused affirmations
  {
    id: 'nb-1',
    text: 'I exist authentically in a world still learning to see me. My courage to be myself is powerful.',
    category: 'strength',
    tags: ['authenticity', 'courage', 'identity'],
    demographics: { gender: ['non-binary'] },
  },
  {
    id: 'nb-2',
    text: 'I educate others about my experience with patience and grace, even when it\'s not my responsibility.',
    category: 'impact',
    tags: ['education', 'patience', 'advocacy'],
    demographics: { gender: ['non-binary'] },
  },
  
  // Ethnicity-aware affirmations
  {
    id: 'eth-1',
    text: 'I carry the strength of my ancestors while forging my own unique path. That duality is powerful.',
    category: 'strength',
    tags: ['heritage', 'legacy', 'individuality'],
  },
  {
    id: 'eth-2',
    text: 'I navigate multiple cultural contexts with fluidity and grace. My adaptability is exceptional.',
    category: 'strength',
    tags: ['cultural-intelligence', 'adaptability', 'fluidity'],
  },
  {
    id: 'eth-3',
    text: 'My achievements challenge stereotypes and open doors for those who come after me.',
    category: 'impact',
    tags: ['representation', 'barrier-breaking', 'legacy'],
  },
  {
    id: 'eth-4',
    text: 'I bring diverse perspectives that enrich every space I occupy. My voice matters.',
    category: 'strength',
    tags: ['diversity', 'perspective', 'value'],
  },
  
  // Professional accomplishments
  {
    id: 'prof-1',
    text: 'I have developed expertise that took years of dedication. My knowledge is valuable.',
    category: 'accomplishment',
    tags: ['expertise', 'dedication', 'knowledge'],
  },
  {
    id: 'prof-2',
    text: 'I solve problems that others find challenging. My problem-solving ability is exceptional.',
    category: 'strength',
    tags: ['problem-solving', 'capability', 'skill'],
  },
  {
    id: 'prof-3',
    text: 'I have mentored or helped colleagues grow. My impact extends beyond my individual work.',
    category: 'impact',
    tags: ['mentorship', 'leadership', 'growth'],
  },
  {
    id: 'prof-4',
    text: 'I continuously learn and adapt in my field. My commitment to growth is admirable.',
    category: 'growth',
    tags: ['learning', 'adaptation', 'development'],
  },
  
  // Bias awareness affirmations
  {
    id: 'bias-1',
    text: 'Recognizing my accomplishments is not bragging when based on facts. I deserve to acknowledge my success.',
    category: 'bias-awareness',
    tags: ['self-recognition', 'facts', 'awareness'],
  },
  {
    id: 'bias-2',
    text: 'I challenge the inner voice that minimizes my achievements. My accomplishments speak when I give them voice.',
    category: 'bias-awareness',
    tags: ['self-advocacy', 'voice', 'recognition'],
  },
  {
    id: 'bias-3',
    text: 'I notice when I attribute my success to luck instead of skill. I am learning to own my achievements.',
    category: 'bias-awareness',
    tags: ['attribution', 'awareness', 'growth'],
  },
  {
    id: 'bias-4',
    text: 'I recognize that staying silent about my accomplishments doesn\'t serve me or others who need to see what\'s possible.',
    category: 'bias-awareness',
    tags: ['visibility', 'representation', 'impact'],
  },
  {
    id: 'bias-5',
    text: 'I am learning to celebrate my wins without waiting for external validation. My self-recognition is powerful.',
    category: 'bias-awareness',
    tags: ['self-validation', 'celebration', 'empowerment'],
  },
  
  // Additional diverse affirmations
  {
    id: 'div-1',
    text: 'I have turned failures into learning opportunities. My resilience transforms setbacks into growth.',
    category: 'growth',
    tags: ['resilience', 'learning', 'transformation'],
  },
  {
    id: 'div-2',
    text: 'I show up consistently even when motivation wanes. My discipline is powerful.',
    category: 'strength',
    tags: ['discipline', 'consistency', 'commitment'],
  },
  {
    id: 'div-3',
    text: 'I have created something from nothing—an idea, a project, a solution. My creativity is powerful.',
    category: 'accomplishment',
    tags: ['creativity', 'innovation', 'creation'],
  },
  {
    id: 'div-4',
    text: 'I listen deeply and make others feel heard. My empathy creates meaningful connections.',
    category: 'impact',
    tags: ['empathy', 'listening', 'connection'],
  },
  {
    id: 'div-5',
    text: 'I have learned from criticism without letting it diminish my self-worth. My growth mindset is powerful.',
    category: 'growth',
    tags: ['growth-mindset', 'learning', 'resilience'],
  },
];

// Export bias insights from separate file
export { biasInsights, getRandomBiasInsight, getBiasInsightsByCategory, getAllBiasCategories } from './biasInsights';

export function getPersonalizedAffirmations(
  profile: { gender?: string; ethnicity?: string },
  count: number = 5
): Affirmation[] {
  const filtered = affirmations.filter((aff) => {
    // If no demographics specified, include universal affirmations
    if (!aff.demographics) return true;
    
    // Check gender match
    if (profile.gender && aff.demographics.gender) {
      return aff.demographics.gender.includes(profile.gender);
    }
    
    // Check ethnicity match
    if (profile.ethnicity && aff.demographics.ethnicity) {
      return aff.demographics.ethnicity.includes(profile.ethnicity);
    }
    
    return true;
  });
  
  // Shuffle and return requested count
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
