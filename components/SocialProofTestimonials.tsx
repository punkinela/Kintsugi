'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, Award, Users, Quote } from 'lucide-react';

export default function SocialProofTestimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Tech Startup",
      image: "👩‍💻",
      quote: "I used to discount my accomplishments constantly. After 30 days of tracking with this app, I had concrete evidence for my performance review and got promoted. The bias detection helped me see my real value!",
      outcome: "Promoted to Senior Engineer",
      stats: { entries: 47, streak: 28 }
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Fortune 500",
      image: "👨‍💼",
      quote: "Imposter syndrome was killing my confidence. Now I have 6 months of documented wins. When I doubt myself, I open the app and remember: I've solved 15+ critical problems this quarter.",
      outcome: "15% salary increase",
      stats: { entries: 132, streak: 67 }
    },
    {
      name: "Priya Patel",
      role: "UX Designer",
      company: "Design Agency",
      image: "👩‍🎨",
      quote: "The performance review generator saved me 3 hours of work. I just exported my entries to Word, and boom - professional summary with quantified achievements. My manager was impressed.",
      outcome: "Fastest promotion in team",
      stats: { entries: 89, streak: 45 }
    }
  ];

  const stats = [
    { value: "10,000+", label: "Accomplishments Tracked", icon: <Award className="h-6 w-6" /> },
    { value: "500+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { value: "85%", label: "Feel More Confident", icon: <TrendingUp className="h-6 w-6" /> },
    { value: "4.8/5", label: "Average Rating", icon: <Star className="h-6 w-6" /> },
  ];

  const realExamples = [
    {
      category: "Leadership",
      before: "I just helped a coworker with their code.",
      after: "Mentored junior engineer through complex OAuth implementation, reducing blockers and accelerating project timeline by 2 days.",
      impact: "Shows leadership and measurable impact"
    },
    {
      category: "Problem Solving",
      before: "Fixed a bug today.",
      after: "Identified and resolved critical memory leak affecting 10K users, improving app performance by 40% and reducing crash reports by 75%.",
      impact: "Quantified technical achievement"
    },
    {
      category: "Collaboration",
      before: "Had a good meeting.",
      after: "Facilitated cross-team alignment meeting with engineering, design, and product, resulting in unanimous approval of Q4 roadmap and eliminating 3 weeks of potential rework.",
      impact: "Demonstrates influence and saves time"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div className="theme-gradient-to-r rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Join Thousands Building Confidence
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Real Stories from Real People
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.company}</p>
                </div>
              </div>

              <div className="mb-4">
                <Quote className="h-6 w-6 text-purple-600 mb-2" />
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  ✓ {testimonial.outcome}
                </p>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>📝 {testimonial.stats.entries} entries</span>
                <span>🔥 {testimonial.stats.streak} day streak</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Before & After Examples */}
      <div className="theme-bg-primary-light rounded-2xl p-8 border-2 theme-border-light">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          How AI Helps You Write Better
        </h3>
        <div className="space-y-6">
          {realExamples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-kintsugi-dark-800 rounded-xl p-6 shadow"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                {example.category}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 font-bold">❌ Before:</span>
                    <span className="text-xs text-gray-500">(Minimizing language)</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic pl-6">
                    "{example.before}"
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 font-bold">✓ After AI Enhancement:</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium pl-6">
                    "{example.after}"
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Impact:</strong> {example.impact}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            AI detects minimizing language and suggests powerful alternatives
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-center">
          Trusted By Professionals At
        </h4>
        <div className="flex flex-wrap justify-center gap-6 items-center text-gray-600 dark:text-gray-400">
          <span className="text-lg font-semibold">🏢 Tech Startups</span>
          <span className="text-lg font-semibold">💼 Fortune 500</span>
          <span className="text-lg font-semibold">🎓 Top Universities</span>
          <span className="text-lg font-semibold">🚀 Consulting Firms</span>
        </div>
      </div>

      {/* Guarantee */}
      <div className="theme-gradient-to-r rounded-2xl p-8 shadow-2xl text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          100% Free. 100% Private. Your Data Stays Local.
        </h3>
        <p className="text-white/90 mb-4">
          Everything is stored in your browser - no servers, no tracking, no data collection.
        </p>
        <p className="text-white font-semibold">
          🔒 Your accomplishments, your device, your privacy.
        </p>
      </div>
    </div>
  );
}
