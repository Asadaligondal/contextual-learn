// User memory profile types for context engineering
export interface UserMemory {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  // Core learning profile
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  weakTopics: string[];
  strongTopics: string[];
  learningGoals: string[];
  
  // Preferences
  explanationStyle: 'concise' | 'step-by-step' | 'example-driven';
  tonePreference: 'formal' | 'casual' | 'encouraging';
  timeAvailability: 'limited' | 'moderate' | 'flexible';
  
  // Interaction history summaries
  recentTopics: string[];
  commonMistakes: string[];
  
  // Meta
  totalSessions: number;
  lastSessionDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  hasCompletedOnboarding: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    memoryUsed?: boolean;
    tokensUsed?: number;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface GradingSubmission {
  id: string;
  userId: string;
  question: string;
  studentAnswer: string;
  rubric?: string;
  feedback?: GradingFeedback;
  createdAt: string;
}

export interface GradingFeedback {
  score: number;
  maxScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  personalizedTips: string[]; // Based on user memory
}

// Default memory for new users
export const DEFAULT_USER_MEMORY: Omit<UserMemory, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  skillLevel: 'beginner',
  weakTopics: [],
  strongTopics: [],
  learningGoals: [],
  explanationStyle: 'step-by-step',
  tonePreference: 'encouraging',
  timeAvailability: 'moderate',
  recentTopics: [],
  commonMistakes: [],
  totalSessions: 0,
  lastSessionDate: new Date().toISOString(),
};
