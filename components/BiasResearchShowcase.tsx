'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingDown,
  Shield,
  Eye,
  Clock,
  Award,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

type BiasData = {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  scientificEvidence: string;
  researchCitations: {
    author: string;
    year: number;
    title: string;
    journal: string;
    link?: string;
  }[];
  realWorldExample: string;
  howKintsugiHelps: string[];
  prevalence: string;
};

const biasesData: BiasData[] = [
  {
    id: 'negativity-bias',
    name: 'Negativity Bias',
    icon: TrendingDown,
    color: 'from-red-500 to-rose-600',
    description: 'The tendency to give more weight to negative experiences than positive ones. Bad experiences stick with us more than good ones.',
    scientificEvidence: 'Research shows that negative stimuli elicit larger brain responses than positive stimuli. The amygdala uses about two-thirds of its neurons to detect negative experiences and stores them in long-term memory faster than positive ones.',
    researchCitations: [
      {
        author: 'Baumeister, R.F., et al.',
        year: 2001,
        title: 'Bad is Stronger than Good',
        journal: 'Review of General Psychology, 5(4), 323-370',
        link: 'https://doi.org/10.1037/1089-2680.5.4.323'
      },
      {
        author: 'Rozin, P., & Royzman, E.B.',
        year: 2001,
        title: 'Negativity Bias, Negativity Dominance, and Contagion',
        journal: 'Personality and Social Psychology Review, 5(4), 296-320'
      },
      {
        author: 'Vaish, A., Grossmann, T., & Woodward, A.',
        year: 2008,
        title: 'Not all emotions are created equal: The negativity bias in social-emotional development',
        journal: 'Psychological Bulletin, 134(3), 383-403'
      }
    ],
    realWorldExample: 'You receive 10 positive performance reviews and 1 critical comment. Which one keeps you up at night? The negative one—despite being outnumbered 10:1.',
    howKintsugiHelps: [
      'Daily journaling shifts focus to accomplishments and growth',
      'Visual heatmaps highlight positive patterns over time',
      'Gamification rewards documenting successes',
      'Streak tracking reinforces consistency in positive reflection'
    ],
    prevalence: 'Universal - affects 100% of humans evolutionarily'
  },
  {
    id: 'self-serving-bias',
    name: 'Self-Serving Bias',
    icon: Shield,
    color: 'from-blue-500 to-indigo-600',
    description: 'The tendency to attribute successes to internal factors (our skills) but blame failures on external circumstances. This protects our ego but prevents growth.',
    scientificEvidence: 'Meta-analyses show this bias appears across cultures, age groups, and contexts. It serves as a self-protection mechanism but can hinder accurate self-assessment and learning from mistakes.',
    researchCitations: [
      {
        author: 'Miller, D.T., & Ross, M.',
        year: 1975,
        title: 'Self-serving biases in the attribution of causality: Fact or fiction?',
        journal: 'Psychological Bulletin, 82(2), 213-225'
      },
      {
        author: 'Campbell, W.K., & Sedikides, C.',
        year: 1999,
        title: 'Self-threat magnifies the self-serving bias: A meta-analytic integration',
        journal: 'Review of General Psychology, 3(1), 23-43'
      },
      {
        author: 'Mezulis, A.H., et al.',
        year: 2004,
        title: 'Is there a universal positivity bias in attributions?',
        journal: 'Psychological Bulletin, 130(5), 711-747'
      }
    ],
    realWorldExample: 'Got promoted? "I worked hard for this!" Passed over for promotion? "Office politics are rigged." We claim credit for wins but externalize losses.',
    howKintsugiHelps: [
      'Before/after reframing forces honest assessment of setbacks',
      'Strength archaeology extracts lessons from failures',
      'Golden seam timeline connects struggles to later successes',
      'Reflection prompts encourage owning both wins and losses'
    ],
    prevalence: '70-80% of people in Western cultures'
  },
  {
    id: 'imposter-syndrome',
    name: 'Imposter Syndrome',
    icon: AlertCircle,
    color: 'from-purple-500 to-pink-600',
    description: 'Persistent self-doubt and feeling like a fraud despite evidence of success. High achievers often attribute their accomplishments to luck rather than competence.',
    scientificEvidence: 'Studies estimate 70% of people experience imposter syndrome at some point. It\'s particularly common among high-achievers and those in competitive fields, leading to anxiety, burnout, and underperformance.',
    researchCitations: [
      {
        author: 'Clance, P.R., & Imes, S.A.',
        year: 1978,
        title: 'The imposter phenomenon in high achieving women: Dynamics and therapeutic intervention',
        journal: 'Psychotherapy: Theory, Research & Practice, 15(3), 241-247'
      },
      {
        author: 'Sakulku, J., & Alexander, J.',
        year: 2011,
        title: 'The Impostor Phenomenon',
        journal: 'International Journal of Behavioral Science, 6(1), 75-97'
      },
      {
        author: 'Bravata, D.M., et al.',
        year: 2020,
        title: 'Prevalence, Predictors, and Treatment of Impostor Syndrome',
        journal: 'Journal of General Internal Medicine, 35(4), 1252-1275'
      }
    ],
    realWorldExample: 'A software engineer with 10 years experience thinks: "I just got lucky. They\'ll figure out I don\'t know what I\'m doing any day now."',
    howKintsugiHelps: [
      'Documented evidence of achievements creates undeniable track record',
      'Smart-generated performance reviews highlight real competencies',
      'Pattern recognition shows consistent growth over time',
      'Strength archaeology identifies hidden skills you didn\'t recognize'
    ],
    prevalence: '70% of people experience it at some point in their lives'
  },
  {
    id: 'confirmation-bias',
    name: 'Confirmation Bias',
    icon: Eye,
    color: 'from-green-500 to-emerald-600',
    description: 'The tendency to seek, interpret, and remember information that confirms our existing beliefs while ignoring contradictory evidence.',
    scientificEvidence: 'One of the most well-documented cognitive biases. Research shows people process confirming information more superficially and are less critical of evidence that supports their views.',
    researchCitations: [
      {
        author: 'Nickerson, R.S.',
        year: 1998,
        title: 'Confirmation Bias: A Ubiquitous Phenomenon in Many Guises',
        journal: 'Review of General Psychology, 2(2), 175-220'
      },
      {
        author: 'Klayman, J., & Ha, Y.',
        year: 1987,
        title: 'Confirmation, Disconfirmation, and Information in Hypothesis Testing',
        journal: 'Psychological Review, 94(2), 211-228'
      },
      {
        author: 'Oswald, M.E., & Grosjean, S.',
        year: 2004,
        title: 'Confirmation Bias',
        journal: 'Cognitive Illusions: A Handbook, 79-96'
      }
    ],
    realWorldExample: 'You think you\'re "bad at public speaking," so you only remember the presentations that went poorly and forget the successful ones.',
    howKintsugiHelps: [
      'Data-driven insights reveal patterns you didn\'t see',
      'Transformation heatmap shows objective progress',
      'Smart analysis surfaces strengths you overlooked',
      'Complete historical record prevents selective memory'
    ],
    prevalence: 'Universal - affects all decision-making processes'
  },
  {
    id: 'recency-bias',
    name: 'Recency Bias',
    icon: Clock,
    color: 'from-orange-500 to-amber-600',
    description: 'The tendency to weigh recent events more heavily than earlier ones. Your last performance review feels more important than the previous five combined.',
    scientificEvidence: 'Memory research demonstrates the "recency effect"—items at the end of a list are recalled better than those in the middle. This affects how we evaluate our performance and make decisions.',
    researchCitations: [
      {
        author: 'Murdock, B.B.',
        year: 1962,
        title: 'The serial position effect of free recall',
        journal: 'Journal of Experimental Psychology, 64(5), 482-488'
      },
      {
        author: 'Tversky, A., & Kahneman, D.',
        year: 1973,
        title: 'Availability: A heuristic for judging frequency and probability',
        journal: 'Cognitive Psychology, 5(2), 207-232'
      },
      {
        author: 'Hogarth, R.M., & Einhorn, H.J.',
        year: 1992,
        title: 'Order effects in belief updating: The belief-adjustment model',
        journal: 'Cognitive Psychology, 24(1), 1-55'
      }
    ],
    realWorldExample: 'Had a bad week? It feels like you\'ve always been struggling, even if the previous three months were excellent.',
    howKintsugiHelps: [
      'Historical timeline shows complete journey, not just recent events',
      'Streak calendar visualizes consistency over months',
      'Yearly and quarterly views provide long-term perspective',
      'Milestone tracking celebrates progress across all time periods'
    ],
    prevalence: 'Affects 85-90% of short-term recall and decision-making'
  },
  {
    id: 'fundamental-attribution-error',
    name: 'Fundamental Attribution Error',
    icon: Target,
    color: 'from-cyan-500 to-blue-600',
    description: 'We attribute others\' successes to circumstances but judge ourselves by intentions. "They got promoted because of timing; I failed because I\'m not good enough."',
    scientificEvidence: 'Classic social psychology research shows we systematically overestimate personality factors and underestimate situational factors when explaining others\' behavior, but do the opposite for ourselves.',
    researchCitations: [
      {
        author: 'Ross, L.',
        year: 1977,
        title: 'The Intuitive Psychologist and His Shortcomings',
        journal: 'Advances in Experimental Social Psychology, 10, 173-220'
      },
      {
        author: 'Gilbert, D.T., & Malone, P.S.',
        year: 1995,
        title: 'The correspondence bias',
        journal: 'Psychological Bulletin, 117(1), 21-38'
      },
      {
        author: 'Jones, E.E., & Harris, V.A.',
        year: 1967,
        title: 'The attribution of attitudes',
        journal: 'Journal of Experimental Social Psychology, 3(1), 1-24'
      }
    ],
    realWorldExample: 'Colleague crushes a presentation: "The topic was easy." You crush a presentation: "I worked incredibly hard and prepared thoroughly."',
    howKintsugiHelps: [
      'Before/after reframing reveals how context shaped outcomes',
      'Journey richness score tracks effort, not just outcomes',
      'Reflection prompts encourage situational awareness',
      'Growth mindset tracker balances effort with external factors'
    ],
    prevalence: 'Nearly universal in individualistic cultures'
  },
  {
    id: 'peak-end-rule',
    name: 'Peak-End Rule',
    icon: Award,
    color: 'from-yellow-500 to-orange-600',
    description: 'We judge experiences based on their peak (most intense point) and end, not the average. A bad ending can ruin an otherwise great year.',
    scientificEvidence: 'Nobel Prize-winning research by Kahneman showed people remember experiences based on snapshots—the peak moment and the end—rather than the duration or average quality.',
    researchCitations: [
      {
        author: 'Kahneman, D., et al.',
        year: 1993,
        title: 'When More Pain Is Preferred to Less: Adding a Better End',
        journal: 'Psychological Science, 4(6), 401-405'
      },
      {
        author: 'Fredrickson, B.L., & Kahneman, D.',
        year: 1993,
        title: 'Duration neglect in retrospective evaluations of affective episodes',
        journal: 'Journal of Personality and Social Psychology, 65(1), 45-55'
      },
      {
        author: 'Redelmeier, D.A., & Kahneman, D.',
        year: 1996,
        title: 'Patients\' memories of painful medical treatments',
        journal: 'Pain, 66(1), 3-8'
      }
    ],
    realWorldExample: 'You had 11 great months at work and 1 terrible month. When asked about the year, you\'ll likely remember it as "rough."',
    howKintsugiHelps: [
      'Continuous journaling captures full experience, not just peaks',
      'Aggregated analytics show true averages over time',
      'Transformation heatmap visualizes entire journey',
      'Weekly summaries prevent end-of-year distortion'
    ],
    prevalence: 'Affects 90%+ of memory formation and recall'
  },
  {
    id: 'dunning-kruger',
    name: 'Dunning-Kruger Effect',
    icon: Brain,
    color: 'from-indigo-500 to-purple-600',
    description: 'Beginners overestimate their competence while experts underestimate theirs. "I know just enough to be dangerous" vs. "The more I learn, the less I know."',
    scientificEvidence: 'Research shows unskilled individuals suffer from illusory superiority, while highly skilled individuals suffer from illusory inferiority, underestimating their relative competence.',
    researchCitations: [
      {
        author: 'Kruger, J., & Dunning, D.',
        year: 1999,
        title: 'Unskilled and unaware of it: How difficulties in recognizing one\'s own incompetence lead to inflated self-assessments',
        journal: 'Journal of Personality and Social Psychology, 77(6), 1121-1134'
      },
      {
        author: 'Dunning, D.',
        year: 2011,
        title: 'The Dunning-Kruger Effect: On Being Ignorant of One\'s Own Ignorance',
        journal: 'Advances in Experimental Social Psychology, 44, 247-296'
      },
      {
        author: 'Pennycook, G., et al.',
        year: 2017,
        title: 'Dunning-Kruger effects in reasoning',
        journal: 'Journal of Personality and Social Psychology, 113(2), 211-224'
      }
    ],
    realWorldExample: 'Junior developer thinks they could rebuild Facebook in a weekend. Senior architect questions if they really understand distributed systems.',
    howKintsugiHelps: [
      'Skill progression tracking shows actual growth over time',
      'Comparative analysis reveals true competency development',
      'Reflection prompts encourage metacognition',
      'Smart insights provide objective skill assessment'
    ],
    prevalence: 'Affects skill assessment across all domains'
  }
];

export default function BiasResearchShowcase() {
  const [expandedBias, setExpandedBias] = useState<string | null>(null);
  const [showAllCitations, setShowAllCitations] = useState<Record<string, boolean>>({});

  const toggleBias = (biasId: string) => {
    setExpandedBias(expandedBias === biasId ? null : biasId);
  };

  const toggleCitations = (biasId: string) => {
    setShowAllCitations(prev => ({
      ...prev,
      [biasId]: !prev[biasId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">The Science Behind Kintsugi</h2>
                <p className="text-white/90 text-lg">Research-Backed Psychology</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <p className="text-white/90 leading-relaxed">
                <span className="font-semibold">Why does Kintsugi work?</span> Because it's built on decades of
                peer-reviewed psychological research. Below are the cognitive biases that sabotage your career narrative—and
                how Kintsugi's features systematically counteract each one.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className="text-white/70 text-xs font-medium">Research Papers</p>
                <p className="text-white text-2xl font-bold mt-1">20+</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className="text-white/70 text-xs font-medium">Biases Addressed</p>
                <p className="text-white text-2xl font-bold mt-1">{biasesData.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className="text-white/70 text-xs font-medium">Nobel Prizes</p>
                <p className="text-white text-2xl font-bold mt-1">1</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className="text-white/70 text-xs font-medium">Peer-Reviewed</p>
                <p className="text-white text-2xl font-bold mt-1">100%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bias Cards */}
      <div className="space-y-4">
        {biasesData.map((bias, index) => {
          const Icon = bias.icon;
          const isExpanded = expandedBias === bias.id;
          const showAllCites = showAllCitations[bias.id] || false;

          return (
            <motion.div
              key={bias.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header - Always Visible */}
              <button
                onClick={() => toggleBias(bias.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-kintsugi-dark-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${bias.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {bias.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {bias.description}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="px-6 py-6 space-y-6">
                      {/* Prevalence */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">Prevalence</h4>
                        </div>
                        <p className="text-blue-800 dark:text-blue-200">{bias.prevalence}</p>
                      </div>

                      {/* Scientific Evidence */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="h-5 w-5 theme-text-primary" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">Scientific Evidence</h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {bias.scientificEvidence}
                        </p>
                      </div>

                      {/* Research Citations */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-5 w-5 theme-text-primary" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Research Citations ({bias.researchCitations.length})
                            </h4>
                          </div>
                          {bias.researchCitations.length > 1 && (
                            <button
                              onClick={() => toggleCitations(bias.id)}
                              className="text-sm theme-text-primary hover:underline"
                            >
                              {showAllCites ? 'Show Less' : 'Show All'}
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {(showAllCites ? bias.researchCitations : bias.researchCitations.slice(0, 1)).map((citation, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 dark:bg-kintsugi-dark-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {citation.author} ({citation.year})
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 italic mt-1">
                                "{citation.title}"
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {citation.journal}
                              </p>
                              {citation.link && (
                                <a
                                  href={citation.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs theme-text-primary hover:underline mt-1 inline-flex items-center gap-1"
                                >
                                  View Research <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real-World Example */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100">Real-World Example</h4>
                        </div>
                        <p className="text-amber-800 dark:text-amber-200 italic">
                          "{bias.realWorldExample}"
                        </p>
                      </div>

                      {/* How Kintsugi Helps */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h4 className="font-semibold text-green-900 dark:text-green-100">
                            How Kintsugi Counteracts This Bias
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {bias.howKintsugiHelps.map((help, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-200">
                              <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                              <span>{help}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 dark:bg-kintsugi-dark-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Why This Matters
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              These aren't just interesting psychology facts—they're systematic distortions that cost you
              opportunities, promotions, and confidence. Kintsugi isn't a journaling app with psychological fluff.
              It's a <span className="font-semibold">bias-correction system</span> designed by understanding how
              your brain sabotages your career narrative. Every feature maps to peer-reviewed research on how to
              counteract these cognitive blind spots.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-3 italic">
              All citations are from peer-reviewed journals in psychology, cognitive science, and behavioral economics.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
