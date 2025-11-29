'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Copy, CheckCircle2, Lightbulb, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface AIInterviewPrepGeneratorProps {
  achievementText?: string;
  onGenerate?: (response: InterviewResponse) => void;
  compact?: boolean;
}

interface STARComponent {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface InterviewResponse {
  star: STARComponent;
  fullResponse: string;
  coachingTips: string[];
  commonFollowUps: string[];
  variations: {
    behavioral: string;
    technical: string;
    leadership: string;
  };
}

export default function AIInterviewPrepGenerator({ achievementText = '', compact = false }: AIInterviewPrepGeneratorProps) {
  const [inputText, setInputText] = useState(achievementText);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['star']));

  // Track feature usage
  useEffect(() => {
    const usageData = JSON.parse(localStorage.getItem('ai_feature_usage') || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!usageData.interviewPrepGenerator) {
      usageData.interviewPrepGenerator = { views: 0, lastUsed: null, dates: [] };
    }

    usageData.interviewPrepGenerator.views += 1;
    usageData.interviewPrepGenerator.lastUsed = today;

    if (!usageData.interviewPrepGenerator.dates.includes(today)) {
      usageData.interviewPrepGenerator.dates.push(today);
    }

    localStorage.setItem('ai_feature_usage', JSON.stringify(usageData));
  }, []);

  const interviewResponse = useMemo(() => {
    if (!inputText.trim()) return null;
    return generateInterviewResponse(inputText);
  }, [inputText]);

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4 theme-text-primary" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Interview Prep Available
        </span>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 theme-border-light">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 theme-gradient-to-r rounded-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Interview Prep Generator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Convert your achievements into compelling interview responses</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste your achievement or impact log entry:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Example: Led migration of legacy system to cloud infrastructure, reducing costs by 40% and improving performance..."
            className="w-full h-24 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-kintsugi-dark-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 theme-focus-ring resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tip: Include context, your role, actions taken, and measurable results for best results
          </p>
        </div>
      </div>

      {/* Generated Response */}
      {interviewResponse && (
        <div className="p-6 space-y-4">
          {/* STAR Breakdown */}
          <CollapsibleSection
            id="star"
            title="STAR Format Breakdown"
            icon={<Sparkles className="h-5 w-5 theme-text-primary" />}
            expanded={expandedSections.has('star')}
            onToggle={() => toggleSection('star')}
          >
            <div className="space-y-4">
              <STARItem
                label="Situation"
                content={interviewResponse.star.situation}
                color="blue"
                onCopy={() => handleCopy(interviewResponse.star.situation, 'situation')}
                copied={copiedSection === 'situation'}
              />
              <STARItem
                label="Task"
                content={interviewResponse.star.task}
                color="purple"
                onCopy={() => handleCopy(interviewResponse.star.task, 'task')}
                copied={copiedSection === 'task'}
              />
              <STARItem
                label="Action"
                content={interviewResponse.star.action}
                color="theme"
                onCopy={() => handleCopy(interviewResponse.star.action, 'action')}
                copied={copiedSection === 'action'}
              />
              <STARItem
                label="Result"
                content={interviewResponse.star.result}
                color="green"
                onCopy={() => handleCopy(interviewResponse.star.result, 'result')}
                copied={copiedSection === 'result'}
              />
            </div>
          </CollapsibleSection>

          {/* Full Response */}
          <CollapsibleSection
            id="response"
            title="Complete Interview Response"
            icon={<MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            expanded={expandedSections.has('response')}
            onToggle={() => toggleSection('response')}
          >
            <div className="relative">
              <div className="bg-gradient-to-br theme-bg-primary-light rounded-lg p-6 border-2 theme-border-light">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {interviewResponse.fullResponse}
                </p>
              </div>
              <button
                onClick={() => handleCopy(interviewResponse.fullResponse, 'full')}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-kintsugi-dark-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
              >
                {copiedSection === 'full' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </CollapsibleSection>

          {/* Coaching Tips */}
          <CollapsibleSection
            id="coaching"
            title="Coaching Tips"
            icon={<Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
            expanded={expandedSections.has('coaching')}
            onToggle={() => toggleSection('coaching')}
          >
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <ul className="space-y-3">
                {interviewResponse.coachingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center text-xs font-bold text-yellow-800 dark:text-yellow-200">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-yellow-900 dark:text-yellow-200">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>

          {/* Common Follow-up Questions */}
          <CollapsibleSection
            id="followups"
            title="Prepare for These Follow-ups"
            icon={<AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
            expanded={expandedSections.has('followups')}
            onToggle={() => toggleSection('followups')}
          >
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <ul className="space-y-2">
                {interviewResponse.commonFollowUps.map((question, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="theme-text-primary font-bold mt-0.5">Q:</span>
                    <span className="text-sm text-orange-900 dark:text-orange-200">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>

          {/* Response Variations */}
          <CollapsibleSection
            id="variations"
            title="Tailor for Different Interview Types"
            icon={<RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
            expanded={expandedSections.has('variations')}
            onToggle={() => toggleSection('variations')}
          >
            <div className="space-y-3">
              <ResponseVariation
                type="Behavioral Interview"
                description="Focus on collaboration and decision-making"
                content={interviewResponse.variations.behavioral}
                color="blue"
              />
              <ResponseVariation
                type="Technical Interview"
                description="Emphasize technical challenges and solutions"
                content={interviewResponse.variations.technical}
                color="purple"
              />
              <ResponseVariation
                type="Leadership Interview"
                description="Highlight impact and team influence"
                content={interviewResponse.variations.leadership}
                color="green"
              />
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Empty State */}
      {!interviewResponse && (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full theme-bg-primary-light mb-4">
            <MessageSquare className="h-8 w-8 theme-text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Ace Your Interview?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Paste an achievement from your Impact Log or any professional accomplishment above, and I'll help you craft a compelling STAR-format response.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper Components
interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-kintsugi-dark-900 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-kintsugi-dark-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface STARItemProps {
  label: string;
  content: string;
  color: 'blue' | 'purple' | 'theme' | 'green';
  onCopy: () => void;
  copied: boolean;
}

function STARItem({ label, content, color, onCopy, copied }: STARItemProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    theme: 'theme-bg-primary-light theme-border-light',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
  };

  const labelClasses = {
    blue: 'text-blue-700 dark:text-blue-300',
    purple: 'text-purple-700 dark:text-purple-300',
    theme: 'theme-text-primary',
    green: 'text-green-700 dark:text-green-300'
  };

  return (
    <div className={`relative rounded-lg p-4 border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <span className={`text-sm font-bold uppercase tracking-wide ${labelClasses[color]}`}>
          {label}
        </span>
        <button
          onClick={onCopy}
          className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-gray-500" />
          )}
        </button>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
}

interface ResponseVariationProps {
  type: string;
  description: string;
  content: string;
  color: 'blue' | 'purple' | 'green';
}

function ResponseVariation({ type, description, content, color }: ResponseVariationProps) {
  const colorClasses = {
    blue: 'border-blue-300 dark:border-blue-700',
    purple: 'border-purple-300 dark:border-purple-700',
    green: 'border-green-300 dark:border-green-700'
  };

  const badgeClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  };

  return (
    <div className={`border-l-4 ${colorClasses[color]} bg-gray-50 dark:bg-kintsugi-dark-900 rounded-r-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 text-xs font-bold rounded ${badgeClasses[color]}`}>
          {type}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
}

// AI Generation Logic
function generateInterviewResponse(text: string): InterviewResponse {
  // Extract key information from the text
  const hasNumbers = /\d+%|\d+/.test(text);
  const hasActionVerbs = /led|created|implemented|designed|built|improved|increased|reduced|managed|coordinated|developed/i.test(text);

  // Generate STAR components
  const star: STARComponent = {
    situation: extractSituation(text),
    task: extractTask(text),
    action: extractAction(text),
    result: extractResult(text)
  };

  // Create full response
  const fullResponse = `${star.situation}\n\n${star.task}\n\n${star.action}\n\n${star.result}`;

  // Generate coaching tips
  const coachingTips = [
    'Maintain eye contact and speak with confidence - your achievements deserve to be heard',
    'Use the present tense when describing your role to create immediacy: "I lead" vs "I led"',
    hasNumbers
      ? 'Great job including metrics! Be ready to explain how you measured these results'
      : 'Try to add specific numbers or percentages to quantify your impact',
    'Practice this response out loud 3-5 times to ensure smooth delivery',
    'Prepare a brief 30-second version for time-constrained scenarios',
    'Keep your energy up throughout - the Result section is your moment to shine!'
  ];

  // Generate follow-up questions
  const commonFollowUps = [
    'What challenges did you face during this project, and how did you overcome them?',
    'If you could do this project again, what would you do differently?',
    'How did this experience change your approach to similar situations?',
    'What did you learn about yourself or your leadership style?',
    'How have you applied these learnings to subsequent projects?'
  ];

  // Generate variations
  const variations = {
    behavioral: `When asked about collaboration or decision-making: ${star.situation} Working closely with cross-functional stakeholders, ${star.task.toLowerCase()} I facilitated regular communication, built consensus among diverse perspectives, and ${star.action.toLowerCase()} This collaborative approach ${star.result.toLowerCase()}`,

    technical: `When asked about technical problem-solving: ${star.situation} The technical challenge ${star.task.toLowerCase()} I analyzed the root cause, evaluated multiple solutions based on scalability and performance, and ${star.action.toLowerCase()} The solution ${star.result.toLowerCase()}`,

    leadership: `When asked about leadership or influence: ${star.situation} Recognizing the need for change, ${star.task.toLowerCase()} I rallied the team around a shared vision, empowered individuals to take ownership, and ${star.action.toLowerCase()} This initiative ${star.result.toLowerCase()}`
  };

  return {
    star,
    fullResponse,
    coachingTips,
    commonFollowUps,
    variations
  };
}

function extractSituation(text: string): string {
  // Look for context clues
  if (text.includes('legacy') || text.includes('old') || text.includes('existing')) {
    return `In my previous role, we were facing challenges with our existing system that was impacting team productivity and efficiency. The infrastructure was outdated and no longer meeting our growing needs.`;
  }
  return `At my organization, we encountered a situation where ${text.slice(0, 100).toLowerCase()}. This was creating significant challenges for the team and stakeholders.`;
}

function extractTask(text: string): string {
  const taskVerbs = ['led', 'created', 'implemented', 'designed', 'built', 'improved', 'developed', 'managed'];
  const foundVerb = taskVerbs.find(verb => text.toLowerCase().includes(verb));

  if (foundVerb) {
    return `My task was to ${foundVerb === 'led' ? 'lead' : foundVerb.replace(/ed$/, '')} this initiative and deliver measurable results within our timeline and budget constraints.`;
  }
  return `I was responsible for addressing this challenge and developing a solution that would benefit the entire organization.`;
}

function extractAction(text: string): string {
  const actions: string[] = [];

  if (text.toLowerCase().includes('migrat')) {
    actions.push('planned and executed a comprehensive migration strategy');
  }
  if (text.toLowerCase().includes('team') || text.toLowerCase().includes('collaborat')) {
    actions.push('collaborated closely with cross-functional teams');
  }
  if (text.toLowerCase().includes('research') || text.toLowerCase().includes('analyz')) {
    actions.push('conducted thorough research and analysis');
  }

  if (actions.length === 0) {
    actions.push('took a systematic approach to solving the problem');
    actions.push('engaged stakeholders throughout the process');
  }

  return `To accomplish this, I ${actions.join(', ')}. I also ensured clear communication with all stakeholders and proactively addressed potential risks.`;
}

function extractResult(text: string): string {
  // Extract any numbers/percentages
  const numberMatch = text.match(/(\d+)%/);
  const hasMetrics = /reduc|improv|increas|saved|grew/i.test(text);

  if (numberMatch && hasMetrics) {
    const percentage = numberMatch[1];
    if (text.toLowerCase().includes('reduc') || text.toLowerCase().includes('saved')) {
      return `As a result, we achieved a ${percentage}% reduction in costs and significantly improved system performance. This success became a model for other teams in the organization, and I was recognized for driving this impactful change.`;
    }
    return `The outcome exceeded expectations with a ${percentage}% improvement in key metrics. The team was energized by this success, and stakeholders praised the initiative's impact on the business.`;
  }

  return `The results were highly positive - we saw significant improvements across multiple metrics, received strong stakeholder support, and established a foundation for future innovations. This experience reinforced my ability to drive complex initiatives to successful completion.`;
}
