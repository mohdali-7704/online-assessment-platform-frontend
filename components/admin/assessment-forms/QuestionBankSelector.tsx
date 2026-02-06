import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Database, Search } from 'lucide-react';
import { Question, QuestionType, QuestionDifficulty } from '@/lib/types/question';
import { PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/lib/services/questionBankService';

interface QuestionBankSelectorProps {
  questionType: QuestionType;
  sectionName: string;
  bankQuestions: Question[];
  filteredQuestions: Question[];
  selectedQuestionIds: Set<string>;
  searchQuery: string;
  difficultyFilter: string;
  topicFilter: string;
  domainFilter: string;
  onSearchChange: (query: string) => void;
  onDifficultyFilterChange: (filter: string) => void;
  onTopicFilterChange: (filter: string) => void;
  onDomainFilterChange: (filter: string) => void;
  onQuestionToggle: (questionId: string) => void;
  onAddSelected: () => void;
  onCancel: () => void;
}

export default function QuestionBankSelector({
  questionType,
  sectionName,
  bankQuestions,
  filteredQuestions,
  selectedQuestionIds,
  searchQuery,
  difficultyFilter,
  topicFilter,
  domainFilter,
  onSearchChange,
  onDifficultyFilterChange,
  onTopicFilterChange,
  onDomainFilterChange,
  onQuestionToggle,
  onAddSelected,
  onCancel
}: QuestionBankSelectorProps) {
  const getQuestionTypeLabel = () => {
    switch (questionType) {
      case QuestionType.MCQ: return 'MCQ';
      case QuestionType.TRUE_FALSE: return 'True/False';
      case QuestionType.DESCRIPTIVE: return 'Descriptive';
      case QuestionType.CODING: return 'Coding';
      default: return questionType;
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

  // Get unique topics and domains
  const availableTopics = Array.from(new Set([
    ...PREDEFINED_TOPICS,
    ...bankQuestions.map(q => q.metadata?.topic).filter(Boolean) as string[]
  ])).sort();

  const availableDomains = Array.from(new Set([
    ...PREDEFINED_DOMAINS,
    ...bankQuestions.map(q => q.metadata?.domain).filter(Boolean) as string[]
  ])).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Select {getQuestionTypeLabel()} Questions for {sectionName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="bank-search">Search by Question Title</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="bank-search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search questions..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty Filter */}
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficultyFilter} onValueChange={onDifficultyFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
                <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic Filter */}
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select value={topicFilter} onValueChange={onTopicFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {availableTopics.map(topic => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain Filter */}
          <div className="space-y-2">
            <Label>Domain</Label>
            <Select value={domainFilter} onValueChange={onDomainFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {availableDomains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredQuestions.length} of {bankQuestions.length} {getQuestionTypeLabel()} questions • {selectedQuestionIds.size} selected
        </div>

        {/* Questions List */}
        <div className="border rounded-lg max-h-[400px] overflow-y-auto">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {bankQuestions.length === 0
                ? `No ${getQuestionTypeLabel()} questions in the bank yet.`
                : 'No questions match your filters.'}
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedQuestionIds.has(question.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onQuestionToggle(question.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedQuestionIds.has(question.id)}
                      onCheckedChange={() => onQuestionToggle(question.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 space-y-2">
                      {/* Question Text */}
                      <div className="font-medium">
                        {question.text}
                      </div>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={onAddSelected}
            disabled={selectedQuestionIds.size === 0}
            className="flex-1"
          >
            Add Selected ({selectedQuestionIds.size})
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
