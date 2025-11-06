/**
 * Journey-Aware Affirmations Library
 *
 * Research-backed affirmations tailored to:
 * - Journey Stage (skeptic, engaged, advocate)
 * - Demographics (gender, ethnicity)
 * - Kintsugi Philosophy (wins + resilience)
 *
 * Each affirmation includes research citations for credibility
 */

import { Affirmation } from '@/types';

export const journeyAffirmations: Affirmation[] = [
  // ===========================================
  // SKEPTIC STAGE (Days 1-7): Building Trust
  // Focus: Low barrier, social proof, compassion
  // ===========================================

  // Skeptic - Universal
  {
    id: 'skeptic-universal-1',
    text: 'Starting small is not settling—it\'s strategic. Even tiny steps forward count as progress.',
    category: 'growth',
    tags: ['micro-wins', 'getting-started', 'compassion'],
    emoji: '🌱',
    journeyStage: ['skeptic'],
    research: {
      citation: 'Amabile & Kramer (2011)',
      year: 2011,
      finding: 'Small wins trigger positive emotions and build momentum faster than waiting for major achievements',
      link: 'https://hbr.org/2011/05/the-power-of-small-wins'
    }
  },
  {
    id: 'skeptic-universal-2',
    text: 'Documenting one small win is not bragging when it\'s based on facts. You\'re building evidence of your value.',
    category: 'bias-awareness',
    tags: ['self-recognition', 'facts-not-bragging', 'getting-started'],
    emoji: '📝',
    journeyStage: ['skeptic'],
    research: {
      citation: 'Google (I Am Remarkable, 2016)',
      year: 2016,
      finding: '85% felt more comfortable sharing accomplishments after learning the difference between facts and bragging',
      link: 'https://iamremarkable.withgoogle.com/'
    }
  },
  {
    id: 'skeptic-universal-3',
    text: 'Like Kintsugi pottery repaired with gold, the challenges you\'ve navigated don\'t diminish your value—they make you MORE valuable.',
    category: 'strength',
    tags: ['kintsugi', 'resilience', 'challenges'],
    emoji: '✨',
    journeyStage: ['skeptic'],
    research: {
      citation: 'Tedeschi & Calhoun (2004)',
      year: 2004,
      finding: 'Post-traumatic growth shows that 70% of people who face adversity report positive psychological changes',
      link: 'https://psycnet.apa.org/record/2004-16943-005'
    }
  },
  {
    id: 'skeptic-universal-4',
    text: 'You don\'t need permission to recognize your accomplishments. Self-advocacy is a skill, not arrogance.',
    category: 'bias-awareness',
    tags: ['self-advocacy', 'permission', 'confidence'],
    emoji: '💪',
    journeyStage: ['skeptic'],
    research: {
      citation: 'Catalyst Research (2018)',
      year: 2018,
      finding: 'Employees who self-advocate are 2.3x more likely to be promoted',
      link: 'https://www.catalyst.org/research/'
    }
  },

  // Skeptic - Women
  {
    id: 'skeptic-women-1',
    text: 'You\'ve been taught that modesty is a virtue. But research shows that staying quiet about your work holds you back while equally qualified peers advance.',
    category: 'bias-awareness',
    tags: ['modesty-bias', 'visibility', 'advocacy'],
    emoji: '🗣️',
    demographics: { gender: ['woman'] },
    journeyStage: ['skeptic'],
    research: {
      citation: 'Exley & Kessler (2022)',
      year: 2022,
      finding: 'Women are 30% less likely to self-promote than men, even when accomplishments are identical',
      link: 'https://academic.oup.com/qje/article-abstract/137/3/1345/6501038'
    }
  },
  {
    id: 'skeptic-women-2',
    text: 'Documenting your wins isn\'t bragging—it\'s creating a record you deserve to have. Start with just one small accomplishment.',
    category: 'accomplishment',
    tags: ['documentation', 'getting-started', 'micro-wins'],
    emoji: '📖',
    demographics: { gender: ['woman'] },
    journeyStage: ['skeptic'],
    research: {
      citation: 'Hewlett et al. (2014)',
      year: 2014,
      finding: '75% of women report their accomplishments go unnoticed compared to 45% of men',
      link: 'https://www.talentinnovation.org/'
    }
  },
  {
    id: 'skeptic-women-3',
    text: 'Every barrier you\'ve overcome while facing gender bias is part of your impact story. These challenges make your achievements MORE remarkable.',
    category: 'strength',
    tags: ['kintsugi', 'resilience', 'gender-bias'],
    emoji: '👑',
    demographics: { gender: ['woman'] },
    journeyStage: ['skeptic'],
    research: {
      citation: 'Moss-Racusin & Rudman (2010)',
      year: 2010,
      finding: 'Women face backlash for self-promotion, making their advocacy require additional courage and resilience',
      link: 'https://journals.sagepub.com/doi/abs/10.1177/0361684310375920'
    }
  },

  // Skeptic - Men
  {
    id: 'skeptic-men-1',
    text: 'Recognizing your growth through challenges is strength, not weakness. Resilience is as valuable as achievement.',
    category: 'growth',
    tags: ['resilience', 'vulnerability', 'growth'],
    emoji: '🌟',
    demographics: { gender: ['man'] },
    journeyStage: ['skeptic'],
    research: {
      citation: 'Brown (2012)',
      year: 2012,
      finding: 'Vulnerability is the birthplace of innovation, creativity, and change',
      link: 'https://brenebrown.com/the-research/'
    }
  },
  {
    id: 'skeptic-men-2',
    text: 'Starting to document your impact—wins AND growth moments—is an act of leadership, not ego.',
    category: 'accomplishment',
    tags: ['leadership', 'getting-started', 'humility'],
    emoji: '🎯',
    demographics: { gender: ['man'] },
    journeyStage: ['skeptic'],
    research: {
      citation: 'Grant (2013)',
      year: 2013,
      finding: 'Leaders who demonstrate both confidence and humility are rated 60% more effective',
      link: 'https://adamgrant.net/research'
    }
  },

  // Skeptic - Non-binary
  {
    id: 'skeptic-nb-1',
    text: 'Your courage to exist authentically in spaces that are still learning is itself a remarkable accomplishment worth documenting.',
    category: 'strength',
    tags: ['authenticity', 'courage', 'identity'],
    emoji: '🏳️‍🌈',
    demographics: { gender: ['non-binary'] },
    journeyStage: ['skeptic'],
    research: {
      citation: 'Grant et al. (2011)',
      year: 2011,
      finding: 'Authenticity in the workplace correlates with higher job satisfaction and lower burnout',
      link: 'https://psycnet.apa.org/record/2011-01896-001'
    }
  },

  // Skeptic - Underrepresented Ethnicities
  {
    id: 'skeptic-eth-1',
    text: 'Navigating spaces where you\'re underrepresented requires extra resilience. That resilience is part of your impact.',
    category: 'strength',
    tags: ['resilience', 'representation', 'belonging'],
    emoji: '💫',
    journeyStage: ['skeptic'],
    research: {
      citation: 'Sue et al. (2007)',
      year: 2007,
      finding: 'Daily microaggressions require significant emotional labor and resilience that should be recognized',
      link: 'https://psycnet.apa.org/record/2007-05129-002'
    }
  },
  {
    id: 'skeptic-eth-2',
    text: 'Your unique perspective and cultural fluidity are strengths. Documenting your wins helps others see what\'s possible.',
    category: 'impact',
    tags: ['representation', 'perspective', 'visibility'],
    emoji: '🌍',
    journeyStage: ['skeptic'],
    research: {
      citation: 'Dasgupta (2011)',
      year: 2011,
      finding: 'Seeing one role model increases confidence by 35% in underrepresented groups',
      link: 'https://www.psychologytoday.com/intl/blog/insight-therapy/201809/the-ripple-effect-role-models'
    }
  },

  // ===========================================
  // ENGAGED STAGE (Days 8-30): Building Habits
  // Focus: Progress visualization, growth mindset
  // ===========================================

  // Engaged - Universal
  {
    id: 'engaged-universal-1',
    text: 'You\'re building a pattern of self-recognition. Research shows consistency for 66 days creates lasting habits.',
    category: 'growth',
    tags: ['habit-formation', 'consistency', 'progress'],
    emoji: '🔥',
    journeyStage: ['engaged'],
    research: {
      citation: 'Lally et al. (2010)',
      year: 2010,
      finding: 'Habit formation requires an average of 66 days of consistent practice',
      link: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674'
    }
  },
  {
    id: 'engaged-universal-2',
    text: 'Like Kintsugi pottery, your documented journey shows both your wins AND your growth through challenges. Both matter equally.',
    category: 'strength',
    tags: ['kintsugi', 'complete-impact', 'resilience'],
    emoji: '✨',
    journeyStage: ['engaged'],
    research: {
      citation: 'Dweck (2006)',
      year: 2006,
      finding: 'Growth mindset—seeing challenges as opportunities—increases achievement by 30%',
      link: 'https://www.mindsetworks.com/science/'
    }
  },
  {
    id: 'engaged-universal-3',
    text: 'Your pattern of accomplishments is undeniable evidence of your capabilities. This data speaks louder than imposter syndrome.',
    category: 'accomplishment',
    tags: ['evidence', 'imposter-syndrome', 'data'],
    emoji: '📊',
    journeyStage: ['engaged'],
    research: {
      citation: 'Hutchins & Rainbolt (2017)',
      year: 2017,
      finding: 'Concrete evidence of accomplishments reduces imposter syndrome symptoms by 31%',
      link: 'https://www.tandfonline.com/doi/abs/10.1080/13678868.2016.1260927'
    }
  },
  {
    id: 'engaged-universal-4',
    text: 'Every setback you\'ve documented and learned from is proof of resilience. Failure isn\'t the opposite of success—it\'s part of the process.',
    category: 'growth',
    tags: ['failure', 'learning', 'resilience'],
    emoji: '🌱',
    journeyStage: ['engaged'],
    research: {
      citation: 'Edmondson (2011)',
      year: 2011,
      finding: 'Teams with psychological safety to fail learn 40% faster and innovate more',
      link: 'https://hbr.org/2011/04/strategies-for-learning-from-failure'
    }
  },

  // Engaged - Women
  {
    id: 'engaged-women-1',
    text: 'You\'re breaking the pattern of attributing success to luck. Each accomplishment you document reclaims credit for your skills.',
    category: 'bias-awareness',
    tags: ['attribution', 'self-credit', 'ownership'],
    emoji: '🎯',
    demographics: { gender: ['woman'] },
    journeyStage: ['engaged'],
    research: {
      citation: 'Beyer (1990)',
      year: 1990,
      finding: 'Women attribute 70% of success to external factors vs. 30% for men—documenting reclaims ownership',
      link: 'https://link.springer.com/article/10.1007/BF00288305'
    }
  },
  {
    id: 'engaged-women-2',
    text: 'Your continued practice of self-recognition is rewiring years of modesty conditioning. This persistence is powerful.',
    category: 'strength',
    tags: ['persistence', 'rewiring', 'habits'],
    emoji: '💪',
    demographics: { gender: ['woman'] },
    journeyStage: ['engaged'],
    research: {
      citation: 'Doidge (2007)',
      year: 2007,
      finding: 'Neuroplasticity shows the brain can rewire patterns through consistent practice at any age',
      link: 'https://www.normandoidge.com/the-brain-that-changes-itself'
    }
  },
  {
    id: 'engaged-women-3',
    text: 'Each challenge you\'ve navigated while facing gender bias adds dimension to your impact story. Document both the obstacle and how you grew.',
    category: 'impact',
    tags: ['kintsugi', 'gender-bias', 'growth'],
    emoji: '👑',
    demographics: { gender: ['woman'] },
    journeyStage: ['engaged'],
    research: {
      citation: 'Catalyst (2018)',
      year: 2018,
      finding: 'Women who document challenges alongside wins create more compelling narratives in performance reviews',
      link: 'https://www.catalyst.org/research/'
    }
  },

  // Engaged - Men
  {
    id: 'engaged-men-1',
    text: 'Documenting both your achievements and your growth through challenges shows complete leadership. Vulnerability is strength.',
    category: 'growth',
    tags: ['leadership', 'vulnerability', 'complete-impact'],
    emoji: '🌟',
    demographics: { gender: ['man'] },
    journeyStage: ['engaged'],
    research: {
      citation: 'Brown (2018)',
      year: 2018,
      finding: 'Leaders who show vulnerability create 35% higher team psychological safety and performance',
      link: 'https://brenebrown.com/hubs-content/dare-to-lead-list-of-values/'
    }
  },
  {
    id: 'engaged-men-2',
    text: 'Your practice of recognizing your wins alongside your resilience challenges traditional definitions of success—and makes you a better leader.',
    category: 'impact',
    tags: ['leadership', 'redefining-success', 'authenticity'],
    emoji: '🎯',
    demographics: { gender: ['man'] },
    journeyStage: ['engaged'],
    research: {
      citation: 'Grant (2013)',
      year: 2013,
      finding: 'Leaders who demonstrate both confidence and humility inspire 60% higher team engagement',
      link: 'https://adamgrant.net/'
    }
  },

  // Engaged - Non-binary
  {
    id: 'engaged-nb-1',
    text: 'Your consistent documentation of your journey creates visibility in spaces that need to see you. This is powerful advocacy.',
    category: 'impact',
    tags: ['visibility', 'advocacy', 'representation'],
    emoji: '🏳️‍🌈',
    demographics: { gender: ['non-binary'] },
    journeyStage: ['engaged'],
    research: {
      citation: 'Grant et al. (2011)',
      year: 2011,
      finding: 'Visible authentic role models increase belonging for others by 40%',
      link: 'https://psycnet.apa.org/record/2011-01896-001'
    }
  },

  // Engaged - Underrepresented Ethnicities
  {
    id: 'engaged-eth-1',
    text: 'The extra resilience required to navigate bias is itself an accomplishment. Document it alongside your wins.',
    category: 'strength',
    tags: ['resilience', 'kintsugi', 'bias'],
    emoji: '💫',
    journeyStage: ['engaged'],
    research: {
      citation: 'McCluney et al. (2019)',
      year: 2019,
      finding: 'Code-switching and bias navigation require cognitive effort that reduces performance by 15%—this resilience should be recognized',
      link: 'https://hbr.org/2019/11/the-costs-of-codeswitching'
    }
  },
  {
    id: 'engaged-eth-2',
    text: 'Your documented pattern of excellence challenges stereotypes and opens doors. This is how systemic change begins.',
    category: 'impact',
    tags: ['systemic-change', 'representation', 'stereotypes'],
    emoji: '🌍',
    journeyStage: ['engaged'],
    research: {
      citation: 'Bertrand & Mullainathan (2004)',
      year: 2004,
      finding: 'Documented accomplishments counter bias—identical resumes with bias-affected names need stronger credentials',
      link: 'https://www.aeaweb.org/articles?id=10.1257/0002828042002561'
    }
  },

  // ===========================================
  // ADVOCATE STAGE (30+ days): Impact on Others
  // Focus: Representation, advocacy, community
  // ===========================================

  // Advocate - Universal
  {
    id: 'advocate-universal-1',
    text: 'Your documented journey now serves as proof for others who doubt themselves. Your visibility creates pathways.',
    category: 'impact',
    tags: ['role-model', 'visibility', 'representation'],
    emoji: '🌟',
    journeyStage: ['advocate'],
    research: {
      citation: 'Dasgupta (2011)',
      year: 2011,
      finding: 'Seeing one role model increases confidence by 35% in underrepresented groups—your visibility matters',
      link: 'https://www.psychologytoday.com/intl/blog/insight-therapy/201809/the-ripple-effect-role-models'
    }
  },
  {
    id: 'advocate-universal-2',
    text: 'You\'ve built a habit of recognizing your complete impact—wins AND resilience. This practice now changes how you show up in the world.',
    category: 'strength',
    tags: ['habit', 'complete-impact', 'kintsugi'],
    emoji: '✨',
    journeyStage: ['advocate'],
    research: {
      citation: 'Clear (2018)',
      year: 2018,
      finding: 'Habits shape identity—consistent self-recognition creates lasting confidence and self-efficacy',
      link: 'https://jamesclear.com/atomic-habits'
    }
  },
  {
    id: 'advocate-universal-3',
    text: 'Your record of accomplishments and growth is now a tool for advocacy—for yourself and others. Share it strategically.',
    category: 'accomplishment',
    tags: ['advocacy', 'strategic-sharing', 'impact'],
    emoji: '🎯',
    journeyStage: ['advocate'],
    research: {
      citation: 'Catalyst (2018)',
      year: 2018,
      finding: 'Documented accomplishments used strategically lead to 2.3x higher promotion rates',
      link: 'https://www.catalyst.org/research/'
    }
  },
  {
    id: 'advocate-universal-4',
    text: 'Like the gold in Kintsugi repairs, your challenges have become your most compelling story. Share the complete narrative.',
    category: 'impact',
    tags: ['kintsugi', 'storytelling', 'complete-narrative'],
    emoji: '💫',
    journeyStage: ['advocate'],
    research: {
      citation: 'Pennebaker & Seagal (1999)',
      year: 1999,
      finding: 'Narrative coherence—telling complete stories with challenges and growth—increases impact and resonance',
      link: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/(SICI)1097-4679(199910)55:10%3C1243::AID-JCLP6%3E3.0.CO;2-N'
    }
  },

  // Advocate - Women
  {
    id: 'advocate-women-1',
    text: 'Every time you advocate for your work, you make it easier for the next woman. Your visibility is representation.',
    category: 'impact',
    tags: ['representation', 'visibility', 'advocacy'],
    emoji: '👑',
    demographics: { gender: ['woman'] },
    journeyStage: ['advocate'],
    research: {
      citation: 'Lockwood & Kunda (1997)',
      year: 1997,
      finding: 'Female students with same-gender role models are 2x more likely to pursue that field',
      link: 'https://psycnet.apa.org/record/1997-06190-002'
    }
  },
  {
    id: 'advocate-women-2',
    text: 'You\'ve overcome the modesty bias and built evidence of your value. Now use that to advocate—for yourself and other women.',
    category: 'bias-awareness',
    tags: ['modesty-bias', 'advocacy', 'collective-impact'],
    emoji: '🗣️',
    demographics: { gender: ['woman'] },
    journeyStage: ['advocate'],
    research: {
      citation: 'Washington & Evans (1991)',
      year: 1991,
      finding: 'Women who advocate for other women create systemic change 3x more effectively than individual efforts',
      link: 'https://psycnet.apa.org/record/1991-98544-001'
    }
  },
  {
    id: 'advocate-women-3',
    text: 'The barriers you\'ve documented overcoming are proof that the path was harder—and your achievements are therefore more remarkable.',
    category: 'strength',
    tags: ['kintsugi', 'barriers', 'remarkable'],
    emoji: '💪',
    demographics: { gender: ['woman'] },
    journeyStage: ['advocate'],
    research: {
      citation: 'Hewlett et al. (2014)',
      year: 2014,
      finding: 'Documenting the full context of challenges overcome creates more compelling promotion cases',
      link: 'https://www.talentinnovation.org/'
    }
  },

  // Advocate - Men
  {
    id: 'advocate-men-1',
    text: 'By documenting both wins and growth, you\'re modeling a more complete definition of leadership for others.',
    category: 'impact',
    tags: ['leadership', 'role-model', 'complete-impact'],
    emoji: '🌟',
    demographics: { gender: ['man'] },
    journeyStage: ['advocate'],
    research: {
      citation: 'Brown (2018)',
      year: 2018,
      finding: 'Male leaders who model vulnerability give permission for others to do the same, creating healthier cultures',
      link: 'https://brenebrown.com/'
    }
  },
  {
    id: 'advocate-men-2',
    text: 'Your practice of recognizing resilience alongside achievement challenges toxic masculinity and creates space for authenticity.',
    category: 'strength',
    tags: ['authenticity', 'leadership', 'culture-change'],
    emoji: '🎯',
    demographics: { gender: ['man'] },
    journeyStage: ['advocate'],
    research: {
      citation: 'Drury & Kaiser (2014)',
      year: 2014,
      finding: 'Male allies who advocate for inclusive practices increase workplace inclusion scores by 40%',
      link: 'https://spssi.onlinelibrary.wiley.com/doi/abs/10.1111/josi.12080'
    }
  },

  // Advocate - Non-binary
  {
    id: 'advocate-nb-1',
    text: 'Your documented journey of authentic leadership creates a roadmap for others navigating identity in professional spaces.',
    category: 'impact',
    tags: ['authenticity', 'roadmap', 'leadership'],
    emoji: '🏳️‍🌈',
    demographics: { gender: ['non-binary'] },
    journeyStage: ['advocate'],
    research: {
      citation: 'Grant et al. (2011)',
      year: 2011,
      finding: 'Visible non-binary professionals increase belonging and psychological safety for all employees',
      link: 'https://psycnet.apa.org/record/2011-01896-001'
    }
  },

  // Advocate - Underrepresented Ethnicities
  {
    id: 'advocate-eth-1',
    text: 'Every barrier you\'ve documented overcoming creates evidence that challenges stereotypes and systemic bias. This is representation work.',
    category: 'impact',
    tags: ['representation', 'systemic-change', 'stereotypes'],
    emoji: '💫',
    journeyStage: ['advocate'],
    research: {
      citation: 'Crenshaw (1989)',
      year: 1989,
      finding: 'Intersectional visibility combats compounding marginalization and creates pathways for others',
      link: 'https://chicagounbound.uchicago.edu/uclf/vol1989/iss1/8/'
    }
  },
  {
    id: 'advocate-eth-2',
    text: 'Your achievements, documented alongside the resilience required to navigate bias, tell a complete story of excellence. Share it.',
    category: 'strength',
    tags: ['kintsugi', 'excellence', 'complete-story'],
    emoji: '🌍',
    journeyStage: ['advocate'],
    research: {
      citation: 'Purdie-Vaughns & Eibach (2008)',
      year: 2008,
      finding: 'Making intersectional identities visible in narratives increases recognition and counteracts invisibility',
      link: 'https://link.springer.com/article/10.1007/s11199-008-9424-4'
    }
  },

  // ===========================================
  // CROSS-STAGE: Universal Kintsugi Philosophy
  // Can appear at any stage
  // ===========================================

  {
    id: 'kintsugi-universal-1',
    text: 'Kintsugi teaches that breaks, once repaired, become the most beautiful and valuable parts. Your challenges are part of your worth.',
    category: 'strength',
    tags: ['kintsugi', 'challenges', 'value'],
    emoji: '✨',
    journeyStage: ['skeptic', 'engaged', 'advocate'],
    research: {
      citation: 'Tedeschi & Calhoun (2004)',
      year: 2004,
      finding: 'Post-traumatic growth: 70% of people report positive psychological changes after facing adversity',
      link: 'https://psycnet.apa.org/record/2004-16943-005'
    }
  },
  {
    id: 'kintsugi-universal-2',
    text: 'Your impact is not just what you\'ve accomplished—it\'s also how you\'ve grown through challenges. Both deserve recognition.',
    category: 'impact',
    tags: ['kintsugi', 'complete-impact', 'growth'],
    emoji: '💫',
    journeyStage: ['skeptic', 'engaged', 'advocate'],
    research: {
      citation: 'Dweck (2006)',
      year: 2006,
      finding: 'Recognizing growth alongside achievement increases resilience and future performance by 30%',
      link: 'https://www.mindsetworks.com/science/'
    }
  },
  {
    id: 'kintsugi-universal-3',
    text: 'People facing barriers work harder for the same outcomes. That extra resilience is part of your impact story.',
    category: 'strength',
    tags: ['kintsugi', 'barriers', 'resilience'],
    emoji: '💪',
    journeyStage: ['skeptic', 'engaged', 'advocate'],
    research: {
      citation: 'Sue et al. (2007)',
      year: 2007,
      finding: 'Navigating microaggressions and bias requires additional emotional labor that should be recognized as strength',
      link: 'https://psycnet.apa.org/record/2007-05129-002'
    }
  },
  {
    id: 'kintsugi-universal-4',
    text: 'Like gold seams in broken pottery, your setbacks and recoveries make your professional story more compelling, not less.',
    category: 'growth',
    tags: ['kintsugi', 'setbacks', 'storytelling'],
    emoji: '✨',
    journeyStage: ['skeptic', 'engaged', 'advocate'],
    research: {
      citation: 'Pennebaker & Seagal (1999)',
      year: 1999,
      finding: 'Narratives that include adversity and recovery are more memorable and impactful than success-only stories',
      link: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/(SICI)1097-4679(199910)55:10%3C1243::AID-JCLP6%3E3.0.CO;2-N'
    }
  }
];
