export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarType: 'emoji' | 'image';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional fields
  gender?: string;
  ethnicity?: string;
  profession?: string;
  interests?: string[];
  bio?: string;
  skills?: string[];
  education?: {
    degree?: string;
    institution?: string;
    year?: string;
  }[];
  // Internal flags
  skipped?: boolean; // Indicates if the user skipped profile setup
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'accomplishment' | 'strength' | 'growth' | 'impact' | 'bias-awareness';
  tags: string[];
  emoji?: string; // Emoticon for visual appeal
  demographics?: {
    gender?: string[];
    ethnicity?: string[];
  };
  journeyStage?: ('skeptic' | 'engaged' | 'advocate')[]; // NEW: Journey stage targeting
  research?: {
    citation: string;
    year: number;
    finding: string;
    link?: string;
  }; // NEW: Research backing for credibility
}

export interface BiasInsight {
  id: string;
  title: string;
  description: string;
  reflection: string;
  actionStep: string;
  actionType?: 'journal' | 'affirmation' | 'external'; // Type of action to take
  research?: {
    citation: string;
    year: number;
    finding: string;
    statistic?: string;
    link?: string;
  }[];
  interactiveElement?: {
    type: 'quiz' | 'self-assessment' | 'scenario' | 'reflection';
    content: any;
  };
}
