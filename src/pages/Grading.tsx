import { useState } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { getGradingFeedback, hasApiKey } from '@/lib/aiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { GradingFeedback } from '@/types/memory';
import { 
  GraduationCap, 
  Send, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Target,
  Lightbulb,
  Info,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Grading() {
  const { memory, addWeakTopic, addStrongTopic } = useMemory();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [rubric, setRubric] = useState('');
  const [feedback, setFeedback] = useState<GradingFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim() || isLoading) return;

    setError('');
    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await getGradingFeedback(
        question.trim(),
        answer.trim(),
        rubric.trim() || undefined,
        memory
      );

      if (result.error) {
        setError(result.error);
      } else if (result.feedback) {
        setFeedback(result.feedback);
        
        // Update memory based on score
        const scorePercent = (result.feedback.score / result.feedback.maxScore) * 100;
        
        // Extract topic from question for memory
        const questionWords = question.split(' ').slice(0, 3).join(' ');
        
        if (scorePercent < 60) {
          addWeakTopic(questionWords);
        } else if (scorePercent >= 80) {
          addStrongTopic(questionWords);
        }
      }
    } catch (err) {
      setError('Failed to get feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setRubric('');
    setFeedback(null);
    setError('');
  };

  const apiConfigured = hasApiKey();
  const scorePercent = feedback ? (feedback.score / feedback.maxScore) * 100 : 0;
  const scoreColor = scorePercent >= 80 ? 'text-success' : scorePercent >= 60 ? 'text-warning' : 'text-destructive';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Answer Grading</h1>
        <p className="text-muted-foreground">
          Submit your answer for personalized feedback based on your learning profile
        </p>
      </div>

      {/* API Key Warning */}
      {!apiConfigured && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="py-3 flex items-center gap-3">
            <Info className="h-5 w-5 text-warning" />
            <p className="text-sm">
              <span className="font-medium">Demo Mode:</span> Add your OpenAI API key in{' '}
              <Link to="/settings" className="text-primary hover:underline">Settings</Link>{' '}
              for real AI grading.
            </p>
          </CardContent>
        </Card>
      )}

      {!feedback ? (
        /* Submission Form */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Submit for Grading
            </CardTitle>
            <CardDescription>
              Provide the question and your answer. Optionally include a rubric for more accurate grading.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the question or prompt you're answering..."
                className="min-h-[80px]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Your Answer *</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer here..."
                className="min-h-[150px]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rubric">Grading Rubric (Optional)</Label>
              <Textarea
                id="rubric"
                value={rubric}
                onChange={(e) => setRubric(e.target.value)}
                placeholder="Enter any specific criteria or rubric for grading..."
                className="min-h-[80px]"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Include specific criteria, point distributions, or expectations if available.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              disabled={!question.trim() || !answer.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Grading
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Feedback Display */
        <div className="space-y-6 animate-fade-up">
          {/* Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className={`text-5xl font-bold ${scoreColor}`}>
                  {feedback.score}/{feedback.maxScore}
                </div>
                <Progress 
                  value={scorePercent} 
                  className="mt-4 h-3"
                />
                <p className="text-muted-foreground mt-2">
                  {scorePercent >= 80 
                    ? 'Excellent work!' 
                    : scorePercent >= 60 
                    ? 'Good effort, room for improvement' 
                    : 'Keep practicing, you\'ll get there!'}
                </p>
              </div>

              <div className="prose-academic text-sm">
                <p className="font-medium">Overall Feedback:</p>
                <p className="text-muted-foreground">{feedback.overallFeedback}</p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-success mt-1">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-warning">
                  <Target className="h-5 w-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-warning mt-1">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Personalized Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-info">
                <Lightbulb className="h-5 w-5" />
                Personalized Tips
              </CardTitle>
              <CardDescription>
                Based on your learning profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.personalizedTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-info mt-1">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Original Submission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Question:</p>
                <p className="mt-1">{question}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Your Answer:</p>
                <p className="mt-1 whitespace-pre-wrap">{answer}</p>
              </div>
              {rubric && (
                <div>
                  <p className="font-medium text-muted-foreground">Rubric:</p>
                  <p className="mt-1">{rubric}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Submit Another Answer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
