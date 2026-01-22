/**
 * Normalized Mock Data
 * PostgreSQL-ready structure with proper relationships
 */

import type { NormalizedDataStore } from '@/lib/types/normalized-types';

export const normalizedMockData: NormalizedDataStore = {
  // ==================== Assessments ====================
  assessments: [
    {
      id: '1',
      title: 'JavaScript Fundamentals Assessment',
      description: 'Test your knowledge of core JavaScript concepts including data types, functions, and problem-solving skills.',
      duration: 45,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      description: 'Advanced assessment covering arrays, strings, and algorithmic thinking.',
      duration: 60,
      createdAt: '2024-01-16T10:00:00Z',
    },
    {
      id: '3',
      title: 'Python Basics Quiz',
      description: 'Quick assessment on Python fundamentals, syntax, and basic programming concepts.',
      duration: 30,
      createdAt: '2024-01-17T10:00:00Z',
    },
  ],

  // ==================== Question Bank ====================
  questions: [
    // Assessment 1 Questions
    { id: 'q1', type: 'mcq', title: 'Which of the following is NOT a JavaScript data type?', points: 10, createdAt: '2024-01-15T09:00:00Z' },
    { id: 'q2', type: 'mcq', title: 'Which of the following are valid ways to declare a variable in JavaScript? (Select all that apply)', points: 15, createdAt: '2024-01-15T09:05:00Z' },
    { id: 'q3', type: 'true_false', title: 'JavaScript is a statically typed language.', points: 5, createdAt: '2024-01-15T09:10:00Z' },
    { id: 'q4', type: 'true_false', title: 'The === operator checks both value and type in JavaScript.', points: 5, createdAt: '2024-01-15T09:15:00Z' },
    { id: 'q5', type: 'descriptive', title: 'Explain the difference between "null" and "undefined" in JavaScript.', points: 15, createdAt: '2024-01-15T09:20:00Z' },
    { id: 'q6', type: 'coding', title: 'Array Sum', points: 25, createdAt: '2024-01-15T09:25:00Z' },
    { id: 'q7', type: 'coding', title: 'Palindrome Checker', points: 25, createdAt: '2024-01-15T09:30:00Z' },

    // Assessment 2 Questions
    { id: 'q8', type: 'mcq', title: 'What is the time complexity of accessing an element in an array by index?', points: 10, createdAt: '2024-01-16T09:00:00Z' },
    { id: 'q9', type: 'mcq', title: 'Which data structures use LIFO (Last In First Out) principle? (Select all that apply)', points: 10, createdAt: '2024-01-16T09:05:00Z' },
    { id: 'q10', type: 'true_false', title: 'A binary search algorithm requires the input array to be sorted.', points: 10, createdAt: '2024-01-16T09:10:00Z' },
    { id: 'q11', type: 'descriptive', title: 'Explain the difference between BFS (Breadth-First Search) and DFS (Depth-First Search) graph traversal algorithms.', points: 20, createdAt: '2024-01-16T09:15:00Z' },
    { id: 'q12', type: 'coding', title: 'Two Sum Problem', points: 50, createdAt: '2024-01-16T09:20:00Z' },
    { id: 'q13', type: 'coding', title: 'Reverse a String', points: 50, createdAt: '2024-01-16T09:25:00Z' },

    // Assessment 3 Questions
    { id: 'q14', type: 'mcq', title: 'Which of the following is the correct way to create a list in Python?', points: 10, createdAt: '2024-01-17T09:00:00Z' },
    { id: 'q15', type: 'true_false', title: 'Python is an interpreted language.', points: 5, createdAt: '2024-01-17T09:05:00Z' },
    { id: 'q16', type: 'true_false', title: 'In Python, indentation is optional and only used for readability.', points: 5, createdAt: '2024-01-17T09:10:00Z' },
    { id: 'q17', type: 'descriptive', title: 'What are list comprehensions in Python? Provide an example.', points: 20, createdAt: '2024-01-17T09:15:00Z' },
    { id: 'q18', type: 'coding', title: 'FizzBuzz', points: 40, createdAt: '2024-01-17T09:20:00Z' },
  ],

  // ==================== Assessment-Question Associations ====================
  assessmentQuestions: [
    // Assessment 1
    { assessmentId: '1', questionId: 'q1', displayOrder: 1 },
    { assessmentId: '1', questionId: 'q2', displayOrder: 2 },
    { assessmentId: '1', questionId: 'q3', displayOrder: 3 },
    { assessmentId: '1', questionId: 'q4', displayOrder: 4 },
    { assessmentId: '1', questionId: 'q5', displayOrder: 5 },
    { assessmentId: '1', questionId: 'q6', displayOrder: 6 },
    { assessmentId: '1', questionId: 'q7', displayOrder: 7 },

    // Assessment 2
    { assessmentId: '2', questionId: 'q8', displayOrder: 1 },
    { assessmentId: '2', questionId: 'q9', displayOrder: 2 },
    { assessmentId: '2', questionId: 'q10', displayOrder: 3 },
    { assessmentId: '2', questionId: 'q11', displayOrder: 4 },
    { assessmentId: '2', questionId: 'q12', displayOrder: 5 },
    { assessmentId: '2', questionId: 'q13', displayOrder: 6 },

    // Assessment 3
    { assessmentId: '3', questionId: 'q14', displayOrder: 1 },
    { assessmentId: '3', questionId: 'q15', displayOrder: 2 },
    { assessmentId: '3', questionId: 'q16', displayOrder: 3 },
    { assessmentId: '3', questionId: 'q17', displayOrder: 4 },
    { assessmentId: '3', questionId: 'q18', displayOrder: 5 },
  ],

  // ==================== Coding Problems ====================
  codingProblems: [
    {
      questionId: 'q6',
      problemStatement: `Write a function that takes an array of numbers and returns their sum.

**Example:**
Input: [1, 2, 3, 4, 5]
Output: 15

**Constraints:**
- The array will contain at least 1 element
- All elements will be integers`,
      primaryLanguage: 'javascript',
    },
    {
      questionId: 'q7',
      problemStatement: `Write a function that checks if a given string is a palindrome (reads the same forwards and backwards). Ignore spaces and case.

**Example:**
Input: "A man a plan a canal Panama"
Output: true

Input: "hello"
Output: false

**Constraints:**
- String length will be between 1 and 1000 characters`,
      primaryLanguage: 'javascript',
    },
    {
      questionId: 'q12',
      problemStatement: `Given an array of integers and a target value, find two numbers in the array that add up to the target. Return their indices.

**Example:**
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)

**Constraints:**
- Each input has exactly one solution
- You cannot use the same element twice
- Array length is at least 2`,
      primaryLanguage: 'javascript',
    },
    {
      questionId: 'q13',
      problemStatement: `Write a function that reverses a given string.

**Example:**
Input: "hello"
Output: "olleh"

**Constraints:**
- String length will be between 0 and 1000 characters`,
      primaryLanguage: 'javascript',
    },
    {
      questionId: 'q18',
      problemStatement: `Write a function that prints numbers from 1 to n. But for multiples of 3, print "Fizz" instead of the number, and for multiples of 5, print "Buzz". For numbers which are multiples of both 3 and 5, print "FizzBuzz".

**Example:**
Input: n = 15
Output: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz

**Constraints:**
- 1 <= n <= 100`,
      primaryLanguage: 'python',
    },
  ],

  // ==================== Starter Codes ====================
  starterCodes: [
    // Array Sum (q6)
    { id: 'sc1', codingProblemId: 'q6', language: 'javascript', code: `function arraySum(arr) {\n  // Write your code here\n\n}` },
    { id: 'sc2', codingProblemId: 'q6', language: 'python', code: `def array_sum(arr):\n    # Write your code here\n    pass` },
    { id: 'sc3', codingProblemId: 'q6', language: 'cpp', code: `#include <vector>\nusing namespace std;\n\nint arraySum(vector<int> arr) {\n    // Write your code here\n\n}` },
    { id: 'sc4', codingProblemId: 'q6', language: 'java', code: `public class Solution {\n    public static int arraySum(int[] arr) {\n        // Write your code here\n\n    }\n}` },

    // Palindrome Checker (q7)
    { id: 'sc5', codingProblemId: 'q7', language: 'javascript', code: `function isPalindrome(str) {\n  // Write your code here\n\n}` },
    { id: 'sc6', codingProblemId: 'q7', language: 'python', code: `def is_palindrome(s):\n    # Write your code here\n    pass` },
    { id: 'sc7', codingProblemId: 'q7', language: 'cpp', code: `#include <string>\nusing namespace std;\n\nbool isPalindrome(string str) {\n    // Write your code here\n\n}` },
    { id: 'sc8', codingProblemId: 'q7', language: 'java', code: `public class Solution {\n    public static boolean isPalindrome(String str) {\n        // Write your code here\n\n    }\n}` },

    // Two Sum (q12)
    { id: 'sc9', codingProblemId: 'q12', language: 'javascript', code: `function twoSum(nums, target) {\n  // Write your code here\n\n}` },
    { id: 'sc10', codingProblemId: 'q12', language: 'python', code: `def two_sum(nums, target):\n    # Write your code here\n    pass` },
    { id: 'sc11', codingProblemId: 'q12', language: 'cpp', code: `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n\n}` },
    { id: 'sc12', codingProblemId: 'q12', language: 'java', code: `public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your code here\n\n    }\n}` },

    // Reverse String (q13)
    { id: 'sc13', codingProblemId: 'q13', language: 'javascript', code: `function reverseString(str) {\n  // Write your code here\n\n}` },
    { id: 'sc14', codingProblemId: 'q13', language: 'python', code: `def reverse_string(s):\n    # Write your code here\n    pass` },
    { id: 'sc15', codingProblemId: 'q13', language: 'cpp', code: `#include <string>\nusing namespace std;\n\nstring reverseString(string str) {\n    // Write your code here\n\n}` },
    { id: 'sc16', codingProblemId: 'q13', language: 'java', code: `public class Solution {\n    public static String reverseString(String str) {\n        // Write your code here\n\n    }\n}` },

    // FizzBuzz (q18)
    { id: 'sc17', codingProblemId: 'q18', language: 'javascript', code: `function fizzBuzz(n) {\n  // Write your code here\n\n}` },
    { id: 'sc18', codingProblemId: 'q18', language: 'python', code: `def fizz_buzz(n):\n    # Write your code here\n    pass` },
  ],

  // ==================== Test Cases ====================
  testCases: [
    // Array Sum (q6)
    { id: 't1', codingProblemId: 'q6', input: '[1, 2, 3, 4, 5]', expectedOutput: '15', isHidden: false, displayOrder: 1 },
    { id: 't2', codingProblemId: 'q6', input: '[10, -5, 3]', expectedOutput: '8', isHidden: false, displayOrder: 2 },
    { id: 't3', codingProblemId: 'q6', input: '[100]', expectedOutput: '100', isHidden: true, displayOrder: 3 },

    // Palindrome Checker (q7)
    { id: 't4', codingProblemId: 'q7', input: 'racecar', expectedOutput: 'true', isHidden: false, displayOrder: 1 },
    { id: 't5', codingProblemId: 'q7', input: 'hello', expectedOutput: 'false', isHidden: false, displayOrder: 2 },
    { id: 't6', codingProblemId: 'q7', input: 'A man a plan a canal Panama', expectedOutput: 'true', isHidden: true, displayOrder: 3 },

    // Two Sum (q12)
    { id: 't7', codingProblemId: 'q12', input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false, displayOrder: 1 },
    { id: 't8', codingProblemId: 'q12', input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isHidden: false, displayOrder: 2 },
    { id: 't9', codingProblemId: 'q12', input: '[1, 5, 3, 7, 9], 12', expectedOutput: '[2, 4]', isHidden: true, displayOrder: 3 },

    // Reverse String (q13)
    { id: 't10', codingProblemId: 'q13', input: 'hello', expectedOutput: 'olleh', isHidden: false, displayOrder: 1 },
    { id: 't11', codingProblemId: 'q13', input: 'world', expectedOutput: 'dlrow', isHidden: false, displayOrder: 2 },
    { id: 't12', codingProblemId: 'q13', input: '', expectedOutput: '', isHidden: true, displayOrder: 3 },

    // FizzBuzz (q18)
    { id: 't13', codingProblemId: 'q18', input: '5', expectedOutput: '1, 2, Fizz, 4, Buzz', isHidden: false, displayOrder: 1 },
    { id: 't14', codingProblemId: 'q18', input: '15', expectedOutput: '1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz', isHidden: false, displayOrder: 2 },
  ],

  // ==================== Allowed Languages ====================
  allowedLanguages: [
    // Array Sum (q6)
    { id: 'al1', codingProblemId: 'q6', language: 'javascript' },
    { id: 'al2', codingProblemId: 'q6', language: 'python' },
    { id: 'al3', codingProblemId: 'q6', language: 'cpp' },
    { id: 'al4', codingProblemId: 'q6', language: 'java' },

    // Palindrome Checker (q7)
    { id: 'al5', codingProblemId: 'q7', language: 'javascript' },
    { id: 'al6', codingProblemId: 'q7', language: 'python' },
    { id: 'al7', codingProblemId: 'q7', language: 'cpp' },
    { id: 'al8', codingProblemId: 'q7', language: 'java' },

    // Two Sum (q12)
    { id: 'al9', codingProblemId: 'q12', language: 'javascript' },
    { id: 'al10', codingProblemId: 'q12', language: 'python' },
    { id: 'al11', codingProblemId: 'q12', language: 'cpp' },
    { id: 'al12', codingProblemId: 'q12', language: 'java' },

    // Reverse String (q13)
    { id: 'al13', codingProblemId: 'q13', language: 'javascript' },
    { id: 'al14', codingProblemId: 'q13', language: 'python' },
    { id: 'al15', codingProblemId: 'q13', language: 'cpp' },
    { id: 'al16', codingProblemId: 'q13', language: 'java' },

    // FizzBuzz (q18)
    { id: 'al17', codingProblemId: 'q18', language: 'javascript' },
    { id: 'al18', codingProblemId: 'q18', language: 'python' },
  ],

  // ==================== MCQ Problems ====================
  mcqProblems: [
    { questionId: 'q1', multipleAnswers: false },
    { questionId: 'q2', multipleAnswers: true },
    { questionId: 'q8', multipleAnswers: false },
    { questionId: 'q9', multipleAnswers: true },
    { questionId: 'q14', multipleAnswers: false },
  ],

  // ==================== MCQ Options ====================
  mcqOptions: [
    // q1
    { id: 'o1', mcqProblemId: 'q1', text: 'String', isCorrect: false, displayOrder: 1 },
    { id: 'o2', mcqProblemId: 'q1', text: 'Boolean', isCorrect: false, displayOrder: 2 },
    { id: 'o3', mcqProblemId: 'q1', text: 'Float', isCorrect: true, displayOrder: 3 },
    { id: 'o4', mcqProblemId: 'q1', text: 'Number', isCorrect: false, displayOrder: 4 },

    // q2
    { id: 'o5', mcqProblemId: 'q2', text: 'var x = 10;', isCorrect: true, displayOrder: 1 },
    { id: 'o6', mcqProblemId: 'q2', text: 'let x = 10;', isCorrect: true, displayOrder: 2 },
    { id: 'o7', mcqProblemId: 'q2', text: 'const x = 10;', isCorrect: true, displayOrder: 3 },
    { id: 'o8', mcqProblemId: 'q2', text: 'int x = 10;', isCorrect: false, displayOrder: 4 },

    // q8
    { id: 'o9', mcqProblemId: 'q8', text: 'O(1)', isCorrect: true, displayOrder: 1 },
    { id: 'o10', mcqProblemId: 'q8', text: 'O(n)', isCorrect: false, displayOrder: 2 },
    { id: 'o11', mcqProblemId: 'q8', text: 'O(log n)', isCorrect: false, displayOrder: 3 },
    { id: 'o12', mcqProblemId: 'q8', text: 'O(n²)', isCorrect: false, displayOrder: 4 },

    // q9
    { id: 'o13', mcqProblemId: 'q9', text: 'Stack', isCorrect: true, displayOrder: 1 },
    { id: 'o14', mcqProblemId: 'q9', text: 'Queue', isCorrect: false, displayOrder: 2 },
    { id: 'o15', mcqProblemId: 'q9', text: 'Recursion Call Stack', isCorrect: true, displayOrder: 3 },
    { id: 'o16', mcqProblemId: 'q9', text: 'Linked List', isCorrect: false, displayOrder: 4 },

    // q14
    { id: 'o17', mcqProblemId: 'q14', text: 'list = (1, 2, 3)', isCorrect: false, displayOrder: 1 },
    { id: 'o18', mcqProblemId: 'q14', text: 'list = [1, 2, 3]', isCorrect: true, displayOrder: 2 },
    { id: 'o19', mcqProblemId: 'q14', text: 'list = {1, 2, 3}', isCorrect: false, displayOrder: 3 },
    { id: 'o20', mcqProblemId: 'q14', text: 'list = <1, 2, 3>', isCorrect: false, displayOrder: 4 },
  ],

  // ==================== True/False Problems ====================
  trueFalseProblems: [
    { questionId: 'q3', correctAnswer: false },
    { questionId: 'q4', correctAnswer: true },
    { questionId: 'q10', correctAnswer: true },
    { questionId: 'q15', correctAnswer: true },
    { questionId: 'q16', correctAnswer: false },
  ],

  // ==================== Descriptive Problems ====================
  descriptiveProblems: [
    { questionId: 'q5', maxLength: 500 },
    { questionId: 'q11', maxLength: 800 },
    { questionId: 'q17', maxLength: 400 },
  ],
};
