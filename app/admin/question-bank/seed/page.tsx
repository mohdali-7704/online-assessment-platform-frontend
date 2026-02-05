'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { questionBankService } from '@/lib/services/questionBankService';
import { allSampleQuestions, sampleMCQQuestions, sampleTrueFalseQuestions, sampleDescriptiveQuestions, sampleCodingQuestions } from '@/lib/data/sampleQuestions';

export default function SeedQuestionsPage() {
  const router = useRouter();
  const [currentCount, setCurrentCount] = useState(0);
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const questions = questionBankService.getAllQuestions();
    setCurrentCount(questions.length);
  }, []);

  const handleSeedAll = () => {
    setLoading(true);

    // Get existing questions to check for duplicates
    const existingQuestions = questionBankService.getAllQuestions();
    const existingIds = new Set(existingQuestions.map(q => q.id));

    // Add only questions that don't already exist
    let addedCount = 0;
    allSampleQuestions.forEach(question => {
      if (!existingIds.has(question.id)) {
        questionBankService.addQuestion(question);
        addedCount++;
      }
    });

    const newCount = questionBankService.getAllQuestions().length;
    setCurrentCount(newCount);
    setSeeded(true);
    setLoading(false);

    if (addedCount === 0) {
      alert('All sample questions are already in the question bank!');
    } else {
      alert(`Successfully added ${addedCount} new questions to the question bank!`);
    }
  };

  const handleClearAndSeed = () => {
    if (!confirm('This will DELETE all existing questions and add 40 sample questions. Are you sure?')) {
      return;
    }

    setLoading(true);

    // Clear all questions
    localStorage.setItem('question_bank', JSON.stringify([]));

    // Add all sample questions
    allSampleQuestions.forEach(question => {
      questionBankService.addQuestion(question);
    });

    const newCount = questionBankService.getAllQuestions().length;
    setCurrentCount(newCount);
    setSeeded(true);
    setLoading(false);
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Seed Sample Questions</h2>
              <p className="text-muted-foreground">Load 40 sample questions into the question bank</p>
            </div>
          </div>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Current Question Bank Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-lg">
                    Currently <strong>{currentCount}</strong> questions in the bank
                  </span>
                </div>

                {seeded && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-lg font-medium">
                      Questions seeded successfully!
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sample Questions Info */}
          <Card>
            <CardHeader>
              <CardTitle>Available Sample Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  This will add 40 high-quality sample questions to your question bank:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg mb-2">10 MCQ Questions</div>
                    <p className="text-sm text-muted-foreground">
                      Multiple choice questions covering JavaScript, HTTP, algorithms, SQL, OOP, CSS, REST APIs, data structures, databases, and Docker
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg mb-2">10 True/False Questions</div>
                    <p className="text-sm text-muted-foreground">
                      Questions about JavaScript, Python, HTTP, binary trees, security, Git, agile, CSS, hash tables, and microservices
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg mb-2">10 Descriptive Questions</div>
                    <p className="text-sm text-muted-foreground">
                      Essay-style questions on JavaScript concepts, React, SOLID principles, databases, authentication, closures, CAP theorem, TypeScript, APIs, and CI/CD
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg mb-2">10 Coding Questions</div>
                    <p className="text-sm text-muted-foreground">
                      Algorithm problems including Two Sum, String Reversal, Valid Parentheses, Fibonacci, Merge Lists, Maximum Subarray, Binary Search, Palindrome, Common Prefix, and Anagram
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm">
                    <strong>Note:</strong> All questions include proper metadata:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Difficulty levels (Easy, Medium, Hard)</li>
                      <li>Topics (Data Structures, Algorithms, Web Development, etc.)</li>
                      <li>Domains (Computer Science, Frontend, Backend, DevOps, etc.)</li>
                      <li>Timestamps (created/updated dates)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Seed Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Button
                    onClick={handleSeedAll}
                    disabled={loading}
                    className="w-full md:w-auto gap-2"
                    size="lg"
                  >
                    <Database className="w-5 h-5" />
                    {loading ? 'Seeding...' : 'Add 40 Sample Questions'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will add all sample questions to your existing question bank
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleClearAndSeed}
                    disabled={loading}
                    variant="destructive"
                    className="w-full md:w-auto gap-2"
                    size="lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {loading ? 'Processing...' : 'Clear All & Seed Fresh'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    ⚠️ This will DELETE all existing questions and add only the 40 sample questions
                  </p>
                </div>
              </div>

              {seeded && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => router.push('/admin/question-bank')}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    View Question Bank
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
