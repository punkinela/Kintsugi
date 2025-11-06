'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, X } from 'lucide-react';
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
                      Kintsugi (金継ぎ) is the Japanese art of repairing broken pottery with gold. Instead of hiding cracks,
                      they become beautiful golden seams that make the piece MORE valuable.
                    </p>
                    <p className="mb-2">
                      In this app, <strong>your impact = your wins + your resilience</strong>. We help you document both your
                      accomplishments AND the challenges you've overcome, because navigating barriers makes your story more
                      remarkable, not less.
                    </p>
                    <p>
                      This is especially powerful for those facing bias—the extra resilience you've demonstrated is part of your impact.
                    </p>
                  </>
                }
                research="Tedeschi & Calhoun (2004): 70% of people report positive psychological growth after facing adversity"
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

              {/* Career Impact */}
              <div className="mt-6 mb-4">
                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                  Career Impact
                </h3>
              </div>

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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
