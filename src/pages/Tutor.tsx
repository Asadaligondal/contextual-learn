import { useState, useRef, useEffect } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { sendTutorMessage, hasApiKey } from '@/lib/aiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatMessage } from '@/types/memory';
import { 
  Brain, 
  Send, 
  Loader2, 
  AlertCircle,
  Sparkles,
  User,
  Bot,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tutor() {
  const { memory, addRecentTopic, incrementSession, getMemorySummary } = useMemory();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasStartedSession, setHasStartedSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsLoading(true);

    // Track session start
    if (!hasStartedSession) {
      incrementSession();
      setHasStartedSession(true);
    }

    // Extract potential topic from message
    const words = input.trim().split(' ');
    if (words.length >= 2) {
      const potentialTopic = words.slice(0, 3).join(' ');
      addRecentTopic(potentialTopic);
    }

    try {
      const response = await sendTutorMessage(input.trim(), memory, messages);

      if (response.error) {
        setError(response.error);
      } else {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date().toISOString(),
          metadata: {
            memoryUsed: !!memory,
            tokensUsed: response.tokensUsed,
          },
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const apiConfigured = hasApiKey();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Tutor</h1>
          <p className="text-muted-foreground">Ask questions and get personalized explanations</p>
        </div>
        
        {memory && (
          <div className="hidden md:flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Memory active: {memory.skillLevel} level, {memory.explanationStyle} style
            </span>
          </div>
        )}
      </div>

      {/* API Key Warning */}
      {!apiConfigured && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="py-3 flex items-center gap-3">
            <Info className="h-5 w-5 text-warning" />
            <p className="text-sm">
              <span className="font-medium">Demo Mode:</span> Add your OpenAI API key in{' '}
              <Link to="/settings" className="text-primary hover:underline">Settings</Link>{' '}
              for real AI responses.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Ask me anything academic. I'll adapt my explanations based on your learning profile.
              </p>
              
              {/* Suggested Prompts */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Explain photosynthesis',
                  'Help me understand derivatives',
                  'What caused World War I?',
                  'How do I write a thesis statement?',
                ].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="prose-academic text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    {message.metadata?.memoryUsed && (
                      <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                        <Brain className="h-3 w-3" />
                        Personalized response
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-4 py-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="min-h-[44px] max-h-32 resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
