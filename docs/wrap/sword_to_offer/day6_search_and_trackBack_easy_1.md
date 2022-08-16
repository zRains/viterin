---
date: 1648916124000
title: 'D6 - 搜索与回溯算法1（简单）'
order: 6
visible: true
lang: 'zh'
layout: 'doc'
---

## [剑指 Offer 32 - I. 从上到下打印二叉树](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

### 描述

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

### 解答

题目要求的二叉树的 从上至下 打印（即按层打印），又称为二叉树的 广度优先搜索（BFS）。BFS 通常借助 队列 的先入先出特性来实现。

思路是维护一个节点列表`cache`，每次取最后一个（pop）节点，并检测是否存在左右子节点，如果存在，依次放入列表头部，遍历整个数组直到为空。效率有亿点低哈。。。

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function (root) {
  const result = []
  if (!root) {
    return result
  }
  const cache = [root]
  while (cache.length !== 0) {
    const node = cache.pop()
    if (node.left) cache.unshift(node.left)
    if (node.right) cache.unshift(node.right)
    result.push(node.val)
  }
  return result
}
```

---

## [剑指 Offer 32 - II. 从上到下打印二叉树 II](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/)

### 描述

从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。

### 解答

和上一题不同的是，我们需要记录层数，我就想到可以用递归传递层数，每个节点完成时层数加 1，后面遍历到的子节点可以通过层数索引将值添加进去。

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function (root, result = [], depth = 0) {
  if (!root) {
    return result
  }
  if (result[depth]) {
    result[depth].push(root.val)
  } else {
    result[depth] = [root.val]
  }
  if (root.left) levelOrder(root.left, result, depth + 1)
  if (root.right) levelOrder(root.right, result, depth + 1)
  return result
}
```

---

## [剑指 Offer 32 - III. 从上到下打印二叉树 III](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof/)

### 描述

请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

### 解答

还真是玩出花儿了。不过这个有上面一题的参考，可以简单改一下：

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function (root, result = [], depth = 0) {
  if (!root) {
    return result
  }
  if (result[depth]) {
    depth % 2 === 0 ? result[depth].push(root.val) : result[depth].unshift(root.val)
  } else {
    result[depth] = [root.val]
  }
  if (root.left) levelOrder(root.left, result, depth + 1)
  if (root.right) levelOrder(root.right, result, depth + 1)
  return result
}
```

但我第一次尝试的并不是上面这种，而是：

```javascript
if (depth % 2 !== 0) {
  if (root.left) levelOrder(root.left, result, depth + 1)
  if (root.right) levelOrder(root.right, result, depth + 1)
} else {
  if (root.right) levelOrder(root.right, result, depth + 1)
  if (root.left) levelOrder(root.left, result, depth + 1)
}
```

这个就有一个问题了，看似利用了`depth`，但判断时仍用的`if (root.right)`为依据。就如下面这种结构：

```text
    3
   / \
  9   5
 /     \
6       7
```

`5`子节点没有左子节点，在`push`时仍是直接放到结果数组之后。
