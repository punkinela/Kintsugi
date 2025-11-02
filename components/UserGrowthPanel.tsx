'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Clock } from 'lucide-react';
import { USER_STAGES } from '@/types/userCategories';
import { 
  getUserJourney, 
  getUserGrowthMetrics, 
  getConversionStory,
  getStageTimeline 
} from '@/utils/userCategorization';

export default function UserGrowthPanel() {
  const journey = getUserJourney();
  const metrics = getUserGrowthMetrics();
  const conversionStory = getConversionStory();
  const timeline = getStageTimeline();
  
  const currentStageInfo = USER_STAGES[journey.currentStage];

  return (
    <div className="space-y-6">
      {/* Current User Stage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Current User Stage
        </h3>
        
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${currentStageInfo.color} flex items-center justify-center text-3xl`}>
            {currentStageInfo.emoji}
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {currentStageInfo.label}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {currentStageInfo.description}
            </p>
          </div>
        </div>
        
        {journey.previousStage && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Progress:</strong> Moved from {USER_STAGES[journey.previousStage].label} → {currentStageInfo.label}
            </p>
          </div>
        )}
      </motion.div>

      {/* Conversion Story */}
      {conversionStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-lg border-2 border-pink-200 dark:border-pink-800"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Skeptic Conversion Story
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {conversionStory}
          </p>
          
          {journey.daysToConversion !== undefined && (
            <div className="mt-4 flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">
                Converted in {journey.daysToConversion} days
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Conversion Metrics */}
      {metrics.conversionRate.totalSkeptics > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Conversion Metrics
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {metrics.conversionRate.totalSkeptics}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total Skeptics
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {metrics.conversionRate.skepticsConverted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Converted
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {metrics.conversionRate.conversionPercentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Conversion Rate
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Journey Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          User Journey Timeline
        </h3>
        
        <div className="space-y-3">
          {timeline.map((stage, index) => {
            const stageInfo = USER_STAGES[stage.stage];
            const isCurrent = index === timeline.length - 1;
            
            return (
              <div 
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isCurrent 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700' 
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="text-2xl">{stage.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {stageInfo.label}
                    {isCurrent && (
                      <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stage.duration}
                  </div>
                </div>
                {index < timeline.length - 1 && (
                  <div className="text-gray-400">→</div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* User Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          User Type Categories
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(USER_STAGES).map(([key, stage]) => {
            const count = metrics.userDistribution[key as keyof typeof metrics.userDistribution];
            const isActive = count > 0;
            
            return (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? `${stage.color} bg-opacity-10 border-current`
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{stage.emoji}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {stage.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stage.description}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
