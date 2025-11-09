'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Lightbulb, Award, BookOpen, Briefcase, Code, Users, X, ChevronRight } from 'lucide-react';
import type { UserProfile } from '@/types';

interface AICareerGapAnalyzerProps {
  user?: UserProfile | null;
  targetRole?: string;
  compact?: boolean;
}

interface GapCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  score: number; // 0-100
  status: 'critical' | 'needs-attention' | 'good' | 'excellent';
  gaps: Gap[];
  strengths: string[];
}

interface Gap {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionItems: string[];
  estimatedTime?: string;
}

export default function AICareerGapAnalyzer({ user, targetRole = 'Senior Professional', compact = false }: AICareerGapAnalyzerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(true);

  // Track feature usage
  useEffect(() => {
    const usageData = JSON.parse(localStorage.getItem('ai_feature_usage') || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!usageData.careerGapAnalyzer) {
      usageData.careerGapAnalyzer = { views: 0, lastUsed: null, dates: [] };
    }

    usageData.careerGapAnalyzer.views += 1;
    usageData.careerGapAnalyzer.lastUsed = today;

    if (!usageData.careerGapAnalyzer.dates.includes(today)) {
      usageData.careerGapAnalyzer.dates.push(today);
    }

    localStorage.setItem('ai_feature_usage', JSON.stringify(usageData));
  }, []);

  const analysis = useMemo(() => {
    if (!user) return null;
    return analyzeCareerProfile(user, targetRole);
  }, [user, targetRole]);

  if (!analysis || !showAnalyzer) return null;

  const overallScore = Math.round(
    analysis.categories.reduce((sum, cat) => sum + cat.score, 0) / analysis.categories.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
    if (score >= 60) return { bg: 'theme-bg-primary-light', text: 'theme-text-primary', border: 'theme-border-light' };
    if (score >= 40) return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
    return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
  };

  const getPriorityBadge = (priority: Gap['priority']) => {
    const styles = {
      critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getScoreColor(overallScore).bg} ${getScoreColor(overallScore).border} border`}>
          <Target className={`h-4 w-4 ${getScoreColor(overallScore).text}`} />
          <span className={`text-sm font-semibold ${getScoreColor(overallScore).text}`}>
            Career Readiness: {overallScore}%
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 theme-gradient-to-r rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skills Growth Roadmap</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Target: {targetRole}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAnalyzer(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Overall Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Career Readiness</span>
              <span className={`text-lg font-bold ${getScoreColor(overallScore).text}`}>{overallScore}%</span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallScore}%` }}
                className={`h-full ${overallScore >= 60 ? 'theme-gradient-to-r' : overallScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-pink-500'}`}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Needs Work</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Skill Categories</h4>

          <div className="grid gap-3">
            {analysis.categories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'theme-border-primary bg-gray-50 dark:bg-kintsugi-dark-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getScoreColor(category.score).bg}`}>
                        {category.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">{category.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {category.gaps.length} gap{category.gaps.length !== 1 ? 's' : ''} identified
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-right`}>
                        <div className={`text-2xl font-bold ${getScoreColor(category.score).text}`}>{category.score}%</div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedCategory === category.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Category Details */}
                <AnimatePresence>
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 ml-4 space-y-4">
                        {/* Strengths */}
                        {category.strengths.length > 0 && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <h5 className="text-sm font-semibold text-green-800 dark:text-green-300">Strengths</h5>
                            </div>
                            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                              {category.strengths.map((strength, idx) => (
                                <li key={idx}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Gaps */}
                        {category.gaps.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Areas for Improvement</h5>
                            </div>
                            {category.gaps.map((gap) => (
                              <div key={gap.id} className="bg-gray-50 dark:bg-kintsugi-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start justify-between mb-2">
                                  <h6 className="font-semibold text-gray-900 dark:text-white">{gap.title}</h6>
                                  {getPriorityBadge(gap.priority)}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{gap.description}</p>

                                {/* Action Items */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Lightbulb className="h-3.5 w-3.5 theme-text-primary" />
                                    <span>Action Steps:</span>
                                  </div>
                                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 ml-5">
                                    {gap.actionItems.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="theme-text-primary mt-0.5">→</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {gap.estimatedTime && (
                                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                                      <span className="font-medium">Estimated time:</span>
                                      <span>{gap.estimatedTime}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Wins */}
        {analysis.quickWins.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 theme-bg-primary-light">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 theme-text-primary" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Quick Wins</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Start here for immediate impact on your profile:
            </p>
            <ul className="space-y-2">
              {analysis.quickWins.map((win, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 theme-text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{win}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function analyzeCareerProfile(user: UserProfile, targetRole: string): {
  categories: GapCategory[];
  quickWins: string[];
} {
  const categories: GapCategory[] = [];
  const quickWins: string[] = [];

  // Skills & Technical Expertise
  const technicalGaps: Gap[] = [];
  const technicalStrengths: string[] = [];

  if (!user.skills || user.skills.length === 0) {
    technicalGaps.push({
      id: 'no-skills',
      title: 'No Skills Listed',
      description: 'Your profile doesn\'t list any technical or professional skills.',
      priority: 'critical',
      actionItems: [
        'Add at least 5-10 core skills relevant to your profession',
        'Include both technical and soft skills',
        'Prioritize in-demand skills for your industry'
      ],
      estimatedTime: '15 minutes'
    });
    quickWins.push('Add your top 5 professional skills to your profile');
  } else if (user.skills.length < 5) {
    technicalGaps.push({
      id: 'few-skills',
      title: 'Limited Skills Portfolio',
      description: `You've listed ${user.skills.length} skill(s). Industry leaders typically showcase 10-15 skills.`,
      priority: 'high',
      actionItems: [
        'Expand your skills list to at least 10 items',
        'Include both technical and soft skills',
        'Add emerging technologies in your field'
      ],
      estimatedTime: '10 minutes'
    });
  } else {
    technicalStrengths.push(`Strong skills portfolio with ${user.skills.length} listed skills`);
  }

  // Check for technical depth
  if (user.profession?.toLowerCase().includes('engineer') ||
      user.profession?.toLowerCase().includes('developer') ||
      user.profession?.toLowerCase().includes('designer')) {
    const hasTechnicalSkills = user.skills?.some(skill =>
      ['javascript', 'python', 'java', 'react', 'design', 'figma', 'photoshop', 'aws', 'sql'].some(tech =>
        skill.toLowerCase().includes(tech)
      )
    );

    if (!hasTechnicalSkills && user.skills && user.skills.length > 0) {
      technicalGaps.push({
        id: 'missing-technical',
        title: 'Missing Technical Skills',
        description: 'For your profession, technical skills are essential but not prominently featured.',
        priority: 'high',
        actionItems: [
          'Add specific tools and technologies you use daily',
          'Include programming languages, frameworks, or design tools',
          'Highlight certifications or training completed'
        ],
        estimatedTime: '20 minutes'
      });
    }
  }

  const technicalScore = calculateScore(user.skills?.length || 0, 10, technicalGaps.length);
  categories.push({
    id: 'technical',
    name: 'Skills & Expertise',
    icon: <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    score: technicalScore,
    status: getStatus(technicalScore),
    gaps: technicalGaps,
    strengths: technicalStrengths
  });

  // Experience & Achievements
  const experienceGaps: Gap[] = [];
  const experienceStrengths: string[] = [];

  // This would ideally check impact log entries or work history
  // For now, we'll provide general guidance
  experienceGaps.push({
    id: 'quantify-impact',
    title: 'Quantify Your Impact',
    description: 'Use numbers and metrics to demonstrate the scale and results of your work.',
    priority: 'high',
    actionItems: [
      'Add percentages to show improvements (e.g., "increased efficiency by 40%")',
      'Include team sizes you\'ve managed or collaborated with',
      'Mention budget sizes, project scales, or user numbers',
      'Use the Impact Log to track quantifiable achievements'
    ],
    estimatedTime: 'Ongoing'
  });

  const experienceScore = 65; // Default moderate score
  categories.push({
    id: 'experience',
    name: 'Experience & Impact',
    icon: <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    score: experienceScore,
    status: getStatus(experienceScore),
    gaps: experienceGaps,
    strengths: experienceStrengths
  });

  // Leadership & Collaboration
  const leadershipGaps: Gap[] = [];
  const leadershipStrengths: string[] = [];

  leadershipGaps.push({
    id: 'leadership-examples',
    title: 'Demonstrate Leadership',
    description: 'Showcase instances where you led projects, mentored others, or drove initiatives.',
    priority: 'medium',
    actionItems: [
      'Document times you led a project or initiative',
      'Highlight mentorship or training experiences',
      'Show examples of influencing decisions or strategy',
      'Include cross-functional collaboration examples'
    ],
    estimatedTime: '30 minutes'
  });

  const leadershipScore = 55;
  categories.push({
    id: 'leadership',
    name: 'Leadership & Collaboration',
    icon: <Users className="h-5 w-5 text-green-600 dark:text-green-400" />,
    score: leadershipScore,
    status: getStatus(leadershipScore),
    gaps: leadershipGaps,
    strengths: leadershipStrengths
  });

  // Education & Certifications
  const educationGaps: Gap[] = [];
  const educationStrengths: string[] = [];

  if (!user.education || user.education.length === 0) {
    educationGaps.push({
      id: 'no-education',
      title: 'Education Not Listed',
      description: 'Adding your educational background builds credibility and shows your foundation.',
      priority: 'medium',
      actionItems: [
        'Add your highest degree or relevant education',
        'Include relevant certifications or training programs',
        'Mention ongoing learning or courses in progress'
      ],
      estimatedTime: '10 minutes'
    });
    quickWins.push('Add your educational background to your profile');
  } else {
    educationStrengths.push('Educational background documented');
  }

  // Check for continuous learning
  educationGaps.push({
    id: 'continuous-learning',
    title: 'Show Continuous Learning',
    description: 'Demonstrate commitment to growth through ongoing education and skill development.',
    priority: 'low',
    actionItems: [
      'Add recent courses, workshops, or training',
      'Include industry certifications you\'re pursuing',
      'Mention conferences attended or webinars completed',
      'Highlight self-directed learning initiatives'
    ],
    estimatedTime: 'Ongoing'
  });

  const educationScore = calculateScore(user.education?.length || 0, 3, educationGaps.length);
  categories.push({
    id: 'education',
    name: 'Education & Learning',
    icon: <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
    score: educationScore,
    status: getStatus(educationScore),
    gaps: educationGaps,
    strengths: educationStrengths
  });

  // Professional Presence
  const presenceGaps: Gap[] = [];
  const presenceStrengths: string[] = [];

  if (!user.bio || user.bio.length < 50) {
    presenceGaps.push({
      id: 'weak-bio',
      title: 'Professional Summary Needs Work',
      description: 'A compelling bio helps others quickly understand your expertise and value.',
      priority: 'high',
      actionItems: [
        'Write a 2-3 sentence professional summary',
        'Highlight your unique value proposition',
        'Include your current role and key achievements',
        'Use confident, active language'
      ],
      estimatedTime: '20 minutes'
    });
    quickWins.push('Craft a compelling 2-3 sentence professional bio');
  } else {
    presenceStrengths.push('Professional bio present');
  }

  const presenceScore = calculateScore((user.bio?.length || 0) / 20, 10, presenceGaps.length);
  categories.push({
    id: 'presence',
    name: 'Professional Presence',
    icon: <Award className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
    score: presenceScore,
    status: getStatus(presenceScore),
    gaps: presenceGaps,
    strengths: presenceStrengths
  });

  return { categories, quickWins };
}

function calculateScore(current: number, target: number, gapsCount: number): number {
  const completionScore = Math.min(100, (current / target) * 100);
  const gapPenalty = gapsCount * 15;
  return Math.max(0, Math.round(completionScore - gapPenalty));
}

function getStatus(score: number): GapCategory['status'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-attention';
  return 'critical';
}
