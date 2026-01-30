import { useState } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { UserMemory } from '@/types/memory';
import { 
  Brain, 
  Plus, 
  X, 
  RotateCcw,
  Target,
  BookOpen,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Save
} from 'lucide-react';

export default function MemoryProfile() {
  const { memory, updateMemory, resetMemory, removeWeakTopic, removeLearningGoal, getContextPrompt } = useMemory();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newWeakTopic, setNewWeakTopic] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  if (!memory) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading memory profile...</p>
      </div>
    );
  }

  const handleAddWeakTopic = () => {
    if (newWeakTopic.trim()) {
      updateMemory({ weakTopics: [...memory.weakTopics, newWeakTopic.trim()] });
      setNewWeakTopic('');
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && memory.learningGoals.length < 5) {
      updateMemory({ learningGoals: [...memory.learningGoals, newGoal.trim()] });
      setNewGoal('');
    }
  };

  const handleAddStrongTopic = (topic: string) => {
    if (topic.trim()) {
      updateMemory({ 
        strongTopics: [...memory.strongTopics, topic.trim()],
        weakTopics: memory.weakTopics.filter(t => t !== topic)
      });
    }
  };

  const skillColors = {
    beginner: 'bg-skill-beginner',
    intermediate: 'bg-skill-intermediate',
    advanced: 'bg-skill-advanced',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Memory Profile
          </h1>
          <p className="text-muted-foreground">
            View and edit what the AI remembers about your learning preferences
          </p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Memory
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset your learning memory?</AlertDialogTitle>
              <AlertDialogDescription>
                This will erase all your learning preferences, tracked topics, and goals. 
                The AI will start fresh with no personalization. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetMemory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Reset Memory
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Core Profile */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Skill Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Skill Level
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setEditingSection(editingSection === 'skill' ? null : 'skill')}
              >
                {editingSection === 'skill' ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingSection === 'skill' ? (
              <RadioGroup 
                value={memory.skillLevel} 
                onValueChange={(v) => updateMemory({ skillLevel: v as UserMemory['skillLevel'] })}
              >
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className="capitalize cursor-pointer">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Badge className={`${skillColors[memory.skillLevel]} text-white capitalize`}>
                {memory.skillLevel}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Explanation Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Explanation Style
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setEditingSection(editingSection === 'style' ? null : 'style')}
              >
                {editingSection === 'style' ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingSection === 'style' ? (
              <RadioGroup 
                value={memory.explanationStyle} 
                onValueChange={(v) => updateMemory({ explanationStyle: v as UserMemory['explanationStyle'] })}
              >
                {(['concise', 'step-by-step', 'example-driven'] as const).map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <RadioGroupItem value={style} id={style} />
                    <Label htmlFor={style} className="capitalize cursor-pointer">{style.replace('-', ' ')}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="capitalize">{memory.explanationStyle.replace('-', ' ')}</p>
            )}
          </CardContent>
        </Card>

        {/* Tone Preference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Tone Preference
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setEditingSection(editingSection === 'tone' ? null : 'tone')}
              >
                {editingSection === 'tone' ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingSection === 'tone' ? (
              <RadioGroup 
                value={memory.tonePreference} 
                onValueChange={(v) => updateMemory({ tonePreference: v as UserMemory['tonePreference'] })}
              >
                {(['formal', 'casual', 'encouraging'] as const).map((tone) => (
                  <div key={tone} className="flex items-center space-x-2">
                    <RadioGroupItem value={tone} id={tone} />
                    <Label htmlFor={tone} className="capitalize cursor-pointer">{tone}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="capitalize">{memory.tonePreference}</p>
            )}
          </CardContent>
        </Card>

        {/* Time Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Availability
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setEditingSection(editingSection === 'time' ? null : 'time')}
              >
                {editingSection === 'time' ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingSection === 'time' ? (
              <RadioGroup 
                value={memory.timeAvailability} 
                onValueChange={(v) => updateMemory({ timeAvailability: v as UserMemory['timeAvailability'] })}
              >
                {(['limited', 'moderate', 'flexible'] as const).map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <RadioGroupItem value={time} id={time} />
                    <Label htmlFor={time} className="capitalize cursor-pointer">{time}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="capitalize">{memory.timeAvailability}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Learning Goals
          </CardTitle>
          <CardDescription>
            Goals you want to achieve ({memory.learningGoals.length}/5)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {memory.learningGoals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {memory.learningGoals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="gap-1 py-1.5 px-3">
                  {goal}
                  <button onClick={() => removeLearningGoal(goal)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No learning goals set</p>
          )}
          
          {memory.learningGoals.length < 5 && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a learning goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <Button onClick={handleAddGoal} disabled={!newGoal.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weak Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-memory-weak">
            <AlertTriangle className="h-4 w-4" />
            Areas Needing Improvement
          </CardTitle>
          <CardDescription>
            Topics the AI will reinforce gently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {memory.weakTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {memory.weakTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="gap-1 py-1.5 px-3 border-memory-weak text-memory-weak">
                  {topic}
                  <button onClick={() => removeWeakTopic(topic)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No weak topics identified yet</p>
          )}
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a topic to work on..."
              value={newWeakTopic}
              onChange={(e) => setNewWeakTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWeakTopic()}
            />
            <Button onClick={handleAddWeakTopic} disabled={!newWeakTopic.trim()} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strong Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-memory-active">
            <CheckCircle2 className="h-4 w-4" />
            Strong Areas
          </CardTitle>
          <CardDescription>
            Topics you're confident in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {memory.strongTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {memory.strongTopics.map((topic, index) => (
                <Badge key={index} className="bg-memory-active text-white">
                  {topic}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Strong topics are identified automatically through your grading performance.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-bold">{memory.totalSessions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Session</p>
            <p className="text-lg font-medium">
              {memory.lastSessionDate 
                ? new Date(memory.lastSessionDate).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Context Prompt Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Context Prompt Preview</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPrompt(!showPrompt)}
            >
              {showPrompt ? 'Hide' : 'Show'}
            </Button>
          </CardTitle>
          <CardDescription>
            This is what the AI sees about you before each response
          </CardDescription>
        </CardHeader>
        {showPrompt && (
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
              {getContextPrompt()}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
