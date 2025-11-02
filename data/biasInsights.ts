import { BiasInsight } from '@/types';

export const biasInsights: BiasInsight[] = [
  // Original insights with enhanced actions
  {
    id: 'insight-1',
    title: 'The Imposter Syndrome Trap',
    description: 'Many high-achievers feel like frauds despite evidence of their competence. This is especially common among women and underrepresented groups.',
    reflection: 'When have you attributed your success to luck rather than your skills and hard work?',
    actionStep: 'Document your accomplishments with specific evidence of your contribution.',
    actionType: 'journal', // NEW: Specifies what action to take
  },
  {
    id: 'insight-2',
    title: 'The Modesty Bias',
    description: 'Cultural and social conditioning often teaches us that talking about our achievements is boastful or arrogant.',
    reflection: 'How comfortable are you sharing your accomplishments? What messages did you receive about self-promotion growing up?',
    actionStep: 'Practice stating one accomplishment as a fact: "I successfully led..." instead of "I was lucky..."',
    actionType: 'journal',
  },
  {
    id: 'insight-3',
    title: 'The Visibility Gap',
    description: 'Research shows that accomplishments don\'t speak for themselves. Those who advocate for their work advance more than equally qualified peers who don\'t.',
    reflection: 'What opportunities might you have missed by not sharing your accomplishments?',
    actionStep: 'Identify one person who should know about your recent achievement.',
    actionType: 'journal',
  },
  {
    id: 'insight-4',
    title: 'The Attribution Error',
    description: 'We often attribute others\' success to skill but our own to external factors like timing or help from others.',
    reflection: 'Think of a recent success. Did you give yourself credit for your role, or did you minimize your contribution?',
    actionStep: 'Reframe one recent achievement by listing the specific skills and efforts you contributed.',
    actionType: 'journal',
  },
  {
    id: 'insight-5',
    title: 'The Representation Imperative',
    description: 'When you share your accomplishments, you make success visible for others who share your identity or background.',
    reflection: 'Who might benefit from seeing your success? How does your visibility create pathways for others?',
    actionStep: 'Share your story or achievement in a space where it might inspire someone.',
    actionType: 'journal',
  },
  {
    id: 'insight-6',
    title: 'Facts vs. Bragging',
    description: 'Stating facts about your accomplishments is not bragging. Bragging involves exaggeration or putting others down.',
    reflection: 'Can you distinguish between factual self-recognition and boasting? Where did you learn the difference?',
    actionStep: 'Write down three factual statements about your accomplishments.',
    actionType: 'journal',
  },
  
  // NEW: Growth Mindset Insights
  {
    id: 'growth-1',
    title: 'Fixed vs. Growth Mindset',
    description: 'A growth mindset believes abilities can be developed through dedication and hard work. This view creates a love of learning and resilience essential for great accomplishment.',
    reflection: 'When facing a challenge, do you think "I can\'t do this" or "I can\'t do this YET"? How does this affect your willingness to try?',
    actionStep: 'Identify one area where you have a fixed mindset and reframe it with growth language.',
    actionType: 'journal',
  },
  {
    id: 'growth-2',
    title: 'The Power of "Yet"',
    description: 'Adding "yet" to negative self-talk transforms it from a permanent state to a temporary condition. "I\'m not good at this YET" implies you\'re on a learning journey.',
    reflection: 'What skills or abilities do you currently say you "can\'t" do? How would adding "yet" change your perspective?',
    actionStep: 'Document three things you want to improve and add "yet" to each statement.',
    actionType: 'journal',
  },
  {
    id: 'growth-3',
    title: 'Embracing Failure as Learning',
    description: 'People with a growth mindset see failure as an opportunity to learn and grow, not as evidence of inability. Each setback contains valuable lessons.',
    reflection: 'Think of a recent failure or setback. What did you learn from it? How did it help you grow?',
    actionStep: 'Document a "failure" and extract three lessons or skills you gained from the experience.',
    actionType: 'journal',
  },
  {
    id: 'growth-4',
    title: 'Effort as the Path to Mastery',
    description: 'Growth mindset recognizes that effort and practice, not just talent, lead to mastery. Your brain is like a muscle that grows stronger with use.',
    reflection: 'When have you improved at something through persistent effort? How did that feel compared to things that came "naturally"?',
    actionStep: 'Document a skill you\'ve developed through practice and effort, noting your progress over time.',
    actionType: 'journal',
  },
  
  // NEW: Inclusion & Diversity Insights
  {
    id: 'inclusion-1',
    title: 'Unconscious Bias Awareness',
    description: 'We all have unconscious biases—mental shortcuts based on our experiences and culture. Awareness is the first step to disrupting them and creating more inclusive environments.',
    reflection: 'What assumptions do you make about people based on their appearance, name, or background? How might these affect your interactions?',
    actionStep: 'Identify one unconscious bias you hold and commit to one action to disrupt it.',
    actionType: 'journal',
  },
  {
    id: 'inclusion-2',
    title: 'The Affinity Bias',
    description: 'We naturally gravitate toward people similar to us. This can create homogeneous teams and exclude diverse perspectives that drive innovation.',
    reflection: 'Who do you naturally connect with at work or in your community? Who might you be overlooking?',
    actionStep: 'Intentionally seek out and listen to someone with a different background or perspective this week.',
    actionType: 'journal',
  },
  {
    id: 'inclusion-3',
    title: 'Microaggressions and Their Impact',
    description: 'Microaggressions are subtle, often unintentional, discriminatory comments or actions. They accumulate over time and significantly impact well-being and performance.',
    reflection: 'Have you experienced or witnessed microaggressions? How did they make you or others feel? Have you unintentionally committed any?',
    actionStep: 'Document a microaggression you\'ve experienced or witnessed and how you could respond or prevent it.',
    actionType: 'journal',
  },
  {
    id: 'inclusion-4',
    title: 'Allyship in Action',
    description: 'Being an ally means actively supporting and advocating for marginalized groups, even when it\'s uncomfortable. It requires ongoing learning and action, not just good intentions.',
    reflection: 'How do you show up as an ally? What more could you do to support underrepresented colleagues or community members?',
    actionStep: 'Identify one concrete action you can take this week to be a better ally.',
    actionType: 'journal',
  },
  {
    id: 'inclusion-5',
    title: 'Psychological Safety',
    description: 'Psychological safety—the belief that you won\'t be punished for mistakes or speaking up—is essential for inclusion, innovation, and high performance.',
    reflection: 'Do you feel safe sharing ideas, asking questions, or admitting mistakes in your environment? Do others feel safe with you?',
    actionStep: 'Document how you can create more psychological safety for yourself and others.',
    actionType: 'journal',
  },
  {
    id: 'inclusion-6',
    title: 'Intersectionality Matters',
    description: 'People have multiple, intersecting identities (race, gender, class, ability, etc.) that shape their experiences. Understanding intersectionality helps us see the full picture of privilege and marginalization.',
    reflection: 'What are your various identities? How do they intersect to shape your experience? How might others\' intersecting identities affect their experiences?',
    actionStep: 'Reflect on your own intersecting identities and how they\'ve shaped your opportunities and challenges.',
    actionType: 'journal',
  },
  
  // NEW: Language & Communication Bias
  {
    id: 'language-1',
    title: 'Gendered Language Bias',
    description: 'Language often contains hidden gender biases. Women are described as "bossy" while men are "assertive," or women "help" while men "lead." This shapes perceptions and opportunities.',
    reflection: 'What gendered language have you noticed in performance reviews, recommendations, or everyday conversation? How might this affect career advancement?',
    actionStep: 'Document examples of gendered language you\'ve encountered and rewrite them in neutral terms.',
    actionType: 'journal',
  },
  {
    id: 'language-2',
    title: 'Code-Switching and Authenticity',
    description: 'Many people from marginalized groups "code-switch"—changing their language, behavior, or appearance to fit dominant culture norms. This is exhausting and prevents authentic self-expression.',
    reflection: 'Do you code-switch in professional settings? What parts of yourself do you hide or modify? What would it feel like to show up more authentically?',
    actionStep: 'Reflect on when and why you code-switch, and identify one small way to be more authentic.',
    actionType: 'journal',
  },
  {
    id: 'language-3',
    title: 'The Confidence Gap in Language',
    description: 'Research shows women and marginalized groups often use qualifiers ("I think," "maybe," "just") that undermine their authority, while dominant groups state opinions as facts.',
    reflection: 'Do you use hedging language? How might this affect how others perceive your competence and confidence?',
    actionStep: 'Review your recent emails or messages. Note qualifying language and practice stating things directly.',
    actionType: 'journal',
  },
  
  // NEW: Systemic Bias Awareness
  {
    id: 'systemic-1',
    title: 'Privilege and Systemic Advantage',
    description: 'Privilege isn\'t about individual merit—it\'s about systemic advantages based on identity. Recognizing privilege is essential for creating equity and disrupting bias.',
    reflection: 'What privileges do you have (race, gender, class, ability, citizenship, etc.)? How have they shaped your opportunities? What responsibilities come with privilege?',
    actionStep: 'List your privileges and identify one way you can use your privilege to create opportunities for others.',
    actionType: 'journal',
  },
  {
    id: 'systemic-2',
    title: 'Meritocracy Myth',
    description: 'The belief that success is purely based on merit ignores systemic barriers and advantages. True meritocracy requires actively removing obstacles and creating equal access.',
    reflection: 'What systemic advantages or barriers have affected your path? How might others\' paths differ due to systemic factors beyond their control?',
    actionStep: 'Reflect on how systemic factors (not just individual effort) have shaped your success.',
    actionType: 'journal',
  },
  
  // NEW: Intentional Bias Disruption
  {
    id: 'disruption-1',
    title: 'Bias Interruption Strategies',
    description: 'Awareness alone doesn\'t change behavior. We must intentionally disrupt our biases through specific strategies: slowing down decisions, seeking diverse input, and questioning assumptions.',
    reflection: 'When do you make quick judgments about people? What strategies could you use to slow down and question your assumptions?',
    actionStep: 'Choose one bias interruption strategy to practice this week (e.g., pause before judging, seek diverse perspectives).',
    actionType: 'journal',
  },
  {
    id: 'disruption-2',
    title: 'Accountability and Feedback',
    description: 'We need others to help us see our blind spots. Creating accountability systems and welcoming feedback about bias is essential for growth and change.',
    reflection: 'Who can give you honest feedback about your biases? How do you respond when someone points out bias in your words or actions?',
    actionStep: 'Identify an accountability partner and ask them to help you notice and disrupt your biases.',
    actionType: 'journal',
  },
  {
    id: 'disruption-3',
    title: 'From Awareness to Action',
    description: 'Bias work isn\'t just internal—it requires changing systems, policies, and practices. Individual awareness must translate into collective action for meaningful change.',
    reflection: 'What systems or practices in your workplace or community perpetuate bias? What\'s one concrete change you could advocate for?',
    actionStep: 'Document one systemic change you could advocate for and outline your first step.',
    actionType: 'journal',
  },
];

export function getRandomBiasInsight(): BiasInsight {
  return biasInsights[Math.floor(Math.random() * biasInsights.length)];
}

export function getBiasInsightsByCategory(category: string): BiasInsight[] {
  const categoryMap: { [key: string]: string[] } = {
    'growth-mindset': ['growth-1', 'growth-2', 'growth-3', 'growth-4'],
    'inclusion': ['inclusion-1', 'inclusion-2', 'inclusion-3', 'inclusion-4', 'inclusion-5', 'inclusion-6'],
    'language': ['language-1', 'language-2', 'language-3'],
    'systemic': ['systemic-1', 'systemic-2'],
    'disruption': ['disruption-1', 'disruption-2', 'disruption-3'],
    'original': ['insight-1', 'insight-2', 'insight-3', 'insight-4', 'insight-5', 'insight-6'],
  };
  
  const ids = categoryMap[category] || [];
  return biasInsights.filter(insight => ids.includes(insight.id));
}

export function getAllBiasCategories() {
  return [
    { id: 'original', name: 'Self-Recognition', count: 6 },
    { id: 'growth-mindset', name: 'Growth Mindset', count: 4 },
    { id: 'inclusion', name: 'Inclusion & Diversity', count: 6 },
    { id: 'language', name: 'Language & Communication', count: 3 },
    { id: 'systemic', name: 'Systemic Bias', count: 2 },
    { id: 'disruption', name: 'Bias Disruption', count: 3 },
  ];
}
