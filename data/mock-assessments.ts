import { QuestionType } from '@/lib/types/question';
import { Assessment, AssessmentSection } from '@/lib/types/assessment';

// Original mock assessments - keeping this as the main export for now
// TODO: Migrate to normalized structure after testing
export const mockAssessments: Assessment[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals Assessment',
    description: 'Test your knowledge of core JavaScript concepts including data types, functions, and problem-solving skills.',
    duration: 45,
    totalPoints: 100,
    createdAt: '2024-01-15T10:00:00Z',
    sections: [
      {
        id: 'section-mcq',
        name: 'Multiple Choice Questions',
        questionType: QuestionType.MCQ,
        duration: 10,
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
          }
        ]
      },
      {
        id: 'section-tf',
        name: 'True/False Questions',
        questionType: QuestionType.TRUE_FALSE,
        duration: 5,
        questions: [
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
          }
        ]
      },
      {
        id: 'section-desc',
        name: 'Descriptive Questions',
        questionType: QuestionType.DESCRIPTIVE,
        duration: 10,
        questions: [
          {
            id: 'q5',
            type: QuestionType.DESCRIPTIVE,
            text: 'Explain the difference between "null" and "undefined" in JavaScript.',
            points: 15,
            maxLength: 500
          }
        ]
      },
      {
        id: 'section-coding',
        name: 'Coding Challenges',
        questionType: QuestionType.CODING,
        duration: 20,
        questions: [
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
      }
    ],
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
  },
  {
    id: '4',
    title: 'LeetCode-Style Data Structures',
    description: 'Master linked lists, binary trees, and advanced data structure problems with LeetCode-style questions.',
    duration: 90,
    totalPoints: 200,
    createdAt: '2024-01-18T10:00:00Z',
    questions: [
      {
        id: 'q1',
        type: QuestionType.CODING,
        text: 'Reverse Linked List',
        problemStatement: `Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example 1:**
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

**Example 2:**
Input: head = [1,2]
Output: [2,1]

**Example 3:**
Input: head = []
Output: []

**Constraints:**
- The number of nodes in the list is in the range [0, 5000]
- -5000 <= Node.val <= 5000`,
        points: 30,
        starterCode: {
          javascript: `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     constructor(val, next = null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Write your code here

}`,
          python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverse_list(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    # Write your code here
    pass`
        },
        testCases: [
          {
            id: 't1',
            input: '[1,2,3,4,5]',
            expectedOutput: '[5,4,3,2,1]',
            isHidden: false,
            inputType: 'linkedlist',
            outputType: 'linkedlist'
          },
          {
            id: 't2',
            input: '[1,2]',
            expectedOutput: '[2,1]',
            isHidden: false,
            inputType: 'linkedlist',
            outputType: 'linkedlist'
          },
          {
            id: 't3',
            input: '[]',
            expectedOutput: '[]',
            isHidden: true,
            inputType: 'linkedlist',
            outputType: 'linkedlist'
          },
          {
            id: 't4',
            input: '[1]',
            expectedOutput: '[1]',
            isHidden: true,
            inputType: 'linkedlist',
            outputType: 'linkedlist'
          }
        ],
        allowedLanguages: ['javascript', 'python'],
        functionName: 'reverseList'
      },
      {
        id: 'q2',
        type: QuestionType.CODING,
        text: 'Merge Two Sorted Lists',
        problemStatement: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Example 1:**
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

**Example 2:**
Input: list1 = [], list2 = []
Output: []

**Example 3:**
Input: list1 = [], list2 = [0]
Output: [0]

**Constraints:**
- The number of nodes in both lists is in the range [0, 50]
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order`,
        points: 40,
        starterCode: {
          javascript: `/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
    // Write your code here

}`,
          python: `def merge_two_lists(list1, list2):
    """
    :type list1: ListNode
    :type list2: ListNode
    :rtype: ListNode
    """
    # Write your code here
    pass`
        },
        testCases: [
          {
            id: 't1',
            input: '[[1,2,4], [1,3,4]]',
            expectedOutput: '[1,1,2,3,4,4]',
            isHidden: false,
            inputType: 'linkedlist-pair',
            outputType: 'linkedlist'
          },
          {
            id: 't2',
            input: '[[], []]',
            expectedOutput: '[]',
            isHidden: false,
            inputType: 'linkedlist-pair',
            outputType: 'linkedlist'
          },
          {
            id: 't3',
            input: '[[], [0]]',
            expectedOutput: '[0]',
            isHidden: true,
            inputType: 'linkedlist-pair',
            outputType: 'linkedlist'
          },
          {
            id: 't4',
            input: '[[1,3,5], [2,4,6]]',
            expectedOutput: '[1,2,3,4,5,6]',
            isHidden: true,
            inputType: 'linkedlist-pair',
            outputType: 'linkedlist'
          }
        ],
        allowedLanguages: ['javascript', 'python'],
        functionName: 'mergeTwoLists'
      },
      {
        id: 'q3',
        type: QuestionType.CODING,
        text: 'Linked List Cycle Detection',
        problemStatement: `Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Return true if there is a cycle in the linked list. Otherwise, return false.

**Example 1:**
Input: head = [3,2,0,-4] (cycle at position 1)
Output: true

**Example 2:**
Input: head = [1,2] (cycle at position 0)
Output: true

**Example 3:**
Input: head = [1]
Output: false

**Note:** For this implementation, we'll test with lists without cycles since cycle creation requires special handling.

**Constraints:**
- The number of nodes in the list is in the range [0, 10^4]
- -10^5 <= Node.val <= 10^5`,
        points: 35,
        starterCode: {
          javascript: `/**
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
    // Write your code here

}`,
          python: `def has_cycle(head):
    """
    :type head: ListNode
    :rtype: bool
    """
    # Write your code here
    pass`
        },
        testCases: [
          {
            id: 't1',
            input: '[1,2,3,4,5]',
            expectedOutput: 'false',
            isHidden: false,
            inputType: 'linkedlist',
            outputType: 'boolean'
          },
          {
            id: 't2',
            input: '[1]',
            expectedOutput: 'false',
            isHidden: false,
            inputType: 'linkedlist',
            outputType: 'boolean'
          },
          {
            id: 't3',
            input: '[]',
            expectedOutput: 'false',
            isHidden: true,
            inputType: 'linkedlist',
            outputType: 'boolean'
          }
        ],
        allowedLanguages: ['javascript', 'python'],
        functionName: 'hasCycle'
      },
      {
        id: 'q4',
        type: QuestionType.CODING,
        text: 'Maximum Depth of Binary Tree',
        problemStatement: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

**Example 1:**
Input: root = [3,9,20,null,null,15,7]
Output: 3
Explanation: The tree looks like:
    3
   / \\
  9  20
    /  \\
   15   7

**Example 2:**
Input: root = [1,null,2]
Output: 2

**Example 3:**
Input: root = []
Output: 0

**Constraints:**
- The number of nodes in the tree is in the range [0, 10^4]
- -100 <= Node.val <= 100`,
        points: 45,
        starterCode: {
          javascript: `/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxDepth(root) {
    // Write your code here

}`,
          python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def max_depth(root):
    """
    :type root: TreeNode
    :rtype: int
    """
    # Write your code here
    pass`
        },
        testCases: [
          {
            id: 't1',
            input: '[3,9,20,null,null,15,7]',
            expectedOutput: '3',
            isHidden: false,
            inputType: 'tree',
            outputType: 'number'
          },
          {
            id: 't2',
            input: '[1,null,2]',
            expectedOutput: '2',
            isHidden: false,
            inputType: 'tree',
            outputType: 'number'
          },
          {
            id: 't3',
            input: '[]',
            expectedOutput: '0',
            isHidden: true,
            inputType: 'tree',
            outputType: 'number'
          },
          {
            id: 't4',
            input: '[1]',
            expectedOutput: '1',
            isHidden: true,
            inputType: 'tree',
            outputType: 'number'
          }
        ],
        allowedLanguages: ['javascript', 'python'],
        functionName: 'maxDepth'
      },
      {
        id: 'q5',
        type: QuestionType.CODING,
        text: 'Invert Binary Tree',
        problemStatement: `Given the root of a binary tree, invert the tree, and return its root.

**Example 1:**
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Visual representation:
Before:
     4
   /   \\
  2     7
 / \\   / \\
1   3 6   9

After:
     4
   /   \\
  7     2
 / \\   / \\
9   6 3   1

**Example 2:**
Input: root = [2,1,3]
Output: [2,3,1]

**Example 3:**
Input: root = []
Output: []

**Constraints:**
- The number of nodes in the tree is in the range [0, 100]
- -100 <= Node.val <= 100`,
        points: 50,
        starterCode: {
          javascript: `/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function invertTree(root) {
    // Write your code here

}`,
          python: `def invert_tree(root):
    """
    :type root: TreeNode
    :rtype: TreeNode
    """
    # Write your code here
    pass`
        },
        testCases: [
          {
            id: 't1',
            input: '[4,2,7,1,3,6,9]',
            expectedOutput: '[4,7,2,9,6,3,1]',
            isHidden: false,
            inputType: 'tree',
            outputType: 'tree'
          },
          {
            id: 't2',
            input: '[2,1,3]',
            expectedOutput: '[2,3,1]',
            isHidden: false,
            inputType: 'tree',
            outputType: 'tree'
          },
          {
            id: 't3',
            input: '[]',
            expectedOutput: '[]',
            isHidden: true,
            inputType: 'tree',
            outputType: 'tree'
          },
          {
            id: 't4',
            input: '[1]',
            expectedOutput: '[1]',
            isHidden: true,
            inputType: 'tree',
            outputType: 'tree'
          }
        ],
        allowedLanguages: ['javascript', 'python'],
        functionName: 'invertTree'
      }
    ]
  }
];

// Helper function to get assessment by ID
// Helper function to get custom assessments from localStorage
function getCustomAssessments(): Assessment[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('custom_assessments');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom assessments:', error);
    return [];
  }
}

export function getAssessmentById(id: string): Assessment | undefined {
  const allAssessments = getAllAssessments();
  return allAssessments.find(assessment => assessment.id === id);
}

// Helper function to get all assessments (mock + custom)
export function getAllAssessments(): Assessment[] {
  const customAssessments = getCustomAssessments();
  return [...mockAssessments, ...customAssessments];
}
