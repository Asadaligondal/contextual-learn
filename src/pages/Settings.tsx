import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { setApiKey, hasApiKey, clearApiKey } from '@/lib/aiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { 
  Settings as SettingsIcon, 
  Key, 
  User,
  Bell,
  Moon,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(hasApiKey());
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setHasKey(true);
      setApiKeyInput('');
      toast({
        title: 'API Key Saved',
        description: 'Your OpenAI API key has been saved securely.',
      });
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setHasKey(false);
    toast({
      title: 'API Key Removed',
      description: 'Your OpenAI API key has been removed.',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground text-xs">Name</Label>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Member Since</Label>
            <p className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Log Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You'll need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* OpenAI API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            OpenAI API Key
          </CardTitle>
          <CardDescription>
            Required for real AI tutoring and grading. Your key is stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasKey ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 text-success">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">API Key Configured</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearApiKey}>
                Remove
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm">No API key configured. Using demo mode.</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                  />
                  <Button onClick={handleSaveApiKey} disabled={!apiKeyInput.trim()}>
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    OpenAI Platform
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label>Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Use dark theme</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label>Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive learning reminders</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data & Privacy</CardTitle>
          <CardDescription>
            All your data is stored locally in your browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Your learning memory is stored in localStorage</p>
          <p>• Your OpenAI API key never leaves your browser</p>
          <p>• No data is sent to our servers</p>
          <p>• Clear browser data to remove all information</p>
        </CardContent>
      </Card>
    </div>
  );
}
