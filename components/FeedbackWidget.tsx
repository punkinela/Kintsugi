'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Star } from 'lucide-react';
import { saveFeedback, getExperienceLabel } from '@/utils/analytics';
import { getEngagementData } from '@/utils/engagement';

interface FeedbackWidgetProps {
  onClose: () => void;
}

export default function FeedbackWidget({ onClose }: FeedbackWidgetProps) {
  const [step, setStep] = useState<'rating' | 'comment' | 'thanks'>('rating');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleRatingSelect = (selectedRating: 1 | 2 | 3 | 4 | 5) => {
    setRating(selectedRating);
    setStep('comment');
  };

  const handleSubmit = () => {
    if (!rating) return;

    const engagementData = getEngagementData();
    const profile = localStorage.getItem('userProfile');
    const userProfile = profile ? JSON.parse(profile) : {};

    saveFeedback({
      rating,
      experience: getExperienceLabel(rating),
      comment: comment.trim() || undefined,
      userProfile: {
        name: userProfile.name,
        gender: userProfile.gender,
        profession: userProfile.profession
      },
      sessionData: {
        visitCount: engagementData.visitCount,
        currentStreak: engagementData.currentStreak,
        accomplishmentsLogged: engagementData.journalEntries.length,
        daysActive: engagementData.visitCount
      }
    });

    setStep('thanks');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 w-96 bg-kintsugi-surface dark:bg-kintsugi-dark-800 rounded-2xl shadow-2xl border-2 theme-border-light/80 dark:theme-border-primary/50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-kintsugi-gold-50" />
            <h3 className="font-bold text-kintsugi-gold-50">How is your experience?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:theme-bg-primary-light/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-kintsugi-gold-50" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'rating' && (
            <div>
              <p className="text-kintsugi-dark-700 dark:text-kintsugi-gold-100 mb-4 text-center">
                We'd love to hear about your experience with Own Your Impact!
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingSelect(star as 1 | 2 | 3 | 4 | 5)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        (hoveredStar !== null ? star <= hoveredStar : star <= (rating || 0))
                          ? 'fill-kintsugi-gold-500 theme-text-primary'
                          : 'theme-text-secondary dark:text-kintsugi-gold-800/50'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              {hoveredStar && (
                <p className="text-center text-sm font-medium text-kintsugi-gold-700 dark:theme-text-secondary">
                  {ratingLabels[hoveredStar as keyof typeof ratingLabels]}
                </p>
              )}
            </div>
          )}

          {step === 'comment' && (
            <div>
              <p className="text-kintsugi-dark-800 dark:text-kintsugi-gold-100 mb-4">
                Thanks for the {rating}-star rating! 🌟
              </p>
              <p className="text-sm text-kintsugi-dark-700/80 dark:theme-text-secondary/80 mb-3">
                Want to share more about your experience? (Optional)
              </p>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What do you love? What could be better?"
                className="w-full px-4 py-3 rounded-xl border theme-border-light dark:theme-border-primary/50 bg-kintsugi-surface dark:bg-kintsugi-dark-700 text-kintsugi-dark-900 dark:text-kintsugi-gold-100 focus:ring-2 focus:ring-kintsugi-gold-500 focus:border-transparent resize-none transition-colors"
                rows={4}
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep('rating')}
                  className="flex-1 px-4 py-2 rounded-xl border theme-border-light dark:theme-border-primary/50 hover:theme-bg-primary-light/50 dark:hover:bg-kintsugi-gold-900/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-kintsugi-gold-600 to-kintsugi-gold-800 text-kintsugi-gold-50 font-semibold hover:from-kintsugi-gold-700 hover:to-kintsugi-gold-900 transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {step === 'thanks' && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-xl font-bold text-kintsugi-dark-900 dark:text-kintsugi-gold-100 mb-2">
                Thank you!
              </h4>
              <p className="text-kintsugi-dark-700/80 dark:theme-text-secondary/80">
                Your feedback helps us make Own Your Impact even better!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
