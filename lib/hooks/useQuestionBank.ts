import { useState, useEffect } from 'react';
import { Question, QuestionType } from '@/lib/types/question';
import { questionBankService } from '@/lib/services/questionBankService';

export function useQuestionBank(questionType?: QuestionType) {
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [filteredBankQuestions, setFilteredBankQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  const loadQuestions = (type?: QuestionType) => {
    const allQuestions = questionBankService.getAllQuestions();
    // Filter by type if provided
    const filtered = type
      ? allQuestions.filter(q => q.type === type)
      : allQuestions;
    setBankQuestions(filtered);
    setFilteredBankQuestions(filtered);
  };

  const applyFilters = () => {
    let filtered = [...bankQuestions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => q.text.toLowerCase().includes(query));
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => q.metadata?.difficulty === difficultyFilter);
    }

    if (topicFilter !== 'all') {
      filtered = filtered.filter(q => q.metadata?.topic === topicFilter);
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(q => q.metadata?.domain === domainFilter);
    }

    setFilteredBankQuestions(filtered);
  };

  const toggleQuestionSelection = (questionId: string) => {
    const newSelection = new Set(selectedQuestionIds);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestionIds(newSelection);
  };

  const getSelectedQuestions = (): Question[] => {
    return bankQuestions.filter(q => selectedQuestionIds.has(q.id)).map(q => ({
      ...q,
      id: `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setDomainFilter('all');
    setSelectedQuestionIds(new Set());
  };

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, difficultyFilter, topicFilter, domainFilter, bankQuestions]);

  return {
    bankQuestions,
    filteredBankQuestions,
    selectedQuestionIds,
    searchQuery,
    setSearchQuery,
    difficultyFilter,
    setDifficultyFilter,
    topicFilter,
    setTopicFilter,
    domainFilter,
    setDomainFilter,
    loadQuestions,
    toggleQuestionSelection,
    getSelectedQuestions,
    resetFilters
  };
}
