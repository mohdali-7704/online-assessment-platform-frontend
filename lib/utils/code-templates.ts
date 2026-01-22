/**
 * Code Template Generation Utilities
 * Inspired by LeetCode/HackerRank approach to auto-generate starter code for multiple languages
 */

export interface FunctionSignature {
  name: string;
  parameters: string[];
  returnType?: string;
}

/**
 * Detects function signature from problem statement or existing code
 */
export function detectFunctionSignature(text: string): FunctionSignature | null {
  // Try to detect from common patterns in problem statements
  const patterns = [
    // "Write a function called arraySum that takes..."
    /function\s+(?:called\s+)?(\w+)\s+(?:that\s+)?takes?\s+(?:an?\s+)?(\w+)/i,
    // "Implement arraySum(arr)"
    /implement\s+(\w+)\s*\(([^)]*)\)/i,
    // "Create a function isPalindrome"
    /create\s+(?:a\s+)?function\s+(\w+)/i,
    // Existing function signature
    /function\s+(\w+)\s*\(([^)]*)\)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1];
      const params = match[2] ? match[2].split(',').map(p => p.trim().split(/\s+/).pop() || 'param') : ['arr'];
      return { name, parameters: params.filter(p => p) };
    }
  }

  // Default fallback
  return {
    name: 'solution',
    parameters: ['input']
  };
}

/**
 * Generates starter code template for a given language
 */
export function generateStarterCode(
  language: string,
  functionName: string = 'solution',
  parameters: string[] = ['input'],
  returnType?: string
): string {
  const paramList = parameters.join(', ');

  switch (language) {
    case 'javascript':
      return `function ${functionName}(${paramList}) {
  // Write your code here
  return null;
}`;

    case 'python':
      const pythonParams = parameters.map(p => convertToSnakeCase(p)).join(', ');
      const pythonFuncName = convertToSnakeCase(functionName);
      return `def ${pythonFuncName}(${pythonParams}):
    # Write your code here
    pass`;

    case 'cpp':
      return `#include <vector>
#include <string>
using namespace std;

auto ${functionName}(${paramList}) {
    // Write your code here

}`;

    case 'java':
      const javaReturnType = returnType || 'Object';
      return `public class Solution {
    public static ${javaReturnType} ${functionName}(${paramList}) {
        // Write your code here
        return null;
    }
}`;

    default:
      return `// Starter code for ${language}\nfunction ${functionName}(${paramList}) {\n  // Write your code here\n}`;
  }
}

/**
 * Extracts function information from existing code
 */
export function extractFunctionFromCode(code: string, language: string): FunctionSignature | null {
  switch (language) {
    case 'javascript':
      const jsMatch = code.match(/function\s+(\w+)\s*\(([^)]*)\)/);
      if (jsMatch) {
        return {
          name: jsMatch[1],
          parameters: jsMatch[2].split(',').map(p => p.trim()).filter(p => p)
        };
      }
      break;

    case 'python':
      const pyMatch = code.match(/def\s+(\w+)\s*\(([^)]*)\)/);
      if (pyMatch) {
        return {
          name: pyMatch[1],
          parameters: pyMatch[2].split(',').map(p => p.trim().split(':')[0].trim()).filter(p => p)
        };
      }
      break;

    case 'cpp':
      const cppMatch = code.match(/(?:auto|int|bool|string|vector<\w+>|float|double)\s+(\w+)\s*\(([^)]*)\)/);
      if (cppMatch) {
        return {
          name: cppMatch[1],
          parameters: cppMatch[2].split(',').map(p => {
            const parts = p.trim().split(/\s+/);
            return parts[parts.length - 1];
          }).filter(p => p)
        };
      }
      break;

    case 'java':
      const javaMatch = code.match(/(?:public\s+)?(?:static\s+)?(?:\w+)\s+(\w+)\s*\(([^)]*)\)/);
      if (javaMatch) {
        return {
          name: javaMatch[1],
          parameters: javaMatch[2].split(',').map(p => {
            const parts = p.trim().split(/\s+/);
            return parts[parts.length - 1];
          }).filter(p => p)
        };
      }
      break;
  }

  return null;
}

/**
 * Translates starter code from one language to another
 */
export function translateStarterCode(
  sourceCode: string,
  fromLanguage: string,
  toLanguage: string
): string {
  // Extract function signature from source
  const signature = extractFunctionFromCode(sourceCode, fromLanguage);

  if (!signature) {
    // Fallback: generate default starter code
    return generateStarterCode(toLanguage);
  }

  // Generate equivalent code in target language
  return generateStarterCode(
    toLanguage,
    signature.name,
    signature.parameters,
    signature.returnType
  );
}

/**
 * Generates starter code for all specified languages
 */
export function generateAllStarterCode(
  primaryLanguage: string,
  primaryCode: string,
  targetLanguages: string[]
): Record<string, string> {
  const result: Record<string, string> = {
    [primaryLanguage]: primaryCode
  };

  // Extract signature from primary code
  const signature = extractFunctionFromCode(primaryCode, primaryLanguage);

  if (signature) {
    // Generate for other languages based on the primary
    targetLanguages.forEach(lang => {
      if (lang !== primaryLanguage) {
        result[lang] = generateStarterCode(
          lang,
          signature.name,
          signature.parameters,
          signature.returnType
        );
      }
    });
  } else {
    // Fallback: generate default for each language
    targetLanguages.forEach(lang => {
      if (lang !== primaryLanguage) {
        result[lang] = generateStarterCode(lang);
      }
    });
  }

  return result;
}

/**
 * Suggests function name based on problem statement
 */
export function suggestFunctionName(problemStatement: string): string {
  const detected = detectFunctionSignature(problemStatement);
  return detected?.name || 'solution';
}

/**
 * Suggests parameters based on problem statement
 */
export function suggestParameters(problemStatement: string): string[] {
  const detected = detectFunctionSignature(problemStatement);
  return detected?.parameters || ['input'];
}

/**
 * Helper: Convert camelCase to snake_case for Python
 */
function convertToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

/**
 * Helper: Convert snake_case to camelCase for JavaScript
 */
function convertToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Gets appropriate default return value based on language
 */
export function getDefaultReturnValue(language: string, returnType?: string): string {
  switch (language) {
    case 'javascript':
      return 'null';
    case 'python':
      return 'pass';
    case 'cpp':
      return '';
    case 'java':
      return 'null';
    default:
      return '';
  }
}

/**
 * Validates if code has a proper function signature
 */
export function hasValidFunctionSignature(code: string, language: string): boolean {
  const signature = extractFunctionFromCode(code, language);
  return signature !== null && signature.name.length > 0;
}
