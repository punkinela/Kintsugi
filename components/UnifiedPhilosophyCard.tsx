'use client';

import { motion } from 'framer-motion';
import { Sparkles, Award, TrendingUp, Heart } from 'lucide-react';

export default function UnifiedPhilosophyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-kintsugi-gold-50 via-amber-50 to-yellow-50 dark:from-kintsugi-gold-900/30 dark:via-amber-900/20 dark:to-yellow-900/30 rounded-2xl shadow-lg border-2 border-kintsugi-gold-300 dark:border-kintsugi-gold-700/50 overflow-hidden"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '20px 20px',
          color: '#D4AF37'
        }}></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-kintsugi-gold-500 to-amber-500 rounded-xl shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Own Your Impact + Kintsugi
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              The philosophy behind this app
            </p>
          </div>
        </div>

        {/* Main Message */}
        <div className="bg-white/60 dark:bg-kintsugi-dark-800/60 backdrop-blur-sm rounded-xl p-5 mb-4">
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-3">
            <span className="font-bold text-kintsugi-gold-700 dark:text-kintsugi-gold-400">Your impact</span> isn't just your accomplishments.
            It's also how you've <span className="font-bold">grown through challenges</span>.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Like <span className="font-semibold">Kintsugi pottery</span> (金継ぎ)—the Japanese art of repairing broken ceramics with gold—your
            struggles don't diminish your value. <span className="font-bold">They make you MORE valuable</span>, more
            beautiful, more resilient.
          </p>
        </div>

        {/* Two-Part Framework */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="font-bold text-blue-900 dark:text-blue-200 text-sm">Own Your Wins</p>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Recognize and celebrate your accomplishments. Combat modesty bias and imposter syndrome.
            </p>
          </div>

          <div className="bg-gradient-to-br from-kintsugi-gold-50 to-amber-50 dark:from-kintsugi-gold-900/20 dark:to-amber-900/20 rounded-xl p-4 border-2 border-kintsugi-gold-300 dark:border-kintsugi-gold-700/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-kintsugi-gold-600 dark:text-kintsugi-gold-400" />
              <p className="font-bold text-kintsugi-gold-900 dark:text-kintsugi-gold-200 text-sm">Own Your Resilience</p>
            </div>
            <p className="text-xs text-kintsugi-gold-800 dark:text-kintsugi-gold-300">
              Honor how you've grown through challenges. Your "cracks" filled with gold ARE part of your impact.
            </p>
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-rose-200 dark:border-rose-800/50">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-200 mb-1">
                For those facing bias and barriers:
              </p>
              <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                You often work harder to achieve the same outcomes. Those extra challenges you overcame?
                That resilience you built navigating barriers others don't face? <span className="font-bold">That's additional impact</span>,
                not something to hide. Document it. Own it. It's part of your golden story.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic">
            "Celebrate your wins. Honor your resilience. Own your complete impact."
          </p>
        </div>
      </div>
    </motion.div>
  );
}
