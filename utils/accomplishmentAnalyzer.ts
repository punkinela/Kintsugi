export interface AnalysisResult {
  categories: string[];
  skills: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'exceptional';
  sentiment: 'positive' | 'neutral';
  suggestions: string[];
  strengthAreas: string[];
}

// Keyword patterns for category detection
const categoryPatterns = {
  leadership: [
    'led', 'managed', 'directed', 'coordinated', 'supervised', 'mentored',
    'guided', 'facilitated', 'organized', 'delegated', 'motivated', 'inspired',
    'team', 'project manager', 'lead', 'head of', 'oversaw'
  ],
  technical: [
    'developed', 'built', 'coded', 'programmed', 'designed', 'implemented',
    'engineered', 'architected', 'debugged', 'optimized', 'automated',
    'algorithm', 'system', 'database', 'api', 'software', 'application',
    'python', 'javascript', 'react', 'node', 'aws', 'cloud'
  ],
  communication: [
    'presented', 'wrote', 'communicated', 'explained', 'articulated',
    'negotiated', 'persuaded', 'advocated', 'pitched', 'spoke',
    'presentation', 'report', 'documentation', 'stakeholder', 'client',
    'meeting', 'conference', 'public speaking'
  ],
  creative: [
    'created', 'designed', 'innovated', 'conceptualized', 'invented',
    'crafted', 'illustrated', 'composed', 'produced', 'generated',
    'creative', 'design', 'brand', 'visual', 'content', 'marketing',
    'campaign', 'strategy', 'innovative solution'
  ],
  analytical: [
    'analyzed', 'researched', 'investigated', 'evaluated', 'assessed',
    'measured', 'calculated', 'forecasted', 'modeled', 'interpreted',
    'data', 'metrics', 'statistics', 'insights', 'findings', 'report',
    'analysis', 'research', 'study', 'trends'
  ],
  collaboration: [
    'collaborated', 'partnered', 'worked with', 'coordinated with',
    'cross-functional', 'team', 'group', 'together', 'jointly',
    'cooperation', 'partnership', 'alliance', 'collective'
  ],
  problemSolving: [
    'solved', 'resolved', 'fixed', 'troubleshot', 'addressed',
    'overcame', 'tackled', 'handled', 'mitigated', 'prevented',
    'problem', 'issue', 'challenge', 'obstacle', 'crisis', 'conflict'
  ],
  achievement: [
    'achieved', 'accomplished', 'completed', 'delivered', 'exceeded',
    'surpassed', 'won', 'earned', 'attained', 'reached',
    'goal', 'target', 'milestone', 'success', 'award', 'recognition'
  ],
  growth: [
    'learned', 'improved', 'enhanced', 'developed', 'grew', 'expanded',
    'mastered', 'acquired', 'trained', 'certified', 'upskilled',
    'course', 'certification', 'training', 'skill', 'knowledge'
  ],
  impact: [
    'increased', 'decreased', 'reduced', 'improved', 'boosted',
    'enhanced', 'saved', 'generated', 'revenue', 'profit', 'efficiency',
    'productivity', 'performance', 'quality', 'satisfaction', 'retention'
  ]
};

// Skill extraction patterns
const skillPatterns = {
  technical: [
    'python', 'javascript', 'typescript', 'react', 'node.js', 'java', 'c++',
    'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'agile', 'scrum', 'ci/cd', 'api', 'rest', 'graphql', 'machine learning',
    'ai', 'data science', 'cloud computing', 'devops', 'frontend', 'backend'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'adaptability', 'creativity', 'emotional intelligence',
    'conflict resolution', 'negotiation', 'public speaking', 'mentoring',
    'strategic thinking', 'decision making', 'collaboration', 'empathy'
  ],
  business: [
    'project management', 'budget management', 'stakeholder management',
    'strategic planning', 'business development', 'sales', 'marketing',
    'customer service', 'operations', 'finance', 'analytics', 'reporting',
    'process improvement', 'change management', 'risk management'
  ],
  domain: [
    'healthcare', 'education', 'finance', 'retail', 'manufacturing',
    'technology', 'consulting', 'research', 'design', 'engineering',
    'legal', 'human resources', 'operations', 'supply chain'
  ]
};

// Impact indicators
const impactIndicators = {
  exceptional: [
    'transformed', 'revolutionized', 'pioneered', 'founded', 'launched',
    'company-wide', 'organization-wide', 'industry', 'award', 'recognition',
    '100%', '200%', 'million', 'thousands', 'major', 'significant breakthrough'
  ],
  high: [
    'significantly', 'substantially', 'dramatically', 'major', 'critical',
    'key', 'strategic', 'department-wide', 'team-wide', '50%', '75%',
    'hundreds', 'dozens', 'promoted', 'featured', 'published'
  ],
  medium: [
    'improved', 'enhanced', 'increased', 'reduced', 'successful',
    'effective', 'multiple', 'several', '25%', '30%', 'team', 'project'
  ],
  low: [
    'contributed', 'assisted', 'helped', 'supported', 'participated',
    'involved', 'attended', 'completed', 'finished'
  ]
};

export function analyzeAccomplishment(text: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Detect categories
  const categories: string[] = [];
  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    const matches = keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    if (matches.length > 0) {
      categories.push(category);
    }
  }
  
  // If no categories detected, default to 'achievement'
  if (categories.length === 0) {
    categories.push('achievement');
  }
  
  // Extract skills
  const skills: string[] = [];
  for (const [, skillList] of Object.entries(skillPatterns)) {
    for (const skill of skillList) {
      if (lowerText.includes(skill.toLowerCase())) {
        // Capitalize skill name properly
        skills.push(skill.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
      }
    }
  }
  
  // Remove duplicates
  const uniqueSkills = [...new Set(skills)];
  
  // Determine impact level
  let impactLevel: 'low' | 'medium' | 'high' | 'exceptional' = 'medium';
  
  for (const [level, indicators] of Object.entries(impactIndicators)) {
    const matches = indicators.filter(indicator => 
      lowerText.includes(indicator.toLowerCase())
    );
    if (matches.length > 0) {
      impactLevel = level as any;
      break; // Use the first (highest) match
    }
  }
  
  // Detect numbers for quantifiable impact
  const hasNumbers = /\d+%|\d+\+|\$\d+|#\d+/.test(text);
  if (hasNumbers && impactLevel === 'medium') {
    impactLevel = 'high';
  }
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (!hasNumbers) {
    suggestions.push('Consider adding quantifiable metrics (e.g., "increased by 30%", "saved $10K")');
  }
  
  if (uniqueSkills.length === 0) {
    suggestions.push('Mention specific skills or tools you used');
  }
  
  if (lowerText.length < 50) {
    suggestions.push('Add more detail about your role and the outcome');
  }
  
  if (!lowerText.includes('i ') && !lowerText.includes('my ')) {
    suggestions.push('Use "I" statements to own your accomplishment (e.g., "I led...", "I developed...")');
  }
  
  const hasImpactWords = impactIndicators.high.some(word => lowerText.includes(word)) ||
                         impactIndicators.exceptional.some(word => lowerText.includes(word));
  if (!hasImpactWords) {
    suggestions.push('Highlight the impact or outcome (e.g., "resulting in...", "which led to...")');
  }
  
  // Identify strength areas
  const strengthAreas: string[] = [];
  
  if (categories.includes('leadership')) {
    strengthAreas.push('Leadership & Management');
  }
  if (categories.includes('technical')) {
    strengthAreas.push('Technical Expertise');
  }
  if (categories.includes('communication')) {
    strengthAreas.push('Communication & Presentation');
  }
  if (categories.includes('problemSolving')) {
    strengthAreas.push('Problem Solving');
  }
  if (categories.includes('impact')) {
    strengthAreas.push('Results-Driven');
  }
  if (categories.includes('collaboration')) {
    strengthAreas.push('Teamwork & Collaboration');
  }
  
  return {
    categories: categories.slice(0, 3), // Top 3 categories
    skills: uniqueSkills.slice(0, 8), // Top 8 skills
    impactLevel,
    sentiment: 'positive', // Accomplishments are inherently positive
    suggestions: suggestions.slice(0, 3), // Top 3 suggestions
    strengthAreas: strengthAreas.slice(0, 4) // Top 4 strength areas
  };
}

// Generate a summary of accomplishments
export function generateSummary(accomplishments: string[]): {
  totalCount: number;
  topCategories: { category: string; count: number }[];
  topSkills: { skill: string; count: number }[];
  impactDistribution: { level: string; count: number }[];
  strengthProfile: string[];
} {
  const categoryCount: { [key: string]: number } = {};
  const skillCount: { [key: string]: number } = {};
  const impactCount: { [key: string]: number } = {};
  const strengthSet = new Set<string>();
  
  accomplishments.forEach(text => {
    const analysis = analyzeAccomplishment(text);
    
    analysis.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    analysis.skills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
    
    impactCount[analysis.impactLevel] = (impactCount[analysis.impactLevel] || 0) + 1;
    
    analysis.strengthAreas.forEach(strength => strengthSet.add(strength));
  });
  
  // Sort and get top items
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
  
  const topSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));
  
  const impactDistribution = Object.entries(impactCount)
    .map(([level, count]) => ({ level, count }));
  
  return {
    totalCount: accomplishments.length,
    topCategories,
    topSkills,
    impactDistribution,
    strengthProfile: [...strengthSet]
  };
}

// Generate personalized insights
export function generateInsights(accomplishments: string[]): string[] {
  const summary = generateSummary(accomplishments);
  const insights: string[] = [];
  
  if (summary.totalCount >= 10) {
    insights.push(`🎉 You've documented ${summary.totalCount} accomplishments! You're building a strong track record.`);
  }
  
  if (summary.topCategories.length > 0) {
    const topCat = summary.topCategories[0];
    insights.push(`💪 Your strength in ${topCat.category} is evident with ${topCat.count} related accomplishments.`);
  }
  
  if (summary.topSkills.length >= 5) {
    insights.push(`🎯 You've demonstrated ${summary.topSkills.length} distinct skills across your accomplishments.`);
  }
  
  const highImpact = summary.impactDistribution.find(d => d.level === 'high' || d.level === 'exceptional');
  if (highImpact && highImpact.count >= 3) {
    insights.push(`⭐ ${highImpact.count} of your accomplishments show high impact - that's remarkable!`);
  }
  
  if (summary.strengthProfile.length >= 3) {
    insights.push(`🌟 Your diverse skill set spans ${summary.strengthProfile.join(', ')}.`);
  }
  
  return insights;
}
