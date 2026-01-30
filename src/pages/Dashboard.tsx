import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMemory } from '@/contexts/MemoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  GraduationCap, 
  MessageSquare, 
  Sparkles, 
  Target,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { memory, getMemorySummary } = useMemory();

  const skillColors = {
    beginner: 'bg-skill-beginner',
    intermediate: 'bg-skill-intermediate',
    advanced: 'bg-skill-advanced',
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your personalized learning journey?
          </p>
        </div>
        <Button asChild>
          <Link to="/tutor">
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Tutoring Session
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skill Level</p>
                <p className="text-xl font-semibold capitalize">{memory?.skillLevel || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-xl font-semibold">{memory?.totalSessions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Target className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-xl font-semibold">{memory?.learningGoals?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                <Clock className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Availability</p>
                <p className="text-xl font-semibold capitalize">{memory?.timeAvailability || 'Moderate'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into your learning activities</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link to="/tutor">
              <Card className="card-hover h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">AI Tutor</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ask questions and get personalized explanations
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/grading">
              <Card className="card-hover h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <GraduationCap className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Submit Answer</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get personalized feedback on your work
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/memory">
              <Card className="card-hover h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                      <Brain className="h-5 w-5 text-info" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Memory Profile</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        View and edit what the AI remembers
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/settings">
              <Card className="card-hover h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Settings</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure API keys and preferences
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        {/* Memory Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Your Learning Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skill Badge */}
            <div className="flex items-center gap-2">
              <Badge 
                className={`${skillColors[memory?.skillLevel || 'intermediate']} text-white`}
              >
                {memory?.skillLevel || 'Intermediate'}
              </Badge>
              <span className="text-sm text-muted-foreground">level</span>
            </div>

            {/* Learning Goals */}
            {memory?.learningGoals && memory.learningGoals.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Learning Goals</p>
                <div className="flex flex-wrap gap-1">
                  {memory.learningGoals.slice(0, 3).map((goal, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                  {memory.learningGoals.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{memory.learningGoals.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Weak Topics */}
            {memory?.weakTopics && memory.weakTopics.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Areas to Improve</p>
                <div className="flex flex-wrap gap-1">
                  {memory.weakTopics.slice(0, 3).map((topic, i) => (
                    <Badge key={i} variant="destructive" className="text-xs bg-memory-weak">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Summary */}
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Prefers <span className="font-medium text-foreground">{memory?.explanationStyle}</span> explanations 
                with a <span className="font-medium text-foreground">{memory?.tonePreference}</span> tone.
              </p>
            </div>

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/memory">
                View Full Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Topics */}
      {memory?.recentTopics && memory.recentTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Topics</CardTitle>
            <CardDescription>Topics you've explored recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {memory.recentTopics.map((topic, i) => (
                <Badge key={i} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
