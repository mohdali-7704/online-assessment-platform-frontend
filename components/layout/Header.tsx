'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">
            AssessHub
          </div>
        </Link>

        <nav className="flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <Link
                href="/assessments"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Assessments
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <User className="w-3 h-3" />
                  {user?.name}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
