# API Integration Guide

This document explains how to use the backend API services in the frontend application.

## Overview

The frontend provides two main service modules:
- **Question Bank Service** - For managing questions
- **Assessment Service** - For managing assessments

## Quick Start

```typescript
import { questionBankService, assessmentService } from '@/app/services';
```

## Question Bank Service

### Get All Questions

```typescript
import { questionBankService } from '@/app/services';

// Fetch all questions
const questions = await questionBankService.getAllQuestions();
console.log(questions);
```

### Get Question by ID

```typescript
const question = await questionBankService.getQuestionById('question-id-123');
if (question) {
  console.log('Found:', question);
} else {
  console.log('Question not found');
}
```

### Create MCQ Question

```typescript
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { MCQQuestion } from '@/lib/types/question';

const mcqQuestion: MCQQuestion = {
  id: '', // Backend will generate
  type: QuestionType.MCQ,
  text: 'What is JavaScript?',
  points: 10,
  options: [
    { id: 'a', text: 'A programming language' },
    { id: 'b', text: 'A coffee brand' },
    { id: 'c', text: 'A framework' },
    { id: 'd', text: 'A library' }
  ],
  correctAnswers: ['a'],
  multipleAnswers: false,
  metadata: {
    topic: 'JavaScript',
    domain: 'Web Development',
    difficulty: QuestionDifficulty.EASY
  }
};

const createdQuestion = await questionBankService.addQuestion(mcqQuestion);
console.log('Created:', createdQuestion);
```

### Create True/False Question

```typescript
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { TrueFalseQuestion } from '@/lib/types/question';

const tfQuestion: TrueFalseQuestion = {
  id: '',
  type: QuestionType.TRUE_FALSE,
  text: 'JavaScript is a compiled language',
  points: 5,
  correctAnswer: false,
  metadata: {
    topic: 'JavaScript',
    domain: 'Web Development',
    difficulty: QuestionDifficulty.EASY
  }
};

const createdQuestion = await questionBankService.addQuestion(tfQuestion);
```

### Create Descriptive Question

```typescript
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { DescriptiveQuestion } from '@/lib/types/question';

const descriptiveQuestion: DescriptiveQuestion = {
  id: '',
  type: QuestionType.DESCRIPTIVE,
  text: 'Explain how closures work in JavaScript',
  points: 15,
  maxLength: 500,
  metadata: {
    topic: 'JavaScript',
    domain: 'Web Development',
    difficulty: QuestionDifficulty.MEDIUM
  }
};

const createdQuestion = await questionBankService.addQuestion(descriptiveQuestion);
```

### Create Coding Question

```typescript
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { CodingQuestion } from '@/lib/types/question';

const codingQuestion: CodingQuestion = {
  id: '',
  type: QuestionType.CODING,
  text: 'Implement FizzBuzz',
  problemStatement: 'Write a function that prints numbers from 1 to n. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".',
  points: 25,
  starterCode: {
    javascript: 'function fizzBuzz(n) {\n  // Your code here\n}',
    python: 'def fizz_buzz(n):\n    # Your code here\n    pass'
  },
  testCases: [
    {
      id: 't1',
      input: '15',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
      isHidden: false
    }
  ],
  allowedLanguages: ['javascript', 'python', 'java', 'cpp'],
  metadata: {
    topic: 'Algorithms',
    domain: 'Computer Science',
    difficulty: QuestionDifficulty.MEDIUM
  }
};

const createdQuestion = await questionBankService.addQuestion(codingQuestion);
```

### Update Question

```typescript
// Get existing question
const question = await questionBankService.getQuestionById('question-id-123');

if (question) {
  // Modify it
  question.text = 'Updated question text';
  question.points = 15;

  // Update in backend
  const updatedQuestion = await questionBankService.updateQuestion(question.id, question);
  console.log('Updated:', updatedQuestion);
}
```

### Delete Question

```typescript
await questionBankService.deleteQuestion('question-id-123');
console.log('Question deleted successfully');
```

## Assessment Service

### Get All Assessments

```typescript
import { assessmentService } from '@/app/services';

const assessments = await assessmentService.getAllAssessments();
console.log(assessments);
```

### Get Assessment by ID

```typescript
const assessment = await assessmentService.getAssessmentById('assessment-id-123');
if (assessment) {
  console.log('Found:', assessment);
}
```

### Create Assessment

```typescript
import { assessmentService } from '@/app/services';
import type { AssessmentCreatePayload } from '@/app/services';

const payload: AssessmentCreatePayload = {
  title: 'JavaScript Fundamentals Test',
  description: 'Test your knowledge of JavaScript basics',
  sections: [
    {
      name: 'Multiple Choice Questions',
      duration: 15,
      questionType: 'mcq',
      questions: []
    },
    {
      name: 'Coding Challenges',
      duration: 30,
      questionType: 'coding',
      questions: []
    }
  ]
};

const createdAssessment = await assessmentService.createAssessment(payload);
console.log('Created:', createdAssessment);
```

### Delete Assessment

```typescript
await assessmentService.deleteAssessment('assessment-id-123');
console.log('Assessment deleted successfully');
```

## Error Handling

All service methods throw errors that should be caught and handled:

```typescript
try {
  const questions = await questionBankService.getAllQuestions();
  console.log('Success:', questions);
} catch (error: any) {
  console.error('Error:', error);

  // Check for specific error types
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);

    if (error.response.status === 404) {
      console.error('Resource not found');
    } else if (error.response.status === 400) {
      console.error('Bad request:', error.response.data.detail);
    }
  } else if (error.request) {
    // Request made but no response
    console.error('Network error - no response from server');
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
}
```

## React Component Examples

### Fetching Questions in a Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { questionBankService } from '@/app/services';
import type { Question } from '@/lib/types/question';

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionBankService.getAllQuestions();
      setQuestions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map(q => (
          <li key={q.id}>{q.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Creating a Question

```typescript
'use client';

import { useState } from 'react';
import { questionBankService } from '@/app/services';
import { QuestionType, QuestionDifficulty } from '@/lib/types/question';
import type { MCQQuestion } from '@/lib/types/question';

export default function CreateQuestion() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const newQuestion: MCQQuestion = {
        id: '',
        type: QuestionType.MCQ,
        text: 'Sample question?',
        points: 10,
        options: [
          { id: 'a', text: 'Option A' },
          { id: 'b', text: 'Option B' }
        ],
        correctAnswers: ['a'],
        multipleAnswers: false,
        metadata: {
          topic: 'Sample',
          domain: 'Test',
          difficulty: QuestionDifficulty.EASY
        }
      };

      const created = await questionBankService.addQuestion(newQuestion);
      alert('Question created: ' + created.id);
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={saving}>
      {saving ? 'Creating...' : 'Create Question'}
    </button>
  );
}
```

## Important Notes

### Question Data Type Discriminator

The backend uses a discriminated union for `question_data`. You must include the `type` field:
- MCQ: `type: "mcq"`
- True/False: `type: "true_false"`
- Descriptive: `type: "descriptive"`
- Coding: `type: "coding"`

**The service handles this automatically** - you don't need to add it manually when using the services.

### API URL Configuration

The API base URL is configured in `app/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
```

To change it, set the `NEXT_PUBLIC_BACKEND_API_URL` environment variable in `.env.local`:
```
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-api.com
```

### Authentication

The API client automatically includes auth tokens from localStorage:
```typescript
const token = localStorage.getItem('auth_token');
// Token is automatically added to all requests
```

## Predefined Categories

The question bank service exports predefined topics and domains:

```typescript
import { PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/app/services';

console.log(PREDEFINED_TOPICS);
// ['Data Structures', 'Algorithms', 'Web Development', ...]

console.log(PREDEFINED_DOMAINS);
// ['Computer Science', 'Software Engineering', 'DevOps', ...]
```

## TypeScript Types

All TypeScript types are available from the types module:

```typescript
import {
  Question,
  MCQQuestion,
  TrueFalseQuestion,
  DescriptiveQuestion,
  CodingQuestion,
  QuestionType,
  QuestionDifficulty,
  MCQOption,
  TestCase
} from '@/lib/types/question';
```
