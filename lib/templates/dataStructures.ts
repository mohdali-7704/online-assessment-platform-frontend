/**
 * Data Structure Templates for LeetCode-Style Questions
 *
 * This file contains pre-written class definitions and serialization/deserialization
 * functions for common data structures (Linked Lists, Binary Trees, etc.) across
 * multiple programming languages.
 */

export const DATA_STRUCTURE_TEMPLATES = {
  javascript: {
    ListNode: `
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     constructor(val, next = null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Deserialize array to linked list
 * @param {number[]} arr - Array to convert
 * @return {ListNode} - Head of linked list
 */
function deserializeLinkedList(arr) {
  if (!arr || arr.length === 0) return null;

  let head = new ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return head;
}

/**
 * Serialize linked list to array
 * @param {ListNode} head - Head of linked list
 * @return {number[]} - Array representation
 */
function serializeLinkedList(head) {
  const result = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}
`,

    TreeNode: `
/**
 * Definition for binary tree node.
 * class TreeNode {
 *     constructor(val, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Deserialize array to binary tree (level-order)
 * @param {(number|null)[]} arr - Array in level-order with nulls
 * @return {TreeNode} - Root of tree
 */
function deserializeTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;

  let root = new TreeNode(arr[0]);
  let queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    let node = queue.shift();

    // Left child
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;

    // Right child
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

/**
 * Serialize binary tree to array (level-order)
 * @param {TreeNode} root - Root of tree
 * @return {(number|null)[]} - Array in level-order
 */
function serializeTree(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    let node = queue.shift();

    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  // Remove trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}
`
  },

  python: {
    ListNode: `
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def deserialize_linked_list(arr):
    """
    Deserialize array to linked list

    Args:
        arr: List of integers
    Returns:
        ListNode: Head of linked list
    """
    if not arr:
        return None

    head = ListNode(arr[0])
    current = head

    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next

    return head

def serialize_linked_list(head):
    """
    Serialize linked list to array

    Args:
        head: ListNode, head of linked list
    Returns:
        List[int]: Array representation
    """
    result = []
    current = head

    while current:
        result.append(current.val)
        current = current.next

    return result
`,

    TreeNode: `
# Definition for binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def deserialize_tree(arr):
    """
    Deserialize array to binary tree (level-order)

    Args:
        arr: List in level-order with None for missing nodes
    Returns:
        TreeNode: Root of tree
    """
    if not arr or arr[0] is None:
        return None

    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1

    while queue and i < len(arr):
        node = queue.popleft()

        # Left child
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1

        # Right child
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1

    return root

def serialize_tree(root):
    """
    Serialize binary tree to array (level-order)

    Args:
        root: TreeNode, root of tree
    Returns:
        List: Array in level-order
    """
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        node = queue.popleft()

        if node is None:
            result.append(None)
        else:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)

    # Remove trailing None values
    while result and result[-1] is None:
        result.pop()

    return result
`
  },

  cpp: {
    ListNode: `
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */

#include <vector>
#include <sstream>
#include <iostream>

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* deserializeLinkedList(std::vector<int>& arr) {
    if (arr.empty()) return nullptr;

    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;

    for (size_t i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }

    return head;
}

std::vector<int> serializeLinkedList(ListNode* head) {
    std::vector<int> result;
    ListNode* current = head;

    while (current) {
        result.push_back(current->val);
        current = current->next;
    }

    return result;
}
`,

    TreeNode: `
/**
 * Definition for binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */

#include <vector>
#include <queue>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

TreeNode* deserializeTree(std::vector<int>& arr) {
    if (arr.empty() || arr[0] == -1) return nullptr;

    TreeNode* root = new TreeNode(arr[0]);
    std::queue<TreeNode*> queue;
    queue.push(root);
    size_t i = 1;

    while (!queue.empty() && i < arr.size()) {
        TreeNode* node = queue.front();
        queue.pop();

        // Left child
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            queue.push(node->left);
        }
        i++;

        // Right child
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            queue.push(node->right);
        }
        i++;
    }

    return root;
}

std::vector<int> serializeTree(TreeNode* root) {
    std::vector<int> result;
    if (!root) return result;

    std::queue<TreeNode*> queue;
    queue.push(root);

    while (!queue.empty()) {
        TreeNode* node = queue.front();
        queue.pop();

        if (node == nullptr) {
            result.push_back(-1);
        } else {
            result.push_back(node->val);
            queue.push(node->left);
            queue.push(node->right);
        }
    }

    // Remove trailing -1 values
    while (!result.empty() && result.back() == -1) {
        result.pop_back();
    }

    return result;
}
`
  },

  java: {
    ListNode: `
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class LinkedListHelper {
    public static ListNode deserializeLinkedList(int[] arr) {
        if (arr == null || arr.length == 0) return null;

        ListNode head = new ListNode(arr[0]);
        ListNode current = head;

        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }

        return head;
    }

    public static int[] serializeLinkedList(ListNode head) {
        List<Integer> result = new ArrayList<>();
        ListNode current = head;

        while (current != null) {
            result.add(current.val);
            current = current.next;
        }

        return result.stream().mapToInt(i -> i).toArray();
    }
}
`,

    TreeNode: `
/**
 * Definition for binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class TreeHelper {
    public static TreeNode deserializeTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;

        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;

        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();

            // Left child
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;

            // Right child
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }

        return root;
    }

    public static List<Integer> serializeTree(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();

            if (node == null) {
                result.add(null);
            } else {
                result.add(node.val);
                queue.offer(node.left);
                queue.offer(node.right);
            }
        }

        // Remove trailing nulls
        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }

        return result;
    }
}
`
  }
};

/**
 * Get data structure template code for a specific language
 * @param language - Programming language (javascript, python, cpp, java)
 * @param dataStructureType - Type of data structure (ListNode, TreeNode)
 * @returns Template code string
 */
export function getDataStructureCode(
  language: string,
  dataStructureType: 'ListNode' | 'TreeNode'
): string {
  const templates = DATA_STRUCTURE_TEMPLATES[language as keyof typeof DATA_STRUCTURE_TEMPLATES];
  return templates?.[dataStructureType] || '';
}
