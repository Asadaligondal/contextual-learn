import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, X } from 'lucide-react';
import type { UserMemory } from '@/types/memory';

type Step = 'skill' | 'goals' | 'style' | 'complete';

export default function Onboarding() {
  const { updateUser } = useAuth();
  const { updateMemory } = useMemory();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<Step>('skill');
  const [skillLevel, setSkillLevel] = useState<UserMemory['skillLevel']>('intermediate');
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [explanationStyle, setExplanationStyle] = useState<UserMemory['explanationStyle']>('step-by-step');
  const [tonePreference, setTonePreference] = useState<UserMemory['tonePreference']>('encouraging');
  const [timeAvailability, setTimeAvailability] = useState<UserMemory['timeAvailability']>('moderate');

  const addGoal = () => {
    if (goalInput.trim() && learningGoals.length < 5) {
      setLearningGoals([...learningGoals, goalInput.trim()]);
      setGoalInput('');
    }
  };

  const removeGoal = (index: number) => {
    setLearningGoals(learningGoals.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGoal();
    }
  };

  const handleComplete = () => {
    // Update memory with onboarding data
    updateMemory({
      skillLevel,
      learningGoals,
      explanationStyle,
      tonePreference,
      timeAvailability,
    });

    // Mark onboarding as complete
    updateUser({ hasCompletedOnboarding: true });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const steps: Step[] = ['skill', 'goals', 'style', 'complete'];
  const currentIndex = steps.indexOf(step);

  const goNext = () => {
    const next = steps[currentIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = steps[currentIndex - 1];
    if (prev) setStep(prev);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-semibold">LearnContext</span>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                i <= currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Card>
          {step === 'skill' && (
            <>
              <CardHeader>
                <CardTitle>What's your current level?</CardTitle>
                <CardDescription>
                  This helps us calibrate explanations to match your knowledge.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={skillLevel} onValueChange={(v) => setSkillLevel(v as any)}>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <div className="flex-1">
                      <Label htmlFor="beginner" className="font-medium cursor-pointer">Beginner</Label>
                      <p className="text-sm text-muted-foreground">I'm just starting out and need foundational explanations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <div className="flex-1">
                      <Label htmlFor="intermediate" className="font-medium cursor-pointer">Intermediate</Label>
                      <p className="text-sm text-muted-foreground">I understand the basics and want to deepen my knowledge</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <div className="flex-1">
                      <Label htmlFor="advanced" className="font-medium cursor-pointer">Advanced</Label>
                      <p className="text-sm text-muted-foreground">I'm looking for depth, nuance, and challenging material</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </>
          )}

          {step === 'goals' && (
            <>
              <CardHeader>
                <CardTitle>What are your learning goals?</CardTitle>
                <CardDescription>
                  Add up to 5 goals. The AI will help you work toward them.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Master calculus, Improve essay writing..."
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={learningGoals.length >= 5}
                  />
                  <Button 
                    onClick={addGoal} 
                    disabled={!goalInput.trim() || learningGoals.length >= 5}
                  >
                    Add
                  </Button>
                </div>

                {learningGoals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {learningGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="gap-1 py-1.5 px-3">
                        {goal}
                        <button onClick={() => removeGoal(index)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {learningGoals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No goals added yet. You can always add them later.
                  </p>
                )}
              </CardContent>
            </>
          )}

          {step === 'style' && (
            <>
              <CardHeader>
                <CardTitle>How do you prefer to learn?</CardTitle>
                <CardDescription>
                  We'll adjust explanations to match your style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Explanation Style</Label>
                  <RadioGroup value={explanationStyle} onValueChange={(v) => setExplanationStyle(v as any)}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="concise" id="concise" />
                      <Label htmlFor="concise" className="cursor-pointer">Concise — Brief, to the point</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="step-by-step" id="step-by-step" />
                      <Label htmlFor="step-by-step" className="cursor-pointer">Step-by-step — Clear, numbered steps</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="example-driven" id="example-driven" />
                      <Label htmlFor="example-driven" className="cursor-pointer">Example-driven — Learn through examples</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tone Preference</Label>
                  <RadioGroup value={tonePreference} onValueChange={(v) => setTonePreference(v as any)}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="formal" id="formal" />
                      <Label htmlFor="formal" className="cursor-pointer">Formal — Academic and professional</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="casual" id="casual" />
                      <Label htmlFor="casual" className="cursor-pointer">Casual — Conversational and friendly</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="encouraging" id="encouraging" />
                      <Label htmlFor="encouraging" className="cursor-pointer">Encouraging — Supportive and motivating</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Time Availability</Label>
                  <RadioGroup value={timeAvailability} onValueChange={(v) => setTimeAvailability(v as any)}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="limited" id="limited" />
                      <Label htmlFor="limited" className="cursor-pointer">Limited — Quick, focused sessions</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="cursor-pointer">Moderate — Balanced depth</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible" className="cursor-pointer">Flexible — Deep exploration welcome</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </>
          )}

          {step === 'complete' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <CardTitle>You're all set!</CardTitle>
                <CardDescription>
                  Your learning profile has been created. The AI will now personalize all interactions based on your preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                  <p><strong>Skill Level:</strong> {skillLevel}</p>
                  <p><strong>Style:</strong> {explanationStyle}</p>
                  <p><strong>Tone:</strong> {tonePreference}</p>
                  {learningGoals.length > 0 && (
                    <p><strong>Goals:</strong> {learningGoals.join(', ')}</p>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  You can update these settings anytime in your Memory Profile.
                </p>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between p-6 pt-0">
            {currentIndex > 0 ? (
              <Button variant="ghost" onClick={goBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step === 'complete' ? (
              <Button onClick={handleComplete}>
                Start Learning
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={goNext}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
