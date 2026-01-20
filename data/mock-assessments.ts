import { Assessment, QuestionType } from '@/lib/types/question';

export const mockAssessments: Assessment[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals Assessment',
    description: 'Test your knowledge of core JavaScript concepts including data types, functions, and problem-solving skills.',
    duration: 45,
    totalPoints: 100,
    createdAt: '2024-01-15T10:00:00Z',
    questions: [
      {
        id: 'q1',
        type: QuestionType.MCQ,
        text: 'Which of the following is NOT a JavaScript data type?',
        points: 10,
        options: [
          { id: 'a', text: 'String' },
          { id: 'b', text: 'Boolean' },
          { id: 'c', text: 'Float' },
          { id: 'd', text: 'Number' }
        ],
        correctAnswers: ['c'],
        multipleAnswers: false
      },
      {
        id: 'q2',
        type: QuestionType.MCQ,
        text: 'Which of the following are valid ways to declare a variable in JavaScript? (Select all that apply)',
        points: 15,
        options: [
          { id: 'a', text: 'var x = 10;' },
          { id: 'b', text: 'let x = 10;' },
          { id: 'c', text: 'const x = 10;' },
          { id: 'd', text: 'int x = 10;' }
        ],
        correctAnswers: ['a', 'b', 'c'],
        multipleAnswers: true
      },
      {
        id: 'q3',
        type: QuestionType.TRUE_FALSE,
        text: 'JavaScript is a statically typed language.',
        points: 5,
        correctAnswer: false
      },
      {
        id: 'q4',
        type: QuestionType.TRUE_FALSE,
        text: 'The === operator checks both value and type in JavaScript.',
        points: 5,
        correctAnswer: true
      },
      {
        id: 'q5',
        type: QuestionType.DESCRIPTIVE,
        text: 'Explain the difference between "null" and "undefined" in JavaScript.',
        points: 15,
        maxLength: 500
      },
      {
        id: 'q6',
        type: QuestionType.CODING,
        text: 'Array Sum',
        problemStatement: `Write a function that takes an array of numbers and returns their sum.

**Example:**
Input: [1, 2, 3, 4, 5]
Output: 15

**Constraints:**
- The array will contain at least 1 element
- All elements will be integers`,
        points: 25,
        starterCode: {
          javascript: `function arraySum(arr) {
  // Write your code here

}`,
          python: `def array_sum(arr):
    # Write your code here
    pass`,
          cpp: `#include <vector>
using namespace std;

int arraySum(vector<int> arr) {
    // Write your code here

}`,
          java: `public class Solution {
    public static int arraySum(int[] arr) {
        // Write your code here

    }
}`
        },
        testCases: [
          {
            id: 't1',
            input: '[1, 2, 3, 4, 5]',
            expectedOutput: '15',
            isHidden: false
          },
          {
            id: 't2',
            input: '[10, -5, 3]',
            expectedOutput: '8',
            isHidden: false
          },
          {
            id: 't3',
            input: '[100]',
            expectedOutput: '100',
            isHidden: true
          }
        ],
        allowedLanguages: ['javascript', 'python', 'cpp', 'java']
      },
      {
        id: 'q7',
        type: QuestionType.CODING,
        text: 'Palindrome Checker',
        problemStatement: `Write a function that checks if a given string is a palindrome (reads the same forwards and backwards). Ignore spaces and case.

**Example:**
Input: "A man a plan a canal Panama"
Output: true

Input: "hello"
Output: false

**Constraints:**
- String length will be between 1 and 1000 characters`,
        points: 25,
        starterCode: {
          javascript: `function isPalindrome(str) {
  // Write your code here

}`,
          python: `def is_palindrome(s):
    # Write your code here
    pass`,
          cpp: `#include <string>
using namespace std;

bool isPalindrome(string str) {
    // Write your code here

}`,
          java: `public class Solution {
    public static boolean isPalindrome(String str) {
        // Write your code here

    }
}`
        },
        testCases: [
          {
            id: 't1',
            input: 'racecar',
            expectedOutput: 'true',
            isHidden: false
          },
          {
            id: 't2',
            input: 'hello',
            expectedOutput: 'false',
            isHidden: false
          },
          {
            id: 't3',
            input: 'A man a plan a canal Panama',
            expectedOutput: 'true',
            isHidden: true
          }
        ],
        allowedLanguages: ['javascript', 'python', 'cpp', 'java']
      }
    ]
  },
  {
    id: '2',
    title: 'Data Structures & Algorithms',
    description: 'Advanced assessment covering arrays, strings, and algorithmic thinking.',
    duration: 60,
    totalPoints: 150,
    createdAt: '2024-01-16T10:00:00Z',
    questions: [
      {
        id: 'q1',
        type: QuestionType.MCQ,
        text: 'What is the time complexity of accessing an element in an array by index?',
        points: 10,
        options: [
          { id: 'a', text: 'O(1)' },
          { id: 'b', text: 'O(n)' },
          { id: 'c', text: 'O(log n)' },
          { id: 'd', text: 'O(n²)' }
        ],
        correctAnswers: ['a'],
        multipleAnswers: false
      },
      {
        id: 'q2',
        type: QuestionType.MCQ,
        text: 'Which data structures use LIFO (Last In First Out) principle? (Select all that apply)',
        points: 10,
        options: [
          { id: 'a', text: 'Stack' },
          { id: 'b', text: 'Queue' },
          { id: 'c', text: 'Recursion Call Stack' },
          { id: 'd', text: 'Linked List' }
        ],
        correctAnswers: ['a', 'c'],
        multipleAnswers: true
      },
      {
        id: 'q3',
        type: QuestionType.TRUE_FALSE,
        text: 'A binary search algorithm requires the input array to be sorted.',
        points: 10,
        correctAnswer: true
      },
      {
        id: 'q4',
        type: QuestionType.DESCRIPTIVE,
        text: 'Explain the difference between BFS (Breadth-First Search) and DFS (Depth-First Search) graph traversal algorithms.',
        points: 20,
        maxLength: 800
      },
      {
        id: 'q5',
        type: QuestionType.CODING,
        text: 'Two Sum Problem',
        problemStatement: `Given an array of integers and a target value, find two numbers in the array that add up to the target. Return their indices.

**Example:**
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)

**Constraints:**
- Each input has exactly one solution
- You cannot use the same element twice
- Array length is at least 2`,
        points: 50,
        starterCode: {
          javascript: `function twoSum(nums, target) {
  // Write your code here

}`,
          python: `def two_sum(nums, target):
    # Write your code here
    pass`,
          cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here

}`,
          java: `public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here

    }
}`
        },
        testCases: [
          {
            id: 't1',
            input: '[2, 7, 11, 15], 9',
            expectedOutput: '[0, 1]',
            isHidden: false
          },
          {
            id: 't2',
            input: '[3, 2, 4], 6',
            expectedOutput: '[1, 2]',
            isHidden: false
          },
          {
            id: 't3',
            input: '[1, 5, 3, 7, 9], 12',
            expectedOutput: '[2, 4]',
            isHidden: true
          }
        ],
        allowedLanguages: ['javascript', 'python', 'cpp', 'java']
      },
      {
        id: 'q6',
        type: QuestionType.CODING,
        text: 'Reverse a String',
        problemStatement: `Write a function that reverses a given string.

**Example:**
Input: "hello"
Output: "olleh"

**Constraints:**
- String length will be between 0 and 1000 characters`,
        points: 50,
        starterCode: {
          javascript: `function reverseString(str) {
  // Write your code here

}`,
          python: `def reverse_string(s):
    # Write your code here
    pass`,
          cpp: `#include <string>
using namespace std;

string reverseString(string str) {
    // Write your code here

}`,
          java: `public class Solution {
    public static String reverseString(String str) {
        // Write your code here

    }
}`
        },
        testCases: [
          {
            id: 't1',
            input: 'hello',
            expectedOutput: 'olleh',
            isHidden: false
          },
          {
            id: 't2',
            input: 'world',
            expectedOutput: 'dlrow',
            isHidden: false
          },
          {
            id: 't3',
            input: '',
            expectedOutput: '',
            isHidden: true
          }
        ],
        allowedLanguages: ['javascript', 'python', 'cpp', 'java']
      }
    ]
  },
  {
    id: '3',
    title: 'Python Basics Quiz',
    description: 'Quick assessment on Python fundamentals, syntax, and basic programming concepts.',
    duration: 30,
    totalPoints: 80,
    createdAt: '2024-01-17T10:00:00Z',
    questions: [
      {
        id: 'q1',
        type: QuestionType.MCQ,
        text: 'Which of the following is the correct way to create a list in Python?',
        points: 10,
        options: [
          { id: 'a', text: 'list = (1, 2, 3)' },
          { id: 'b', text: 'list = [1, 2, 3]' },
          { id: 'c', text: 'list = {1, 2, 3}' },
          { id: 'd', text: 'list = <1, 2, 3>' }
        ],
        correctAnswers: ['b'],
        multipleAnswers: false
      },
      {
        id: 'q2',
        type: QuestionType.TRUE_FALSE,
        text: 'Python is an interpreted language.',
        points: 5,
        correctAnswer: true
      },
      {
        id: 'q3',
        type: QuestionType.TRUE_FALSE,
        text: 'In Python, indentation is optional and only used for readability.',
        points: 5,
        correctAnswer: false
      },
      {
        id: 'q4',
        type: QuestionType.DESCRIPTIVE,
        text: 'What are list comprehensions in Python? Provide an example.',
        points: 20,
        maxLength: 400
      },
      {
        id: 'q5',
        type: QuestionType.CODING,
        text: 'FizzBuzz',
        problemStatement: `Write a function that prints numbers from 1 to n. But for multiples of 3, print "Fizz" instead of the number, and for multiples of 5, print "Buzz". For numbers which are multiples of both 3 and 5, print "FizzBuzz".

**Example:**
Input: n = 15
Output: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz

**Constraints:**
- 1 <= n <= 100`,
        points: 40,
        starterCode: {
          javascript: `function fizzBuzz(n) {
  // Write your code here

}`,
          python: `def fizz_buzz(n):
    # Write your code here
    pass`
        },
        testCases: [
          {
            id: 't1',
            input: '5',
            expectedOutput: '1, 2, Fizz, 4, Buzz',
            isHidden: false
          },
          {
            id: 't2',
            input: '15',
            expectedOutput: '1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz',
            isHidden: false
          }
        ],
        allowedLanguages: ['javascript', 'python']
      }
    ]
  }
];

// Helper function to get assessment by ID
export function getAssessmentById(id: string): Assessment | undefined {
  return mockAssessments.find(assessment => assessment.id === id);
}

// Helper function to get all assessments
export function getAllAssessments(): Assessment[] {
  return mockAssessments;
}
