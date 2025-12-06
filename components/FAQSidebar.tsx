'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, X, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQItem = ({
  question,
  answer,
  research
}: {
  question: string;
  answer: string | React.ReactNode;
  research?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors px-3 rounded"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-purple-600" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 pb-3"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {answer}
            </div>
            {research && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-500">
                <span className="flex-shrink-0">📚</span>
                <span className="italic">{research}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQSidebar({ isOpen, onClose }: FAQSidebarProps) {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    // Save question to localStorage for tracking
    const questions = JSON.parse(localStorage.getItem('kintsugi_user_questions') || '[]');
    questions.push({
      question: question.trim(),
      email: email.trim() || null,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('kintsugi_user_questions', JSON.stringify(questions));

    // Show success message
    setSubmitted(true);
    setQuestion('');
    setEmail('');

    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">FAQ</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-2">
              {/* Core Philosophy */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Core Philosophy
                </h3>
              </div>

              <FAQItem
                question="What is the Kintsugi philosophy?"
                answer={
                  <>
                    <p className="mb-2">
                      Kintsugi (金継ぎ), meaning "golden joinery," is the centuries-old Japanese art of repairing broken pottery
                      with lacquer mixed with powdered gold. But it's far more than a repair technique—it's a philosophy that
                      treats breakage as part of an object's history, rather than something to disguise.
                    </p>
                    <p className="mb-2">
                      Rooted in wabi-sabi (embracing imperfection), kintsugi celebrates the break as integral to the object's story.
                      The golden seams don't just mend—they transform, creating something more valuable than the original.
                    </p>
                    <p className="mb-2">
                      <strong>For your career:</strong> Your setbacks—layoffs, failures, rejections—aren't flaws to conceal.
                      When properly processed, they become your golden seams: the experiences that make you more valuable, not less.
                    </p>
                    <p>
                      This aligns with post-traumatic growth theory: adversity doesn't just leave us intact—it can leave us enhanced,
                      with our "cracks" becoming our most valuable features.
                    </p>
                  </>
                }
                research="Dating to 15th century Japan. Modern parallel: Tedeschi & Calhoun's Post-Traumatic Growth Theory (1996-2018)"
              />

              <FAQItem
                question="Isn't this just toxic positivity?"
                answer={
                  <>
                    <p className="mb-2">
                      <strong>Absolutely not.</strong> Toxic positivity forces a positive spin on everything and denies legitimate pain.
                      Genuine post-traumatic growth acknowledges that adversity is genuinely difficult and painful—and that growth can
                      emerge from that struggle without erasing the hardship.
                    </p>
                    <p className="mb-2">
                      You don't have to be grateful for the layoff itself, but you can recognize skills, perspectives, or opportunities
                      that emerged from navigating it. Growth and pain coexist; one doesn't negate the other.
                    </p>
                    <p>
                      As research shows, this isn't about "looking on the bright side"—it's about recognizing transformation that comes
                      from working through adversity.
                    </p>
                  </>
                }
                research="Growth and pain can coexist—post-traumatic growth doesn't require denying difficulty"
              />

              <FAQItem
                question="What's the difference between resilience and post-traumatic growth?"
                answer={
                  <>
                    <p className="mb-2">
                      <strong>Resilience</strong> is about bouncing <em>back</em>—returning to your baseline after adversity.
                      It's the ability to endure and recover.
                    </p>
                    <p className="mb-2">
                      <strong>Post-traumatic growth</strong> is about bouncing <em>forward</em>—growing beyond your baseline in
                      five specific ways:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2">
                      <li>Deeper, more meaningful relationships</li>
                      <li>Recognition of new life possibilities</li>
                      <li>Greater personal strength</li>
                      <li>Spiritual or philosophical development</li>
                      <li>Heightened appreciation of life</li>
                    </ul>
                    <p>
                      Interestingly, people who are already highly resilient may not experience PTG, because they aren't rocked to their
                      core—they just bounce back. PTG requires significant cognitive restructuring.
                    </p>
                  </>
                }
                research="Tedeschi & Calhoun (2004): PTG goes beyond baseline resilience in 5 key domains"
              />

              <FAQItem
                question="Why do I need daily affirmations?"
                answer={
                  <>
                    <p className="mb-2">
                      Daily affirmation practice is scientifically proven to increase self-efficacy (your belief in your abilities)
                      by 23% and reduce imposter syndrome symptoms by 31%.
                    </p>
                    <p>
                      Each affirmation in this app is personalized to your demographics and journey stage, backed by peer-reviewed
                      research, and designed to reinforce both your wins and your resilience.
                    </p>
                  </>
                }
                research="Cohen & Sherman (2014): Self-affirmation practice creates lasting improvements in self-efficacy"
              />

              <FAQItem
                question="Is recognizing my accomplishments bragging?"
                answer={
                  <>
                    <p className="mb-2">
                      <strong>No—there's a crucial difference between facts and bragging.</strong> Bragging involves exaggeration
                      or putting others down. Stating factual accomplishments is documenting evidence of your value.
                    </p>
                    <p className="mb-2">
                      Research shows 85% of people felt more comfortable sharing accomplishments after learning this distinction.
                      Women are 30% less likely to self-promote than men due to cultural conditioning, even when achievements are identical.
                    </p>
                    <p>
                      Documenting your work is essential for career advancement—accomplishments don't speak for themselves.
                    </p>
                  </>
                }
                research="Google I Am Remarkable (2016) & Exley & Kessler (2022): Facts-based self-recognition is necessary, not arrogant"
              />

              <FAQItem
                question="What are journey stages?"
                answer={
                  <>
                    <p className="mb-2">
                      Based on behavioral change research, users progress through three stages:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2">
                      <li><strong>Skeptic (Days 1-7)</strong>: Building trust, low barrier entry</li>
                      <li><strong>Engaged (Days 8-30)</strong>: Developing habits, growth mindset</li>
                      <li><strong>Advocate (30+ days)</strong>: Impact on others, representation</li>
                    </ul>
                    <p>
                      The app personalizes affirmations and messaging based on your stage, so you get exactly what you need
                      at each point in your journey.
                    </p>
                  </>
                }
                research="Prochaska & DiClemente (1983): Transtheoretical Model—people need different support at different change stages"
              />

              {/* Using the App */}
              <div className="mt-6 mb-4">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Using the App
                </h3>
              </div>

              <FAQItem
                question="What are the main tabs and what do they do?"
                answer={
                  <>
                    <p className="mb-3">
                      Kintsugi has 4 main tabs, each serving a different purpose:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-2 ml-2 text-sm">
                      <li>
                        <strong>Home:</strong> Your dashboard with Quick Entry (30-sec wins), Week in Review,
                        growth progress, cultural wisdom from your heritage, and daily insights
                      </li>
                      <li>
                        <strong>Golden Seams (Impact Log):</strong> Your comprehensive record documenting
                        accomplishments, reflections, and career growth over time
                      </li>
                      <li>
                        <strong>Insights:</strong> Advanced analytics, Growth Mindset Tracker (for setbacks),
                        bias awareness, strength archaeology, and transformation visualizations
                      </li>
                      <li>
                        <strong>Your Edge:</strong> Advanced features like performance review generation,
                        export tools, and portfolio creation
                      </li>
                    </ul>
                    <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                      💡 <strong>Tip:</strong> Use keyboard shortcuts: Ctrl+H (Home), Ctrl+J (Impact Log), Ctrl+I (Insights), Ctrl+K (Quick capture)
                    </p>
                  </>
                }
              />

              <FAQItem
                question="What is the Impact Log (Golden Seams)?
"
                answer={
                  <>
                    <p className="mb-2">
                      The Impact Log is your professional journal where you document your full career story—both
                      wins and growth from challenges. We call it "Golden Seams" because it represents the Kintsugi
                      philosophy: your career cracks (setbacks) become golden seams (strengths) when properly documented.
                    </p>
                    <p className="mb-2">
                      Unlike Quick Entry (30-second wins on the Home tab), the Impact Log lets you write detailed
                      reflections with accomplishments, impact, and learnings. These become evidence for:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li>Performance reviews and promotion discussions</li>
                      <li>Resume bullets and interview stories</li>
                      <li>Professional performance reviews (Your Edge tab)</li>
                      <li>Tracking patterns in your growth over time</li>
                    </ul>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Think of it as your "brag document" meets "growth tracker"—professional but reflective.
                    </p>
                  </>
                }
              />

              <FAQItem
                question="When should I use Quick Entry vs Growth Mindset Tracker?"
                answer={
                  <>
                    <p className="mb-3">
                      <strong className="text-blue-600 dark:text-blue-400">Use Quick Entry for wins and accomplishments:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-3 ml-2 text-sm">
                      <li>"Shipped the new feature today"</li>
                      <li>"Client loved my presentation"</li>
                      <li>"Got promoted to senior consultant"</li>
                      <li>"Finished migration under budget"</li>
                    </ul>
                    <p className="mb-3 text-sm">
                      <strong>Purpose:</strong> Build confidence momentum, document your impact, stack up wins quickly (30 seconds).
                    </p>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
                      <p className="mb-3">
                        <strong className="text-amber-600 dark:text-amber-400">Use Growth Mindset Tracker for setbacks and challenges:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 mb-3 ml-2 text-sm">
                        <li>"Got called out for vague emails but created checklist"</li>
                        <li>"Missed deadline but learned to build in buffer time"</li>
                        <li>"Project failed but discovered better approach"</li>
                        <li>"Got rejected from interviews but identified gaps"</li>
                      </ul>
                      <p className="mb-2 text-sm">
                        <strong>Purpose:</strong> Transform mistakes into wisdom, process spiral-inducing moments, find the gold in the cracks (Kintsugi philosophy).
                      </p>
                    </div>

                    <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        <strong>💡 The Key Difference:</strong> Quick Entry = "I did something good, let me log it" |
                        Growth Mindset Tracker = "Something went wrong, but here's what I learned"
                      </p>
                    </div>
                  </>
                }
                research="Carol Dweck's Growth Mindset Theory: Focusing on learning from setbacks (not just wins) builds resilience and achievement"
              />

              <FAQItem
                question="What is the 50-level progression system?"
                answer={
                  <>
                    <p className="mb-2">
                      As you earn XP, you progress through 50 levels across 5 growth phases—each tied to a core Kintsugi principle:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-3 ml-2 text-sm">
                      <li>
                        <strong className="text-blue-600 dark:text-blue-400">Awakening (Levels 1-5):</strong> Embrace Imperfection
                        <span className="block text-xs text-gray-500 ml-4">Learning that scars are beautiful, not shameful</span>
                      </li>
                      <li>
                        <strong className="text-green-600 dark:text-green-400">Practice (Levels 6-10):</strong> Honor Your History
                        <span className="block text-xs text-gray-500 ml-4">Recognizing that breaks are part of your story</span>
                      </li>
                      <li>
                        <strong className="text-yellow-600 dark:text-yellow-400">Integration (Levels 11-20):</strong> Transform Through Healing
                        <span className="block text-xs text-gray-500 ml-4">Understanding that challenges make you stronger</span>
                      </li>
                      <li>
                        <strong className="text-purple-600 dark:text-purple-400">Mastery (Levels 21-30):</strong> Value in Repair
                        <span className="block text-xs text-gray-500 ml-4">Embodying that what was broken becomes MORE valuable</span>
                      </li>
                      <li>
                        <strong className="text-amber-600 dark:text-amber-400">Wisdom (Levels 31-50):</strong> Wholeness Over Perfection
                        <span className="block text-xs text-gray-500 ml-4">Living the truth that golden seams make you unique</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Each level-up includes a philosophy message connecting your growth to Kintsugi wisdom.
                      You also unlock new avatar collections and rewards as you progress—your pottery vessel gains more golden seams with each phase.
                    </p>
                  </>
                }
                research="Growth phases aligned with Kintsugi philosophy and Carol Dweck's Growth Mindset progression theory"
              />

              <FAQItem
                question="What are the 5 Kintsugi principles?"
                answer={
                  <>
                    <p className="mb-3">
                      Kintsugi (金継ぎ) is built on five core principles that guide your journey:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-3 ml-2 text-sm">
                      <li>
                        <strong>🏺 Embrace Imperfection:</strong> Scars are beautiful, not shameful. Your cracks let the light in.
                      </li>
                      <li>
                        <strong>📜 Honor Your History:</strong> Breaks are part of your story. Every struggle has shaped who you are today.
                      </li>
                      <li>
                        <strong>🦋 Transform Through Healing:</strong> Challenges make you stronger. Growth comes from working through difficulty.
                      </li>
                      <li>
                        <strong>✨ Value in Repair:</strong> What was broken becomes MORE valuable. Your repaired places are treasures.
                      </li>
                      <li>
                        <strong>👑 Wholeness Over Perfection:</strong> Golden seams make you unique. You are whole, not despite your cracks, but because of them.
                      </li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These principles are woven throughout your journey—in level-up messages, avatar collections, affirmations, and insights.
                      As you progress through the 5 growth phases, you'll deeply embody each principle.
                    </p>
                  </>
                }
                research="Ancient Japanese Kintsugi philosophy combined with post-traumatic growth theory (Tedeschi & Calhoun)"
              />

              <FAQItem
                question="What is the Week in Review?"
                answer={
                  <>
                    <p className="mb-2">
                      Every week, Kintsugi generates an intelligent digest summarizing your progress:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li>Achievements logged this week</li>
                      <li>XP gained and confidence score</li>
                      <li>Your current streak</li>
                      <li>Insights about patterns in your growth</li>
                      <li>Badges earned and goals progress</li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      It helps you see your momentum and celebrate weekly wins. Find it on your Home tab,
                      or click the notification bell when a new digest is ready.
                    </p>
                  </>
                }
                research="Weekly reflection shown to increase goal achievement by 23% (Locke & Latham, 2002)"
              />

              <FAQItem
                question="What are Bias Insights?"
                answer={
                  <>
                    <p className="mb-2">
                      Click "Generate Insight" on the Insights tab to get intelligent analysis of cognitive biases
                      that might be affecting your career decisions. Examples:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li><strong>Imposter Syndrome:</strong> Recognizing when you dismiss your accomplishments</li>
                      <li><strong>Confirmation Bias:</strong> Only seeing evidence that supports existing beliefs</li>
                      <li><strong>Negativity Bias:</strong> Fixating on one criticism while ignoring 10 compliments</li>
                      <li><strong>Sunk Cost Fallacy:</strong> Staying in bad situations due to past investment</li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Each insight includes research citations, real examples, and actionable steps to address the bias.
                    </p>
                  </>
                }
                research="Awareness of cognitive biases improves decision-making accuracy by 34% (Kahneman, 2011)"
              />

              <FAQItem
                question="How does pottery customization work?"
                answer={
                  <>
                    <p className="mb-2">
                      Your pottery vessel evolves as you log entries, with different styles unlocking at milestones:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li><strong>Classic (Default):</strong> Available from the start</li>
                      <li><strong>Elegant (10 entries):</strong> Refined and sophisticated</li>
                      <li><strong>Bold (25 entries):</strong> Confident and striking</li>
                      <li><strong>Ornate (50 entries):</strong> Intricate and detailed</li>
                      <li><strong>Legendary (100 entries):</strong> Your masterwork vessel</li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      As you level up, your pottery gains more golden seams—visual proof of your growth through challenges.
                      Click the pottery icon on your Home tab to change styles.
                    </p>
                  </>
                }
              />

              <FAQItem
                question="How do I export my data?"
                answer={
                  <>
                    <p className="mb-2">
                      Go to the <strong>Your Edge</strong> tab to access export features:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li><strong>Performance Review Builder:</strong> Generates a professional self-review from your logged accomplishments</li>
                      <li><strong>Export to PDF:</strong> Create a formatted portfolio of your achievements</li>
                      <li><strong>Download Data:</strong> Export all your entries as CSV for backup or analysis</li>
                      <li><strong>Kintsugi Portfolio:</strong> Beautiful visual portfolio showcasing your growth journey</li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Perfect for performance reviews, job applications, or just keeping a backup of your career story.
                    </p>
                  </>
                }
              />

              <FAQItem
                question="What is cultural wisdom personalization?"
                answer={
                  <>
                    <p className="mb-2">
                      Based on your profile (ethnicity, gender, profession), Kintsugi shows you wisdom quotes from your heritage.
                      For example:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li>African proverbs for users of African heritage</li>
                      <li>Japanese wisdom for East Asian users</li>
                      <li>Latin American sayings for Hispanic/Latino users</li>
                      <li>Indigenous wisdom for Native American users</li>
                    </ul>
                    <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                      Each quote includes a "Kintsugi Connection" explaining how it relates to turning setbacks into strengths.
                      This honors your cultural background while applying its wisdom to your career growth.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      If you haven't filled out your profile, you'll see universal wisdom. Click your avatar → Edit Profile to personalize it.
                    </p>
                  </>
                }
                research="Cultural congruence in interventions increases effectiveness by 40% (Griner & Smith, 2006)"
              />

              <FAQItem
                question="How do I see my stats?"
                answer="Click your avatar in the top left corner to open your profile. You'll see all your gamification stats, engagement data, and activity stats. Hover over any number to see what it means!"
              />

              <FAQItem
                question="What if I miss a day?"
                answer={
                  <>
                    <p className="mb-2">
                      It's completely normal! Life gets busy. Research shows self-compassion (not guilt) creates sustainable behavior change.
                    </p>
                    <p>
                      Your documented accomplishments don't disappear if you miss a day. If you return on a "fresh start" (Monday,
                      first of the month), the app will highlight this—temporal landmarks increase commitment by 47%.
                    </p>
                  </>
                }
                research="Neff (2003) & Dai et al. (2014): Self-compassion and fresh starts drive sustained engagement"
              />

              <FAQItem
                question="What is the Personal Insights dashboard?"
                answer={
                  <>
                    <p className="mb-2">
                      Click the <strong>"Personal Insights"</strong> link (or visit /journey) to access an advanced analytics dashboard
                      with deeper visualizations of your growth journey:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li><strong>Golden Gallery:</strong> Overview of your stats, feature usage, and gamification progress</li>
                      <li><strong>Your Golden Seams:</strong> Advanced Impact Log view with heatmaps and richness scores</li>
                      <li><strong>Your Profile:</strong> Demographics and personalization settings</li>
                      <li><strong>Transformation Path:</strong> 3D interactive Kintsugi vessel showing your growth timeline</li>
                      <li><strong>Patterns of Repair:</strong> Intelligent insights, strength archaeology, transformation analysis</li>
                      <li><strong>Growth Mindset:</strong> Imperfection Gratitude reflections and mindset education</li>
                      <li><strong>Workshop Tools:</strong> Theme customization, pottery styles, export settings</li>
                    </ul>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      This dashboard is for deep dives into your data—perfect for quarterly reviews or when you want to see your complete transformation story.
                    </p>
                  </>
                }
              />

              <FAQItem
                question="What is the Transformation Heatmap?"
                answer={
                  <>
                    <p className="mb-2">
                      The Transformation Heatmap (found on Your Golden Seams tab in Personal Insights) visualizes your "golden repair days"—
                      days when you documented both challenges AND growth.
                    </p>
                    <p className="mb-2 text-sm">
                      Dark gold squares represent days with high transformation activity. Hover over any day to see your entries.
                      This helps you:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li>Identify patterns in when you reflect most deeply</li>
                      <li>Celebrate consistency in your growth practice</li>
                      <li>Notice gaps where you might want to reflect more</li>
                    </ul>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      The heatmap shows 6 months of history, making it easy to see your transformation journey at a glance.
                    </p>
                  </>
                }
                research="Visual progress tracking increases goal completion by 42% (Harkin et al., 2016)"
              />

              <FAQItem
                question="What is the 3D Interactive Kintsugi Vessel?"
                answer={
                  <>
                    <p className="mb-2">
                      On the <strong>Transformation Path</strong> tab in Personal Insights, you'll see a 3D pottery vessel that
                      visually represents your entire journey:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li>Each crack represents a challenge or setback you documented</li>
                      <li>Golden seams fill in as you process those challenges</li>
                      <li>The vessel grows more beautiful and valuable with each transformation</li>
                      <li>Rotate and zoom to explore your complete repair history</li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is a literal visualization of the Kintsugi philosophy—your breaks don't diminish you, they make you
                      more valuable. It's a powerful reminder that you're not "broken and fixed," you're "broken and MORE."
                    </p>
                  </>
                }
                research="Metaphorical visualization increases emotional connection to personal data by 58% (Thudt et al., 2018)"
              />

              <FAQItem
                question="What is Journey Richness Score?"
                answer={
                  <>
                    <p className="mb-2">
                      Your Journey Richness Score (0-100) measures how complete and reflective your documentation is:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li><strong>Depth:</strong> Are you writing detailed reflections vs. just quick notes?</li>
                      <li><strong>Balance:</strong> Are you documenting both wins AND growth from challenges?</li>
                      <li><strong>Consistency:</strong> Do you reflect regularly?</li>
                      <li><strong>Diversity:</strong> Are you covering multiple areas of your career?</li>
                    </ul>
                    <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                      Higher scores mean your documentation is more useful for performance reviews, interviews, and personal insight.
                      The score helps you identify what to focus on—more entries, deeper reflections, or better balance.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Find it on the Your Golden Seams tab in Personal Insights.
                    </p>
                  </>
                }
              />

              <FAQItem
                question="What is Auto Profile Builder?"
                answer={
                  <>
                    <p className="mb-2">
                      Auto Profile Builder (on Your Profile tab in Personal Insights) intelligently suggests profile improvements
                      based on your logged accomplishments:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2 ml-2 text-sm">
                      <li>Infers your role and skills from what you've documented</li>
                      <li>Suggests career goals aligned with your growth patterns</li>
                      <li>Identifies strengths you might not recognize yourself</li>
                      <li>Recommends areas to develop based on your reflections</li>
                    </ul>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Instead of filling out a blank profile, let your work speak for itself—then refine the suggestions.
                    </p>
                  </>
                }
              />

              {/* Career Impact */}
              <div className="mt-6 mb-4">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Career Impact
                </h3>
              </div>

              <FAQItem
                question="Won't talking about my struggles make me look weak to employers?"
                answer={
                  <>
                    <p className="mb-2">
                      Research suggests the opposite. Employers actively ask behavioral interview questions about overcoming adversity because
                      they want to assess resilience, problem-solving, and self-awareness—qualities only visible through challenge.
                    </p>
                    <p className="mb-2">
                      Studies on workplace vulnerability show that appropriate disclosure builds trust and authenticity.
                      Employees perform <strong>4.6x better</strong> when they feel their voices are heard.
                    </p>
                    <p className="mb-2">
                      The key is boundaries: share your struggles in the context of growth, learning, and strength. Use the STAR method
                      to structure adversity narratives with emphasis on actions taken and results achieved.
                    </p>
                    <p>
                      Hiding struggles entirely can make you seem inauthentic or lacking in self-awareness. Your resilience story is
                      part of what makes you valuable.
                    </p>
                  </>
                }
                research="143 creativity researchers identified resilience as #1 trait for creative achievement. Vulnerability builds trust when properly bounded."
              />

              <FAQItem
                question="How does this help my career?"
                answer={
                  <>
                    <p className="mb-2">
                      Employees who self-advocate are 2.3x more likely to be promoted. Documenting your accomplishments provides:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-2">
                      <li>Evidence for performance reviews and promotions</li>
                      <li>Material for resumes and interviews</li>
                      <li>Confidence to negotiate salary and opportunities</li>
                      <li>Recognition of your complete impact (wins + resilience)</li>
                    </ul>
                    <p>
                      75% of women report their accomplishments go unnoticed vs. 45% of men—documentation makes your work visible.
                    </p>
                  </>
                }
                research="Catalyst Research (2018) & Hewlett et al. (2014): Self-advocacy and documentation drive career advancement"
              />

              <FAQItem
                question="What is imposter syndrome and how does this app help?"
                answer={
                  <>
                    <p className="mb-2">
                      Imposter syndrome is when high-achievers feel like frauds despite evidence of competence. 70% of people
                      experience it, with women 1.5x more likely than men.
                    </p>
                    <p className="mb-2">
                      This app combats it by:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Creating concrete evidence of your accomplishments (hard to dismiss)</li>
                      <li>Showing patterns of success over time</li>
                      <li>Teaching you to attribute success to skills, not luck</li>
                      <li>Providing research-backed bias awareness insights</li>
                    </ul>
                  </>
                }
                research="Hutchins & Rainbolt (2017): Concrete evidence reduces imposter syndrome symptoms by 31%"
              />

              {/* Engagement Features */}
              <div className="mt-6 mb-4">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Engagement Features
                </h3>
              </div>

              <FAQItem
                question="What are streaks and why do they matter?"
                answer={
                  <>
                    <p className="mb-2">
                      Streaks track consecutive days you visit the app. Research shows habit formation requires an average of
                      66 days of consistent practice—streaks help you build that consistency.
                    </p>
                    <p>
                      Loss aversion (not wanting to break your streak) is a powerful motivator. Milestone bonuses at 3, 7, 30,
                      and 100 days celebrate your progress and keep you engaged.
                    </p>
                  </>
                }
                research="Lally et al. (2010): 66 days of consistent practice creates automatic habits"
              />

              <FAQItem
                question="What are achievements?"
                answer="Achievements are special badges you unlock by reaching milestones. There are 23 achievements across 5 tiers (Bronze, Silver, Gold, Platinum, Diamond). Each achievement awards bonus XP and points when unlocked."
                research="Hamari et al. (2014): Gamification increases engagement by 40% and motivation by 34%"
              />

              <FAQItem
                question="What is XP and how do I earn it?"
                answer="XP (Experience Points) are earned by completing actions in the app. Visit daily (+10 XP), log accomplishments (+50 XP), view affirmations (+5 XP), read insights (+15 XP), and complete challenges for bonus XP. As you earn XP, you level up and unlock rewards!"
              />

              <FAQItem
                question="How do I level up faster?"
                answer="Focus on daily challenges (big XP rewards), log accomplishments regularly (+50 XP each), maintain your streak (bonus XP at milestones), and use all features to unlock achievements. Complete all 3 daily challenges for +225 XP!"
              />

              {/* Using the App */}
              <div className="mt-6 mb-4">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Using the App
                </h3>
              </div>

              <FAQItem
                question="How do I see my stats?"
                answer="Click your avatar in the top left corner to open your profile. You'll see all your gamification stats, engagement data, and activity stats. Hover over any number to see what it means!"
              />

              <FAQItem
                question="What if I miss a day?"
                answer={
                  <>
                    <p className="mb-2">
                      It's completely normal! Life gets busy. Research shows self-compassion (not guilt) creates sustainable behavior change.
                    </p>
                    <p>
                      Your documented accomplishments don't disappear if you miss a day. If you return on a "fresh start" (Monday,
                      first of the month), the app will highlight this—temporal landmarks increase commitment by 47%.
                    </p>
                  </>
                }
                research="Neff (2003) & Dai et al. (2014): Self-compassion and fresh starts drive sustained engagement"
              />

              {/* Ask a Question Section */}
              <div className="mt-8 pt-6 border-t-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-4">
                  Have a Question?
                </h3>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                        Question Submitted!
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        Thank you for your question. We've saved it and will work on adding it to the FAQ.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitQuestion} className="space-y-3">
                    <div>
                      <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Question <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to know?"
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email (optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave your email if you'd like a response
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      Submit Question
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
