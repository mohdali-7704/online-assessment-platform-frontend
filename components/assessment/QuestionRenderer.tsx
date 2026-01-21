'use client';

import { Question, QuestionType, Answer, MCQAnswer, TrueFalseAnswer, DescriptiveAnswer, CodingAnswer } from '@/lib/types/question';
import MCQQuestion from './MCQQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import DescriptiveQuestion from './DescriptiveQuestion';
import CodingQuestion from './CodingQuestion';

interface QuestionRendererProps {
  question: Question;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
  assessmentId: string;
}

export default function QuestionRenderer({ question, answer, onChange, assessmentId }: QuestionRendererProps) {
  switch (question.type) {
    case QuestionType.MCQ:
      return (
        <MCQQuestion
          question={question}
          answer={(answer as MCQAnswer) || []}
          onChange={onChange}
        />
      );

    case QuestionType.TRUE_FALSE:
      return (
        <TrueFalseQuestion
          question={question}
          answer={answer as TrueFalseAnswer | undefined}
          onChange={onChange}
        />
      );

    case QuestionType.DESCRIPTIVE:
      return (
        <DescriptiveQuestion
          question={question}
          answer={(answer as DescriptiveAnswer) || ''}
          onChange={onChange}
        />
      );

    case QuestionType.CODING:
      return (
        <CodingQuestion
          question={question}
          answer={(answer as CodingAnswer) || { code: question.starterCode[question.allowedLanguages[0]] || '', language: question.allowedLanguages[0] }}
          onChange={onChange}
          assessmentId={assessmentId}
        />
      );

    default:
      return <div>Unknown question type</div>;
  }
}
