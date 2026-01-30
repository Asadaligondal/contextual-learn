import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Check, 
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';

export default function Billing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out personalized tutoring',
      features: [
        '10 tutor conversations/month',
        '5 grading submissions/month',
        'Basic memory profile',
        'Email support',
      ],
      current: true,
      icon: Zap,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For serious students who want the full experience',
      features: [
        'Unlimited conversations',
        'Unlimited grading',
        'Advanced memory insights',
        'Priority support',
        'Export your data',
        'Custom learning paths',
      ],
      current: false,
      highlighted: true,
      icon: Crown,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Billing
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Free Plan</p>
                <p className="text-sm text-muted-foreground">Basic access with limited features</p>
              </div>
            </div>
            <Badge>Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This Month's Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Tutor Conversations</p>
            <p className="text-2xl font-bold">3 / 10</p>
            <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
              <div className="h-full w-[30%] bg-primary rounded-full" />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Grading Submissions</p>
            <p className="text-2xl font-bold">1 / 5</p>
            <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
              <div className="h-full w-[20%] bg-primary rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={plan.highlighted ? 'border-primary shadow-lg' : ''}
              >
                <CardHeader>
                  {plan.highlighted && (
                    <Badge className="w-fit mb-2">Most Popular</Badge>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.current ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Static Notice */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            This is a demo application. Payment processing is not enabled.
            <br />
            All features work with mock data for demonstration purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
