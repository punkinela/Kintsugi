// User categorization and growth tracking

export type UserType = 
  | 'new-user'           // First visit
  | 'curious'            // 2-3 visits, exploring
  | 'skeptic'            // Low engagement, irregular visits
  | 'engaged'            // Regular visits, using features
  | 'converted-skeptic'  // Was skeptic, now engaged
  | 'champion'           // High engagement, consistent
  | 'at-risk'            // Was engaged, now declining
  | 'churned';           // Hasn't visited in 30+ days

export interface UserGrowthStage {
  type: UserType;
  label: string;
  description: string;
  emoji: string;
  color: string;
}

export interface UserJourney {
  currentStage: UserType;
  previousStage?: UserType;
  stageHistory: {
    stage: UserType;
    startDate: string;
    endDate?: string;
  }[];
  wasSkeptic: boolean;
  convertedDate?: string;
  daysToConversion?: number;
}

export interface UserGrowthMetrics {
  userDistribution: {
    [key in UserType]: number;
  };
  conversionRate: {
    skepticsConverted: number;
    totalSkeptics: number;
    conversionPercentage: number;
  };
  growthTrend: {
    newUsers: number;
    activeUsers: number;
    churnedUsers: number;
    retentionRate: number;
  };
  averageTimeToConversion: number;
}

export const USER_STAGES: Record<UserType, UserGrowthStage> = {
  'new-user': {
    type: 'new-user',
    label: 'New User',
    description: 'Just started, first visit',
    emoji: '🌱',
    color: 'bg-green-500'
  },
  'curious': {
    type: 'curious',
    label: 'Curious Explorer',
    description: '2-3 visits, checking it out',
    emoji: '🔍',
    color: 'bg-blue-500'
  },
  'skeptic': {
    type: 'skeptic',
    label: 'Skeptic',
    description: 'Low engagement, irregular visits',
    emoji: '🤔',
    color: 'bg-yellow-500'
  },
  'engaged': {
    type: 'engaged',
    label: 'Engaged User',
    description: 'Regular visits, using features',
    emoji: '✨',
    color: 'bg-purple-500'
  },
  'converted-skeptic': {
    type: 'converted-skeptic',
    label: 'Converted Skeptic',
    description: 'Was skeptical, now engaged!',
    emoji: '🎉',
    color: 'bg-pink-500'
  },
  'champion': {
    type: 'champion',
    label: 'Champion',
    description: 'High engagement, consistent user',
    emoji: '🏆',
    color: 'bg-orange-500'
  },
  'at-risk': {
    type: 'at-risk',
    label: 'At Risk',
    description: 'Engagement declining',
    emoji: '⚠️',
    color: 'bg-red-500'
  },
  'churned': {
    type: 'churned',
    label: 'Churned',
    description: 'Inactive 30+ days',
    emoji: '💤',
    color: 'bg-gray-500'
  }
};
