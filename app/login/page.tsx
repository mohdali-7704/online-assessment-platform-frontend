'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth/AuthContext';
import { Lock, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);

    if (success) {
      router.push('/');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleDemoLogin = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);

    const success = login(demoUsername, demoPassword);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">AssessHub</h1>
          <p className="text-muted-foreground">Sign in to start your assessment</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demo Users</CardTitle>
            <CardDescription>Click to login with demo credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('john', 'john123')}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">John Doe</div>
                  <div className="text-xs text-muted-foreground">john / john123</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('jane', 'jane123')}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Jane Smith</div>
                  <div className="text-xs text-muted-foreground">jane / jane123</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('admin', 'admin123')}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Admin User</div>
                  <div className="text-xs text-muted-foreground">admin / admin123</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
