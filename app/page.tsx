'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Clock, CheckCircle, Award, User } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 md:py-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="secondary" className="text-lg px-4 py-2 gap-2">
            <User className="w-5 h-5" />
            Welcome, {user?.name}!
          </Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Ready for <span className="text-primary">Your Assessment</span>?
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Test your knowledge with interactive assessments featuring multiple question types,
          coding challenges, and instant feedback.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/assessments">
            <Button size="lg" className="gap-2">
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose AssessHub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Coding Challenges</h3>
              <p className="text-sm text-muted-foreground">
                Test your programming skills with real-time code execution and test cases.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Multiple Question Types</h3>
              <p className="text-sm text-muted-foreground">
                MCQs, True/False, Descriptive, and Coding questions all in one platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Timed Assessments</h3>
              <p className="text-sm text-muted-foreground">
                Track your time with built-in timer and auto-submit functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate feedback with detailed results and scoring.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 pb-6 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Test Your Skills?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of assessments covering various topics from JavaScript
              fundamentals to advanced data structures and algorithms.
            </p>
            <Link href="/assessments">
              <Button size="lg" className="gap-2">
                View All Assessments
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
