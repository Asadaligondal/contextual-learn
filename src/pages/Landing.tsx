import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  GraduationCap, 
  MessageSquare, 
  Sparkles, 
  Target,
  ChevronRight,
  Star
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">LearnContext</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Personalized Learning
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl">
              An AI Tutor That{' '}
              <span className="gradient-text">Remembers You</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground text-balance md:text-xl">
              LearnContext uses persistent memory to personalize every tutoring session. 
              It adapts to your skill level, learning style, and goals—getting better with every conversation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start Learning Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Learning That Adapts to You
            </h2>
            <p className="text-muted-foreground text-lg">
              Our context-engineered memory system creates a truly personalized education experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Persistent Memory"
              description="The AI remembers your skill level, weak areas, and learning preferences across all sessions."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Adaptive Tutoring"
              description="Explanations adjust to your preferred style—concise, step-by-step, or example-driven."
            />
            <FeatureCard
              icon={GraduationCap}
              title="Smart Grading"
              description="Get personalized feedback on your answers with insights based on your learning history."
            />
            <FeatureCard
              icon={Target}
              title="Goal Tracking"
              description="Set learning goals and watch as the AI helps you progress toward them."
            />
            <FeatureCard
              icon={Sparkles}
              title="Pattern Recognition"
              description="The system identifies your common mistakes and proactively helps you avoid them."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Transparent Control"
              description="View, edit, or reset your memory profile anytime. You're always in control."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How LearnContext Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to personalized, effective learning.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <StepCard
                number="1"
                title="Create Your Profile"
                description="Tell us your skill level, learning goals, and how you prefer to learn. This takes less than 2 minutes."
              />
              <StepCard
                number="2"
                title="Start Learning"
                description="Ask questions, submit answers for grading, or explore any academic topic. The AI adapts in real-time."
              />
              <StepCard
                number="3"
                title="Watch It Improve"
                description="With each session, the AI learns more about you, delivering increasingly personalized guidance."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Loved by Students
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="Finally, an AI tutor that doesn't make me repeat my background every time. It just knows what I need."
              author="Sarah K."
              role="Pre-Med Student"
            />
            <TestimonialCard
              quote="The personalized feedback on my essays has improved my writing more than any class. It remembers my weak points."
              author="Marcus T."
              role="English Major"
            />
            <TestimonialCard
              quote="I love that I can see exactly what it remembers about me. The transparency builds trust."
              author="Emily R."
              role="High School Senior"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free, upgrade when you're ready.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <PricingCard
              title="Free"
              price="$0"
              description="Perfect for trying out personalized tutoring"
              features={[
                '10 tutor conversations/month',
                '5 grading submissions/month',
                'Basic memory profile',
                'Email support',
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            <PricingCard
              title="Pro"
              price="$12"
              period="/month"
              description="For serious students who want the full experience"
              features={[
                'Unlimited conversations',
                'Unlimited grading',
                'Advanced memory insights',
                'Priority support',
                'Export your data',
              ]}
              buttonText="Start Pro Trial"
              buttonVariant="default"
              highlighted
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Learn Smarter?
            </h2>
            <p className="mb-8 text-primary-foreground/80 text-lg">
              Join thousands of students using AI-powered personalized tutoring.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">
                Create Free Account
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">LearnContext</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LearnContext. Demo application for context engineering demonstration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
        {number}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-warning text-warning" />
          ))}
        </div>
        <p className="mb-4 text-sm italic">"{quote}"</p>
        <div>
          <p className="font-medium text-sm">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  highlighted,
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  highlighted?: boolean;
}) {
  return (
    <Card className={highlighted ? 'border-primary shadow-lg' : ''}>
      <CardContent className="pt-6">
        {highlighted && (
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Most Popular
          </div>
        )}
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="my-4">
          <span className="text-4xl font-bold">{price}</span>
          {period && <span className="text-muted-foreground">{period}</span>}
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        <ul className="mb-6 space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {feature}
            </li>
          ))}
        </ul>
        <Button variant={buttonVariant} className="w-full" asChild>
          <Link to="/signup">{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
