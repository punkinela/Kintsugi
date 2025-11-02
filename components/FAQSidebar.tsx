'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface FAQSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
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
            className="px-3 pb-3 text-sm text-gray-600 dark:text-gray-400"
          >
            {answer}
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
              <FAQItem 
                question="What is XP and how do I earn it?"
                answer="XP (Experience Points) are earned by completing actions in the app. Visit daily (+10 XP), log accomplishments (+50 XP), view affirmations (+5 XP), read insights (+15 XP), and complete challenges for bonus XP. As you earn XP, you level up and unlock rewards!"
              />
              <FAQItem 
                question="What are levels and titles?"
                answer="Levels represent your progress and mastery. You start at Level 1 (Newcomer) and can reach Level 50 (The Remarkable One). Each level requires more XP than the last. Your title changes at milestone levels (5, 10, 15, 20, 25, 30, 35, 40, 45, 50)."
              />
              <FAQItem 
                question="What are daily challenges?"
                answer="Daily challenges are special tasks that refresh every day. Complete them for bonus XP! Examples: 'Log 3 accomplishments' (+100 XP), 'View 5 affirmations' (+50 XP). Click the purple target button in the header to see your challenges."
              />
              <FAQItem 
                question="What are achievements?"
                answer="Achievements are special badges you unlock by reaching milestones. There are 23 achievements across 5 tiers (Bronze, Silver, Gold, Platinum, Diamond). Each achievement awards bonus XP and points when unlocked."
              />
              <FAQItem 
                question="What are streaks?"
                answer="Streaks track consecutive days you visit the app. Maintain your streak to earn bonus XP at milestones (3, 7, 30, 100 days). Your longest streak is saved even if your current streak breaks."
              />
              <FAQItem 
                question="What are points used for?"
                answer="Points are earned alongside XP and represent your overall engagement. They're displayed on your profile and can be used for future features like leaderboards or special unlocks."
              />
              <FAQItem 
                question="What rewards can I unlock?"
                answer="There are 23 rewards unlocked at specific levels: new avatar packs, color themes, badges, features (like advanced analytics), and titles. Check your level to see what's coming next!"
              />
              <FAQItem 
                question="How do I see my stats?"
                answer="Click your avatar in the top left corner to open your profile. You'll see all your gamification stats, engagement data, and activity stats. Hover over any number to see what it means!"
              />
              <FAQItem 
                question="What do the tooltips show?"
                answer="Hover over any stat in your profile to see a tooltip explaining what it means, how to earn more, and why it matters. This helps you understand your progress and what to do next."
              />
              <FAQItem 
                question="How do I level up faster?"
                answer="Focus on daily challenges (big XP rewards), log accomplishments regularly (+50 XP each), maintain your streak (bonus XP at milestones), and use all features to unlock achievements. Complete all 3 daily challenges for +225 XP!"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
