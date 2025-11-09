'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, TrendingUp, BookOpen, Award } from 'lucide-react';

interface AboutPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutPhilosophyModal({ isOpen, onClose }: AboutPhilosophyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 md:p-8">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      金継ぎ Kintsugi
                    </h2>
                    <p className="text-white/90 text-lg">
                      The Art of Precious Scars
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Origin Story */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                  The Origin Story
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Kintsugi (金継ぎ), meaning "golden joinery," emerged in late 15th century Japan when shogun
                    Ashikaga Yoshimasa sent a damaged Chinese tea bowl for repair. When it returned with unsightly
                    metal staples, Japanese craftsmen developed a more beautiful method: repairing breaks with lacquer
                    mixed with powdered gold, silver, or platinum.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    But kintsugi became far more than a repair technique. It evolved into a philosophy that treats
                    breakage and repair as part of an object's history—something to celebrate, not conceal. The golden
                    seams don't just mend; they <strong className="text-amber-600">transform</strong>, creating something
                    more valuable than the original.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This stands in stark contrast to Western approaches that seek to hide damage and restore objects to
                    their "original" state. Kintsugi honors the break, making it the most beautiful part of the piece.
                  </p>
                </div>
              </section>

              {/* Core Principles */}
              <section className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-600" />
                  Core Principles
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Wabi-sabi (侘寂)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Find beauty in imperfection, impermanence, and incompleteness
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Mono no aware (物の哀れ)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Awareness of transience that heightens appreciation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Mottainai (勿体無い)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Regret over waste; everything deserves respect
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Honor your history</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Breakage is part of your story, not something to erase
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Transform through repair</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Healing can create something more beautiful than the original
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Display the seams</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          What broke you can become what makes you extraordinary
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* The Science */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  The Science: Post-Traumatic Growth
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Kintsugi isn't just beautiful philosophy—it's backed by modern psychology. Researchers
                    Richard Tedeschi and Lawrence Calhoun discovered that individuals who face significant adversity
                    don't merely bounce back to baseline—they can grow <strong className="text-amber-600">beyond it</strong>.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
                    <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      The Five Domains of Post-Traumatic Growth:
                    </p>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                      <li>✓ Deeper, more meaningful relationships</li>
                      <li>✓ Recognition of new life possibilities</li>
                      <li>✓ Greater personal strength</li>
                      <li>✓ Spiritual or philosophical development</li>
                      <li>✓ Heightened appreciation of life</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Unlike resilience (bouncing back), post-traumatic growth means bouncing <em>forward</em>.
                    Your struggles don't just leave you intact—they can leave you enhanced, with your "cracks"
                    becoming your most valuable features.
                  </p>
                </div>
              </section>

              {/* Career Application */}
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-600" />
                  For Your Career
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Traditional career advice tells you to hide your struggles—minimize gaps, conceal setbacks,
                    present a polished facade. <strong className="text-purple-600">This is exhausting and counterproductive.</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-purple-600">The Kintsugi approach:</strong> Your career setbacks—layoffs,
                    failed ventures, rejections, pivots—aren't flaws to conceal. When properly processed and articulated,
                    they become your golden seams: the experiences that make you more valuable, not less.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">Research shows:</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Employers actively seek resilience stories in behavioral interviews</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>143 creativity researchers identified resilience as the #1 trait for creative achievement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Employees perform 4.6x better when they feel heard and can be authentic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Hiding struggles can make you seem inauthentic or lacking self-awareness</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* What This Isn't */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What Kintsugi Is NOT
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 font-bold flex-shrink-0">✗</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Not toxic positivity</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Growth and pain coexist. You don't have to be grateful for adversity to recognize transformation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 font-bold flex-shrink-0">✗</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Not about hiding damage</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The whole point is to display the repair, not conceal it. Own your full story.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 font-bold flex-shrink-0">✗</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Not a quick fix</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Traditional kintsugi repair can take months. Career transformation also requires patient, deliberate processing.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Citations */}
              <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Research & Sources
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>• Tedeschi, R. G., & Calhoun, L. G. (1996-2018). Post-traumatic growth research and theory.</p>
                  <p>• Japanese philosophy: Wabi-sabi, mono no aware, mottainai (15th century–present)</p>
                  <p>• Taleb, N. N. (2012). Antifragility: Things That Gain from Disorder</p>
                  <p>• Dweck, C. S. (2006). Growth Mindset research</p>
                  <p>• Workplace vulnerability and authenticity studies (Brown, et al.)</p>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
