import { Question, QuestionType, QuestionDifficulty, MCQQuestion, TrueFalseQuestion, DescriptiveQuestion, CodingQuestion } from '@/lib/types/question';

// MCQ Questions
export const sampleMCQQuestions: MCQQuestion[] = [
  {
    id: 'mcq1',
    type: QuestionType.MCQ,
    text: 'What is the output of console.log(typeof null) in JavaScript?',
    points: 5,
    options: [
      { id: 'a', text: 'null' },
      { id: 'b', text: 'object' },
      { id: 'c', text: 'undefined' },
      { id: 'd', text: 'number' }
    ],
    correctAnswers: ['b'],
    multipleAnswers: false,
    metadata: {
      topic: 'Data Structures',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq2',
    type: QuestionType.MCQ,
    text: 'Which of the following are valid HTTP methods? (Select all that apply)',
    points: 10,
    options: [
      { id: 'a', text: 'GET' },
      { id: 'b', text: 'POST' },
      { id: 'c', text: 'RETRIEVE' },
      { id: 'd', text: 'DELETE' },
      { id: 'e', text: 'PATCH' }
    ],
    correctAnswers: ['a', 'b', 'd', 'e'],
    multipleAnswers: true,
    metadata: {
      topic: 'Web Development',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq3',
    type: QuestionType.MCQ,
    text: 'What is the time complexity of binary search?',
    points: 5,
    options: [
      { id: 'a', text: 'O(n)' },
      { id: 'b', text: 'O(log n)' },
      { id: 'c', text: 'O(n log n)' },
      { id: 'd', text: 'O(n²)' }
    ],
    correctAnswers: ['b'],
    multipleAnswers: false,
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq4',
    type: QuestionType.MCQ,
    text: 'Which SQL statement is used to extract data from a database?',
    points: 5,
    options: [
      { id: 'a', text: 'EXTRACT' },
      { id: 'b', text: 'GET' },
      { id: 'c', text: 'SELECT' },
      { id: 'd', text: 'FETCH' }
    ],
    correctAnswers: ['c'],
    multipleAnswers: false,
    metadata: {
      topic: 'Databases',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq5',
    type: QuestionType.MCQ,
    text: 'Which of the following are principles of Object-Oriented Programming?',
    points: 10,
    options: [
      { id: 'a', text: 'Encapsulation' },
      { id: 'b', text: 'Recursion' },
      { id: 'c', text: 'Inheritance' },
      { id: 'd', text: 'Polymorphism' },
      { id: 'e', text: 'Iteration' }
    ],
    correctAnswers: ['a', 'c', 'd'],
    multipleAnswers: true,
    metadata: {
      topic: 'Object-Oriented Programming',
      domain: 'Software Engineering',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq6',
    type: QuestionType.MCQ,
    text: 'What does CSS stand for?',
    points: 5,
    options: [
      { id: 'a', text: 'Computer Style Sheets' },
      { id: 'b', text: 'Cascading Style Sheets' },
      { id: 'c', text: 'Creative Style System' },
      { id: 'd', text: 'Colorful Style Sheets' }
    ],
    correctAnswers: ['b'],
    multipleAnswers: false,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq7',
    type: QuestionType.MCQ,
    text: 'In a RESTful API, which HTTP status code indicates a successful creation of a resource?',
    points: 5,
    options: [
      { id: 'a', text: '200 OK' },
      { id: 'b', text: '201 Created' },
      { id: 'c', text: '204 No Content' },
      { id: 'd', text: '202 Accepted' }
    ],
    correctAnswers: ['b'],
    multipleAnswers: false,
    metadata: {
      topic: 'Web Development',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq8',
    type: QuestionType.MCQ,
    text: 'Which data structure uses LIFO (Last In First Out) principle?',
    points: 5,
    options: [
      { id: 'a', text: 'Queue' },
      { id: 'b', text: 'Stack' },
      { id: 'c', text: 'Array' },
      { id: 'd', text: 'Linked List' }
    ],
    correctAnswers: ['b'],
    multipleAnswers: false,
    metadata: {
      topic: 'Data Structures',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq9',
    type: QuestionType.MCQ,
    text: 'Which of the following are NoSQL databases?',
    points: 10,
    options: [
      { id: 'a', text: 'MongoDB' },
      { id: 'b', text: 'PostgreSQL' },
      { id: 'c', text: 'Redis' },
      { id: 'd', text: 'MySQL' },
      { id: 'e', text: 'Cassandra' }
    ],
    correctAnswers: ['a', 'c', 'e'],
    multipleAnswers: true,
    metadata: {
      topic: 'Databases',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'mcq10',
    type: QuestionType.MCQ,
    text: 'What is the main purpose of Docker in software development?',
    points: 5,
    options: [
      { id: 'a', text: 'Version control' },
      { id: 'b', text: 'Containerization' },
      { id: 'c', text: 'Code compilation' },
      { id: 'd', text: 'Database management' }
    ],
    correctAnswers: ['b'],
    multipleAnswers: false,
    metadata: {
      topic: 'System Design',
      domain: 'DevOps',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

// True/False Questions
export const sampleTrueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: 'tf1',
    type: QuestionType.TRUE_FALSE,
    text: 'JavaScript is a statically typed language.',
    points: 5,
    correctAnswer: false,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf2',
    type: QuestionType.TRUE_FALSE,
    text: 'In Python, lists are immutable.',
    points: 5,
    correctAnswer: false,
    metadata: {
      topic: 'Data Structures',
      domain: 'Software Engineering',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf3',
    type: QuestionType.TRUE_FALSE,
    text: 'HTTP is a stateless protocol.',
    points: 5,
    correctAnswer: true,
    metadata: {
      topic: 'Networking',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf4',
    type: QuestionType.TRUE_FALSE,
    text: 'A binary tree with n nodes has exactly n-1 edges.',
    points: 5,
    correctAnswer: true,
    metadata: {
      topic: 'Data Structures',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf5',
    type: QuestionType.TRUE_FALSE,
    text: 'SQL injection is a type of security vulnerability.',
    points: 5,
    correctAnswer: true,
    metadata: {
      topic: 'Security',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf6',
    type: QuestionType.TRUE_FALSE,
    text: 'Git and GitHub are the same thing.',
    points: 5,
    correctAnswer: false,
    metadata: {
      topic: 'Web Development',
      domain: 'DevOps',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf7',
    type: QuestionType.TRUE_FALSE,
    text: 'In agile methodology, a sprint typically lasts 2-4 weeks.',
    points: 5,
    correctAnswer: true,
    metadata: {
      topic: 'System Design',
      domain: 'Software Engineering',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf8',
    type: QuestionType.TRUE_FALSE,
    text: 'CSS Grid and Flexbox cannot be used together in the same layout.',
    points: 5,
    correctAnswer: false,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf9',
    type: QuestionType.TRUE_FALSE,
    text: 'A hash table provides O(1) average time complexity for search operations.',
    points: 5,
    correctAnswer: true,
    metadata: {
      topic: 'Data Structures',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'tf10',
    type: QuestionType.TRUE_FALSE,
    text: 'Microservices architecture requires all services to use the same database.',
    points: 5,
    correctAnswer: false,
    metadata: {
      topic: 'System Design',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.HARD,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

// Descriptive Questions
export const sampleDescriptiveQuestions: DescriptiveQuestion[] = [
  {
    id: 'desc1',
    type: QuestionType.DESCRIPTIVE,
    text: 'Explain the difference between let, const, and var in JavaScript.',
    points: 15,
    maxLength: 500,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc2',
    type: QuestionType.DESCRIPTIVE,
    text: 'What is the Virtual DOM in React and how does it improve performance?',
    points: 20,
    maxLength: 600,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc3',
    type: QuestionType.DESCRIPTIVE,
    text: 'Describe the SOLID principles in object-oriented programming.',
    points: 25,
    maxLength: 800,
    metadata: {
      topic: 'Object-Oriented Programming',
      domain: 'Software Engineering',
      difficulty: QuestionDifficulty.HARD,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc4',
    type: QuestionType.DESCRIPTIVE,
    text: 'Explain the concept of database normalization and its benefits.',
    points: 20,
    maxLength: 600,
    metadata: {
      topic: 'Databases',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc5',
    type: QuestionType.DESCRIPTIVE,
    text: 'What is the difference between authentication and authorization?',
    points: 15,
    maxLength: 400,
    metadata: {
      topic: 'Security',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc6',
    type: QuestionType.DESCRIPTIVE,
    text: 'Explain the concept of closures in JavaScript with an example.',
    points: 20,
    maxLength: 500,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc7',
    type: QuestionType.DESCRIPTIVE,
    text: 'Describe the CAP theorem and its implications for distributed systems.',
    points: 25,
    maxLength: 700,
    metadata: {
      topic: 'System Design',
      domain: 'Cloud Computing',
      difficulty: QuestionDifficulty.HARD,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc8',
    type: QuestionType.DESCRIPTIVE,
    text: 'What are the advantages of using TypeScript over JavaScript?',
    points: 15,
    maxLength: 500,
    metadata: {
      topic: 'Web Development',
      domain: 'Frontend Development',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc9',
    type: QuestionType.DESCRIPTIVE,
    text: 'Explain the difference between REST and GraphQL APIs.',
    points: 20,
    maxLength: 600,
    metadata: {
      topic: 'Web Development',
      domain: 'Backend Development',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'desc10',
    type: QuestionType.DESCRIPTIVE,
    text: 'What is continuous integration/continuous deployment (CI/CD) and why is it important?',
    points: 20,
    maxLength: 600,
    metadata: {
      topic: 'System Design',
      domain: 'DevOps',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

// Coding Questions
export const sampleCodingQuestions: CodingQuestion[] = [
  {
    id: 'code1',
    type: QuestionType.CODING,
    text: 'Two Sum',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    points: 25,
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
      python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
      { id: 't2', input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
      { id: 't3', input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code2',
    type: QuestionType.CODING,
    text: 'Reverse String',
    problemStatement: 'Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.',
    points: 20,
    starterCode: {
      javascript: 'function reverseString(s) {\n  // Write your code here\n  \n}',
      python: 'def reverse_string(s):\n    # Write your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\n\nvoid reverseString(vector<char>& s) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { id: 't2', input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Data Structures',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code3',
    type: QuestionType.CODING,
    text: 'Valid Parentheses',
    problemStatement: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
    points: 25,
    starterCode: {
      javascript: 'function isValid(s) {\n  // Write your code here\n  \n}',
      python: 'def is_valid(s):\n    # Write your code here\n    pass',
      cpp: '#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '"()"', expectedOutput: 'true', isHidden: false },
      { id: 't2', input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { id: 't3', input: '"(]"', expectedOutput: 'false', isHidden: false },
      { id: 't4', input: '"([)]"', expectedOutput: 'false', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Data Structures',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code4',
    type: QuestionType.CODING,
    text: 'Fibonacci Number',
    problemStatement: 'The Fibonacci numbers form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    points: 20,
    starterCode: {
      javascript: 'function fib(n) {\n  // Write your code here\n  \n}',
      python: 'def fib(n):\n    # Write your code here\n    pass',
      cpp: 'int fib(int n) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public int fib(int n) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '2', expectedOutput: '1', isHidden: false },
      { id: 't2', input: '3', expectedOutput: '2', isHidden: false },
      { id: 't3', input: '4', expectedOutput: '3', isHidden: false },
      { id: 't4', input: '10', expectedOutput: '55', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code5',
    type: QuestionType.CODING,
    text: 'Merge Two Sorted Lists',
    problemStatement: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    points: 30,
    starterCode: {
      javascript: 'function mergeTwoLists(list1, list2) {\n  // Write your code here\n  \n}',
      python: 'def merge_two_lists(list1, list2):\n    # Write your code here\n    pass',
      cpp: 'struct ListNode {\n    int val;\n    ListNode *next;\n};\n\nListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]', isHidden: false },
      { id: 't2', input: '[], []', expectedOutput: '[]', isHidden: false },
      { id: 't3', input: '[], [0]', expectedOutput: '[0]', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Data Structures',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code6',
    type: QuestionType.CODING,
    text: 'Maximum Subarray',
    problemStatement: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    points: 30,
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  // Write your code here\n  \n}',
      python: 'def max_sub_array(nums):\n    # Write your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { id: 't2', input: '[1]', expectedOutput: '1', isHidden: false },
      { id: 't3', input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code7',
    type: QuestionType.CODING,
    text: 'Binary Search',
    problemStatement: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    points: 25,
    starterCode: {
      javascript: 'function search(nums, target) {\n  // Write your code here\n  \n}',
      python: 'def search(nums, target):\n    # Write your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '[-1,0,3,5,9,12], 9', expectedOutput: '4', isHidden: false },
      { id: 't2', input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1', isHidden: false },
      { id: 't3', input: '[5], 5', expectedOutput: '0', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code8',
    type: QuestionType.CODING,
    text: 'Palindrome Number',
    problemStatement: 'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.',
    points: 20,
    starterCode: {
      javascript: 'function isPalindrome(x) {\n  // Write your code here\n  \n}',
      python: 'def is_palindrome(x):\n    # Write your code here\n    pass',
      cpp: 'bool isPalindrome(int x) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public boolean isPalindrome(int x) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '121', expectedOutput: 'true', isHidden: false },
      { id: 't2', input: '-121', expectedOutput: 'false', isHidden: false },
      { id: 't3', input: '10', expectedOutput: 'false', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code9',
    type: QuestionType.CODING,
    text: 'Longest Common Prefix',
    problemStatement: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    points: 25,
    starterCode: {
      javascript: 'function longestCommonPrefix(strs) {\n  // Write your code here\n  \n}',
      python: 'def longest_common_prefix(strs):\n    # Write your code here\n    pass',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nstring longestCommonPrefix(vector<string>& strs) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '["flower","flow","flight"]', expectedOutput: '"fl"', isHidden: false },
      { id: 't2', input: '["dog","racecar","car"]', expectedOutput: '""', isHidden: false },
      { id: 't3', input: '["ab","a"]', expectedOutput: '"a"', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'code10',
    type: QuestionType.CODING,
    text: 'Valid Anagram',
    problemStatement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    points: 20,
    starterCode: {
      javascript: 'function isAnagram(s, t) {\n  // Write your code here\n  \n}',
      python: 'def is_anagram(s, t):\n    # Write your code here\n    pass',
      cpp: '#include <string>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    // Write your code here\n    \n}',
      java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        \n    }\n}'
    },
    testCases: [
      { id: 't1', input: '"anagram", "nagaram"', expectedOutput: 'true', isHidden: false },
      { id: 't2', input: '"rat", "car"', expectedOutput: 'false', isHidden: false },
      { id: 't3', input: '"a", "ab"', expectedOutput: 'false', isHidden: true }
    ],
    allowedLanguages: ['javascript', 'python', 'cpp', 'java'],
    metadata: {
      topic: 'Algorithms',
      domain: 'Computer Science',
      difficulty: QuestionDifficulty.EASY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

// Export all sample questions
export const allSampleQuestions: Question[] = [
  ...sampleMCQQuestions,
  ...sampleTrueFalseQuestions,
  ...sampleDescriptiveQuestions,
  ...sampleCodingQuestions
];
