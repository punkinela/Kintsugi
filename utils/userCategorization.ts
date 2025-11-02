// User categorization and growth tracking logic

import { UserType, UserJourney, UserGrowthMetrics } from '@/types/userCategories';
import { getEngagementData } from './engagement';

// Determine user type based on engagement data
export function categorizeUser(): UserType {
  const data = getEngagementData();
  const daysSinceLastVisit = data.lastVisit 
    ? Math.floor((Date.now() - new Date(data.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Churned: No visit in 30+ days
  if (daysSinceLastVisit > 30) {
    return 'churned';
  }
  
  // New User: First visit
  if (data.visitCount === 1) {
    return 'new-user';
  }
  
  // Curious: 2-3 visits, still exploring
  if (data.visitCount <= 3) {
    return 'curious';
  }
  
  // Calculate engagement score
  const engagementScore = calculateEngagementScore(data);
  
  // Check if was previously skeptic (without calling getUserJourney to avoid recursion)
  const journeyData = localStorage.getItem('userJourney');
  const wasSkeptic = journeyData ? JSON.parse(journeyData).wasSkeptic : false;
  
  // Champion: High engagement (score > 80)
  if (engagementScore > 80 && data.currentStreak >= 7) {
    return 'champion';
  }
  
  // Converted Skeptic: Was skeptic, now engaged
  if (wasSkeptic && engagementScore > 60) {
    return 'converted-skeptic';
  }
  
  // Engaged: Good engagement (score > 60)
  if (engagementScore > 60) {
    return 'engaged';
  }
  
  // At Risk: Declining engagement
  if (engagementScore > 30 && daysSinceLastVisit > 7) {
    return 'at-risk';
  }
  
  // Skeptic: Low engagement despite multiple visits
  if (data.visitCount > 3 && engagementScore <= 40) {
    return 'skeptic';
  }
  
  // Default to curious
  return 'curious';
}

// Calculate engagement score (0-100)
function calculateEngagementScore(data: any): number {
  let score = 0;
  
  // Visit frequency (max 30 points)
  score += Math.min(30, data.visitCount * 3);
  
  // Streak consistency (max 25 points)
  score += Math.min(25, data.currentStreak * 3.5);
  
  // Feature usage (max 25 points)
  const featureUsage = 
    (data.affirmationsViewed > 0 ? 5 : 0) +
    (data.insightsViewed > 0 ? 5 : 0) +
    (data.journalEntries.length > 0 ? 10 : 0) +
    (data.achievements.length > 0 ? 5 : 0);
  score += featureUsage;
  
  // Accomplishments logged (max 20 points)
  score += Math.min(20, data.journalEntries.length * 2);
  
  return Math.min(100, score);
}

// Get user journey and track stage changes
export function getUserJourney(): UserJourney {
  const currentStage = categorizeUser();
  const journeyData = localStorage.getItem('userJourney');
  
  if (!journeyData) {
    // First time tracking journey
    const newJourney: UserJourney = {
      currentStage,
      stageHistory: [{
        stage: currentStage,
        startDate: new Date().toISOString()
      }],
      wasSkeptic: currentStage === 'skeptic'
    };
    localStorage.setItem('userJourney', JSON.stringify(newJourney));
    return newJourney;
  }
  
  const journey: UserJourney = JSON.parse(journeyData);
  
  // Check if stage changed
  if (journey.currentStage !== currentStage) {
    // Close previous stage
    if (journey.stageHistory.length > 0) {
      journey.stageHistory[journey.stageHistory.length - 1].endDate = new Date().toISOString();
    }
    
    // Track if user was ever a skeptic
    if (currentStage === 'skeptic') {
      journey.wasSkeptic = true;
    }
    
    // Track conversion from skeptic
    if (journey.wasSkeptic && 
        (currentStage === 'engaged' || currentStage === 'converted-skeptic' || currentStage === 'champion') &&
        !journey.convertedDate) {
      journey.convertedDate = new Date().toISOString();
      
      // Calculate days to conversion
      const skepticStage = journey.stageHistory.find(s => s.stage === 'skeptic');
      if (skepticStage) {
        const daysDiff = Math.floor(
          (new Date(journey.convertedDate).getTime() - new Date(skepticStage.startDate).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        journey.daysToConversion = daysDiff;
      }
    }
    
    // Add new stage
    journey.previousStage = journey.currentStage;
    journey.currentStage = currentStage;
    journey.stageHistory.push({
      stage: currentStage,
      startDate: new Date().toISOString()
    });
    
    localStorage.setItem('userJourney', JSON.stringify(journey));
  }
  
  return journey;
}

// Get user growth metrics
export function getUserGrowthMetrics(): UserGrowthMetrics {
  const journey = getUserJourney();
  const data = getEngagementData();
  
  // Count users in each stage (for single-user app, just show current)
  const userDistribution: any = {
    'new-user': 0,
    'curious': 0,
    'skeptic': 0,
    'engaged': 0,
    'converted-skeptic': 0,
    'champion': 0,
    'at-risk': 0,
    'churned': 0
  };
  userDistribution[journey.currentStage] = 1;
  
  // Conversion metrics
  const wasSkeptic = journey.wasSkeptic;
  const isConverted = journey.convertedDate !== undefined;
  
  const conversionRate = {
    skepticsConverted: isConverted ? 1 : 0,
    totalSkeptics: wasSkeptic ? 1 : 0,
    conversionPercentage: wasSkeptic && isConverted ? 100 : 0
  };
  
  // Growth trend
  const daysSinceLastVisit = data.lastVisit 
    ? Math.floor((Date.now() - new Date(data.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const growthTrend = {
    newUsers: journey.currentStage === 'new-user' ? 1 : 0,
    activeUsers: daysSinceLastVisit === 0 ? 1 : 0,
    churnedUsers: journey.currentStage === 'churned' ? 1 : 0,
    retentionRate: journey.currentStage !== 'churned' ? 100 : 0
  };
  
  return {
    userDistribution,
    conversionRate,
    growthTrend,
    averageTimeToConversion: journey.daysToConversion || 0
  };
}

// Get conversion story for display
export function getConversionStory(): string | null {
  const journey = getUserJourney();
  
  if (!journey.wasSkeptic) {
    return null;
  }
  
  if (!journey.convertedDate) {
    return `User showed skepticism but hasn't fully converted yet. Current stage: ${journey.currentStage}`;
  }
  
  const days = journey.daysToConversion || 0;
  return `🎉 Success! User was initially skeptical but converted to ${journey.currentStage} after ${days} days. This shows the app's ability to win over skeptics!`;
}

// Get stage progression timeline
export function getStageTimeline(): { stage: UserType; duration: string; emoji: string }[] {
  const journey = getUserJourney();
  
  return journey.stageHistory.map((stage, index) => {
    const start = new Date(stage.startDate);
    const end = stage.endDate ? new Date(stage.endDate) : new Date();
    const durationDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    let duration = '';
    if (durationDays === 0) {
      duration = 'Today';
    } else if (durationDays === 1) {
      duration = '1 day';
    } else if (!stage.endDate) {
      duration = `${durationDays} days (current)`;
    } else {
      duration = `${durationDays} days`;
    }
    
    const emoji = getStageEmoji(stage.stage);
    
    return {
      stage: stage.stage,
      duration,
      emoji
    };
  });
}

function getStageEmoji(stage: UserType): string {
  const emojis: Record<UserType, string> = {
    'new-user': '🌱',
    'curious': '🔍',
    'skeptic': '🤔',
    'engaged': '✨',
    'converted-skeptic': '🎉',
    'champion': '🏆',
    'at-risk': '⚠️',
    'churned': '💤'
  };
  return emojis[stage];
}
