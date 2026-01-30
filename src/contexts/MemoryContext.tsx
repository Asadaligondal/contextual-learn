import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserMemory } from '@/types/memory';
import { DEFAULT_USER_MEMORY } from '@/types/memory';
import { useAuth } from './AuthContext';

interface MemoryContextType {
  memory: UserMemory | null;
  isLoading: boolean;
  updateMemory: (updates: Partial<UserMemory>) => void;
  resetMemory: () => void;
  addWeakTopic: (topic: string) => void;
  removeWeakTopic: (topic: string) => void;
  addStrongTopic: (topic: string) => void;
  addLearningGoal: (goal: string) => void;
  removeLearningGoal: (goal: string) => void;
  addRecentTopic: (topic: string) => void;
  addCommonMistake: (mistake: string) => void;
  incrementSession: () => void;
  getMemorySummary: () => string;
  getContextPrompt: () => string;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

const MEMORY_STORAGE_KEY = 'learncontext_memory';

export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load memory for current user
  useEffect(() => {
    if (!user) {
      setMemory(null);
      setIsLoading(false);
      return;
    }

    const allMemories = getAllMemories();
    const userMemory = allMemories[user.id];

    if (userMemory) {
      setMemory(userMemory);
    } else {
      // Create new memory for user
      const newMemory: UserMemory = {
        ...DEFAULT_USER_MEMORY,
        id: crypto.randomUUID(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMemory(newMemory);
      saveMemory(user.id, newMemory);
    }
    setIsLoading(false);
  }, [user]);

  const getAllMemories = (): Record<string, UserMemory> => {
    const stored = localStorage.getItem(MEMORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveMemory = (userId: string, mem: UserMemory) => {
    const allMemories = getAllMemories();
    allMemories[userId] = mem;
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(allMemories));
  };

  const updateMemory = useCallback((updates: Partial<UserMemory>) => {
    if (!memory || !user) return;

    const updated: UserMemory = {
      ...memory,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setMemory(updated);
    saveMemory(user.id, updated);
  }, [memory, user]);

  const resetMemory = useCallback(() => {
    if (!user) return;

    const newMemory: UserMemory = {
      ...DEFAULT_USER_MEMORY,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemory(newMemory);
    saveMemory(user.id, newMemory);
  }, [user]);

  const addWeakTopic = useCallback((topic: string) => {
    if (!memory) return;
    const weakTopics = [...new Set([...memory.weakTopics, topic])].slice(-10);
    updateMemory({ weakTopics });
  }, [memory, updateMemory]);

  const removeWeakTopic = useCallback((topic: string) => {
    if (!memory) return;
    updateMemory({ weakTopics: memory.weakTopics.filter(t => t !== topic) });
  }, [memory, updateMemory]);

  const addStrongTopic = useCallback((topic: string) => {
    if (!memory) return;
    const strongTopics = [...new Set([...memory.strongTopics, topic])].slice(-10);
    // Remove from weak topics if present
    const weakTopics = memory.weakTopics.filter(t => t !== topic);
    updateMemory({ strongTopics, weakTopics });
  }, [memory, updateMemory]);

  const addLearningGoal = useCallback((goal: string) => {
    if (!memory) return;
    const learningGoals = [...new Set([...memory.learningGoals, goal])].slice(-5);
    updateMemory({ learningGoals });
  }, [memory, updateMemory]);

  const removeLearningGoal = useCallback((goal: string) => {
    if (!memory) return;
    updateMemory({ learningGoals: memory.learningGoals.filter(g => g !== goal) });
  }, [memory, updateMemory]);

  const addRecentTopic = useCallback((topic: string) => {
    if (!memory) return;
    const recentTopics = [topic, ...memory.recentTopics.filter(t => t !== topic)].slice(0, 10);
    updateMemory({ recentTopics });
  }, [memory, updateMemory]);

  const addCommonMistake = useCallback((mistake: string) => {
    if (!memory) return;
    const commonMistakes = [...new Set([...memory.commonMistakes, mistake])].slice(-10);
    updateMemory({ commonMistakes });
  }, [memory, updateMemory]);

  const incrementSession = useCallback(() => {
    if (!memory) return;
    updateMemory({
      totalSessions: memory.totalSessions + 1,
      lastSessionDate: new Date().toISOString(),
    });
  }, [memory, updateMemory]);

  // Generate a human-readable summary of the memory
  const getMemorySummary = useCallback((): string => {
    if (!memory) return 'No memory available';

    const parts: string[] = [];
    
    parts.push(`Skill Level: ${memory.skillLevel}`);
    
    if (memory.weakTopics.length > 0) {
      parts.push(`Areas needing work: ${memory.weakTopics.join(', ')}`);
    }
    
    if (memory.strongTopics.length > 0) {
      parts.push(`Strong in: ${memory.strongTopics.join(', ')}`);
    }
    
    if (memory.learningGoals.length > 0) {
      parts.push(`Goals: ${memory.learningGoals.join(', ')}`);
    }
    
    parts.push(`Prefers ${memory.explanationStyle} explanations`);
    parts.push(`Tone: ${memory.tonePreference}`);
    
    return parts.join('. ');
  }, [memory]);

  // Generate the context prompt for AI injection
  const getContextPrompt = useCallback((): string => {
    if (!memory) return '';

    const skillDescriptions = {
      beginner: 'a beginner who needs foundational explanations with no assumed knowledge',
      intermediate: 'an intermediate learner who understands basics but needs guidance on complex topics',
      advanced: 'an advanced student who appreciates depth, nuance, and challenging perspectives',
    };

    const styleDescriptions = {
      concise: 'Keep explanations brief and to the point. Avoid unnecessary elaboration.',
      'step-by-step': 'Break down explanations into clear, numbered steps. Show the reasoning process.',
      'example-driven': 'Lead with concrete examples. Use analogies and real-world applications.',
    };

    const toneDescriptions = {
      formal: 'Use academic, professional language.',
      casual: 'Be conversational and approachable.',
      encouraging: 'Be supportive and celebrate progress. Gently correct mistakes.',
    };

    let prompt = `## Student Learning Profile\n\n`;
    prompt += `This student is ${skillDescriptions[memory.skillLevel]}.\n\n`;
    prompt += `**Explanation Style:** ${styleDescriptions[memory.explanationStyle]}\n\n`;
    prompt += `**Tone:** ${toneDescriptions[memory.tonePreference]}\n\n`;

    if (memory.weakTopics.length > 0) {
      prompt += `**Known Weak Areas (reinforce gently):** ${memory.weakTopics.join(', ')}\n\n`;
    }

    if (memory.strongTopics.length > 0) {
      prompt += `**Strong Areas (can reference as foundation):** ${memory.strongTopics.join(', ')}\n\n`;
    }

    if (memory.learningGoals.length > 0) {
      prompt += `**Current Learning Goals:** ${memory.learningGoals.join(', ')}\n\n`;
    }

    if (memory.commonMistakes.length > 0) {
      prompt += `**Common Mistakes to Address:** ${memory.commonMistakes.join(', ')}\n\n`;
    }

    if (memory.recentTopics.length > 0) {
      prompt += `**Recent Topics Studied:** ${memory.recentTopics.slice(0, 5).join(', ')}\n\n`;
    }

    prompt += `**Time Availability:** ${memory.timeAvailability} — `;
    if (memory.timeAvailability === 'limited') {
      prompt += 'prioritize key points and quick wins.';
    } else if (memory.timeAvailability === 'flexible') {
      prompt += 'feel free to explore topics in depth.';
    } else {
      prompt += 'balance depth with efficiency.';
    }

    return prompt;
  }, [memory]);

  return (
    <MemoryContext.Provider
      value={{
        memory,
        isLoading,
        updateMemory,
        resetMemory,
        addWeakTopic,
        removeWeakTopic,
        addStrongTopic,
        addLearningGoal,
        removeLearningGoal,
        addRecentTopic,
        addCommonMistake,
        incrementSession,
        getMemorySummary,
        getContextPrompt,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
}
