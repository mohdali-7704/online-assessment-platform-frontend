'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/auth/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Filter, Loader2 } from 'lucide-react';
import { Question, QuestionType, QuestionDifficulty } from '@/lib/types/question';
import { questionBankService, PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/lib/services/questionBankService';

export default function QuestionBankPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Load questions
  useEffect(() => {
    loadQuestions();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [questions, searchQuery, difficultyFilter, topicFilter, domainFilter, typeFilter]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const allQuestions = await questionBankService.getAllQuestions();
      setQuestions(allQuestions);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load questions');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q =>
        q.text.toLowerCase().includes(query)
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q =>
        q.metadata?.difficulty === difficultyFilter
      );
    }

    // Topic filter
    if (topicFilter !== 'all') {
      filtered = filtered.filter(q =>
        q.metadata?.topic === topicFilter
      );
    }

    // Domain filter
    if (domainFilter !== 'all') {
      filtered = filtered.filter(q =>
        q.metadata?.domain === domainFilter
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(q => q.type === typeFilter);
    }

    setFilteredQuestions(filtered);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await questionBankService.deleteQuestion(id);
        await loadQuestions();
        alert('Question deleted successfully!');
      } catch (err: any) {
        alert(`Failed to delete question: ${err.response?.data?.detail || err.message}`);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/question-bank/edit/${id}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setDomainFilter('all');
    setTypeFilter('all');
  };



  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MCQ:
        return 'MCQ';
      case QuestionType.TRUE_FALSE:
        return 'True/False';
      case QuestionType.DESCRIPTIVE:
        return 'Descriptive';
      case QuestionType.CODING:
        return 'Coding';
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty?: QuestionDifficulty) => {
    switch (difficulty) {
      case QuestionDifficulty.EASY:
        return 'bg-green-100 text-green-800';
      case QuestionDifficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case QuestionDifficulty.HARD:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique topics and domains from questions
  const availableTopics = Array.from(new Set([
    ...PREDEFINED_TOPICS,
    ...questions.map(q => q.metadata?.topic).filter(Boolean) as string[]
  ])).sort();

  const availableDomains = Array.from(new Set([
    ...PREDEFINED_DOMAINS,
    ...questions.map(q => q.metadata?.domain).filter(Boolean) as string[]
  ])).sort();

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Question Bank</h2>
              <p className="text-muted-foreground">Manage your question library</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/admin/question-bank/add')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search by Question Title</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                      <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Filter */}
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {availableTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Domain Filter */}
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select value={domainFilter} onValueChange={setDomainFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      {availableDomains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Type Filter */}
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={QuestionType.MCQ}>MCQ</SelectItem>
                      <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                      <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
                      <SelectItem value={QuestionType.CODING}>Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || difficultyFilter !== 'all' || topicFilter !== 'all' ||
                domainFilter !== 'all' || typeFilter !== 'all') && (
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Clear Filters
                  </Button>
                )}

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredQuestions.length} of {questions.length} questions
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  {questions.length === 0 ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-lg">
                        No questions in the bank yet.
                      </p>
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                          Get started quickly with 40 sample questions or add your own
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => router.push('/admin/question-bank/add')}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Your First Question
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No questions match your filters.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Question Text */}
                          <div className="font-medium">
                            {question.text}
                          </div>

                          {/* Metadata Badges */}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge variant="outline">
                              {question.points} points
                            </Badge>
                            {question.metadata?.difficulty && (
                              <Badge className={getDifficultyColor(question.metadata.difficulty)}>
                                {question.metadata.difficulty}
                              </Badge>
                            )}
                            {question.metadata?.topic && (
                              <Badge variant="secondary">
                                {question.metadata.topic}
                              </Badge>
                            )}
                            {question.metadata?.domain && (
                              <Badge variant="secondary">
                                {question.metadata.domain}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(question.id)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                            className="text-destructive gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
