import type { ChatMessage, UserMemory, GradingFeedback } from '@/types/memory';
import { buildPrompt } from './promptEngine';

// Check if API key is configured
const getApiKey = (): string | null => {
  // In a real app, this would come from environment variables or secure storage
  // For demo purposes, we check localStorage
  return localStorage.getItem('learncontext_openai_key');
};

export interface AIResponse {
  content: string;
  error?: string;
  tokensUsed?: number;
}

/**
 * Send a message to the AI tutor
 */
export async function sendTutorMessage(
  userMessage: string,
  memory: UserMemory | null,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // Return a helpful demo response when no API key
    return generateDemoTutorResponse(userMessage, memory);
  }

  try {
    const { messages } = buildPrompt({
      mode: 'tutor',
      userMessage,
      memory,
      conversationHistory,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Failed to connect to AI service',
    };
  }
}

/**
 * Get grading feedback from the AI
 */
export async function getGradingFeedback(
  question: string,
  studentAnswer: string,
  rubric: string | undefined,
  memory: UserMemory | null
): Promise<{ feedback: GradingFeedback | null; error?: string }> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // Return demo grading response
    return { feedback: generateDemoGradingFeedback(studentAnswer, memory) };
  }

  try {
    let additionalContext = `**Question:**\n${question}`;
    if (rubric) {
      additionalContext += `\n\n**Grading Rubric:**\n${rubric}`;
    }

    const { messages } = buildPrompt({
      mode: 'grading',
      userMessage: studentAnswer,
      memory,
      additionalContext,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get grading feedback');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the structured feedback from the response
    const feedback = parseGradingFeedback(content);
    return { feedback };
  } catch (error) {
    console.error('Grading API Error:', error);
    return {
      feedback: null,
      error: error instanceof Error ? error.message : 'Failed to connect to AI service',
    };
  }
}

/**
 * Parse grading feedback from AI response
 */
function parseGradingFeedback(content: string): GradingFeedback {
  // Extract score
  const scoreMatch = content.match(/\*\*Score:\*\*\s*(\d+)\/(\d+)/i) || 
                     content.match(/Score:\s*(\d+)\/(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;
  const maxScore = scoreMatch ? parseInt(scoreMatch[2]) : 10;

  // Extract sections
  const sections = {
    overallFeedback: extractSection(content, 'Overall Feedback'),
    strengths: extractBulletPoints(content, 'Strengths'),
    improvements: extractBulletPoints(content, 'Areas for Improvement') || 
                  extractBulletPoints(content, 'Improvements'),
    personalizedTips: extractBulletPoints(content, 'Personalized Tips') ||
                      extractBulletPoints(content, 'Tips'),
  };

  return {
    score,
    maxScore,
    overallFeedback: sections.overallFeedback || 'Good effort on this answer.',
    strengths: sections.strengths.length > 0 ? sections.strengths : ['Shows understanding of the topic'],
    improvements: sections.improvements.length > 0 ? sections.improvements : ['Consider adding more detail'],
    personalizedTips: sections.personalizedTips.length > 0 ? sections.personalizedTips : ['Keep practicing!'],
  };
}

function extractSection(content: string, heading: string): string {
  const regex = new RegExp(`\\*\\*${heading}:\\*\\*\\s*([^*]+?)(?=\\*\\*|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractBulletPoints(content: string, heading: string): string[] {
  const regex = new RegExp(`\\*\\*${heading}:\\*\\*([^*]+?)(?=\\*\\*|$)`, 'is');
  const match = content.match(regex);
  if (!match) return [];
  
  const bulletSection = match[1];
  const bullets = bulletSection.match(/[-•]\s*([^\n-•]+)/g) || [];
  return bullets.map(b => b.replace(/^[-•]\s*/, '').trim()).filter(b => b.length > 0);
}

/**
 * Generate a demo tutor response when no API key is configured
 */
function generateDemoTutorResponse(userMessage: string, memory: UserMemory | null): AIResponse {
  const skillLevel = memory?.skillLevel || 'intermediate';
  const style = memory?.explanationStyle || 'step-by-step';
  
  let response = '';
  
  // Personalize based on memory
  if (memory?.tonePreference === 'encouraging') {
    response += "Great question! I'm happy to help you understand this better. ";
  }

  // Detect topic from message
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('calcul')) {
    response += generateMathResponse(skillLevel, style);
  } else if (lowerMessage.includes('history') || lowerMessage.includes('war') || lowerMessage.includes('revolution')) {
    response += generateHistoryResponse(skillLevel, style);
  } else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry')) {
    response += generateScienceResponse(skillLevel, style);
  } else {
    response += generateGenericResponse(skillLevel, style, userMessage);
  }

  // Add personalized footer based on memory
  if (memory?.weakTopics.length && memory.weakTopics.length > 0) {
    response += `\n\n💡 *I notice you've been working on ${memory.weakTopics[0]}. Would you like me to connect this to that topic?*`;
  }

  return {
    content: response,
    tokensUsed: Math.floor(response.length / 4),
  };
}

function generateMathResponse(skillLevel: string, style: string): string {
  if (style === 'step-by-step') {
    return `Let me break this down for you:

**Step 1:** First, identify what type of problem this is
**Step 2:** Write out the given information
**Step 3:** Apply the relevant formula or method
**Step 4:** Solve step by step, showing your work
**Step 5:** Check your answer

${skillLevel === 'beginner' ? 'Remember, take your time with each step. There\'s no rush!' : 'Try to identify patterns as you work through similar problems.'}`;
  } else if (style === 'example-driven') {
    return `Here's how this works with a concrete example:

📘 **Example:** Imagine you have 3 baskets with 5 apples each...

This is just like the mathematical concept you're asking about. The pattern here is multiplication: 3 × 5 = 15 apples total.

${skillLevel === 'advanced' ? 'You can extend this to more complex scenarios like matrices or vector spaces.' : 'Does this analogy help clarify the concept?'}`;
  }
  return 'The key to understanding this mathematical concept is practice and pattern recognition. Would you like me to work through an example together?';
}

function generateHistoryResponse(skillLevel: string, style: string): string {
  if (style === 'step-by-step') {
    return `Let's analyze this historical event systematically:

**1. Context:** What was happening before this event?
**2. Causes:** What led to this happening?
**3. Key Players:** Who were the important figures involved?
**4. Events:** What actually happened?
**5. Consequences:** What changed as a result?

${skillLevel === 'beginner' ? 'Understanding history is like piecing together a story. Each event connects to the next.' : 'Consider how primary sources might give us different perspectives on these events.'}`;
  }
  return 'History is all about understanding cause and effect, and how events connect across time. Let me help you see these connections more clearly.';
}

function generateScienceResponse(skillLevel: string, style: string): string {
  if (style === 'example-driven') {
    return `Let me explain this with a real-world example:

🔬 **Everyday Example:** Think about when you see a rainbow after rain...

This demonstrates the scientific principle at work. Light behaves in predictable ways, and understanding these patterns helps us understand our world.

${skillLevel === 'advanced' ? 'The underlying physics involves wave interference and the electromagnetic spectrum.' : 'Would you like me to explain the simple version first?'}`;
  }
  return 'Science is about observation, hypothesis, and testing. Let\'s explore this concept together and see how it connects to what you already know.';
}

function generateGenericResponse(skillLevel: string, style: string, message: string): string {
  return `That's an interesting topic! Let me help you understand it better.

${style === 'step-by-step' ? 'Let\'s break this down into manageable parts:' : 'Here\'s the key concept:'}

${skillLevel === 'beginner' 
  ? 'I\'ll start with the fundamentals and we can build from there.'
  : skillLevel === 'advanced'
  ? 'Given your level, let\'s dive into the nuances of this topic.'
  : 'I\'ll give you a balanced explanation with room to explore deeper.'}

Would you like me to explain any specific aspect in more detail?

---
*Note: This is a demo response. Connect your OpenAI API key in Settings for personalized AI tutoring.*`;
}

/**
 * Generate demo grading feedback when no API key is configured
 */
function generateDemoGradingFeedback(answer: string, memory: UserMemory | null): GradingFeedback {
  const answerLength = answer.length;
  const baseScore = Math.min(8, Math.floor(answerLength / 50) + 3);
  
  return {
    score: baseScore,
    maxScore: 10,
    overallFeedback: `Good effort on this response! ${memory?.tonePreference === 'encouraging' ? 'You\'re making great progress!' : 'Let\'s look at how to improve.'}`,
    strengths: [
      'Attempted to address the question directly',
      'Shows engagement with the material',
      answerLength > 100 ? 'Provided a detailed response' : 'Got to the point efficiently',
    ],
    improvements: [
      'Consider adding more specific examples',
      'Try to connect your answer to broader concepts',
      memory?.weakTopics?.[0] ? `Watch for common mistakes in ${memory.weakTopics[0]}` : 'Double-check your reasoning',
    ],
    personalizedTips: [
      memory?.explanationStyle === 'step-by-step' 
        ? 'Try organizing your answer in clear steps'
        : 'Use concrete examples to support your points',
      memory?.skillLevel === 'beginner'
        ? 'Focus on understanding the basics first'
        : 'Push yourself to explore deeper connections',
      '*Demo mode: Add your OpenAI API key for real AI grading*',
    ],
  };
}

/**
 * Set the OpenAI API key
 */
export function setApiKey(key: string): void {
  localStorage.setItem('learncontext_openai_key', key);
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
  return !!getApiKey();
}

/**
 * Clear the API key
 */
export function clearApiKey(): void {
  localStorage.removeItem('learncontext_openai_key');
}
