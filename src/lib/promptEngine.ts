import type { ChatMessage, UserMemory } from '@/types/memory';

// System prompts for different modes
const TUTOR_SYSTEM_PROMPT = `You are LearnContext, an expert AI tutor designed to provide personalized, adaptive learning experiences. Your role is to:

1. **Explain concepts clearly** using the student's preferred learning style
2. **Build on existing knowledge** referenced in their profile
3. **Reinforce weak areas** gently without being condescending
4. **Encourage progress** and celebrate understanding
5. **Adapt complexity** based on their skill level

Always:
- Start with what they know before introducing new concepts
- Use their preferred explanation style consistently
- Provide practice opportunities when appropriate
- Ask clarifying questions to ensure understanding
- Be patient and supportive

If asked about topics outside academics, politely redirect to learning-focused conversations.`;

const GRADING_SYSTEM_PROMPT = `You are LearnContext's grading assistant. Your role is to provide constructive, personalized feedback on student answers. When grading:

1. **Evaluate against the rubric** if provided, otherwise use academic standards
2. **Identify strengths** to build confidence
3. **Highlight areas for improvement** constructively
4. **Connect feedback to their learning profile** - reference weak areas being addressed
5. **Provide actionable next steps**

Format your response as:
- **Score:** X/Y
- **Overall Feedback:** (2-3 sentences)
- **Strengths:** (bullet points)
- **Areas for Improvement:** (bullet points with specific suggestions)
- **Personalized Tips:** (based on their learning profile)

Be encouraging but honest. The goal is growth, not just evaluation.`;

interface PromptConfig {
  mode: 'tutor' | 'grading';
  userMessage: string;
  memory: UserMemory | null;
  conversationHistory?: ChatMessage[];
  additionalContext?: string; // For grading: the question and rubric
}

/**
 * Builds a complete prompt with memory context injection
 * This is the core of the context engineering system
 */
export function buildPrompt(config: PromptConfig): {
  systemPrompt: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
} {
  const { mode, userMessage, memory, conversationHistory = [], additionalContext } = config;

  // Select base system prompt
  const baseSystemPrompt = mode === 'tutor' ? TUTOR_SYSTEM_PROMPT : GRADING_SYSTEM_PROMPT;

  // Build memory context
  let memoryContext = '';
  if (memory) {
    memoryContext = buildMemoryContext(memory);
  }

  // Combine system prompt with memory context
  const fullSystemPrompt = memoryContext 
    ? `${baseSystemPrompt}\n\n---\n\n${memoryContext}`
    : baseSystemPrompt;

  // Build conversation messages
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: fullSystemPrompt },
  ];

  // Add conversation history (last 10 messages for context window management)
  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role !== 'system') {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }
  }

  // Add current user message with any additional context
  let finalUserMessage = userMessage;
  if (additionalContext) {
    finalUserMessage = `${additionalContext}\n\n---\n\nStudent's Answer:\n${userMessage}`;
  }

  messages.push({ role: 'user', content: finalUserMessage });

  return {
    systemPrompt: fullSystemPrompt,
    messages,
  };
}

/**
 * Builds the memory context section for prompt injection
 */
function buildMemoryContext(memory: UserMemory): string {
  const skillDescriptions = {
    beginner: 'a beginner who needs foundational explanations with no assumed prior knowledge',
    intermediate: 'an intermediate learner who understands basics but benefits from guidance on complex topics',
    advanced: 'an advanced student who appreciates depth, nuance, and intellectual challenge',
  };

  const styleGuidance = {
    concise: 'Be brief and direct. Get to the key points quickly without unnecessary elaboration.',
    'step-by-step': 'Break explanations into clear, numbered steps. Show reasoning processes explicitly.',
    'example-driven': 'Lead with concrete examples and analogies. Connect abstract concepts to real-world applications.',
  };

  const toneGuidance = {
    formal: 'Maintain academic, professional language throughout.',
    casual: 'Be conversational and approachable while remaining informative.',
    encouraging: 'Be warm and supportive. Celebrate progress and frame mistakes as learning opportunities.',
  };

  let context = `## Student Learning Profile\n\n`;
  context += `**Skill Level:** This student is ${skillDescriptions[memory.skillLevel]}.\n\n`;
  context += `**Preferred Style:** ${styleGuidance[memory.explanationStyle]}\n\n`;
  context += `**Tone:** ${toneGuidance[memory.tonePreference]}\n\n`;

  // Add weak topics if present
  if (memory.weakTopics.length > 0) {
    context += `**Known Challenges:** The student has struggled with: ${memory.weakTopics.join(', ')}. `;
    context += `Approach these topics with extra care and scaffolding.\n\n`;
  }

  // Add strong topics if present
  if (memory.strongTopics.length > 0) {
    context += `**Strengths:** The student is confident in: ${memory.strongTopics.join(', ')}. `;
    context += `You can reference these as foundations for new concepts.\n\n`;
  }

  // Add learning goals if present
  if (memory.learningGoals.length > 0) {
    context += `**Current Goals:** ${memory.learningGoals.join(', ')}. `;
    context += `Connect lessons to these goals when possible.\n\n`;
  }

  // Add common mistakes if present
  if (memory.commonMistakes.length > 0) {
    context += `**Patterns to Address:** The student has made these types of mistakes before: ${memory.commonMistakes.join(', ')}. `;
    context += `Watch for these patterns and provide proactive guidance.\n\n`;
  }

  // Add time context
  const timeGuidance = {
    limited: 'The student has limited time, so prioritize key insights and skip optional elaboration.',
    moderate: 'Balance thoroughness with efficiency.',
    flexible: 'Feel free to explore topics in depth and provide enrichment.',
  };
  context += `**Time Availability:** ${timeGuidance[memory.timeAvailability]}\n\n`;

  // Add session context
  if (memory.totalSessions > 0) {
    context += `**Session History:** This is approximately session #${memory.totalSessions + 1} with this student. `;
    if (memory.recentTopics.length > 0) {
      context += `Recent topics covered: ${memory.recentTopics.slice(0, 3).join(', ')}.`;
    }
    context += '\n';
  }

  return context;
}

/**
 * Summarizes memory when it gets too large (token management)
 */
export function summarizeMemory(memory: UserMemory): string {
  const parts: string[] = [];
  
  // Essential characteristics
  parts.push(`${memory.skillLevel} level student`);
  parts.push(`prefers ${memory.explanationStyle} explanations`);
  parts.push(`${memory.tonePreference} tone`);
  
  // Top priorities
  if (memory.weakTopics.length > 0) {
    parts.push(`struggles with: ${memory.weakTopics.slice(0, 3).join(', ')}`);
  }
  
  if (memory.learningGoals.length > 0) {
    parts.push(`goals: ${memory.learningGoals.slice(0, 2).join(', ')}`);
  }

  return parts.join('; ');
}

/**
 * Estimates token count for a string (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
}

/**
 * Checks if memory context needs summarization
 */
export function needsSummarization(memory: UserMemory): boolean {
  const context = buildMemoryContext(memory);
  const tokens = estimateTokens(context);
  // Summarize if context exceeds ~500 tokens
  return tokens > 500;
}
