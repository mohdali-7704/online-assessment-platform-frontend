import { judge0Client } from './axios-client';
import { getLanguageId } from '../utils/helpers';
import { CodeExecutionResult } from '../types/assessment';

interface SubmissionPayload {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface SubmissionResponse {
  token: string;
}

/**
 * Submit code to Judge0 for execution
 */
export async function submitCode(
  code: string,
  language: string,
  input?: string
): Promise<string> {
  try {
    const payload: SubmissionPayload = {
      source_code: btoa(code), // Base64 encode the source code
      language_id: getLanguageId(language),
    };

    if (input) {
      payload.stdin = btoa(input); // Base64 encode the input
    }

    const response = await judge0Client.post<SubmissionResponse>('/submissions', payload, {
      params: {
        base64_encoded: true,
        wait: false
      }
    });

    return response.data.token;
  } catch (error) {
    console.error('Failed to submit code:', error);
    throw new Error('Failed to submit code for execution');
  }
}

/**
 * Get submission result from Judge0
 */
export async function getSubmission(token: string): Promise<CodeExecutionResult> {
  try {
    const response = await judge0Client.get(`/submissions/${token}`, {
      params: {
        base64_encoded: true,
        fields: 'stdout,stderr,status,time,memory,compile_output'
      }
    });

    const data = response.data;

    return {
      stdout: data.stdout ? atob(data.stdout) : null,
      stderr: data.stderr ? atob(data.stderr) : null,
      compile_output: data.compile_output ? atob(data.compile_output) : null,
      status: data.status,
      time: data.time,
      memory: data.memory
    };
  } catch (error) {
    console.error('Failed to get submission:', error);
    throw new Error('Failed to get code execution result');
  }
}

/**
 * Submit code and wait for result (with polling)
 */
export async function submitAndGetResult(
  code: string,
  language: string,
  input?: string,
  maxAttempts: number = 10
): Promise<CodeExecutionResult> {
  const token = await submitCode(code, language, input);

  // Poll for result
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

    const result = await getSubmission(token);

    // Status ID 1 = In Queue, 2 = Processing
    if (result.status.id !== 1 && result.status.id !== 2) {
      return result;
    }
  }

  throw new Error('Code execution timed out');
}

/**
 * Wrap user code with stdin reading and function calling logic
 */
function wrapCodeWithStdin(code: string, language: string, functionName: string): string {
  // Extract function name from code if not provided
  if (!functionName) {
    const match = code.match(/function\s+(\w+)\s*\(|def\s+(\w+)\s*\(|int\s+(\w+)\s*\(|public\s+static\s+\w+\s+(\w+)\s*\(/);
    functionName = match ? (match[1] || match[2] || match[3] || match[4]) : 'solution';
  }

  switch (language.toLowerCase()) {
    case 'javascript':
      return `${code}

// Read from stdin and call the function
const input = require('fs').readFileSync(0, 'utf-8').trim();
const arr = JSON.parse(input);
const result = ${functionName}(arr);
console.log(result);`;

    case 'python':
      return `${code}

# Read from stdin and call the function
import sys
import json
input_data = sys.stdin.read().strip()
arr = json.loads(input_data)
result = ${functionName}(arr)
print(result)`;

    case 'cpp':
      // For C++, we can't easily parse JSON, so we'll expect space-separated numbers
      return `${code}

#include <iostream>
#include <sstream>
#include <vector>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    // Remove brackets and parse numbers
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());

    vector<int> arr;
    stringstream ss(line);
    int num;
    char comma;
    while (ss >> num) {
        arr.push_back(num);
        ss >> comma; // skip comma
    }

    cout << ${functionName}(arr) << endl;
    return 0;
}`;

    case 'java':
      return `${code}

import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine().trim();

        // Remove brackets and split by comma
        input = input.replace("[", "").replace("]", "");
        String[] parts = input.split(",");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            arr[i] = Integer.parseInt(parts[i].trim());
        }

        System.out.println(Solution.${functionName}(arr));
    }
}`;

    default:
      return code;
  }
}

/**
 * Run code against test cases
 */
export async function runTestCases(
  code: string,
  language: string,
  testCases: Array<{ input: string; expectedOutput: string }>,
  functionName?: string
): Promise<Array<{
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  input: string;
  error?: string;
}>> {
  const results = [];

  // Wrap the code to read from stdin and call the function
  const wrappedCode = wrapCodeWithStdin(code, language, functionName || '');

  for (const testCase of testCases) {
    try {
      const result = await submitAndGetResult(wrappedCode, language, testCase.input);

      const actualOutput = (result.stdout || '').trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = actualOutput === expectedOutput && result.status.id === 3; // Status 3 = Accepted

      results.push({
        passed,
        actualOutput,
        expectedOutput,
        input: testCase.input,
        error: result.stderr || result.compile_output || undefined
      });
    } catch (error) {
      results.push({
        passed: false,
        actualOutput: '',
        expectedOutput: testCase.expectedOutput,
        input: testCase.input,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

/**
 * Get supported languages from Judge0
 */
export async function getSupportedLanguages(): Promise<Array<{ id: number; name: string }>> {
  try {
    const response = await judge0Client.get('/languages');
    return response.data;
  } catch (error) {
    console.error('Failed to get supported languages:', error);
    return [];
  }
}
